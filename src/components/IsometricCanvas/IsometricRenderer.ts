/**
 * Isometric Renderer
 * Core rendering engine with canvas management and animation loop
 */

import { CameraTransform, Point2D, Point3D, toIsometric, applyCamera } from '@/utils/isometricMath';

export interface RenderObject {
  id: string;
  depth: number;
  render: (ctx: CanvasRenderingContext2D, camera: CameraTransform) => void;
}

export class IsometricRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: CameraTransform;
  private objects: RenderObject[] = [];
  private animationFrameId: number | null = null;
  private isDragging = false;
  private lastMousePos: Point2D = { x: 0, y: 0 };
  private hoveredObjectId: string | null = null;
  
  // Callbacks
  private onRenderCallback?: () => void;
  private onHoverCallback?: (objectId: string | null) => void;
  private onClickCallback?: (objectId: string) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;

    // Initialize camera at center with no zoom
    this.camera = {
      offsetX: canvas.width / 2,
      offsetY: canvas.height / 2,
      scale: 1,
    };

    this.setupEventListeners();
    this.resizeCanvas();
  }

  /**
   * Setup canvas to fill container and handle resize
   */
  private resizeCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);

    // Update camera offset to center
    this.camera.offsetX = rect.width / 2;
    this.camera.offsetY = rect.height / 2;
  }

  /**
   * Setup mouse/touch event listeners for interaction
   */
  private setupEventListeners(): void {
    // Mouse wheel for zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      const delta = -e.deltaY * zoomSpeed;
      const newScale = Math.max(0.1, Math.min(3, this.camera.scale * (1 + delta)));
      
      // Zoom towards mouse position
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Adjust offset to zoom towards mouse
      this.camera.offsetX = mouseX - (mouseX - this.camera.offsetX) * (newScale / this.camera.scale);
      this.camera.offsetY = mouseY - (mouseY - this.camera.offsetY) * (newScale / this.camera.scale);
      this.camera.scale = newScale;
    });

    // Mouse down for panning
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.isDragging = true;
      this.lastMousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });

    // Mouse move for panning and hover
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (this.isDragging) {
        const dx = mouseX - this.lastMousePos.x;
        const dy = mouseY - this.lastMousePos.y;
        this.camera.offsetX += dx;
        this.camera.offsetY += dy;
        this.lastMousePos = { x: mouseX, y: mouseY };
      } else {
        // Check for hover
        this.checkHover({ x: mouseX, y: mouseY });
      }
    });

    // Mouse up to stop panning
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Mouse leave to stop panning
    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      if (this.hoveredObjectId !== null) {
        this.hoveredObjectId = null;
        this.onHoverCallback?.(null);
      }
    });

    // Click for selection
    this.canvas.addEventListener('click', () => {
      if (!this.isDragging && this.hoveredObjectId) {
        this.onClickCallback?.(this.hoveredObjectId);
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  /**
   * Check if mouse is hovering over any object
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private checkHover(_mousePos: Point2D): void {
    // This will be implemented with actual hit detection
    // For now, just a placeholder
    // The hit detection will be done by individual objects
  }

  /**
   * Set render objects
   */
  setObjects(objects: RenderObject[]): void {
    this.objects = objects;
  }

  /**
   * Add a render object
   */
  addObject(object: RenderObject): void {
    this.objects.push(object);
  }

  /**
   * Remove a render object
   */
  removeObject(id: string): void {
    this.objects = this.objects.filter(obj => obj.id !== id);
  }

  /**
   * Clear all objects
   */
  clearObjects(): void {
    this.objects = [];
  }

  /**
   * Get camera transform
   */
  getCamera(): CameraTransform {
    return { ...this.camera };
  }

  /**
   * Set camera transform
   */
  setCamera(camera: Partial<CameraTransform>): void {
    this.camera = { ...this.camera, ...camera };
  }

  /**
   * Reset camera to default view
   */
  resetCamera(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.camera = {
      offsetX: rect.width / 2,
      offsetY: rect.height / 2,
      scale: 1,
    };
  }

  /**
   * Fit all objects in view
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fitToView(_padding?: number): void {
    if (this.objects.length === 0) return;

    // This will be implemented with actual bounds calculation
    // For now, just reset camera
    this.resetCamera();
  }

  /**
   * Set callback for after each render
   */
  onRender(callback: () => void): void {
    this.onRenderCallback = callback;
  }

  /**
   * Set callback for hover events
   */
  onHover(callback: (objectId: string | null) => void): void {
    this.onHoverCallback = callback;
  }

  /**
   * Set callback for click events
   */
  onClick(callback: (objectId: string) => void): void {
    this.onClickCallback = callback;
  }

  /**
   * Render a single frame
   */
  render(): void {
    // Clear canvas
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw background
    this.ctx.fillStyle = '#f9fafb';
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw isometric grid (optional floor)
    this.drawIsometricGrid();

    // Sort objects by depth (back to front)
    const sortedObjects = [...this.objects].sort((a, b) => a.depth - b.depth);

    // Render each object
    for (const obj of sortedObjects) {
      this.ctx.save();
      obj.render(this.ctx, this.camera);
      this.ctx.restore();
    }

    // Call render callback
    this.onRenderCallback?.();
  }

  /**
   * Draw isometric grid floor for depth perception
   */
  private drawIsometricGrid(): void {
    const gridSize = 100;
    const gridExtent = 5; // Number of grid lines in each direction
    
    this.ctx.strokeStyle = 'rgba(156, 163, 175, 0.15)'; // Very subtle gray
    this.ctx.lineWidth = 0.5;

    // Draw grid lines in X direction
    for (let i = -gridExtent; i <= gridExtent; i++) {
      const from3D = { x: i * gridSize, y: -gridExtent * gridSize, z: 0 };
      const to3D = { x: i * gridSize, y: gridExtent * gridSize, z: 0 };
      
      const from2D = toIsometric(from3D.x, from3D.y, from3D.z);
      const to2D = toIsometric(to3D.x, to3D.y, to3D.z);
      
      const screenFrom = applyCamera(from2D, this.camera);
      const screenTo = applyCamera(to2D, this.camera);
      
      this.ctx.beginPath();
      this.ctx.moveTo(screenFrom.x, screenFrom.y);
      this.ctx.lineTo(screenTo.x, screenTo.y);
      this.ctx.stroke();
    }

    // Draw grid lines in Y direction
    for (let i = -gridExtent; i <= gridExtent; i++) {
      const from3D = { x: -gridExtent * gridSize, y: i * gridSize, z: 0 };
      const to3D = { x: gridExtent * gridSize, y: i * gridSize, z: 0 };
      
      const from2D = toIsometric(from3D.x, from3D.y, from3D.z);
      const to2D = toIsometric(to3D.x, to3D.y, to3D.z);
      
      const screenFrom = applyCamera(from2D, this.camera);
      const screenTo = applyCamera(to2D, this.camera);
      
      this.ctx.beginPath();
      this.ctx.moveTo(screenFrom.x, screenFrom.y);
      this.ctx.lineTo(screenTo.x, screenTo.y);
      this.ctx.stroke();
    }
  }

  /**
   * Start animation loop
   */
  start(): void {
    if (this.animationFrameId !== null) return;

    const animate = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation loop
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();
    // Remove event listeners would go here if we tracked them
  }

  /**
   * Helper to draw isometric line
   */
  drawIsometricLine(
    from3D: Point3D,
    to3D: Point3D,
    color: string = '#000',
    lineWidth: number = 2,
    dashPattern?: number[]
  ): void {
    const from2D = toIsometric(from3D.x, from3D.y, from3D.z);
    const to2D = toIsometric(to3D.x, to3D.y, to3D.z);

    const screenFrom = applyCamera(from2D, this.camera);
    const screenTo = applyCamera(to2D, this.camera);

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    
    if (dashPattern) {
      this.ctx.setLineDash(dashPattern);
    } else {
      this.ctx.setLineDash([]);
    }

    this.ctx.beginPath();
    this.ctx.moveTo(screenFrom.x, screenFrom.y);
    this.ctx.lineTo(screenTo.x, screenTo.y);
    this.ctx.stroke();
  }

  /**
   * Helper to draw text at isometric position
   */
  drawIsometricText(
    text: string,
    position3D: Point3D,
    options: {
      color?: string;
      font?: string;
      align?: CanvasTextAlign;
      baseline?: CanvasTextBaseline;
    } = {}
  ): void {
    const {
      color = '#000',
      font = '12px sans-serif',
      align = 'center',
      baseline = 'middle',
    } = options;

    const position2D = toIsometric(position3D.x, position3D.y, position3D.z);
    const screenPos = applyCamera(position2D, this.camera);

    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, screenPos.x, screenPos.y);
  }
}
