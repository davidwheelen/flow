import React, { useRef, useEffect, useState } from 'react';
import { ParticleAnimation } from '@/lib/animations/ParticleAnimation';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

/**
 * Demo component to showcase the particle animation background
 * This is used for testing and screenshot generation
 */
export const ParticleAnimationDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wanExpanded, setWanExpanded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const animation = new ParticleAnimation({
      canvas: canvasRef.current,
      colors: ['#3b82f6', '#8b5cf6', '#10b981'], // Primary, secondary, accent
      opacity: 0.4,
      particleCount: 100,
    });

    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      {/* Device Details Panel with Particle Animation */}
      <div
        style={{
          position: 'relative',
          width: 320,
          maxHeight: 'calc(100vh - 100px)',
          background: 'rgba(23, 23, 23, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Particle Animation Background */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        {/* Title Bar */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#e0e0e0', fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 4 }}>
              Balance 20X
            </h3>
            <p style={{ color: '#a0a0a0', fontSize: 12, margin: 0 }}>
              Peplink Balance 20X
            </p>
          </div>
          <button
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

        {/* Content */}
        <div
          style={{
            padding: 16,
            overflowY: 'auto',
            flex: 1,
          }}
        >
          {/* Device Details */}
          <div style={{ marginBottom: 16, display: 'grid', gap: 12 }}>
            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Serial
              </div>
              <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
                0000-1234-5678
              </div>
            </div>

            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Firmware
              </div>
              <div style={{ color: '#e0e0e0', fontSize: 14 }}>
                8.3.2
              </div>
            </div>

            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Status
              </div>
              <div style={{ 
                color: '#22c55e', 
                fontSize: 14,
                fontWeight: 500,
                textTransform: 'capitalize'
              }}>
                Online
              </div>
            </div>

            <div>
              <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                IP Address
              </div>
              <div style={{ color: '#e0e0e0', fontSize: 14, fontFamily: 'monospace' }}>
                192.168.1.1
              </div>
            </div>
          </div>

          {/* Connections */}
          <div>
            <div style={{ color: '#a0a0a0', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Connections (2)
            </div>
            
            {/* WAN 1 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <div
                onClick={() => setWanExpanded(!wanExpanded)}
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
                  {wanExpanded ? (
                    <ChevronDown size={16} style={{ color: '#a0a0a0' }} />
                  ) : (
                    <ChevronRight size={16} style={{ color: '#a0a0a0' }} />
                  )}
                  <span style={{ color: '#e0e0e0', fontSize: 14, fontWeight: 500 }}>
                    WAN 1 - Fiber
                  </span>
                </div>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                  }}
                />
              </div>

              {wanExpanded && (
                <div style={{ padding: '0 12px 12px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: '#a0a0a0', fontSize: 12, textTransform: 'capitalize' }}>
                      Ethernet
                    </span>
                    <span
                      style={{
                        color: '#22c55e',
                        fontSize: 11,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Connected
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Speed</div>
                      <div style={{ color: '#e0e0e0', fontSize: 13 }}>1000 Mbps</div>
                    </div>
                    <div>
                      <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Latency</div>
                      <div style={{ color: '#e0e0e0', fontSize: 13 }}>12 ms</div>
                    </div>
                    <div>
                      <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Upload</div>
                      <div style={{ color: '#e0e0e0', fontSize: 13 }}>450 Mbps</div>
                    </div>
                    <div>
                      <div style={{ color: '#707070', fontSize: 10, marginBottom: 2 }}>Download</div>
                      <div style={{ color: '#e0e0e0', fontSize: 13 }}>850 Mbps</div>
                    </div>
                  </div>

                  <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 11, color: '#e0e0e0', marginBottom: 3, fontFamily: 'monospace' }}>
                      IP: 203.45.67.89
                    </div>
                    <div style={{ fontSize: 11, color: '#a0a0a0', marginBottom: 3, fontFamily: 'monospace' }}>
                      Gateway: 203.45.67.1
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WAN 2 */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <div
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
                  <ChevronRight size={16} style={{ color: '#a0a0a0' }} />
                  <span style={{ color: '#e0e0e0', fontSize: 14, fontWeight: 500 }}>
                    WAN 2 - LTE
                  </span>
                </div>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#22c55e',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info text */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#a0a0a0',
          fontSize: 14,
          maxWidth: 400,
        }}
      >
        <h2 style={{ color: '#e0e0e0', marginBottom: 8 }}>Particle Animation Demo</h2>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Move your mouse over the device panel to interact with the particle animation.
          The particles will respond to your mouse position with subtle animations and connections.
        </p>
      </div>
    </div>
  );
};
