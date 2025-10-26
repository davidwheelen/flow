export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  glassEffect: {
    blur: number;
    transparency: number;
    borderColor: string;
  };
  customBackground?: string; // Base64 or URL
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'custom';
  customTheme?: Theme;
  sidebarBackground?: string;
}
