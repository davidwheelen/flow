import { IsometricCanvas } from '@/lib/flow-renderer';

/**
 * Demo page for testing the IsometricCanvas with infinite grid rendering.
 * This page can be used to manually test:
 * - Infinite grid in all directions
 * - Pan functionality (click and drag)
 * - Zoom functionality (mouse wheel)
 * - Grid line rendering at different zoom levels
 */
export function IsometricGridDemo() {
  return (
    <div className="w-screen h-screen bg-gray-900">
      <div className="absolute top-4 left-4 z-10 p-4 bg-black/50 backdrop-blur-sm rounded-lg text-white">
        <h1 className="text-xl font-bold mb-2">Isometric Grid Demo</h1>
        <div className="text-sm space-y-1">
          <p>🖱️ <strong>Drag</strong> to pan</p>
          <p>🔍 <strong>Scroll</strong> to zoom</p>
          <p className="mt-2 text-gray-400">Grid should be infinite in all directions</p>
        </div>
      </div>
      <IsometricCanvas 
        devices={[]} 
        className="w-full h-full"
      />
    </div>
  );
}
