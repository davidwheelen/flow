import axios, { AxiosInstance } from 'axios';
import { PeplinkDevice, NetworkMetrics, Connection } from '@/types/network.types';
import { getMockDevices, generateRealtimeMetrics } from '@/utils/mockData';
import {
  InControlAuth,
  AuthResponse,
  Organization,
  Group,
  InControlDevice,
  DeviceStatus,
  ApiConfig,
} from '@/types/incontrol.types';

/**
 * API service for Peplink InControl
 * Supports both mock data and real API integration
 */

const IC_API_BASE = import.meta.env.VITE_IC_API_URL || 'https://api.ic.peplink.com/api';

// Use mock data by default if not configured
let USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let authData: InControlAuth | null = null;
let apiClient: AxiosInstance | null = null;

/**
 * Set mock data mode
 */
export function setMockDataMode(enabled: boolean): void {
  USE_MOCK_DATA = enabled;
}

/**
 * Initialize API client with authentication
 */
function initializeApiClient(baseURL: string, accessToken?: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
}

/**
 * Authenticate with InControl API
 */
export async function authenticate(
  clientId: string,
  clientSecret: string
): Promise<AuthResponse> {
  if (USE_MOCK_DATA) {
    // Mock authentication
    const mockAuth: AuthResponse = {
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token',
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
    
    authData = {
      clientId,
      clientSecret,
      accessToken: mockAuth.accessToken,
      refreshToken: mockAuth.refreshToken,
      expiresAt: Date.now() + mockAuth.expiresIn * 1000,
    };
    
    apiClient = initializeApiClient(IC_API_BASE, mockAuth.accessToken);
    return mockAuth;
  }

  // Real API authentication (OAuth 2.0 client credentials flow)
  try {
    const client = initializeApiClient(IC_API_BASE);
    const response = await client.post<AuthResponse>('/oauth/token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    authData = {
      clientId,
      clientSecret,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresAt: Date.now() + response.data.expiresIn * 1000,
    };

    apiClient = initializeApiClient(IC_API_BASE, response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw new Error('Failed to authenticate with InControl API');
  }
}

/**
 * Refresh access token
 */
async function refreshAccessToken(): Promise<void> {
  if (!authData || !authData.refreshToken) {
    throw new Error('No refresh token available');
  }

  if (USE_MOCK_DATA) {
    return; // Mock mode doesn't need refresh
  }

  try {
    const client = initializeApiClient(IC_API_BASE);
    const response = await client.post<AuthResponse>('/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: authData.refreshToken,
      client_id: authData.clientId,
      client_secret: authData.clientSecret,
    });

    authData.accessToken = response.data.accessToken;
    authData.refreshToken = response.data.refreshToken;
    authData.expiresAt = Date.now() + response.data.expiresIn * 1000;

    apiClient = initializeApiClient(IC_API_BASE, response.data.accessToken);
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw new Error('Failed to refresh access token');
  }
}

/**
 * Check if token needs refresh and refresh if necessary
 */
async function ensureValidToken(): Promise<void> {
  if (!authData) {
    throw new Error('Not authenticated');
  }

  if (authData.expiresAt && Date.now() >= authData.expiresAt - 60000) {
    await refreshAccessToken();
  }
}

/**
 * Get list of organizations
 */
export async function getOrganizations(): Promise<Organization[]> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [
      { id: 'org-1', name: 'Organization A', groupCount: 2, deviceCount: 3 },
      { id: 'org-2', name: 'Organization B', groupCount: 1, deviceCount: 2 },
    ];
  }

  await ensureValidToken();
  if (!apiClient) throw new Error('API client not initialized');

  try {
    const response = await apiClient.get<Organization[]>('/organizations');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch organizations:', error);
    throw new Error('Failed to fetch organizations');
  }
}

/**
 * Get groups for an organization
 */
export async function getGroups(organizationId: string): Promise<Group[]> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const mockGroups: Record<string, Group[]> = {
      'org-1': [
        { id: 'group-1', organizationId: 'org-1', name: 'Group 1', deviceCount: 3 },
        { id: 'group-2', organizationId: 'org-1', name: 'Group 2', deviceCount: 2 },
      ],
      'org-2': [
        { id: 'group-3', organizationId: 'org-2', name: 'Group 3', deviceCount: 2 },
      ],
    };
    return mockGroups[organizationId] || [];
  }

  await ensureValidToken();
  if (!apiClient) throw new Error('API client not initialized');

  try {
    const response = await apiClient.get<Group[]>(`/organizations/${organizationId}/groups`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    throw new Error('Failed to fetch groups');
  }
}

