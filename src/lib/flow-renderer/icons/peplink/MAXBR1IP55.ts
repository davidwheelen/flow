import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX BR1 IP55 - Ruggedized weatherproof router
 * Rugged box with protective edges and sealed ports
 */
export class MAXBR1IP55Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Rugged unit dimensions
    const width = 54;
    const depth = 44;
    const height = 22;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add protective corner edges (weatherproof feature)
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Corner protection indicators
    const corners = [
      { x: 3, y: height - 3 },
      { x: width * Math.cos(rad) - 3, y: height - width * Math.sin(rad) - 3 },
      { x: 3, y: 3 },
      { x: width * Math.cos(rad) - 3, y: -width * Math.sin(rad) + 3 },
    ];
    
    corners.forEach(({ x, y }) => {
      const corner = new paper.Path.Circle(
        new paper.Point(x * this.scale, y * this.scale),
        2 * this.scale
      );
      corner.fillColor = new paper.Color('#1f2937');
      corner.strokeColor = new paper.Color('#000000');
      corner.strokeWidth = 0.8;
      this.group.addChild(corner);
    });
    
    // Add sealed port cover on front
    const portCover = new paper.Path.Rectangle(
      new paper.Point(8 * this.scale, height * this.scale - 12 * this.scale),
      new paper.Size(20 * this.scale, 8 * this.scale)
    );
    portCover.fillColor = new paper.Color('#4b5563');
    portCover.strokeColor = new paper.Color('#000000');
    portCover.strokeWidth = 1;
    this.group.addChild(portCover);
    
    // Add cellular antenna indicator on top
    const antennaPos = new paper.Point(
      (width * Math.cos(rad) + depth * Math.cos(rad)) / 2,
      -(width * Math.sin(rad) + depth * Math.sin(rad)) / 2 - 5 * this.scale
    );
    const antenna = new paper.Path.Circle(antennaPos, 3.5 * this.scale);
    antenna.fillColor = new paper.Color('#a855f7');
    antenna.strokeColor = new paper.Color('#000000');
    antenna.strokeWidth = 0.5;
    this.group.addChild(antenna);
    
    // Add rugged antenna stem
    const stem = new paper.Path.Line(
      antennaPos,
      antennaPos.add(new paper.Point(0, -7 * this.scale))
    );
    stem.strokeColor = new paper.Color('#000000');
    stem.strokeWidth = 1.5;
    this.group.addChild(stem);
    
    // Add status LED (protected)
    const ledPos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led = this.addLED(ledPos, '#22c55e');
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
