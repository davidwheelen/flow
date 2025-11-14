## [0.13.2] - 2025-11-14

### 🐛 Fixed
- **UI improvements: collapse icon, glowing borders, purple offline status, layout refinements** (#119) by @Copilot

---

## [0.13.1] - 2025-11-13

### 🐛 Fixed
- **Add automated GitHub release workflow with label-based version bumping** (#118) by @Copilot

---

# Flow - Network Visualizer Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.13.0] - 2025-11-13

### ✨ Added
- **Collapsible Sidebar** - Toggle sidebar visibility to maximize canvas space (#112)
  - Smooth 300ms animation
  - Persists state in localStorage
  - Glassmorphic toggle button on sidebar edge
- **Text Stroke on Title** - 1px text stroke matching glassmorphic background (#115)

### 🎨 Changed
- Reverted sidebar title to simple "Flow" text (#114)

---

## [0.12.0] - 2025-11-12

### ✨ Added
- **LAN Network Section** - Comprehensive LAN network display in device details (#111)
  - MAC address display
  - Total connected clients count
  - Collapsible VLANs section with IP ranges and gateways
- **VLAN Support** - Display and manage VLANs with detailed information (#110, #111)

### 🐛 Fixed
- Fixed VWAN interfaces incorrectly appearing as LAN instead of WAN (#110, #111)
- Fixed WAN ethernet ports appearing in LAN ports section (#111)

---

## [0.11.0] - 2025-11-12

### ✨ Added
- **LAN Port Fetching** - Direct LAN port data from InControl2 device API (#107, #108, #109)
  - Fetches via `/api/device.info` endpoint
  - Parses `port_status.lan_list` data
  - Real-time port status updates

### 🐛 Fixed
- Fixed WAN interfaces appearing in LAN PORTS section (#102, #104, #105)
- Improved interface classification logic (#105)

### 🔧 Debug
- Added debug logging for InControl2 interface data (#106)

---

## [0.10.0] - 2025-11-10

### ✨ Added
- **Bootstrap Ethernet Icons** - Proper Ethernet icons for LAN ports (#99)

### 🐛 Fixed
- Fixed LAN ports display with WAN interface filtering (#99)

### ⏪ Reverted
- Reverted PR #99 Bootstrap Ethernet icon implementation (#100)

---

## [0.9.0] - 2025-11-09

### ✨ Added
- **AP Wireless Mesh Support** - Display wireless mesh connections for AP devices (#92)
  - Interface mapping for mesh connections
  - Real-time DeviceDetailsPanel refresh
- **Wireless Mesh Display** - Dedicated section for AP mesh connections (#90)
  - Shows mesh connection status
  - Displays connected AP devices

### 🔧 Configuration
- Added timestamp handling rule to COPILOT_RULES.md (#90)

---

## [0.8.0] - 2025-11-07

### ✨ Added
- **Refresh Controls** - Manual refresh for groups and device data (#88)
  - Refresh button with loading states
  - Real-time data updates
- **LAN Port Visualization** - Visual display of LAN ports with status (#88)
  - Animated status indicators (green pulse for active, gray for inactive)
  - Port speed and link status
  - Connection information

---

## [0.7.0] - 2025-11-07

### ✨ Added
- **Particle Animations** - Dynamic particle effects in device panel (#79, #80, #86)
  - Rising particles for online devices
  - Horizontal flow confined to header
  - Status-based animation colors

### 🐛 Fixed
- Fixed AP WiFi mesh connection status handling (#85)
- Fixed Balance 20X LAN interface detection (#84)
- Fixed device-to-device connection rendering (#84)

### 🔧 Debug
- Added debugging logs for connection graph building (#82)

### 📝 Documentation
- Added repository path handling rules to COPILOT_RULES.md (#83)

---

## [0.6.0] - 2025-11-07

### ✨ Added
- **Comprehensive Device Connections** - Complete device-to-device connection detection (#77, #81)
  - Detects WAN, LAN, WiFi mesh connections
  - Renders connection paths on canvas
  - Color-coded by connection type
- **Group-Aware Positioning** - Position calculations respect device groups (#73)
  - Proper connection paths between groups
  - Prevents overlapping connections

### 🐛 Fixed
- Fixed device connection rendering by refactoring graph building (#81)

---

## [0.5.0] - 2025-11-06

### 📝 Documentation
- Added Rule #7: Screenshot Generation Method to COPILOT_RULES.md (#75)

---

## [0.4.0] - 2025-10-29

### ✨ Added
- **Swirl Animation Background** - Animated swirl background in sidebar (#71)
  - Exact Codrops implementation
  - Glassmorphic effect integration

### 🐛 Fixed
- Fixed DeviceDetailsPanel drag propagation (#70)
- Fixed WAN collapse state persistence (#70)

---

## [0.3.0] - Earlier Releases

### ✨ Added
- Initial device visualization features
- InControl2 API integration
- Group management
- Device details panel
- WAN connection display
- Settings panel

---

## [0.2.0] - Initial Beta

### ✨ Added
- Basic network visualization
- Device rendering
- Group selection
- Authentication system

---

## [0.1.0] - Initial Release

### ✨ Added
- Project initialization
- Basic React + TypeScript setup
- Vite build configuration
- Initial UI framework
