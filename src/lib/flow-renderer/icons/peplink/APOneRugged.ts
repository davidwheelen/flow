import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * AP One Rugged - Industrial AP
 * Square flat box with rugged edges and mounting bracket
 */
export class APOneRuggedIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Rugged AP dimensions (square and flat)
    const width = 55;
    const depth = 55;
    const height = 12;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add rugged corner protectors
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const corners = [
      { x: 3, y: 3 },
      { x: width - 3, y: 3 },
      { x: 3, y: depth - 3 },
      { x: width - 3, y: depth - 3 },
    ];
    
    corners.forEach(({ x, y }) => {
      const cornerPos = new paper.Point(
        x * this.scale * Math.cos(rad) + y * this.scale * Math.cos(rad),
        -(x * this.scale * Math.sin(rad) + y * this.scale * Math.sin(rad)) - 3 * this.scale
      );
      const corner = new paper.Path.Circle(cornerPos, 2 * this.scale);
      corner.fillColor = new paper.Color('#1f2937');
      corner.strokeColor = new paper.Color('#000000');
      corner.strokeWidth = 0.8;
      this.group.addChild(corner);
    });
    
    // Add mounting bracket indicator
    const bracketLeft = new paper.Path.Rectangle(
      new paper.Point(-5 * this.scale, height * this.scale / 2 - 3 * this.scale),
      new paper.Size(4 * this.scale, 6 * this.scale)
    );
    bracketLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    bracketLeft.strokeColor = new paper.Color('#000000');
    bracketLeft.strokeWidth = 0.5;
    this.group.addChild(bracketLeft);
    
    // Add WiFi indicator on top (center)
    const centerPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 4 * this.scale
    );
    
    const wifi = new paper.Path.Circle(centerPos, 5 * this.scale);
    wifi.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    wifi.strokeColor = new paper.Color('#000000');
    wifi.strokeWidth = 0.5;
    this.group.addChild(wifi);
    
    // WiFi wave ring
    const waveRing = new paper.Path.Circle(centerPos, 8 * this.scale);
    waveRing.strokeColor = new paper.Color(DeviceIcon.COLORS.accent);
    waveRing.strokeWidth = 1;
    this.group.addChild(waveRing);
    
    // Add status LED
    const ledPos = new paper.Point(8 * this.scale, height * this.scale - 4 * this.scale);
    const led = this.addLED(ledPos);
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
