import paper from 'paper';
import { DeviceIcon, DeviceIconOptions } from '../DeviceIcon';

/**
 * MAX HD2 - Dual cellular modems
 * Compact box with 2 cellular indicators and WiFi
 */
export class MAXHD2Icon extends DeviceIcon {
  constructor(options: DeviceIconOptions = {}) {
    super(options);
  }

  protected render(): void {
    this.group.removeChildren();
    
    // Compact unit dimensions
    const width = 58;
    const depth = 46;
    const height = 24;
    
    // Create main body
    const body = this.createIsometricBox(width, depth, height);
    this.group.addChild(body);
    
    // Add WAN port on front face
    const frontPortStart = new paper.Point(
      10 * this.scale,
      height * this.scale - 8 * this.scale
    );
    const wanPorts = this.addPorts(1, frontPortStart, 10 * this.scale);
    this.group.addChild(wanPorts);
    
    // Add dual cellular indicators on top
    const angle = 30;
    const rad = (angle * Math.PI) / 180;
    
    // First cellular antenna
    const antenna1Pos = new paper.Point(
      15 * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -(15 * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna1 = new paper.Path.Circle(antenna1Pos, 3.5 * this.scale);
    antenna1.fillColor = new paper.Color('#a855f7');
    antenna1.strokeColor = new paper.Color('#000000');
    antenna1.strokeWidth = 0.5;
    this.group.addChild(antenna1);
    
    // Add antenna stem
    const stem1 = new paper.Path.Line(
      antenna1Pos,
      antenna1Pos.add(new paper.Point(0, -6 * this.scale))
    );
    stem1.strokeColor = new paper.Color('#000000');
    stem1.strokeWidth = 1;
    this.group.addChild(stem1);
    
    // Second cellular antenna
    const antenna2Pos = new paper.Point(
      (width - 15) * this.scale * Math.cos(rad) + 15 * this.scale * Math.cos(rad),
      -((width - 15) * this.scale * Math.sin(rad) + 15 * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const antenna2 = new paper.Path.Circle(antenna2Pos, 3.5 * this.scale);
    antenna2.fillColor = new paper.Color('#a855f7');
    antenna2.strokeColor = new paper.Color('#000000');
    antenna2.strokeWidth = 0.5;
    this.group.addChild(antenna2);
    
    // Add antenna stem
    const stem2 = new paper.Path.Line(
      antenna2Pos,
      antenna2Pos.add(new paper.Point(0, -6 * this.scale))
    );
    stem2.strokeColor = new paper.Color('#000000');
    stem2.strokeWidth = 1;
    this.group.addChild(stem2);
    
    // Add WiFi antenna in center
    const wifiPos = new paper.Point(
      (width / 2) * this.scale * Math.cos(rad) + (depth / 2) * this.scale * Math.cos(rad),
      -((width / 2) * this.scale * Math.sin(rad) + (depth / 2) * this.scale * Math.sin(rad)) - 5 * this.scale
    );
    const wifi = new paper.Path.Circle(wifiPos, 3 * this.scale);
    wifi.fillColor = new paper.Color(DeviceIcon.COLORS.accent);
    wifi.strokeColor = new paper.Color('#000000');
    wifi.strokeWidth = 0.5;
    this.group.addChild(wifi);
    
    // Add status LEDs
    const led1Pos = new paper.Point(5 * this.scale, height * this.scale - 5 * this.scale);
    const led1 = this.addLED(led1Pos);
    this.group.addChild(led1);
    
    const led2Pos = new paper.Point(10 * this.scale, height * this.scale - 5 * this.scale);
    const led2 = this.addLED(led2Pos, '#a855f7');
    this.group.addChild(led2);
    
    // Center the group
    this.group.position = new paper.Point(0, 0);
  }
}
