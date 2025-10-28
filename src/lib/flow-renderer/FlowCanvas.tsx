import { useEffect, useRef, useCallback } from 'react';
import { PeplinkDevice } from '@/types/network.types';
import { Grid } from './components/Grid';
import { DeviceNode } from './components/DeviceNode';
import { ConnectionLines } from './components/ConnectionLines';
import { DeviceDetailsPanel } from './components/DeviceDetailsPanel';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_INCREMENT } from './constants';
import { useCanvasStore } from '@/store/canvasStore';
import { Coords } from './utils/gridUtils';

interface FlowCanvasProps {
  devices: PeplinkDevice[];
  width?: number;
  height?: number;
  className?: string;
}

export function FlowCanvas({ devices, width, height, className }: FlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  
  // Use canvas store for zoom and pan state
  const { 
    zoom, 
    setZoom, 
    scroll, 
    setScroll, 
    isPanning, 
    setIsPanning,
    setRendererSize,
  } = useCanvasStore();

  // Calculate device tile positions (3-column grid layout)
  const deviceTiles = new Map<string, Coords>();
  const COLS = 3;
  const TILE_SPACING = 2; // Space between devices in tiles
  
  devices.forEach((device, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    
    // Calculate tile coordinates with spacing
    // Center the grid by offsetting based on number of devices
    const totalRows = Math.ceil(devices.length / COLS);
    const colOffset = -Math.floor((Math.min(devices.length, COLS) - 1) / 2) * TILE_SPACING;
    const rowOffset = -Math.floor((totalRows - 1) / 2) * TILE_SPACING;
    
    deviceTiles.set(device.id, {
      x: col * TILE_SPACING + colOffset,
      y: row * TILE_SPACING + rowOffset,
    });
  });

  // Update renderer size when container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setRendererSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [setRendererSize]);

  // Mouse event handlers for pan and zoom
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [setIsPanning]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setScroll({
      position: {
        x: scroll.position.x + deltaX,
        y: scroll.position.y + deltaY
      }
    });
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isPanning, scroll, setScroll]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, [setIsPanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -ZOOM_INCREMENT : ZOOM_INCREMENT;
    setZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta)));
  }, [zoom, setZoom]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: width || '100%',
        height: height || '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: isPanning ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid background */}
      <Grid zoom={zoom} scroll={scroll} />
      
      {/* Connection lines (SVG) */}
      <ConnectionLines devices={devices} deviceTiles={deviceTiles} />
      
      {/* Device nodes (HTML/React components) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {devices.map((device) => {
          const tile = deviceTiles.get(device.id);
          if (!tile) return null;
          
          return (
            <DeviceNode
              key={device.id}
              device={device}
              tile={tile}
            />
          );
        })}
      </div>
      
      {/* Device details panel */}
      <DeviceDetailsPanel devices={devices} />
    </div>
  );
}
