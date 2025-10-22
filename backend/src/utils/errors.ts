/**
 * Error code definitions and error response builder
 */

export interface ErrorResponse {
  success: false;
  errorCode: string;
  errorMessage: string;
  timestamp: string;
  details?: string;
}

export const ERROR_CODES = {
  // Backend Server Errors (1xxx)
  SERVER_STARTUP_FAILED: 'ERR-1001',
  DATABASE_CONNECTION_FAILED: 'ERR-1002',
  
  // API Endpoint Errors (2xxx)
  INVALID_REQUEST: 'ERR-2001',
  MISSING_PARAMETERS: 'ERR-2002',
  BACKEND_NOT_AVAILABLE: 'ERR-2003',
  
  // Browser Automation Errors (3xxx)
  BROWSER_LAUNCH_FAILED: 'ERR-3001',
  PAGE_LOAD_TIMEOUT: 'ERR-3002',
  ELEMENT_NOT_FOUND: 'ERR-3003',
  AUTOMATION_TIMEOUT: 'ERR-3004',
  SCREENSHOT_FAILED: 'ERR-3005',
  
  // Authentication Errors (4xxx)
  INVALID_CREDENTIALS: 'ERR-4001',
  LOGIN_FAILED: 'ERR-4002',
  MFA_REQUIRED: 'ERR-4003',
  SESSION_EXPIRED: 'ERR-4004',
  OAUTH_TOKEN_NOT_FOUND: 'ERR-4005',
  
  // Network/Connection Errors (5xxx)
  NETWORK_ERROR: 'ERR-5001',
  CONNECTION_TIMEOUT: 'ERR-5002',
  INVALID_URL: 'ERR-5003',
  
  // Validation Errors (6xxx)
  VALIDATION_ERROR: 'ERR-6001',
  INVALID_EMAIL: 'ERR-6002',
  INVALID_PASSWORD: 'ERR-6003',
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  'ERR-1001': 'Backend server failed to start',
  'ERR-1002': 'Database connection failed',
  
  'ERR-2001': 'Invalid request format',
  'ERR-2002': 'Missing required parameters',
  'ERR-2003': 'Backend service not available',
  
  'ERR-3001': 'Failed to launch browser automation',
  'ERR-3002': 'Page load timeout - server may be unreachable',
  'ERR-3003': 'Required page element not found',
  'ERR-3004': 'Automation process timeout',
  'ERR-3005': 'Failed to capture screenshot',
  
  'ERR-4001': 'Invalid username or password',
  'ERR-4002': 'Login failed - check credentials',
  'ERR-4003': 'Multi-factor authentication required (not supported)',
  'ERR-4004': 'Session expired',
  'ERR-4005': 'OAuth credentials not found after login',
  
  'ERR-5001': 'Network error occurred',
  'ERR-5002': 'Connection timeout',
  'ERR-5003': 'Invalid or malformed URL',
  
  'ERR-6001': 'Validation error',
  'ERR-6002': 'Invalid email format',
  'ERR-6003': 'Invalid password format',
};

export function createErrorResponse(
  errorCode: string,
  details?: string
): ErrorResponse {
  return {
    success: false,
    errorCode,
    errorMessage: ERROR_MESSAGES[errorCode] || 'Unknown error',
    timestamp: new Date().toISOString(),
    details,
  };
}
