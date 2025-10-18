import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * AP One Enterprise - Enterprise ceiling AP
 * Circular shape with multiple WiFi bands indicated
 */
export class APOneEnterpriseIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Enterprise AP dimensions (larger circular/square)
    const width = 60;
    const depth = 60;
    const height = 10;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add multiple WiFi indicators for multi-band (2.4GHz, 5GHz, 6GHz)
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const centerPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 3 * this.scale
    );
    
    // Central WiFi indicator (larger for enterprise)
    const wifiCenter = new paper.Path.Circle(centerPos, 5 * this.scale);
    wifiCenter.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    wifiCenter.strokeColor = new paper.Color('#000000');
    wifiCenter.strokeWidth = 0.5;
    this.group.addChild(wifiCenter);
    
    // Multiple WiFi wave rings (3 bands)
    const colors = ['#3b82f6', '#22c55e', '#a855f7'];
    for (let i = 1; i <= 3; i++) {
      const waveRing = new paper.Path.Circle(centerPos, (5 + i * 5) * this.scale);
      waveRing.strokeColor = new paper.Color(colors[i - 1]);
      waveRing.strokeWidth = 1;
      waveRing.dashArray = [3, 2];
      this.group.addChild(waveRing);
    }
    
    // Add multiple status LEDs around the edge
    const ledPositions = [
      { x: 10, y: height - 3 },
      { x: width / 2 * Math.cos(rad), y: height - (width / 2 * Math.sin(rad)) - 3 },
      { x: 10, y: 3 },
    ];
    
    ledPositions.forEach((pos, i) => {
      const ledPos = new paper.Point(pos.x * this.scale, pos.y * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : '#a855f7');
      this.group.addChild(led);
    });
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
