import React, { useState, useRef, useEffect, useMemo } from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { useCanvasStore } from '@/store/canvasStore';
import { useAppStore } from '@/store/appStore';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { defaultThemes } from '@/themes/defaultThemes';
import { EthernetPort } from '@/components/ui/EthernetPort';
import { pollingService } from '@/services/pollingService';
import './DeviceDetailsPanel.css';

// Refresh interval configuration (in milliseconds)
const REFRESH_INTERVAL_MS = 5000; // 5 seconds

// Panel layout constants
const HEADER_PADDING = 20;
const CONTENT_PADDING = 20;

// Helper function to format speed
const formatSpeed = (speedMbps?: number): string => {
  if (!speedMbps) return 'N/A';
  if (speedMbps >= 1000) {
    return `${(speedMbps / 1000).toFixed(1)} Gbps`;
  }
  return `${speedMbps} Mbps`;
};

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
  const [vlanExpanded, setVlanExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { appearanceSettings } = useAppStore();
  
  // Mouse-tracking glow effect handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    panel.style.setProperty('--mouse-x', `${x}px`);
    panel.style.setProperty('--mouse-y', `${y}px`);
  };
  
  const handlePointerLeave = () => {
    const panel = panelRef.current;
    if (!panel) return;
    
    panel.style.setProperty('--mouse-x', `50%`);
    panel.style.setProperty('--mouse-y', `50%`);
  };
  
  // Memoize theme colors to avoid recalculation on every render
  const themeColors = useMemo(() => {
    if (appearanceSettings.customTheme) {
      return [
        appearanceSettings.customTheme.colors.primary,
        appearanceSettings.customTheme.colors.secondary,
        appearanceSettings.customTheme.colors.accent,
      ];
    }
    
    const theme = appearanceSettings.theme === 'light' ? defaultThemes.light : defaultThemes.dark;
    return [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
    ];
  }, [appearanceSettings]);
  
  // Initialize WAN states as collapsed by default (only reset when device changes)
  useEffect(() => {
    const initialState = new Map<string, boolean>();
    device.connections.forEach(conn => {
      initialState.set(conn.id, false); // Start collapsed
    });
    setWanExpandedState(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device.id]); // Only reset when device ID changes, not when connections update
  
  // Initialize horizontal particle animation (only for online devices)
  // COMMENTED OUT - Particle effect disabled
  /*
  useEffect(() => {
    if (!canvasRef.current || device.status !== 'online') return;
    
    const animation = new ParticleAnimation({
      canvas: canvasRef.current,
      colors: themeColors,
      direction: 'horizontal',
      opacity: PARTICLE_OPACITY,
      particleCount: PARTICLE_COUNT,
      particleSpeed: PARTICLE_SPEED,
    });
    
    animation.start();
    return () => animation.stop();
  }, [themeColors, device.status]);
  */
  
  // Refresh device data when panel opens and periodically while open
  useEffect(() => {
    // Trigger immediate refresh when panel opens
    pollingService.refresh().catch(err => {
      console.error('Failed to refresh device data:', err);
    });
    
    // Set up periodic refresh while panel is open
    const refreshInterval = setInterval(() => {
      pollingService.refresh().catch(err => {
        console.error('Failed to refresh device data:', err);
      });
    }, REFRESH_INTERVAL_MS);
    
    // Clear interval on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [device.id]); // Re-run when device changes
  
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
      const minX = sidebarWidth + 10;
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
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="device-details-panel"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 320,
        maxHeight: 'calc(100vh - 100px)',
        zIndex: 1000 + zIndex,
        display: 'flex',
        flexDirection: 'column',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Animated Header */}
      <div
        onMouseDown={handleMouseDown}
        onClick={handleTitleClick}
        style={{
          position: 'relative',
          padding: HEADER_PADDING,
          overflow: 'hidden',
          borderRadius: '12px 12px 0 0',
          background: 'rgba(23, 23, 23, 0.7)',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {/* Particle Animation Background - COMMENTED OUT */}
        {/* {device.status === 'online' && (
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )} */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, marginBottom: 4, color: '#e0e0e0', fontWeight: 600 }}>
              {device.name}
            </div>
            <div style={{ color: '#a0a0a0', fontSize: 14 }}>
              {device.model}
            </div>
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
      </div>
      
      {/* Divider Line */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
      
      {/* Panel Content */}
      <div
        style={{
          padding: CONTENT_PADDING,
          background: 'rgba(23, 23, 23, 0.7)',
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {/* Device Details */}
        <div style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
          {device.status && (
            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status
              </div>
              <div style={{ 
                color: device.status === 'online' ? '#10b981' : '#a855f7', 
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'capitalize'
              }}>
                {device.status}
              </div>
            </div>
          )}
          
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
          
          <div>
            <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              IP Address
            </div>
            <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
              {device.ipAddress}
            </div>
          </div>
        </div>
        
        {/* LAN Network & VLANs Section */}
        {device.connections && device.connections.filter(c => c.type === 'lan').length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {/* LAN Network Section - Plain Text */}
            {device.connections.find(c => c.lanDetails?.portNumber === 0) && (() => {
              const lanNetworkConn = device.connections.find(c => c.lanDetails?.portNumber === 0);
              return (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e0e0e0', marginBottom: 4 }}>
                    LAN Network
                  </div>
                  <div style={{ fontSize: 12, color: '#a0a0a0' }}>
                    MAC: {lanNetworkConn?.lanDetails?.mac || 'N/A'}
                  </div>
                  <div style={{ fontSize: 12, color: '#a0a0a0' }}>
                    Connected Clients: {lanNetworkConn?.lanDetails?.clientCount || 0}
                  </div>
                </div>
              );
            })()}
            
            {/* VLANs Section - Collapsible */}
            {device.connections.filter(c => c.lanDetails?.portNumber === -1).length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <button
                  onClick={() => setVlanExpanded(!vlanExpanded)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#a0a0a0',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                    marginBottom: 8,
                    width: '100%',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d0d0d0'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a0a0a0'}
                >
                  <span>{vlanExpanded ? '▼' : '▶'}</span>
                  <span>VLANS ({device.connections.filter(c => c.lanDetails?.portNumber === -1).length})</span>
                </button>
                
                {vlanExpanded && (
                  <div style={{ paddingLeft: 16 }}>
                    {device.connections
                      .filter(c => c.lanDetails?.portNumber === -1)
                      .sort((a, b) => (a.lanDetails?.vlanId || 0) - (b.lanDetails?.vlanId || 0))
                      .map(conn => (
                        <div
                          key={conn.id}
                          style={{
                            marginBottom: 12,
                          }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 500, color: '#e0e0e0', marginBottom: 4 }}>
                            {conn.lanDetails?.name}
                          </div>
                          <div style={{ fontSize: 12, color: '#a0a0a0' }}>
                            IP Range: {conn.lanDetails?.ipRange || 'N/A'}
                          </div>
                          <div style={{ fontSize: 12, color: '#a0a0a0' }}>
                            Gateway: {conn.lanDetails?.gateway || 'N/A'}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Physical LAN Ports (if available) */}
            {device.connections.filter(c => c.lanDetails && c.lanDetails.portNumber > 0).length > 0 && (
              <div>
                <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Physical LAN Ports ({device.connections.filter(c => c.lanDetails && c.lanDetails.portNumber > 0).length})
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {device.connections
                    .filter(c => c.lanDetails && c.lanDetails.portNumber > 0)
                    .sort((a, b) => (a.lanDetails?.portNumber || 0) - (b.lanDetails?.portNumber || 0))
                    .map(conn => (
                      <EthernetPort
                        key={conn.id}
                        name={conn.lanDetails?.name || `Port ${conn.lanDetails?.portNumber}`}
                        type={conn.lanDetails?.vlan || 'Access'}
                        speed={conn.lanDetails?.speed || formatSpeed(conn.metrics.speedMbps)}
                        isConnected={conn.status === 'connected'}
                        colors={themeColors}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Connections */}
        <div>
          <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            WAN CONNECTIONS ({device.connections.filter(conn => {
              // Exclude LAN connections from count and display
              const connName = conn.wanDetails?.name || conn.type;
              return !connName?.toLowerCase().includes('lan');
            }).length})
          </div>
          {device.connections
            .filter(conn => {
              // Exclude LAN connections from display (but keep in connections array for grid lines)
              const connName = conn.wanDetails?.name || conn.type;
              return !connName?.toLowerCase().includes('lan');
            })
            .map((conn, index, filteredArray) => {
            const isExpanded = wanExpandedState.get(conn.id) ?? true;
            const isAccessPoint = device.model.toLowerCase().includes('ap one') || 
                                 device.model.toLowerCase().includes('ap pro');
            const wanName = conn.wanDetails?.name || `${conn.type} ${index + 1}`;
            
            // Display "Wireless Mesh" for WiFi connections on APs
            const connectionTypeDisplay = isAccessPoint && conn.type === 'wifi' 
              ? 'Wireless Mesh' 
              : conn.type;
            
            return (
              <div
                key={conn.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 8,
                  overflow: 'hidden',
                  marginBottom: index < filteredArray.length - 1 ? 8 : 0,
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
                    <span style={{ color: '#e0e0e0', fontSize: 14, fontWeight: 500 }}>
                      {wanName}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: conn.status === 'connected' ? '#10b981' : conn.status === 'degraded' ? '#f59e0b' : '#a855f7',
                      boxShadow: conn.status === 'connected' 
                        ? '0 0 8px rgba(16, 185, 129, 0.6)' 
                        : conn.status === 'degraded' 
                        ? '0 0 8px rgba(245, 158, 11, 0.6)' 
                        : '0 0 8px rgba(168, 85, 247, 0.6)',
                    }}
                  />
                </div>
                
                {/* WAN Details - Expandable */}
                {isExpanded && (
                  <div style={{ padding: '0 12px 12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#a0a0a0', fontSize: 12, textTransform: 'capitalize' }}>
                        {connectionTypeDisplay}
                      </span>
                      <span
                        style={{
                          color: conn.status === 'connected' ? '#10b981' : conn.status === 'degraded' ? '#f59e0b' : '#a855f7',
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
                    
                    {/* Wireless Mesh Details for AP devices */}
                    {conn.apDetails && (
                      <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        {/* Frequencies */}
                        {conn.apDetails.frequencies.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ color: '#a0a0a0', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Frequencies
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {conn.apDetails.frequencies.map((freq, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    fontSize: 11,
                                    color: '#e0e0e0',
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                  }}
                                >
                                  {freq}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* SSIDs with Security */}
                        {conn.apDetails.ssids.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ color: '#a0a0a0', fontSize: 10, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              SSIDs
                            </div>
                            {conn.apDetails.ssids.map((ssid, idx) => (
                              <div key={idx} style={{ fontSize: 11, color: '#e0e0e0', marginBottom: 3 }}>
                                <span style={{ fontFamily: 'monospace' }}>{ssid.name}</span>
                                <span style={{ color: '#a0a0a0', marginLeft: 8 }}>({ssid.security})</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Connected Clients */}
                        <div>
                          <div style={{ color: '#a0a0a0', fontSize: 10, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Connected Clients
                          </div>
                          <div style={{ fontSize: 13, color: '#e0e0e0', fontWeight: 500 }}>
                            {conn.apDetails.clientCount} {conn.apDetails.clientCount === 1 ? 'client' : 'clients'}
                          </div>
                        </div>
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
