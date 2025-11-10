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
  type, 
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
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(30, 30, 30, 0.5)',
        margin: '8px',
        width: '120px',
        border: isConnected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '8px',
          color: isConnected ? '#e0e0e0' : '#a0a0a0',
        }}
      >
        {name}
      </div>
      
      <div
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          margin: '8px 0',
        }}
      >
        <EthernetIcon
          isConnected={isConnected}
          useAnimation={isConnected}
          colors={colors}
          size={48}
        />
      </div>
      
      <div
        style={{
          fontSize: '12px',
          color: '#a0a0a0',
          marginTop: '8px',
        }}
      >
        {type}
      </div>
      
      <div
        style={{
          fontSize: '12px',
          color: isConnected ? '#22c55e' : '#a0a0a0',
          marginTop: '4px',
          fontWeight: isConnected ? 500 : 400,
        }}
      >
        {speed}
      </div>
    </div>
  );
};
