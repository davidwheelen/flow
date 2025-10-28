/**
 * Secure Storage Service
 * 
 * Provides secure credential storage via backend API.
 * Credentials are stored on the backend server, not in browser localStorage.
 * This allows credentials to persist across different browsers and devices.
 */

const BACKEND_API_BASE = '/api/auth';

/**
 * Check if secure storage (encryption) is available
 * Always returns true since backend handles encryption
 */
export function isSecureStorageAvailable(): boolean {
  return true;
}

/**
 * Get security warning message if encryption is not available
 * Returns null since backend always uses encryption
 */
export function getSecurityWarning(): string | null {
  return null;
}

/**
 * Credentials interface
 */
export interface IC2Credentials {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  orgId: string;
}

/**
 * Extended credentials with token and refresh data
 */
export interface StoredCredentials extends IC2Credentials {
  accessToken: string;
  refreshToken?: string;
  tokenExpiry: number; // Unix timestamp in ms
  autoRefresh: boolean;
  encryptedUsername?: string; // Only if autoRefresh=true
  encryptedPassword?: string; // Only if autoRefresh=true
}

/**
 * Store credentials securely via backend API
 */
export async function storeCredentials(credentials: IC2Credentials): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to store credentials');
    }
  } catch (error) {
    console.error('Failed to store credentials:', error);
    throw error;
  }
}

/**
 * Retrieve credentials from backend API
 */
export async function getCredentials(): Promise<IC2Credentials | null> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/credentials`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retrieve credentials');
    }

    const data = await response.json();
    return data.credentials || null;
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
    return null;
  }
}

/**
 * Check if credentials are stored
 */
export async function hasCredentials(): Promise<boolean> {
  try {
    const credentials = await getCredentials();
    return credentials !== null;
  } catch {
    return false;
  }
}

/**
 * Clear stored credentials via backend API
 */
export async function clearCredentials(): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_API_BASE}/credentials`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to clear credentials');
    }
  } catch (error) {
    console.error('Failed to clear credentials:', error);
    throw error;
  }
}

/**
 * Clear all secure storage data including encryption key
 * Note: This is a no-op since storage is on the backend
 */
export function clearAllSecureData(): void {
  // No-op: backend handles all storage
  clearCredentials();
}

/**
 * Mask sensitive string for display
 */
export function maskString(value: string): string {
  if (!value) return '';
  if (value.length <= 4) return '•'.repeat(value.length);
  return '•'.repeat(value.length - 4) + value.slice(-4);
}

/**
 * Store extended credentials with token data
 * Note: Not currently used with backend storage
 */
export async function storeExtendedCredentials(): Promise<void> {
  // No-op: backend doesn't store extended credentials
  // Token management is handled separately
}

/**
 * Retrieve extended credentials with token data
 * Note: Not currently used with backend storage
 */
export async function getExtendedCredentials(): Promise<StoredCredentials | null> {
  // No-op: backend doesn't store extended credentials
  return null;
}

/**
 * Check if extended credentials are stored
 * Note: Not currently used with backend storage
 */
export function hasExtendedCredentials(): boolean {
  // No-op: backend doesn't store extended credentials
  return false;
}

/**
 * Clear extended credentials
 * Note: Not currently used with backend storage
 */
export function clearExtendedCredentials(): void {
  // No-op: backend doesn't store extended credentials
}
