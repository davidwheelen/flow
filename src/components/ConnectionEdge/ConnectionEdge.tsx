import { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { ConnectionType, NetworkMetrics } from '@/types/network.types';

const connectionColors: Record<ConnectionType, string> = {
  wan: '#3b82f6',
  cellular: '#a855f7',
  wifi: '#22c55e',
  sfp: '#f97316',
};

interface EdgeData {
  connectionType?: ConnectionType;
  metrics?: NetworkMetrics;
}

function ConnectionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<EdgeData>) {
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
}

export default memo(ConnectionEdge);
