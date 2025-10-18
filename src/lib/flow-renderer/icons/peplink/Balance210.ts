import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 210 - Entry business router with 3 WAN ports
 * Small rectangular box for branch offices
 */
export class Balance210Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Small business unit dimensions
    const width = 60;
    const depth = 45;
    const height = 22;
    
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
