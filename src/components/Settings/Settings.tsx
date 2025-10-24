/**
 * Settings Modal Component
 * 
 * Tabbed modal for Flow settings:
 * - InControl2 Settings: API credentials configuration
 * - Security: Custom CORS origins management
 */

import { useState } from 'react';
import { Settings as SettingsIcon, X, Shield } from 'lucide-react';
import { ManualSetup } from './ManualSetup';
import { SecuritySettings } from './SecuritySettings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'incontrol2' | 'security';

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [activeMainTab, setActiveMainTab] = useState<TabType>('incontrol2');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" 
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl overflow-hidden flex flex-col"
        style={{
          background: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          minHeight: '600px',
          maxHeight: 'calc(100vh - 80px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6" style={{ color: '#3b82f6' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#e0e0e0' }}>
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: '#a0a0a0' }}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Tabs */}
        <div className="p-6 pb-0 flex-shrink-0">
          <div className="flex gap-2 p-1 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <button
              onClick={() => setActiveMainTab('incontrol2')}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                background: activeMainTab === 'incontrol2' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                color: activeMainTab === 'incontrol2' ? '#93c5fd' : '#a0a0a0',
              }}
              type="button"
            >
              InControl2 Settings
            </button>
            <button
              onClick={() => setActiveMainTab('security')}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              style={{
                background: activeMainTab === 'security' ? 'rgba(59, 130, 246, 0.25)' : 'transparent',
                color: activeMainTab === 'security' ? '#93c5fd' : '#a0a0a0',
              }}
              type="button"
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeMainTab === 'incontrol2' && <ManualSetup />}
          {activeMainTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
