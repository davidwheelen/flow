import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * FusionHub - SD-WAN concentrator (virtual appliance)
 * Cloud/server shape with multiple connection points
 */
export class FusionHubIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Virtual appliance dimensions (taller box to represent server/cloud)
    const width = 70;
    const depth = 50;
    const height = 40;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add cloud-like indicators on top to show it's virtual
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const cloudPositions = [
      { x: width / 3, y: depth / 3 },
      { x: 2 * width / 3, y: depth / 3 },
      { x: width / 2, y: 2 * depth / 3 },
    ];
    
    cloudPositions.forEach(({ x, y }) => {
      const cloudPos = new paper.Point(
        x * this.scale * Math.cos(rad) + y * this.scale * Math.cos(rad),
        -(x * this.scale * Math.sin(rad) + y * this.scale * Math.sin(rad)) - 5 * this.scale
      );
      const cloud = new paper.Path.Circle(cloudPos, 4 * this.scale);
      cloud.fillColor = new paper.Color('#93c5fd');
      cloud.strokeColor = new paper.Color('#000000');
      cloud.strokeWidth = 0.5;
      this.group.addChild(cloud);
    });
    
    // Add multiple connection points on front (representing VPN tunnels)
    const connectorStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 10 * this.scale
    );
    
    for (let i = 0; i < 6; i++) {
      const connector = new paper.Path.Circle(
        connectorStart.add(new paper.Point(i * 9 * this.scale, 0)),
        2.5 * this.scale
      );
      connector.fillColor = new paper.Color('#3b82f6');
      connector.strokeColor = new paper.Color('#000000');
      connector.strokeWidth = 0.5;
      this.group.addChild(connector);
    }
    
    // Add "HUB" indicator with dots
    const hubIndicator = new paper.Path.Rectangle(
      new paper.Point(15 * this.scale, height * this.scale - 25 * this.scale),
      new paper.Size(12 * this.scale, 8 * this.scale)
    );
    hubIndicator.fillColor = new paper.Color('#60a5fa');
    hubIndicator.strokeColor = new paper.Color('#000000');
    hubIndicator.strokeWidth = 0.5;
    this.group.addChild(hubIndicator);
    
    // Add status LEDs
    for (let i = 0; i < 3; i++) {
      const ledPos = new paper.Point((5 + i * 3) * this.scale, height * this.scale - 5 * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : '#a855f7');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
