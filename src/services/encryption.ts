/**
 * Encryption Service
 * 
 * Provides AES-256-GCM encryption for storing sensitive credentials
 * when auto-refresh is enabled. Uses device-specific encryption key.
 */

const ENCRYPTION_KEY_NAME = 'flow_secure_auto_key';
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

/**
 * Generate or retrieve device-specific encryption key
 */
async function getAutoRefreshKey(): Promise<CryptoKey> {
  const keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
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
  localStorage.setItem(ENCRYPTION_KEY_NAME, bufferToBase64(exportedKey));
  
  return key;
}

/**
 * Encrypt sensitive data for auto-refresh storage
 */
export async function encryptForAutoRefresh(data: string): Promise<string> {
  const key = await getAutoRefreshKey();
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
 * Decrypt data from auto-refresh storage
 */
export async function decryptForAutoRefresh(encryptedData: string): Promise<string> {
  const key = await getAutoRefreshKey();
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
 * Clear auto-refresh encryption key
 */
export function clearAutoRefreshKey(): void {
  localStorage.removeItem(ENCRYPTION_KEY_NAME);
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
