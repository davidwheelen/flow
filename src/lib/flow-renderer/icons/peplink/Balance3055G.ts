import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 305 5G - Multi-WAN SD-WAN router with 5G cellular
 * 3 WAN ports, dual 5G cellular modems
 */
export class Balance3055GIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'balance';
  }

  public getModelName(): string {
    return 'balance-305-5g';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Medium desktop unit dimensions
    const width = 78;
    const depth = 58;
    const height = 30;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs on front face (power, WAN x3, 5G x2)
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
    
    // 5G LEDs (brighter purple)
    for (let i = 0; i < 2; i++) {
      const fiveGLED = this.addLED(
        new paper.Point((27 + i * 5) * this.scale, height * this.scale - 5 * this.scale),
        '#c084fc', // Brighter purple for 5G
        true
      );
      this.group.addChild(fiveGLED);
    }
    
    // Add 3 WAN ports on front face with labels
    for (let i = 0; i < 3; i++) {
      const wanPort = this.addPortWithLabel(
        new paper.Point((8 + i * 12) * this.scale, height * this.scale - 12 * this.scale),
        `W${i + 1}`
      );
      this.group.addChild(wanPort);
    }
    
    // Add 2 5G antenna indicators on top
    const antenna1 = this.addCellularAntenna(
      new paper.Point(
        (width * 0.3) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.3) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      12
    );
    antenna1.children.forEach(child => {
      if (child.fillColor) child.fillColor = new paper.Color('#c084fc');
      if (child.strokeColor) child.strokeColor = new paper.Color('#c084fc');
    });
    this.group.addChild(antenna1);
    
    const antenna2 = this.addCellularAntenna(
      new paper.Point(
        (width * 0.7) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.7) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      12
    );
    antenna2.children.forEach(child => {
      if (child.fillColor) child.fillColor = new paper.Color('#c084fc');
      if (child.strokeColor) child.strokeColor = new paper.Color('#c084fc');
    });
    this.group.addChild(antenna2);
    
    // Add "5G" label prominently
    const fiveGLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 20 * this.scale),
      '5G',
      8
    );
    fiveGLabel.fillColor = new paper.Color('#c084fc');
    this.group.addChild(fiveGLabel);
    
    // Add model name label on front
    const modelLabel = this.addLabel(
      new paper.Point(20 * this.scale, height * this.scale - 20 * this.scale),
      'Bal 305',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
