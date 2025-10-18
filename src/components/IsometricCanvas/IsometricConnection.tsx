/**
 * Isometric Connection Renderer
 * Renders connections between devices as lines in isometric space
 */

import { Connection, ConnectionType } from '@/types/network.types';
import { Point3D, toIsometric, applyCamera, CameraTransform } from '@/utils/isometricMath';
import { RenderObject } from './IsometricRenderer';

const CONNECTION_COLORS: Record<ConnectionType, string> = {
  wan: '#3b82f6',
  cellular: '#a855f7',
  wifi: '#22c55e',
  sfp: '#f97316',
};

const CONNECTION_DASH_PATTERNS: Record<ConnectionType, number[]> = {
  wan: [], // Solid
  cellular: [8, 4], // Dashed
  wifi: [2, 3], // Dotted
  sfp: [], // Solid thick
};

export interface IsometricConnectionProps {
  id: string;
  connection: Connection;
  fromPosition: Point3D;
  toPosition: Point3D;
  fromDeviceId: string;
  toDeviceId: string;
}

export class IsometricConnection implements RenderObject {
  id: string;
  depth: number;
  private connection: Connection;
  private fromPosition: Point3D;
  private toPosition: Point3D;
  private particlePositions: number[] = [];
  private lastParticleTime = 0;

  constructor(props: IsometricConnectionProps) {
    this.id = props.id;
    this.connection = props.connection;
    this.fromPosition = props.fromPosition;
    this.toPosition = props.toPosition;

    // Calculate depth as midpoint
    const midX = (this.fromPosition.x + this.toPosition.x) / 2;
    const midY = (this.fromPosition.y + this.toPosition.y) / 2;
    const midZ = (this.fromPosition.z + this.toPosition.z) / 2;
    this.depth = midX + midY + midZ;

    // Initialize particles
    this.initializeParticles();
  }

