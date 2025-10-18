import { DeviceIcon, DeviceIconOptions } from './DeviceIcon';
import {
  Balance20XIcon,
  Balance30LTEIcon,
  Balance210Icon,
  Balance305Icon,
  Balance3055GIcon,
  Balance310XIcon,
  Balance380Icon,
  Balance580Icon,
  Balance710Icon,
  Balance1350Icon,
  Balance2500Icon,
  MAXTransitIcon,
  MAXBR1MiniIcon,
  MAXBR1Pro5GIcon,
  MAXBR1IP55Icon,
  MAXHD2Icon,
  MAXHD4Icon,
  MAXAdapterIcon,
  APOneACMiniIcon,
  APOneRuggedIcon,
  APOneEnterpriseIcon,
  SwitchLite8Icon,
  SwitchEnterprise24Icon,
  FusionHubIcon,
  FusionHubSoloIcon,
} from './peplink';

/**
 * Factory function to create device icons based on model name
 */
export function createDeviceIcon(model: string, options: DeviceIconOptions = {}): DeviceIcon {
  const normalizedModel = model.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  
  // Balance Series
  if (normalizedModel.includes('balance30lte') || normalizedModel.includes('30lte')) {
    return new Balance30LTEIcon(options);
  }
  if (normalizedModel.includes('balance20x') || normalizedModel.includes('20x')) {
    return new Balance20XIcon(options);
  }
  if (normalizedModel.includes('balance210')) {
    return new Balance210Icon(options);
  }
  if (normalizedModel.includes('balance3055g') || normalizedModel.includes('3055g')) {
    return new Balance3055GIcon(options);
  }
  if (normalizedModel.includes('balance305')) {
    return new Balance305Icon(options);
  }
  if (normalizedModel.includes('balance310x') || normalizedModel.includes('310x')) {
    return new Balance310XIcon(options);
  }
  if (normalizedModel.includes('balance380') || normalizedModel.includes('380')) {
    return new Balance380Icon(options);
  }
  if (normalizedModel.includes('balance580')) {
    return new Balance580Icon(options);
  }
  if (normalizedModel.includes('balance710')) {
    return new Balance710Icon(options);
  }
  if (normalizedModel.includes('balance1350') || normalizedModel.includes('1350')) {
    return new Balance1350Icon(options);
  }
  if (normalizedModel.includes('balance2500') || normalizedModel.includes('2500')) {
    return new Balance2500Icon(options);
  }
  
  // MAX Series
  if (normalizedModel.includes('maxbr1mini') || (normalizedModel.includes('max') && normalizedModel.includes('br1') && normalizedModel.includes('mini'))) {
    return new MAXBR1MiniIcon(options);
  }
  if (normalizedModel.includes('maxbr1pro5g') || (normalizedModel.includes('max') && normalizedModel.includes('br1') && normalizedModel.includes('pro') && normalizedModel.includes('5g'))) {
    return new MAXBR1Pro5GIcon(options);
  }
  if (normalizedModel.includes('maxbr1ip55') || (normalizedModel.includes('max') && normalizedModel.includes('br1') && normalizedModel.includes('ip55'))) {
    return new MAXBR1IP55Icon(options);
  }
  if (normalizedModel.includes('maxhd2') || (normalizedModel.includes('max') && normalizedModel.includes('hd2'))) {
    return new MAXHD2Icon(options);
  }
  if (normalizedModel.includes('maxhd4') || (normalizedModel.includes('max') && normalizedModel.includes('hd4'))) {
    return new MAXHD4Icon(options);
  }
  if (normalizedModel.includes('maxadapter') || (normalizedModel.includes('max') && normalizedModel.includes('adapter'))) {
    return new MAXAdapterIcon(options);
  }
  if (normalizedModel.includes('maxtransit') || (normalizedModel.includes('max') && normalizedModel.includes('transit'))) {
    return new MAXTransitIcon(options);
  }
  
  // Access Points
  if (normalizedModel.includes('aponeacmini') || (normalizedModel.includes('ap') && normalizedModel.includes('one') && normalizedModel.includes('ac') && normalizedModel.includes('mini'))) {
    return new APOneACMiniIcon(options);
  }
  if (normalizedModel.includes('aponerugged') || (normalizedModel.includes('ap') && normalizedModel.includes('one') && normalizedModel.includes('rugged'))) {
    return new APOneRuggedIcon(options);
  }
  if (normalizedModel.includes('aponeenterprise') || (normalizedModel.includes('ap') && normalizedModel.includes('one') && normalizedModel.includes('enterprise'))) {
    return new APOneEnterpriseIcon(options);
  }
  
  // Switches
  if (normalizedModel.includes('switchlite8') || (normalizedModel.includes('switch') && normalizedModel.includes('lite') && normalizedModel.includes('8'))) {
    return new SwitchLite8Icon(options);
  }
  if (normalizedModel.includes('switchenterprise24') || (normalizedModel.includes('switch') && normalizedModel.includes('enterprise') && normalizedModel.includes('24'))) {
    return new SwitchEnterprise24Icon(options);
  }
  
  // FusionHub
  if (normalizedModel.includes('fusionhubsolo') || (normalizedModel.includes('fusionhub') && normalizedModel.includes('solo'))) {
    return new FusionHubSoloIcon(options);
  }
  if (normalizedModel.includes('fusionhub')) {
    return new FusionHubIcon(options);
  }
  
  // Default to Balance 380 if model not recognized
  return new Balance380Icon(options);
}
