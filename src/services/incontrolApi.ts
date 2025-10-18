import axios from 'axios';
import { PeplinkDevice, NetworkMetrics } from '@/types/network.types';
import { getMockGroups, getMockDevicesByGroup } from '@/utils/mockGroups';

/**
 * InControl API Configuration
 */
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_INCONTROL_API_URL || 'https://api.ic.peplink.com',
  clientId: import.meta.env.VITE_INCONTROL_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_INCONTROL_CLIENT_SECRET || '',
  timeout: 10000,
};

/**
 * Check if API is configured
 */
const isApiConfigured = API_CONFIG.clientId && API_CONFIG.clientSecret;

/**
 * API Client instance
 */
const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Auth token storage
 */
let authToken: string | null = null;

/**
 * Authenticate with InControl API
 */
export async function authenticate(): Promise<string> {
  try {
    const response = await apiClient.post('/api/oauth2/token', {
      grant_type: 'client_credentials',
      client_id: API_CONFIG.clientId,
      client_secret: API_CONFIG.clientSecret,
    });
    
    authToken = response.data.access_token;
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    return authToken || '';
  } catch (error) {
    console.error('Authentication failed:', error);
    throw new Error('Failed to authenticate with InControl API');
  }
}

/**
 * Fetch groups from InControl
 */
export async function getGroups(): Promise<InControlGroup[]> {
  // Use mock data if API not configured
  if (!isApiConfigured) {
    console.log('Using mock groups data (API not configured)');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return getMockGroups();
  }
  
  if (!authToken) {
    await authenticate();
  }
  
  try {
    const response = await apiClient.get('/api/groups');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    throw new Error('Failed to fetch groups from InControl API');
  }
}

/**
 * Fetch devices for a specific group
 */
