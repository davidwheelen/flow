import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { PeplinkDevice } from '@/types/network.types';

// Test component to inject mock devices for demonstration
export function TestDevices() {
  const { setDevices } = useAppStore();

  useEffect(() => {
    // Check if we should inject test data (when no real devices are loaded)
    const shouldInjectTestData = new URLSearchParams(window.location.search).get('test') === 'true';
    
    if (shouldInjectTestData) {
      const mockDevices: PeplinkDevice[] = [
        // Main Router (HQ)
        {
          id: 'device-1',
          name: 'Balance 20X - HQ Router',
          model: 'Balance 20X',
          serial: 'SN-2024-001',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.1.1',
          lanClients: [
            { mac: 'AA:BB:CC:DD:EE:01', sn: 'SN-2024-008', ip: '192.168.1.10', name: 'AP One HQ' },
            { mac: 'AA:BB:CC:DD:EE:02', sn: 'SN-2024-009', ip: '192.168.1.11', name: 'AP Two HQ' }
          ],
          interfaces: [
            { id: 1, name: 'WAN1', type: 'ethernet', status: 'connected', mac_address: '10:56:CA:68:BA:C1', ip: '73.24.74.112' }
          ],
          connections: [
            { 
              id: 'device-1-to-device-8', 
              type: 'lan', 
              status: 'connected',
              device_id: 'device-8',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'device-1-to-device-9', 
              type: 'lan', 
              status: 'connected',
              device_id: 'device-9',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'device-1-to-device-2', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-2',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        // Branch Router
        {
          id: 'device-2',
          name: 'Balance 310X - Branch Router',
          model: 'Balance 310X',
          serial: 'SN-2024-002',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.2.1',
          lanClients: [
            { mac: 'BB:CC:DD:EE:FF:01', sn: 'SN-2024-010', ip: '192.168.2.10', name: 'AP One Branch' }
          ],
          interfaces: [
            { id: 1, name: 'WAN1', type: 'ethernet', status: 'connected', mac_address: '20:67:DB:79:CB:D2', ip: '10.45.23.67' }
          ],
          connections: [
            { 
              id: 'device-2-to-device-1', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-1',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'device-2-to-device-10', 
              type: 'lan', 
              status: 'connected',
              device_id: 'device-10',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'device-2-to-device-3', 
              type: 'wan', 
              status: 'connected',
              device_id: 'device-3',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        // Office Router
        {
          id: 'device-3',
          name: 'Balance 380 - Office Router',
          model: 'Balance 380',
          serial: 'SN-2024-003',
          firmware_version: '8.2.5',
          status: 'online',
          ipAddress: '192.168.3.1',
          lanClients: [],
          interfaces: [
            { id: 1, name: 'WAN1', type: 'ethernet', status: 'connected', mac_address: '30:78:EC:8A:DC:E3', ip: '192.168.3.100' }
          ],
          connections: [
            { 
              id: 'device-3-to-device-2', 
              type: 'wan', 
              status: 'connected',
              device_id: 'device-2',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        // Access Point 1 - HQ
        {
          id: 'device-8',
          name: 'AP One HQ',
          model: 'AP One AC Mini',
          serial: 'SN-2024-008',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.1.10',
          lanClients: [],
          interfaces: [
            { id: 1, name: 'LAN', type: 'ethernet', status: 'connected', mac_address: 'AA:BB:CC:DD:EE:01', ip: '192.168.1.10' },
            { id: 2, name: 'WiFi', type: 'wifi', status: 'connected', mac_address: 'AA:BB:CC:DD:EE:11', ip: '192.168.1.10' }
          ],
          connections: [
            { 
              id: 'device-8-to-device-1', 
              type: 'lan', 
              status: 'connected',
              device_id: 'device-1',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'device-8-to-device-9', 
              type: 'wifi', 
              status: 'connected',
              device_id: 'device-9',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        // Access Point 2 - HQ
        {
          id: 'device-9',
          name: 'AP Two HQ',
          model: 'AP One AC Mini',
          serial: 'SN-2024-009',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.1.11',
          lanClients: [],
          interfaces: [
            { id: 1, name: 'LAN', type: 'ethernet', status: 'connected', mac_address: 'AA:BB:CC:DD:EE:02', ip: '192.168.1.11' },
            { id: 2, name: 'WiFi', type: 'wifi', status: 'connected', mac_address: 'AA:BB:CC:DD:EE:22', ip: '192.168.1.11' }
          ],
          connections: [
            { 
              id: 'device-9-to-device-1', 
              type: 'lan', 
              status: 'connected',
              device_id: 'device-1',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'device-9-to-device-8', 
              type: 'wifi', 
              status: 'connected',
              device_id: 'device-8',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        // Access Point - Branch
        {
          id: 'device-10',
          name: 'AP One Branch',
          model: 'AP One AC Mini',
          serial: 'SN-2024-010',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.2.10',
          lanClients: [],
          interfaces: [
            { id: 1, name: 'LAN', type: 'ethernet', status: 'connected', mac_address: 'BB:CC:DD:EE:FF:01', ip: '192.168.2.10' }
          ],
          connections: [
            { 
              id: 'device-10-to-device-2', 
              type: 'lan', 
              status: 'connected',
              device_id: 'device-2',
              metrics: { speedMbps: 1000, latencyMs: 1, uploadMbps: 500, downloadMbps: 500 } 
            }
          ],
          position: { x: 0, y: 0 }
        }
      ];

      console.log('🧪 Test mode enabled: Injecting mock devices', mockDevices);
      setDevices(mockDevices);
    }
  }, [setDevices]);

  return null;
}
