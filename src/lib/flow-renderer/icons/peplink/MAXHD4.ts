import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX HD4 - Quad cellular modems
 * Medium box with 4 cellular indicators and multiple antennas
 */
export class MAXHD4Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Medium unit dimensions
    const width = 68;
    const depth = 54;
    const height = 28;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN ports on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(2, frontPortStart, 12 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add quad cellular antennas on top (4 antennas in corners)
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const antennaPositions = [
      { x: 12, y: 12 },
      { x: width - 12, y: 12 },
      { x: 12, y: depth - 12 },
      { x: width - 12, y: depth - 12 },
    ];
    
    antennaPositions.forEach(({ x, y }) => {
      const antennaPos = new paper.Point(
        x * this.scale * Math.cos(rad) + y * this.scale * Math.cos(rad),
        -(x * this.scale * Math.sin(rad) + y * this.scale * Math.sin(rad)) - 5 * this.scale
      );
      const antenna = new paper.Path.Circle(antennaPos, 3 * this.scale);
      antenna.fillColor = new paper.Color('#a855f7');
      antenna.strokeColor = new paper.Color('#000000');
      antenna.strokeWidth = 0.5;
      this.group.addChild(antenna);
      
      // Add antenna stem
      const stem = new paper.Path.Line(
        antennaPos,
        antennaPos.add(new paper.Point(0, -7 * this.scale))
      );
      stem.strokeColor = new paper.Color('#000000');
      stem.strokeWidth = 1;
      this.group.addChild(stem);
    });
    
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
    for (let i = 0; i < 4; i++) {
      const ledPos = new paper.Point((5 + i * 3) * this.scale, height * this.scale - 5 * this.scale);
      const led = this.addLED(ledPos, i < 2 ? '#22c55e' : '#a855f7');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
