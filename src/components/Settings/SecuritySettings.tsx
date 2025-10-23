/**
 * Security Settings Component
 * 
 * Manages custom allowed origins for CORS policy.
 * Features info banner, origin list, and add origin form.
 */

import { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, AlertCircle, CheckCircle, Loader2, Info } from 'lucide-react';
import axios from 'axios';

interface CustomOrigin {
  id: string;
  origin: string;
  description?: string;
  createdAt: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export function SecuritySettings() {
  const [origins, setOrigins] = useState<CustomOrigin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [newOrigin, setNewOrigin] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Load origins on mount
  useEffect(() => {
    loadOrigins();
  }, []);

  const loadOrigins = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/security/origins`);
      if (response.data.success) {
        setOrigins(response.data.origins);
      }
    } catch (err) {
      setError('Failed to load custom origins');
      console.error('Error loading origins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrigin = async () => {
    if (!newOrigin.trim()) return;

    // Validate URL format
    try {
      new URL(newOrigin);
    } catch {
      setError('Invalid URL format. Please enter a valid URL like http://example.com:8080');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/security/origins`, {
        origin: newOrigin.trim(),
        description: newDescription.trim() || undefined,
      });

      if (response.data.success) {
        setSuccess('Origin added successfully!');
        setNewOrigin('');
        setNewDescription('');
        await loadOrigins();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError('Failed to add origin');
      }
      console.error('Error adding origin:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveOrigin = async (id: string) => {
    if (!confirm('Are you sure you want to remove this custom origin?')) {
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const response = await axios.delete(`${BACKEND_URL}/api/security/origins/${id}`);
      
      if (response.data.success) {
        setSuccess('Origin removed successfully!');
        await loadOrigins();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to remove origin');
      console.error('Error removing origin:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div 
        className="flex items-start gap-3 p-4 rounded-lg"
        style={{ 
          background: 'rgba(59, 130, 246, 0.15)',
          borderLeft: '3px solid #3b82f6',
        }}
      >
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#3b82f6' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: '#93c5fd' }}>
            Default Port 2727 Behavior
          </p>
          <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
            Flow automatically allows requests from any IP address on port 2727.
            This works out-of-the-box for 99% of users. Only add custom origins if you need to access Flow from a different port.
          </p>
        </div>
      </div>

      {/* Custom Origins List */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5" style={{ color: '#3b82f6' }} />
          <h3 className="text-lg font-semibold" style={{ color: '#e0e0e0' }}>
            Custom Allowed Origins
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#3b82f6' }} />
          </div>
        ) : origins.length === 0 ? (
          <div 
            className="p-6 rounded-lg text-center"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
            }}
          >
            <p className="text-sm" style={{ color: '#a0a0a0' }}>
              No custom origins configured. Port 2727 is allowed by default.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {origins.map((origin) => (
              <div
                key={origin.id}
                className="flex items-start justify-between p-4 rounded-lg"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex-1">
                  <p className="font-mono text-sm" style={{ color: '#e0e0e0' }}>
                    {origin.origin}
                  </p>
                  {origin.description && (
                    <p className="text-xs mt-1" style={{ color: '#a0a0a0' }}>
                      {origin.description}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: '#707070' }}>
                    Added {new Date(origin.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveOrigin(origin.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                  style={{ color: '#ef4444' }}
                  title="Remove origin"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Origin Form */}
      <div>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#e0e0e0' }}>
          Add Custom Origin
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a0a0a0' }}>
              Origin URL
            </label>
            <input
              type="text"
              value={newOrigin}
              onChange={(e) => setNewOrigin(e.target.value)}
              placeholder="http://192.168.1.100:8080"
              className="w-full px-3 py-2 rounded-lg border text-sm transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a0a0a0' }}>
              Description (Optional)
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g., VPN access, SSH tunnel"
              className="w-full px-3 py-2 rounded-lg border text-sm transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: '#e0e0e0',
              }}
            />
          </div>

          <button
            onClick={handleAddOrigin}
            disabled={!newOrigin.trim() || isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: newOrigin.trim() ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(59, 130, 246, 0.45)',
              border: '2px solid',
              color: newOrigin.trim() ? '#93c5fd' : '#707070',
            }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Origin
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div 
          className="flex items-start gap-3 p-4 rounded-lg"
          style={{ 
            background: 'rgba(34, 197, 94, 0.15)',
            borderLeft: '3px solid #22c55e',
          }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
          <p className="text-sm" style={{ color: '#86efac' }}>
            {success}
          </p>
        </div>
      )}

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
    </div>
  );
}
