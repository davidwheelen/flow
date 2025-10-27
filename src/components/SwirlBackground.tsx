import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

export function SwirlBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas size
    const updateSize = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    
    // Initialize simplex noise
    const noise3D = createNoise3D();
    
    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    
    const particles: Particle[] = [];
    const particleCount = 300;
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0
      });
    }
    
    let time = 0;
    let animationId: number;
    
    // Animation loop
    function animate() {
      if (!canvas || !ctx) return;
      
      time += 0.005;
      
      // Fade effect
      ctx.fillStyle = 'rgba(26, 26, 26, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(p => {
        if (!canvas || !ctx) return;
        
        // Get noise value for particle position
        const noiseX = noise3D(p.x / 200, p.y / 200, time);
        const noiseY = noise3D(p.x / 200 + 100, p.y / 200 + 100, time);
        
        // Apply noise to velocity (swirl effect)
        p.vx = noiseX * 2;
        p.vy = noiseY * 2;
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Draw particle
        ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      updateSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
}
