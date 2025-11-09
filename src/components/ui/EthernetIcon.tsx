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
  const circleRef = useRef<SVGCircleElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isConnected || !useAnimation || !circleRef.current) {
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
      
      if (circleRef.current) {
        circleRef.current.style.fill = currentColor;
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
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* RJ-45 Ethernet Port Body */}
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="1.5"
        stroke={baseColor}
        strokeWidth="1.5"
        fill="rgba(0, 0, 0, 0.3)"
      />
      
      {/* Ethernet Port Pins (Top) */}
      <g stroke={baseColor} strokeWidth="1" fill="none">
        <line x1="5" y1="6" x2="5" y2="9" />
        <line x1="7.5" y1="6" x2="7.5" y2="9" />
        <line x1="10" y1="6" x2="10" y2="9" />
        <line x1="12.5" y1="6" x2="12.5" y2="9" />
        <line x1="15" y1="6" x2="15" y2="9" />
        <line x1="17.5" y1="6" x2="17.5" y2="9" />
        <line x1="19" y1="6" x2="19" y2="9" />
      </g>
      
      {/* Cable Notch (Bottom) */}
      <path
        d="M10 18 L10 15 L14 15 L14 18"
        stroke={baseColor}
        strokeWidth="1.5"
        fill="rgba(0, 0, 0, 0.2)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Status Indicator - Animated when connected */}
      <circle
        ref={circleRef}
        cx="12"
        cy="12"
        r="2.5"
        stroke={isConnected && useAnimation ? undefined : baseColor}
        fill={isConnected && useAnimation ? baseColor : 'none'}
        strokeWidth="1.5"
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
