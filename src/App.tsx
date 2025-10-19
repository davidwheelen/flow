import { useEffect } from 'react';
import { Network } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FlowCanvas } from './lib/flow-renderer';
import { useAppStore } from './store/appStore';
import { useDevicePolling } from './hooks/useInControl2';

function App() {
  const { devices, selectedGroup, setDevices, setError } = useAppStore();

  // Use polling hook instead of WebSocket for 30-second updates
  const { 
    devices: polledDevices, 
    error: pollingError 
  } = useDevicePolling(
    selectedGroup?.id || null,
    { enabled: !!selectedGroup, interval: 30000 } // 30 seconds
  );

  // Update devices when polling completes
  useEffect(() => {
    if (polledDevices.length > 0) {
      setDevices(polledDevices);
    }
  }, [polledDevices, setDevices]);

  // Update error state
  useEffect(() => {
    if (pollingError) {
      setError(pollingError);
    }
  }, [pollingError, setError]);

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Canvas */}
      <div className="flex-1 relative">
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
                  : 'Select a group from the sidebar to visualize your Peplink network devices in 3D isometric view.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
