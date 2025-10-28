/**
 * Secure Storage Utility
 * 
 * Provides encrypted file-based storage for sensitive credentials.
 * Uses AES-256-GCM encryption with a persistent key.
 */

import * as fs from 'fs/promises';
import * as crypto from 'crypto';
import * as path from 'path';
import { logInfo, logError } from './logger.js';
import { ERROR_CODES } from './errors.js';

const CONFIG_DIR = process.env.CONFIG_DIR || path.join(process.cwd(), 'config');
const ENCRYPTION_KEY_FILE = path.join(CONFIG_DIR, '.encryption_key');
const CREDENTIALS_FILE = path.join(CONFIG_DIR, 'credentials.enc');
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits

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
 * Ensure config directory exists
 */
async function ensureConfigDir(): Promise<void> {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
  } catch (error) {
    logError(ERROR_CODES.SERVER_STARTUP_FAILED, 'Failed to create config directory', { error });
    throw error;
  }
}

/**
 * Get or generate encryption key
 */
async function getEncryptionKey(): Promise<Buffer> {
  await ensureConfigDir();
  
  try {
    // Try to read existing key
    const keyData = await fs.readFile(ENCRYPTION_KEY_FILE, 'utf8');
    return Buffer.from(keyData, 'hex');
  } catch (error) {
    // Generate new key if it doesn't exist
    const key = crypto.randomBytes(KEY_LENGTH);
    await fs.writeFile(ENCRYPTION_KEY_FILE, key.toString('hex'), { mode: 0o600 });
    logInfo('Generated new encryption key');
    return key;
  }
}

/**
 * Encrypt data
 */
async function encrypt(data: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Combine iv, authTag, and encrypted data
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt data
 */
async function decrypt(encryptedData: string): Promise<string> {
  const key = await getEncryptionKey();
  const parts = encryptedData.split(':');
  
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Store credentials securely
 */
export async function storeCredentials(credentials: IC2Credentials): Promise<void> {
  try {
    await ensureConfigDir();
    const jsonData = JSON.stringify(credentials);
    const encrypted = await encrypt(jsonData);
    await fs.writeFile(CREDENTIALS_FILE, encrypted, { mode: 0o600 });
    logInfo('Credentials stored successfully');
  } catch (error) {
    logError(ERROR_CODES.NETWORK_ERROR, 'Failed to store credentials', { error });
    throw error;
  }
}

/**
 * Retrieve credentials
 */
export async function getCredentials(): Promise<IC2Credentials | null> {
  try {
    const encrypted = await fs.readFile(CREDENTIALS_FILE, 'utf8');
    const decrypted = await decrypt(encrypted);
    return JSON.parse(decrypted) as IC2Credentials;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      // File doesn't exist - no credentials stored
      return null;
    }
    logError(ERROR_CODES.NETWORK_ERROR, 'Failed to retrieve credentials', { error });
    throw error;
  }
}

/**
 * Check if credentials are stored
 */
export async function hasCredentials(): Promise<boolean> {
  try {
    await fs.access(CREDENTIALS_FILE);
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear stored credentials
 */
export async function clearCredentials(): Promise<void> {
  try {
    await fs.unlink(CREDENTIALS_FILE);
    logInfo('Credentials cleared successfully');
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code !== 'ENOENT') {
      logError(ERROR_CODES.NETWORK_ERROR, 'Failed to clear credentials', { error });
      throw error;
    }
  }
}
