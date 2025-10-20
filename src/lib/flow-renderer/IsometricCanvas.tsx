import { useEffect, useRef, useCallback } from 'react';
import { PeplinkDevice } from '@/types/network.types';

interface IsometricCanvasProps {
  devices: PeplinkDevice[];
  width?: number;
  height?: number;
  className?: string;
}

export function IsometricCanvas({ devices, width, height, className }: IsometricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Canvas state
  const panXRef = useRef<number>(0);
  const panYRef = useRef<number>(0);
  const zoomLevelRef = useRef<number>(1);
  const baseGridSpacing = 50;
  
  // Mouse interaction state
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const renderIsometricGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    
    const panX = panXRef.current;
    const panY = panYRef.current;
    const zoomLevel = zoomLevelRef.current;
    
    // Dark background
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoomLevel, zoomLevel);
    
    // Calculate world-space bounds of visible area
    const worldBounds = {
      left: -panX / zoomLevel,
      right: (canvas.width - panX) / zoomLevel,
      top: -panY / zoomLevel,
      bottom: (canvas.height - panY) / zoomLevel
    };
    
    // Extend bounds to ensure full coverage
    const padding = baseGridSpacing * 3;
    worldBounds.left -= padding;
    worldBounds.right += padding;
    worldBounds.top -= padding;
    worldBounds.bottom += padding;
    
    const angle = 30 * Math.PI / 180;
    const tan30 = Math.tan(angle);
    
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 1.5 / zoomLevel;
    
    // Draw lines at 30° (down-right ↘)
    // These lines have equation: y = tan(30°) * x + c
    // Or: x - y/tan(30°) = constant
    const minC1 = worldBounds.left - worldBounds.bottom / tan30;
    const maxC1 = worldBounds.right - worldBounds.top / tan30;
    
    for (let c = Math.floor(minC1 / baseGridSpacing) * baseGridSpacing; 
         c <= maxC1; 
         c += baseGridSpacing) {
      ctx.beginPath();
      
      // Line starts at left or top edge
      let x1 = worldBounds.left;
      let y1 = (x1 - c) * tan30;
      
      if (y1 < worldBounds.top) {
        y1 = worldBounds.top;
        x1 = c + y1 / tan30;
      }
      
      // Line ends at right or bottom edge
      let x2 = worldBounds.right;
      let y2 = (x2 - c) * tan30;
      
      if (y2 > worldBounds.bottom) {
        y2 = worldBounds.bottom;
        x2 = c + y2 / tan30;
      }
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    // Draw lines at -30° (down-left ↙)
    // These lines have equation: y = -tan(30°) * x + c
    // Or: x + y/tan(30°) = constant
    const minC2 = worldBounds.left + worldBounds.bottom / tan30;
    const maxC2 = worldBounds.right + worldBounds.top / tan30;
    
    for (let c = Math.floor(minC2 / baseGridSpacing) * baseGridSpacing; 
         c <= maxC2; 
         c += baseGridSpacing) {
      ctx.beginPath();
      
      // Line starts at left or top edge
      let x1 = worldBounds.left;
      let y1 = -(x1 - c) * tan30;
      
      if (y1 < worldBounds.top) {
        y1 = worldBounds.top;
        x1 = c - y1 / tan30;
      }
      
      // Line ends at right or bottom edge
      let x2 = worldBounds.right;
      let y2 = -(x2 - c) * tan30;
      
      if (y2 > worldBounds.bottom) {
        y2 = worldBounds.bottom;
        x2 = c - y2 / tan30;
      }
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    
    ctx.restore();
  }, [baseGridSpacing]);
  
  const render = useCallback(() => {
    renderIsometricGrid();
  }, [renderIsometricGrid]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctxRef.current = ctx;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = width || rect.width || 800;
    const canvasHeight = height || rect.height || 600;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Center the view
    panXRef.current = canvasWidth / 2;
    panYRef.current = canvasHeight / 2;
    
    render();
  }, [width, height, render]);
  
  // Handle mouse wheel for zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate zoom factor
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = zoomLevelRef.current * zoomFactor;
    
    // Limit zoom range
    if (newZoom < 0.1 || newZoom > 5) return;
    
    // Zoom towards mouse position
    const worldX = (mouseX - panXRef.current) / zoomLevelRef.current;
    const worldY = (mouseY - panYRef.current) / zoomLevelRef.current;
    
    zoomLevelRef.current = newZoom;
    panXRef.current = mouseX - worldX * newZoom;
    panYRef.current = mouseY - worldY * newZoom;
    
    render();
  }, [render]);
  
  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);
  
  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    
    panXRef.current += deltaX;
    panYRef.current += deltaY;
    
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    
    render();
  }, [render]);
  
  // Handle mouse up for panning
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);
  
  // Attach wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);
  
  // Re-render when devices change
  useEffect(() => {
    render();
  }, [devices, render]);
  
  return (
    <canvas
      ref={canvasRef}
      className={className}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: width || '100%',
        height: height || '100%',
        display: 'block',
        cursor: isDraggingRef.current ? 'grabbing' : 'grab',
      }}
    />
  );
}
