import { useEffect, useRef, useState, useCallback } from 'react';
import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';
import { FlowNode } from './core/FlowNode';
import { FlowConnection } from './core/FlowConnection';
import { IsometricGridSnapper } from './utils/IsometricGridSnapper';

interface FlowCanvasProps {
  devices: PeplinkDevice[];
  width?: number;
  height?: number;
  className?: string;
}

export function FlowCanvas({ devices, width, height, className }: FlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Map<string, FlowNode>>(new Map());
  const [connections, setConnections] = useState<FlowConnection[]>([]);
  const animationFrameRef = useRef<number>();
  
  // Zoom and grid state
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const gridSnapperRef = useRef<IsometricGridSnapper>(new IsometricGridSnapper(50));
  const gridLayerRef = useRef<paper.Layer | null>(null);
  const baseGridSpacing = 50;
  const minZoom = 0.5;
  const maxZoom = 3.0;

  // Render isometric grid
  const renderIsometricGrid = useCallback(() => {
    if (!gridLayerRef.current || !paper.view) return;

    // Clear existing grid
    gridLayerRef.current.removeChildren();

    const viewWidth = paper.view.bounds.width;
    const viewHeight = paper.view.bounds.height;
    
    // Apply zoom to grid spacing
    const gridSpacing = baseGridSpacing * zoomLevel;
    const angle = 30;
    const angleRad = (angle * Math.PI) / 180;
    const tanAngle = Math.tan(angleRad);

    // Background
    const background = new paper.Path.Rectangle(
      new paper.Point(0, 0),
      new paper.Size(viewWidth, viewHeight)
    );
    background.fillColor = new paper.Color('#2d2d2d');
    gridLayerRef.current.addChild(background);

    // Calculate grid bounds with padding
    const padding = Math.max(viewWidth, viewHeight);
    const startX = -padding;
    const endX = viewWidth + padding;
    const startY = -padding;
    const endY = viewHeight + padding;

    // Orange grid lines - NO GLOW
    const gridColor = new paper.Color('#ff6b35');
    const lineWidth = 1.5;

    // Draw diagonal lines (↘) - down-right
    for (let offset = startX - viewHeight; offset < endX + viewHeight; offset += gridSpacing) {
      const line = new paper.Path();
      line.strokeColor = gridColor;
      line.strokeWidth = lineWidth;
      
      const x1 = offset;
      const y1 = startY;
      const x2 = offset + (endY - startY) / tanAngle;
      const y2 = endY;
      
      line.moveTo(new paper.Point(x1, y1));
      line.lineTo(new paper.Point(x2, y2));
      gridLayerRef.current.addChild(line);
    }

    // Draw diagonal lines (↙) - down-left
    for (let offset = startX - viewHeight; offset < endX + viewHeight; offset += gridSpacing) {
      const line = new paper.Path();
      line.strokeColor = gridColor;
      line.strokeWidth = lineWidth;
      
      const x1 = offset;
      const y1 = startY;
      const x2 = offset - (endY - startY) / tanAngle;
      const y2 = endY;
      
      line.moveTo(new paper.Point(x1, y1));
      line.lineTo(new paper.Point(x2, y2));
      gridLayerRef.current.addChild(line);
    }
  }, [zoomLevel]);

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

    // Create grid layer
    gridLayerRef.current = new paper.Layer();
    gridLayerRef.current.sendToBack();
    
    // Render initial grid
    renderIsometricGrid();

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      paper.project.clear();
    };
  }, [width, height, renderIsometricGrid]);

  // Update grid when zoom changes
  useEffect(() => {
    renderIsometricGrid();
    // Update grid snapper spacing
    gridSnapperRef.current.setGridSpacing(baseGridSpacing * zoomLevel);
  }, [zoomLevel, renderIsometricGrid]);

  // Zoom handler
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    const oldZoom = zoomLevel;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel + delta));
    
    if (newZoom !== oldZoom) {
      setZoomLevel(newZoom);
      
      // If zoom center provided, adjust pan to zoom toward that point
      if (centerX !== undefined && centerY !== undefined) {
        const zoomRatio = newZoom / oldZoom;
        setPanX(centerX - (centerX - panX) * zoomRatio);
        setPanY(centerY - (centerY - panY) * zoomRatio);
      }
    }
  }, [zoomLevel, panX, panY]);

  // Mouse wheel zoom handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      const delta = event.deltaY > 0 ? -0.1 : 0.1;
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      handleZoom(delta, mouseX, mouseY);
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [handleZoom]);

  // Create nodes from devices
  useEffect(() => {
    if (!paper.project || devices.length === 0) return;

    // Clear existing nodes
    nodes.forEach(node => node.remove());
    connections.forEach(conn => conn.remove());

    const newNodes = new Map<string, FlowNode>();
    const newConnections: FlowConnection[] = [];

    // Create nodes with isometric layout - snap to grid
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
      
      // Snap to grid diamond center
      const snapPoint = gridSnapperRef.current.getSnapPoint(x, y);
      const position = new paper.Point(snapPoint.x, snapPoint.y);
      const node = new FlowNode({ device, position, scale: zoomLevel });
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
  }, [devices, zoomLevel]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && paper.view) {
        const rect = canvasRef.current.getBoundingClientRect();
        paper.view.viewSize = new paper.Size(rect.width, rect.height);
        renderIsometricGrid();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderIsometricGrid]);

  // Reset zoom handler
  const resetZoom = useCallback(() => {
    setZoomLevel(1.0);
    setPanX(0);
    setPanY(0);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: width || '100%',
          height: height || '100%',
          display: 'block',
          backgroundColor: '#1a1a1a',
        }}
      />
      
      {/* Zoom Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(45, 45, 45, 0.9)',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #444',
        }}
      >
        <button
          onClick={() => handleZoom(0.1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          +
        </button>
        
        <span
          style={{
            color: '#e0e0e0',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            padding: '4px 0',
          }}
        >
          {Math.round(zoomLevel * 100)}%
        </span>
        
        <button
          onClick={() => handleZoom(-0.1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          −
        </button>
        
        <button
          onClick={resetZoom}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginTop: '4px',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
