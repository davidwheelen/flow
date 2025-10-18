import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * AP One AC Mini - Small ceiling-mount AP
 * Flat circular/square shape viewed isometrically from above
 */
export class APOneACMiniIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Flat AP dimensions (wide but very short)
    const width = 50;
    const depth = 50;
    const height = 8;
    
    // Create main body (flat box)
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WiFi wave indicators on top (circular pattern)
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const centerPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 3 * this.scale
    );
    
    // Central WiFi indicator
    const wifiCenter = new paper.Path.Circle(centerPos, 4 * this.scale);
    wifiCenter.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    wifiCenter.strokeColor = new paper.Color('#000000');
    wifiCenter.strokeWidth = 0.5;
    this.group.addChild(wifiCenter);
    
    // WiFi wave rings
    for (let i = 1; i <= 2; i++) {
      const waveRing = new paper.Path.Circle(centerPos, (4 + i * 4) * this.scale);
      waveRing.strokeColor = new paper.Color(DeviceIcon.COLORS.accent);
      waveRing.strokeWidth = 0.8;
      waveRing.dashArray = [2, 2];
      this.group.addChild(waveRing);
    }
    
    // Add power LED on front edge
    const ledPos = new paper.Point(8 * this.scale, height * this.scale - 3 * this.scale);
    const led = this.addLED(ledPos, '#22c55e');
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
