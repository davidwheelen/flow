/**
 * Centralized logging utility with error codes and file logging
 * Logs are written to: backend/logs/flow-backend.log
 */

import fs from 'fs';
import path from 'path';

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  errorCode?: string;
  message: string;
  details?: unknown;
  userId?: string;
}

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, 'flow-backend.log');

export function log(entry: LogEntry): void {
  const logLine = JSON.stringify({
    ...entry,
    timestamp: new Date().toISOString(),
  });
  
  // Console output
  console.log(logLine);
  
  // File output
  fs.appendFileSync(logFile, logLine + '\n');
}

export function logInfo(message: string, details?: unknown): void {
  log({ timestamp: '', level: 'INFO', message, details });
}

export function logError(errorCode: string, message: string, details?: unknown): void {
  log({ timestamp: '', level: 'ERROR', errorCode, message, details });
}

export function logWarn(message: string, details?: unknown): void {
  log({ timestamp: '', level: 'WARN', message, details });
}
