import React from 'react';
import { PeplinkDevice, ConnectionType, ConnectionStatus, DeviceGroup } from '@/types/network.types';
import { getTilePosition, Coords, getDeviceAbsolutePosition } from '../utils/gridUtils';
import { useCanvasStore } from '@/store/canvasStore';

interface ConnectionLinesProps {
  devices: PeplinkDevice[];
  deviceTiles: Map<string, Coords>;
  groups?: DeviceGroup[];
}

const CONNECTION_COLORS: Record<ConnectionType, string> = {
  wan: '#3b82f6',
  lan: '#10b981',
  cellular: '#a855f7',
  wifi: '#22c55e',
  sfp: '#f97316',
};

const STATUS_STYLES: Record<ConnectionStatus, { opacity: number; dashArray: string }> = {
  connected: { opacity: 1, dashArray: '' }, // Solid line for connected, animated with dashArray in render
  disconnected: { opacity: 0.3, dashArray: '5,5' },
  degraded: { opacity: 0.7, dashArray: '10,5' },
};

// Helper function to generate curved path between two points
const generatePath = (from: Coords, to: Coords, zoom: number, scroll: { position: Coords }, rendererSize: { width: number; height: number }): string => {
  // Apply zoom and scroll transformations
  const fromX = from.x * zoom + scroll.position.x + rendererSize.width / 2;
  const fromY = from.y * zoom + scroll.position.y + rendererSize.height / 2;
  const toX = to.x * zoom + scroll.position.x + rendererSize.width / 2;
  const toY = to.y * zoom + scroll.position.y + rendererSize.height / 2;
  
  // Calculate control point for quadratic curve
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const perpX = -dy;
  const perpY = dx;
  const length = Math.sqrt(perpX * perpX + perpY * perpY);
  const offsetAmount = 50 * zoom;
  const controlX = midX + (perpX / length) * offsetAmount;
  const controlY = midY + (perpY / length) * offsetAmount;
  
  return `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
};

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ devices, deviceTiles, groups }) => {
  console.log('Rendering connections for devices:', devices.map(d => ({
    name: d.name,
    model: d.model,
    connections: d.connections
  })));
  
  const { zoom, scroll, rendererSize } = useCanvasStore();
  
  // Build group positions map for efficient lookup
  const groupPositions = new Map<string, Coords>();
  groups?.forEach(group => {
    groupPositions.set(group.id, group.position);
  });
  
  // Create connections array
  const connections: Array<{
    from: Coords;
    to: Coords;
    type: ConnectionType;
    status: ConnectionStatus;
  }> = [];
  
  // Build all valid connections
  devices.forEach(device => {
    if (!device.connections?.length) return;

    const fromTile = deviceTiles.get(device.id);
    if (!fromTile) return;

    device.connections.forEach(conn => {
      if (!conn.device_id) return;

      const targetDevice = devices.find(d => d.id === conn.device_id);
      if (!targetDevice) return;

      const toTile = deviceTiles.get(conn.device_id);
      if (!toTile) return;

      // Get actual positions including group offsets
      const fromPos = getDeviceAbsolutePosition(fromTile, device.groupId, groupPositions);
      const toPos = getDeviceAbsolutePosition(toTile, targetDevice.groupId, groupPositions);

      connections.push({
        from: getTilePosition({ tile: fromPos, origin: 'BOTTOM' }),
        to: getTilePosition({ tile: toPos, origin: 'BOTTOM' }),
        type: conn.type,
        status: conn.status
      });
    });
  });
  
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      {connections.map((conn, index) => (
        <path
          key={index}
          d={generatePath(conn.from, conn.to, zoom, scroll, rendererSize)}
          stroke={CONNECTION_COLORS[conn.type]}
          strokeWidth={conn.type === 'sfp' ? 4 * zoom : 3 * zoom}
          fill="none"
          strokeLinecap="round"
          opacity={STATUS_STYLES[conn.status].opacity}
          strokeDasharray={conn.status === 'connected' ? '10,10' : STATUS_STYLES[conn.status].dashArray}
        >
          {/* Animated dash for connected status */}
          {conn.status === 'connected' && (
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="20"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </path>
      ))}
    </svg>
  );
};
