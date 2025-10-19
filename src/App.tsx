import { useState } from 'react';
import { Network, Settings as SettingsIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Settings } from './components/Settings/Settings';
import { FlowCanvas } from './lib/flow-renderer';
import { useAppStore } from './store/appStore';
import { useAuth } from './hooks/useInControl2';

function App() {
  const { devices, selectedGroup } = useAppStore();
  const { isAuthenticated } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
                  ? 'This group has no devices configured. Check your InControl settings.'
                  : !isAuthenticated
                  ? 'Click the settings button to configure your InControl2 API credentials and get started.'
                  : 'Select a group from the sidebar to visualize your Peplink network devices in 3D isometric view.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
