import { useEffect } from 'react';
import { Network } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { FlowCanvas } from './lib/flow-renderer';
import { useAppStore } from './store/appStore';
import { InControlWebSocket } from './services/incontrolApi';

function App() {
  const { devices, selectedGroup, setDevices, setError } = useAppStore();

  // Setup WebSocket for real-time updates when group is selected
  useEffect(() => {
    if (!selectedGroup) return;

    const ws = new InControlWebSocket(
      selectedGroup.id,
      (updatedDevices) => {
        setDevices(updatedDevices);
      },
      (error) => {
        setError(error.message);
      }
    );

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [selectedGroup, setDevices, setError]);

  return (
    <div className="flex h-screen bg-gray-50">
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
              <Network className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-700 mb-2">
                {selectedGroup ? 'No Devices Found' : 'Welcome to Flow'}
              </p>
              <p className="text-sm text-gray-500 max-w-md">
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
