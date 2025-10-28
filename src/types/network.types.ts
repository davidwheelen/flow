import { DeviceConnectionSpec } from './connectionTypes';

export type ConnectionType = 'wan' | 'cellular' | 'wifi' | 'sfp';
export type ConnectionStatus = 'connected' | 'disconnected' | 'degraded';

export interface NetworkMetrics {
  speedMbps: number;
  latencyMs: number;
  uploadMbps: number;
  downloadMbps: number;
}

export interface LanClient {
  mac: string;
  sn?: string; // Serial number if it's a Peplink device
  ip: string;
  name: string;
}

export interface WANConnection {
  id: string;
  name: string; // e.g., "WAN1 - Xfinity"
  type: string; // "ethernet", "cellular", "usb", etc.
  status: 'connected' | 'disconnected' | 'standby';
  ipAddress: string;
  subnetMask?: string;
  macAddress?: string;
  gateway?: string;
  dnsServers?: string[];
  connectionMethod?: string; // "DHCP", "Static", "PPPoE"
  routingMode?: string; // "NAT", "IP Forwarding"
  mtu?: number;
  healthCheckMethod?: string;
  serviceProvider?: string;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  status: ConnectionStatus;
  metrics: NetworkMetrics;
  device_id?: string; // Optional device ID for device-to-device connections
  wanDetails?: WANConnection; // Add WAN-specific details
}

export interface PeplinkDevice {
  id: string;
  name: string;
  model: string;
  serial?: string;
  firmware_version?: string;
  status?: string;
  ipAddress: string;
  connections: Connection[];
  position: { x: number; y: number };
  connectionSpec?: DeviceConnectionSpec; // Optional device connection specifications
  lanClients?: LanClient[]; // LAN clients connected to this device
}

export interface NetworkData {
  devices: PeplinkDevice[];
  lastUpdated: Date;
}
