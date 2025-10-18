import { DeviceIcon, DeviceIconOptions } from './DeviceIcon';
import {
  Balance20XIcon,
  Balance30LTEIcon,
  Balance210Icon,
  Balance305Icon,
  Balance3055GIcon,
  Balance310XIcon,
  Balance380Icon,
  Balance710Icon,
  Balance1350Icon,
  Balance2500Icon,
  MAXTransitIcon,
  MAXBR1MiniIcon,
  MAXBR1Pro5GIcon,
} from './peplink';

/**
 * Factory function to create device icons based on model name
 */
export function createDeviceIcon(model: string, options: DeviceIconOptions = {}): DeviceIcon {
  const normalizedModel = model.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  
  // Balance Series
  if (normalizedModel.includes('balance20x') || normalizedModel.includes('20x')) {
    return new Balance20XIcon(options);
  }
  
  if (normalizedModel.includes('balance30lte') || normalizedModel.includes('30lte')) {
    return new Balance30LTEIcon(options);
  }
  
  if (normalizedModel.includes('balance210') || normalizedModel.includes('210')) {
    return new Balance210Icon(options);
  }
  
  if (normalizedModel.includes('balance3055g') || normalizedModel.includes('3055g')) {
    return new Balance3055GIcon(options);
  }
  
  if (normalizedModel.includes('balance305') || normalizedModel.includes('305')) {
    return new Balance305Icon(options);
  }
  
  if (normalizedModel.includes('balance310x') || normalizedModel.includes('310x')) {
    return new Balance310XIcon(options);
  }
  
  if (normalizedModel.includes('balance380') || normalizedModel.includes('380')) {
    return new Balance380Icon(options);
  }
  
  if (normalizedModel.includes('balance710') || normalizedModel.includes('710')) {
    return new Balance710Icon(options);
  }
  
  if (normalizedModel.includes('balance1350') || normalizedModel.includes('1350')) {
    return new Balance1350Icon(options);
  }
  
  if (normalizedModel.includes('balance2500') || normalizedModel.includes('2500')) {
    return new Balance2500Icon(options);
  }
  
  // MAX Series
  if (normalizedModel.includes('maxbr1pro5g') || normalizedModel.includes('br1pro5g')) {
    return new MAXBR1Pro5GIcon(options);
  }
  
  if (normalizedModel.includes('maxbr1mini') || normalizedModel.includes('br1mini')) {
    return new MAXBR1MiniIcon(options);
  }
  
  if (normalizedModel.includes('maxtransit') || (normalizedModel.includes('max') && normalizedModel.includes('transit'))) {
    return new MAXTransitIcon(options);
  }
  
  // Default to Balance 380 if model not recognized
  return new Balance380Icon(options);
}
