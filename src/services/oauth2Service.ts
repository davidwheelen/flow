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
 */
function storeToken(token: OAuth2Token): void {
  localStorage.setItem('ic2_oauth_token', JSON.stringify(token));
}

/**
 * Get stored token from localStorage
 */
function getStoredToken(): OAuth2Token | null {
  const stored = localStorage.getItem('ic2_oauth_token');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as OAuth2Token;
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
