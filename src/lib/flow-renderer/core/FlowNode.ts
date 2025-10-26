import paper from 'paper';
import { PeplinkDevice } from '@/types/network.types';
import { getDeviceIconUrl } from '../icons/iconFactory';

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
  private clickHandler: ((device: PeplinkDevice) => void) | null = null;

  constructor(options: FlowNodeOptions) {
    this.device = options.device;
    this.position = options.position;
    this.scale = options.scale || 1;
    this.group = new paper.Group();
    this.bounds = new paper.Rectangle(this.position, new paper.Size(0, 0));
    
    this.render();
    this.setupInteractivity();
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
    const iconUrl = getDeviceIconUrl(this.device.model);
    
    if (!iconUrl) {
      // No icon (e.g., removed Surf SOHO)
      this.renderDeviceLabel();
      return;
    }
    
    // Create Paper.js raster from icon URL
    const icon = new paper.Raster({
      source: iconUrl,
      position: new paper.Point(0, 0),
    });
    
    // Scale icon to consistent 60px size
    icon.onLoad = () => {
      // Calculate scale to make icon 60px wide (or tall, whichever is larger)
      const targetSize = 60;
      const scale = targetSize / Math.max(icon.width, icon.height);
      icon.scale(scale * this.scale);
      
      // Center the icon
      icon.position = new paper.Point(0, 0);
      
      this.group.addChild(icon);
      
      // Add device label below icon
      this.renderDeviceLabel();
    };
  }

  private renderDeviceLabel(): void {
    const label = new paper.PointText(new paper.Point(0, 60));
    label.content = this.device.name;
    label.fillColor = new paper.Color('#e0e0e0');
    label.fontSize = 12;
    label.fontWeight = '500';
    label.justification = 'center';
    this.group.addChild(label);
  }

  private setupInteractivity(): void {
    // Make the group interactive
    this.group.onMouseEnter = () => {
      document.body.style.cursor = 'pointer';
    };

    this.group.onMouseLeave = () => {
      document.body.style.cursor = 'default';
    };

    this.group.onClick = () => {
      if (this.clickHandler) {
        this.clickHandler(this.device);
      } else {
        console.log('Device clicked:', this.device.name, this.device);
      }
    };
  }

  public setClickHandler(handler: (device: PeplinkDevice) => void): void {
    this.clickHandler = handler;
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
