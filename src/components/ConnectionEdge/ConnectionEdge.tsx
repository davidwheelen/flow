/**
 * DEPRECATED: This component is no longer used.
 * Replaced by IsometricConnection in IsometricCanvas system.
 * Kept for reference only.
 */

import { memo } from 'react';
// import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { ConnectionType, NetworkMetrics } from '@/types/network.types';

interface EdgeData {
  connectionType?: ConnectionType;
  metrics?: NetworkMetrics;
}

interface EdgeProps<T = EdgeData> {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: string;
  targetPosition: string;
  data?: T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ConnectionEdge(_props: EdgeProps<EdgeData>) {
  // This component is deprecated and no longer used
  return null;
  /*
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const connectionType = data?.connectionType || 'wan';
  const color = connectionColors[connectionType];
  const metrics = data?.metrics;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        stroke={color}
        strokeWidth={2}
        fill="none"
        style={{
          strokeDasharray: '8 4',
          animation: 'flow 1s linear infinite',
        }}
      />
      
      {metrics && metrics.speedMbps > 0 && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 600,
              border: `1px solid ${color}`,
              color: color,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {metrics.speedMbps} Mbps
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
  */
}

export default memo(ConnectionEdge);
