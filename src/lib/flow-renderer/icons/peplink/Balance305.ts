import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 305 - 3 WAN with dual SIM cellular
 * Medium box with 3 WAN ports and 2 cellular indicators
 */
export class Balance305Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Medium unit dimensions
    const width = 70;
    const depth = 50;
    const height = 25;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN ports on front face (3 ports)
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(3, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add dual cellular indicators on top
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // First cellular antenna
    const antenna1Pos = new paper.Point(
      15 * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -(15 * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna1 = new paper.Path.Circle(antenna1Pos, 3 * this.scale);
    antenna1.fillColor = new paper.Color('#a855f7');
    antenna1.strokeColor = new paper.Color('#000000');
    antenna1.strokeWidth = 0.5;
    this.group.addChild(antenna1);
    
    // Second cellular antenna
    const antenna2Pos = new paper.Point(
      (width - 15) * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -((width - 15) * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna2 = new paper.Path.Circle(antenna2Pos, 3 * this.scale);
    antenna2.fillColor = new paper.Color('#a855f7');
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
