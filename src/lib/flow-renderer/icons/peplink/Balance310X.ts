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

  public getSeries(): string {
    return 'balance';
  }

  public getModelName(): string {
    return 'balance-310x';
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
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs on front face (power, WAN x3)
    const powerLED = this.addLED(
      new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledPower,
      true
    );
    this.group.addChild(powerLED);
    
    for (let i = 0; i < 3; i++) {
      const wanLED = this.addLED(
        new paper.Point((10 + i * 5) * this.scale, height * this.scale - 5 * this.scale),
        DeviceIcon.COLORS.ledWAN,
        true
      );
      this.group.addChild(wanLED);
    }
    
    // Add WAN ports on front face with labels
    for (let i = 0; i < 3; i++) {
      const wanPort = this.addPortWithLabel(
        new paper.Point((8 + i * 12) * this.scale, height * this.scale - 12 * this.scale),
        `W${i + 1}`
      );
      this.group.addChild(wanPort);
    }
    
    // Add WiFi antennas on top corners
    const wifi1 = this.addWiFiIndicator(
      new paper.Point(
        10 * this.scale * Math.cos(rad) + 10 * this.scale * Math.cos(rad),
        -(10 * this.scale * Math.sin(rad) + 10 * this.scale * Math.sin(rad)) - 3 * this.scale
      )
    );
    this.group.addChild(wifi1);
    
    const wifi2 = this.addWiFiIndicator(
      new paper.Point(
        (width - 10) * this.scale * Math.cos(rad) + 10 * this.scale * Math.cos(rad),
        -((width - 10) * this.scale * Math.sin(rad) + 10 * this.scale * Math.sin(rad)) - 3 * this.scale
      )
    );
    this.group.addChild(wifi2);
    
    // Add cellular antenna indicator
    const cellularAntenna = this.addCellularAntenna(
      new paper.Point(
        (width * 0.5) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.5) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      )
    );
    this.group.addChild(cellularAntenna);
    
    // Add model name label on front
    const modelLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 20 * this.scale),
      'Balance 310X',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
