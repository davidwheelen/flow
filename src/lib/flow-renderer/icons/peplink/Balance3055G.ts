import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 305 5G - Branch router with 5G cellular
 * Medium box with 3 WAN and prominent 5G indicator
 */
export class Balance3055GIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Medium unit dimensions
    const width = 72;
    const depth = 52;
    const height = 26;
    
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
    
    // Add prominent 5G antenna indicator on top (larger than regular cellular)
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const antenna5GPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna5G = new paper.Path.Circle(antenna5GPos, 5 * this.scale);
    antenna5G.fillColor = new paper.Color('#a855f7');
    antenna5G.strokeColor = new paper.Color('#000000');
    antenna5G.strokeWidth = 0.5;
    this.group.addChild(antenna5G);
    
    // Add "5G" indicator ring
    const ring5G = new paper.Path.Circle(antenna5GPos, 7 * this.scale);
    ring5G.strokeColor = new paper.Color('#a855f7');
    ring5G.strokeWidth = 1.5;
    this.group.addChild(ring5G);
    
    // Add antenna stem
    const stem = new paper.Path.Line(
      antenna5GPos,
      antenna5GPos.add(new paper.Point(0, -8 * this.scale))
    );
    stem.strokeColor = new paper.Color('#000000');
    stem.strokeWidth = 1.5;
    this.group.addChild(stem);
    
    // Add status LEDs
    const led1Pos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led1 = this.addLED(led1Pos);
    this.group.addChild(led1);
    
    const led2Pos = new paper.Point(10 * this.scale, height * this.scale - 5 * this.scale);
    const led2 = this.addLED(led2Pos, '#a855f7'); // Purple LED for 5G
    this.group.addChild(led2);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
