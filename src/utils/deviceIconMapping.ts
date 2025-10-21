import { deviceSpecifications } from '@/data/deviceSpecifications';

/**
 * Get the icon URL for a device model
 * Icons are stored in /iconpacks/isoflow-default/
 * DO NOT modify the icon directory - it is protected
 */
export const getDeviceIconUrl = (model: string): string => {
  const spec = deviceSpecifications.find(
    (s) => s.model.toLowerCase() === model.toLowerCase()
  );
  
  if (!spec) {
    // Default to cube for unknown models
    return '/iconpacks/isoflow-default/cube.svg';
  }

  // Remove .svg extension if present (for backwards compatibility)
  const iconName = spec.icon.replace('.svg', '');
  
  // Return the correct path to the icon in the protected directory
  return `/iconpacks/isoflow-default/${iconName}.svg`;
};

export const getDeviceConnections = (model: string) => {
  const spec = deviceSpecifications.find(
    (s) => s.model.toLowerCase() === model.toLowerCase()
  );
  return spec?.connectionSpec || null;
};

export const getAllDeviceModels = (): string[] => {
  return deviceSpecifications.map((spec) => spec.model);
};
