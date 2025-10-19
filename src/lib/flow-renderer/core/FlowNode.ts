import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';
import { getDeviceIconPath } from '../icons/iconFactory';

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
    const iconPath = getDeviceIconPath(this.device.model);
    
    if (!iconPath) {
      // No icon (e.g., removed Surf SOHO)
      this.renderDeviceLabel();
      return;
    }
    
    // Load SVG icon as Paper.js Raster
    const icon = new paper.Raster({
      source: iconPath,
      position: new paper.Point(0, 0),
    });
    
    // Scale and position icon
    icon.onLoad = () => {
      // Scale to appropriate size for canvas
      icon.scale(0.8 * this.scale);
      
      // Add to group
      this.group.addChild(icon);
      
      // Add device label below icon
      this.renderDeviceLabel();
    };
  }

  private renderDeviceLabel(): void {
    // Device name label below icon
    const label = new paper.PointText(new paper.Point(0, 60 * this.scale));
    label.content = this.device.name;
    label.fillColor = new paper.Color('#e0e0e0');
    label.fontSize = 12 * this.scale;
    label.fontWeight = '500';
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
