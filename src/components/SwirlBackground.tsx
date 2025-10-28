import { useEffect, useRef } from 'react';

export function SwirlBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize to window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Simple animation variables
    let time = 0;
    let animationId: number;
    
    // Draw flowing curves
    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear with transparency
      ctx.clearRect(0, 0, width, height);
      
      // Draw multiple flowing sine waves
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw 4 flowing curves with varying characteristics
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        
        const offset = (i - 1.5) * 40; // Vertical spacing between curves
        const phase = time * 0.0008 + i * 0.5; // Animation phase
        const hue = 200 + i * 15; // Blue to cyan gradient
        const alpha = 0.25 - i * 0.03; // Slight opacity variation
        
        ctx.strokeStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.lineWidth = 2 + i * 0.3; // Slight width variation
        
        // Draw flowing wave across screen
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + 
                   Math.sin((x * 0.003 + time * 0.0005) + phase) * 30 +
                   Math.sin((x * 0.005 + time * 0.0003) * 1.5) * 15 + 
                   offset;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      time += 16; // Increment for next frame (~60fps)
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(1.2)',
        width: '100%',
        height: '100%',
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    />
  );
}
