import { LucideIcon } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </div>
        )}
        {title && <h2 className={styles.title}>{title}</h2>}
        <p className={styles.message}>{message}</p>
        {action && (
          <button onClick={action.onClick} className={styles.actionButton}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default EmptyState;
