/**
 * Polling Service
 * 
 * Manages periodic API polling with rate limiting (20 req/sec max).
 * Polls for device status, WAN, bandwidth, cellular, and PepVPN data.
 */

import { authService } from './authService';
import { PeplinkDevice } from '@/types/network.types';

/**
 * Rate limiter to ensure we don't exceed 20 req/sec
 */
class RateLimiter {
  private queue: Array<() => void> = [];
  private requestTimes: number[] = [];
  private readonly maxRequestsPerSecond = 20;
  private processing = false;

  /**
   * Add request to queue
   */
  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * Process queued requests with rate limiting
   */
  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      
      // Remove request times older than 1 second
      this.requestTimes = this.requestTimes.filter(time => now - time < 1000);

      // Wait if we've hit the rate limit
      if (this.requestTimes.length >= this.maxRequestsPerSecond) {
        const oldestRequest = this.requestTimes[0];
        const waitTime = 1000 - (now - oldestRequest) + 10; // Add 10ms buffer
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      // Process next request
      const request = this.queue.shift();
      if (request) {
        this.requestTimes.push(Date.now());
        request();
      }
    }

    this.processing = false;
  }
}

/**
 * Device data from InControl2 API
 */
export interface IC2DeviceData {
  id: string;
  name: string;
  model: string;
  ip_address: string;
  status: {
    online: boolean;
    last_seen: string;
  };
  wans?: Array<{
    id: string;
    name: string;
    type?: string; // Connection type: 'ethernet', 'cellular', etc.
    status: 'connected' | 'disconnected';
    ip_address?: string;
    speed_mbps?: number;
    latency_ms?: number;
    upload_mbps?: number;
    download_mbps?: number;
    signal_strength?: number;
    carrier?: string;
  }>;
  cellular?: Array<{
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
    signal_strength?: number;
    speed_mbps?: number;
    latency_ms?: number;
    upload_mbps?: number;
    download_mbps?: number;
    carrier?: string;
  }>;
  bandwidth?: {
    total_upload_mbps: number;
    total_download_mbps: number;
  };
  pepvpn?: Array<{
    id: string;
    remote_name: string;
    status: 'connected' | 'disconnected';
    throughput_mbps?: number;
  }>;
}

/**
 * Polling Service
 */
export class PollingService {
  private intervalId: number | null = null;
  private readonly pollInterval = 30000; // 30 seconds
  private rateLimiter = new RateLimiter();
  private onUpdate: ((devices: PeplinkDevice[]) => void) | null = null;
  private onError: ((error: Error) => void) | null = null;
  private groupId: string | null = null;

  /**
   * Start polling for device updates
   */
  start(
    groupId: string,
    onUpdate: (devices: PeplinkDevice[]) => void,
    onError: (error: Error) => void
  ): void {
    this.stop(); // Stop any existing polling

    this.groupId = groupId;
    this.onUpdate = onUpdate;
    this.onError = onError;

    // Initial fetch
    this.poll();

    // Start periodic polling
    this.intervalId = window.setInterval(() => {
      this.poll();
    }, this.pollInterval);
  }

  /**
   * Stop polling
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.groupId = null;
    this.onUpdate = null;
    this.onError = null;
  }

  /**
   * Poll API for device updates
   */
  private async poll(): Promise<void> {
    if (!this.groupId || !this.onUpdate) {
      return;
    }

    try {
      const devices = await this.fetchDevices(this.groupId);
      this.onUpdate(devices);
    } catch (error) {
      console.error('Polling error:', error);
      if (this.onError) {
        this.onError(error as Error);
      }
    }
  }

