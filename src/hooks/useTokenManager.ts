/**
 * React Hook for Token Management
 * 
 * Manages token lifecycle with automatic refresh or manual re-authentication.
 * Initializes TokenManager and handles re-auth modal state.
 */

import { useEffect, useState, useCallback } from 'react';
import { tokenManager } from '@/services/tokenManager';

export interface UseTokenManagerResult {
  showReauthModal: boolean;
  handleReauth: (username: string, password: string) => Promise<boolean>;
  cancelReauth: () => void;
}

/**
 * Hook to manage token lifecycle
 */
export function useTokenManager(): UseTokenManagerResult {
  const [showReauthModal, setShowReauthModal] = useState(false);

  // Initialize token manager on mount
  useEffect(() => {
    // Start monitoring token expiry
    tokenManager.start(() => {
      // Show re-auth modal when token is about to expire
      setShowReauthModal(true);
    });

    // Cleanup on unmount
    return () => {
      tokenManager.stop();
    };
  }, []);

  /**
   * Handle manual re-authentication
   */
  const handleReauth = useCallback(async (username: string, password: string): Promise<boolean> => {
    const success = await tokenManager.handleManualReauth(username, password);
    
    if (success) {
      setShowReauthModal(false);
    }
    
    return success;
  }, []);

  /**
   * Cancel re-authentication (close modal)
   */
  const cancelReauth = useCallback(() => {
    setShowReauthModal(false);
  }, []);

  return {
    showReauthModal,
    handleReauth,
    cancelReauth,
  };
}
