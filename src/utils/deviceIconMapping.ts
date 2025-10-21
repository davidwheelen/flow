import { deviceSpecifications } from '../data/deviceSpecifications';

/**
 * Get device icon URL based on model name
 * Uses deviceSpecifications data to map models to icons
 */
export const getDeviceIconUrl = (model: string): string => {
  // Normalize model name by removing "Peplink " prefix if present
  const normalizedModel = model.replace(/^Peplink\s+/i, '').trim();
  
  const spec = deviceSpecifications.find(
    (s) => s.model.toLowerCase() === normalizedModel.toLowerCase()
  );
  
  if (!spec) {
    return '/iconpacks/isoflow-default/cube.svg';
  }

  return `/iconpacks/isoflow-default/${spec.icon}.svg`;
};
