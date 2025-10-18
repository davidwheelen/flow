import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX BR1 Mini - Compact mobile router with single WAN and cellular
 * Very small box for minimal mobile connectivity
 */
export class MAXBR1MiniIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Very small compact unit dimensions
    const width = 40;
    const depth = 32;
    const height = 16;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add single WAN port on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 6 * this.scale
    );
    const wanPorts = this.addPorts(1, frontPortStart, 8 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add cellular antenna indicator on top
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const antennaPos = new paper.Point(
      (width * Math.cos(rad) + depth * Math.cos(rad)) / 2,
      -(width * Math.sin(rad) + depth * Math.sin(rad)) / 2 - 4 * this.scale
    );
    const antenna = new paper.Path.Circle(antennaPos, 2.5 * this.scale);
    antenna.fillColor = new paper.Color('#a855f7');
    antenna.strokeColor = new paper.Color('#000000');
    antenna.strokeWidth = 0.5;
    this.group.addChild(antenna);
    
    // Add small antenna stem
    const stem = new paper.Path.Line(
      antennaPos,
      antennaPos.add(new paper.Point(0, -5 * this.scale))
    );
    stem.strokeColor = new paper.Color('#000000');
    stem.strokeWidth = 0.8;
    this.group.addChild(stem);
    
    // Add status LED
    const ledPos = new paper.Point(4 * this.scale, height * this.scale - 4 * this.scale);
    const led = this.addLED(ledPos);
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
