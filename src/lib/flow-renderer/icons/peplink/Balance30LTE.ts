import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 30 LTE - Small form factor with integrated LTE
 * Compact box with single WAN port and cellular indicator
 */
export class Balance30LTEIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Small compact unit dimensions
    const width = 45;
    const depth = 35;
    const height = 18;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add single WAN port on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(1, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add cellular antenna indicator on top
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const antennaPos = new paper.Point(
      (width * Math.cos(rad) + depth * Math.cos(rad)) / 2,
      -(width * Math.sin(rad) + depth * Math.sin(rad)) / 2 - 5 * this.scale
    );
    const antenna = new paper.Path.Circle(antennaPos, 3 * this.scale);
    antenna.fillColor = new paper.Color('#a855f7'); // Purple for cellular
    antenna.strokeColor = new paper.Color('#000000');
    antenna.strokeWidth = 0.5;
    this.group.addChild(antenna);
    
    // Add antenna stem
    const stem = new paper.Path.Line(
      antennaPos,
      antennaPos.add(new paper.Point(0, -6 * this.scale))
    );
    stem.strokeColor = new paper.Color('#000000');
    stem.strokeWidth = 1;
    this.group.addChild(stem);
    
    // Add status LED
    const ledPos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led = this.addLED(ledPos);
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