export async function getDevicesByGroup(groupId: string): Promise<PeplinkDevice[]> {
  // Use mock data if API not configured
  if (!isApiConfigured) {
    console.log(`Using mock devices data for group ${groupId} (API not configured)`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return getMockDevicesByGroup(groupId);
  }
  
  if (!authToken) {
    await authenticate();
  }
  
  try {
    const response = await apiClient.get(`/api/groups/${groupId}/devices`);
    const devices = response.data.data || [];
    
    // Map InControl device data to our PeplinkDevice format
    return devices.map((device: InControlDevice, index: number) => mapInControlDevice(device, index));
  } catch (error) {
    console.error(`Failed to fetch devices for group ${groupId}:`, error);
    throw new Error('Failed to fetch devices from InControl API');
  }
}

/**
 * Map InControl device format to our PeplinkDevice format
 */
function mapInControlDevice(device: InControlDevice, index: number): PeplinkDevice {
  const connections: Array<{
    id: string;
    type: 'wan' | 'cellular' | 'wifi' | 'sfp';
    status: 'connected' | 'disconnected' | 'degraded';
    metrics: {
      speedMbps: number;
      latencyMs: number;
      uploadMbps: number;
      downloadMbps: number;
    };
  }> = [];
  
  // Map WAN connections
  if (device.wans && device.wans.length > 0) {
    device.wans.forEach((wan, i) => {
      const status: 'connected' | 'disconnected' = wan.status === 'connected' ? 'connected' : 'disconnected';
      connections.push({
        id: `${device.id}-wan-${i}`,
        type: 'wan',
        status,
        metrics: {
          speedMbps: wan.speed_mbps || 0,
          latencyMs: wan.latency_ms || 0,
          uploadMbps: wan.upload_mbps || 0,
          downloadMbps: wan.download_mbps || 0,
        },
      });
    });
  }
  
  // Map Cellular connections
  if (device.cellular && device.cellular.length > 0) {
    device.cellular.forEach((cell, i) => {
      const status: 'connected' | 'disconnected' = cell.status === 'connected' ? 'connected' : 'disconnected';
      connections.push({
        id: `${device.id}-cellular-${i}`,
        type: 'cellular',
        status,
        metrics: {
          speedMbps: cell.speed_mbps || 0,
          latencyMs: cell.latency_ms || 0,
          uploadMbps: cell.upload_mbps || 0,
          downloadMbps: cell.download_mbps || 0,
        },
      });
    });
  }
  
  // Map WiFi connections
  if (device.wifi && device.wifi.enabled) {
    const status: 'connected' | 'disconnected' = device.wifi.status === 'connected' ? 'connected' : 'disconnected';
    connections.push({
      id: `${device.id}-wifi-0`,
      type: 'wifi',
      status,
      metrics: {
        speedMbps: device.wifi.speed_mbps || 0,
        latencyMs: device.wifi.latency_ms || 0,
        uploadMbps: device.wifi.upload_mbps || 0,
        downloadMbps: device.wifi.download_mbps || 0,
      },
    });
  }
  
  // Map SFP connections
  if (device.sfp && device.sfp.length > 0) {
    device.sfp.forEach((sfp, i) => {
      const status: 'connected' | 'disconnected' = sfp.status === 'connected' ? 'connected' : 'disconnected';
      connections.push({
        id: `${device.id}-sfp-${i}`,
        type: 'sfp',
        status,
        metrics: {
          speedMbps: sfp.speed_mbps || 0,
          latencyMs: sfp.latency_ms || 0,
          uploadMbps: sfp.upload_mbps || 0,
          downloadMbps: sfp.download_mbps || 0,
        },
      });
    });
  }
  
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
 * Fetch real-time metrics for a device
 */
export async function getDeviceMetrics(deviceId: string): Promise<NetworkMetrics> {
  if (!authToken) {
    await authenticate();
  }
  
  try {
    const response = await apiClient.get(`/api/devices/${deviceId}/status`);
    const status = response.data.data;
    
    return {
      speedMbps: status.speed_mbps || 0,
      latencyMs: status.latency_ms || 0,
      uploadMbps: status.upload_mbps || 0,
      downloadMbps: status.download_mbps || 0,
    };
  } catch (error) {
    console.error(`Failed to fetch metrics for device ${deviceId}:`, error);
    throw new Error('Failed to fetch device metrics');
  }
}

/**
 * WebSocket connection for real-time updates
 */
export class InControlWebSocket {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectDelay = 5000;
  
  constructor(
    private groupId: string,
    private onUpdate: (devices: PeplinkDevice[]) => void,
    private onError: (error: Error) => void
  ) {}
  
  connect(): void {
    const wsUrl = API_CONFIG.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://');
    const url = `${wsUrl}/api/ws/groups/${this.groupId}?token=${authToken}`;
    
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected for group:', this.groupId);
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'device_update' && data.devices) {
            const devices = data.devices.map((device: InControlDevice, index: number) => 
              mapInControlDevice(device, index)
            );
            this.onUpdate(devices);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onError(new Error('WebSocket connection error'));
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.onError(error as Error);
      this.scheduleReconnect();
    }
  }
  
  private scheduleReconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }
  
  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

/**
 * InControl API Types
 */
export interface InControlGroup {
  id: string;
  name: string;
  description?: string;
  device_count: number;
}

interface InControlDevice {
  id: string;
  name: string;
  model: string;
  ip_address: string;
  wans?: Array<{
    status: string;
    speed_mbps?: number;
    latency_ms?: number;
    upload_mbps?: number;
    download_mbps?: number;
  }>;
  cellular?: Array<{
    status: string;
    speed_mbps?: number;
    latency_ms?: number;
    upload_mbps?: number;
    download_mbps?: number;
  }>;
  wifi?: {
    enabled: boolean;
    status: string;
    speed_mbps?: number;
    latency_ms?: number;
    upload_mbps?: number;
    download_mbps?: number;
  };
  sfp?: Array<{
    status: string;
    speed_mbps?: number;
    latency_ms?: number;
    upload_mbps?: number;
    download_mbps?: number;
  }>;
}
