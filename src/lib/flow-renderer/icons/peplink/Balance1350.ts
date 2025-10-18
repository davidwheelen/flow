import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 1350 - Enterprise core with 13 WAN and dual 10G SFP+
 * Wide box with many WAN indicators and prominent SFP+ ports
 */
export class Balance1350Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Enterprise rack mount dimensions (1U height, very wide)
    const width = 140;
    const depth = 45;
    const height = 18;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add rack mount ears on front
    const earLeft = new paper.Path.Rectangle(
      new paper.Point(-8 * this.scale, height * this.scale - 14 * this.scale),
      new paper.Size(6 * this.scale, 12 * this.scale)
    );
    earLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earLeft.strokeColor = new paper.Color('#000000');
    earLeft.strokeWidth = 0.5;
    this.group.addChild(earLeft);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    const earRight = new paper.Path.Rectangle(
      new paper.Point(width * this.scale * Math.cos(rad) + 2 * this.scale, height * this.scale - (width * this.scale * Math.sin(rad) + 14 * this.scale)),
      new paper.Size(6 * this.scale, 12 * this.scale)
    );
    earRight.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earRight.strokeColor = new paper.Color('#000000');
    earRight.strokeWidth = 0.5;
    this.group.addChild(earRight);
    
    // Add many WAN ports on front face (13 ports - show as groups)
    const frontPortStart = new paper.Point(
      20 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(13, frontPortStart, 8 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add dual 10G SFP+ ports (larger and more prominent)
    const sfpPortStart = new paper.Point(
      20 * this.scale,
      height * this.scale - 15 * this.scale
    );
    for (let i = 0; i < 2; i++) {
      const sfpPort = new paper.Path.Rectangle(
        sfpPortStart.add(new paper.Point(i * 15 * this.scale, 0)),
        new paper.Size(12 * this.scale, 5 * this.scale)
      );
      sfpPort.fillColor = new paper.Color('#f97316');
      sfpPort.strokeColor = new paper.Color('#000000');
      sfpPort.strokeWidth = 0.5;
      this.group.addChild(sfpPort);
      
      // Add "10G" label effect
      const label = new paper.Path.Circle(
        sfpPortStart.add(new paper.Point(i * 15 * this.scale + 3 * this.scale, 2 * this.scale)),
        1 * this.scale
      );
      label.fillColor = new paper.Color('#ffffff');
      this.group.addChild(label);
    }
    
    // Add status LEDs
    for (let i = 0; i < 4; i++) {
      const ledPos = new paper.Point((5 + i * 3) * this.scale, height * this.scale - 5 * this.scale);
      const led = this.addLED(ledPos, i === 0 ? '#22c55e' : i === 1 ? '#3b82f6' : i === 2 ? '#f59e0b' : '#ef4444');
      this.group.addChild(led);
    }
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
