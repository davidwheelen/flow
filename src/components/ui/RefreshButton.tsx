import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RefreshButton({ 
  onClick, 
  isLoading, 
  icon,
  size = 'md',
  className = ''
}: RefreshButtonProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        ${className}
        flex items-center justify-center
        rounded-lg
        transition-all
        hover:scale-105
        active:scale-95
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      style={{
        background: 'rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
      title={isLoading ? 'Refreshing...' : 'Refresh'}
    >
      {isLoading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" style={{ color: '#3b82f6' }} />
      ) : (
        <span style={{ color: '#e0e0e0' }}>{icon}</span>
      )}
    </button>
  );
}
