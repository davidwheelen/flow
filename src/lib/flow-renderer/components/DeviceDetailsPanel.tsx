import React from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { useCanvasStore } from '@/store/canvasStore';
import { X } from 'lucide-react';

interface DeviceDetailsPanelProps {
  devices: PeplinkDevice[];
}

export const DeviceDetailsPanel: React.FC<DeviceDetailsPanelProps> = ({ devices }) => {
  const { selectedDeviceId, setSelectedDeviceId } = useCanvasStore();
  
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  
  if (!selectedDevice) return null;
  
  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        top: 80,
        width: 320,
        maxHeight: 'calc(100vh - 100px)',
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ color: '#e0e0e0', fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 4 }}>
            {selectedDevice.name}
          </h3>
          <p style={{ color: '#a0a0a0', fontSize: 12, margin: 0 }}>
            {selectedDevice.model}
          </p>
        </div>
        <button
          onClick={() => setSelectedDeviceId(null)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a0a0a0',
          }}
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Device Details */}
      <div style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
        {selectedDevice.serial && (
          <div>
            <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Serial
            </div>
            <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
              {selectedDevice.serial}
            </div>
          </div>
        )}
        
        {selectedDevice.firmware_version && (
          <div>
            <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Firmware
            </div>
            <div style={{ color: '#e0e0e0', fontSize: 14 }}>
              {selectedDevice.firmware_version}
            </div>
          </div>
        )}
        
        {selectedDevice.status && (
          <div>
            <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Status
            </div>
            <div style={{ 
              color: selectedDevice.status === 'online' ? '#22c55e' : '#ef4444', 
              fontSize: 14,
              fontWeight: 500,
              textTransform: 'capitalize'
            }}>
              {selectedDevice.status}
            </div>
          </div>
        )}
        
        <div>
          <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            IP Address
          </div>
          <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
            {selectedDevice.ipAddress}
          </div>
        </div>
      </div>
      
      {/* Connections */}
      <div>
        <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Connections ({selectedDevice.connections.length})
        </div>
        {selectedDevice.connections.map((conn, index) => (
          <div
            key={conn.id}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 8,
              padding: 12,
              marginBottom: index < selectedDevice.connections.length - 1 ? 8 : 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: conn.status === 'connected' ? '#22c55e' : conn.status === 'degraded' ? '#f59e0b' : '#ef4444',
                  }}
                />
                <span style={{ color: '#e0e0e0', fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>
                  {conn.type}
                </span>
              </div>
              <span
                style={{
                  color: conn.status === 'connected' ? '#22c55e' : conn.status === 'degraded' ? '#f59e0b' : '#ef4444',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {conn.status}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Speed</div>
                <div style={{ color: '#e0e0e0', fontSize: 13 }}>{conn.metrics.speedMbps} Mbps</div>
              </div>
              <div>
                <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Latency</div>
                <div style={{ color: '#e0e0e0', fontSize: 13 }}>{conn.metrics.latencyMs} ms</div>
              </div>
              <div>
                <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Upload</div>
                <div style={{ color: '#e0e0e0', fontSize: 13 }}>{conn.metrics.uploadMbps} Mbps</div>
              </div>
              <div>
                <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Download</div>
                <div style={{ color: '#e0e0e0', fontSize: 13 }}>{conn.metrics.downloadMbps} Mbps</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