  /**
   * Fetch devices with all data
   */
  private async fetchDevices(groupId: string): Promise<PeplinkDevice[]> {
    const apiClient = authService.getApiClient();
    const credentials = authService.getCredentials();
    
    if (!credentials) {
      throw new Error('Not authenticated');
    }

    // Correct InControl2 API endpoint for fetching devices in a group
    const devicesResponse = await this.rateLimiter.throttle(() =>
      apiClient.get<{ data: IC2DeviceData[] }>(
        `/rest/o/${credentials.orgId}/g/${groupId}/d`
      )
    );

    const devices = devicesResponse.data.data || [];

    // Fetch detailed status for each device in parallel (with rate limiting)
    const deviceDataPromises = devices.map(device =>
      this.fetchDeviceDetails(device.id, groupId)
    );

    const devicesData = await Promise.all(deviceDataPromises);

    // Map to PeplinkDevice format
    return devicesData.map((deviceData, index) => this.mapDevice(deviceData, index));
  }

  /**
   * Fetch detailed device information
   */
  private async fetchDeviceDetails(deviceId: string, groupId: string): Promise<IC2DeviceData> {
    const apiClient = authService.getApiClient();
    const credentials = authService.getCredentials();
    
    if (!credentials) {
      throw new Error('Not authenticated');
    }

    const orgId = credentials.orgId;
    
    // Single endpoint returns ALL device data
    const deviceResponse = await this.rateLimiter.throttle(() =>
      apiClient.get<{ data: IC2DeviceData }>(
        `/rest/o/${orgId}/g/${groupId}/d/${deviceId}`
      )
    );

    const deviceData = deviceResponse.data.data;

    // Extract and partition WAN connections (cellular vs non-cellular)
    const wanConnections = deviceData.wans || [];
    const wans: typeof wanConnections = [];
    const cellular: typeof wanConnections = [];
    
    wanConnections.forEach((conn) => {
      if (conn.type === 'cellular') {
        cellular.push(conn);
      } else {
        wans.push(conn);
      }
    });

    return {
      ...deviceData,
      wans,
      cellular,
    };
  }

  /**
   * Map IC2DeviceData to PeplinkDevice
   */
  private mapDevice(device: IC2DeviceData, index: number): PeplinkDevice {
    const connections: PeplinkDevice['connections'] = [];

    // Map WAN connections
    device.wans?.forEach((wan, i) => {
      connections.push({
        id: `${device.id}-wan-${i}`,
        type: 'wan',
        status: wan.status === 'connected' ? 'connected' : 'disconnected',
        metrics: {
          speedMbps: wan.speed_mbps || 0,
          latencyMs: wan.latency_ms || 0,
          uploadMbps: wan.upload_mbps || 0,
          downloadMbps: wan.download_mbps || 0,
        },
      });
    });

    // Map Cellular connections
    device.cellular?.forEach((cell, i) => {
      connections.push({
        id: `${device.id}-cellular-${i}`,
        type: 'cellular',
        status: cell.status === 'connected' ? 'connected' : 'disconnected',
        metrics: {
          speedMbps: cell.speed_mbps || 0,
          latencyMs: cell.latency_ms || 0,
          uploadMbps: cell.upload_mbps || 0,
          downloadMbps: cell.download_mbps || 0,
        },
      });
    });

    // Map PepVPN connections as SFP type
    device.pepvpn?.forEach((vpn, i) => {
      connections.push({
        id: `${device.id}-pepvpn-${i}`,
        type: 'sfp',
        status: vpn.status === 'connected' ? 'connected' : 'disconnected',
        metrics: {
          speedMbps: vpn.throughput_mbps || 0,
          latencyMs: 0,
          uploadMbps: 0,
          downloadMbps: 0,
        },
      });
    });

    // Calculate position (will be overridden by layout engine)
    const position = {
      x: (index % 3) * 200 + 100,
      y: Math.floor(index / 3) * 200 + 100,
    };

    return {
      id: device.id,
      name: device.name || `Device ${device.id}`,
      model: device.model || 'Unknown',
      ipAddress: device.ip_address || '0.0.0.0',
      connections,
      position,
    };
  }

  /**
   * Check if currently polling
   */
  isPolling(): boolean {
    return this.intervalId !== null;
  }
}

// Singleton instance
export const pollingService = new PollingService();
