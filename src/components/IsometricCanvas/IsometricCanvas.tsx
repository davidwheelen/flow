/**
 * Isometric Canvas Component
 * Main component that integrates the isometric renderer with React
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { IsometricRenderer, RenderObject } from './IsometricRenderer';
import { IsometricDevice } from './IsometricDevice';
import { IsometricConnection } from './IsometricConnection';
import { calculateIsometricLayout, getDevicePosition, IsometricDevicePosition } from '@/utils/isometricLayout';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface IsometricCanvasProps {
  devices: PeplinkDevice[];
}

function IsometricCanvas({ devices }: IsometricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<IsometricRenderer | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [hoveredDeviceId, setHoveredDeviceId] = useState<string | null>(null);
  const devicePositionsRef = useRef<IsometricDevicePosition[]>([]);

  /**
   * Initialize renderer
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new IsometricRenderer(canvasRef.current);
    rendererRef.current = renderer;

    // Setup callbacks
    renderer.onHover((objectId) => {
      setHoveredDeviceId(objectId);
    });

    renderer.onClick((objectId) => {
      setSelectedDeviceId(objectId);
    });

    // Start animation loop
    renderer.start();

    return () => {
      renderer.destroy();
    };
  }, []);

  /**
   * Update render objects when devices change
   */
  useEffect(() => {
    if (!rendererRef.current || devices.length === 0) return;

    // Calculate positions for all devices
    const positions = calculateIsometricLayout(devices, {
      gridSpacing: 250,
      centerDevice: true,
      radialLayout: true,
      zOffset: 0,
    });

    devicePositionsRef.current = positions;

    // Create render objects
    const renderObjects: RenderObject[] = [];

    // Create connection objects (render first, so they appear behind devices)
    devices.forEach((device, deviceIndex) => {
      // Connect to other devices that have active connections
      devices.forEach((otherDevice, otherIndex) => {
        if (deviceIndex >= otherIndex) return; // Avoid duplicates

        const deviceHasActive = device.connections.some(c => c.status === 'connected');
        const otherHasActive = otherDevice.connections.some(c => c.status === 'connected');

        if (deviceHasActive && otherHasActive) {
          const devicePos = getDevicePosition(positions, device.id);
          const otherPos = getDevicePosition(positions, otherDevice.id);

          if (devicePos && otherPos) {
            // Use the first active connection for styling
            const activeConn = device.connections.find(c => c.status === 'connected');

            if (activeConn) {
              const connection = new IsometricConnection({
                id: `conn-${device.id}-${otherDevice.id}`,
                connection: activeConn,
                fromPosition: devicePos,
                toPosition: otherPos,
                fromDeviceId: device.id,
                toDeviceId: otherDevice.id,
              });
              renderObjects.push(connection);
            }
          }
        }
      });
    });

    // Create device objects
    devices.forEach(device => {
      const position = getDevicePosition(positions, device.id);
      if (position) {
        const isometricDevice = new IsometricDevice({
          device,
          position,
          size: { width: 100, height: 80, depth: 60 },
          isHovered: hoveredDeviceId === device.id,
          isSelected: selectedDeviceId === device.id,
        });
        renderObjects.push(isometricDevice);
      }
    });

    rendererRef.current.setObjects(renderObjects);

    // Fit to view on first load
    if (devices.length > 0 && positions.length > 0) {
      setTimeout(() => {
        rendererRef.current?.fitToView(100);
      }, 100);
    }
  }, [devices, hoveredDeviceId, selectedDeviceId]);

  /**
   * Camera control handlers
   */
  const handleZoomIn = useCallback(() => {
    if (!rendererRef.current) return;
    const camera = rendererRef.current.getCamera();
    rendererRef.current.setCamera({ scale: Math.min(3, camera.scale * 1.2) });
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!rendererRef.current) return;
    const camera = rendererRef.current.getCamera();
    rendererRef.current.setCamera({ scale: Math.max(0.1, camera.scale / 1.2) });
  }, []);

  const handleFitToView = useCallback(() => {
    rendererRef.current?.fitToView(100);
  }, []);

  const handleResetView = useCallback(() => {
    rendererRef.current?.resetCamera();
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ cursor: hoveredDeviceId ? 'pointer' : 'grab' }}
      />

      {/* Camera Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleFitToView}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Fit to View"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Device info tooltip */}
      {hoveredDeviceId && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          {(() => {
            const device = devices.find(d => d.id === hoveredDeviceId);
            if (!device) return null;

            return (
              <div>
                <div className="font-semibold text-gray-900 mb-1">{device.name}</div>
                <div className="text-sm text-gray-600 mb-2">{device.model}</div>
                <div className="text-xs text-gray-500 font-mono mb-3">{device.ipAddress}</div>
                
                <div className="space-y-1">
                  {device.connections.map(conn => (
                    <div key={conn.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{conn.type.toUpperCase()}</span>
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            conn.status === 'connected'
                              ? '#22c55e'
                              : conn.status === 'degraded'
                              ? '#f59e0b'
                              : '#ef4444',
                        }}
                      >
                        {conn.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-3 text-xs text-gray-600 max-w-xs">
        <div className="font-semibold mb-1">Controls</div>
        <div>• <strong>Drag</strong> to pan</div>
        <div>• <strong>Scroll</strong> to zoom</div>
        <div>• <strong>Hover</strong> over devices for details</div>
        <div>• <strong>Click</strong> to select a device</div>
      </div>
    </div>
  );
}

export default IsometricCanvas;
