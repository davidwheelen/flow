import React from 'react';
import { EthernetIcon } from './EthernetIcon';

interface PortProps {
  name: string;
  type: string;
  speed: string;
  isConnected: boolean;
  colors?: string[];
}

export const EthernetPort: React.FC<PortProps> = ({ 
  name, 
  speed, 
  isConnected,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899']
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px',
        borderRadius: '6px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '6px',
          color: isConnected ? '#e0e0e0' : '#a0a0a0',
          textAlign: 'center',
        }}
      >
        {name}
      </div>
      
      <div
        style={{
          position: 'relative',
          width: '32px',
          height: '32px',
          marginBottom: '6px',
        }}
      >
        <EthernetIcon
          isConnected={isConnected}
          useAnimation={false}
          colors={colors}
          size={32}
        />
      </div>
      
      <div
        style={{
          fontSize: '11px',
          color: isConnected ? '#22c55e' : '#a0a0a0',
          fontWeight: isConnected ? 500 : 400,
          textAlign: 'center',
        }}
      >
        {speed}
      </div>
    </div>
  );
};
