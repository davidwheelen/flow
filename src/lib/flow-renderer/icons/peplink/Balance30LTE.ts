import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 30 LTE - Entry-level SD-WAN router with LTE
 * Compact unit with 2 WAN ports and built-in LTE
 */
export class Balance30LTEIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'balance';
  }

  public getModelName(): string {
    return 'balance-30-lte';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Small desktop unit dimensions
    const width = 55;
    const depth = 45;
    const height = 22;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs on front face (power, WAN x2, LTE)
    const powerLED = this.addLED(
      new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledPower,
      true
    );
    this.group.addChild(powerLED);
    
    // WAN LEDs
    for (let i = 0; i < 2; i++) {
      const wanLED = this.addLED(
        new paper.Point((10 + i * 5) * this.scale, height * this.scale - 5 * this.scale),
        DeviceIcon.COLORS.ledWAN,
        true
      );
      this.group.addChild(wanLED);
    }
    
    // LTE LED
    const lteLED = this.addLED(
      new paper.Point(22 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledCellular,
      true
    );
    this.group.addChild(lteLED);
    
    // Add 2 WAN ports on front face with labels
    for (let i = 0; i < 2; i++) {
      const wanPort = this.addPortWithLabel(
        new paper.Point((8 + i * 12) * this.scale, height * this.scale - 12 * this.scale),
        `W${i + 1}`
      );
      this.group.addChild(wanPort);
    }
    
    // Add LTE antenna indicator on top
    const lteAntenna = this.addCellularAntenna(
      new paper.Point(
        (width * 0.7) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.7) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      8
    );
    this.group.addChild(lteAntenna);
    
    // Add LTE label
    const lteLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 18 * this.scale),
      'LTE',
      5
    );
    this.group.addChild(lteLabel);
    
    // Add model name label on front
    const modelLabel = this.addLabel(
      new paper.Point(20 * this.scale, height * this.scale - 18 * this.scale),
      'Bal 30',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
