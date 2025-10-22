/**
 * Secure Storage Service
 * 
 * Provides encrypted storage for sensitive credentials using Web Crypto API.
 * Credentials are encrypted before being stored in localStorage.
 */

const STORAGE_PREFIX = 'flow_secure_';
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

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
 * Generate or retrieve encryption key from localStorage
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const keyData = localStorage.getItem(`${STORAGE_PREFIX}key`);
  
  if (keyData) {
    // Import existing key
    const keyBuffer = base64ToBuffer(keyData);
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer.buffer as ArrayBuffer,
      { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Export and store the key
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  localStorage.setItem(`${STORAGE_PREFIX}key`, bufferToBase64(exportedKey));
  
  return key;
}

/**
 * Encrypt data using Web Crypto API
 */
async function encrypt(data: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    encodedData
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedBuffer), iv.length);
  
  return bufferToBase64(combined.buffer);
}

/**
 * Decrypt data using Web Crypto API
 */
async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = base64ToBuffer(encryptedData);
  
  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv: iv.buffer as ArrayBuffer },
    key,
    encrypted.buffer as ArrayBuffer
  );
  
  return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Convert buffer to base64 string
 */
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 string to buffer
 */
function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Store credentials securely
 */
export async function storeCredentials(credentials: IC2Credentials): Promise<void> {
  const jsonData = JSON.stringify(credentials);
  const encrypted = await encrypt(jsonData);
  localStorage.setItem(`${STORAGE_PREFIX}credentials`, encrypted);
}

/**
 * Retrieve credentials
 */
export async function getCredentials(): Promise<IC2Credentials | null> {
  const encrypted = localStorage.getItem(`${STORAGE_PREFIX}credentials`);
  if (!encrypted) {
    return null;
  }
  
  try {
    const decrypted = await decrypt(encrypted);
    return JSON.parse(decrypted) as IC2Credentials;
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return null;
  }
}

/**
 * Check if credentials are stored
 */
export function hasCredentials(): boolean {
  return localStorage.getItem(`${STORAGE_PREFIX}credentials`) !== null;
}

/**
 * Clear stored credentials
 */
export function clearCredentials(): void {
  localStorage.removeItem(`${STORAGE_PREFIX}credentials`);
}

/**
 * Clear all secure storage data including encryption key
 */
export function clearAllSecureData(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
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
 */
export async function storeExtendedCredentials(credentials: StoredCredentials): Promise<void> {
  const jsonData = JSON.stringify(credentials);
  const encrypted = await encrypt(jsonData);
  localStorage.setItem(`${STORAGE_PREFIX}extended_credentials`, encrypted);
}

/**
 * Retrieve extended credentials with token data
 */
export async function getExtendedCredentials(): Promise<StoredCredentials | null> {
  const encrypted = localStorage.getItem(`${STORAGE_PREFIX}extended_credentials`);
  if (!encrypted) {
    return null;
  }
  
  try {
    const decrypted = await decrypt(encrypted);
    return JSON.parse(decrypted) as StoredCredentials;
  } catch (error) {
    console.error('Failed to decrypt extended credentials:', error);
    return null;
  }
}

/**
 * Check if extended credentials are stored
 */
export function hasExtendedCredentials(): boolean {
  return localStorage.getItem(`${STORAGE_PREFIX}extended_credentials`) !== null;
}

/**
 * Clear extended credentials
 */
export function clearExtendedCredentials(): void {
  localStorage.removeItem(`${STORAGE_PREFIX}extended_credentials`);
}
