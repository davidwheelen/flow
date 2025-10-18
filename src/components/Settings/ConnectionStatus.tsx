import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import styles from './ConnectionStatus.module.css';

interface ConnectionStatusProps {
  isConnected: boolean;
  error?: string;
  useMockData?: boolean;
}

function ConnectionStatus({ isConnected, error, useMockData }: ConnectionStatusProps) {
  if (useMockData) {
    return (
      <div className={styles.status}>
        <AlertCircle className="w-4 h-4" style={{ color: '#f59e0b' }} />
        <span className={styles.text} style={{ color: '#f59e0b' }}>
          Mock Mode
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.status}>
        <XCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
        <span className={styles.text} style={{ color: '#ef4444' }}>
          {error}
        </span>
      </div>
    );
  }

  return (
    <div className={styles.status}>
      <CheckCircle className="w-4 h-4" style={{ color: isConnected ? '#22c55e' : '#6b7280' }} />
      <span className={styles.text} style={{ color: isConnected ? '#22c55e' : '#6b7280' }}>
        {isConnected ? 'Connected' : 'Not Connected'}
      </span>
    </div>
  );
}

export default ConnectionStatus;
