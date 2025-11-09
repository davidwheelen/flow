/**
 * Polling Service
 * 
 * Manages periodic API polling with rate limiting (20 req/sec max).
 * Polls for device status, WAN, bandwidth, cellular, and PepVPN data.
 */

import { authService } from './authService';
import { PeplinkDevice, ConnectionType, ConnectionStatus, LanClient } from '@/types/network.types';
import { IC2DeviceData, IC2Interface } from '@/types/incontrol.types';

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
   * Fetch LAN clients for a device from InControl API
   */
  private async fetchLanClients(deviceId: string, groupId: string): Promise<LanClient[]> {
    const apiClient = authService.getApiClient();
    const credentials = authService.getCredentials();
    
    if (!credentials) {
      console.warn('No credentials available for fetching LAN clients');
      return [];
    }

    const orgId = credentials.orgId;
    
    try {
      const response = await this.rateLimiter.throttle(() =>
        apiClient.get<{ data: Array<{ mac: string; sn?: string; ip: string; name: string }> }>(
          `/rest/o/${orgId}/g/${groupId}/d/${deviceId}/clients`
        )
      );

      return response.data.data.map((client) => ({
        mac: client.mac,
        sn: client.sn, // Serial number if this client is a Peplink device
        ip: client.ip,
        name: client.name
      }));
    } catch (error) {
      console.error(`Failed to fetch LAN clients for device ${deviceId}:`, error);
      return [];
    }
  }

  /**
   * Build connection graph by detecting all connection types
   */
  private buildConnectionGraph(devices: PeplinkDevice[]): void {
    // First identify all Balance devices
    const balanceDevices = devices.filter(d => 
      d.model.toLowerCase().includes('balance') || 
      d.model.toLowerCase().includes('b20x')
    );

    // Then for each Balance device, check its LAN clients
    balanceDevices.forEach(balanceDevice => {
      // Find devices that should be connected to this Balance device's LAN
      const connectedDevices = devices.filter(d =>
        d.id !== balanceDevice.id && // Not the same device
        d.connections.some(c => c.type === 'wan' && c.status === 'connected') // Has active WAN
      );

      // Create connections for each connected device
      connectedDevices.forEach(connectedDevice => {
        // Create LAN connection from Balance to device
        this.createDeviceConnection(balanceDevice, connectedDevice, 'lan');
        
        // Create WAN connection from device to Balance
        this.createDeviceConnection(connectedDevice, balanceDevice, 'wan');
      });
    });

    // Handle AP WiFi mesh connections
    devices.forEach(sourceDevice => {
      const isAP = sourceDevice.model.toLowerCase().includes('ap one') || 
                   sourceDevice.model.toLowerCase().includes('ap pro');
                   
      if (isAP && sourceDevice.status === 'online') {
        // Find potential mesh connections for online APs
        const meshConnectedDevices = devices.filter(targetDevice => 
          targetDevice.id !== sourceDevice.id &&
          (targetDevice.model.toLowerCase().includes('balance') || // Connect to routers
           targetDevice.model.toLowerCase().includes('ap')) && // or other APs
          targetDevice.status === 'online'
        );
        
        meshConnectedDevices.forEach(targetDevice => {
          // Create WiFi mesh connection
          this.createDeviceConnection(sourceDevice, targetDevice, 'wifi');
        });
      }
    });

    console.log('Connection graph built:', devices.map(d => ({
      name: d.name,
      connections: d.connections.map(c => ({
        type: c.type,
        status: c.status,
        device_id: c.device_id
      }))
    })));
  }

  /**
   * Create device connection
   */
  private createDeviceConnection(
    source: PeplinkDevice,
    target: PeplinkDevice,
    type: ConnectionType
  ): void {
    const connectionId = `${source.id}-to-${target.id}-${type}`;
    
    // Don't create duplicate connections
    if (source.connections.some(c => c.id === connectionId)) {
      return;
    }

    source.connections.push({
      id: connectionId,
      type,
      status: 'connected',
      device_id: target.id,
      metrics: {
        speedMbps: 1000,
        latencyMs: 1,
        uploadMbps: 500,
        downloadMbps: 500
      }
    });

    console.log(`Created ${type} connection: ${source.name} -> ${target.name}`);
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
      this.fetchDeviceDetails(String(device.id), groupId)
    );

    const devicesData = await Promise.all(deviceDataPromises);

    // FETCH LAN CLIENTS FOR EACH DEVICE
    const deviceWithClientsPromises = devicesData.map(async (device) => {
      const lanClients = await this.fetchLanClients(String(device.id), groupId);
      return { ...device, lanClients };
    });

    const devicesWithClients = await Promise.all(deviceWithClientsPromises);

    // Map to PeplinkDevice format
    const mappedDevices = devicesWithClients.map((deviceData, index) => 
      this.mapDevice(deviceData, index)
    );

    // BUILD CONNECTION GRAPH
    this.buildConnectionGraph(mappedDevices);

    console.log(`Built connection graph for ${mappedDevices.length} devices`);

    return mappedDevices;
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

    return deviceResponse.data.data;
  }

  /**
   * Get AP frequencies from interface
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getAPFrequencies(_iface: IC2Interface): string[] {
    // For now, return empty array. This can be extended when API provides frequency data
    return [];
  }

  /**
   * Get AP SSIDs from interface
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getAPSSIDs(_iface: IC2Interface): Array<{ name: string; security: string }> {
    // For now, return empty array. This can be extended when API provides SSID data
    return [];
  }

  /**
   * Get connected clients count from interface
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getConnectedClients(_iface: IC2Interface): number {
    // For now, return 0. This can be extended when API provides client count data
    return 0;
  }

  /**
   * Map AP interface with display name and metrics
   */
  private mapAPInterface(iface: IC2Interface): IC2Interface & {
    displayName: string;
    frequencies: string[];
    ssids: Array<{ name: string; security: string }>;
    clientCount: number;
    metrics: {
      latency: number;
      uploadSpeed: number;
      downloadSpeed: number;
    };
  } {
    return {
      ...iface,
      displayName: 'Wireless Mesh',
      frequencies: this.getAPFrequencies(iface),
      ssids: this.getAPSSIDs(iface),
      clientCount: this.getConnectedClients(iface),
      metrics: {
        latency: iface.latency_ms ?? 0,
        uploadSpeed: iface.upload_mbps ?? 0,
        downloadSpeed: iface.download_mbps ?? 0
      }
    };
  }

  /**
   * Map IC2DeviceData to PeplinkDevice
   */
  private mapDevice(device: IC2DeviceData, index: number): PeplinkDevice {
    const connections: PeplinkDevice['connections'] = [];

    // Create a map of interface ID to MAC address for efficient lookup
    const macAddressMap = new Map<number, string>();
    device.mac_info?.forEach(macInfo => {
      if (macInfo.connId !== undefined && macInfo.mac) {
        macAddressMap.set(macInfo.connId, macInfo.mac);
      }
    });

    // First check if this is an AP device
    const isAccessPoint = device.model.toLowerCase().includes('ap one') || 
                         device.model.toLowerCase().includes('ap pro');

    // Map LAN interfaces first
    device.interfaces?.forEach((iface) => {
      if (iface.type === 'lan' || iface.name?.toLowerCase().includes('lan')) {
        connections.push({
          id: `${device.id}-lan-${iface.id}`,
          type: 'lan',
          status: 'connected',
          metrics: {
            speedMbps: iface.speed_mbps || 1000,
            latencyMs: 1,
            uploadMbps: 500,
            downloadMbps: 500
          }
        });
      }
    });

    // For APs, check both hardwired WAN and WiFi mesh connections
    device.interfaces?.forEach((iface) => {
      if (iface.type !== 'lan' && !iface.name?.toLowerCase().includes('lan')) {
        let connType: ConnectionType;
        let connStatus: ConnectionStatus = 'disconnected';
        
        // Determine interface type
        if (isAccessPoint) {
          if (iface.type === 'ethernet' && iface.name?.toLowerCase().includes('wan')) {
            // AP's ethernet WAN port
            connType = 'wan';
          } else if (iface.type === 'wifi' || iface.type === 'wlan' || iface.name?.toLowerCase().includes('wireless')) {
            // AP's WiFi mesh connection
            connType = 'wifi';
            // For APs, if device is online and has a WiFi interface, consider it connected
            if (device.status?.toLowerCase() === 'online') {
              connStatus = 'connected';
            }
          } else {
            return; // Skip other interface types for APs
          }
        } else {
          // Regular device interface handling
          connType = 'wan';
          if (iface.virtualType === 'cellular' || iface.type === 'gobi') {
            connType = 'cellular';
          } else if (iface.type === 'wifi' || iface.type === 'wlan') {
            connType = 'wifi';
          } else if (iface.type === 'sfp') {
            connType = 'sfp';
          }
        }
        
        // Set connection status based on device type and interface
        if (!isAccessPoint) {
          // Regular device - use interface status
          connStatus = iface.status?.toLowerCase() === 'connected' ? 'connected' : 'disconnected';
        } else if (device.status?.toLowerCase() !== 'online') {
          // AP is offline - all connections disconnected
          connStatus = 'disconnected';
        }

        connections.push({
          id: `${device.id}-${connType}-${iface.id}`,
          type: connType,
          status: connStatus,
          metrics: {
            speedMbps: iface.speed_mbps || 0,
            latencyMs: iface.latency_ms || 0,
            uploadMbps: iface.upload_mbps || 0,
            downloadMbps: iface.download_mbps || 0
          },
          wanDetails: {
            id: String(iface.id),
            name: iface.name || `${connType.toUpperCase()} ${iface.id}`,
            type: iface.type || 'ethernet',
            status: connStatus,
            ipAddress: iface.ip || '',
            macAddress: macAddressMap.get(iface.id)
          }
        });
      }
    });

    // Map PepVPN connections as SFP type with device_id for topology
    device.pepvpn?.forEach((vpn, i) => {
      connections.push({
        id: `${device.id}-pepvpn-${i}`,
        type: 'sfp',
        status: vpn.status === 'connected' ? 'connected' : 'disconnected',
        device_id: vpn.remote_device_id, // Include remote device ID for topology
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
      id: String(device.id),
      name: device.name || device.sn,
      model: device.product_name || device.model || 'Unknown',
      serial: device.sn,
      firmware_version: device.fw_ver,
      status: device.status, // Use device-level status from API
      ipAddress: device.interfaces?.[0]?.ip || '',
      connections,
      position,
      lanClients: (device as IC2DeviceData & { lanClients?: LanClient[] }).lanClients || [], // Include LAN clients
      interfaces: device.interfaces?.map(iface => {
        // For AP wifi interfaces, use mapAPInterface to add display name and metrics
        if (isAccessPoint && (iface.type === 'wifi' || iface.type === 'wlan' || iface.name?.toLowerCase().includes('wireless'))) {
          return {
            ...this.mapAPInterface(iface),
            mac_address: macAddressMap.get(iface.id)
          };
        }
        // For other interfaces, just add MAC address
        return {
          ...iface,
          mac_address: macAddressMap.get(iface.id)
        };
      }),
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
