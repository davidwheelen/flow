/**
 * Settings Component
 * 
 * Glassmorphism UI for configuring InControl2 API credentials.
 * Features encrypted storage and masked credential display.
 */

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, X, Eye, EyeOff, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useInControl2';
import { IC2Credentials, maskString } from '@/services/secureStorage';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { credentials, login, logout, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<IC2Credentials>({
    apiUrl: 'https://incontrol2.peplink.com',
    clientId: '',
    clientSecret: '',
    orgId: '',
  });
  
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load credentials when component mounts
  useEffect(() => {
    if (credentials) {
      setFormData(credentials);
      setHasChanges(false);
    }
  }, [credentials]);

  // Reset test result when form changes
  useEffect(() => {
    setTestResult(null);
  }, [formData]);

  const handleInputChange = (field: keyof IC2Credentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    clearError();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const success = await login(formData);
    
    setIsTesting(false);
    setTestResult({
      success,
      message: success 
        ? 'Connection successful! Credentials saved.' 
        : error || 'Connection failed',
    });

    if (success) {
      setHasChanges(false);
    }
  };

  const handleClearCredentials = () => {
    logout();
    setFormData({
      apiUrl: 'https://incontrol2.peplink.com',
      clientId: '',
      clientSecret: '',
      orgId: '',
    });
    setShowSecrets(false);
    setTestResult(null);
    setHasChanges(false);
  };

  const handleClose = () => {
    clearError();
    setTestResult(null);
    onClose();
  };

  if (!isOpen) return null;

  const isFormValid = formData.apiUrl && formData.clientId && formData.clientSecret && formData.orgId;
  const hasSavedCredentials = credentials !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6" style={{ color: '#3b82f6' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#e0e0e0' }}>
              InControl2 Settings
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#a0a0a0' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API URL */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              API URL
            </label>
            <input
              type="text"
              value={formData.apiUrl}
              onChange={(e) => handleInputChange('apiUrl', e.target.value)}
              placeholder="https://incontrol2.peplink.com or custom ICVA server"
              className="w-full px-4 py-2.5 rounded-lg border transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
            />
            <p className="mt-1.5 text-xs" style={{ color: '#a0a0a0' }}>
              Use https://incontrol2.peplink.com or your custom ICVA server URL
            </p>
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              Client ID
            </label>
            <input
              type="text"
              value={hasSavedCredentials && !showSecrets && !hasChanges ? maskString(formData.clientId) : formData.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
              placeholder="Enter your OAuth2 Client ID"
              className="w-full px-4 py-2.5 rounded-lg border transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
              readOnly={hasSavedCredentials && !showSecrets && !hasChanges}
            />
          </div>

          {/* Client Secret */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              Client Secret
            </label>
            <div className="relative">
              <input
                type={showSecrets || hasChanges ? 'text' : 'password'}
                value={hasSavedCredentials && !showSecrets && !hasChanges ? maskString(formData.clientSecret) : formData.clientSecret}
                onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                placeholder="Enter your OAuth2 Client Secret"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#e0e0e0',
                }}
                readOnly={hasSavedCredentials && !showSecrets && !hasChanges}
              />
              {hasSavedCredentials && (
                <button
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-white/10 transition-colors"
                  style={{ color: '#a0a0a0' }}
                  type="button"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Organization ID */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              Organization ID
            </label>
            <input
              type="text"
              value={hasSavedCredentials && !showSecrets && !hasChanges ? maskString(formData.orgId) : formData.orgId}
              onChange={(e) => handleInputChange('orgId', e.target.value)}
              placeholder="Enter your Organization ID"
              className="w-full px-4 py-2.5 rounded-lg border transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
              readOnly={hasSavedCredentials && !showSecrets && !hasChanges}
            />
          </div>

          {/* Security Notice */}
          <div 
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{ 
              background: 'rgba(59, 130, 246, 0.15)',
              borderLeft: '3px solid #3b82f6',
            }}
          >
            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#93c5fd' }}>
                Secure Encrypted Storage
              </p>
              <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
                Your credentials are encrypted using Web Crypto API before being stored locally.
                Credentials are displayed as ••••••• after saving.
              </p>
            </div>
          </div>

          {/* Test Result */}
          {testResult && (
            <div 
              className="flex items-start gap-3 p-4 rounded-lg"
              style={{ 
                background: testResult.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                borderLeft: `3px solid ${testResult.success ? '#22c55e' : '#ef4444'}`,
              }}
            >
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              )}
              <p className="text-sm" style={{ color: testResult.success ? '#86efac' : '#fca5a5' }}>
                {testResult.message}
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && !testResult && (
            <div 
              className="flex items-start gap-3 p-4 rounded-lg"
              style={{ 
                background: 'rgba(239, 68, 68, 0.15)',
                borderLeft: '3px solid #ef4444',
              }}
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <p className="text-sm" style={{ color: '#fca5a5' }}>
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div>
            {hasSavedCredentials && (
              <button
                onClick={handleClearCredentials}
                className="px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
                style={{ color: '#ef4444' }}
              >
                Clear Credentials
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
              style={{ color: '#a0a0a0' }}
            >
              Cancel
            </button>
            <button
              onClick={handleTestConnection}
              disabled={!isFormValid || isTesting || isLoading}
              className="px-6 py-2 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isFormValid ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.45)',
                border: '2px solid',
                color: isFormValid ? '#93c5fd' : '#707070',
              }}
            >
              {isTesting || isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </span>
              ) : (
                'Test & Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
