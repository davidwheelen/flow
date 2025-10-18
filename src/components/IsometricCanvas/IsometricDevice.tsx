/**
 * Isometric Device Renderer
 * Renders devices as 3D isometric boxes with device information
 */

import { PeplinkDevice, ConnectionType } from '@/types/network.types';
import { Point3D, toIsometric, applyCamera, CameraTransform } from '@/utils/isometricMath';
import { RenderObject } from './IsometricRenderer';

const CONNECTION_COLORS: Record<ConnectionType, string> = {
  wan: '#3b82f6',
  cellular: '#a855f7',
  wifi: '#22c55e',
  sfp: '#f97316',
};

export interface IsometricDeviceProps {
  device: PeplinkDevice;
  position: Point3D;
  size?: { width: number; height: number; depth: number };
  isHovered?: boolean;
  isSelected?: boolean;
}

export class IsometricDevice implements RenderObject {
  id: string;
  depth: number;
  private device: PeplinkDevice;
  private position: Point3D;
  private size: { width: number; height: number; depth: number };
  private isHovered: boolean;
  private isSelected: boolean;

  constructor(props: IsometricDeviceProps) {
    this.id = props.device.id;
    this.device = props.device;
    this.position = props.position;
    this.size = props.size || { width: 100, height: 80, depth: 60 };
    this.isHovered = props.isHovered || false;
    this.isSelected = props.isSelected || false;
    
    // Calculate depth for sorting
    this.depth = this.position.x + this.position.y + this.position.z;
  }

  /**
   * Update device data
   */
  update(props: Partial<IsometricDeviceProps>): void {
    if (props.device) this.device = props.device;
    if (props.position) {
      this.position = props.position;
      this.depth = this.position.x + this.position.y + this.position.z;
    }
    if (props.size) this.size = props.size;
    if (props.isHovered !== undefined) this.isHovered = props.isHovered;
    if (props.isSelected !== undefined) this.isSelected = props.isSelected;
  }

