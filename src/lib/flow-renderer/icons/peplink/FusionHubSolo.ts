import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * FusionHub Solo - Compact hardware hub
 * Small rack-mount box with multiple WAN indicators
 */
export class FusionHubSoloIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Compact rack mount dimensions
    const width = 80;
    const depth = 40;
    const height = 15;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add rack mount ears on front
    const earLeft = new paper.Path.Rectangle(
      new paper.Point(-7 * this.scale, height * this.scale - 12 * this.scale),
      new paper.Size(5 * this.scale, 10 * this.scale)
    );
    earLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earLeft.strokeColor = new paper.Color('#000000');
    earLeft.strokeWidth = 0.5;
    this.group.addChild(earLeft);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const earRight = new paper.Path.Rectangle(
      new paper.Point(width * this.scale * Math.cos(rad) + 2 * this.scale, height * this.scale - (width * this.scale * Math.sin(rad) + 12 * this.scale)),
      new paper.Size(5 * this.scale, 10 * this.scale)
    );
    earRight.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earRight.strokeColor = new paper.Color('#000000');
    earRight.strokeWidth = 0.5;
    this.group.addChild(earRight);
    
    // Add WAN/connection ports on front face
    const frontPortStart = new paper.Point(
      12 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const ports = this.addPorts(5, frontPortStart, 12 * this.scale);
    this.group.addChild(ports);
    
    // Add "SOLO" indicator
    const soloIndicator = new paper.Path.Rectangle(
      new paper.Point(5 * this.scale, height * this.scale - 7 * this.scale),
      new paper.Size(5 * this.scale, 5 * this.scale)
    );
    soloIndicator.fillColor = new paper.Color('#60a5fa');
    soloIndicator.strokeColor = new paper.Color('#000000');
    soloIndicator.strokeWidth = 0.5;
    this.group.addChild(soloIndicator);
    
    // Add status LEDs
    for (let i = 0; i < 3; i++) {
      const ledPos = new paper.Point((5 + i * 2.5) * this.scale, height * this.scale - 3 * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : '#f59e0b');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
