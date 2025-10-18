import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 380 - HQ router
 * Larger unit with multiple WAN ports, cellular, and WiFi
 */
export class Balance380Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Large desktop unit dimensions
    const width = 90;
    const depth = 60;
    const height = 30;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN ports on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(5, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add cellular modems indicator
    const cellularPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 20 * this.scale
    );
    const cellularPorts = this.addPorts(2, cellularPortStart, 12 * this.scale);
    this.group.addChild(cellularPorts);
    
    // Add WiFi antennas on top
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Left antenna
    const antenna1Pos = new paper.Point(
      15 * this.scale * Math.cos(rad),
      -15 * this.scale * Math.sin(rad) - 5 * this.scale
    );
    const antenna1 = new paper.Path.Circle(antenna1Pos, 4 * this.scale);
    antenna1.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    antenna1.strokeColor = new paper.Color('#000000');
    antenna1.strokeWidth = 0.5;
    this.group.addChild(antenna1);
    
    // Right antenna
    const antenna2Pos = new paper.Point(
      (width - 15) * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -((width - 15) * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna2 = new paper.Path.Circle(antenna2Pos, 4 * this.scale);
    antenna2.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    antenna2.strokeColor = new paper.Color('#000000');
    antenna2.strokeWidth = 0.5;
    this.group.addChild(antenna2);
    
    // Add status LEDs
    const led1Pos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led1 = this.addLED(led1Pos);
    this.group.addChild(led1);
    
    const led2Pos = new paper.Point(10 * this.scale, height * this.scale - 5 * this.scale);
    const led2 = this.addLED(led2Pos, '#3b82f6');
    this.group.addChild(led2);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
