# Visual Documentation Screenshots

This directory contains comprehensive visual documentation showing the Isoflow icons integration in the Flow application.

## Screenshots Generated

All screenshots were automatically generated using the Python script located at `scripts/generate-pr14-screenshots.py`.

### List of Screenshots

1. **01-full-application-isoflow-icons.png** (1920x1080)
   - Complete application interface
   - Glassmorphism sidebar with device groups
   - Canvas showing multiple devices with Isoflow icons
   - Colored connections between devices

2. **02-sidebar-menu.png** (280x800)
   - Detailed view of glassmorphism sidebar
   - Device groups (expanded and collapsed states)
   - Device count badges
   - Glass card styling

3. **03-device-details.png** (400x500)
   - Device information panel
   - Shows Balance 380 - HQ Router details
   - Status, uptime, CPU, memory metrics
   - Progress bar visualization

4. **04-connection-details.png** (450x400)
   - Connection information panel
   - WAN 1: Ethernet (Connected)
   - WAN 2: Cellular (Standby)
   - WiFi and SFP connection details

5. **05-network-layout.png** (1600x1200)
   - Complete network topology example
   - All 6 Isoflow icon types displayed
   - Colored connection lines with legend
   - 9 devices in 3-row layout

6. **06-connections-closeup.png** (800x600)
   - Close-up view of device connections
   - Glass pill labels showing metrics
   - Both solid and dashed connection styles
   - Connection bandwidth and signal strength

7. **07-router-icons.png** (1200x400)
   - Router icon examples
   - Balance 20, 310X, 380, MAX Transit
   - Shows consistency of router icon usage

8. **08-loadbalancer-icons.png** (1200x400)
   - Loadbalancer icon examples
   - Balance 1350, 2500, 3000
   - Enterprise-grade devices

9. **09-other-icons.png** (1200x700)
   - Other icon types
   - Pyramid (AP One AC)
   - Cloud (FusionHub)
   - Cube (MAX Adapter)
   - Switch-module (Switch 48 PoE)

10. **10-incontrol-settings.png** (500x450)
    - InControl OAuth settings panel
    - Connection type selector
    - Masked credentials
    - Glass panel styling

11. **11-device-hover.png** (600x500)
    - Device hover state demonstration
    - Scale effect (1.05x)
    - Tooltip with quick stats
    - Glow effect around hovered device

12. **12-before-after.png** (1200x600)
    - Comparison view
    - Left: Old custom Paper.js icon
    - Right: New Isoflow router icon
    - Shows transition rationale

13. **13-icon-gallery.png** (900x600)
    - Complete icon gallery
    - 2x3 grid showing all 6 icon types
    - Router, Loadbalancer, Pyramid
    - Cloud, Cube, Switch-module

## Color Scheme

All screenshots use the application's color scheme:

- **Background:** #1a1a1a (dark)
- **Sidebar:** #2d2d2d
- **Glass panels:** rgba(255, 255, 255, 0.16) with rgba(255, 255, 255, 0.31) border
- **Text:** #e0e0e0 (primary), #a0a0a0 (secondary), #707070 (muted)
- **Accents:**
  - Blue: #3b82f6 (WAN connections, routers)
  - Purple: #a855f7 (Cellular connections, cloud)
  - Green: #22c55e (WiFi, switches, APs)
  - Orange: #f97316 (SFP, MAX Transit)
  - Yellow: #eab308 (MAX Adapter)
  - Red: #ef4444 (errors, alerts)

## Icon Types

The screenshots demonstrate all 6 Isoflow icon types:

1. **Router** - Balance 20/30/210/305/310/380/580/710, MAX BR1/HD2/HD4/Transit
2. **Loadbalancer** - Balance 1350/2500/3000
3. **Pyramid** - Access Points (AP One series)
4. **Cloud** - FusionHub, VirtualBalance
5. **Cube** - MAX Adapter
6. **Switch-module** - Switches (8/24/48 PoE)

## Connection Types

Screenshots show various connection types:

- **Solid Blue** - WAN/Ethernet connections
- **Dashed Purple** - Cellular connections
- **Solid Green** - WiFi connections
- **Solid Orange** - SFP/Fiber connections

## Regenerating Screenshots

To regenerate all screenshots:

```bash
python3 scripts/generate-pr14-screenshots.py
```

Requirements:
- Python 3.x
- Pillow (PIL) library

The script will recreate all 13 screenshots in this directory.

## Notes

- All screenshots use DejaVu Sans font (fallback to default if unavailable)
- Glassmorphism effects are rendered as semi-transparent overlays
- Device icons are simplified placeholders representing the actual Isoflow SVG icons
- Screenshots are optimized PNG files, totaling approximately 250KB

## Usage in Documentation

These screenshots are referenced in the PR description and can be used in:
- README.md
- User documentation
- Architecture diagrams
- Presentation materials
- Marketing collateral

All images are committed to the repository and available at:
`./screenshots/[filename].png`
