/**
 * Security Configuration Service
 * 
 * Manages custom allowed origins for CORS policy.
 * Origins are stored in a JSON file with persistence.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logError } from '../utils/logger.js';
import { ERROR_CODES } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_DIR = path.join(__dirname, '../../config');
const ORIGINS_FILE = path.join(CONFIG_DIR, 'allowed-origins.json');

export interface CustomOrigin {
  id: string;
  origin: string;
  description?: string;
  createdAt: string;
}

/**
 * Ensure config directory and file exist
 */
async function ensureConfigFile(): Promise<void> {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    
    try {
      await fs.access(ORIGINS_FILE);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.writeFile(ORIGINS_FILE, JSON.stringify([], null, 2), 'utf-8');
      logInfo('Created new allowed-origins.json file');
    }
  } catch (error) {
    logError(ERROR_CODES.SERVER_STARTUP_FAILED, 'Failed to ensure config file', { error });
    throw error;
  }
}

/**
 * Read origins from file
 */
async function readOrigins(): Promise<CustomOrigin[]> {
  try {
    await ensureConfigFile();
    const data = await fs.readFile(ORIGINS_FILE, 'utf-8');
    return JSON.parse(data) as CustomOrigin[];
  } catch (error) {
    logError(ERROR_CODES.SERVER_STARTUP_FAILED, 'Failed to read origins file', { error });
    return [];
  }
}

/**
 * Write origins to file
 */
async function writeOrigins(origins: CustomOrigin[]): Promise<void> {
  try {
    await ensureConfigFile();
    await fs.writeFile(ORIGINS_FILE, JSON.stringify(origins, null, 2), 'utf-8');
  } catch (error) {
    logError(ERROR_CODES.SERVER_STARTUP_FAILED, 'Failed to write origins file', { error });
    throw error;
  }
}

/**
 * Get list of custom origin URLs (for CORS middleware)
 */
export async function getCustomOrigins(): Promise<string[]> {
  const origins = await readOrigins();
  return origins.map(o => o.origin);
}

/**
 * Get all custom origins with metadata (for API)
 */
export async function getAllCustomOrigins(): Promise<CustomOrigin[]> {
  return await readOrigins();
}

/**
 * Add a new custom origin
 */
export async function addCustomOrigin(
  origin: string,
  description?: string
): Promise<CustomOrigin> {
  const origins = await readOrigins();
  
  // Check if origin already exists
  const existing = origins.find(o => o.origin === origin);
  if (existing) {
    throw new Error('Origin already exists');
  }
  
  const newOrigin: CustomOrigin = {
    id: `origin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    origin,
    description,
    createdAt: new Date().toISOString(),
  };
  
  origins.push(newOrigin);
  await writeOrigins(origins);
  
  logInfo('Added custom origin', { origin });
  return newOrigin;
}

/**
 * Remove a custom origin
 */
export async function removeCustomOrigin(id: string): Promise<boolean> {
  const origins = await readOrigins();
  const filteredOrigins = origins.filter(o => o.id !== id);
  
  if (filteredOrigins.length === origins.length) {
    return false; // Origin not found
  }
  
  await writeOrigins(filteredOrigins);
  
  logInfo('Removed custom origin', { id });
  return true;
}
