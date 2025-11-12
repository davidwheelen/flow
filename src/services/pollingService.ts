/**
 * Polling Service
 * 
 * Manages periodic API polling with rate limiting (20 req/sec max).
 * Polls for device status, WAN, bandwidth, cellular, and PepVPN data.
 */

import { authService } from './authService';
import { PeplinkDevice, ConnectionType, ConnectionStatus, LanClient, Connection } from '@/types/network.types';
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
 * Helper: Get frequencies from AP interfaces
 */
function getAPFrequencies(interfaces: IC2DeviceData['interfaces']): string[] {
  if (!interfaces) return [];
  
  const frequencies: string[] = [];
  interfaces.forEach(iface => {
    if (iface.type === 'wifi' || iface.type === 'wlan' || iface.name?.toLowerCase().includes('wireless')) {
      // Extract frequency information if available in interface data
      // Common patterns: 2.4GHz, 5GHz, 6GHz
      const name = iface.name?.toLowerCase() || '';
      if (name.includes('2.4') || name.includes('2ghz')) {
        frequencies.push('2.4 GHz');
      } else if (name.includes('5') || name.includes('5ghz')) {
        frequencies.push('5 GHz');
      } else if (name.includes('6') || name.includes('6ghz')) {
        frequencies.push('6 GHz');
      } else {
        // Default if we can't determine from name
        frequencies.push('2.4/5 GHz');
      }
    }
  });
  
  return [...new Set(frequencies)]; // Remove duplicates
}

/**
 * Helper: Get security policy from interface
 */
function getSecurityPolicy(iface: IC2Interface): string {
  // Check for security information in interface data
  // Common security types: WPA2, WPA3, Open, etc.
  const name = iface.name?.toLowerCase() || '';
  
  if (name.includes('wpa3')) return 'WPA3';
  if (name.includes('wpa2')) return 'WPA2';
  if (name.includes('wpa')) return 'WPA';
  if (name.includes('open')) return 'Open';
  
  // Default to WPA2 as it's most common
  return 'WPA2/WPA3';
}

/**
 * Helper: Get SSIDs with security information from AP interfaces
 */
function getAPSSIDs(interfaces: IC2DeviceData['interfaces']): Array<{ name: string; security: string }> {
  if (!interfaces) return [];
  
  const ssids: Array<{ name: string; security: string }> = [];
  interfaces.forEach(iface => {
    if (iface.type === 'wifi' || iface.type === 'wlan' || iface.name?.toLowerCase().includes('wireless')) {
      const security = getSecurityPolicy(iface);
      // Extract SSID name from interface name or use generic name
      const ssidName = iface.name || `SSID-${iface.id}`;
      ssids.push({ name: ssidName, security });
    }
  });
  
  return ssids;
}

/**
 * Helper: Get connected clients count from LAN clients
 */
function getConnectedClients(lanClients?: LanClient[]): number {
  return lanClients?.length || 0;
}

/**
 * Helper: Convert netmask to CIDR notation
 */
function calculateCIDR(netmask: string): number {
  if (!netmask) return 24; // Default to /24
  
  const parts = netmask.split('.');
  let cidr = 0;
  
  for (const part of parts) {
    const num = parseInt(part, 10);
    cidr += (num >>> 0).toString(2).split('1').length - 1;
  }
  
  return cidr;
}

/**
 * Helper: Map AP interface with wireless mesh details
 */
