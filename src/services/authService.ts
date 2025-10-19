/**
 * InControl2 Authentication Service
 * 
 * Handles OAuth 2.0 authentication with InControl2 API.
 * Supports both incontrol2.peplink.com and custom ICVA servers.
 */

import axios, { AxiosInstance } from 'axios';
import { IC2Credentials } from './secureStorage';

/**
 * Token response from OAuth2
 */
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

/**
 * Token data with expiration
 */
interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

/**
 * Authentication state
 */
export class AuthService {
  private tokenData: TokenData | null = null;
  private apiClient: AxiosInstance;
  private credentials: IC2Credentials | null = null;
  private refreshTimer: number | null = null;

  constructor() {
    this.apiClient = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initialize with credentials
   */
  setCredentials(credentials: IC2Credentials): void {
    this.credentials = credentials;
    this.apiClient.defaults.baseURL = credentials.apiUrl;
  }

  /**
   * Get current credentials
   */
  getCredentials(): IC2Credentials | null {
    return this.credentials;
  }

  /**
   * Authenticate with InControl2
   */
  async authenticate(): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    try {
      const response = await this.apiClient.post<TokenResponse>('/api/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        org_id: this.credentials.orgId,
      });

      const { access_token, expires_in, refresh_token } = response.data;
      
      // Store token with expiration time (subtract 60s for safety margin)
      this.tokenData = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + (expires_in - 60) * 1000,
      };

      // Set authorization header
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      // Schedule token refresh
      this.scheduleTokenRefresh(expires_in - 60);

      return access_token;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with InControl2 API');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    if (!this.credentials || !this.tokenData?.refreshToken) {
      // No refresh token, re-authenticate
      return await this.authenticate();
    }

    try {
      const response = await this.apiClient.post<TokenResponse>('/api/oauth2/token', {
        grant_type: 'refresh_token',
        refresh_token: this.tokenData.refreshToken,
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
      });

      const { access_token, expires_in, refresh_token } = response.data;
      
      this.tokenData = {
        accessToken: access_token,
        refreshToken: refresh_token || this.tokenData.refreshToken,
        expiresAt: Date.now() + (expires_in - 60) * 1000,
      };

      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      this.scheduleTokenRefresh(expires_in - 60);

      return access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Refresh failed, try full re-authentication
      return await this.authenticate();
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(expiresInSeconds: number): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = window.setTimeout(() => {
      this.refreshToken().catch(error => {
        console.error('Automatic token refresh failed:', error);
      });
    }, expiresInSeconds * 1000);
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getAccessToken(): Promise<string> {
    if (!this.tokenData) {
      return await this.authenticate();
    }

    // Check if token is expired or about to expire
    if (Date.now() >= this.tokenData.expiresAt) {
      return await this.refreshToken();
    }

    return this.tokenData.accessToken;
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenData !== null && Date.now() < this.tokenData.expiresAt;
  }

  /**
   * Get API client with automatic token handling
   */
  getApiClient(): AxiosInstance {
    // Add request interceptor to ensure valid token
    this.apiClient.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return this.apiClient;
  }

  /**
   * Logout and clear tokens
   */
  logout(): void {
    this.tokenData = null;
    this.credentials = null;
    delete this.apiClient.defaults.headers.common['Authorization'];
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Test connection with current credentials
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.authenticate();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
export const authService = new AuthService();
