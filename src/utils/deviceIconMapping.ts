import { deviceSpecifications } from '../data/deviceSpecifications';

/**
 * Get device icon URL based on model name
 * Uses deviceSpecifications data to map models to icons
 */
export const getDeviceIconUrl = (model: string): string => {
  const spec = deviceSpecifications.find(
    (s) => s.model.toLowerCase() === model.toLowerCase()
  );
  
  if (!spec) {
    return '/iconpacks/isoflow-default/cube.svg';
  }

  return `/iconpacks/isoflow-default/${spec.icon}.svg`;
};
