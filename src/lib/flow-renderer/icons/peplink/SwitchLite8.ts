import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * Switch Lite 8 - 8-port unmanaged switch
 * Small flat box with 8 port indicators
 */
export class SwitchLite8Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Small switch dimensions
    const width = 65;
    const depth = 35;
    const height = 12;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add 8 port indicators on front face
    const frontPortStart = new paper.Point(
      8 * this.scale,
      height * this.scale - 6 * this.scale
    );
    const ports = this.addPorts(8, frontPortStart, 7 * this.scale);
    this.group.addChild(ports);
    
    // Add port LEDs above ports
    for (let i = 0; i < 8; i++) {
      const ledPos = new paper.Point((8 + i * 7) * this.scale, height * this.scale - 10 * this.scale);
      const led = this.addLED(ledPos, '#22c55e');
      led.scale(0.7); // Smaller LEDs
      this.group.addChild(led);
    }
    
    // Add power LED
    const powerLedPos = new paper.Point(3 * this.scale, height * this.scale - 3 * this.scale);
    const powerLed = this.addLED(powerLedPos, '#3b82f6');
    this.group.addChild(powerLed);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
