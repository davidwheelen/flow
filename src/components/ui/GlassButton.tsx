import { ReactNode } from 'react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlassButton({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  className = ''
}: GlassButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantStyles = {
    primary: {
      background: 'rgba(59, 130, 246, 0.25)',
      borderColor: 'rgba(59, 130, 246, 0.45)',
      color: '#93c5fd'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(255, 255, 255, 0.45)',
      color: '#e0e0e0'
    }
  };

  const style = variantStyles[variant];

  return (
    <button 
      className={`liquid-glass ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      style={{
        background: style.background,
        borderColor: style.borderColor,
        color: style.color
      }}
    >
      {children}
    </button>
  );
}
