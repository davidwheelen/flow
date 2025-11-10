import React from 'react';
import { EthernetIcon } from './EthernetIcon';

interface PortProps {
  name: string;
  status: string;
  ip: string;
  isConnected: boolean;
  colors?: string[];
}

export const EthernetPort: React.FC<PortProps> = ({ 
  name, 
  status, 
  ip, 
  isConnected,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899']
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        borderRadius: '6px',
        background: 'rgba(30, 30, 30, 0.5)',
        border: isConnected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
        minWidth: '140px',
      }}
    >
      {/* Port Name */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '8px',
          color: '#e0e0e0',
          textAlign: 'center',
        }}
      >
        {name}
      </div>
      
      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', marginBottom: '8px' }} />
      
      {/* Icon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '8px',
        }}
      >
        <EthernetIcon
          isConnected={isConnected}
          useAnimation={isConnected}
          colors={colors}
          size={32}
        />
      </div>
      
      {/* Status | IP */}
      <div
        style={{
          fontSize: '11px',
          color: '#a0a0a0',
          textAlign: 'center',
          fontFamily: 'monospace',
        }}
      >
        {status} | {ip}
      </div>
    </div>
  );
};
