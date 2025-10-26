import { useState, useEffect } from 'react';
import { Network, Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Settings } from './components/Settings/Settings';
import { ReauthModal } from './components/Modals/ReauthModal';
import { ErrorCodeReferenceModal } from './components/Modals/ErrorCodeReferenceModal';
import { FlowCanvas } from './lib/flow-renderer';
import { useAppStore } from './store/appStore';
import { useAuth } from './hooks/useInControl2';
import { useTokenManager } from './hooks/useTokenManager';

function App() {
  const { devices, selectedGroup } = useAppStore();
  const { isAuthenticated } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [errorCodeModalOpen, setErrorCodeModalOpen] = useState(false);
  const [selectedErrorCode, setSelectedErrorCode] = useState<string | undefined>();
  
  // Token management for auto-refresh and re-auth
  const { showReauthModal, handleReauth, cancelReauth } = useTokenManager();

  // Handler for opening error code modal
  const handleErrorCodeClick = (code: string) => {
    setSelectedErrorCode(code);
    setErrorCodeModalOpen(true);
  };

  // Make error code handler available globally (only if not already set)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const globalWindow = window as Window & { openErrorCodeReference?: (code: string) => void };
      if (!globalWindow.openErrorCodeReference) {
        globalWindow.openErrorCodeReference = handleErrorCodeClick;
      }
    }
  }, []);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Canvas */}
      <div className="flex-1 relative">
        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-4 right-4 z-10 p-3 rounded-lg transition-all hover:scale-105"
          style={{
            background: isAuthenticated ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: `2px solid ${isAuthenticated ? 'rgba(34, 197, 94, 0.45)' : 'rgba(255, 255, 255, 0.45)'}`,
          }}
          title={isAuthenticated ? 'Settings (Connected)' : 'Settings (Not Connected)'}
        >
          <SettingsIcon 
            className="w-5 h-5" 
            style={{ color: isAuthenticated ? '#86efac' : '#e0e0e0' }} 
          />
        </button>

        {devices.length > 0 ? (
          <FlowCanvas
            devices={devices}
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-center">
              <Network className="w-16 h-16 mx-auto mb-4" style={{ color: '#707070' }} />
              <p className="text-xl font-semibold mb-2" style={{ color: '#e0e0e0' }}>
                {selectedGroup ? 'No Devices Found' : 'Welcome to Flow'}
              </p>
              <p className="text-sm max-w-md" style={{ color: '#a0a0a0' }}>
                {selectedGroup
                  ? 'This group has no devices. Check your InControl2 group configuration.'
                  : !isAuthenticated
                  ? 'Configure your InControl2 credentials in Settings to get started.'
                  : 'Select a group from the sidebar to visualize your network devices.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onErrorCodeClick={handleErrorCodeClick}
      />
      
      {/* Re-authentication Modal */}
      <ReauthModal
        isOpen={showReauthModal}
        onReauth={handleReauth}
        onCancel={cancelReauth}
      />

      {/* Error Code Reference Modal */}
      <ErrorCodeReferenceModal
        isOpen={errorCodeModalOpen}
        onClose={() => {
          setErrorCodeModalOpen(false);
          setSelectedErrorCode(undefined);
        }}
        initialErrorCode={selectedErrorCode}
      />
    </div>
  );
}

export default App;
