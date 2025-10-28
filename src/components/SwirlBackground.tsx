import { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

const particleCount = 700;
const particlePropCount = 9;
const rangeY = 100;
const baseTTL = 50;
const rangeTTL = 150;
const baseSpeed = 0.1;
const rangeSpeed = 2;
const baseRadius = 1;
const rangeRadius = 4;
const baseHue = 165; // Emerald green from app theme
const rangeHue = 115; // Range to purple (165-280)
const noiseSteps = 8;
const xOff = 0.00073; // Changed from 0.00125 to make pattern ~70% larger
const yOff = 0.00073; // Changed from 0.00125 to make pattern ~70% larger
const zOff = 0.0005;
const backgroundColor = 'hsla(260,40%,5%,1)'; // Exact from source
const TAU = Math.PI * 2;

export function SwirlBackground() {
  const canvasARef = useRef<HTMLCanvasElement>(null);
  const canvasBRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvasA = canvasARef.current;
    const canvasB = canvasBRef.current;
    if (!canvasA || !canvasB) return;
    
    const ctxA = canvasA.getContext('2d');
    const ctxB = canvasB.getContext('2d');
    if (!ctxA || !ctxB) return;
    
    // Setup
    const resize = () => {
      const { innerWidth, innerHeight } = window;
      canvasA.width = innerWidth;
      canvasA.height = innerHeight;
      canvasB.width = innerWidth;
      canvasB.height = innerHeight;
    };
    resize();
    
    const center = [canvasA.width / 2, canvasA.height / 2];
    const noise3D = createNoise3D();
    
    // Particle properties stored in Float32Array for performance
    const particleProps = new Float32Array(particleCount * particlePropCount);
    
    const rand = (n: number) => n * Math.random();
    const randRange = (n: number) => n - rand(2 * n);
    const fadeInOut = (t: number, m: number) => {
      const hm = 0.5 * m;
      return Math.abs((t + hm) % m - hm) / hm;
    };
    const lerp = (n1: number, n2: number, speed: number) => (1 - speed) * n1 + speed * n2;
    
    const initParticle = (i: number) => {
      const x = rand(canvasA.width);
      const y = center[1] + randRange(rangeY);
      const vx = 0;
      const vy = 0;
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const speed = baseSpeed + rand(rangeSpeed);
      const radius = baseRadius + rand(rangeRadius);
      const hue = baseHue + rand(rangeHue);
      
      particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
    };
    
    // Initialize all particles
    for (let i = 0; i < particleCount * particlePropCount; i += particlePropCount) {
      initParticle(i);
    }
    
    let tick = 0;
    let animationId: number;
    
    const drawParticle = (x: number, y: number, x2: number, y2: number, life: number, ttl: number, radius: number, hue: number) => {
      ctxA.save();
      ctxA.lineCap = 'round';
      ctxA.lineWidth = radius;
      ctxA.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctxA.beginPath();
      ctxA.moveTo(x, y);
      ctxA.lineTo(x2, y2);
      ctxA.stroke();
      ctxA.closePath();
      ctxA.restore();
    };
    
    const checkBounds = (x: number, y: number) => {
      return x > canvasA.width || x < 0 || y > canvasA.height || y < 0;
    };
    
    const updateParticle = (i: number) => {
      const i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i;
      const i6 = 5 + i, i7 = 6 + i, i8 = 7 + i, i9 = 8 + i;
      
      const x = particleProps[i];
      const y = particleProps[i2];
      const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
      const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      const life = particleProps[i5];
      const ttl = particleProps[i6];
      const speed = particleProps[i7];
      const x2 = x + vx * speed;
      const y2 = y + vy * speed;
      const radius = particleProps[i8];
      const hue = particleProps[i9];
      
      drawParticle(x, y, x2, y2, life, ttl, radius, hue);
      
      particleProps[i] = x2;
      particleProps[i2] = y2;
      particleProps[i3] = vx;
      particleProps[i4] = vy;
      particleProps[i5] = life + 1;
      
      if (checkBounds(x, y) || life > ttl) {
        initParticle(i);
      }
    };
    
    const renderGlow = () => {
      ctxB.save();
      ctxB.filter = 'blur(8px) brightness(200%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
      
      ctxB.save();
      ctxB.filter = 'blur(4px) brightness(200%)';
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };
    
    const renderToScreen = () => {
      ctxB.save();
      ctxB.globalCompositeOperation = 'lighter';
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();
    };
    
    const draw = () => {
      tick++;
      ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
      ctxB.fillStyle = backgroundColor;
      ctxB.fillRect(0, 0, canvasA.width, canvasA.height);
      
      for (let i = 0; i < particleCount * particlePropCount; i += particlePropCount) {
        updateParticle(i);
      }
      
      renderGlow();
      renderToScreen();
      
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return (
    <>
      <canvas ref={canvasARef} style={{ display: 'none' }} />
      <canvas
        ref={canvasBRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
