import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 580 - 5 WAN with dual cellular and WiFi
 * Large box with extensive connectivity options
 */
export class Balance580Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Large unit dimensions
    const width = 95;
    const depth = 62;
    const height = 32;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN ports on front face (5 ports)
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(5, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add dual cellular indicators on top
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // First cellular antenna
    const antenna1Pos = new paper.Point(
      20 * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -(20 * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna1 = new paper.Path.Circle(antenna1Pos, 4 * this.scale);
    antenna1.fillColor = new paper.Color('#a855f7');
    antenna1.strokeColor = new paper.Color('#000000');
    antenna1.strokeWidth = 0.5;
    this.group.addChild(antenna1);
    
    // Second cellular antenna
    const antenna2Pos = new paper.Point(
      (width - 20) * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -((width - 20) * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna2 = new paper.Path.Circle(antenna2Pos, 4 * this.scale);
    antenna2.fillColor = new paper.Color('#a855f7');
    antenna2.strokeColor = new paper.Color('#000000');
    antenna2.strokeWidth = 0.5;
    this.group.addChild(antenna2);
    
    // Add WiFi antenna in center
    const wifiPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const wifi = new paper.Path.Circle(wifiPos, 4 * this.scale);
    wifi.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    wifi.strokeColor = new paper.Color('#000000');
    wifi.strokeWidth = 0.5;
    this.group.addChild(wifi);
    
    // Add status LEDs
    for (let i = 0; i < 3; i++) {
      const ledPos = new paper.Point((5 + i * 3) * this.scale, height * this.scale - 5 * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : '#f59e0b');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
