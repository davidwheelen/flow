# Flow - Network Visualizer Changelog

## [Unreleased]

### ✨ New Features
- **Collapsible Sidebar** - Toggle sidebar visibility to maximize canvas space
  - Smooth 300ms animation
  - Persists state in localStorage
  - Glassmorphic toggle button on sidebar edge
  
- **LAN Network Display** - View LAN network information in device details
  - Shows MAC address
  - Displays total connected clients
  - Collapsible VLANs section with IP ranges and gateways

- **Animated Version Icon** - New twinkling stars icon in sidebar footer
  - Hover effect with sparkle animation
  - Links to release notes

### 🐛 Bug Fixes
- Fixed WAN ethernet ports incorrectly appearing in LAN ports section
- Improved interface classification (WAN vs LAN)
- Fixed VWAN interfaces appearing as LAN instead of WAN

### 🎨 UI Improvements
- Updated title to "FLOW - Network Visualizer"
- Added text stroke to sidebar title
- Enhanced glassmorphic styling throughout

---

## [0.1.0] - 2025-01-XX

### ✨ Initial Release
- **3D Isometric Network Visualization** - Beautiful isometric view of your Peplink network
- **InControl2 Integration** - Direct integration with Peplink InControl2 API
- **Real-time Device Status** - Live updates of device status and connections
- **Device Details Panel** - Comprehensive device information display
- **Connection Visualization** - Visual representation of WAN, LAN, WiFi, and cellular connections
- **Group Management** - Organize devices by InControl2 groups
- **Glassmorphic UI** - Modern, elegant user interface design
