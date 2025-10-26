/**
 * Re-authentication Modal Component
 * 
 * Displayed when token expires and manual re-authentication is required.
 * Prompts user to enter credentials again.
 */

import { useState } from 'react';
import { X, Lock, AlertCircle, Loader2 } from 'lucide-react';

interface ReauthModalProps {
  isOpen: boolean;
  onReauth: (username: string, password: string) => Promise<boolean>;
  onCancel: () => void;
}

export function ReauthModal({ isOpen, onReauth, onCancel }: ReauthModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await onReauth(username, password);
      if (success) {
        setUsername('');
        setPassword('');
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError(null);
    onCancel();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div 
        className="w-full max-w-md"
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
            <Lock className="w-6 h-6" style={{ color: '#fdba74' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#e0e0e0' }}>
              Session Expired
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#a0a0a0' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div 
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{ 
              background: 'rgba(249, 115, 22, 0.2)',
              borderLeft: '3px solid rgba(249, 115, 22, 0.4)',
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#fdba74' }} />
            <p className="text-sm" style={{ color: '#fdba74' }}>
              Your session has expired. Please enter your credentials to continue.
            </p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#e0e0e0' }}>
              Username / Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2.5 rounded-lg border transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
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

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 text-sm rounded-lg transition-colors hover:bg-white/10"
              style={{ color: '#a0a0a0' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!username || !password || isLoading}
              className="flex-1 px-6 py-2 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: username && password ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.45)',
                border: '2px solid',
                color: username && password ? '#93c5fd' : '#707070',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
