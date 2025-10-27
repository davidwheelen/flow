import React from 'react';
import { PeplinkDevice, ConnectionType, ConnectionStatus } from '@/types/network.types';
import { getTilePosition, Coords } from '../utils/gridUtils';
import { useCanvasStore } from '@/store/canvasStore';

interface ConnectionLinesProps {
  devices: PeplinkDevice[];
  deviceTiles: Map<string, Coords>;
}

const CONNECTION_COLORS: Record<ConnectionType, string> = {
  wan: '#3b82f6',
  cellular: '#a855f7',
  wifi: '#22c55e',
  sfp: '#f97316',
};

const STATUS_STYLES: Record<ConnectionStatus, { opacity: number; dashArray: string }> = {
  connected: { opacity: 1, dashArray: '' }, // Solid line for connected, animated with dashArray in render
  disconnected: { opacity: 0.3, dashArray: '5,5' },
  degraded: { opacity: 0.7, dashArray: '10,5' },
};

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ devices, deviceTiles }) => {
  const { zoom, scroll, rendererSize } = useCanvasStore();
  
  // Create connections between sequential devices (fallback approach)
  const connections: Array<{
    from: Coords;
    to: Coords;
    type: ConnectionType;
    status: ConnectionStatus;
  }> = [];
  
  for (let i = 0; i < devices.length - 1; i++) {
    const fromDevice = devices[i];
    const toDevice = devices[i + 1];
    const fromTile = deviceTiles.get(fromDevice.id);
    const toTile = deviceTiles.get(toDevice.id);
    
    if (fromTile && toTile && fromDevice.connections.length > 0) {
      const fromPos = getTilePosition({ tile: fromTile, origin: 'BOTTOM' });
      const toPos = getTilePosition({ tile: toTile, origin: 'BOTTOM' });
      
      connections.push({
        from: fromPos,
        to: toPos,
        type: fromDevice.connections[0].type,
        status: fromDevice.connections[0].status,
      });
    }
  }
  
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
      {connections.map((conn, index) => {
        // Apply zoom and scroll transformations
        const fromX = conn.from.x * zoom + scroll.position.x + rendererSize.width / 2;
        const fromY = conn.from.y * zoom + scroll.position.y + rendererSize.height / 2;
        const toX = conn.to.x * zoom + scroll.position.x + rendererSize.width / 2;
        const toY = conn.to.y * zoom + scroll.position.y + rendererSize.height / 2;
        
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
        
        const pathData = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
        const color = CONNECTION_COLORS[conn.type];
        const styles = STATUS_STYLES[conn.status];
        
        return (
          <g key={index}>
            {/* Connection line */}
            <path
              d={pathData}
              stroke={color}
              strokeWidth={3 * zoom}
              fill="none"
              strokeLinecap="round"
              opacity={styles.opacity}
              strokeDasharray={conn.status === 'connected' ? '10,10' : styles.dashArray}
              style={{
                filter: conn.type === 'cellular' ? `drop-shadow(0 0 ${12 * zoom}px ${color})` : 'none',
              }}
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
            
            {/* Thicker line for SFP connections */}
            {conn.type === 'sfp' && (
              <path
                d={pathData}
                stroke={color}
                strokeWidth={4 * zoom}
                fill="none"
                strokeLinecap="round"
                opacity={styles.opacity * 0.3}
                strokeDasharray={conn.status === 'connected' ? '10,10' : styles.dashArray}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
