/**
 * ParticleAnimation - Based on the animated header background from tympanus.net
 * https://tympanus.net/Development/AnimatedHeaderBackgrounds/index2.html
 */

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  radius: number;
  color: string;
  active: number;
  life: number;
  maxLife: number;
}

export interface ParticleAnimationOptions {
  canvas: HTMLCanvasElement;
  colors: string[];
  direction?: 'horizontal' | 'vertical';
  opacity?: number;
  particleCount?: number;
  particleSpeed?: number;
}

export class ParticleAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private colors: string[];
  private opacity: number;
  private direction: 'horizontal' | 'vertical';
  private particleSpeed: number;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;
  private target: Point = { x: 0, y: 0 };
  private particleCount: number;
  private animate = true;
  private cleanup: (() => void) | null = null;

  // Animation configuration
  private readonly PARTICLE_DISTANCE = 120;
  private readonly PARTICLE_BASE_RADIUS = 0.4;
  private readonly PARTICLE_SPEED = 0.03;
  private readonly PARTICLE_ACTIVATION_LEVEL = 0.3;
  private readonly ATTRACTION_FORCE = 0.0001;
  private readonly DEACTIVATION_RATE = 0.005;
  private readonly HEX_COLOR_PATTERN = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;
  
  // Horizontal animation constants
  private readonly OFFSCREEN_SPAWN_MARGIN = 10;
  private readonly DRIFT_FREQUENCY = 0.02; // Slower vertical drift (reduced from 0.05)
  private readonly DRIFT_AMPLITUDE = 0.3; // Reduced drift amplitude (reduced from 0.5)

  constructor(options: ParticleAnimationOptions) {
    this.canvas = options.canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;
    this.colors = options.colors.length > 0 ? options.colors : ['#3b82f6'];
    this.direction = options.direction ?? 'vertical';
    this.opacity = options.opacity ?? 0.4;
    this.particleCount = options.particleCount ?? 100;
    this.particleSpeed = options.particleSpeed ?? 0.5; // Reduced from 2.0 to 0.5

    this.initCanvas();
    this.initParticles();
    this.addEventListeners();
  }

  private initCanvas(): void {
    // Set canvas size to match container
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private initParticles(): void {
    this.particles = [];
    const width = this.canvas.width;
    const height = this.canvas.height;

    // For horizontal mode, we don't pre-populate with particles
    // They will be created dynamically in animateParticles
    if (this.direction === 'vertical') {
      for (let i = 0; i < this.particleCount; i++) {
        const colorIndex = Math.floor(Math.random() * this.colors.length);
        this.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * this.PARTICLE_SPEED,
          vy: (Math.random() - 0.5) * this.PARTICLE_SPEED,
          speed: this.particleSpeed,
          radius: this.PARTICLE_BASE_RADIUS + Math.random() * 2,
          color: this.colors[colorIndex],
          active: 0,
          life: 0,
          maxLife: 100 + Math.random() * 100,
        });
      }
    }
  }

  private createParticle(): Particle {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const colorIndex = Math.floor(Math.random() * this.colors.length);
    
    return {
      x: this.direction === 'horizontal' ? -this.OFFSCREEN_SPAWN_MARGIN : Math.random() * width,
      y: this.direction === 'horizontal' ? 
         Math.random() * height : 
         height + this.OFFSCREEN_SPAWN_MARGIN,
      vx: 0,
      vy: 0,
      speed: this.particleSpeed * (1 + Math.random()),
      radius: 1 + Math.random() * 2,
      color: this.colors[colorIndex],
      active: 0,
      life: 0,
      maxLife: 100 + Math.random() * 100,
    };
  }

  private addEventListeners(): void {
    const handleResize = () => {
      this.initCanvas();
      this.initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      this.target.x = e.clientX - rect.left;
      this.target.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    this.canvas.addEventListener('mousemove', handleMouseMove);

    // Store cleanup function
    this.cleanup = () => {
      window.removeEventListener('resize', handleResize);
      this.canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }

  public start(): void {
    this.animate = true;
    this.animateParticles();
  }

  public stop(): void {
    this.animate = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.cleanup) {
      this.cleanup();
    }
  }

  private animateParticles(): void {
    if (!this.animate) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Add new particles for horizontal mode if below max count
    if (this.direction === 'horizontal' && this.particles.length < this.particleCount) {
      this.particles.push(this.createParticle());
    }
    
    this.updateParticles();
    this.drawParticles();

    this.animationFrame = requestAnimationFrame(() => this.animateParticles());
  }

  private updateParticles(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      if (this.direction === 'horizontal') {
        // Move particle horizontally (left to right)
        particle.x += particle.speed;
        // Add slight vertical drift
        particle.y += Math.sin(particle.life * this.DRIFT_FREQUENCY) * this.DRIFT_AMPLITUDE;
        particle.life++;
        
        // Remove particles that are off screen
        if (particle.x > width + this.OFFSCREEN_SPAWN_MARGIN) {
          this.particles.splice(i, 1);
          continue;
        }
      } else {
        // Original vertical behavior
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) {
          particle.vx = -particle.vx;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }
        if (particle.y < 0 || particle.y > height) {
          particle.vy = -particle.vy;
          particle.y = Math.max(0, Math.min(height, particle.y));
        }

        // Calculate distance to target (mouse position)
        const dx = this.target.x - particle.x;
        const dy = this.target.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Activate particles near the target
        if (distance < this.PARTICLE_DISTANCE) {
          particle.active = this.PARTICLE_ACTIVATION_LEVEL;
          // Add slight attraction to target
          particle.vx += dx * this.ATTRACTION_FORCE;
          particle.vy += dy * this.ATTRACTION_FORCE;
        }

        // Gradually deactivate
        if (particle.active > 0) {
          particle.active -= this.DEACTIVATION_RATE;
          if (particle.active < 0) particle.active = 0;
        }

        // Limit velocity
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > this.PARTICLE_SPEED * 2) {
          particle.vx = (particle.vx / speed) * this.PARTICLE_SPEED * 2;
          particle.vy = (particle.vy / speed) * this.PARTICLE_SPEED * 2;
        }
      }
    }
  }

  private drawParticles(): void {
    if (this.direction === 'horizontal') {
      // For horizontal mode, draw simple glowing particles without connections
      for (const p of this.particles) {
        // Calculate opacity based on life
        const lifeOpacity = Math.max(0, (p.maxLife - p.life) / p.maxLife);
        const particleOpacity = lifeOpacity * this.opacity;
        
        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = p.color;
        
        this.ctx.fillStyle = this.hexToRgba(p.color, particleOpacity);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Reset shadow for next particle
        this.ctx.shadowBlur = 0;
      }
    } else {
      // Original vertical behavior - draw connections between nearby particles
      // Note: O(n²) complexity is acceptable for ~100 particles (~5000 checks/frame at 60fps)
      // Consider spatial partitioning if particle count increases significantly
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];
        
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.PARTICLE_DISTANCE) {
            this.ctx.strokeStyle = this.hexToRgba(
              p1.color,
              (1 - distance / this.PARTICLE_DISTANCE) * this.opacity * 0.5
            );
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }

        // Draw particle circles
        const activeOpacity = Math.max(this.opacity, p1.active);
        this.ctx.fillStyle = this.hexToRgba(p1.color, activeOpacity);
        this.ctx.beginPath();
        this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private hexToRgba(hex: string, alpha: number): string {
    // Handle hex colors with or without #
    const cleanHex = hex.replace('#', '');
    
    // Validate hex format (3 or 6 characters)
    if (!this.HEX_COLOR_PATTERN.test(cleanHex)) {
      console.warn(`Invalid hex color: ${hex}, using fallback color`);
      return `rgba(59, 130, 246, ${alpha})`; // Fallback to primary blue
    }
    
    // Expand short hex codes (e.g., '#fff' -> '#ffffff')
    const fullHex = cleanHex.length === 3
      ? cleanHex.split('').map(c => c + c).join('')
      : cleanHex;
    
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
