/**
 * React Hooks for InControl2 Authentication and Data
 */

import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';
import { pollingService } from '@/services/pollingService';
import { 
  getCredentials, 
  storeCredentials, 
  clearCredentials, 
  hasCredentials,
  IC2Credentials 
} from '@/services/secureStorage';
import { PeplinkDevice } from '@/types/network.types';

/**
 * Authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  errorCode?: string;
  credentials: IC2Credentials | null;
}

/**
 * Hook for managing authentication
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    errorCode: undefined,
    credentials: null,
  });

  // Load credentials on mount
  useEffect(() => {
    const loadCredentials = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      if (!hasCredentials()) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null,
          errorCode: undefined,
          credentials: null,
        });
        return;
      }

      try {
        const creds = await getCredentials();
        if (creds) {
          authService.setCredentials(creds);
          const isAuth = await authService.testConnection();
          
          setAuthState({
            isAuthenticated: isAuth,
            isLoading: false,
            error: isAuth ? null : 'Failed to authenticate with stored credentials',
            errorCode: undefined,
            credentials: creds,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            error: null,
            errorCode: undefined,
            credentials: null,
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load credentials',
          errorCode: undefined,
          credentials: null,
        });
      }
    };

    loadCredentials();
  }, []);

  /**
   * Login with credentials
   */
  const login = useCallback(async (credentials: IC2Credentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null, errorCode: undefined }));

    try {
      authService.setCredentials(credentials);
      await authService.authenticate();
      await storeCredentials(credentials);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        errorCode: undefined,
        credentials,
      });

      return true;
    } catch (error) {
      let errorMessage = 'Authentication failed';
      let errorCode: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        // Extract error code from custom property or from message
        const errorWithCode = error as Error & { code?: string };
        errorCode = errorWithCode.code || error.message.match(/^(ERR-\d{4})/)?.[1];
      }

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        errorCode: errorCode,
        credentials: null,
      });
      return false;
    }
  }, []);

  /**
   * Logout and clear credentials
   */
  const logout = useCallback(() => {
    authService.logout();
    clearCredentials();
    pollingService.stop();

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      errorCode: undefined,
      credentials: null,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null, errorCode: undefined }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    clearError,
  };
}

/**
 * Device data state
 */
export interface DeviceDataState {
  devices: PeplinkDevice[];
  isLoading: boolean;
  isPolling: boolean;
  error: string | null;
}

/**
 * Hook for managing device data with polling
 */
export function useDeviceData(groupId: string | null, enabled: boolean = true) {
  const [deviceState, setDeviceState] = useState<DeviceDataState>({
    devices: [],
    isLoading: false,
    isPolling: false,
    error: null,
  });

  /**
   * Update devices
   */
  const handleDeviceUpdate = useCallback((devices: PeplinkDevice[]) => {
    setDeviceState(prev => ({
      ...prev,
      devices,
      isLoading: false,
      error: null,
    }));
  }, []);

  /**
   * Handle polling error
   */
  const handlePollingError = useCallback((error: Error) => {
    setDeviceState(prev => ({
      ...prev,
      error: error.message,
      isLoading: false,
    }));
  }, []);

  /**
   * Start/stop polling based on groupId and enabled
   */
  useEffect(() => {
    if (!groupId || !enabled) {
      pollingService.stop();
      setDeviceState(prev => ({
        ...prev,
        isPolling: false,
      }));
      return;
    }

    setDeviceState(prev => ({
      ...prev,
      isLoading: true,
      isPolling: true,
      error: null,
    }));

    pollingService.start(groupId, handleDeviceUpdate, handlePollingError);

    return () => {
      pollingService.stop();
    };
  }, [groupId, enabled, handleDeviceUpdate, handlePollingError]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setDeviceState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Refresh data immediately
   */
  const refresh = useCallback(() => {
    if (groupId) {
      pollingService.stop();
      setDeviceState(prev => ({ ...prev, isLoading: true }));
      pollingService.start(groupId, handleDeviceUpdate, handlePollingError);
    }
  }, [groupId, handleDeviceUpdate, handlePollingError]);

  return {
    ...deviceState,
    clearError,
    refresh,
  };
}
