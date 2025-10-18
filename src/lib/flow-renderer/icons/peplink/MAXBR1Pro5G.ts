import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX BR1 Pro 5G - Professional mobile router with 5G
 * Small rugged box with prominent 5G indicator
 */
export class MAXBR1Pro5GIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Small rugged unit dimensions
    const width = 52;
    const depth = 42;
    const height = 20;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add mounting tabs on sides (rugged feature)
    const tabLeft = new paper.Path.Circle(
      new paper.Point(2 * this.scale, height * this.scale / 2),
      2.5 * this.scale
    );
    tabLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    tabLeft.strokeColor = new paper.Color('#000000');
    tabLeft.strokeWidth = 0.5;
    this.group.addChild(tabLeft);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const tabRight = new paper.Path.Circle(
      new paper.Point(width * this.scale * Math.cos(rad) - 2 * this.scale, height * this.scale / 2 - width * this.scale * Math.sin(rad)),
      2.5 * this.scale
    );
    tabRight.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    tabRight.strokeColor = new paper.Color('#000000');
    tabRight.strokeWidth = 0.5;
    this.group.addChild(tabRight);
    
    // Add WAN port on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 7 * this.scale
    );
    const wanPorts = this.addPorts(1, frontPortStart, 10 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add prominent 5G antenna indicator on top
    const antenna5GPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna5G = new paper.Path.Circle(antenna5GPos, 4 * this.scale);
    antenna5G.fillColor = new paper.Color('#a855f7');
    antenna5G.strokeColor = new paper.Color('#000000');
    antenna5G.strokeWidth = 0.5;
    this.group.addChild(antenna5G);
    
    // Add "5G" indicator ring
    const ring5G = new paper.Path.Circle(antenna5GPos, 6 * this.scale);
    ring5G.strokeColor = new paper.Color('#a855f7');
    ring5G.strokeWidth = 1.2;
    this.group.addChild(ring5G);
    
    // Add status LED
    const ledPos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led = this.addLED(ledPos, '#a855f7');
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
