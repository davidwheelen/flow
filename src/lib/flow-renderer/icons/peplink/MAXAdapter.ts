import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX Adapter - USB cellular adapter
 * Small stick/dongle shape in isometric view
 */
export class MAXAdapterIcon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // USB stick dimensions (very small and elongated)
    const width = 25;
    const depth = 12;
    const height = 8;
    
    // Create main body (dongle shape)
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add USB connector on one end
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    const usbConnector = new paper.Path.Rectangle(
      new paper.Point(-6 * this.scale, height * this.scale - 6 * this.scale),
      new paper.Size(5 * this.scale, 4 * this.scale)
    );
    usbConnector.fillColor = new paper.Color('#9ca3af');
    usbConnector.strokeColor = new paper.Color('#000000');
    usbConnector.strokeWidth = 0.5;
    this.group.addChild(usbConnector);
    
    // Add cellular indicator on top
    const antennaPos = new paper.Point(
      (width * Math.cos(rad) + depth * Math.cos(rad)) / 2,
      -(width * Math.sin(rad) + depth * Math.sin(rad)) / 2 - 3 * this.scale
    );
    const antenna = new paper.Path.Circle(antennaPos, 2 * this.scale);
    antenna.fillColor = new paper.Color('#a855f7');
    antenna.strokeColor = new paper.Color('#000000');
    antenna.strokeWidth = 0.5;
    this.group.addChild(antenna);
    
    // Add small LED indicator
    const ledPos = new paper.Point(10 * this.scale, height * this.scale - 4 * this.scale);
    const led = this.addLED(ledPos, '#a855f7');
    this.group.addChild(led);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
