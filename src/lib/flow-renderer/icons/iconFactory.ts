/**
 * Icon paths from local iconpacks directory
 */
const ICON_PATHS = {
  router: '/iconpacks/isoflow-default/router.svg',
  loadbalancer: '/iconpacks/isoflow-default/loadbalancer.svg',
  pyramid: '/iconpacks/isoflow-default/pyramid.svg',
  switchModule: '/iconpacks/isoflow-default/switch-module.svg',
  cloud: '/iconpacks/isoflow-default/cloud.svg',
  cube: '/iconpacks/isoflow-default/cube.svg',
};

/**
 * Get device icon URL based on model name
 * Maps Peplink device models to appropriate Isoflow icons
 */
export function getDeviceIconUrl(model: string): string {
  const normalizedModel = model.toLowerCase().replace(/\s+/g, '');
  
  // Cube icon - MAX Adapter (check before "ap" check)
  if (normalizedModel.includes('maxadapter')) {
    return ICON_PATHS.cube;
  }
  
  // Load balancer icon - Balance 1350/2500/3000 (check before Balance 30)
  if (
    normalizedModel.includes('balance1350') ||
    normalizedModel.includes('balance2500') ||
    normalizedModel.includes('balance3000')
  ) {
    return ICON_PATHS.loadbalancer;
  }
  
  // Router icon - Balance 20/30/One, 210/305/310, 380/580/710, MAX series
  if (
    normalizedModel.includes('balance20') ||
    normalizedModel.includes('balance30') ||
    normalizedModel.includes('balanceone') ||
    normalizedModel.includes('balance210') ||
    normalizedModel.includes('balance305') ||
    normalizedModel.includes('balance310') ||
    normalizedModel.includes('balance380') ||
    normalizedModel.includes('balance580') ||
    normalizedModel.includes('balance710') ||
    normalizedModel.includes('maxbr1') ||
    normalizedModel.includes('maxhd2') ||
    normalizedModel.includes('maxhd4') ||
    normalizedModel.includes('maxtransit')
  ) {
    return ICON_PATHS.router;
  }
  
  // Pyramid icon - Access Points
  if (
    normalizedModel.includes('apone') ||
    normalizedModel.includes('accesspoint') ||
    normalizedModel.includes('ap')
  ) {
    return ICON_PATHS.pyramid;
  }
  
  // Switch module icon - Switches
  if (
    normalizedModel.includes('switch') ||
    normalizedModel.includes('8poe10g') ||
    normalizedModel.includes('24poe2.5g') ||
    normalizedModel.includes('48poe2.5g')
  ) {
    return ICON_PATHS.switchModule;
  }
  
  // Cloud icon - FusionHub, VirtualBalance
  if (
    normalizedModel.includes('fusionhub') ||
    normalizedModel.includes('virtualbalance')
  ) {
    return ICON_PATHS.cloud;
  }
  
  // Remove Surf SOHO (discontinued) - return no icon
  if (normalizedModel.includes('surf')) {
    return '';
  }
  
  // Default to router icon
  return ICON_PATHS.router;
}
