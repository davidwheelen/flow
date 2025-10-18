import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { PeplinkDevice } from '@/types/network.types';
import { InControlGroup } from '@/services/incontrolApi';

interface AppState {
  // Selected group
  selectedGroup: InControlGroup | null;
  setSelectedGroup: (group: InControlGroup | null) => void;
  
  // Groups list
  groups: InControlGroup[];
  setGroups: (groups: InControlGroup[]) => void;
  
  // Devices for selected group
  devices: PeplinkDevice[];
  setDevices: (devices: PeplinkDevice[]) => void;
  updateDevice: (deviceId: string, device: PeplinkDevice) => void;
  
  // Loading states
  isLoadingGroups: boolean;
  setIsLoadingGroups: (loading: boolean) => void;
  
  isLoadingDevices: boolean;
  setIsLoadingDevices: (loading: boolean) => void;
  
  // Errors
  error: string | null;
  setError: (error: string | null) => void;
  
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  immer((set) => ({
    // Initial state
    selectedGroup: null,
    groups: [],
    devices: [],
    isLoadingGroups: false,
    isLoadingDevices: false,
    error: null,
    isSidebarOpen: true,
    
    // Actions
    setSelectedGroup: (group) => set((state) => {
      state.selectedGroup = group;
    }),
    
    setGroups: (groups) => set((state) => {
      state.groups = groups;
    }),
    
    setDevices: (devices) => set((state) => {
      state.devices = devices;
    }),
    
    updateDevice: (deviceId, device) => set((state) => {
      const index = state.devices.findIndex(d => d.id === deviceId);
      if (index !== -1) {
        state.devices[index] = device;
      }
    }),
    
    setIsLoadingGroups: (loading) => set((state) => {
      state.isLoadingGroups = loading;
    }),
    
    setIsLoadingDevices: (loading) => set((state) => {
      state.isLoadingDevices = loading;
    }),
    
    setError: (error) => set((state) => {
      state.error = error;
    }),
    
    toggleSidebar: () => set((state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }),
  }))
);
