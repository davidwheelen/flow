import React, { useState, useRef, useEffect } from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { useCanvasStore } from '@/store/canvasStore';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

interface DeviceDetailsPanelProps {
  devices: PeplinkDevice[];
}

interface SinglePanelProps {
  device: PeplinkDevice;
  position: { x: number; y: number };
  zIndex: number;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onBringToFront: () => void;
}

const SingleDevicePanel: React.FC<SinglePanelProps> = ({
  device,
  position,
  zIndex,
  onClose,
  onPositionChange,
  onBringToFront,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [wanExpandedState, setWanExpandedState] = useState<Map<string, boolean>>(new Map());
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Initialize WAN states as collapsed by default (only reset when device changes)
  useEffect(() => {
    const initialState = new Map<string, boolean>();
    device.connections.forEach(conn => {
      initialState.set(conn.id, false); // Start collapsed
    });
    setWanExpandedState(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.id]); // Only reset when device ID changes, not when connections update
  
  const toggleWanExpanded = (wanId: string) => {
    setWanExpandedState(prev => {
      const newState = new Map(prev);
      newState.set(wanId, !prev.get(wanId));
      return newState;
    });
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.close-button')) {
      return; // Don't start dragging if clicking close button
    }
    
    e.stopPropagation(); // Prevent canvas from receiving event
    e.preventDefault();
    
    onBringToFront();
    setIsDragging(true);
    
    // Calculate offset from mouse to panel's current position
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    
    document.body.style.cursor = 'grabbing';
  };
  
  const handleTitleClick = () => {
    // Only bring to front on click if not dragging
    if (!isDragging) {
      onBringToFront();
    }
  };
  
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const sidebarWidth = 280;
      const panelWidth = 320;
      const panelHeight = panelRef.current?.offsetHeight || 600;
      
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      
      // Constrain to canvas bounds
      const minX = sidebarWidth; // Allow touching sidebar edge
      const maxX = window.innerWidth - panelWidth - 10;
      const minY = 10;
      const maxY = window.innerHeight - Math.min(panelHeight, 100) - 10;
      
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
      
      onPositionChange({ x: newX, y: newY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onPositionChange]);
  
  return (
    <div
      ref={panelRef}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 320,
        maxHeight: 'calc(100vh - 100px)',
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        zIndex: 1000 + zIndex,
        display: 'flex',
        flexDirection: 'column',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Draggable Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        onClick={handleTitleClick}
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#e0e0e0', fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 4 }}>
            {device.name}
          </h3>
          <p style={{ color: '#a0a0a0', fontSize: 12, margin: 0 }}>
            {device.model}
          </p>
        </div>
        <button
          className="close-button"
          onClick={onClose}
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
      
      {/* Scrollable Content */}
      <div
        style={{
          padding: 16,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {/* Device Details */}
        <div style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
          {device.serial && (
            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Serial
              </div>
              <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
                {device.serial}
              </div>
            </div>
          )}
          
          {device.firmware_version && (
            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Firmware
              </div>
              <div style={{ color: '#e0e0e0', fontSize: 14 }}>
                {device.firmware_version}
              </div>
            </div>
          )}
          
          {device.status && (
            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status
              </div>
              <div style={{ 
                color: device.status === 'online' ? '#22c55e' : '#ef4444', 
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'capitalize'
              }}>
                {device.status}
              </div>
            </div>
          )}
          
          <div>
            <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              IP Address
            </div>
            <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
              {device.ipAddress}
            </div>
          </div>
        </div>
        
        {/* Connections */}
        <div>
          <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Connections ({device.connections.length})
          </div>
          {device.connections.map((conn, index) => {
            const isExpanded = wanExpandedState.get(conn.id) ?? true;
            const wanName = conn.wanDetails?.name || `${conn.type} ${index + 1}`;
            
            return (
              <div
                key={conn.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: index < device.connections.length - 1 ? 8 : 0,
                }}
              >
                {/* WAN Header - Collapsible */}
                <div
                  onClick={() => toggleWanExpanded(conn.id)}
                  style={{
                    padding: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isExpanded ? (
                      <ChevronDown size={16} style={{ color: '#a0a0a0' }} />
                    ) : (
                      <ChevronRight size={16} style={{ color: '#a0a0a0' }} />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ color: '#e0e0e0', fontSize: 14, fontWeight: 500 }}>
                        {wanName}
                      </span>
                      {conn.wanDetails?.connectionType && (
                        <span style={{ color: '#a0a0a0', fontSize: 11 }}>
                          ({conn.wanDetails.connectionType})
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: conn.status === 'connected' ? '#22c55e' : conn.status === 'degraded' ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
                
                {/* WAN Details - Expandable */}
                {isExpanded && (
                  <div style={{ padding: '0 12px 12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#a0a0a0', fontSize: 12, textTransform: 'capitalize' }}>
                        {conn.type}
                      </span>
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
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
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
                    
                    {conn.wanDetails && (
                      <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        {conn.wanDetails.ipAddress && (
                          <div style={{ fontSize: 11, color: '#e0e0e0', marginBottom: 3, fontFamily: 'monospace' }}>
                            IP: {conn.wanDetails.ipAddress}
                          </div>
                        )}
                        {conn.wanDetails.macAddress && (
                          <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3, fontFamily: 'monospace' }}>
                            MAC: {conn.wanDetails.macAddress}
                          </div>
                        )}
                        {conn.wanDetails.gateway && (
                          <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3, fontFamily: 'monospace' }}>
                            Gateway: {conn.wanDetails.gateway}
                          </div>
                        )}
                        {conn.wanDetails.dnsServers && conn.wanDetails.dnsServers.length > 0 && (
                          <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3, fontFamily: 'monospace' }}>
                            DNS: {conn.wanDetails.dnsServers.join(', ')}
                          </div>
                        )}
                        {conn.wanDetails.connectionMethod && (
                          <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3 }}>
                            Method: {conn.wanDetails.connectionMethod}
                          </div>
                        )}
                        {conn.wanDetails.routingMode && (
                          <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3 }}>
                            Mode: {conn.wanDetails.routingMode}
                          </div>
                        )}
                        {conn.wanDetails.mtu && (
                          <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3 }}>
                            MTU: {conn.wanDetails.mtu}
                          </div>
                        )}
                        {conn.wanDetails.healthCheckMethod && (
                          <div style={{ fontSize: 11, color: '#a0a0a0' }}>
                            Health Check: {conn.wanDetails.healthCheckMethod}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const DeviceDetailsPanel: React.FC<DeviceDetailsPanelProps> = ({ devices }) => {
  const { openPanels, closeDevicePanel, updatePanelPosition, bringPanelToFront } = useCanvasStore();
  
  return (
    <>
      {openPanels.map((panel) => {
        const device = devices.find(d => d.id === panel.deviceId);
        if (!device) return null;
        
        return (
          <SingleDevicePanel
            key={panel.deviceId}
            device={device}
            position={panel.position}
            zIndex={panel.zIndex}
            onClose={() => closeDevicePanel(panel.deviceId)}
            onPositionChange={(pos) => updatePanelPosition(panel.deviceId, pos)}
            onBringToFront={() => bringPanelToFront(panel.deviceId)}
          />
        );
      })}
    </>
  );
};
