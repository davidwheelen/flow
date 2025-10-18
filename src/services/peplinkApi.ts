import { PeplinkDevice, NetworkMetrics } from '@/types/network.types';
import { getMockDevices, generateRealtimeMetrics } from '@/utils/mockData';

/**
 * API service for Peplink InControl
 * Currently using mock data - ready for real API integration
 */

/**
 * Fetch all devices from Peplink InControl
 * TODO: Replace with real API call when ready
 */
export async function getDevices(): Promise<PeplinkDevice[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return getMockDevices();
}

/**
 * Fetch metrics for a specific device
 * TODO: Replace with real API call when ready
 */
export async function getDeviceMetrics(deviceId: string): Promise<NetworkMetrics> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  console.log(`Fetching metrics for device: ${deviceId}`);
  return generateRealtimeMetrics();
}

/**
 * Subscribe to real-time updates
 * TODO: Implement WebSocket connection when API is ready
 * @returns Unsubscribe function
 */
export function subscribeToUpdates(
  callback: (devices: PeplinkDevice[]) => void
): () => void {
  // Mock implementation - simulate periodic updates
  const intervalId = setInterval(async () => {
    const devices = await getDevices();
    callback(devices);
  }, 5000);

  // Return unsubscribe function
  return () => {
    clearInterval(intervalId);
  };
}

/**
 * Future API configuration
 */
export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.ic.peplink.com',
  apiKey: import.meta.env.VITE_API_KEY || '',
  timeout: 10000,
};
