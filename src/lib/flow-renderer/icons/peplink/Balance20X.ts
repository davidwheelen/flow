import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 20X - Small router for remote sites
 * Compact desktop unit with WAN and cellular ports
 */
export class Balance20XIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Small desktop unit dimensions
    const width = 50;
    const depth = 40;
    const height = 20;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN ports on front face
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(2, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add cellular antenna indicator on top
    const antennaPos = new paper.Point(
      (width * Math.cos(rad) + depth * Math.cos(rad)) / 2,
      -(width * Math.sin(rad) + depth * Math.sin(rad)) / 2 - 5 * this.scale
    );
    const antenna = new paper.Path.Circle(antennaPos, 3 * this.scale);
    antenna.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    antenna.strokeColor = new paper.Color('#000000');
    antenna.strokeWidth = 0.5;
    this.group.addChild(antenna);
    
    // Add status LED
    const ledPos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led = this.addLED(ledPos);
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
