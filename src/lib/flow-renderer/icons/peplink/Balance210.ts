import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Balance 210 - Compact SD-WAN branch router
 * 3 WAN ports, 4 LAN ports, optional WiFi
 */
export class Balance210Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  public getSeries(): string {
    return 'balance';
  }

  public getModelName(): string {
    return 'balance-210';
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Compact desktop unit dimensions
    const width = 70;
    const depth = 50;
    const height = 25;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // Add status LEDs on front face (power, WAN x3, WiFi)
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
    
    // WiFi LED
    const wifiLED = this.addLED(
      new paper.Point(27 * this.scale, height * this.scale - 5 * this.scale),
      DeviceIcon.COLORS.ledWiFi,
      true
    );
    this.group.addChild(wifiLED);
    
    // Add 3 WAN ports on front face with labels
    for (let i = 0; i < 3; i++) {
      const wanPort = this.addPortWithLabel(
        new paper.Point((8 + i * 12) * this.scale, height * this.scale - 12 * this.scale),
        `W${i + 1}`
      );
      this.group.addChild(wanPort);
    }
    
    // Add 4 LAN ports on back/side (show edge view)
    for (let i = 0; i < 4; i++) {
      const lanPort = new paper.Path.Rectangle(
        new paper.Point(
          (8 + i * 10) * this.scale,
          height * this.scale - 20 * this.scale
        ),
        new paper.Size(6 * this.scale, 4 * this.scale)
      );
      lanPort.fillColor = new paper.Color(DeviceIcon.COLORS.port);
      lanPort.strokeColor = new paper.Color('#2c3e50');
      lanPort.strokeWidth = 0.5;
      this.group.addChild(lanPort);
      
      const lanLabel = this.addLabel(
        new paper.Point((10 + i * 10) * this.scale, height * this.scale - 22 * this.scale),
        `L${i + 1}`,
        3
      );
      this.group.addChild(lanLabel);
    }
    
    // Add optional WiFi indicator on top
    const wifi = this.addWiFiIndicator(
      new paper.Point(
        (width * 0.75) * this.scale * Math.cos(rad) + (depth * 0.5) * this.scale * Math.cos(rad),
        -((width * 0.75) * this.scale * Math.sin(rad) + (depth * 0.5) * this.scale * Math.sin(rad)) - 3 * this.scale
      )
    );
    this.group.addChild(wifi);
    
    // Add model name label on front
    const modelLabel = this.addLabel(
      new paper.Point(5 * this.scale, height * this.scale - 23 * this.scale),
      'Balance 210',
      5
    );
    this.group.addChild(modelLabel);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
