import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, CheckCircle, Settings as SettingsIcon } from 'lucide-react';
import { 
  saveCredentials, 
  loadCredentials, 
  clearCredentials,
  maskCredential,
  DEFAULT_IC2_URL 
} from '@/services/credentialStorage';
import { GlassButton } from './GlassButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsSaved?: () => void;
}

export function SettingsModal({ isOpen, onClose, onCredentialsSaved }: SettingsModalProps) {
  const [apiUrl, setApiUrl] = useState(DEFAULT_IC2_URL);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isCustomIcva, setIsCustomIcva] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasExistingCredentials, setHasExistingCredentials] = useState(false);

  // Load existing credentials on mount
  useEffect(() => {
    const loadExistingCredentials = async () => {
      const credentials = await loadCredentials();
      if (credentials) {
        setApiUrl(credentials.apiUrl);
        setIsCustomIcva(credentials.isCustomIcva);
        // Show masked credentials
        setClientId(maskCredential(credentials.clientId));
        setClientSecret(maskCredential(credentials.clientSecret));
        setHasExistingCredentials(true);
      }
    };

    if (isOpen) {
      loadExistingCredentials();
      setSaveStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    // Validation
    if (!apiUrl.trim()) {
      setErrorMessage('API URL is required');
      setSaveStatus('error');
      return;
    }

    if (!clientId.trim() || !clientSecret.trim()) {
      setErrorMessage('Client ID and Client Secret are required');
      setSaveStatus('error');
      return;
    }

    // Don't save if credentials haven't changed (still masked)
    if (hasExistingCredentials && clientId.includes('•') && clientSecret.includes('•')) {
      setErrorMessage('Please enter new credentials or keep existing ones');
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      await saveCredentials({
        apiUrl: apiUrl.trim(),
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
        isCustomIcva,
      });

      setSaveStatus('success');
      setHasExistingCredentials(true);
      
      // Mask the credentials after saving
      setClientId(maskCredential(clientId));
      setClientSecret(maskCredential(clientSecret));

      // Notify parent
      if (onCredentialsSaved) {
        onCredentialsSaved();
      }

      // Auto-close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save credentials');
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCredentials = async () => {
    if (!confirm('Are you sure you want to clear all saved credentials?')) {
      return;
    }

    clearCredentials();
    setApiUrl(DEFAULT_IC2_URL);
    setClientId('');
    setClientSecret('');
    setIsCustomIcva(false);
    setHasExistingCredentials(false);
    setSaveStatus('idle');
    setErrorMessage('');
  };

  const handleUrlTypeChange = (custom: boolean) => {
    setIsCustomIcva(custom);
    if (!custom) {
      setApiUrl(DEFAULT_IC2_URL);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div 
        className="liquid-glass-panel w-full max-w-2xl relative"
        style={{ 
          background: 'rgba(30, 30, 30, 0.95)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6" style={{ color: '#3b82f6' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#e0e0e0' }}>
              InControl2 API Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            style={{ color: '#a0a0a0' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ 
            background: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgba(34, 197, 94, 0.5)',
            border: '1px solid'
          }}>
            <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
            <span style={{ color: '#86efac' }}>Credentials saved successfully!</span>
          </div>
        )}

        {saveStatus === 'error' && errorMessage && (
          <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ 
            background: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 0.5)',
            border: '1px solid'
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
            <span style={{ color: '#fca5a5' }}>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* API URL Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: '#e0e0e0' }}>
              InControl2 Instance
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleUrlTypeChange(false)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  !isCustomIcva ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{
                  background: !isCustomIcva ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: !isCustomIcva ? '#93c5fd' : '#a0a0a0'
                }}
              >
                <div className="font-medium text-sm">InControl2 Cloud</div>
                <div className="text-xs mt-1 opacity-75">incontrol2.peplink.com</div>
              </button>
              <button
                onClick={() => handleUrlTypeChange(true)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  isCustomIcva ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{
                  background: isCustomIcva ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                  color: isCustomIcva ? '#93c5fd' : '#a0a0a0'
                }}
              >
                <div className="font-medium text-sm">Custom ICVA</div>
                <div className="text-xs mt-1 opacity-75">Self-hosted instance</div>
              </button>
            </div>
          </div>

          {/* Custom API URL */}
          {isCustomIcva && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
                API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-icva-instance.com"
                className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#e0e0e0'
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
                Enter the URL of your InControl2 Virtual Appliance (ICVA)
              </p>
            </div>
          )}

          {/* Client ID */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              onFocus={(e) => {
                // Clear masked value on focus if it's masked
                if (hasExistingCredentials && e.target.value.includes('•')) {
                  setClientId('');
                }
              }}
              placeholder="Enter your OAuth2 Client ID"
              className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm font-mono"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#e0e0e0'
              }}
            />
          </div>

          {/* Client Secret */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              Client Secret
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              onFocus={(e) => {
                // Clear masked value on focus if it's masked
                if (hasExistingCredentials && e.target.value.includes('•')) {
                  setClientSecret('');
                }
              }}
              placeholder="Enter your OAuth2 Client Secret"
              className="w-full px-4 py-3 rounded-lg border backdrop-blur-sm font-mono"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#e0e0e0'
              }}
            />
            <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
              Credentials are encrypted using Web Crypto API before storage
            </p>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-lg" style={{ 
            background: 'rgba(59, 130, 246, 0.15)',
            borderColor: 'rgba(59, 130, 246, 0.3)',
            border: '1px solid'
          }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: '#93c5fd' }}>
              Getting OAuth2 Credentials
            </h4>
            <ul className="text-xs space-y-1" style={{ color: '#a0a0a0' }}>
              <li>1. Log in to your InControl2 account</li>
              <li>2. Navigate to Organization Settings → API</li>
              <li>3. Create a new OAuth2 application</li>
              <li>4. Copy the Client ID and Client Secret</li>
            </ul>
            <a 
              href="https://www.peplink.com/ic2-api-doc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs mt-2 inline-block underline"
              style={{ color: '#93c5fd' }}
            >
              View API Documentation →
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div>
            {hasExistingCredentials && (
              <button
                onClick={handleClearCredentials}
                className="text-sm underline"
                style={{ color: '#ef4444' }}
              >
                Clear Credentials
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <GlassButton onClick={onClose} variant="secondary">
              Cancel
            </GlassButton>
            <GlassButton 
              onClick={handleSave} 
              variant="primary"
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Credentials
                </>
              )}
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}
