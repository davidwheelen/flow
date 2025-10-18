import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX Transit - Mobile router
 * Rugged compact unit for vehicles with cellular and WiFi
 */
export class MAXTransitIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'max';
  }

  public getModelName(): string {
    return 'max-transit';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Compact rugged unit dimensions
    const width = 55;
    const depth = 45;
    const height = 22;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add cellular antennas on top (prominent feature)
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Multiple cellular antenna ports
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
      antenna.fillColor = new paper.Color('#a855f7'); // Purple for cellular
      antenna.strokeColor = new paper.Color('#000000');
      antenna.strokeWidth = 0.5;
      this.group.addChild(antenna);
      
      // Add antenna stem
      const stem = new paper.Path.Line(
        antennaPos,
        antennaPos.add(new paper.Point(0, -8 * this.scale))
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
    wifi.fillColor = new paper.Color('#22c55e'); // Green for WiFi
    wifi.strokeColor = new paper.Color('#000000');
    wifi.strokeWidth = 0.5;
    this.group.addChild(wifi);
    
    // Add minimal ports on front
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const ports = this.addPorts(2, frontPortStart, 12 * this.scale);
    this.group.addChild(ports);
    
    // Add rugged mounting brackets on sides
    const bracketLeft = new paper.Path.Circle(
      new paper.Point(2 * this.scale, height * this.scale / 2),
      3 * this.scale
    );
    bracketLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    bracketLeft.strokeColor = new paper.Color('#000000');
    bracketLeft.strokeWidth = 0.5;
    this.group.addChild(bracketLeft);
    
    const bracketRight = new paper.Path.Circle(
      new paper.Point(width * this.scale * Math.cos(rad) - 2 * this.scale, height * this.scale / 2 - width * this.scale * Math.sin(rad)),
      3 * this.scale
    );
    bracketRight.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    bracketRight.strokeColor = new paper.Color('#000000');
    bracketRight.strokeWidth = 0.5;
    this.group.addChild(bracketRight);
    
    // Add status LED
    const ledPos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led = this.addLED(ledPos);
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
