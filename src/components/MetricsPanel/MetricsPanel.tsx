import { Activity, Wifi, Radio, Cable, Network } from 'lucide-react';
import { PeplinkDevice } from '@/types/network.types';
import styles from './MetricsPanel.module.css';

interface MetricsPanelProps {
  devices: PeplinkDevice[];
  lastUpdated?: Date;
}

function MetricsPanel({ devices, lastUpdated }: MetricsPanelProps) {
  const totalDevices = devices.length;
  const totalConnections = devices.reduce(
    (sum, device) => sum + device.connections.length,
    0
  );
  const activeConnections = devices.reduce(
    (sum, device) =>
      sum + device.connections.filter((c) => c.status === 'connected').length,
    0
  );

  const connectionsByType = devices.reduce(
    (acc, device) => {
      device.connections.forEach((conn) => {
        if (conn.status === 'connected') {
          acc[conn.type] = (acc[conn.type] || 0) + 1;
        }
      });
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Activity className="w-5 h-5" />
          Network Status
        </div>
        {lastUpdated && (
          <div className={styles.lastUpdated}>
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Total Devices</div>
          <div className={styles.statValue}>{totalDevices}</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statLabel}>Active Connections</div>
          <div className={styles.statValue}>
            {activeConnections} / {totalConnections}
          </div>
        </div>
      </div>

      <div className={styles.connectionTypes}>
        <div className={styles.sectionTitle}>Connections by Type</div>
        
        <div className={styles.typeList}>
          <div className={styles.typeItem}>
            <Cable className="w-4 h-4" style={{ color: '#3b82f6' }} />
            <span>WAN</span>
            <span className={styles.typeCount}>{connectionsByType.wan || 0}</span>
          </div>

          <div className={styles.typeItem}>
            <Radio className="w-4 h-4" style={{ color: '#a855f7' }} />
            <span>Cellular</span>
            <span className={styles.typeCount}>{connectionsByType.cellular || 0}</span>
          </div>

          <div className={styles.typeItem}>
            <Wifi className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span>WiFi</span>
            <span className={styles.typeCount}>{connectionsByType.wifi || 0}</span>
          </div>

          <div className={styles.typeItem}>
            <Network className="w-4 h-4" style={{ color: '#f97316' }} />
            <span>SFP</span>
            <span className={styles.typeCount}>{connectionsByType.sfp || 0}</span>
          </div>
        </div>
      </div>

      <div className={styles.indicator}>
        <div className={styles.indicatorDot} />
        <span>Real-time monitoring active</span>
      </div>
    </div>
  );
}

export default MetricsPanel;
