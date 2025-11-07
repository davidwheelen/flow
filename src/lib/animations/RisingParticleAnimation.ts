/**
 * RisingParticleAnimation - Spark/Ember rising particle effect
 * Based on the animated header background from tympanus.net index2.html
 * https://tympanus.net/Development/AnimatedHeaderBackgrounds/index2.html
 */

interface RisingParticle {
  x: number;
  y: number;
  speed: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface RisingParticleAnimationOptions {
  canvas: HTMLCanvasElement;
  colors: string[];
  opacity?: number;
  particleCount?: number;
}

export class RisingParticleAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private colors: string[];
  private opacity: number;
  private particles: RisingParticle[] = [];
  private animationFrame: number | null = null;
  private maxParticleCount: number;
  private animate = true;
  private cleanup: (() => void) | null = null;

  // Animation configuration
  private readonly MIN_SPEED = 1;
  private readonly MAX_SPEED = 3;
  private readonly MIN_RADIUS = 1;
  private readonly MAX_RADIUS = 2;
  private readonly MIN_LIFE = 100;
  private readonly MAX_LIFE = 100;
  private readonly DRIFT_INTENSITY = 0.05;
  private readonly DRIFT_AMPLITUDE = 0.5;
  private readonly GLOW_BLUR = 10;
  private readonly HEX_COLOR_PATTERN = /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/;

  constructor(options: RisingParticleAnimationOptions) {
    this.canvas = options.canvas;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;
    this.colors = options.colors.length > 0 ? options.colors : ['#3b82f6'];
    this.opacity = options.opacity ?? 0.4;
    this.maxParticleCount = options.particleCount ?? 50;

    this.initCanvas();
    this.addEventListeners();
  }

  private initCanvas(): void {
    // Set canvas size to match container
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private addEventListeners(): void {
    const handleResize = () => {
      this.initCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Store cleanup function
    this.cleanup = () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  private getRandomFlowColor(): string {
    const colorIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[colorIndex];
  }

  private createParticle(): RisingParticle {
    const width = this.canvas.width;
    const height = this.canvas.height;

    return {
      x: Math.random() * width,
      y: height + 10,
      speed: this.MIN_SPEED + Math.random() * (this.MAX_SPEED - this.MIN_SPEED),
      radius: this.MIN_RADIUS + Math.random() * (this.MAX_RADIUS - this.MIN_RADIUS),
      life: 0,
      maxLife: this.MIN_LIFE + Math.random() * this.MAX_LIFE,
      color: this.getRandomFlowColor(),
    };
  }

  private updateParticle(particle: RisingParticle): number {
    // Move particle upward
    particle.y -= particle.speed;
    particle.life++;

    // Drift effect (side-to-side motion)
    particle.x += Math.sin(particle.life * this.DRIFT_INTENSITY) * this.DRIFT_AMPLITUDE;

    // Calculate opacity based on life (fade out as particle ages)
    const opacity = Math.max(0, (particle.maxLife - particle.life) / particle.maxLife);

    return opacity;
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

    // Update and draw all particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const opacity = this.updateParticle(particle);

      // Remove dead particles
      if (particle.life >= particle.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw glowing particle
      const rgbaColor = this.hexToRgba(particle.color, opacity * this.opacity);
      
      // Add glow effect
      this.ctx.shadowBlur = this.GLOW_BLUR;
      this.ctx.shadowColor = particle.color;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = rgbaColor;
      this.ctx.fill();
      
      // Reset shadow for next particle
      this.ctx.shadowBlur = 0;
    }

    // Add new particles if below max count
    if (this.particles.length < this.maxParticleCount) {
      this.particles.push(this.createParticle());
    }

    this.animationFrame = requestAnimationFrame(() => this.animateParticles());
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
