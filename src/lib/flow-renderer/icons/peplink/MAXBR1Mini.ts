import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX BR1 Mini - Compact mobile router
 * Very small unit with 1 WAN port and 1 cellular modem
 */
export class MAXBR1MiniIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'max';
  }

  public getModelName(): string {
    return 'max-br1-mini';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Very small compact dimensions
    const width = 50;
    const depth = 40;
    const height = 20;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs (power, WAN, cellular)
    const powerLED = this.addLED(
      new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledPower,
      true
    );
    this.group.addChild(powerLED);
    
    const wanLED = this.addLED(
      new paper.Point(10 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledWAN,
      true
    );
    this.group.addChild(wanLED);
    
    const cellLED = this.addLED(
      new paper.Point(15 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledCellular,
      true
    );
    this.group.addChild(cellLED);
    
    // Add 1 WAN port
    const wanPort = this.addPortWithLabel(
      new paper.Point(8 * this.scale, height * this.scale - 12 * this.scale),
      'W1',
      new paper.Size(8, 5)
    );
    this.group.addChild(wanPort);
    
    // Add 1 cellular antenna on top
    const cellAntenna = this.addCellularAntenna(
      new paper.Point(
        (width * 0.7) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.7) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      8
    );
    this.group.addChild(cellAntenna);
    
    // Add model name label
    const modelLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 18 * this.scale),
      'BR1 Mini',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
