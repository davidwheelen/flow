/**
 * Polling Service
 * 
 * Manages periodic API polling with rate limiting (20 req/sec max).
 * Polls for device status, WAN, bandwidth, cellular, and PepVPN data.
 */

import { authService } from './authService';
import { PeplinkDevice, ConnectionType, ConnectionStatus, LanClient } from '@/types/network.types';
import { IC2DeviceData } from '@/types/incontrol.types';

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
    // Process each device pair only once (avoiding duplicate processing)
    for (let i = 0; i < devices.length; i++) {
      for (let j = i + 1; j < devices.length; j++) {
        const sourceDevice = devices[i];
        const targetDevice = devices[j];
        
        // Check if devices are connected via any mechanism
        const isConnected = this.checkDeviceConnection(sourceDevice, targetDevice);
        
        if (isConnected) {
          // Create bi-directional connection with proper type
          this.createDeviceConnection(sourceDevice, targetDevice, isConnected.type);
        }
      }
    }
  }

  /**
   * Check if two devices are connected
   */
  private checkDeviceConnection(source: PeplinkDevice, target: PeplinkDevice): 
    { type: ConnectionType } | null {
    // Check LAN/WAN connections
    if (this.isLANWANConnection(source, target)) {
      return { type: source.model.includes('AP') ? 'lan' : 'wan' };
    }
    
    // Check wireless mesh
    if (this.isWirelessMeshConnection(source, target)) {
      return { type: 'wifi' };
    }
    
    // Check PepVPN
    if (this.isPepVPNConnection(source, target)) {
      return { type: 'sfp' };
    }
    
    return null;
  }

  /**
   * Check if devices are connected via LAN/WAN
   */
  private isLANWANConnection(source: PeplinkDevice, target: PeplinkDevice): boolean {
    // Check if target device is in source's LAN clients
    if (source.lanClients && source.lanClients.length > 0) {
      const matchingClient = source.lanClients.find(client => {
        // Match by serial number (most reliable)
        if (client.sn && target.serial === client.sn) {
          return true;
        }
        
        // Match by MAC address on any interface
        if (client.mac && target.interfaces) {
          return target.interfaces.some(iface => 
            iface.mac_address?.toLowerCase() === client.mac.toLowerCase()
          );
        }
        
        return false;
      });
      
      if (matchingClient) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Check if devices are connected via wireless mesh
   */
  private isWirelessMeshConnection(source: PeplinkDevice, target: PeplinkDevice): boolean {
    // Check if both devices are APs
    if (!source.model.includes('AP') || !target.model.includes('AP')) {
      return false;
    }
    
    // Check if they have WiFi interfaces
    const sourceHasWifi = source.interfaces?.some(iface => 
      iface.type === 'wifi' || iface.type === 'wlan'
    ) || false;
    const targetHasWifi = target.interfaces?.some(iface => 
      iface.type === 'wifi' || iface.type === 'wlan'
    ) || false;
    
    return sourceHasWifi && targetHasWifi;
  }

  /**
   * Check if devices are connected via PepVPN
   */
  private isPepVPNConnection(source: PeplinkDevice, target: PeplinkDevice): boolean {
    // Check if source has a PepVPN connection to target
    return source.connections.some(conn => 
      conn.type === 'sfp' && conn.device_id === target.id
    );
  }

  /**
   * Create device connection with proper bi-directional setup
   */
  private createDeviceConnection(source: PeplinkDevice, target: PeplinkDevice, type: ConnectionType): void {
    const connectionId = `${type}-${source.id}-to-${target.id}`;
    
    if (!source.connections.find(c => c.id === connectionId)) {
      source.connections.push({
        id: connectionId,
        type,
        status: 'connected',
        device_id: target.id,
        metrics: {
          speedMbps: 0,
          latencyMs: 0,
          uploadMbps: 0,
          downloadMbps: 0
        }
      });
      
      console.log(`Created ${type} connection: ${source.name} -> ${target.name}`);
    }
    
    // Create reverse connection for bi-directionality
    const reverseConnectionId = `${type}-${target.id}-to-${source.id}`;
    
    if (!target.connections.find(c => c.id === reverseConnectionId)) {
      target.connections.push({
        id: reverseConnectionId,
        type,
        status: 'connected',
        device_id: source.id,
        metrics: {
          speedMbps: 0,
          latencyMs: 0,
          uploadMbps: 0,
          downloadMbps: 0
        }
      });
      
      console.log(`Created reverse ${type} connection: ${target.name} -> ${source.name}`);
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

    // InControl uses 'interfaces' array, not 'wans'
    device.interfaces?.forEach((iface) => {
      // Determine connection type from interface type
      let connType: ConnectionType = 'wan';
      if (iface.virtualType === 'cellular' || iface.type === 'gobi') {
        connType = 'cellular';
      } else if (iface.type === 'wifi' || iface.type === 'wlan') {
        connType = 'wifi';
      } else if (iface.type === 'sfp') {
        connType = 'sfp';
      }

      // Map interface status to connection status (case-insensitive)
      let connStatus: ConnectionStatus = 'disconnected';
      let wanStatus: 'connected' | 'disconnected' | 'standby' = 'disconnected';
      const ifaceStatus = iface.status?.toLowerCase();
      if (ifaceStatus === 'connected') {
        connStatus = 'connected';
        wanStatus = 'connected';
      } else if (ifaceStatus === 'standby') {
        connStatus = 'degraded';
        wanStatus = 'standby';
      }

      // LOOKUP MAC ADDRESS FROM mac_info ARRAY BY MATCHING connId
      const macAddress = macAddressMap.get(iface.id);

      connections.push({
        id: `${device.id}-interface-${iface.id}`,
        type: connType,
        status: connStatus,
        metrics: {
          speedMbps: iface.speed_mbps || 0,
          latencyMs: iface.latency_ms || 0,
          uploadMbps: iface.upload_mbps || 0,
          downloadMbps: iface.download_mbps || 0,
        },
        wanDetails: {
          id: String(iface.id),
          name: iface.name || `Interface ${iface.id}`,
          type: iface.type || 'ethernet',
          status: wanStatus,
          ipAddress: iface.ip || '',
          subnetMask: iface.netmask,
          macAddress: macAddress, // USE MAC FROM mac_info LOOKUP
          gateway: iface.gateway,
          dnsServers: iface.dns_servers || [],
          connectionMethod: iface.conn_config_method || 'Unknown',
          routingMode: iface.conn_mode || 'NAT',
          mtu: iface.mtu,
          healthCheckMethod: iface.healthcheck,
          serviceProvider: iface.carrier_name,
        },
      });
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
      interfaces: device.interfaces?.map(iface => ({
        ...iface,
        mac_address: macAddressMap.get(iface.id) // ADD MAC ADDRESS from pre-built map
      })),
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
