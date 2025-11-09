import React, { useRef, useEffect } from 'react';
import { EthernetIcon } from './EthernetIcon';

interface PortProps {
  name: string;
  type: string;
  speed: string;
  isConnected: boolean;
  colors?: string[];
}

export const EthernetPort: React.FC<PortProps> = ({ 
  name, 
  type, 
  speed, 
  isConnected,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899']
}) => {
  const bgRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Subtle background fade animation using theme colors
  useEffect(() => {
    if (!isConnected || !bgRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
      return;
    }

    const duration = 8000; // 8 seconds for full cycle
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = (elapsed % duration) / duration;
      
      // Calculate current color by interpolating between colors
      const colorIndex = Math.floor(progress * colors.length);
      const nextColorIndex = (colorIndex + 1) % colors.length;
      const colorProgress = (progress * colors.length) % 1;
      
      const currentColor = interpolateColor(
        colors[colorIndex],
        colors[nextColorIndex],
        colorProgress
      );
      
      if (bgRef.current) {
        // Apply subtle color to background with very low opacity
        bgRef.current.style.background = `linear-gradient(135deg, ${currentColor}15, rgba(30, 30, 30, 0.5))`;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
    };
  }, [isConnected, colors]);

  return (
    <div
      ref={bgRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '8px',
        background: 'rgba(30, 30, 30, 0.5)',
        margin: '0',
        width: '100%',
        minWidth: '110px',
        border: isConnected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
        transition: 'border-color 0.3s ease',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          marginBottom: '8px',
          color: isConnected ? '#e0e0e0' : '#a0a0a0',
        }}
      >
        {name}
      </div>
      
      <div
        style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          margin: '8px 0',
        }}
      >
        <EthernetIcon
          isConnected={isConnected}
          useAnimation={isConnected}
          colors={colors}
          size={48}
        />
      </div>
      
      <div
        style={{
          fontSize: '11px',
          color: '#a0a0a0',
          marginTop: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {type}
      </div>
      
      <div
        style={{
          fontSize: '13px',
          color: isConnected ? '#22c55e' : '#6b7280',
          marginTop: '4px',
          fontWeight: isConnected ? 600 : 400,
        }}
      >
        {speed}
      </div>
    </div>
  );
};

// Helper function to interpolate between two hex colors
function interpolateColor(color1: string, color2: string, progress: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  if (!c1 || !c2) return color1;
  
  const r = Math.round(c1.r + (c2.r - c1.r) * progress);
  const g = Math.round(c1.g + (c2.g - c1.g) * progress);
  const b = Math.round(c1.b + (c2.b - c1.b) * progress);
  
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
