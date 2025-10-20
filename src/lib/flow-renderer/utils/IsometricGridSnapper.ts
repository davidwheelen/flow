/**
 * Isometric Grid Snapper - Snaps coordinates to diamond centers
 * 
 * The isometric grid has diagonal lines at 30° forming diamond/rhombus shapes.
 * Devices snap to the CENTER point inside each diamond, not to line intersections.
 */
export class IsometricGridSnapper {
  private gridSpacing: number = 50; // Same as grid line spacing
  private angle: number = 30; // Isometric angle in degrees

  constructor(gridSpacing: number = 50) {
    this.gridSpacing = gridSpacing;
  }

  /**
   * Get the center point of the nearest isometric diamond
   * @param x Mouse/drop X coordinate
   * @param y Mouse/drop Y coordinate
   * @returns Snap point at diamond center
   */
  public getSnapPoint(x: number, y: number): { x: number; y: number } {
    const angleRad = (this.angle * Math.PI) / 180;
    const tan30 = Math.tan(angleRad);

    // Isometric grid uses two diagonal line sets
    // Diamond centers are at the midpoints between line intersections

    // Convert screen coordinates to isometric grid coordinates
    // The diamond grid is formed by lines at +30° and -30°
    const isoX = (x + y * tan30) / (2 * this.gridSpacing);
    const isoY = (x - y * tan30) / (2 * this.gridSpacing);

    // Snap to nearest integer grid position (diamond center)
    const snapIsoX = Math.round(isoX);
    const snapIsoY = Math.round(isoY);

    // Convert back to screen coordinates
    const snapX = (snapIsoX + snapIsoY) * this.gridSpacing;
    const snapY = ((snapIsoX - snapIsoY) * this.gridSpacing) / tan30;

    return { x: snapX, y: snapY };
  }

  /**
   * Update grid spacing when zoom changes
   */
  public setGridSpacing(spacing: number): void {
    this.gridSpacing = spacing;
  }

  /**
   * Get current grid spacing
   */
  public getGridSpacing(): number {
    return this.gridSpacing;
  }
}