function mapAPInterface(iface: IC2Interface, device: IC2DeviceData): Connection {
  const displayName = 'Wireless Mesh';
  const frequencies = getAPFrequencies(device.interfaces);
  const ssids = getAPSSIDs(device.interfaces);
  const clientCount = getConnectedClients((device as IC2DeviceData & { lanClients?: LanClient[] }).lanClients);
  
  return {
    id: `${device.id}-wifi-${iface.id}`,
    type: 'wifi',
    status: device.status?.toLowerCase() === 'online' ? 'connected' : 'disconnected',
    metrics: {
      speedMbps: iface.speed_mbps || 0,
      latencyMs: iface.latency_ms || 0,
      uploadMbps: iface.upload_mbps || 0,
      downloadMbps: iface.download_mbps || 0,
    },
    wanDetails: {
      id: String(iface.id),
      name: displayName,
      type: iface.type || 'wifi',
      status: device.status?.toLowerCase() === 'online' ? 'connected' : 'disconnected',
      ipAddress: iface.ip || '',
      macAddress: iface.mac_address,
    },
    apDetails: {
      displayName,
      frequencies,
      ssids,
      clientCount,
    },
  };
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
   * Fetch LAN port information using device API proxy
   * Uses the router's native API endpoint: GET /api/status.lan.profile
   */
  private async fetchLanPorts(deviceId: string): Promise<unknown> {
    const apiClient = authService.getApiClient();
    const credentials = authService.getCredentials();
    
    if (!credentials) {
      console.warn('No credentials available for fetching LAN ports');
      return null;
    }

    const orgId = credentials.orgId;
    
    try {
      // Use InControl2's device API proxy to call the router's native API
      // Format: /rest/o/{orgId}/d/{deviceId}/devapi/api/{router_api_endpoint}
      const response = await this.rateLimiter.throttle(() =>
        apiClient.get(
          `/rest/o/${orgId}/d/${deviceId}/devapi/api/status.lan.profile`
        )
      );

      console.log(`[DEBUG] LAN Port API response for device ${deviceId}:`, response.data);
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          console.warn(`[DEBUG] LAN port endpoint not found (404) for device ${deviceId} - device may not support this API`);
        } else {
          console.error(`[DEBUG] Failed to fetch LAN ports for device ${deviceId}:`, error);
        }
      } else {
        console.error(`[DEBUG] Failed to fetch LAN ports for device ${deviceId}:`, error);
      }
      return null;
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
    
    // Fetch device data and LAN ports in parallel
    const [deviceResponse, lanPortsData] = await Promise.all([
      this.rateLimiter.throttle(() =>
        apiClient.get<{ data: IC2DeviceData }>(
          `/rest/o/${orgId}/g/${groupId}/d/${deviceId}`
        )
      ),
      this.fetchLanPorts(deviceId)
    ]);

    const deviceData = deviceResponse.data.data;
    
    // Debug log to see if port_status exists
    console.log(`[DEBUG] Device ${deviceId} response keys:`, Object.keys(deviceData));
    if (deviceData.port_status) {
      console.log(`[DEBUG] Device ${deviceId} has port_status:`, deviceData.port_status);
    }
    
    // Add LAN ports data to device object if available
    if (lanPortsData) {
      (deviceData as IC2DeviceData & { lanPortsApi?: unknown }).lanPortsApi = lanPortsData;
      console.log(`[DEBUG] Added LAN ports data to device ${deviceId}`);
    }

    return deviceData;
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

    // First, try to map LAN ports from the device API proxy data
    const deviceWithLanApi = device as IC2DeviceData & { lanPortsApi?: unknown };
    if (deviceWithLanApi.lanPortsApi) {
      const lanData = deviceWithLanApi.lanPortsApi as Record<string, unknown>;
      console.log(`[DEBUG] Processing LAN ports API data for device ${device.name}:`, lanData);
      
      // The response structure will depend on what the API returns
      // We'll need to inspect the actual response to parse it correctly
      // Common patterns in Peplink APIs:
      // - { resp: { port: { "1": {...}, "2": {...} } } }
      // - { port: [ {...}, {...} ] }
      // - { lan_port: [ {...}, {...} ] }
      
      let ports: Array<Record<string, unknown>> = [];
      
      // Try to find the port data in the response
      const respData = lanData.resp as Record<string, unknown> | undefined;
      if (respData?.port) {
        // Object format: { "1": {...}, "2": {...} }
        const portObj = respData.port as Record<string, unknown>;
        ports = Object.entries(portObj).map(([id, data]) => ({ id, ...(data as Record<string, unknown>) }));
      } else if (lanData.port) {
        const portData = lanData.port;
        ports = Array.isArray(portData) ? portData : Object.entries(portData as Record<string, unknown>).map(([id, data]) => ({ id, ...(data as Record<string, unknown>) }));
      } else if (lanData.lan_port) {
        const lanPortData = lanData.lan_port;
        ports = Array.isArray(lanPortData) ? lanPortData : Object.entries(lanPortData as Record<string, unknown>).map(([id, data]) => ({ id, ...(data as Record<string, unknown>) }));
      } else if (Array.isArray(lanData)) {
        ports = lanData;
      }
      
      console.log(`[DEBUG] Extracted ${ports.length} LAN ports from API response`);
      
      ports.forEach((port: Record<string, unknown>, index: number) => {
        const portId = port.id || port.port_id || index + 1;
        const portName = String(port.name || port.port_name || `LAN Port ${portId}`);
        const isEnabled = port.enabled !== false && port.enable !== false;
        const isLinkUp = port.link_up === true || port.linkUp === true || port.link === 'up';
        const portStatus = isEnabled && isLinkUp ? 'connected' : isEnabled ? 'standby' : 'disabled';
        
        // Parse speed
        let speedMbps = 1000;
        if (port.speed) {
          const speedMatch = String(port.speed).match(/(\d+)/);
          if (speedMatch) {
            speedMbps = parseInt(speedMatch[1], 10);
          }
        }
        
        connections.push({
          id: `${device.id}-lan-port-${portId}`,
          type: 'lan',
          status: portStatus as ConnectionStatus,
          metrics: {
            speedMbps: speedMbps,
            latencyMs: 1,
            uploadMbps: isLinkUp ? speedMbps / 2 : 0,
            downloadMbps: isLinkUp ? speedMbps / 2 : 0
          },
          lanDetails: {
            portNumber: typeof portId === 'number' ? portId : parseInt(String(portId), 10),
            name: portName,
            status: portStatus,
            speed: String(port.speed || port.link_speed || 'Auto'),
            vlan: String(port.vlan || port.vlan_id || '-')
          }
        });
        
        console.log(`[DEBUG] Created LAN connection for port ${portId}:`, {
          name: portName,
          status: portStatus,
          speed: port.speed,
          isLinkUp
        });
      });
    }

    // Fallback: Check for port_status.lan_list (for private InControl2 instances)
    if (connections.filter(c => c.type === 'lan').length === 0 && device.port_status?.lan_list) {
      const lanPorts = device.port_status.lan_list;
      console.log(`[DEBUG] Found port_status.lan_list for device ${device.name}:`, lanPorts);
      
      // lan_list is an object with numeric keys: { "1": {...}, "2": {...}, ... }
      Object.entries(lanPorts).forEach(([portId, portData]) => {
        const isEnabled = portData.enable === true;
        const isLinkUp = portData.linkUp === true;
        const portStatus = isEnabled && isLinkUp ? 'connected' : isEnabled ? 'standby' : 'disabled';
        
        // Parse speed (e.g., "1000FD" -> 1000 Mbps)
        let speedMbps = 1000; // default
        if (portData.speed) {
          const speedMatch = portData.speed.match(/(\d+)/);
          if (speedMatch) {
            speedMbps = parseInt(speedMatch[1], 10);
          }
        }
        
        connections.push({
          id: `${device.id}-lan-port-${portId}`,
          type: 'lan',
          status: portStatus as ConnectionStatus,
          metrics: {
            speedMbps: speedMbps,
            latencyMs: 1,
            uploadMbps: isLinkUp ? speedMbps / 2 : 0,
            downloadMbps: isLinkUp ? speedMbps / 2 : 0
          },
          lanDetails: {
            portNumber: parseInt(portId, 10),
            name: portData.name || `LAN Port ${portId}`,
            status: portStatus,
            speed: portData.speed || 'Auto',
            vlan: portData.vlanMode || '-'
          }
        });
        
        console.log(`[DEBUG] Created LAN connection for port ${portId}:`, {
          name: portData.name,
          status: portStatus,
          speed: portData.speed,
          linkUp: isLinkUp
        });
      });
    }

    // Last fallback: Check interfaces array for LAN type
    if (connections.filter(c => c.type === 'lan').length === 0) {
      console.log(`[DEBUG] No LAN ports found via API, checking interfaces array...`);
      device.interfaces?.forEach((iface) => {
        // IMPORTANT: Exclude wovlan and wowlan types - these are WAN-over-LAN/WiFi, not LAN ports
        if (
          iface.type === 'lan' && 
          iface.virtualType !== 'wovlan' && 
          iface.virtualType !== 'wowlan'
        ) {
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
          console.log(`[DEBUG] Created LAN connection from interface:`, iface.name);
        }
      });
    }

    if (connections.filter(c => c.type === 'lan').length === 0) {
      console.log(`[DEBUG] No LAN ports found for device ${device.name}`);
    }

    // Add LAN Network section based on mac_info data
    const lanMacInfo = device.mac_info?.find((info) => info.interfaceType === 'lan');
    
    if (lanMacInfo) {
      // Get LAN VLAN info (usually VLAN 0)
      const lanVlan = device.vlan_interfaces?.find((vlan) => vlan.vlan_id === 0);
      
      connections.push({
        id: `${device.id}-lan-network`,
        type: 'lan',
        status: 'connected',
        metrics: {
          speedMbps: 1000,
          latencyMs: 1,
          uploadMbps: 0,
          downloadMbps: 0
        },
        lanDetails: {
          portNumber: 0, // 0 indicates this is the LAN network, not a physical port
          name: 'LAN Network',
          status: 'connected',
          mac: lanMacInfo.mac,
          ipRange: lanVlan ? `${lanVlan.vlan_ip}/${calculateCIDR(lanVlan.netmask || '')}` : 'N/A',
          gateway: lanVlan?.vlan_ip || 'N/A',
          clientCount: device.client_count || 0,
          vlanId: 0
        }
      });
      
      console.log(`[DEBUG] Created LAN Network connection for device ${device.name}:`, {
        mac: lanMacInfo.mac,
        ipRange: lanVlan ? `${lanVlan.vlan_ip}/${calculateCIDR(lanVlan.netmask || '')}` : 'N/A',
        clientCount: device.client_count
      });
    }

    // Process VLANs (skip VLAN 0 as it's included in LAN Network)
    if (device.vlan_interfaces) {
      device.vlan_interfaces.forEach((vlan) => {
        if (vlan.vlan_id === 0) return; // Skip VLAN 0, already shown in LAN Network
        
        connections.push({
          id: `${device.id}-vlan-${vlan.vlan_id}`,
          type: 'lan',
          status: 'connected',
          metrics: {
            speedMbps: 1000,
            latencyMs: 1,
            uploadMbps: 0,
            downloadMbps: 0
          },
          lanDetails: {
            portNumber: -1, // -1 indicates this is a VLAN, not a physical port
            name: `VLAN ${vlan.vlan_id}`,
            status: 'connected',
            ipRange: vlan.vlan_ips?.map((ip) => `${ip.ip}/${calculateCIDR(ip.netmask)}`).join(', ') || 
                     (vlan.vlan_ip ? `${vlan.vlan_ip}/${calculateCIDR(vlan.netmask || '')}` : 'N/A'),
            gateway: vlan.vlan_ip || 'N/A',
            vlanId: vlan.vlan_id
          }
        });
        
        console.log(`[DEBUG] Created VLAN ${vlan.vlan_id} connection for device ${device.name}`);
      });
    }


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
            // AP's WiFi mesh connection - use specialized mapper
            const mappedAPInterface = mapAPInterface(iface, device);
            connections.push(mappedAPInterface);
            return; // Skip regular mapping for AP WiFi interfaces
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
        // Debug: Log interface data to see what InControl2 is returning
        console.log(`[DEBUG] Device: ${device.name}, Interface:`, {
          id: iface.id,
          name: iface.name,
          type: iface.type,
          virtualType: iface.virtualType,
          status: iface.status
        });
        
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

  /**
   * Manually trigger a refresh (useful for on-demand updates)
   */
  async refresh(): Promise<void> {
    await this.poll();
  }
}

// Singleton instance
export const pollingService = new PollingService();
