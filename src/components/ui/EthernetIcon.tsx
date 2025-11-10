import { useRef, useEffect } from 'react';

interface EthernetIconProps {
  isConnected: boolean;
  useAnimation?: boolean;
  colors?: string[];
  size?: number;
}

export const EthernetIcon: React.FC<EthernetIconProps> = ({ 
  isConnected, 
  useAnimation = true, 
  colors = ['#3b82f6', '#8b5cf6', '#ec4899'],
  size = 48
}) => {
  const iconRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isConnected || !useAnimation || !pathRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
      return;
    }

    const duration = 10000; // 10 seconds for full cycle
    
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
      
      if (pathRef.current) {
        pathRef.current.style.fill = currentColor;
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
  }, [isConnected, useAnimation, colors]);

  const baseColor = isConnected ? '#22c55e' : '#6b7280';

  return (
    <svg
      ref={iconRef}
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill={isConnected && useAnimation ? undefined : baseColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M14 13.5v-7a.5.5 0 0 0-.5-.5H12V4.5a.5.5 0 0 0-.5-.5h-1v-.5A.5.5 0 0 0 10 3H6a.5.5 0 0 0-.5.5V4h-1a.5.5 0 0 0-.5.5V6H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5M3.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m2 0h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zm2.25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25z"
        fill={isConnected && useAnimation ? baseColor : undefined}
        style={{
          transition: isConnected && useAnimation ? 'none' : 'fill 0.3s ease',
        }}
      />
      <path
        d="M6 4.5H4.75a.75.75 0 0 0 0 1.5h.5a.25.25 0 0 1 .25.25v4.5a.25.25 0 0 1-.25.25h-.5a.75.75 0 0 0 0 1.5H6zm4 0h1.25a.75.75 0 0 1 0 1.5h-.5a.25.25 0 0 0-.25.25v4.5c0 .138.112.25.25.25h.5a.75.75 0 0 1 0 1.5H10z"
        fill={isConnected && useAnimation ? baseColor : undefined}
        style={{
          transition: isConnected && useAnimation ? 'none' : 'fill 0.3s ease',
        }}
      />
    </svg>
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