  /**
   * Draw an isometric box (the device body)
   */
  private drawIsometricBox(
    ctx: CanvasRenderingContext2D,
    camera: CameraTransform
  ): void {
    const { width, height, depth } = this.size;
    const { x, y, z } = this.position;

    // Define the 8 corners of the box
    const corners = {
      // Bottom face (z = 0)
      bottomFrontLeft: { x: x - width / 2, y: y - height / 2, z },
      bottomFrontRight: { x: x + width / 2, y: y - height / 2, z },
      bottomBackRight: { x: x + width / 2, y: y + height / 2, z },
      bottomBackLeft: { x: x - width / 2, y: y + height / 2, z },
      // Top face (z = depth)
      topFrontLeft: { x: x - width / 2, y: y - height / 2, z: z + depth },
      topFrontRight: { x: x + width / 2, y: y - height / 2, z: z + depth },
      topBackRight: { x: x + width / 2, y: y + height / 2, z: z + depth },
      topBackLeft: { x: x - width / 2, y: y + height / 2, z: z + depth },
    };

    // Convert to screen coordinates
    const screen = Object.entries(corners).reduce((acc, [key, point]) => {
      const iso = toIsometric(point.x, point.y, point.z);
      acc[key] = applyCamera(iso, camera);
      return acc;
    }, {} as Record<string, { x: number; y: number }>);

    // Draw the three visible faces

    // Top face (lightest)
    ctx.fillStyle = this.isHovered ? '#f3f4f6' : '#e5e7eb';
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(screen.topFrontLeft.x, screen.topFrontLeft.y);
    ctx.lineTo(screen.topFrontRight.x, screen.topFrontRight.y);
    ctx.lineTo(screen.topBackRight.x, screen.topBackRight.y);
    ctx.lineTo(screen.topBackLeft.x, screen.topBackLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right face (medium)
    ctx.fillStyle = this.isHovered ? '#d1d5db' : '#d1d5db';
    ctx.beginPath();
    ctx.moveTo(screen.topFrontRight.x, screen.topFrontRight.y);
    ctx.lineTo(screen.bottomFrontRight.x, screen.bottomFrontRight.y);
    ctx.lineTo(screen.bottomBackRight.x, screen.bottomBackRight.y);
    ctx.lineTo(screen.topBackRight.x, screen.topBackRight.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Front face (darkest - this is where we'll show device info)
    ctx.fillStyle = this.isHovered ? '#f9fafb' : '#ffffff';
    ctx.beginPath();
    ctx.moveTo(screen.topFrontLeft.x, screen.topFrontLeft.y);
    ctx.lineTo(screen.topFrontRight.x, screen.topFrontRight.y);
    ctx.lineTo(screen.bottomFrontRight.x, screen.bottomFrontRight.y);
    ctx.lineTo(screen.bottomFrontLeft.x, screen.bottomFrontLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw selection/hover highlight
    if (this.isSelected || this.isHovered) {
      ctx.strokeStyle = this.isSelected ? '#3b82f6' : '#6b7280';
      ctx.lineWidth = this.isSelected ? 3 : 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        screen.bottomFrontLeft.x - 5,
        screen.topFrontLeft.y - 5,
        Math.abs(screen.bottomFrontRight.x - screen.bottomFrontLeft.x) + 10,
        Math.abs(screen.bottomFrontLeft.y - screen.topFrontLeft.y) + 10
      );
      ctx.setLineDash([]);
    }

    // Draw device information on front face
    this.drawDeviceInfo(ctx, screen, camera);

    // Draw connection ports
    this.drawConnectionPorts(ctx, screen, camera);
  }

  /**
   * Draw device information text on the front face
   */
  private drawDeviceInfo(
    ctx: CanvasRenderingContext2D,
    screen: Record<string, { x: number; y: number }>,
    camera: CameraTransform
  ): void {
    const centerX = (screen.topFrontLeft.x + screen.topFrontRight.x) / 2;
    const centerY = (screen.topFrontLeft.y + screen.bottomFrontLeft.y) / 2;

    // Device name
    ctx.fillStyle = '#111827';
    ctx.font = `bold ${Math.max(10, 12 * camera.scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.device.name, centerX, centerY - 20 * camera.scale);

    // Model
    ctx.fillStyle = '#6b7280';
    ctx.font = `${Math.max(8, 10 * camera.scale)}px sans-serif`;
    ctx.fillText(this.device.model, centerX, centerY);

    // IP Address
    ctx.fillStyle = '#9ca3af';
    ctx.font = `${Math.max(7, 9 * camera.scale)}px monospace`;
    ctx.fillText(this.device.ipAddress, centerX, centerY + 15 * camera.scale);
  }

  /**
   * Draw connection port indicators on the edges
   */
  private drawConnectionPorts(
    ctx: CanvasRenderingContext2D,
    screen: Record<string, { x: number; y: number }>,
    camera: CameraTransform
  ): void {
    const activeConnections = this.device.connections.filter(
      conn => conn.status === 'connected'
    );

    if (activeConnections.length === 0) return;

    // Draw small colored indicators on the top edge
    const topEdgeY = screen.topFrontLeft.y;
    const topEdgeStartX = screen.topFrontLeft.x;
    const topEdgeWidth = screen.topFrontRight.x - screen.topFrontLeft.x;
    const portWidth = Math.min(12 * camera.scale, topEdgeWidth / activeConnections.length - 4);

    activeConnections.forEach((conn, index) => {
      const portX = topEdgeStartX + (topEdgeWidth / (activeConnections.length + 1)) * (index + 1);
      const color = CONNECTION_COLORS[conn.type];

      // Draw port indicator
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(portX, topEdgeY, portWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Add pulsing effect for active connections
      if (conn.status === 'connected') {
        const pulse = Math.sin(Date.now() / 500) * 0.3 + 0.7;
        ctx.globalAlpha = pulse * 0.5;
        ctx.beginPath();
        ctx.arc(portX, topEdgeY, portWidth, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  /**
   * Draw shadow beneath the device
   */
  private drawShadow(ctx: CanvasRenderingContext2D, camera: CameraTransform): void {
    const { width, height } = this.size;
    const { x, y } = this.position;

    // Shadow on ground plane (z = 0)
    const shadowOffset = 5;
    const corners = [
      { x: x - width / 2 + shadowOffset, y: y - height / 2 + shadowOffset, z: 0 },
      { x: x + width / 2 + shadowOffset, y: y - height / 2 + shadowOffset, z: 0 },
      { x: x + width / 2 + shadowOffset, y: y + height / 2 + shadowOffset, z: 0 },
      { x: x - width / 2 + shadowOffset, y: y + height / 2 + shadowOffset, z: 0 },
    ];

    const screenCorners = corners.map(c => {
      const iso = toIsometric(c.x, c.y, c.z);
      return applyCamera(iso, camera);
    });

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.moveTo(screenCorners[0].x, screenCorners[0].y);
    for (let i = 1; i < screenCorners.length; i++) {
      ctx.lineTo(screenCorners[i].x, screenCorners[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Main render method
   */
  render(ctx: CanvasRenderingContext2D, camera: CameraTransform): void {
    // Draw shadow first
    this.drawShadow(ctx, camera);

    // Draw the device box
    this.drawIsometricBox(ctx, camera);
  }

  /**
   * Get bounding box for hit detection
   */
  getBoundingBox(camera: CameraTransform): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    const { width, height, depth } = this.size;
    const { x, y, z } = this.position;

    // Get all 8 corners
    const corners = [
      { x: x - width / 2, y: y - height / 2, z },
      { x: x + width / 2, y: y - height / 2, z },
      { x: x + width / 2, y: y + height / 2, z },
      { x: x - width / 2, y: y + height / 2, z },
      { x: x - width / 2, y: y - height / 2, z: z + depth },
      { x: x + width / 2, y: y - height / 2, z: z + depth },
      { x: x + width / 2, y: y + height / 2, z: z + depth },
      { x: x - width / 2, y: y + height / 2, z: z + depth },
    ];

    const screenCorners = corners.map(c => {
      const iso = toIsometric(c.x, c.y, c.z);
      return applyCamera(iso, camera);
    });

    return {
      minX: Math.min(...screenCorners.map(c => c.x)),
      maxX: Math.max(...screenCorners.map(c => c.x)),
      minY: Math.min(...screenCorners.map(c => c.y)),
      maxY: Math.max(...screenCorners.map(c => c.y)),
    };
  }

  /**
   * Check if point is inside device
   */
  isPointInside(point: { x: number; y: number }, camera: CameraTransform): boolean {
    const bbox = this.getBoundingBox(camera);
    return (
      point.x >= bbox.minX &&
      point.x <= bbox.maxX &&
      point.y >= bbox.minY &&
      point.y <= bbox.maxY
    );
  }
}
