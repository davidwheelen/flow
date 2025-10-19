/**
 * Secure credential storage using Web Crypto API
 * Credentials are encrypted before storing in localStorage
 */

interface StoredCredentials {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  isCustomIcva: boolean;
}

interface EncryptedData {
  iv: string;
  data: string;
}

const STORAGE_KEY = 'ic2_credentials';
const ENCRYPTION_KEY_NAME = 'ic2_encryption_key';

// Default InControl2 Cloud URL
export const DEFAULT_IC2_URL = 'https://incontrol2.peplink.com';

/**
 * Generate or retrieve encryption key
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  // In a real application, you might want to derive this from a user password
  // For now, we'll generate a key and store it (this is still more secure than plaintext)
  const keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (keyData) {
    const keyBuffer = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Store key for later use
  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
  localStorage.setItem(ENCRYPTION_KEY_NAME, keyString);
  
  return key;
}

/**
 * Encrypt data using AES-GCM
 */
async function encryptData(data: string): Promise<EncryptedData> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = new TextEncoder().encode(data);
  
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedData
  );
  
  return {
    iv: btoa(String.fromCharCode(...iv)),
    data: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
  };
}

/**
 * Decrypt data using AES-GCM
 */
async function decryptData(encryptedData: EncryptedData): Promise<string> {
  const key = await getEncryptionKey();
  const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(encryptedData.data), c => c.charCodeAt(0));
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new TextDecoder().decode(decryptedBuffer);
}

/**
 * Save credentials securely
 */
export async function saveCredentials(credentials: StoredCredentials): Promise<void> {
  const jsonData = JSON.stringify(credentials);
  const encrypted = await encryptData(jsonData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(encrypted));
}

/**
 * Load credentials securely
 */
export async function loadCredentials(): Promise<StoredCredentials | null> {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }
  
  try {
    const encrypted: EncryptedData = JSON.parse(stored);
    const decrypted = await decryptData(encrypted);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Failed to decrypt credentials:', error);
    return null;
  }
}

/**
 * Check if credentials are stored
 */
export function hasStoredCredentials(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Clear stored credentials
 */
export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Mask a credential for display (shows as •••••••••)
 */
export function maskCredential(credential: string): string {
  if (!credential || credential.length === 0) {
    return '';
  }
  return '•'.repeat(Math.min(credential.length, 20));
}
