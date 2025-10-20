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

/**
 * Renders an isometric grid background with orange neon glow effect
 */
function renderIsometricGrid() {
  const gridSpacing = 50;
  const angle = 30 * (Math.PI / 180);
  
  // Create background layer
  const bgLayer = new paper.Layer();
  bgLayer.sendToBack();
  
  // Dark background rectangle
  const background = new paper.Path.Rectangle({
    point: [0, 0],
    size: [paper.view.size.width, paper.view.size.height],
    fillColor: new paper.Color('#2d2d2d'),
  });
  bgLayer.addChild(background);
  
  // Orange grid lines with glow
  const gridColor = new paper.Color('#ff6b35');
  
  // Diagonal lines going down-right
  for (let i = -paper.view.size.height; i < paper.view.size.width + paper.view.size.height; i += gridSpacing) {
    const line = new paper.Path.Line({
      from: [i, 0],
      to: [i + paper.view.size.height * Math.tan(angle), paper.view.size.height],
      strokeColor: gridColor,
      strokeWidth: 1,
    });
    
    // Glow effect
    line.shadowColor = gridColor;
    line.shadowBlur = 8;
    
    bgLayer.addChild(line);
  }
  
  // Diagonal lines going down-left
  for (let i = -paper.view.size.height; i < paper.view.size.width + paper.view.size.height; i += gridSpacing) {
    const line = new paper.Path.Line({
      from: [i, 0],
      to: [i - paper.view.size.height * Math.tan(angle), paper.view.size.height],
      strokeColor: gridColor,
      strokeWidth: 1,
    });
    
    // Glow effect
    line.shadowColor = gridColor;
    line.shadowBlur = 8;
    
    bgLayer.addChild(line);
  }
}


export function FlowCanvas({ devices, width, height, className }: FlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Map<string, FlowNode>>(new Map());
  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const animationFrameRef = useRef<number>();

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

    // Render isometric grid background
    renderIsometricGrid();

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
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: width || '100%',
        height: height || '100%',
        display: 'block',
        backgroundColor: '#2d2d2d',
      }}
    />
  );
}
