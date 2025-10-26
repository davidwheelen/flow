/**
 * Groups Service
 * 
 * Fetches organization groups from InControl2 API using authenticated client
 */

import axios from 'axios';
import { authService } from './authService';

export interface InControlGroup {
  id: string;
  name: string;
  description?: string;
  device_count: number;
}

/**
 * Fetch all groups for the authenticated organization
 */
export async function getGroups(): Promise<InControlGroup[]> {
  const apiClient = authService.getApiClient();
  const credentials = authService.getCredentials();
  
  if (!credentials) {
    throw new Error('Not authenticated - please configure InControl2 credentials');
  }
  
  try {
    // Try modern REST API format first (used by api.ic.peplink.com)
    let response;
    try {
      response = await apiClient.get<{ data: InControlGroup[] }>(
        `/rest/o/${credentials.orgId}/g`
      );
    } catch (error) {
      // If that fails with 404, try legacy API format (used by incontrol2.peplink.com)
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        response = await apiClient.get<{ data: InControlGroup[] }>(
          `/api/organization/${credentials.orgId}/groups`
        );
      } else {
        throw error;
      }
    }
    
    // Response format: { data: [...] }
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    
    // Extract error details for better debugging
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      throw new Error(`Failed to fetch groups (${status}): ${message}`);
    }
    
    throw new Error('Failed to fetch groups from InControl2 API');
  }
}
