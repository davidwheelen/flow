/**
 * OAuth2 Token Management Service
 * 
 * Handles token retrieval, storage, expiration checking, and automatic refresh
 */

export interface OAuth2Token {
  access_token: string;
  expires_in: number; // seconds
  token_type: string;
  expiresAt: number; // timestamp when token expires
}

export interface OAuth2Credentials {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
}

/**
 * Retrieve OAuth2 token from InControl2/ICVA
 */
export async function getOAuth2Token(credentials: OAuth2Credentials): Promise<OAuth2Token> {
  const tokenUrl = `${credentials.apiUrl}/api/oauth2/token`;
  
  const formData = new URLSearchParams();
  formData.append('client_id', credentials.clientId);
  formData.append('client_secret', credentials.clientSecret);
  formData.append('grant_type', 'client_credentials');
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OAuth2 token request failed: ${response.status} ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
  }
  
  const data = await response.json();
  
  // Calculate expiration timestamp (now + expires_in - 60s buffer)
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  
  return {
    ...data,
    expiresAt,
  };
}

/**
 * Check if token is expired or about to expire
 */
export function isTokenExpired(token: OAuth2Token | null): boolean {
  if (!token) return true;
  return Date.now() >= token.expiresAt;
}

/**
 * Get valid token - retrieves from storage or fetches new one if expired
 */
export async function getValidToken(credentials: OAuth2Credentials): Promise<string> {
  // Try to get stored token
  const storedToken = getStoredToken();
  
  // If token exists and not expired, use it
  if (storedToken && !isTokenExpired(storedToken)) {
    return storedToken.access_token;
  }
  
  // Token expired or doesn't exist - fetch new one
  const newToken = await getOAuth2Token(credentials);
  storeToken(newToken);
  
  return newToken.access_token;
}

/**
 * Store token in localStorage
 * 
 * Security Note: OAuth2 access tokens are stored in localStorage for automatic refresh.
 * This is a standard practice for browser-based OAuth2 applications because:
 * 1. Tokens are short-lived (expire within hours) and auto-refreshed
 * 2. Tokens have limited scope (API access only, not user credentials)
 * 3. They must be accessible to make API calls from the browser
 * 4. The actual user credentials (Client ID/Secret) are encrypted via secureStorage
 * 5. localStorage is isolated per-origin by browser security (Same-Origin Policy)
 * 
 * Alternative approaches (httpOnly cookies, server-side sessions) would require
 * running a backend proxy for all API calls, which contradicts the goal of
 * direct client-to-InControl2 communication.
 */
function storeToken(token: OAuth2Token): void {
  try {
    localStorage.setItem('ic2_oauth_token', JSON.stringify(token));
  } catch (error) {
    // Handle quota exceeded or other storage errors
    console.error('Failed to store OAuth2 token:', error);
    // Clear old token and retry once
    try {
      localStorage.removeItem('ic2_oauth_token');
      localStorage.setItem('ic2_oauth_token', JSON.stringify(token));
    } catch (retryError) {
      console.error('Failed to store OAuth2 token after retry:', retryError);
      throw new Error('Unable to store authentication token. Please clear browser storage.');
    }
  }
}

/**
 * Validate OAuth2Token structure
 */
function isValidOAuth2Token(data: unknown): data is OAuth2Token {
  if (!data || typeof data !== 'object') return false;
  const token = data as Record<string, unknown>;
  return (
    typeof token.access_token === 'string' &&
    typeof token.expires_in === 'number' &&
    typeof token.token_type === 'string' &&
    typeof token.expiresAt === 'number'
  );
}

/**
 * Get stored token from localStorage
 */
function getStoredToken(): OAuth2Token | null {
  const stored = localStorage.getItem('ic2_oauth_token');
  if (!stored) return null;
  
  try {
    const parsed = JSON.parse(stored);
    return isValidOAuth2Token(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Clear stored token
 */
export function clearToken(): void {
  localStorage.removeItem('ic2_oauth_token');
}
