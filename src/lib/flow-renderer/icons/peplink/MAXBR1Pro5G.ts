import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX BR1 Pro 5G - Professional mobile router with 5G
 * Rugged unit with dual 5G modems, WiFi, and advanced features
 */
export class MAXBR1Pro5GIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'max';
  }

  public getModelName(): string {
    return 'max-br1-pro-5g';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Rugged compact dimensions
    const width = 60;
    const depth = 50;
    const height = 25;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs (power, WAN, dual 5G, WiFi)
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
    
    // Dual 5G LEDs
    for (let i = 0; i < 2; i++) {
      const fiveGLED = this.addLED(
        new paper.Point((15 + i * 5) * this.scale, height * this.scale - 5 * this.scale),
        '#c084fc',
        true
      );
      this.group.addChild(fiveGLED);
    }
    
    const wifiLED = this.addLED(
      new paper.Point(26 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledWiFi,
      true
    );
    this.group.addChild(wifiLED);
    
    // Add WAN port
    const wanPort = this.addPortWithLabel(
      new paper.Point(8 * this.scale, height * this.scale - 12 * this.scale),
      'W1',
      new paper.Size(8, 5)
    );
    this.group.addChild(wanPort);
    
    // Add LAN port
    const lanPort = this.addPortWithLabel(
      new paper.Point(20 * this.scale, height * this.scale - 12 * this.scale),
      'L1',
      new paper.Size(8, 5)
    );
    this.group.addChild(lanPort);
    
    // Add dual 5G antennas on top
    const antenna1 = this.addCellularAntenna(
      new paper.Point(
        (width * 0.3) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.3) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      ),
      10
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
      10
    );
    antenna2.children.forEach(child => {
      if (child.fillColor) child.fillColor = new paper.Color('#c084fc');
      if (child.strokeColor) child.strokeColor = new paper.Color('#c084fc');
    });
    this.group.addChild(antenna2);
    
    // Add WiFi antenna in center
    const wifi = this.addWiFiIndicator(
      new paper.Point(
        (width * 0.5) * this.scale * Math.cos(rad) + (depth * 0.2) * this.scale * Math.cos(rad),
        -((width * 0.5) * this.scale * Math.sin(rad) + (depth * 0.2) * this.scale * Math.sin(rad)) - 3 * this.scale
      )
    );
    this.group.addChild(wifi);
    
    // Add rugged edges/corners (small circles at corners)
    const corners = [
      { x: 3, y: height - 3 },
      { x: width * Math.cos(rad) - 3, y: height - 3 - width * Math.sin(rad) },
    ];
    
    corners.forEach(({ x, y }) => {
      const corner = new paper.Path.Circle(
        new paper.Point(x * this.scale, y * this.scale),
        2 * this.scale
      );
      corner.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
      corner.strokeColor = new paper.Color('#000000');
      corner.strokeWidth = 0.5;
      this.group.addChild(corner);
    });
    
    // Add "5G" label prominently
    const fiveGLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 18 * this.scale),
      '5G',
      7
    );
    fiveGLabel.fillColor = new paper.Color('#c084fc');
    this.group.addChild(fiveGLabel);
    
    // Add model name label
    const modelLabel = this.addLabel(
      new paper.Point(15 * this.scale, height * this.scale - 18 * this.scale),
      'BR1 Pro',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
