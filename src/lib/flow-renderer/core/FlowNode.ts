import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';

export interface FlowNodeOptions {
  device: PeplinkDevice;
  position: paper.Point;
  scale?: number;
}

export class FlowNode {
  private device: PeplinkDevice;
  private group: paper.Group;
  private position: paper.Point;
  private scale: number;
  private bounds: paper.Rectangle;

  constructor(options: FlowNodeOptions) {
    this.device = options.device;
    this.position = options.position;
    this.scale = options.scale || 1;
    this.group = new paper.Group();
    this.bounds = new paper.Rectangle(this.position, new paper.Size(0, 0));
    
    this.render();
  }

  private render(): void {
    // Clear existing content
    this.group.removeChildren();
    
    // Create isometric device representation
    this.createIsometricDevice();
    
    // Position the group
    this.group.position = this.position;
    
    // Update bounds
    this.bounds = this.group.bounds;
  }

  private createIsometricDevice(): void {
    // This will be implemented by device-specific icon renderers
    // For now, create a simple placeholder box
    const size = 80 * this.scale;
    const depth = 40 * this.scale;
    const height = 60 * this.scale;
    
    // Isometric angles
    const angle = 30; // degrees
    const rad = (angle * Math.PI) / 180;
    
    // Top face (horizontal)
    const top = new paper.Path([
      new paper.Point(0, 0),
      new paper.Point(size * Math.cos(rad), -size * Math.sin(rad)),
      new paper.Point(size * Math.cos(rad) + depth * Math.cos(rad), -(size * Math.sin(rad) + depth * Math.sin(rad))),
      new paper.Point(depth * Math.cos(rad), -depth * Math.sin(rad)),
    ]);
    top.closed = true;
    top.fillColor = new paper.Color('#e5e7eb');
    top.strokeColor = new paper.Color('#9ca3af');
    top.strokeWidth = 1;
    
    // Front face (left)
    const front = new paper.Path([
      new paper.Point(0, 0),
      new paper.Point(0, height),
      new paper.Point(size * Math.cos(rad), height - size * Math.sin(rad)),
      new paper.Point(size * Math.cos(rad), -size * Math.sin(rad)),
    ]);
    front.closed = true;
    front.fillColor = new paper.Color('#6b7280');
    front.strokeColor = new paper.Color('#4b5563');
    front.strokeWidth = 1;
    
    // Side face (right)
    const side = new paper.Path([
      new paper.Point(size * Math.cos(rad), -size * Math.sin(rad)),
      new paper.Point(size * Math.cos(rad), height - size * Math.sin(rad)),
      new paper.Point(size * Math.cos(rad) + depth * Math.cos(rad), height - (size * Math.sin(rad) + depth * Math.sin(rad))),
      new paper.Point(size * Math.cos(rad) + depth * Math.cos(rad), -(size * Math.sin(rad) + depth * Math.sin(rad))),
    ]);
    side.closed = true;
    side.fillColor = new paper.Color('#9ca3af');
    side.strokeColor = new paper.Color('#6b7280');
    side.strokeWidth = 1;
    
    this.group.addChildren([front, side, top]);
    
    // Add device label
    const label = new paper.PointText(new paper.Point(0, height + 20));
    label.content = this.device.name;
    label.fillColor = new paper.Color('#1f2937');
    label.fontSize = 12;
    label.justification = 'center';
    this.group.addChild(label);
  }

  public getDevice(): PeplinkDevice {
    return this.device;
  }

  public getPosition(): paper.Point {
    return this.position;
  }

  public getBounds(): paper.Rectangle {
    return this.bounds;
  }

  public getGroup(): paper.Group {
    return this.group;
  }

  public setPosition(position: paper.Point): void {
    this.position = position;
    this.group.position = position;
    this.bounds = this.group.bounds;
  }

  public remove(): void {
    this.group.remove();
  }

  public update(device: PeplinkDevice): void {
    this.device = device;
    this.render();
  }
}
