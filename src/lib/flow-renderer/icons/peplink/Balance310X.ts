import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 310X - Branch office router
 * Mid-size unit with multiple WAN ports and WiFi
 */
export class Balance310XIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Medium desktop unit dimensions
    const width = 70;
    const depth = 50;
    const height = 25;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN ports on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(3, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add WiFi antennas on top corners
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const antenna1Pos = new paper.Point(
      10 * this.scale * Math.cos(rad),
      -10 * this.scale * Math.sin(rad) - 5 * this.scale
    );
    const antenna1 = new paper.Path.Circle(antenna1Pos, 3 * this.scale);
    antenna1.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    antenna1.strokeColor = new paper.Color('#000000');
    antenna1.strokeWidth = 0.5;
    this.group.addChild(antenna1);
    
    const antenna2Pos = new paper.Point(
      (width - 10) * this.scale * Math.cos(rad) + 10 * this.scale * Math.cos(rad),
      -((width - 10) * this.scale * Math.sin(rad) + 10 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna2 = new paper.Path.Circle(antenna2Pos, 3 * this.scale);
    antenna2.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    antenna2.strokeColor = new paper.Color('#000000');
    antenna2.strokeWidth = 0.5;
    this.group.addChild(antenna2);
    
    // Add cellular indicator
    const cellularPos = new paper.Point(
      5 * this.scale,
      height * this.scale - 16 * this.scale
    );
    const cellular = new paper.Path.Rectangle(
      cellularPos,
      new paper.Size(6 * this.scale, 4 * this.scale)
    );
    cellular.fillColor = new paper.Color('#a855f7');
    cellular.strokeColor = new paper.Color('#000000');
    cellular.strokeWidth = 0.5;
    this.group.addChild(cellular);
    
    // Add status LED
    const ledPos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led = this.addLED(ledPos);
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
