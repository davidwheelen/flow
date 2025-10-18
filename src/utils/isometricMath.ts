/**
 * Isometric Math Utilities
 * Provides coordinate transformation for isometric 3D projection
 */

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Standard isometric projection angles
 * X and Y axes are at 30 degrees from horizontal
 */
const ISO_ANGLE = Math.PI / 6; // 30 degrees
const COS_ISO = Math.cos(ISO_ANGLE);
const SIN_ISO = Math.sin(ISO_ANGLE);

/**
 * Convert 3D coordinates to 2D isometric screen coordinates
 * Uses standard isometric projection (30° angles)
 * 
 * @param x - X coordinate in 3D space
 * @param y - Y coordinate in 3D space (depth)
 * @param z - Z coordinate in 3D space (height)
 * @returns 2D screen coordinates
 */
export function toIsometric(x: number, y: number, z: number): Point2D {
  // Standard isometric projection formulas
  // screenX = (x - y) * cos(30°)
  // screenY = (x + y) * sin(30°) - z
  return {
    x: (x - y) * COS_ISO,
    y: (x + y) * SIN_ISO - z,
  };
}

/**
 * Convert 2D screen coordinates back to 3D coordinates (z = 0 plane)
 * Used for mouse interaction and hit detection
 * 
 * @param screenX - X coordinate on screen
 * @param screenY - Y coordinate on screen
 * @param z - Z coordinate (height) - defaults to 0
 * @returns 3D coordinates
 */
export function fromIsometric(screenX: number, screenY: number, z: number = 0): Point3D {
  // Inverse isometric projection
  // Solve for x and y given screenX and screenY
  const adjustedY = screenY + z;
  
  const x = (screenX / COS_ISO + adjustedY / SIN_ISO) / 2;
  const y = (adjustedY / SIN_ISO - screenX / COS_ISO) / 2;
  
  return { x, y, z };
}

/**
 * Calculate distance between two 3D points
 * Used for depth sorting
 */
export function distance3D(p1: Point3D, p2: Point3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate depth value for sorting (back to front rendering)
 * Objects with lower depth values are rendered first (in back)
 * 
 * @param point - 3D point
 * @returns Depth value for sorting
 */
export function calculateDepth(point: Point3D): number {
  // For isometric view, depth is sum of x, y, and z
  // Objects further back (lower x+y+z) should render first
  return point.x + point.y + point.z;
}

/**
 * Transform a 2D point by applying camera transform
 * (pan and zoom)
 */
export interface CameraTransform {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export function applyCamera(point: Point2D, camera: CameraTransform): Point2D {
  return {
    x: point.x * camera.scale + camera.offsetX,
    y: point.y * camera.scale + camera.offsetY,
  };
}

/**
 * Inverse camera transform - convert screen coordinates to world coordinates
 */
export function unapplyCamera(point: Point2D, camera: CameraTransform): Point2D {
  return {
    x: (point.x - camera.offsetX) / camera.scale,
    y: (point.y - camera.offsetY) / camera.scale,
  };
}

/**
 * Check if a point is inside an isometric box
 * Used for hit detection
 */
export function isPointInIsometricBox(
  point: Point2D,
  boxCenter: Point3D,
  boxSize: { width: number; height: number; depth: number },
  camera: CameraTransform
): boolean {
  // Transform box corners to screen space
  const halfW = boxSize.width / 2;
  const halfH = boxSize.height / 2;
  const halfD = boxSize.depth / 2;
  
  // Get the 8 corners of the box
  const corners = [
    { x: boxCenter.x - halfW, y: boxCenter.y - halfH, z: boxCenter.z },
    { x: boxCenter.x + halfW, y: boxCenter.y - halfH, z: boxCenter.z },
    { x: boxCenter.x + halfW, y: boxCenter.y + halfH, z: boxCenter.z },
    { x: boxCenter.x - halfW, y: boxCenter.y + halfH, z: boxCenter.z },
    { x: boxCenter.x - halfW, y: boxCenter.y - halfH, z: boxCenter.z + halfD },
    { x: boxCenter.x + halfW, y: boxCenter.y - halfH, z: boxCenter.z + halfD },
    { x: boxCenter.x + halfW, y: boxCenter.y + halfH, z: boxCenter.z + halfD },
    { x: boxCenter.x - halfW, y: boxCenter.y + halfH, z: boxCenter.z + halfD },
  ];
  
  // Convert to screen coordinates
  const screenCorners = corners.map(c => {
    const iso = toIsometric(c.x, c.y, c.z);
    return applyCamera(iso, camera);
  });
  
  // Simple bounding box check
  const minX = Math.min(...screenCorners.map(c => c.x));
  const maxX = Math.max(...screenCorners.map(c => c.x));
  const minY = Math.min(...screenCorners.map(c => c.y));
  const maxY = Math.max(...screenCorners.map(c => c.y));
  
  return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
}
