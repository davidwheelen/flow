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
  isConnected
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px',
        borderRadius: '8px',
        background: 'rgba(30, 30, 30, 0.5)',
        border: isConnected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
      }}
    >
      {/* Port Name */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '8px',
          color: isConnected ? '#e0e0e0' : '#a0a0a0',
        }}
      >
        {name}
      </div>
      
      {/* Ethernet Icon with status background color */}
      <div
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          margin: '4px 0 8px 0',
        }}
      >
        <EthernetIcon
          isConnected={isConnected}
          size={48}
        />
      </div>
      
      {/* Speed */}
      <div
        style={{
          fontSize: '12px',
          color: '#a0a0a0',
          fontWeight: 400,
        }}
      >
        {speed}
      </div>
    </div>
  );
};
