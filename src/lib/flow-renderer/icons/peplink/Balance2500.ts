import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 2500 - Data center rack mount router
 * 1U rack mount with extensive ports including SFP
 */
export class Balance2500Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Rack mount dimensions (1U height, wide)
    const width = 120;
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
    
    // Add WAN ports on front face
    const frontPortStart = new paper.Point(
      15 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(8, frontPortStart, 10 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add SFP ports (slightly different style)
    const sfpPortStart = new paper.Point(
      15 * this.scale,
      height * this.scale - 13 * this.scale
    );
    for (let i = 0; i < 4; i++) {
      const sfpPort = new paper.Path.Rectangle(
        sfpPortStart.add(new paper.Point(i * 12 * this.scale, 0)),
        new paper.Size(8 * this.scale, 3 * this.scale)
      );
      sfpPort.fillColor = new paper.Color('#f97316');
      sfpPort.strokeColor = new paper.Color('#000000');
      sfpPort.strokeWidth = 0.5;
      this.group.addChild(sfpPort);
    }
    
    // Add status LEDs
    for (let i = 0; i < 3; i++) {
      const ledPos = new paper.Point((5 + i * 3) * this.scale, height * this.scale - 5 * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : '#f59e0b');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
