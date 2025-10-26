/**
 * Error Code Reference Data
 * 
 * Comprehensive error codes with descriptions, causes, and solutions.
 */

export interface ErrorCodeInfo {
  code: string;
  category: string;
  title: string;
  description: string;
  causes: string[];
  solutions: string[];
}

export const ERROR_CODE_CATEGORIES = {
  SERVER: 'Backend Server',
  API: 'API Endpoint',
  BROWSER: 'Browser Automation',
  AUTH: 'Authentication',
  NETWORK: 'Network/Connection',
  VALIDATION: 'Validation',
  SYSTEM: 'System',
} as const;

export const ERROR_CODES_REFERENCE: ErrorCodeInfo[] = [
  // Backend Server Errors (1xxx)
  {
    code: 'ERR-1001',
    category: ERROR_CODE_CATEGORIES.SERVER,
    title: 'Backend Server Startup Failed',
    description: 'The backend service failed to start properly.',
    causes: [
      'Port 3001 is already in use by another application',
      'Missing required dependencies or configuration',
      'Insufficient system resources',
    ],
    solutions: [
      'Check if another application is using port 3001 and stop it',
      'Restart the backend service: docker-compose restart backend',
      'Check backend logs for specific error details',
      'Verify system has sufficient memory and disk space',
    ],
  },
  {
    code: 'ERR-1002',
    category: ERROR_CODE_CATEGORIES.SERVER,
    title: 'Database Connection Failed',
    description: 'Unable to establish connection to the database.',
    causes: [
      'Database service is not running',
      'Invalid database credentials',
      'Network connectivity issues',
      'Database server is unreachable',
    ],
    solutions: [
      'Verify database service is running: docker-compose ps',
      'Check database connection settings in environment variables',
      'Restart database service: docker-compose restart db',
      'Check database server logs for errors',
    ],
  },

  // API Endpoint Errors (2xxx)
  {
    code: 'ERR-2001',
    category: ERROR_CODE_CATEGORIES.API,
    title: 'Invalid Request Format',
    description: 'The API request format is invalid or malformed.',
    causes: [
      'Missing required request headers',
      'Invalid JSON payload',
      'Incorrect Content-Type header',
      'Malformed request parameters',
    ],
    solutions: [
      'Verify request includes Content-Type: application/json header',
      'Check JSON payload for syntax errors',
      'Ensure all required parameters are included',
      'Review API documentation for correct request format',
    ],
  },
  {
    code: 'ERR-2002',
    category: ERROR_CODE_CATEGORIES.API,
    title: 'Missing Required Parameters',
    description: 'One or more required parameters are missing from the request.',
    causes: [
      'Request missing required fields',
      'Empty or null values for required parameters',
      'Incorrect parameter names',
    ],
    solutions: [
      'Check API documentation for required parameters',
      'Verify all required fields are included in the request',
      'Ensure parameter names match API specification',
    ],
  },
  {
    code: 'ERR-2003',
    category: ERROR_CODE_CATEGORIES.API,
    title: 'Backend Service Not Available',
    description: 'The backend service is not responding or is unavailable.',
    causes: [
      'Backend service is not running',
      'Backend service crashed or is restarting',
      'Network connection to backend failed',
      'Backend is overloaded with requests',
    ],
    solutions: [
      'Check backend service status: docker-compose ps backend',
      'Restart backend service: docker-compose restart backend',
      'Check backend logs: docker-compose logs backend',
      'Verify nginx proxy configuration',
      'Wait a moment and try again',
    ],
  },
  {
    code: 'ERR-2004',
    category: ERROR_CODE_CATEGORIES.API,
    title: 'CORS Policy Violation',
    description: 'Request blocked by Cross-Origin Resource Sharing (CORS) policy.',
    causes: [
      'Frontend trying to call external API directly from browser',
      'Request origin not in allowed origins list',
      'Missing or incorrect CORS headers',
      'Browser security policy blocking the request',
    ],
    solutions: [
      'Use backend proxy endpoints instead of calling external APIs directly',
      'Add your origin to the allowed origins list in Security Settings',
      'Verify CORS configuration on the backend',
      'For port 2727: should work automatically - check nginx configuration',
      'For other ports: add custom origin in Settings > Security',
    ],
  },

  // Browser Automation Errors (3xxx)
  {
    code: 'ERR-3001',
    category: ERROR_CODE_CATEGORIES.BROWSER,
    title: 'Browser Launch Failed',
    description: 'Failed to launch browser for automated setup.',
    causes: [
      'Browser executable not found or corrupted',
      'Insufficient system resources',
      'Missing browser dependencies',
      'Permission issues accessing browser',
    ],
    solutions: [
      'Reinstall browser automation dependencies',
      'Check system has sufficient memory (>2GB recommended)',
      'Verify Docker container has necessary capabilities',
      'Try manual setup instead of automated browser setup',
    ],
  },
  {
    code: 'ERR-3002',
    category: ERROR_CODE_CATEGORIES.BROWSER,
    title: 'Page Load Timeout',
    description: 'Web page failed to load within the timeout period.',
    causes: [
      'Target server is unreachable or down',
      'Slow network connection',
      'Server taking too long to respond',
      'DNS resolution failed',
    ],
    solutions: [
      'Verify the server URL is correct and reachable',
      'Check your network connection',
      'Ping the server to verify it\'s responding',
      'Try increasing timeout in configuration',
      'Use manual setup if automation continues to fail',
    ],
  },
  {
    code: 'ERR-3003',
    category: ERROR_CODE_CATEGORIES.BROWSER,
    title: 'Required Element Not Found',
    description: 'Could not find expected element on the page.',
    causes: [
      'Website layout has changed',
      'Page loaded but content is missing',
      'JavaScript failed to render content',
      'Different page version than expected',
    ],
    solutions: [
      'Try refreshing the page',
      'Verify you\'re on the correct page',
      'Use manual setup to complete the process',
      'Report issue if problem persists',
    ],
  },
  {
    code: 'ERR-3004',
    category: ERROR_CODE_CATEGORIES.BROWSER,
    title: 'Automation Process Timeout',
    description: 'Automated process exceeded maximum allowed time.',
    causes: [
      'Process taking longer than expected',
      'Waiting for user interaction that never came',
      'Page not responding to automation commands',
      'Network delays causing slowdown',
    ],
    solutions: [
      'Try the automated process again',
      'Use manual setup for more control',
      'Check network connection stability',
      'Verify target website is functioning properly',
    ],
  },
  {
    code: 'ERR-3005',
    category: ERROR_CODE_CATEGORIES.BROWSER,
    title: 'Screenshot Capture Failed',
    description: 'Failed to capture screenshot during automation.',
    causes: [
      'Insufficient disk space',
      'Permission issues writing screenshot file',
      'Browser window not visible',
      'Memory constraints',
    ],
    solutions: [
      'Check available disk space',
      'Verify write permissions in temp directory',
      'Automation can continue despite screenshot failure',
    ],
  },

  // Authentication Errors (4xxx)
  {
    code: 'ERR-4001',
    category: ERROR_CODE_CATEGORIES.AUTH,
    title: 'Invalid Credentials',
    description: 'The provided username or password is incorrect.',
    causes: [
      'Incorrect username or password entered',
      'Account credentials have changed',
      'Client ID or Secret is invalid',
      'Credentials expired or revoked',
    ],
    solutions: [
      'Double-check username and password',
      'Verify Client ID and Client Secret are correct',
      'Generate new OAuth2 credentials in InControl2',
      'Check for extra spaces or hidden characters',
      'Ensure credentials haven\'t been revoked',
    ],
  },
  {
    code: 'ERR-4002',
    category: ERROR_CODE_CATEGORIES.AUTH,
    title: 'Login Failed',
    description: 'Failed to log in with the provided credentials.',
    causes: [
      'Invalid credentials',
      'Account locked or suspended',
      'Too many failed login attempts',
      'Server authentication service unavailable',
    ],
    solutions: [
      'Verify credentials are correct',
      'Check if account is active and not locked',
      'Wait a few minutes if rate limited',
      'Try logging in manually to verify account status',
      'Contact administrator if account is locked',
    ],
  },
  {
    code: 'ERR-4003',
    category: ERROR_CODE_CATEGORIES.AUTH,
    title: 'Multi-Factor Authentication Required',
    description: 'Account requires MFA which is not currently supported.',
    causes: [
      'Account has MFA enabled',
      'Organization requires MFA for all accounts',
    ],
    solutions: [
      'Automated setup does not support MFA',
      'Use manual setup instead',
      'Create a service account without MFA for API access',
      'Contact administrator about MFA requirements',
    ],
  },
  {
    code: 'ERR-4004',
    category: ERROR_CODE_CATEGORIES.AUTH,
    title: 'Session Expired',
    description: 'Your authentication session has expired.',
    causes: [
      'Session timeout reached',
      'Credentials were revoked',
      'Token expired naturally',
      'System time out of sync',
    ],
    solutions: [
      'Re-authenticate with your credentials',
      'Click "Reconnect" to refresh your session',
      'Verify system time is correct',
      'Generate new OAuth2 credentials if problem persists',
    ],
  },
  {
    code: 'ERR-4005',
    category: ERROR_CODE_CATEGORIES.AUTH,
    title: 'OAuth Token Not Found',
    description: 'OAuth2 access token could not be retrieved after login.',
    causes: [
      'OAuth2 credentials not properly configured',
      'Token retrieval endpoint failed',
      'Credentials stored incorrectly',
    ],
    solutions: [
      'Verify OAuth2 Client ID and Secret are correct',
      'Try logging in again',
      'Clear browser storage and re-authenticate',
      'Check backend logs for OAuth2 errors',
    ],
  },

  // Network/Connection Errors (5xxx)
  {
    code: 'ERR-5001',
    category: ERROR_CODE_CATEGORIES.NETWORK,
    title: 'Network Error',
    description: 'A network error occurred while processing the request.',
    causes: [
      'Internet connection lost',
      'DNS resolution failed',
      'Firewall blocking the connection',
      'Server is unreachable',
      'SSL/TLS certificate error',
    ],
    solutions: [
      'Check your internet connection',
      'Verify the server URL is correct',
      'Check firewall settings',
      'Verify DNS is resolving correctly',
      'Try accessing the server in a browser',
      'Check if SSL certificate is valid',
    ],
  },
  {
    code: 'ERR-5002',
    category: ERROR_CODE_CATEGORIES.NETWORK,
    title: 'Connection Timeout',
    description: 'Connection to the server timed out.',
    causes: [
      'Server is not responding',
      'Network latency too high',
      'Firewall blocking connection',
      'Server overloaded with requests',
    ],
    solutions: [
      'Check server is online and accessible',
      'Verify network connection is stable',
      'Try again in a few moments',
      'Check for network firewall rules blocking connection',
      'Contact server administrator if problem persists',
    ],
  },
  {
    code: 'ERR-5003',
    category: ERROR_CODE_CATEGORIES.NETWORK,
    title: 'Invalid URL',
    description: 'The provided URL is invalid or malformed.',
    causes: [
      'URL missing protocol (http:// or https://)',
      'Invalid characters in URL',
      'Incorrect URL format',
      'Typo in URL',
    ],
    solutions: [
      'Verify URL includes http:// or https://',
      'Check for typos in the URL',
      'Ensure URL follows format: https://example.com',
      'Remove any extra spaces or special characters',
    ],
  },

  // Validation Errors (6xxx)
  {
    code: 'ERR-6001',
    category: ERROR_CODE_CATEGORIES.VALIDATION,
    title: 'Validation Error',
    description: 'Input validation failed for one or more fields.',
    causes: [
      'Field value doesn\'t meet requirements',
      'Invalid format for the input type',
      'Value out of acceptable range',
      'Required field is empty',
    ],
    solutions: [
      'Check error message for specific field requirements',
      'Verify all required fields are filled',
      'Ensure values match expected format',
      'Review validation rules in documentation',
    ],
  },
  {
    code: 'ERR-6002',
    category: ERROR_CODE_CATEGORIES.VALIDATION,
    title: 'Invalid Email Format',
    description: 'The provided email address format is invalid.',
    causes: [
      'Missing @ symbol',
      'Invalid characters in email',
      'Missing domain name',
      'Incorrect email format',
    ],
    solutions: [
      'Use format: user@example.com',
      'Check for typos in email address',
      'Remove spaces or special characters',
      'Verify domain name is correct',
    ],
  },
  {
    code: 'ERR-6003',
    category: ERROR_CODE_CATEGORIES.VALIDATION,
    title: 'Invalid Password Format',
    description: 'The provided password does not meet requirements.',
    causes: [
      'Password too short',
      'Missing required character types',
      'Contains invalid characters',
      'Doesn\'t meet complexity requirements',
    ],
    solutions: [
      'Check password requirements (length, complexity)',
      'Include uppercase, lowercase, numbers, special characters',
      'Ensure password meets minimum length',
      'Avoid common or weak passwords',
    ],
  },

  // System/Browser Errors (7xxx)
  {
    code: 'ERR-CRYPTO',
    category: ERROR_CODE_CATEGORIES.SYSTEM,
    title: 'Web Crypto API Unavailable',
    description: 'The browser Web Crypto API is not available in this context.',
    causes: [
      'Accessing the app over HTTP with an IP address',
      'Accessing over HTTP from a non-localhost address',
      'Browser does not support Web Crypto API',
    ],
    solutions: [
      'Access the app via http://localhost:2727 instead of IP address',
      'Set up HTTPS with an SSL certificate',
      'Use a modern browser that supports Web Crypto API',
      'If using SSH tunnel or port forwarding, access via localhost',
    ],
  },
];

/**
 * Get error code information by code
 */
export function getErrorCodeInfo(code: string): ErrorCodeInfo | undefined {
  return ERROR_CODES_REFERENCE.find(item => item.code === code);
}

/**
 * Get all error codes by category
 */
export function getErrorCodesByCategory(category: string): ErrorCodeInfo[] {
  return ERROR_CODES_REFERENCE.filter(item => item.category === category);
}

/**
 * Search error codes by keyword
 */
export function searchErrorCodes(query: string): ErrorCodeInfo[] {
  const lowerQuery = query.toLowerCase();
  return ERROR_CODES_REFERENCE.filter(item => 
    item.code.toLowerCase().includes(lowerQuery) ||
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.causes.some(cause => cause.toLowerCase().includes(lowerQuery)) ||
    item.solutions.some(solution => solution.toLowerCase().includes(lowerQuery))
  );
}
