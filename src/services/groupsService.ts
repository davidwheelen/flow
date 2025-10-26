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
    // Correct InControl2 API endpoint for fetching groups
    const response = await apiClient.get<{ data: InControlGroup[] }>(
      `/rest/o/${credentials.orgId}/g`
    );
    
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
