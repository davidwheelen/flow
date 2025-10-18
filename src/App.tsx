import { useEffect } from 'react';
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
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">No devices to display</p>
              <p className="text-sm">
                {selectedGroup
                  ? 'This group has no devices'
                  : 'Select a group from the sidebar to view devices'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
