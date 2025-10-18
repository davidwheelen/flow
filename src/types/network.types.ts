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
}

export interface PeplinkDevice {
  id: string;
  name: string;
  model: string;
  ipAddress: string;
  connections: Connection[];
  position: { x: number; y: number };
}

export interface NetworkData {
  devices: PeplinkDevice[];
  lastUpdated: Date;
}
