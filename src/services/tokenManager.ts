/**
 * Token Manager Service
 * 
 * Manages OAuth token lifecycle with automatic refresh or manual re-authentication.
 * Checks token expiry every 5 minutes and handles refresh based on user preference.
 */

import { authService } from './authService';
import { 
  getExtendedCredentials, 
  storeExtendedCredentials, 
  StoredCredentials,
  IC2Credentials 
} from './secureStorage';
import { encryptForAutoRefresh } from './encryption';

// Check token expiry every 5 minutes
const CHECK_INTERVAL = 5 * 60 * 1000;
// Token expires if less than 10 minutes remaining
const EXPIRY_THRESHOLD = 10 * 60 * 1000;

export type ReauthCallback = (username: string, password: string) => Promise<boolean>;

class TokenManager {
  private checkTimer: number | null = null;
  private isRefreshing = false;

  /**
   * Start token expiry monitoring
   */
  start(onReauthRequired?: () => void): void {
    this.stop();
    
    this.checkTimer = window.setInterval(async () => {
      await this.checkTokenExpiry(onReauthRequired);
    }, CHECK_INTERVAL);

    // Check immediately on start
    this.checkTokenExpiry(onReauthRequired);
  }

  /**
   * Stop token expiry monitoring
   */
  stop(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * Check if token is expiring soon and handle refresh
   */
  private async checkTokenExpiry(onReauthRequired?: () => void): Promise<void> {
    if (this.isRefreshing) return;

    try {
      const credentials = await getExtendedCredentials();
      if (!credentials) return;

      const now = Date.now();
      const timeUntilExpiry = credentials.tokenExpiry - now;

      // If token expires in less than 10 minutes
      if (timeUntilExpiry < EXPIRY_THRESHOLD) {
        if (credentials.autoRefresh) {
          await this.autoRefreshToken(credentials);
        } else {
          // Manual mode - notify user to re-authenticate
          if (onReauthRequired) {
            onReauthRequired();
          }
        }
      }
    } catch (error) {
      console.error('Token expiry check failed:', error);
    }
  }

  /**
   * Auto-refresh token using stored credentials
   */
  private async autoRefreshToken(credentials: StoredCredentials): Promise<void> {
    if (!credentials.encryptedUsername || !credentials.encryptedPassword) {
      console.error('Cannot auto-refresh: credentials not stored');
      return;
    }

    this.isRefreshing = true;

    try {
      // Re-authenticate using the auth service with refresh token
      authService.setCredentials(credentials);
      
      try {
        const newToken = await authService.refreshToken();
        
        // Update stored credentials with new token
        const updatedCredentials: StoredCredentials = {
          ...credentials,
          accessToken: newToken,
          tokenExpiry: Date.now() + (3600 * 1000), // Default 1 hour
        };
        
        await storeExtendedCredentials(updatedCredentials);
        console.log('Token auto-refreshed successfully');
      } catch (error) {
        console.error('Auto-refresh failed, will retry:', error);
      }
    } catch (error) {
      console.error('Failed to auto-refresh token:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Handle manual re-authentication
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleManualReauth(_username: string, _password: string): Promise<boolean> {
    try {
      const credentials = await getExtendedCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }

      // Re-authenticate using existing credentials and refresh token
      authService.setCredentials(credentials);
      const newToken = await authService.authenticate();

      // Update stored credentials
      const updatedCredentials: StoredCredentials = {
        ...credentials,
        accessToken: newToken,
        tokenExpiry: Date.now() + (3600 * 1000),
      };

      await storeExtendedCredentials(updatedCredentials);
      return true;
    } catch (error) {
      console.error('Manual re-authentication failed:', error);
      return false;
    }
  }

  /**
   * Store credentials with token data after successful auto-setup
   */
  async storeAutoCredentials(
    credentials: IC2Credentials,
    accessToken: string,
    expiresIn: number,
    autoRefresh: boolean,
    username?: string,
    password?: string
  ): Promise<void> {
    const storedCreds: StoredCredentials = {
      ...credentials,
      accessToken,
      tokenExpiry: Date.now() + (expiresIn * 1000),
      autoRefresh,
    };

    // Encrypt and store username/password if auto-refresh is enabled
    if (autoRefresh && username && password) {
      storedCreds.encryptedUsername = await encryptForAutoRefresh(username);
      storedCreds.encryptedPassword = await encryptForAutoRefresh(password);
    }

    await storeExtendedCredentials(storedCreds);
  }

  /**
   * Get current token expiry info
   */
  async getTokenInfo(): Promise<{ expiresAt: number; autoRefresh: boolean } | null> {
    const credentials = await getExtendedCredentials();
    if (!credentials) return null;

    return {
      expiresAt: credentials.tokenExpiry,
      autoRefresh: credentials.autoRefresh,
    };
  }
}

// Singleton instance
export const tokenManager = new TokenManager();
