import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Switch Enterprise 24 - 24-port managed switch with PoE
 * Wide rack-mount style with many ports and PoE indicator
 */
export class SwitchEnterprise24Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Rack mount switch dimensions (1U height, very wide)
    const width = 130;
    const depth = 40;
    const height = 15;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add rack mount ears on front
    const earLeft = new paper.Path.Rectangle(
      new paper.Point(-8 * this.scale, height * this.scale - 12 * this.scale),
      new paper.Size(6 * this.scale, 10 * this.scale)
    );
    earLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earLeft.strokeColor = new paper.Color('#000000');
    earLeft.strokeWidth = 0.5;
    this.group.addChild(earLeft);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const earRight = new paper.Path.Rectangle(
      new paper.Point(width * this.scale * Math.cos(rad) + 2 * this.scale, height * this.scale - (width * this.scale * Math.sin(rad) + 12 * this.scale)),
      new paper.Size(6 * this.scale, 10 * this.scale)
    );
    earRight.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earRight.strokeColor = new paper.Color('#000000');
    earRight.strokeWidth = 0.5;
    this.group.addChild(earRight);
    
    // Add 24 port indicators (split into two rows)
    // Top row - 12 ports
    const topRowStart = new paper.Point(
      15 * this.scale,
      height * this.scale - 6 * this.scale
    );
    const topPorts = this.addPorts(12, topRowStart, 9 * this.scale);
    this.group.addChild(topPorts);
    
    // Bottom row - 12 ports
    const bottomRowStart = new paper.Point(
      15 * this.scale,
      height * this.scale - 11 * this.scale
    );
    const bottomPorts = this.addPorts(12, bottomRowStart, 9 * this.scale);
    this.group.addChild(bottomPorts);
    
    // Add PoE indicator (small icon)
    const poeIndicator = new paper.Path.Rectangle(
      new paper.Point(5 * this.scale, height * this.scale - 8 * this.scale),
      new paper.Size(6 * this.scale, 6 * this.scale)
    );
    poeIndicator.fillColor = new paper.Color('#f59e0b');
    poeIndicator.strokeColor = new paper.Color('#000000');
    poeIndicator.strokeWidth = 0.5;
    this.group.addChild(poeIndicator);
    
    // Add "PoE" text effect (small circles to represent letters)
    for (let i = 0; i < 3; i++) {
      const dot = new paper.Path.Circle(
        new paper.Point((6 + i * 1.5) * this.scale, (height - 5) * this.scale),
        0.5 * this.scale
      );
      dot.fillColor = new paper.Color('#ffffff');
      this.group.addChild(dot);
    }
    
    // Add status LEDs
    for (let i = 0; i < 4; i++) {
      const ledPos = new paper.Point((5 + i * 2.5) * this.scale, height * this.scale - 3 * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : i === 2 ? '#f59e0b' : '#a855f7');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
