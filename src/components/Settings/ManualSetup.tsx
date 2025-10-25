/**
 * Manual Setup Component
 * 
 * Provides UI for manual InControl2/ICVA credential configuration with
 * step-by-step instructions and connection testing.
 */

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Lock, Eye, EyeOff, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useInControl2';
import { IC2Credentials, maskString } from '@/services/secureStorage';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ErrorCodeReferenceModal } from '@/components/Modals/ErrorCodeReferenceModal';

interface InstructionPanelProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function InstructionPanel({ title, children, defaultOpen = false }: InstructionPanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border rounded-lg" style={{ borderColor: 'rgba(255,255,255,0.2)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors"
        type="button"
      >
        <span className="text-sm font-medium" style={{ color: '#e0e0e0' }}>
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="p-3 pt-0 text-sm" style={{ color: '#a0a0a0' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export function ManualSetup() {
  const { credentials, login, logout, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<IC2Credentials>({
    apiUrl: 'https://incontrol2.peplink.com',
    clientId: '',
    clientSecret: '',
    orgId: '',
  });
  
  const [showSecrets, setShowSecrets] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; errorCode?: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showErrorReference, setShowErrorReference] = useState(false);
  const [highlightErrorCode, setHighlightErrorCode] = useState<string | undefined>();

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

  const handleErrorCodeClick = (code: string) => {
    setHighlightErrorCode(code);
    setShowErrorReference(true);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    clearError(); // Clear any previous errors

    try {
      // Test connection by attempting to save credentials
      // The login method will call getOAuth2Token internally
      const success = await login(formData);
      
      if (success) {
        setTestResult({
          success: true,
          message: 'Connection successful! Credentials saved and OAuth2 token retrieved.',
        });
        setHasChanges(false);
      }
      // If login returns false, the error will be set in useAuth state
      // and displayed through the error message component below
    } catch (err) {
      // This catch handles unexpected errors that weren't caught by the login function
      // For example, network errors or other exceptions
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const errorCode = errorMessage.match(/^(ERR-\d{4})/)?.[1];
      const cleanMessage = errorMessage.replace(/^ERR-\d{4}:\s*/, '');
      
      setTestResult({
        success: false,
        message: cleanMessage,
        errorCode,
      });
    } finally {
      setIsTesting(false);
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

  const isFormValid = formData.apiUrl && formData.clientId && formData.clientSecret && formData.orgId;
  const hasSavedCredentials = credentials !== null;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="space-y-3">
        <InstructionPanel title="📖 How to get Client ID & Client Secret" defaultOpen={!hasSavedCredentials}>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Log in to your InControl2 account at{' '}
              <a 
                href="https://incontrol2.peplink.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                incontrol2.peplink.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Navigate to <strong>Organization</strong> → <strong>API Access</strong></li>
            <li>Click <strong>"Create New Client"</strong></li>
            <li>Enter an application name (e.g., "Flow - Device Monitor")</li>
            <li>Copy the generated <strong>Client ID</strong> and <strong>Client Secret</strong></li>
            <li className="text-yellow-400">
              ⚠️ Note: The Client Secret is only shown once - save it securely!
            </li>
          </ol>
          <div className="mt-3 p-2 rounded" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <p className="text-xs">
              📚 For detailed instructions, see the{' '}
              <a 
                href="https://incontrol2.peplink.com/api/ic2-api-doc" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                InControl2 API Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </InstructionPanel>

        <InstructionPanel title="🔑 How to get Organization ID">
          <ol className="list-decimal list-inside space-y-2">
            <li>In InControl2, go to <strong>Organization</strong> → <strong>Settings</strong></li>
            <li>Your Organization ID is displayed at the top of the page</li>
            <li>
              Alternatively, it's visible in the URL after logging in:{' '}
              <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)' }}>
                https://incontrol2.peplink.com/m/org/{'<orgId>'}
              </code>
            </li>
          </ol>
        </InstructionPanel>
      </div>

      {/* API URL */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
          API URL
        </label>
        <input
          type="text"
          value={formData.apiUrl}
          onChange={(e) => handleInputChange('apiUrl', e.target.value)}
          placeholder="https://incontrol2.peplink.com or custom ICVA server URL"
          className="w-full px-4 py-2.5 rounded-lg border transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#e0e0e0',
          }}
        />
        <p className="mt-1.5 text-xs" style={{ color: '#a0a0a0' }}>
          Use https://incontrol2.peplink.com for Peplink's cloud service, or enter your custom ICVA server URL
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
            OAuth2 tokens are automatically managed and refreshed.
          </p>
        </div>
      </div>

      {/* Test Result */}
      {testResult && testResult.success && (
        <div 
          className="flex items-start gap-3 p-4 rounded-lg"
          style={{ 
            background: 'rgba(34, 197, 94, 0.15)',
            borderLeft: '3px solid #22c55e',
          }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
          <p className="text-sm" style={{ color: '#86efac' }}>
            {testResult.message}
          </p>
        </div>
      )}

      {/* Error Display - from test result */}
      {testResult && !testResult.success && (
        <ErrorMessage
          message={testResult.message}
          errorCode={testResult.errorCode}
          onErrorCodeClick={handleErrorCodeClick}
        />
      )}

      {/* Error Display - from auth state */}
      {error && !testResult && (
        <ErrorMessage
          message={error}
          onErrorCodeClick={handleErrorCodeClick}
        />
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div>
          {hasSavedCredentials && (
            <button
              onClick={handleClearCredentials}
              className="px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
              style={{ color: '#ef4444' }}
              type="button"
            >
              Clear Credentials
            </button>
          )}
        </div>
        <div className="flex gap-3">
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
            type="button"
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

      {/* Error Code Reference Modal */}
      <ErrorCodeReferenceModal
        isOpen={showErrorReference}
        onClose={() => {
          setShowErrorReference(false);
          setHighlightErrorCode(undefined);
        }}
        initialErrorCode={highlightErrorCode}
      />
    </div>
  );
}
