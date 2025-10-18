import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Wifi, Radio, Cable, Network } from 'lucide-react';
import { PeplinkDevice, ConnectionType } from '@/types/network.types';
import styles from './DeviceNode.module.css';

interface DeviceNodeProps {
  data: PeplinkDevice;
}

const connectionIcons: Record<ConnectionType, React.ReactNode> = {
  wan: <Cable className="w-4 h-4" />,
  cellular: <Radio className="w-4 h-4" />,
  wifi: <Wifi className="w-4 h-4" />,
  sfp: <Network className="w-4 h-4" />,
};

const connectionColors: Record<ConnectionType, string> = {
  wan: '#3b82f6',
  cellular: '#a855f7',
  wifi: '#22c55e',
  sfp: '#f97316',
};

const statusColors = {
  connected: '#22c55e',
  disconnected: '#ef4444',
  degraded: '#f59e0b',
};

function DeviceNode({ data }: DeviceNodeProps) {
  return (
    <div className={styles.deviceNode}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
      
      <div className={styles.header}>
        <div className={styles.deviceName}>{data.name}</div>
        <div className={styles.deviceModel}>{data.model}</div>
      </div>
      
      <div className={styles.ipAddress}>{data.ipAddress}</div>
      
      <div className={styles.connections}>
        {data.connections.map((connection) => (
          <div
            key={connection.id}
            className={styles.connection}
            style={{
              borderLeftColor: connectionColors[connection.type],
            }}
          >
            <div className={styles.connectionHeader}>
              <div
                className={styles.connectionIcon}
                style={{ color: connectionColors[connection.type] }}
              >
                {connectionIcons[connection.type]}
              </div>
              <span className={styles.connectionType}>
                {connection.type.toUpperCase()}
              </span>
              <div
                className={styles.statusIndicator}
                style={{
                  backgroundColor: statusColors[connection.status],
                }}
              />
            </div>
            
            {connection.status === 'connected' && (
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Speed:</span>
                  <span className={styles.metricValue}>
                    {connection.metrics.speedMbps} Mbps
                  </span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Latency:</span>
                  <span className={styles.metricValue}>
                    {connection.metrics.latencyMs} ms
                  </span>
                </div>
                <div className={styles.dataFlow}>
                  <span className={styles.metricLabel}>↑</span>
                  <span className={styles.metricValue}>
                    {connection.metrics.uploadMbps} Mbps
                  </span>
                  <span className={styles.metricLabel}>↓</span>
                  <span className={styles.metricValue}>
                    {connection.metrics.downloadMbps} Mbps
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(DeviceNode);
