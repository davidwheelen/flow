import paper from 'paper';

export interface DeviceIconOptions {
  scale?: number;
  position?: paper.Point;
}

export abstract class DeviceIcon {
  protected group: paper.Group;
  protected scale: number;
  
  // Standard colors for Peplink devices
  protected static readonly COLORS = {
    deviceBody: '#374151',      // Dark grey
    deviceBodyLight: '#4b5563', // Medium grey
    deviceTop: '#6b7280',       // Light grey
    accent: '#3b82f6',          // Blue accent
    port: '#1f2937',            // Dark port
    led: '#22c55e',             // Green LED
  };

  constructor(options: DeviceIconOptions = {}) {
    this.scale = options.scale || 1;
    this.group = new paper.Group();
    
    if (options.position) {
      this.group.position = options.position;
    }
    
    this.render();
  }

  protected abstract render(): void;

  /**
   * Create isometric box with proper 3D perspective
   */
  protected createIsometricBox(
    width: number,
    depth: number,
    height: number,
    origin: paper.Point = new paper.Point(0, 0)
  ): paper.Group {
    const box = new paper.Group();
    const angle = 30; // degrees for isometric
    const rad = (angle * Math.PI) / 180;
    
    const w = width * this.scale;
    const d = depth * this.scale;
    const h = height * this.scale;
    
    // Top face
    const top = new paper.Path([
      origin,
      origin.add(new paper.Point(w * Math.cos(rad), -w * Math.sin(rad))),
      origin.add(new paper.Point(w * Math.cos(rad) + d * Math.cos(rad), -(w * Math.sin(rad) + d * Math.sin(rad)))),
      origin.add(new paper.Point(d * Math.cos(rad), -d * Math.sin(rad))),
    ]);
    top.closed = true;
    top.fillColor = new paper.Color(DeviceIcon.COLORS.deviceTop);
    top.strokeColor = new paper.Color('#000000');
    top.strokeWidth = 0.5;
    
    // Front face (left)
    const front = new paper.Path([
      origin,
      origin.add(new paper.Point(0, h)),
      origin.add(new paper.Point(w * Math.cos(rad), h - w * Math.sin(rad))),
      origin.add(new paper.Point(w * Math.cos(rad), -w * Math.sin(rad))),
    ]);
    front.closed = true;
    front.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBody);
    front.strokeColor = new paper.Color('#000000');
    front.strokeWidth = 0.5;
    
    // Side face (right)
    const side = new paper.Path([
      origin.add(new paper.Point(w * Math.cos(rad), -w * Math.sin(rad))),
      origin.add(new paper.Point(w * Math.cos(rad), h - w * Math.sin(rad))),
      origin.add(new paper.Point(w * Math.cos(rad) + d * Math.cos(rad), h - (w * Math.sin(rad) + d * Math.sin(rad)))),
      origin.add(new paper.Point(w * Math.cos(rad) + d * Math.cos(rad), -(w * Math.sin(rad) + d * Math.sin(rad)))),
    ]);
    side.closed = true;
    side.fillColor = new paper.Color(DeviceIcon.COLORS.deviceBodyLight);
    side.strokeColor = new paper.Color('#000000');
    side.strokeWidth = 0.5;
    
    box.addChildren([front, side, top]);
    return box;
  }

  /**
   * Add ports to a face
   */
  protected addPorts(
    count: number,
    startPos: paper.Point,
    spacing: number
  ): paper.Group {
    const ports = new paper.Group();
    const portSize = 4 * this.scale;
    
    for (let i = 0; i < count; i++) {
      const port = new paper.Path.Rectangle(
        startPos.add(new paper.Point(i * spacing, 0)),
        new paper.Size(portSize, portSize)
      );
      port.fillColor = new paper.Color(DeviceIcon.COLORS.port);
      port.strokeColor = new paper.Color('#000000');
      port.strokeWidth = 0.5;
      ports.addChild(port);
    }
    
    return ports;
  }

  /**
   * Add LED indicator
   */
  protected addLED(position: paper.Point, color: string = DeviceIcon.COLORS.led): paper.Path.Circle {
    const led = new paper.Path.Circle(position, 2 * this.scale);
    led.fillColor = new paper.Color(color);
    led.strokeColor = new paper.Color('#000000');
    led.strokeWidth = 0.5;
    return led;
  }

  public getGroup(): paper.Group {
    return this.group;
  }

  public remove(): void {
    this.group.remove();
  }
}
