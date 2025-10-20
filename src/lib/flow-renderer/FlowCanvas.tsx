import { useEffect, useRef, useState } from 'react';
import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';
import { FlowNode } from './core/FlowNode';
import { FlowConnection } from './core/FlowConnection';

interface FlowCanvasProps {
  devices: PeplinkDevice[];
  width?: number;
  height?: number;
  className?: string;
}

export function FlowCanvas({ devices, width, height, className }: FlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Map<string, FlowNode>>(new Map());
  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const animationFrameRef = useRef<number>();

  // Render isometric diamond grid background
  const renderIsometricGrid = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const gridSpacing = 50; // Distance between parallel diagonal lines
    const angle = 30; // Isometric angle in degrees
    const angleRad = (angle * Math.PI) / 180;

    // Dark background
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, width, height);

    // Orange grid lines with neon glow
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ff6b35';
    ctx.shadowBlur = 10;

    // Set 1: Diagonal lines going down-right (↘)
    for (let offset = -height; offset < width + height; offset += gridSpacing) {
      ctx.beginPath();
      const startX = offset;
      const startY = 0;
      const endX = offset + height / Math.tan(angleRad);
      const endY = height;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Set 2: Diagonal lines going down-left (↙)
    for (let offset = -height; offset < width + height; offset += gridSpacing) {
      ctx.beginPath();
      const startX = offset;
      const startY = 0;
      const endX = offset - height / Math.tan(angleRad);
      const endY = height;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Reset shadow for other rendering
    ctx.shadowBlur = 0;
  };

  // Initialize background canvas with grid
  useEffect(() => {
    if (!backgroundCanvasRef.current) return;

    const rect = backgroundCanvasRef.current.getBoundingClientRect();
    const canvasWidth = width || rect.width || 800;
    const canvasHeight = height || rect.height || 600;

    backgroundCanvasRef.current.width = canvasWidth;
    backgroundCanvasRef.current.height = canvasHeight;

    renderIsometricGrid(backgroundCanvasRef.current);
  }, [width, height]);

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

    // Create nodes with isometric layout
    const centerX = paper.view.bounds.width / 2;
    const centerY = paper.view.bounds.height / 2;
    const spacing = 200;

    devices.forEach((device, index) => {
      // Calculate position in isometric grid
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      // Isometric positioning
      const x = centerX + (col - 1) * spacing - (row * spacing / 2);
      const y = centerY + (row * spacing * 0.5);
      
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && paper.view) {
        const rect = canvasRef.current.getBoundingClientRect();
        paper.view.viewSize = new paper.Size(rect.width, rect.height);
      }
      if (backgroundCanvasRef.current) {
        const rect = backgroundCanvasRef.current.getBoundingClientRect();
        backgroundCanvasRef.current.width = rect.width;
        backgroundCanvasRef.current.height = rect.height;
        renderIsometricGrid(backgroundCanvasRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ position: 'relative', width: width || '100%', height: height || '100%' }}>
      <canvas
        ref={backgroundCanvasRef}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}
