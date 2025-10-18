import { PeplinkDevice, Connection, ConnectionType, ConnectionStatus } from '@/types/network.types';

const connectionStatuses: ConnectionStatus[] = ['connected', 'disconnected', 'degraded'];

function createMockConnection(index: number, type: ConnectionType): Connection {
  const status = connectionStatuses[Math.floor(Math.random() * connectionStatuses.length)];
  const isActive = status === 'connected';
  
  return {
    id: `conn-${index}-${type}`,
    type,
    status,
    metrics: {
      speedMbps: isActive ? Math.floor(Math.random() * 500) + 50 : 0,
      latencyMs: isActive ? Math.floor(Math.random() * 100) + 10 : 0,
      uploadMbps: isActive ? Math.floor(Math.random() * 200) + 20 : 0,
      downloadMbps: isActive ? Math.floor(Math.random() * 400) + 50 : 0,
    },
  };
}

export function getMockDevices(): PeplinkDevice[] {
  return [
    {
      id: 'device-1',
      name: 'HQ Router',
      model: 'Peplink Balance 380',
      ipAddress: '192.168.1.1',
      position: { x: 100, y: 200 },
      connections: [
        createMockConnection(1, 'wan'),
        createMockConnection(1, 'cellular'),
        createMockConnection(1, 'wifi'),
      ],
    },
    {
      id: 'device-2',
      name: 'Branch Office',
      model: 'Peplink Balance 310X',
      ipAddress: '192.168.2.1',
      position: { x: 400, y: 150 },
      connections: [
        createMockConnection(2, 'wan'),
        createMockConnection(2, 'wifi'),
      ],
    },
    {
      id: 'device-3',
      name: 'Mobile Unit',
      model: 'Peplink MAX Transit',
      ipAddress: '192.168.3.1',
      position: { x: 400, y: 350 },
      connections: [
        createMockConnection(3, 'cellular'),
        createMockConnection(3, 'wifi'),
      ],
    },
    {
      id: 'device-4',
      name: 'Data Center',
      model: 'Peplink Balance 2500',
      ipAddress: '192.168.4.1',
      position: { x: 700, y: 200 },
      connections: [
        createMockConnection(4, 'wan'),
        createMockConnection(4, 'sfp'),
        createMockConnection(4, 'cellular'),
      ],
    },
    {
      id: 'device-5',
      name: 'Remote Site',
      model: 'Peplink Balance 20X',
      ipAddress: '192.168.5.1',
      position: { x: 250, y: 450 },
      connections: [
        createMockConnection(5, 'wan'),
        createMockConnection(5, 'cellular'),
      ],
    },
    {
      id: 'device-6',
      name: 'Small Branch',
      model: 'Peplink Balance 210',
      ipAddress: '192.168.6.1',
      position: { x: 100, y: 50 },
      connections: [
        createMockConnection(6, 'wan'),
      ],
    },
    {
      id: 'device-7',
      name: '5G Router',
      model: 'Peplink Balance 305 5G',
      ipAddress: '192.168.7.1',
      position: { x: 250, y: 100 },
      connections: [
        createMockConnection(7, 'wan'),
        createMockConnection(7, 'cellular'),
      ],
    },
    {
      id: 'device-8',
      name: 'Warehouse AP',
      model: 'Peplink AP One Rugged',
      ipAddress: '192.168.8.1',
      position: { x: 550, y: 50 },
      connections: [
        createMockConnection(8, 'wifi'),
      ],
    },
    {
      id: 'device-9',
      name: 'Mobile Van',
      model: 'Peplink MAX HD2',
      ipAddress: '192.168.9.1',
      position: { x: 550, y: 450 },
      connections: [
        createMockConnection(9, 'cellular'),
        createMockConnection(9, 'wifi'),
      ],
    },
    {
      id: 'device-10',
      name: 'Core Switch',
      model: 'Peplink Switch Enterprise 24',
      ipAddress: '192.168.10.1',
      position: { x: 700, y: 350 },
      connections: [
        createMockConnection(10, 'wan'),
      ],
    },
  ];
}

export function generateRealtimeMetrics() {
  return {
    speedMbps: Math.floor(Math.random() * 500) + 50,
    latencyMs: Math.floor(Math.random() * 100) + 10,
    uploadMbps: Math.floor(Math.random() * 200) + 20,
    downloadMbps: Math.floor(Math.random() * 400) + 50,
  };
}
