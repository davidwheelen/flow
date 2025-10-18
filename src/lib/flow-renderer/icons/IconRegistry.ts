import { DeviceIcon } from './DeviceIcon';
import {
  Balance20XIcon,
  Balance30LTEIcon,
  Balance210Icon,
  Balance305Icon,
  Balance310XIcon,
  Balance380Icon,
  Balance710Icon,
  Balance2500Icon,
  MAXTransitIcon,
  MAXBR1MiniIcon,
} from './peplink';

/**
 * Registry for all device icons
 * Provides access to all available device icons and their metadata
 */
export class IconRegistry {
  private static icons: Map<string, typeof DeviceIcon> = new Map([
    // Balance Series
    ['balance-20x', Balance20XIcon],
    ['balance-30-lte', Balance30LTEIcon],
    ['balance-210', Balance210Icon],
    ['balance-305', Balance305Icon],
    ['balance-310x', Balance310XIcon],
    ['balance-380', Balance380Icon],
    ['balance-710', Balance710Icon],
    ['balance-2500', Balance2500Icon],
    
    // MAX Series
    ['max-transit', MAXTransitIcon],
    ['max-br1-mini', MAXBR1MiniIcon],
  ]);

  /**
   * Get all registered icon classes
   */
  public static getAllIcons(): Array<{ key: string; iconClass: typeof DeviceIcon }> {
    return Array.from(this.icons.entries()).map(([key, iconClass]) => ({
      key,
      iconClass,
    }));
  }

  /**
   * Get an icon class by model name
   */
  public static getIcon(modelName: string): typeof DeviceIcon | undefined {
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
  public static getIconsBySeries(): Map<string, Array<{ key: string; iconClass: typeof DeviceIcon }>> {
    const grouped = new Map<string, Array<{ key: string; iconClass: typeof DeviceIcon }>>();
    
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
