/**
 * Peplink InControl API Type Definitions
 */

export interface InControlAuth {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface Organization {
  id: string;
  name: string;
  groupCount: number;
  deviceCount: number;
}

export interface Group {
  id: string;
  organizationId: string;
  name: string;
  deviceCount: number;
}

export interface DeviceStatus {
  online: boolean;
  lastSeen: Date;
  uptime: number;
}

export interface InControlDevice {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  groupId: string;
  status: DeviceStatus;
}

export interface ApiConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  useMockData: boolean;
}

export interface ConnectionSettings {
  isConnected: boolean;
  lastChecked?: Date;
  error?: string;
}
