import { useEffect, useRef, useState, useCallback } from 'react';
import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';
import { FlowNode } from './core/FlowNode';
import { FlowConnection } from './core/FlowConnection';
import { Grid } from './components/Grid';
import { getTilePosition } from './utils/gridUtils';
import { MIN_ZOOM, MAX_ZOOM, ZOOM_INCREMENT } from './constants';

interface FlowCanvasProps {
  devices: PeplinkDevice[];
  width?: number;
  height?: number;
  className?: string;
}

export function FlowCanvas({ devices, width, height, className }: FlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Map<string, FlowNode>>(new Map());
  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const animationFrameRef = useRef<number>();
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [scroll, setScroll] = useState({ position: { x: 0, y: 0 } });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Initialize Paper.js
  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup Paper.js
    paper.setup(canvasRef.current);
    
    // Set canvas size from parent or specified dimensions
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasWidth = width || rect.width || 800;
    const canvasHeight = height || rect.height || 600;
    
    paper.view.viewSize = new paper.Size(canvasWidth, canvasHeight);
    canvasRef.current.width = canvasWidth;
    canvasRef.current.height = canvasHeight;

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      paper.project.clear();
    };
  }, [width, height]);

  // Create nodes from devices
  useEffect(() => {
    if (!paper.project || devices.length === 0) return;

    // Clear existing nodes
    nodes.forEach(node => node.remove());
    connections.forEach(conn => conn.remove());

    const newNodes = new Map<string, FlowNode>();
    const newConnections: FlowConnection[] = [];

    // Create nodes with isometric layout using grid positioning
    const centerX = paper.view.bounds.width / 2;
    const centerY = paper.view.bounds.height / 2;

    devices.forEach((device, index) => {
      // Calculate tile position in isometric grid
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      // Use Isoflow grid positioning
      const tilePos = getTilePosition({ 
        tile: { x: col - 1, y: -row },
        origin: 'CENTER'
      });
      
      // Position relative to center without scroll offset (Paper.js view handles panning)
      const x = centerX + tilePos.x;
      const y = centerY + tilePos.y;
      
      const position = new paper.Point(x, y);
      const node = new FlowNode({ device, position });
      newNodes.set(device.id, node);
    });

    // Create connections between nodes
    // For now, connect sequential devices
    const deviceArray = Array.from(newNodes.values());
    for (let i = 0; i < deviceArray.length - 1; i++) {
      const from = deviceArray[i];
      const to = deviceArray[i + 1];
      
      // Get first connection type from the device
      const fromDevice = from.getDevice();
      if (fromDevice.connections.length > 0) {
        const conn = new FlowConnection({
          from,
          to,
          type: fromDevice.connections[0].type,
          status: fromDevice.connections[0].status,
        });
        newConnections.push(conn);
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);

    // Start animation loop (Paper.js handles rendering automatically)
    const animate = () => {
      newConnections.forEach(conn => conn.animate());
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  // Apply zoom and pan transformations to Paper.js view
  useEffect(() => {
    if (!paper.view) return;

    // Set zoom level
    paper.view.zoom = zoom;
    
    // Set center position (pan)
    paper.view.center = new paper.Point(
      paper.view.bounds.width / 2 - scroll.position.x / zoom,
      paper.view.bounds.height / 2 - scroll.position.y / zoom
    );
  }, [zoom, scroll]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && paper.view) {
        const rect = canvasRef.current.getBoundingClientRect();
        paper.view.viewSize = new paper.Size(rect.width, rect.height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse event handlers for pan and zoom
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      setScroll(prev => ({
        position: {
          x: prev.position.x + deltaX,
          y: prev.position.y + deltaY
        }
      }));
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -ZOOM_INCREMENT : ZOOM_INCREMENT;
    setZoom(prev => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta)));
  }, []);

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
      
      {/* Canvas for devices and connections */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}
