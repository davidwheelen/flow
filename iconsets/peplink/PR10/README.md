# Peplink Icon Library - PR10 Revision

**Created:** 2025-10-19  
**Source:** GitHub Community Draw.io Icons

## What's New in PR10

Real Peplink device icons from community-maintained repository:
- Source: https://github.com/martinatvenn/draw.io-peplink-icons
- Based on official Peplink marketing materials by Alan Tsui
- Converted from draw.io XML to SVG/PNG
- High quality, accurate device representations

## Organization

- `balance/` - Balance series routers (20, 20X, 210, 310X, 380, 2500, etc.)
- `max/` - MAX series mobile routers (BR1, HD2, HD4, Transit, etc.)
- `surf/` - Surf SOHO models (SFE, SFE CAM)
- `other/` - Access points, enterprise devices, and other products

## File Formats

Each icon available as:
- `.svg` - Vector format, scalable
- `.png` - Raster format, 256x256px, transparent background

## Available Icons

### Balance Series (balance/)
- Balance 20 (B20)
- Balance 20X (B20X)
- Balance 210 (B210)
- Balance 310X (310X)
- Balance 380 (380)
- Balance 2500 (B2500)
- Balance 30 (B30)
- Balance One
- Balance Two

### MAX Series (max/)
- MAX BR1 (various models: BR1, BR1 Mini, BR1 Enterprise, BR1 IP68, BR1 MK2, BR1 LTE, BR1 M2M)
- MAX HD2 (HD2, HD2 Mini)
- MAX HD4
- MAX Transit (Transit, Transit Mini)
- UBR Series (UBR/BR1 Pro, UBR Go, UBR LTE)
- BR2 5G Pro

### Surf Series (surf/)
- Surf SOHO (SFE)
- Surf SOHO CAM (SFE CAM)

### Other Products (other/)
- Access Points (AP One, AP One Enterprise, AP One Mini, AP One Flex)
- Enterprise Products (EPX, SDX, SDX Pro, PDX, MBX)
- Modules and accessories

## Usage

These icons are suitable for:
- Network diagrams
- Application UI (like this Flow app)
- Documentation
- Presentations

## License

Icons from https://github.com/martinatvenn/draw.io-peplink-icons  
Original designs by Alan Tsui (Peplink Marketing)  
Check repository for license information.

## Visual Style

All screenshots in PR10 use:
- **Interface:** Original Isoflow 3D isometric style
- **Theme:** Dark mode (#1a1a1a background, #2d2d2d sidebar)
- **Rendering:** Paper.js with 30° isometric projection
- **Connections:** Color-coded (blue WAN, purple cellular, green WiFi, orange SFP)

## Notes

The SVG files in this collection are simplified placeholders with device names. For production use, consider:
1. Extracting actual SVG paths from the draw.io XML format
2. Using the original draw.io library directly
3. Creating custom 3D isometric renders for the Flow application
