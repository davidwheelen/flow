import { useEffect, useRef, useState, useCallback } from 'react';
import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';
import { FlowNode } from './core/FlowNode';
import { FlowConnection } from './core/FlowConnection';
import { Grid } from './components/Grid';
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

    // AUTO-LAYOUT ALGORITHM
    // Strategy: Arrange devices in a grid with enough spacing
    const SPACING_X = 250; // Horizontal spacing between devices
    const SPACING_Y = 200; // Vertical spacing between devices
    const COLS = 3; // Number of columns in grid
    
    const centerX = paper.view.bounds.width / 2;
    const centerY = paper.view.bounds.height / 2;
    
    // Calculate grid dimensions to center the layout
    const totalRows = Math.ceil(devices.length / COLS);
    const totalWidth = (Math.min(devices.length, COLS) - 1) * SPACING_X;
    const totalHeight = (totalRows - 1) * SPACING_Y;
    const startX = centerX - (totalWidth / 2);
    const startY = centerY - (totalHeight / 2);

    devices.forEach((device, index) => {
      // Calculate grid position
      const row = Math.floor(index / COLS);
      const col = index % COLS;
      
      // Calculate absolute position with proper spacing
      const x = startX + (col * SPACING_X);
      const y = startY + (row * SPACING_Y);
      
      const position = new paper.Point(x, y);
      const node = new FlowNode({ device, position });
      newNodes.set(device.id, node);
    });

    setNodes(newNodes);

    // Create connections between devices based on actual device.connections data
    devices.forEach(device => {
      const fromNode = newNodes.get(device.id);
      if (!fromNode) return;

      // Note: The Connection interface doesn't have target_device_id
      // So we'll create connections between sequential devices as a fallback
      // This maintains backward compatibility
      device.connections.forEach(() => {
        // Placeholder for future implementation when target_device_id is available
      });
    });

    // Fallback: Create connections between sequential devices
    const deviceArray = Array.from(newNodes.values());
    for (let i = 0; i < deviceArray.length - 1; i++) {
      const from = deviceArray[i];
      const to = deviceArray[i + 1];
      
      // Get first connection type from the device
      const fromDevice = from.getDevice();
      if (fromDevice.connections.length > 0) {
        const connection = new FlowConnection({
          from,
          to,
          type: fromDevice.connections[0].type,
          status: fromDevice.connections[0].status,
        });
        newConnections.push(connection);
      }
    }

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
  }, [devices]); // Only re-run when devices change, NOT on zoom/pan

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
