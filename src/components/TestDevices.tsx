import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { PeplinkDevice } from '@/types/network.types';
import { InControlGroup } from '@/services/groupsService';

// Test component to inject mock devices for demonstration
export function TestDevices() {
  const { setDevices, setGroups, setSelectedGroup } = useAppStore();

  useEffect(() => {
    // Check if we should inject test data (when no real devices are loaded)
    const shouldInjectTestData = new URLSearchParams(window.location.search).get('test') === 'true';
    
    if (shouldInjectTestData) {
      // Inject test groups
      const mockGroups: InControlGroup[] = [
        {
          id: 'group-1',
          name: 'Test Network Group',
          description: 'Demo group for testing',
          device_count: 6,
        },
      ];
      setGroups(mockGroups);
      setSelectedGroup(mockGroups[0]);
      
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
            { id: 1, name: 'WAN1', type: 'ethernet', virtualType: 'wan', status: 'Connected', mac_address: '10:56:CA:68:BA:C1', ip: '73.24.74.112', speed_mbps: 1000 },
            { id: 2, name: 'WAN2', type: 'ethernet', virtualType: 'wan', status: 'Disconnected', mac_address: '10:56:CA:68:BA:C2', speed_mbps: 1000 },
            { id: 3, name: 'LAN1', type: 'lan', status: 'Connected', mac_address: '10:56:CA:68:BA:D1', ip: '192.168.1.2', speed_mbps: 1000 },
            { id: 4, name: 'LAN2', type: 'lan', status: 'Connected', mac_address: '10:56:CA:68:BA:D2', ip: '192.168.1.3', speed_mbps: 1000 },
            { id: 5, name: 'LAN3', type: 'ethernet', status: 'Connected', mac_address: '10:56:CA:68:BA:D3', ip: '192.168.1.4', speed_mbps: 100 },
            { id: 6, name: 'LAN4', type: 'ethernet', status: 'Disconnected', mac_address: '10:56:CA:68:BA:D4', speed_mbps: 10 }
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
            { id: 1, name: 'WAN1', type: 'ethernet', virtualType: 'wan', status: 'Connected', mac_address: '20:67:DB:79:CB:D2', ip: '10.45.23.67', speed_mbps: 1000 },
            { id: 2, name: 'WAN2', type: 'ethernet', virtualType: 'wan', status: 'Connected', mac_address: '20:67:DB:79:CB:D3', ip: '10.45.23.68', speed_mbps: 1000 },
            { id: 3, name: 'WAN3', type: 'cellular', virtualType: 'wan', status: 'Standby', mac_address: '20:67:DB:79:CB:D4', speed_mbps: 0 },
            { id: 4, name: 'LAN1', type: 'lan', status: 'Connected', mac_address: '20:67:DB:79:CB:E1', ip: '192.168.2.2', speed_mbps: 1000 },
            { id: 5, name: 'LAN2', type: 'lan', status: 'Connected', mac_address: '20:67:DB:79:CB:E2', ip: '192.168.2.3', speed_mbps: 1000 },
            { id: 6, name: 'LAN3', type: 'ethernet', status: 'Connected', mac_address: '20:67:DB:79:CB:E3', ip: '192.168.2.4', speed_mbps: 1000 },
            { id: 7, name: 'LAN4', type: 'ethernet', status: 'Disconnected', mac_address: '20:67:DB:79:CB:E4', speed_mbps: 1000 }
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
            { id: 1, name: 'WAN1', type: 'ethernet', virtualType: 'wan', status: 'Connected', mac_address: '30:78:EC:8A:DC:E3', ip: '192.168.3.100', speed_mbps: 1000 },
            { id: 2, name: 'WAN2', type: 'ethernet', virtualType: 'wan', status: 'Disconnected', mac_address: '30:78:EC:8A:DC:E4', speed_mbps: 1000 },
            { id: 3, name: 'LAN1', type: 'lan', status: 'Connected', mac_address: '30:78:EC:8A:DC:F1', ip: '192.168.3.2', speed_mbps: 1000 },
            { id: 4, name: 'LAN2', type: 'lan', status: 'Connected', mac_address: '30:78:EC:8A:DC:F2', ip: '192.168.3.3', speed_mbps: 1000 },
            { id: 5, name: 'LAN3', type: 'ethernet', status: 'Disconnected', mac_address: '30:78:EC:8A:DC:F3', speed_mbps: 100 },
            { id: 6, name: 'LAN4', type: 'ethernet', status: 'Connected', mac_address: '30:78:EC:8A:DC:F4', ip: '192.168.3.4', speed_mbps: 1000 }
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

      console.log('🧪 Test mode enabled: Injecting mock devices and groups', mockDevices);
      setDevices(mockDevices);
    }
  }, [setDevices, setGroups, setSelectedGroup]);

  return null;
}
