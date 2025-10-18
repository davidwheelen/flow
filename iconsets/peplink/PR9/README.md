# Peplink Icon Library - PR9 Revision

**Created:** 2025-01-18  
**Status:** Professional 3D Isometric Icons

## What's New in PR9

Professional 3D isometric device icons for Peplink network equipment. These icons are designed to match the Flow application's visual style with:

- **3D isometric rendering** (30° angle projection)
- **Proper depth and perspective** (visible top, front, and side faces)
- **Accurate device proportions** representing different Peplink models
- **Visual indicators** for ports, LEDs, and antennas
- **Dark theme compatible** color scheme

## Sources

These icons are inspired by:
- **Peplink University Visio Stencils** - https://peplinkuniversity.com/visio-stencils/
- **Peplink Official Product Photography** - Used for accurate proportions and details
- **GitHub draw.io Community Icons** - https://github.com/martinatvenn/draw.io-peplink-icons

## Organization

### Balance Series (`balance/`)
Enterprise and branch office routers with multiple WAN connections:

- **Small Routers:** balance-20, balance-20x, balance-30-lte
- **Branch Routers:** balance-210, balance-305, balance-310, balance-310x
- **Enterprise Routers:** balance-380, balance-580, balance-710
- **Data Center Routers:** balance-1350, balance-2500

### MAX Series (`max/`)
Mobile and vehicle-mounted routers:

- **BR1 Series:** max-br1, max-br1-mini, max-br1-pro, max-br1-ip55
- **Multi-Cellular:** max-hd2, max-hd4
- **Transit Series:** max-transit

### Surf Series (`surf/`)
SOHO and home office routers:

- **SOHO Router:** surf-soho

### Access Points (`ap/`)
Wireless access points:

- **One Series:** ap-one-ac, ap-one-mini

## File Formats

Each icon is available in two formats:

### SVG Format (`.svg`)
- **Vector graphics** - Scalable without quality loss
- **Web-friendly** - Can be styled with CSS
- **Small file size** - Ideal for responsive designs
- **Recommended for** - Web applications, responsive UIs

### PNG Format (`.png`)
- **Raster graphics** - 256x256 pixels
- **Transparent background** - Alpha channel support
- **Universal compatibility** - Works everywhere
- **Recommended for** - Quick previews, documentation, presentations

## Icon Features

All icons include:

✅ **3D Isometric Projection** - 30° angle for depth  
✅ **Three Visible Faces** - Top, front, and side surfaces  
✅ **Port Indicators** - WAN/LAN ports on front face  
✅ **Status LEDs** - Green (WiFi) and blue (WAN) indicators  
✅ **Antenna Indicators** - For WiFi-enabled models  
✅ **Accurate Proportions** - Size reflects actual device dimensions  
✅ **Consistent Styling** - Unified color scheme and design

## Color Scheme

Icons use the Flow application's dark theme palette:

- **Device Body:** #374151 (dark grey)
- **Device Body Light:** #4b5563 (medium grey)  
- **Device Top:** #6b7280 (light grey)
- **WAN Ports:** #3b82f6 (blue)
- **WiFi Indicators:** #22c55e (green)
- **Status LEDs:** Green (#22c55e) and Blue (#3b82f6)

## Usage

These icons are designed for:

- **Network Visualization** - Flow application canvas rendering
- **Network Diagrams** - Topology maps and documentation
- **UI Components** - Device selection and status displays
- **Documentation** - Technical guides and user manuals
- **Presentations** - Network architecture slides

### In Flow Application

The icons integrate seamlessly with the Flow renderer:

```typescript
import { iconFactory } from '@/lib/flow-renderer/icons';

// Get device icon
const icon = iconFactory.getIcon('balance-380');
```

### In Documentation

Reference icons directly:

```markdown
![Balance 380](iconsets/peplink/PR9/balance/balance-380.png)
```

## Technical Specifications

### Isometric Projection
- **Angle:** 30° from horizontal
- **Formula:** 
  - X' = X × cos(30°) = X × 0.866
  - Y' = Y × sin(30°) = Y × 0.5
- **Visible Faces:** Top, front (left), side (right)

### Dimensions
- **Canvas Size:** 256×256 pixels (PNG)
- **SVG ViewBox:** 0 0 256 256
- **Device Sizes:** Proportional to actual Peplink dimensions
  - Small: 40-55px width
  - Medium: 60-75px width
  - Large: 80-100px width
  - Rack Mount: 120-130px width

### File Sizes
- **SVG:** ~2-4 KB per icon
- **PNG:** ~5-15 KB per icon (256×256, transparent)

## Device Model Reference

### Balance Series Specifications

| Model | Width | Ports | Cellular | WiFi | Use Case |
|-------|-------|-------|----------|------|----------|
| 20 | 50px | 2 | ✓ | ✓ | Small office |
| 20X | 55px | 2 | ✓ | ✓ | Small office |
| 30 LTE | 55px | 3 | ✓ | ✓ | Branch office |
| 210 | 65px | 3 | ✓ | ✓ | Branch office |
| 305 | 70px | 4 | ✓ | ✓ | Medium office |
| 310 | 70px | 4 | ✓ | ✓ | Medium office |
| 310X | 75px | 4 | ✓ | ✓ | Branch router |
| 380 | 90px | 5 | ✓ | ✓ | HQ router |
| 580 | 95px | 6 | ✓ | ✓ | Enterprise |
| 710 | 100px | 7 | ✓ | ✓ | Large enterprise |
| 1350 | 120px | 8 | ✓ | ✓ | Data center |
| 2500 | 130px | 10 | ✓ | ✓ | Data center |

### MAX Series Specifications

| Model | Width | Ports | Cellular | WiFi | Use Case |
|-------|-------|-------|----------|------|----------|
| BR1 | 45px | 1 | ✓ | ✓ | Mobile router |
| BR1 Mini | 40px | 1 | ✓ | ✓ | Compact mobile |
| BR1 Pro | 50px | 1 | ✓ | ✓ | Professional mobile |
| BR1 IP55 | 52px | 1 | ✓ | ✓ | Rugged mobile |
| HD2 | 60px | 2 | ✓✓ | ✓ | Dual cellular |
| HD4 | 70px | 4 | ✓✓✓✓ | ✓ | Quad cellular |
| Transit | 65px | 2 | ✓✓ | ✓ | Vehicle mount |

## License & Attribution

These icons are created for the Flow application and are based on:

- **Peplink Official Resources** - Design inspiration from Peplink University stencils
- **Community Resources** - GitHub draw.io icons project
- **Original Work** - 3D isometric rendering and styling

For Peplink official stencils and resources, visit:
- https://peplinkuniversity.com/visio-stencils/
- https://www.peplink.com/

## Version History

### PR9 (2025-01-18)
- Initial release with 22 device models
- 3D isometric rendering style
- SVG and PNG formats
- Balance, MAX, Surf, and AP series
- Dark theme compatible colors
- Professional quality icons

## Contributing

To add new device models:

1. Follow the 3D isometric projection rules (30° angle)
2. Use the established color scheme
3. Maintain consistent proportions
4. Include both SVG and PNG formats
5. Add device specifications to this README

## Support

For questions or issues with these icons:
- Check the Flow application documentation
- Review Peplink University resources
- Refer to the GitHub draw.io icons project
