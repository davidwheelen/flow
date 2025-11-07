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
        {
          id: 'device-1',
          name: 'Balance 20X - HQ',
          model: 'Balance 20X',
          serial: 'SN-2024-001',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.1.1',
          connections: [
            { 
              id: 'conn-1', 
              type: 'wan', 
              status: 'connected', 
              metrics: { speedMbps: 100, latencyMs: 20, uploadMbps: 10, downloadMbps: 90 },
              wanDetails: {
                id: 'wan-1',
                name: 'WAN1 - Xfinity',
                type: 'ethernet',
                status: 'connected',
                ipAddress: '73.24.74.112',
                subnetMask: '255.255.252.0',
                macAddress: '10:56:CA:68:BA:C1',
                gateway: '73.24.72.1',
                dnsServers: ['75.75.75.75', '75.75.76.76', '1.1.1.1', '8.8.4.4'],
                connectionMethod: 'DHCP',
                routingMode: 'NAT',
                mtu: 1500,
                healthCheckMethod: 'PING',
                serviceProvider: 'Xfinity'
              }
            },
            { 
              id: 'conn-vpn-1', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-2', // Connected to Branch office
              metrics: { speedMbps: 50, latencyMs: 15, uploadMbps: 25, downloadMbps: 25 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        {
          id: 'device-2',
          name: 'Balance 310X - Branch',
          model: 'Balance 310X',
          serial: 'SN-2024-002',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.2.1',
          connections: [
            { 
              id: 'conn-2', 
              type: 'cellular', 
              status: 'connected', 
              metrics: { speedMbps: 50, latencyMs: 40, uploadMbps: 5, downloadMbps: 45 },
              wanDetails: {
                id: 'cell-1',
                name: 'Cellular 1 - Verizon',
                type: 'cellular',
                status: 'connected',
                ipAddress: '10.45.23.67',
                gateway: '10.45.23.1',
                dnsServers: ['8.8.8.8', '8.8.4.4'],
                connectionMethod: 'LTE',
                routingMode: 'NAT',
                mtu: 1428,
                healthCheckMethod: 'PING',
                serviceProvider: 'Verizon'
              }
            },
            { 
              id: 'conn-vpn-2', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-1', // Connected to HQ
              metrics: { speedMbps: 50, latencyMs: 15, uploadMbps: 25, downloadMbps: 25 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        {
          id: 'device-3',
          name: 'Balance 380 - Office',
          model: 'Balance 380',
          serial: 'SN-2024-003',
          firmware_version: '8.2.5',
          status: 'online',
          ipAddress: '192.168.3.1',
          connections: [
            { 
              id: 'conn-3', 
              type: 'wifi', 
              status: 'connected', 
              metrics: { speedMbps: 150, latencyMs: 15, uploadMbps: 20, downloadMbps: 130 } 
            },
            { 
              id: 'conn-vpn-3', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-5', // Connected to DataCenter
              metrics: { speedMbps: 200, latencyMs: 8, uploadMbps: 100, downloadMbps: 100 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        {
          id: 'device-4',
          name: 'MAX Transit - Mobile',
          model: 'MAX Transit',
          serial: 'SN-2024-004',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.4.1',
          connections: [
            { 
              id: 'conn-4', 
              type: 'cellular', 
              status: 'connected', 
              metrics: { speedMbps: 80, latencyMs: 30, uploadMbps: 8, downloadMbps: 72 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        {
          id: 'device-5',
          name: 'Balance 2500 - DataCenter',
          model: 'Balance 2500',
          serial: 'SN-2024-005',
          firmware_version: '8.3.1',
          status: 'online',
          ipAddress: '192.168.5.1',
          connections: [
            { 
              id: 'conn-5', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-3', // Connected to Office
              metrics: { speedMbps: 1000, latencyMs: 5, uploadMbps: 500, downloadMbps: 500 } 
            },
            { 
              id: 'conn-vpn-5', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-6', // Connected to Remote
              metrics: { speedMbps: 100, latencyMs: 20, uploadMbps: 50, downloadMbps: 50 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        {
          id: 'device-6',
          name: 'Balance 20X - Remote',
          model: 'Balance 20X',
          serial: 'SN-2024-006',
          firmware_version: '8.3.0',
          status: 'online',
          ipAddress: '192.168.6.1',
          connections: [
            { 
              id: 'conn-6', 
              type: 'wan', 
              status: 'connected', 
              metrics: { speedMbps: 100, latencyMs: 25, uploadMbps: 10, downloadMbps: 90 } 
            },
            { 
              id: 'conn-vpn-6', 
              type: 'sfp', 
              status: 'connected',
              device_id: 'device-5', // Connected to DataCenter
              metrics: { speedMbps: 100, latencyMs: 20, uploadMbps: 50, downloadMbps: 50 } 
            }
          ],
          position: { x: 0, y: 0 }
        },
        {
          id: 'device-7',
          name: 'Balance 30 - Offline',
          model: 'Balance 30',
          serial: 'SN-2024-007',
          firmware_version: '8.2.0',
          status: 'offline',
          ipAddress: '192.168.7.1',
          connections: [
            { 
              id: 'conn-7', 
              type: 'wan', 
              status: 'disconnected', 
              metrics: { speedMbps: 0, latencyMs: 0, uploadMbps: 0, downloadMbps: 0 } 
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
