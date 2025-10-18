# Peplink Device Icon Library

3D isometric icons for Peplink network devices.

## Organization

The icon library is organized by device series:

- `balance/` - Balance series routers (enterprise and branch routers)
- `max/` - MAX series mobile routers (vehicle and mobile connectivity)
- `ap/` - Access points (wireless access points)
- `switches/` - Network switches (managed and unmanaged)
- `fusionhub/` - FusionHub SD-WAN concentrators (virtual and physical)

## Available Icons

### Balance Series
- **balance-20x** - Small router for remote sites (2 WAN, cellular)
- **balance-30-lte** - Entry-level SD-WAN router with built-in LTE
- **balance-210** - Compact SD-WAN branch router (3 WAN, 4 LAN, WiFi)
- **balance-305** - Multi-WAN router with dual cellular modems
- **balance-310x** - Branch office router (3 WAN, WiFi, cellular)
- **balance-380** - HQ router (5 WAN, dual cellular, WiFi)
- **balance-710** - High-performance rack mount (7 WAN, 2 SFP, dual cellular)
- **balance-2500** - Data center rack mount (8 WAN, 4 SFP, 1U)

### MAX Series
- **max-transit** - Mobile router with 4 cellular antennas (rugged, vehicle-mount)
- **max-br1-mini** - Compact mobile router (1 WAN, 1 cellular)

## Style Guide

All icons follow a consistent design language:

### Color Palette
- **Device Body**: 
  - Top face: `#6b7280` (light grey)
  - Front face: `#374151` (dark grey)
  - Side face: `#4b5563` (medium grey)

### LED Indicators
- **Power**: `#22c55e` (green) - Device power status
- **WAN**: `#3b82f6` (blue) - WAN connection status
- **Cellular**: `#a855f7` (purple) - Cellular modem status
- **WiFi**: `#22c55e` (green) - WiFi radio status

### Port Indicators
- **Ethernet Ports**: `#1f2937` (dark grey with `#2c3e50` stroke)
- **SFP Ports**: `#f97316` (orange)

### Typography
- **Font Family**: Arial, sans-serif
- **Label Color**: `#ecf0f1` (off-white)
- **Font Sizes**: 4-7px depending on element

## Design Features

Each icon includes:

### ✅ 3D Isometric View
- 30° isometric projection
- Visible top, front, and side faces
- Proper depth and perspective

### ✅ Status LEDs
- Glowing effect with shadow blur
- Color-coded by function
- Positioned on front face

### ✅ Port Indicators
- Small rectangles representing physical ports
- Labeled with port numbers/types (W1, W2, etc.)
- Different colors for different port types

### ✅ Connectivity Features
- **Cellular Antennas**: Purple circles with antenna stems on top face
- **WiFi Indicators**: Green circles with wave arcs
- **Model Labels**: Device model name clearly displayed

### ✅ Special Features
- **Rack Mounts**: Visible mounting ears with holes for rack-mount models
- **Rugged Features**: Mounting brackets for mobile/rugged models
- **SIM Labels**: Dual SIM indicators for cellular models

## File Formats

Each icon is available in two formats:

1. **SVG** (`.svg`) - Vector format, infinitely scalable
   - Use for: Web, print, any size display
   - Benefits: No quality loss, small file size, editable

2. **PNG** (`.png`) - Raster format, 256×256px
   - Use for: Quick previews, thumbnails, compatibility
   - Benefits: Universal support, ready to use

## Dimensions

### Typical Device Sizes (in units)
- **Small Units** (Balance 20X, BR1 Mini): 50×40×20
- **Medium Units** (Balance 210, 305, 310X): 70×50×25
- **Large Units** (Balance 380): 100×70×35
- **Rack Mount** (Balance 710): 130×45×18
- **Wide Rack Mount** (Balance 2500): 150×50×20

### Scale Factor
Icons are rendered at 2× scale for export (256px canvas)
- Base dimensions × 2 = export size
- Allows for crisp rendering at standard sizes

## Usage in Application

Icons are automatically registered in the `IconRegistry` and can be instantiated programmatically:

```typescript
import { IconRegistry } from '@/lib/flow-renderer/icons/IconRegistry';

// Get an icon class
const iconClass = IconRegistry.getIcon('balance-380');

// Create an instance
const icon = new iconClass({ scale: 2 });

// Get the Paper.js group
const group = icon.getGroup();
```

## Export Instructions

To export icons as SVG/PNG files:

1. Run the development server: `npm run dev`
2. Navigate to the Icon Exporter tool (add route to app)
3. Click individual "Download SVG" or "Download PNG" buttons
4. Or click "Export All Icons" to download all at once
5. Files will be downloaded to your browser's download folder
6. Move files to appropriate `iconsets/peplink/{series}/` folders

## Contributing

When adding new device icons:

1. Create a new TypeScript class extending `DeviceIcon`
2. Implement required methods: `render()`, `getSeries()`, `getModelName()`
3. Use helper methods: `addLED()`, `addLabel()`, `addCellularAntenna()`, etc.
4. Follow the style guide for colors and dimensions
5. Add the icon to `IconRegistry.ts`
6. Export to both SVG and PNG formats
7. Update this README with the new device

## License

These icons are part of the Flow network visualization project.
