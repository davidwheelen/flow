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
  radius: number;
  color: string;
  active: number;
}

export interface ParticleAnimationOptions {
  canvas: HTMLCanvasElement;
  colors: string[];
  opacity?: number;
  particleCount?: number;
}

export class ParticleAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private colors: string[];
  private opacity: number;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;
  private target: Point = { x: 0, y: 0 };
  private particleCount: number;
  private animate = true;

  // Animation configuration
  private readonly PARTICLE_DISTANCE = 120;
  private readonly PARTICLE_BASE_RADIUS = 0.4;
  private readonly PARTICLE_SPEED = 0.03;

  constructor(options: ParticleAnimationOptions) {
    this.canvas = options.canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;
    this.colors = options.colors.length > 0 ? options.colors : ['#3b82f6'];
    this.opacity = options.opacity ?? 0.4;
    this.particleCount = options.particleCount ?? 100;

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

    for (let i = 0; i < this.particleCount; i++) {
      const colorIndex = Math.floor(Math.random() * this.colors.length);
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * this.PARTICLE_SPEED,
        vy: (Math.random() - 0.5) * this.PARTICLE_SPEED,
        radius: this.PARTICLE_BASE_RADIUS + Math.random() * 2,
        color: this.colors[colorIndex],
        active: 0,
      });
    }
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

  private cleanup: (() => void) | null = null;

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
    this.updateParticles();
    this.drawParticles();

    this.animationFrame = requestAnimationFrame(() => this.animateParticles());
  }

  private updateParticles(): void {
    const width = this.canvas.width;
    const height = this.canvas.height;

    for (const particle of this.particles) {
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
        particle.active = 0.3;
        // Add slight attraction to target
        particle.vx += dx * 0.0001;
        particle.vy += dy * 0.0001;
      }

      // Gradually deactivate
      if (particle.active > 0) {
        particle.active -= 0.005;
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

  private drawParticles(): void {
    // Draw connections between nearby particles
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

  private hexToRgba(hex: string, alpha: number): string {
    // Handle hex colors with or without #
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
