import { useState, useEffect, useCallback, useRef } from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { 
  authenticate, 
  getGroups, 
  getDevicesByGroup,
  InControlGroup 
} from '@/services/incontrolApi';
import { loadCredentials, hasStoredCredentials } from '@/services/credentialStorage';

interface AuthState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  hasCredentials: boolean;
}

/**
 * Hook for managing InControl2 authentication
 */
export function useInControl2Auth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isAuthenticating: false,
    error: null,
    hasCredentials: hasStoredCredentials(),
  });

  const authenticateWithCredentials = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isAuthenticating: true, error: null }));
    
    try {
      const credentials = await loadCredentials();
      if (!credentials) {
        setAuthState({
          isAuthenticated: false,
          isAuthenticating: false,
          error: 'No credentials found',
          hasCredentials: false,
        });
        return false;
      }

      await authenticate();
      setAuthState({
        isAuthenticated: true,
        isAuthenticating: false,
        error: null,
        hasCredentials: true,
      });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setAuthState({
        isAuthenticated: false,
        isAuthenticating: false,
        error: errorMessage,
        hasCredentials: hasStoredCredentials(),
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      isAuthenticating: false,
      error: null,
      hasCredentials: hasStoredCredentials(),
    });
  }, []);

  const refreshCredentialStatus = useCallback(() => {
    setAuthState(prev => ({
      ...prev,
      hasCredentials: hasStoredCredentials(),
    }));
  }, []);

  return {
    ...authState,
    authenticate: authenticateWithCredentials,
    logout,
    refreshCredentialStatus,
  };
}

interface PollingOptions {
  enabled?: boolean;
  interval?: number; // in milliseconds
}

/**
 * Hook for polling device data every 30 seconds
 */
export function useDevicePolling(
  groupId: string | null,
  options: PollingOptions = {}
) {
  const { enabled = true, interval = 30000 } = options; // Default 30 seconds
  const [devices, setDevices] = useState<PeplinkDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const fetchDevices = useCallback(async () => {
    if (!groupId || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const devicesData = await getDevicesByGroup(groupId);
      if (isMountedRef.current) {
        setDevices(devicesData);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch devices';
        setError(errorMessage);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [groupId, enabled]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!groupId || !enabled) {
      setDevices([]);
      setLastUpdated(null);
      return;
    }

    // Fetch immediately
    fetchDevices();

    // Set up polling interval
    intervalRef.current = window.setInterval(() => {
      fetchDevices();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [groupId, enabled, interval, fetchDevices]);

  const refetch = useCallback(() => {
    return fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    lastUpdated,
    refetch,
  };
}

/**
 * Hook for fetching and caching groups
 */
export function useInControl2Groups(enabled: boolean = true) {
  const [groups, setGroups] = useState<InControlGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const groupsData = await getGroups();
      setGroups(groupsData);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch groups';
      setError(errorMessage);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const refetch = useCallback(() => {
    return fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    isLoading,
    error,
    refetch,
  };
}
