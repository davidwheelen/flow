import { InControlGroup } from '@/services/incontrolApi';
import { getMockDevices } from './mockData';

/**
 * Mock groups for development/testing when API is not available
 */
export function getMockGroups(): InControlGroup[] {
  return [
    {
      id: 'group-1',
      name: 'Headquarters',
      description: 'Main office network',
      device_count: 5,
    },
    {
      id: 'group-2',
      name: 'Branch Offices',
      description: 'Regional branch locations',
      device_count: 3,
    },
    {
      id: 'group-3',
      name: 'Mobile Units',
      description: 'Vehicle-mounted routers',
      device_count: 2,
    },
  ];
}

/**
 * Get mock devices for a specific group
 */
export function getMockDevicesByGroup(groupId: string) {
  const allDevices = getMockDevices();
  
  switch (groupId) {
    case 'group-1':
      // Headquarters - all devices
      return allDevices;
    
    case 'group-2':
      // Branch offices - first 3 devices
      return allDevices.slice(0, 3);
    
    case 'group-3':
      // Mobile units - last 2 devices
      return allDevices.slice(3, 5);
    
    default:
      return [];
  }
}
