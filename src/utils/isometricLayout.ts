/**
 * Isometric Layout Algorithm
 * Positions devices in 3D space for optimal isometric visualization
 */

import { PeplinkDevice } from '@/types/network.types';
import { Point3D, calculateDepth } from './isometricMath';

export interface IsometricDevicePosition extends Point3D {
  deviceId: string;
  depth: number; // For sorting
}

export interface LayoutOptions {
  gridSpacing?: number; // Distance between devices
  centerDevice?: boolean; // Place first device at center
  radialLayout?: boolean; // Arrange in circular pattern
  zOffset?: number; // Base height for devices
}

/**
 * Calculate 3D positions for devices in isometric space
 * Uses a radial layout with the first device (hub) at center
 */
export function calculateIsometricLayout(
  devices: PeplinkDevice[],
  options: LayoutOptions = {}
): IsometricDevicePosition[] {
  const {
    gridSpacing = 200,
    centerDevice = true,
    radialLayout = true,
    zOffset = 0,
  } = options;

  if (devices.length === 0) return [];

  // First device is the hub/center
  const positions: IsometricDevicePosition[] = [];

  if (radialLayout && devices.length > 1) {
    // Hub at center
    const hubPosition: IsometricDevicePosition = {
      deviceId: devices[0].id,
      x: 0,
      y: 0,
      z: zOffset,
      depth: calculateDepth({ x: 0, y: 0, z: zOffset }),
    };
    positions.push(hubPosition);

    // Arrange other devices in a circle around the hub
    const numDevices = devices.length - 1;
    const angleStep = (2 * Math.PI) / numDevices;

    for (let i = 1; i < devices.length; i++) {
      const angle = angleStep * (i - 1);
      const x = Math.cos(angle) * gridSpacing;
      const y = Math.sin(angle) * gridSpacing;
      
      const position: IsometricDevicePosition = {
        deviceId: devices[i].id,
        x,
        y,
        z: zOffset,
        depth: calculateDepth({ x, y, z: zOffset }),
      };
      positions.push(position);
    }
  } else {
    // Grid layout as fallback
    const devicesPerRow = Math.ceil(Math.sqrt(devices.length));

    devices.forEach((device, index) => {
      const row = Math.floor(index / devicesPerRow);
      const col = index % devicesPerRow;

      // Center the grid
      const offsetX = centerDevice ? -((devicesPerRow - 1) * gridSpacing) / 2 : 0;
      const offsetY = centerDevice ? -((Math.ceil(devices.length / devicesPerRow) - 1) * gridSpacing) / 2 : 0;

      const x = col * gridSpacing + offsetX;
      const y = row * gridSpacing + offsetY;

      const position: IsometricDevicePosition = {
        deviceId: device.id,
        x,
        y,
        z: zOffset,
        depth: calculateDepth({ x, y, z: zOffset }),
      };
      positions.push(position);
    });
  }

  return positions;
}

/**
 * Sort objects by depth for proper rendering order (back to front)
 */
export function sortByDepth<T extends { depth: number }>(objects: T[]): T[] {
  return [...objects].sort((a, b) => a.depth - b.depth);
}

/**
 * Get device position by ID
 */
export function getDevicePosition(
  positions: IsometricDevicePosition[],
  deviceId: string
): IsometricDevicePosition | undefined {
  return positions.find(p => p.deviceId === deviceId);
}

/**
 * Calculate bounding box of all positions
 * Useful for fitting view
 */
export function calculateBounds(positions: IsometricDevicePosition[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
} {
  if (positions.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
  }

  return {
    minX: Math.min(...positions.map(p => p.x)),
    maxX: Math.max(...positions.map(p => p.x)),
    minY: Math.min(...positions.map(p => p.y)),
    maxY: Math.max(...positions.map(p => p.y)),
    minZ: Math.min(...positions.map(p => p.z)),
    maxZ: Math.max(...positions.map(p => p.z)),
  };
}
