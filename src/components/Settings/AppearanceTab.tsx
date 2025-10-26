import { useState } from 'react';
import { Upload, Palette, Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function AppearanceTab() {
  const { appearanceSettings, setAppearanceSettings } = useAppStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreviewImage(base64);
        setAppearanceSettings({
          ...appearanceSettings,
          sidebarBackground: base64,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Theme Mode Selection */}
      <div className="liquid-glass-card">
        <h3 className="text-sm font-medium mb-3" style={{ color: '#e0e0e0' }}>
          <Palette className="w-4 h-4 inline mr-2" />
          Theme Mode
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'light' })}
            className={`liquid-glass-card p-3 text-center ${
              appearanceSettings.theme === 'light' ? 'selected-group' : ''
            }`}
          >
            <Sun className="w-5 h-5 mx-auto mb-1" style={{ color: '#fbbf24' }} />
            <span className="text-xs" style={{ color: '#e0e0e0' }}>Light</span>
          </button>
          <button
            onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'dark' })}
            className={`liquid-glass-card p-3 text-center ${
              appearanceSettings.theme === 'dark' ? 'selected-group' : ''
            }`}
          >
            <Moon className="w-5 h-5 mx-auto mb-1" style={{ color: '#3b82f6' }} />
            <span className="text-xs" style={{ color: '#e0e0e0' }}>Dark</span>
          </button>
          <button
            onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: 'custom' })}
            className={`liquid-glass-card p-3 text-center ${
              appearanceSettings.theme === 'custom' ? 'selected-group' : ''
            }`}
          >
            <Palette className="w-5 h-5 mx-auto mb-1" style={{ color: '#8b5cf6' }} />
            <span className="text-xs" style={{ color: '#e0e0e0' }}>Custom</span>
          </button>
        </div>
      </div>

      {/* Color Scheme Preview (Quick Guide Colors) */}
      <div className="liquid-glass-card">
        <h3 className="text-sm font-medium mb-3" style={{ color: '#e0e0e0' }}>
          Color Scheme Preview
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#10b981' }} />
            <span className="text-xs" style={{ color: '#6ee7b7' }}>Primary</span>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
            <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#3b82f6' }} />
            <span className="text-xs" style={{ color: '#93c5fd' }}>Secondary</span>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)' }}>
            <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#8b5cf6' }} />
            <span className="text-xs" style={{ color: '#c4b5fd' }}>Accent</span>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(249, 115, 22, 0.2)', border: '1px solid rgba(249, 115, 22, 0.4)' }}>
            <div className="w-3 h-3 rounded-full mb-1" style={{ background: '#f97316' }} />
            <span className="text-xs" style={{ color: '#fdba74' }}>Warning</span>
          </div>
        </div>
      </div>

      {/* Sidebar Background Upload */}
      <div className="liquid-glass-card">
        <h3 className="text-sm font-medium mb-3" style={{ color: '#e0e0e0' }}>
          <Upload className="w-4 h-4 inline mr-2" />
          Sidebar Background
        </h3>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="bg-upload"
          />
          <label
            htmlFor="bg-upload"
            className="liquid-glass-card p-4 text-center cursor-pointer hover:bg-opacity-30 transition-all block"
          >
            <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: '#3b82f6' }} />
            <span className="text-sm" style={{ color: '#e0e0e0' }}>Click to upload image</span>
            <span className="text-xs block mt-1" style={{ color: '#a0a0a0' }}>
              Recommended: 1080x1920px
            </span>
          </label>
          {previewImage && (
            <div className="relative rounded-lg overflow-hidden h-32">
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => {
                  setPreviewImage(null);
                  setAppearanceSettings({ ...appearanceSettings, sidebarBackground: undefined });
                }}
                className="absolute top-2 right-2 liquid-glass-card px-2 py-1 text-xs"
                style={{ color: '#ef4444' }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Glass Effect Settings */}
      <div className="liquid-glass-card">
        <h3 className="text-sm font-medium mb-3" style={{ color: '#e0e0e0' }}>
          Glass Effect
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs" style={{ color: '#a0a0a0' }}>Blur: 8-15px</label>
            <input type="range" min="8" max="15" defaultValue="12" className="w-full" />
          </div>
          <div>
            <label className="text-xs" style={{ color: '#a0a0a0' }}>Transparency: 5-15%</label>
            <input type="range" min="5" max="15" defaultValue="10" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
