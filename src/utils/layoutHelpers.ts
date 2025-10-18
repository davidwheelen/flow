import { PeplinkDevice } from '@/types/network.types';
import { Node, Edge } from 'reactflow';

export interface LayoutOptions {
  horizontalSpacing?: number;
  verticalSpacing?: number;
  startX?: number;
  startY?: number;
}

/**
 * Calculate automatic layout positions for devices in Isoflow style
 */
export function calculateLayout(
  devices: PeplinkDevice[],
  options: LayoutOptions = {}
): PeplinkDevice[] {
  const {
    horizontalSpacing = 300,
    verticalSpacing = 200,
    startX = 100,
    startY = 100,
  } = options;

  const devicesPerRow = Math.ceil(Math.sqrt(devices.length));

  return devices.map((device, index) => {
    const row = Math.floor(index / devicesPerRow);
    const col = index % devicesPerRow;

    return {
      ...device,
      position: {
        x: startX + col * horizontalSpacing,
        y: startY + row * verticalSpacing,
      },
    };
  });
}

/**
 * Convert devices to React Flow nodes
 */
export function devicesToNodes(devices: PeplinkDevice[]): Node[] {
  return devices.map((device) => ({
    id: device.id,
    type: 'deviceNode',
    position: device.position,
    data: device,
  }));
}

/**
 * Generate edges between devices based on their connections
 * For now, creates simple edges between all devices
 */
export function generateEdges(devices: PeplinkDevice[]): Edge[] {
  const edges: Edge[] = [];

  for (let i = 0; i < devices.length - 1; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      const device1 = devices[i];
      const device2 = devices[j];

      // Create edge if both devices have active connections
      const hasActiveConnection1 = device1.connections.some(
        (conn) => conn.status === 'connected'
      );
      const hasActiveConnection2 = device2.connections.some(
        (conn) => conn.status === 'connected'
      );

      if (hasActiveConnection1 && hasActiveConnection2) {
        // Use the first active connection type for edge styling
        const activeConn1 = device1.connections.find(
          (conn) => conn.status === 'connected'
        );

        edges.push({
          id: `edge-${device1.id}-${device2.id}`,
          source: device1.id,
          target: device2.id,
          type: 'connectionEdge',
          animated: true,
          data: {
            connectionType: activeConn1?.type || 'wan',
            metrics: activeConn1?.metrics,
          },
        });
      }
    }
  }

  return edges;
}
