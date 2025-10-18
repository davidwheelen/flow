import { DeviceIcon, DeviceIconOptions } from './DeviceIcon';
import {
  Balance20XIcon,
  Balance310XIcon,
  Balance380Icon,
  Balance2500Icon,
  MAXTransitIcon,
} from './peplink';

/**
 * Factory function to create device icons based on model name
 */
export function createDeviceIcon(model: string, options: DeviceIconOptions = {}): DeviceIcon {
  const normalizedModel = model.toLowerCase().replace(/\s+/g, '');
  
  if (normalizedModel.includes('balance20x') || normalizedModel.includes('20x')) {
    return new Balance20XIcon(options);
  }
  
  if (normalizedModel.includes('balance310x') || normalizedModel.includes('310x')) {
    return new Balance310XIcon(options);
  }
  
  if (normalizedModel.includes('balance380') || normalizedModel.includes('380')) {
    return new Balance380Icon(options);
  }
  
  if (normalizedModel.includes('balance2500') || normalizedModel.includes('2500')) {
    return new Balance2500Icon(options);
  }
  
  if (normalizedModel.includes('maxtransit') || normalizedModel.includes('max') && normalizedModel.includes('transit')) {
    return new MAXTransitIcon(options);
  }
  
  // Default to Balance 380 if model not recognized
  return new Balance380Icon(options);
}
