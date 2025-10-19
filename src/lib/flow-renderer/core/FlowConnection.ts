import paper from 'paper';
import { FlowNode } from './FlowNode';
import { ConnectionType, ConnectionStatus } from '@/types/network.types';

export interface FlowConnectionOptions {
  from: FlowNode;
  to: FlowNode;
  type: ConnectionType;
  status: ConnectionStatus;
}

export class FlowConnection {
  private from: FlowNode;
  private to: FlowNode;
  private type: ConnectionType;
  private status: ConnectionStatus;
  private path: paper.Path;
  private animationOffset: number = 0;

  private static readonly CONNECTION_COLORS: Record<ConnectionType, string> = {
    wan: '#3b82f6',
    cellular: '#a855f7',
    wifi: '#22c55e',
    sfp: '#f97316',
  };

  private static readonly STATUS_STYLES: Record<ConnectionStatus, { opacity: number; dashArray: number[] }> = {
    connected: { opacity: 1, dashArray: [] },
    disconnected: { opacity: 0.3, dashArray: [5, 5] },
    degraded: { opacity: 0.7, dashArray: [10, 5] },
  };

  constructor(options: FlowConnectionOptions) {
    this.from = options.from;
    this.to = options.to;
    this.type = options.type;
    this.status = options.status;
    this.path = new paper.Path();
    
    this.render();
  }

  private render(): void {
    this.path.remove();
    
    const fromPos = this.from.getPosition();
    const toPos = this.to.getPosition();
    
    // Create curved path between nodes
    this.path = new paper.Path();
    const color = FlowConnection.CONNECTION_COLORS[this.type];
    this.path.strokeColor = new paper.Color(color);
    this.path.strokeWidth = 3;
    this.path.strokeCap = 'round';
    
    // Add glow effect for cellular connections
    if (this.type === 'cellular') {
      this.path.shadowColor = new paper.Color(color);
      this.path.shadowBlur = 12;
    } else if (this.type === 'sfp') {
      this.path.strokeWidth = 4;
    }
    
    const styles = FlowConnection.STATUS_STYLES[this.status];
    this.path.opacity = styles.opacity;
    if (styles.dashArray.length > 0) {
      this.path.dashArray = styles.dashArray;
    }
    
    // Calculate control point for curve
    const midPoint = fromPos.add(toPos).divide(2);
    const offset = fromPos.subtract(toPos).rotate(90, new paper.Point(0, 0)).normalize(50);
    const controlPoint = midPoint.add(offset);
    
    // Create quadratic curve
    this.path.moveTo(fromPos);
    this.path.quadraticCurveTo(controlPoint, toPos);
  }

  public animate(): void {
    if (this.status === 'connected') {
      this.animationOffset += 1;
      if (this.path.dashArray.length === 0) {
        this.path.dashArray = [10, 10];
      }
      this.path.dashOffset = this.animationOffset;
    }
  }

  public getType(): ConnectionType {
    return this.type;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public updateStatus(status: ConnectionStatus): void {
    this.status = status;
    this.render();
  }

  public remove(): void {
    this.path.remove();
  }
}
