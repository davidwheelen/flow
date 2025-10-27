import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Coords } from '@/lib/flow-renderer/utils/gridUtils';

interface CanvasState {
  // Zoom level (0.2 to 1.0)
  zoom: number;
  setZoom: (zoom: number) => void;
  
  // Scroll/pan position
  scroll: { position: Coords };
  setScroll: (scroll: { position: Coords }) => void;
  
  // Panning state
  isPanning: boolean;
  setIsPanning: (isPanning: boolean) => void;
  
  // Selected device for showing details
  selectedDeviceId: string | null;
  setSelectedDeviceId: (deviceId: string | null) => void;
  
  // Canvas/renderer size
  rendererSize: { width: number; height: number };
  setRendererSize: (size: { width: number; height: number }) => void;
}

export const useCanvasStore = create<CanvasState>()(
  immer((set) => ({
    // Initial state
    zoom: 1,
    scroll: { position: { x: 0, y: 0 } },
    isPanning: false,
    selectedDeviceId: null,
    rendererSize: { width: 800, height: 600 },
    
    // Actions
    setZoom: (zoom) => set((state) => {
      state.zoom = zoom;
    }),
    
    setScroll: (scroll) => set((state) => {
      state.scroll = scroll;
    }),
    
    setIsPanning: (isPanning) => set((state) => {
      state.isPanning = isPanning;
    }),
    
    setSelectedDeviceId: (deviceId) => set((state) => {
      state.selectedDeviceId = deviceId;
    }),
    
    setRendererSize: (size) => set((state) => {
      state.rendererSize = size;
    }),
  }))
);
