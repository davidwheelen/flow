import { PeplinkDevice } from '@/types/network.types';

/**
 * Mock devices for testing device icon rendering
 */
export const mockDevices: PeplinkDevice[] = [
  {
    id: 'test-1',
    name: 'Balance 20',
    model: 'Balance 20',
    ipAddress: '192.168.1.1',
    connections: [
      {
        id: 'c1',
        type: 'wan',
        status: 'connected',
        metrics: {
          speedMbps: 100,
          latencyMs: 10,
          uploadMbps: 50,
          downloadMbps: 50,
        },
      },
    ],
    position: { x: 100, y: 100 },
  },
  {
    id: 'test-2',
    name: 'Balance 30',
    model: 'Balance 30 LTE',
    ipAddress: '192.168.1.2',
    connections: [
      {
        id: 'c2',
        type: 'cellular',
        status: 'connected',
        metrics: {
          speedMbps: 50,
          latencyMs: 20,
          uploadMbps: 25,
          downloadMbps: 25,
        },
      },
    ],
    position: { x: 300, y: 100 },
  },
  {
    id: 'test-3',
    name: 'Balance 310',
    model: 'Balance 310',
    ipAddress: '192.168.1.3',
    connections: [
      {
        id: 'c3',
        type: 'wan',
        status: 'connected',
        metrics: {
          speedMbps: 200,
          latencyMs: 5,
          uploadMbps: 100,
          downloadMbps: 100,
        },
      },
    ],
    position: { x: 500, y: 100 },
  },
  {
    id: 'test-4',
    name: 'MAX HD2',
    model: 'MAX HD2',
    ipAddress: '192.168.1.4',
    connections: [],
    position: { x: 100, y: 300 },
  },
  {
    id: 'test-5',
    name: 'Balance 580',
    model: 'Balance 580',
    ipAddress: '192.168.1.5',
    connections: [],
    position: { x: 300, y: 300 },
  },
  {
    id: 'test-6',
    name: 'Transit Duo',
    model: 'Transit Duo',
    ipAddress: '192.168.1.6',
    connections: [],
    position: { x: 500, y: 300 },
  },
];
