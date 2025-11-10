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
        d="M10 3H6v1h4V3zM8 5H6v.5h2V5zm2 0h-1v.5h1V5zm1.5.5h-1v1H12V8h.5V6a.5.5 0 0 0-.5-.5zM8 7h1v1H8V7zm-2 0h1v1H6V7zm-1-.5H4v1h1v-1zm6 0h-1v1h1v-1zm1 2.5V8h-1v1.5h-1V8H9v1.5H7V8H6v1.5H5V8H4v1c0 .28.22.5.5.5h1v1H4v1h1v.5h1V11h1v1h2v-1h1v1.5h1V11h1v1h1v-1h-1.5v-1h1a.5.5 0 0 0 .5-.5V8h-1v1.5h-1z"
        fill={isConnected && useAnimation ? baseColor : undefined}
        style={{
          transition: isConnected && useAnimation ? 'none' : 'fill 0.3s ease',
        }}
      />
      <path
        d="M4.5 0A2.5 2.5 0 0 0 2 2.5v11A2.5 2.5 0 0 0 4.5 16h7a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-11z"
        fill={isConnected && useAnimation ? undefined : baseColor}
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
