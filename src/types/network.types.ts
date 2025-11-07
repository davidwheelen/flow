import { DeviceConnectionSpec } from './connectionTypes';
import { IC2Interface } from './incontrol.types';

export type ConnectionType = 'wan' | 'lan' | 'cellular' | 'wifi' | 'sfp';
export type ConnectionStatus = 'connected' | 'disconnected' | 'degraded';

/**
 * SSID information for Access Points
 */
export interface APSSIDInfo {
  name: string;
  security: string;
  enabled: boolean;
}

/**
 * Access Point interface with additional mesh information
 */
export interface APInterface extends IC2Interface {
  displayName: string;
  frequencies: string[];
  ssids: APSSIDInfo[];
  clientCount: number;
  metrics: {
    latency: number;
    uploadSpeed: number;
    downloadSpeed: number;
  };
}

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
  interfaces?: (IC2Interface | APInterface)[]; // Device interfaces for connection matching (includes AP interfaces)
  groupId?: string; // Optional visual group ID for organizing devices
}

export interface DeviceGroup {
  id: string;
  name: string;
  position: { x: number; y: number };
}

export interface NetworkData {
  devices: PeplinkDevice[];
  groups?: DeviceGroup[];
  lastUpdated: Date;
}
