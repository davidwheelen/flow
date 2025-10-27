import { DeviceConnectionSpec } from './connectionTypes';

export type ConnectionType = 'wan' | 'cellular' | 'wifi' | 'sfp';
export type ConnectionStatus = 'connected' | 'disconnected' | 'degraded';

export interface NetworkMetrics {
  speedMbps: number;
  latencyMs: number;
  uploadMbps: number;
  downloadMbps: number;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  status: ConnectionStatus;
  metrics: NetworkMetrics;
  device_id?: string; // Optional device ID for device-to-device connections
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
}

export interface NetworkData {
  devices: PeplinkDevice[];
  lastUpdated: Date;
}
