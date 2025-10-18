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
    ledPower: '#22c55e',        // Green power LED
    ledWAN: '#3b82f6',          // Blue WAN LED
    ledCellular: '#a855f7',     // Purple cellular LED
    ledWiFi: '#22c55e',         // Green WiFi LED
    sfpPort: '#f97316',         // Orange SFP port
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
   * Get the series name (e.g., 'balance', 'max', 'ap', 'switches', 'fusionhub')
   */
  public abstract getSeries(): string;

  /**
   * Get the model name (e.g., 'balance-20x', 'max-transit')
   */
  public abstract getModelName(): string;

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
   * Add LED indicator with optional glow effect
   */
  protected addLED(position: paper.Point, color: string = DeviceIcon.COLORS.led, glow: boolean = false): paper.Path.Circle {
    const led = new paper.Path.Circle(position, 2 * this.scale);
    led.fillColor = new paper.Color(color);
    led.strokeColor = new paper.Color('#000000');
    led.strokeWidth = 0.5;
    
    if (glow) {
      led.shadowColor = new paper.Color(color);
      led.shadowBlur = 4;
    }
    
    return led;
  }

  /**
   * Add text label
   */
  protected addLabel(
    position: paper.Point,
    text: string,
    fontSize: number = 6,
    color: string = '#ecf0f1'
  ): paper.PointText {
    const label = new paper.PointText(position);
    label.content = text;
    label.fontSize = fontSize * this.scale;
    label.fillColor = new paper.Color(color);
    label.fontFamily = 'Arial, sans-serif';
    label.justification = 'left';
    return label;
  }

  /**
   * Add cellular antenna indicator (circle with line)
   */
  protected addCellularAntenna(
    position: paper.Point,
    height: number = 8
  ): paper.Group {
    const antenna = new paper.Group();
    
    const circle = new paper.Path.Circle(position, 3 * this.scale);
    circle.fillColor = new paper.Color(DeviceIcon.COLORS.ledCellular);
    circle.strokeColor = new paper.Color('#000000');
    circle.strokeWidth = 0.5;
    circle.shadowColor = new paper.Color(DeviceIcon.COLORS.ledCellular);
    circle.shadowBlur = 4;
    
    const line = new paper.Path.Line(
      position,
      position.add(new paper.Point(0, -height * this.scale))
    );
    line.strokeColor = new paper.Color(DeviceIcon.COLORS.ledCellular);
    line.strokeWidth = 1;
    
    antenna.addChild(circle);
    antenna.addChild(line);
    
    return antenna;
  }

  /**
   * Add WiFi indicator (circle with waves)
   */
  protected addWiFiIndicator(position: paper.Point): paper.Group {
    const wifi = new paper.Group();
    
    const base = new paper.Path.Circle(position, 3 * this.scale);
    base.fillColor = new paper.Color(DeviceIcon.COLORS.ledWiFi);
    base.strokeColor = new paper.Color('#000000');
    base.strokeWidth = 0.5;
    
    // Add wave arcs
    for (let i = 1; i <= 2; i++) {
      const arc = new paper.Path.Arc({
        from: position.add(new paper.Point(-4 * i * this.scale, 0)),
        through: position.add(new paper.Point(0, -4 * i * this.scale)),
        to: position.add(new paper.Point(4 * i * this.scale, 0))
      });
      arc.strokeColor = new paper.Color(DeviceIcon.COLORS.ledWiFi);
      arc.strokeWidth = 0.5;
      arc.opacity = 0.6 - (i * 0.2);
      wifi.addChild(arc);
    }
    
    wifi.addChild(base);
    return wifi;
  }

  /**
   * Add port with label
   */
  protected addPortWithLabel(
    position: paper.Point,
    label: string,
    size: paper.Size = new paper.Size(8, 5)
  ): paper.Group {
    const portGroup = new paper.Group();
    
    const port = new paper.Path.Rectangle(
      position,
      new paper.Size(size.width * this.scale, size.height * this.scale)
    );
    port.fillColor = new paper.Color(DeviceIcon.COLORS.port);
    port.strokeColor = new paper.Color('#2c3e50');
    port.strokeWidth = 0.5;
    
    const labelText = this.addLabel(
      position.add(new paper.Point(size.width * this.scale / 2, -2 * this.scale)),
      label,
      4
    );
    labelText.justification = 'center';
    
    portGroup.addChild(port);
    portGroup.addChild(labelText);
    
    return portGroup;
  }

  public getGroup(): paper.Group {
    return this.group;
  }

  public remove(): void {
    this.group.remove();
  }
}
