/**
 * Auto Setup Component
 * 
 * Provides UI for automatic credential retrieval using headless browser automation.
 * Users can enter their InControl2/ICVA credentials and automatically retrieve OAuth credentials.
 */

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { autoRetrieveCredentials, AutoSetupParams } from '@/services/autoCredentials';

interface AutoSetupProps {
  onSuccess: () => void;
}

export function AutoSetup({ onSuccess: _onSuccess }: AutoSetupProps) {
  const [formData, setFormData] = useState<AutoSetupParams>({
    url: 'https://incontrol2.peplink.com',
    username: '',
    password: '',
    appName: 'Flow - Device Monitor',
  });

  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleInputChange = (field: keyof AutoSetupParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const handleAutoSetup = async () => {
    setIsLoading(true);
    setResult(null);
    setProgress({ step: 'Starting...', percent: 0 });
    
    // Feature disabled in browser - show error
    const autoResult = await autoRetrieveCredentials(formData, (step, percent) => {
      setProgress({ step, percent });
    });

    setResult({
      success: false,
      message: autoResult.error || 'Feature not available',
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div 
        className="flex items-start gap-3 p-4 rounded-lg"
        style={{ 
          background: 'rgba(245, 158, 11, 0.15)',
          borderLeft: '3px solid #f59e0b',
        }}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#fbbf24' }}>
            Feature Not Available in Browser
          </p>
          <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
            Automatic credential retrieval requires a backend service to run headless browser automation.
            This feature is currently disabled in browser-only deployments. Please use the Manual Setup tab instead.
          </p>
        </div>
      </div>

      {/* URL Selection */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
          InControl2 / ICVA URL
        </label>
        <select
          value={formData.url}
          onChange={(e) => handleInputChange('url', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#e0e0e0',
          }}
        >
          <option value="https://incontrol2.peplink.com">InControl2 (Peplink Cloud)</option>
          <option value="custom">Custom ICVA Server</option>
        </select>
      </div>

      {/* Custom URL Input */}
      {formData.url === 'custom' && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
            Custom ICVA Server URL
          </label>
          <input
            type="text"
            value={formData.url !== 'custom' ? formData.url : ''}
            onChange={(e) => handleInputChange('url', e.target.value)}
            placeholder="https://your-icva-server.com"
            className="w-full px-4 py-2.5 rounded-lg border transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#e0e0e0',
            }}
          />
        </div>
      )}

      {/* Username */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
          Username / Email
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          placeholder="Enter your InControl2/ICVA username or email"
          className="w-full px-4 py-2.5 rounded-lg border transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#e0e0e0',
          }}
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2.5 rounded-lg border transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#e0e0e0',
          }}
        />
      </div>

      {/* Application Name */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
          Application Name (Optional)
        </label>
        <input
          type="text"
          value={formData.appName}
          onChange={(e) => handleInputChange('appName', e.target.value)}
          placeholder="Flow - Device Monitor"
          className="w-full px-4 py-2.5 rounded-lg border transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#e0e0e0',
          }}
        />
      </div>

      {/* Token Refresh Settings */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#e0e0e0' }}>
          Token Refresh Settings
        </label>
        <div className="space-y-2">
          <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
            <input
              type="radio"
              name="refreshMode"
              checked={!autoRefresh}
              onChange={() => setAutoRefresh(false)}
              className="mt-1"
            />
            <div>
              <div className="text-sm font-medium" style={{ color: '#e0e0e0' }}>
                Prompt me to login again (more secure)
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#a0a0a0' }}>
                You'll be asked to re-enter credentials when session expires
              </div>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5">
            <input
              type="radio"
              name="refreshMode"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(true)}
              className="mt-1"
            />
            <div>
              <div className="text-sm font-medium" style={{ color: '#e0e0e0' }}>
                Auto-refresh automatically (more convenient)
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#a0a0a0' }}>
                Credentials stored encrypted for automatic token refresh
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Progress Display */}
      {isLoading && (
        <div 
          className="flex items-center gap-3 p-4 rounded-lg"
          style={{ 
            background: 'rgba(59, 130, 246, 0.15)',
            borderLeft: '3px solid #3b82f6',
          }}
        >
          <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" style={{ color: '#3b82f6' }} />
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: '#93c5fd' }}>
              {progress.step}
            </p>
            <div className="mt-2 w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${progress.percent}%`,
                  background: '#3b82f6',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div 
          className="flex items-start gap-3 p-4 rounded-lg"
          style={{ 
            background: result.success ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            borderLeft: `3px solid ${result.success ? '#22c55e' : '#ef4444'}`,
          }}
        >
          {result.success ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          )}
          <p className="text-sm" style={{ color: result.success ? '#86efac' : '#fca5a5' }}>
            {result.message}
          </p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleAutoSetup}
        disabled={true}
        className="w-full px-6 py-3 text-sm font-medium rounded-lg transition-all opacity-50 cursor-not-allowed"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid',
          color: '#707070',
        }}
      >
        Feature Not Available (Browser-Only Deployment)
      </button>
    </div>
  );
}