  /**
   * Initialize particle positions for flow animation
   */
  private initializeParticles(): void {
    if (this.connection.status === 'connected') {
      // Start with 3-5 particles at random positions
      const numParticles = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numParticles; i++) {
        this.particlePositions.push(Math.random());
      }
    }
  }

  /**
   * Update particle positions for animation
   */
  private updateParticles(): void {
    if (this.connection.status !== 'connected') {
      this.particlePositions = [];
      return;
    }

    const now = Date.now();
    const deltaTime = now - this.lastParticleTime;
    this.lastParticleTime = now;

    // Move particles along the line
    const speed = 0.0003; // Speed based on connection speed
    const movement = speed * deltaTime;

    this.particlePositions = this.particlePositions
      .map(pos => pos + movement)
      .filter(pos => pos <= 1.0); // Remove particles that reached the end

    // Add new particle if needed
    if (this.particlePositions.length < 3 && Math.random() < 0.02) {
      this.particlePositions.push(0);
    }
  }

  /**
   * Update connection data
   */
  update(props: Partial<IsometricConnectionProps>): void {
    if (props.connection) this.connection = props.connection;
    if (props.fromPosition) this.fromPosition = props.fromPosition;
    if (props.toPosition) this.toPosition = props.toPosition;

    // Recalculate depth
    const midX = (this.fromPosition.x + this.toPosition.x) / 2;
    const midY = (this.fromPosition.y + this.toPosition.y) / 2;
    const midZ = (this.fromPosition.z + this.toPosition.z) / 2;
    this.depth = midX + midY + midZ;
  }

  /**
   * Draw the connection line
   */
  private drawLine(ctx: CanvasRenderingContext2D, camera: CameraTransform): void {
    // Connection line starts from top of source device and goes to top of target
    const from3D = {
      x: this.fromPosition.x,
      y: this.fromPosition.y,
      z: this.fromPosition.z + 60, // Height of device box
    };

    const to3D = {
      x: this.toPosition.x,
      y: this.toPosition.y,
      z: this.toPosition.z + 60,
    };

    // Convert to screen coordinates
    const from2D = toIsometric(from3D.x, from3D.y, from3D.z);
    const to2D = toIsometric(to3D.x, to3D.y, to3D.z);

    const screenFrom = applyCamera(from2D, camera);
    const screenTo = applyCamera(to2D, camera);

    // Get connection styling
    const color = CONNECTION_COLORS[this.connection.type];
    const dashPattern = CONNECTION_DASH_PATTERNS[this.connection.type];
    const lineWidth = this.connection.type === 'sfp' ? 3 : 2;

    // Draw the line
    ctx.strokeStyle = this.connection.status === 'connected' ? color : '#9ca3af';
    ctx.lineWidth = lineWidth * camera.scale;
    ctx.setLineDash(dashPattern.map(d => d * camera.scale));
    
    // Add glow effect for active connections
    if (this.connection.status === 'connected') {
      ctx.shadowColor = color;
      ctx.shadowBlur = 5 * camera.scale;
    }

    ctx.beginPath();
    ctx.moveTo(screenFrom.x, screenFrom.y);
    ctx.lineTo(screenTo.x, screenTo.y);
    ctx.stroke();

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.setLineDash([]);
  }

  /**
   * Draw animated particles flowing along the connection
   */
  private drawParticles(ctx: CanvasRenderingContext2D, camera: CameraTransform): void {
    if (this.connection.status !== 'connected') return;

    this.updateParticles();

    const from3D = {
      x: this.fromPosition.x,
      y: this.fromPosition.y,
      z: this.fromPosition.z + 60,
    };

    const to3D = {
      x: this.toPosition.x,
      y: this.toPosition.y,
      z: this.toPosition.z + 60,
    };

    const color = CONNECTION_COLORS[this.connection.type];

    this.particlePositions.forEach(t => {
      // Interpolate position along the line
      const particlePos3D = {
        x: from3D.x + (to3D.x - from3D.x) * t,
        y: from3D.y + (to3D.y - from3D.y) * t,
        z: from3D.z + (to3D.z - from3D.z) * t,
      };

      const particle2D = toIsometric(particlePos3D.x, particlePos3D.y, particlePos3D.z);
      const screenPos = applyCamera(particle2D, camera);

      // Draw particle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, 3 * camera.scale, 0, Math.PI * 2);
      ctx.fill();

      // Add glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 * camera.scale;
      ctx.beginPath();
      ctx.arc(screenPos.x, screenPos.y, 3 * camera.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    });
  }

  /**
   * Draw connection label with metrics
   */
  private drawLabel(ctx: CanvasRenderingContext2D, camera: CameraTransform): void {
    if (this.connection.status !== 'connected') return;
    if (!this.connection.metrics || this.connection.metrics.speedMbps === 0) return;

    // Position label at midpoint
    const mid3D = {
      x: (this.fromPosition.x + this.toPosition.x) / 2,
      y: (this.fromPosition.y + this.toPosition.y) / 2,
      z: (this.fromPosition.z + this.toPosition.z) / 2 + 70, // Above the line
    };

    const mid2D = toIsometric(mid3D.x, mid3D.y, mid3D.z);
    const screenPos = applyCamera(mid2D, camera);

    // Draw label background
    const text = `${this.connection.metrics.speedMbps} Mbps`;
    ctx.font = `${Math.max(9, 10 * camera.scale)}px sans-serif`;
    const metrics = ctx.measureText(text);
    const padding = 4 * camera.scale;
    const labelWidth = metrics.width + padding * 2;
    const labelHeight = 16 * camera.scale;

    const color = CONNECTION_COLORS[this.connection.type];

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(
      screenPos.x - labelWidth / 2,
      screenPos.y - labelHeight / 2,
      labelWidth,
      labelHeight,
      3 * camera.scale
    );
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, screenPos.x, screenPos.y);

    // Draw latency if available
    if (this.connection.metrics.latencyMs > 0) {
      const latencyText = `${this.connection.metrics.latencyMs}ms`;
      const latencyY = screenPos.y + labelHeight / 2 + 10 * camera.scale;

      ctx.font = `${Math.max(7, 8 * camera.scale)}px sans-serif`;
      ctx.fillStyle = '#6b7280';
      ctx.fillText(latencyText, screenPos.x, latencyY);
    }
  }

  /**
   * Main render method
   */
  render(ctx: CanvasRenderingContext2D, camera: CameraTransform): void {
    // Draw connection line
    this.drawLine(ctx, camera);

    // Draw animated particles
    if (this.connection.status === 'connected') {
      this.drawParticles(ctx, camera);
    }

    // Draw label with metrics
    this.drawLabel(ctx, camera);
  }
}
