import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 1350 - High-performance enterprise SD-WAN router
 * 1U rack mount with 13 ports and dual cellular
 */
export class Balance1350Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'balance';
  }

  public getModelName(): string {
    return 'balance-1350';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Rack mount dimensions
    const width = 140;
    const depth = 45;
    const height = 18;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add rack mount ears
    const earLeft = new paper.Path.Rectangle(
      new paper.Point(-8 * this.scale, height * this.scale - 14 * this.scale),
      new paper.Size(6 * this.scale, 12 * this.scale)
    );
    earLeft.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earLeft.strokeColor = new paper.Color('#000000');
    earLeft.strokeWidth = 0.5;
    this.group.addChild(earLeft);
    
    const earRight = new paper.Path.Rectangle(
      new paper.Point(width * this.scale * Math.cos(rad) + 2 * this.scale, height * this.scale - (width * this.scale * Math.sin(rad) + 14 * this.scale)),
      new paper.Size(6 * this.scale, 12 * this.scale)
    );
    earRight.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    earRight.strokeColor = new paper.Color('#000000');
    earRight.strokeWidth = 0.5;
    this.group.addChild(earRight);
    
    // Add status LEDs (power, many WAN, cellular)
    const powerLED = this.addLED(
      new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledPower,
      true
    );
    this.group.addChild(powerLED);
    
    // WAN LEDs
    for (let i = 0; i < 10; i++) {
      const wanLED = this.addLED(
        new paper.Point((10 + i * 3) * this.scale, height * this.scale - 5 * this.scale),
        DeviceIcon.COLORS.ledWAN,
        true
      );
      this.group.addChild(wanLED);
    }
    
    // Cellular LEDs
    for (let i = 0; i < 2; i++) {
      const cellLED = this.addLED(
        new paper.Point((42 + i * 3) * this.scale, height * this.scale - 5 * this.scale),
        DeviceIcon.COLORS.ledCellular,
        true
      );
      this.group.addChild(cellLED);
    }
    
    // Add 10 WAN ports
    for (let i = 0; i < 10; i++) {
      const wanPort = this.addPortWithLabel(
        new paper.Point((5 + i * 9) * this.scale, height * this.scale - 12 * this.scale),
        `${i + 1}`,
        new paper.Size(6, 4)
      );
      this.group.addChild(wanPort);
    }
    
    // Add 3 SFP ports
    for (let i = 0; i < 3; i++) {
      const sfpPort = new paper.Path.Rectangle(
        new paper.Point((100 + i * 12) * this.scale, height * this.scale - 12 * this.scale),
        new paper.Size(8 * this.scale, 4 * this.scale)
      );
      sfpPort.fillColor = new paper.Color(DeviceIcon.COLORS.sfpPort);
      sfpPort.strokeColor = new paper.Color('#000000');
      sfpPort.strokeWidth = 0.5;
      this.group.addChild(sfpPort);
      
      const sfpLabel = this.addLabel(
        new paper.Point((102 + i * 12) * this.scale, height * this.scale - 15 * this.scale),
        `S${i + 1}`,
        4
      );
      this.group.addChild(sfpLabel);
    }
    
    // Add model name label
    const modelLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 16 * this.scale),
      'Balance 1350',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
