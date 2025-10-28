import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Coords } from '@/lib/flow-renderer/utils/gridUtils';

export interface DevicePanel {
  deviceId: string;
  position: { x: number; y: number };
  zIndex: number;
}

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
  
  // Selected device for showing details (legacy - kept for backwards compatibility)
  selectedDeviceId: string | null;
  setSelectedDeviceId: (deviceId: string | null) => void;
  
  // Multiple device panels
  openPanels: DevicePanel[];
  openDevicePanel: (deviceId: string) => void;
  closeDevicePanel: (deviceId: string) => void;
  updatePanelPosition: (deviceId: string, position: { x: number; y: number }) => void;
  bringPanelToFront: (deviceId: string) => void;
  
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
    openPanels: [],
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
      // Also manage openPanels for backwards compatibility
      if (deviceId && !state.openPanels.find(p => p.deviceId === deviceId)) {
        // Calculate cascading position
        const lastPanel = state.openPanels[state.openPanels.length - 1];
        const position = lastPanel 
          ? { x: lastPanel.position.x + 20, y: lastPanel.position.y + 20 }
          : { x: 400, y: 100 };
        
        const maxZIndex = Math.max(0, ...state.openPanels.map(p => p.zIndex));
        state.openPanels.push({
          deviceId,
          position,
          zIndex: maxZIndex + 1,
        });
      }
    }),
    
    openDevicePanel: (deviceId) => set((state) => {
      // Check if panel already exists
      const existingPanel = state.openPanels.find(p => p.deviceId === deviceId);
      if (existingPanel) {
        // Bring to front
        const maxZIndex = Math.max(0, ...state.openPanels.map(p => p.zIndex));
        existingPanel.zIndex = maxZIndex + 1;
      } else {
        // Calculate cascading position
        const lastPanel = state.openPanels[state.openPanels.length - 1];
        const position = lastPanel 
          ? { x: lastPanel.position.x + 20, y: lastPanel.position.y + 20 }
          : { x: 400, y: 100 };
        
        const maxZIndex = Math.max(0, ...state.openPanels.map(p => p.zIndex));
        state.openPanels.push({
          deviceId,
          position,
          zIndex: maxZIndex + 1,
        });
      }
      state.selectedDeviceId = deviceId;
    }),
    
    closeDevicePanel: (deviceId) => set((state) => {
      state.openPanels = state.openPanels.filter(p => p.deviceId !== deviceId);
      if (state.selectedDeviceId === deviceId) {
        state.selectedDeviceId = null;
      }
    }),
    
    updatePanelPosition: (deviceId, position) => set((state) => {
      const panel = state.openPanels.find(p => p.deviceId === deviceId);
      if (panel) {
        panel.position = position;
      }
    }),
    
    bringPanelToFront: (deviceId) => set((state) => {
      const panel = state.openPanels.find(p => p.deviceId === deviceId);
      if (panel) {
        const maxZIndex = Math.max(0, ...state.openPanels.map(p => p.zIndex));
        panel.zIndex = maxZIndex + 1;
      }
    }),
    
    setRendererSize: (size) => set((state) => {
      state.rendererSize = size;
    }),
  }))
);
