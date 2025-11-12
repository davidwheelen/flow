import { DeviceConnectionSpec } from './connectionTypes';
import { IC2Interface } from './incontrol.types';

export type ConnectionType = 'wan' | 'lan' | 'cellular' | 'wifi' | 'sfp';
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

export interface APDetails {
  displayName: string;
  frequencies: string[];
  ssids: Array<{ name: string; security: string }>;
  clientCount: number;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  status: ConnectionStatus;
  metrics: NetworkMetrics;
  device_id?: string; // Optional device ID for device-to-device connections
  wanDetails?: WANConnection; // Add WAN-specific details
  apDetails?: APDetails; // Add AP-specific details for wireless mesh
  lanDetails?: {
    portNumber: number; // 0 = LAN Network, -1 = VLAN, 1+ = physical port
    name: string;
    status: string;
    speed?: string;
    vlan?: string;
    mac?: string;        // MAC address for LAN Network
    ipRange?: string;    // IP range (CIDR notation)
    gateway?: string;    // Gateway IP
    clientCount?: number;// Connected clients count
    vlanId?: number;     // VLAN ID for VLAN connections
  };
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
  interfaces?: IC2Interface[]; // Device interfaces for connection matching
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