/**
 * Get devices for a group
 */
export async function getDevices(groupId?: string | null): Promise<PeplinkDevice[]> {
  if (USE_MOCK_DATA || !groupId) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getMockDevices();
  }

  await ensureValidToken();
  if (!apiClient) throw new Error('API client not initialized');

  try {
    const response = await apiClient.get<InControlDevice[]>(`/groups/${groupId}/devices`);
    return mapInControlDevicesToPeplinkDevices(response.data);
  } catch (error) {
    console.error('Failed to fetch devices:', error);
    throw new Error('Failed to fetch devices');
  }
}

/**
 * Get device status
 */
export async function getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      online: Math.random() > 0.2,
      lastSeen: new Date(),
      uptime: Math.floor(Math.random() * 86400),
    };
  }

  await ensureValidToken();
  if (!apiClient) throw new Error('API client not initialized');

  try {
    const response = await apiClient.get<DeviceStatus>(`/devices/${deviceId}/status`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch device status:', error);
    throw new Error('Failed to fetch device status');
  }
}

/**
 * Get device connections
 */
export async function getDeviceConnections(deviceId: string): Promise<Connection[]> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // Return connections from mock device
    const devices = await getDevices();
    const device = devices.find((d) => d.id === deviceId);
    return device?.connections || [];
  }

  await ensureValidToken();
  if (!apiClient) throw new Error('API client not initialized');

  try {
    const response = await apiClient.get<Connection[]>(`/devices/${deviceId}/connections`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch device connections:', error);
    throw new Error('Failed to fetch device connections');
  }
}

/**
 * Map InControl devices to Peplink device format
 */
function mapInControlDevicesToPeplinkDevices(
  icDevices: InControlDevice[]
): PeplinkDevice[] {
  return icDevices.map((device, index) => ({
    id: device.id,
    name: device.name,
    model: device.model,
    ipAddress: `192.168.${index + 1}.1`, // TODO: Get from actual device data
    connections: [], // TODO: Fetch connections separately
    position: { x: 100 + index * 200, y: 200 },
  }));
}

/**
 * Fetch metrics for a specific device
 */
export async function getDeviceMetrics(deviceId: string): Promise<NetworkMetrics> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log(`Fetching metrics for device: ${deviceId}`);
    return generateRealtimeMetrics();
  }

  await ensureValidToken();
  if (!apiClient) throw new Error('API client not initialized');

  try {
    const response = await apiClient.get<NetworkMetrics>(`/devices/${deviceId}/metrics`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch device metrics:', error);
    return generateRealtimeMetrics(); // Fallback to mock data
  }
}

/**
 * Stream device metrics via WebSocket
 */
export function streamDeviceMetrics(
  deviceIds: string[],
  callback: (deviceId: string, metrics: NetworkMetrics) => void
): WebSocket | { close: () => void } {
  if (USE_MOCK_DATA) {
    // Mock WebSocket with interval updates
    const intervalId = setInterval(() => {
      deviceIds.forEach((deviceId) => {
        callback(deviceId, generateRealtimeMetrics());
      });
    }, 2000);

    return {
      close: () => clearInterval(intervalId),
    };
  }

  // Real WebSocket connection
  const wsUrl = IC_API_BASE.replace(/^http/, 'ws') + '/stream/metrics';
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({ deviceIds, token: authData?.accessToken }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      callback(data.deviceId, data.metrics);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return ws;
}

/**
 * Subscribe to real-time updates
 */
export function subscribeToUpdates(
  callback: (devices: PeplinkDevice[]) => void
): () => void {
  const intervalId = setInterval(async () => {
    const devices = await getDevices();
    callback(devices);
  }, 5000);

  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Test API connection
 */
export async function testConnection(config: ApiConfig): Promise<boolean> {
  try {
    if (config.useMockData) {
      return true; // Mock mode always succeeds
    }

    await authenticate(config.clientId, config.clientSecret);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

/**
 * Get current authentication status
 */
export function getAuthStatus(): InControlAuth | null {
  return authData;
}

/**
 * Clear authentication
 */
export function clearAuth(): void {
  authData = null;
  apiClient = null;
}

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: IC_API_BASE,
  useMockData: USE_MOCK_DATA,
  timeout: 10000,
};
