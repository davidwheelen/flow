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

export type DeviceIconClass = new (options?: DeviceIconOptions) => DeviceIcon;

/**
 * Registry for all device icons
 * Provides access to all available device icons and their metadata
 */
export class IconRegistry {
  private static icons: Map<string, DeviceIconClass> = new Map();

  static {
    // Balance Series
    this.icons.set('balance-20x', Balance20XIcon);
    this.icons.set('balance-30-lte', Balance30LTEIcon);
    this.icons.set('balance-210', Balance210Icon);
    this.icons.set('balance-305', Balance305Icon);
    this.icons.set('balance-305-5g', Balance3055GIcon);
    this.icons.set('balance-310x', Balance310XIcon);
    this.icons.set('balance-380', Balance380Icon);
    this.icons.set('balance-710', Balance710Icon);
    this.icons.set('balance-1350', Balance1350Icon);
    this.icons.set('balance-2500', Balance2500Icon);
    
    // MAX Series
    this.icons.set('max-transit', MAXTransitIcon);
    this.icons.set('max-br1-mini', MAXBR1MiniIcon);
    this.icons.set('max-br1-pro-5g', MAXBR1Pro5GIcon);
  }

  /**
   * Get all registered icon classes
   */
  public static getAllIcons(): Array<{ key: string; iconClass: DeviceIconClass }> {
    return Array.from(this.icons.entries()).map(([key, iconClass]) => ({
      key,
      iconClass,
    }));
  }

  /**
   * Get an icon class by model name
   */
  public static getIcon(modelName: string): DeviceIconClass | undefined {
    return this.icons.get(modelName);
  }

  /**
   * Check if an icon is registered
   */
  public static hasIcon(modelName: string): boolean {
    return this.icons.has(modelName);
  }

  /**
   * Get all icon names
   */
  public static getIconNames(): string[] {
    return Array.from(this.icons.keys());
  }

  /**
   * Get icons grouped by series
   */
  public static getIconsBySeries(): Map<string, Array<{ key: string; iconClass: DeviceIconClass }>> {
    const grouped = new Map<string, Array<{ key: string; iconClass: DeviceIconClass }>>();
    
    this.getAllIcons().forEach(({ key, iconClass }) => {
      // Create temporary instance to get series
      const instance = new iconClass();
      const series = instance.getSeries();
      instance.remove();
      
      if (!grouped.has(series)) {
        grouped.set(series, []);
      }
      grouped.get(series)!.push({ key, iconClass });
    });
    
    return grouped;
  }
}
