import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 305 - Multi-WAN SD-WAN router with dual cellular
 * 3 WAN ports, dual SIM/cellular modems
 */
export class Balance305Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'balance';
  }

  public getModelName(): string {
    return 'balance-305';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Medium desktop unit dimensions
    const width = 75;
    const depth = 55;
    const height = 28;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs on front face (power, WAN x3, cellular x2)
    const powerLED = this.addLED(
      new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledPower,
      true
    );
    this.group.addChild(powerLED);
    
    // WAN LEDs
    for (let i = 0; i < 3; i++) {
      const wanLED = this.addLED(
        new paper.Point((10 + i * 5) * this.scale, height * this.scale - 5 * this.scale),
        DeviceIcon.COLORS.ledWAN,
        true
      );
      this.group.addChild(wanLED);
    }
    
    // Cellular LEDs
    for (let i = 0; i < 2; i++) {
      const cellLED = this.addLED(
        new paper.Point((27 + i * 5) * this.scale, height * this.scale - 5 * this.scale),
        DeviceIcon.COLORS.ledCellular,
        true
      );
      this.group.addChild(cellLED);
    }
    
    // Add 3 WAN ports on front face with labels
    for (let i = 0; i < 3; i++) {
      const wanPort = this.addPortWithLabel(
        new paper.Point((8 + i * 12) * this.scale, height * this.scale - 12 * this.scale),
        `W${i + 1}`
      );
      this.group.addChild(wanPort);
    }
    
    // Add 2 cellular antenna indicators on top
    const cell1 = this.addCellularAntenna(
      new paper.Point(
        (width * 0.3) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.3) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      10
    );
    this.group.addChild(cell1);
    
    const cell2 = this.addCellularAntenna(
      new paper.Point(
        (width * 0.7) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.7) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      10
    );
    this.group.addChild(cell2);
    
    // Add dual SIM labels
    const sim1Label = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 20 * this.scale),
      'SIM1',
      4
    );
    this.group.addChild(sim1Label);
    
    const sim2Label = this.addLabel(
      new paper.Point(20 * this.scale, height * this.scale - 20 * this.scale),
      'SIM2',
      4
    );
    this.group.addChild(sim2Label);
    
    // Add model name label on front
    const modelLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 26 * this.scale),
      'Balance 305',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
