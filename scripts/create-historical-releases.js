const { Octokit } = require('@octokit/rest');

// You'll need to run this with: GITHUB_TOKEN=your_token node scripts/create-historical-releases.js
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const owner = 'davidwheelen';
const repo = 'flow';

// Map PRs to versions - analyzing all 117+ PRs
const releases = [
  {
    tag: 'v0.1.0',
    name: 'v0.1.0 - Initial Release',
    date: '2025-10-18',
    body: `## 🎉 Initial Release

### Features Added
- **Project Setup** (#1, #2)
  - React + Vite + TypeScript foundation
  - React Flow integration
  - Complete project structure

This is the first release of Flow - a network visualization tool for Peplink devices.`
  },
  {
    tag: 'v0.2.0',
    name: 'v0.2.0 - Core Renderer',
    date: '2025-10-18',
    body: `## ✨ Features

### Flow Renderer (#5)
- Implemented flow renderer with Peplink 3D device icons
- Added InControl API integration
- Device topology visualization

### Visual Assets (#10)
- Added real Peplink icons
- Isoflow 3D isometric screenshots`
  },
  {
    tag: 'v0.3.0',
    name: 'v0.3.0 - Isoflow Integration',
    date: '2025-10-19',
    body: `## ✨ Features

### 3D Isometric Visuals (#11)
- Implemented Isoflow 3D isometric rendering
- Glassmorphism UI design
- Modern visual aesthetic

### InControl2 API (#13)
- OAuth 2.0 authentication
- Encrypted credential storage
- Secure API integration

### Icon System (#14)
- Replaced Peplink-specific icons with Isoflow isopacks
- Standardized icon library`
  },
  {
    tag: 'v0.4.0',
    name: 'v0.4.0 - Documentation & Rules',
    date: '2025-10-20',
    body: `## 📝 Documentation

### COPILOT_RULES.md (#18)
- Created mandatory rules file for all future PRs
- Development guidelines
- PR standards

### Icon Fixes (#21)
- Fixed Isoflow icon integration with local SVG files
- UI enhancements`
  },
  {
    tag: 'v0.5.0',
    name: 'v0.5.0 - Grid System',
    date: '2025-10-21',
    body: `## ✨ Features

### Grid System (#26)
- Implemented original Isoflow grid system
- Zoom and pan functionality
- Interactive canvas

### Device Specifications (#27)
- Added comprehensive device connection types
- Support for 50+ Peplink models
- Detailed device specifications

### Bug Fixes (#29)
- Fixed device icon loading
- Used deviceSpecifications data
- Captured real app screenshots`
  },
  {
    tag: 'v0.6.0',
    name: 'v0.6.0 - Docker & Deployment',
    date: '2025-10-22',
    body: `## 🐳 Docker Support

### Docker Compose (#30)
- Easy installation and deployment
- Container-based setup
- Simplified configuration

### Settings Panel (#31)
- Removed quick-select buttons
- Replaced IC-VA with ICVA
- Improved UX

### Backend Service (#33)
- Backend API service for auto-credentials
- Playwright automation
- Credential management`
  },
  {
    tag: 'v0.7.0',
    name: 'v0.7.0 - OAuth & Error Handling',
    date: '2025-10-24',
    body: `## 🔐 Authentication & Error Handling

### Docker Fixes (#34, #35)
- Fixed npm ci errors
- Resolved image pull warnings
- Multi-stage build improvements

### Error Numbering System (#36)
- Comprehensive error numbering
- Logging infrastructure
- Better debugging

### CORS & OAuth (#37, #42)
- Fixed CORS blocking
- OAuth2 proxy improvements
- Error code display

### Bug Fixes (#40, #41)
- Trust proxy configuration
- Playwright visibility issues
- OAuth2 token management`
  },
  {
    tag: 'v0.8.0',
    name: 'v0.8.0 - Security & API Improvements',
    date: '2025-10-26',
    body: `## 🔒 Security & API

### Security Settings (#38)
- Custom CORS origins management
- Enhanced security controls

### API Fixes (#43, #44, #45)
- Error code display chain
- OAuth2 proxy response format
- Standardized logging

### Web Crypto (#46)
- Fallback for non-secure contexts
- Browser compatibility

### API Integration (#47, #48, #49)
- Authenticated InControl2 API
- Fixed endpoint matching
- Domain-specific auth
- Removed mock data fallback`
  },
  {
    tag: 'v0.9.0',
    name: 'v0.9.0 - UI Enhancements',
    date: '2025-10-26',
    body: `## 🎨 UI/UX Improvements

### Background Animation (#51, #52)
- Animated gradient backgrounds
- Wave effects in sidebar header

### Appearance Settings (#53)
- New appearance configuration
- Fixed gradient borders
- Liquid glass color scheme

### Layout Improvements (#56, #57, #58)
- Grid-based layout algorithm
- Device auto-arrangement
- React component refactoring
- Fixed icon rendering timing`
  },
  {
    tag: 'v0.10.0',
    name: 'v0.10.0 - Network Topology',
    date: '2025-10-27',
    body: `## 🌐 Network Topology Features

### Device Metadata (#59)
- Fixed network topology rendering
- Device metadata display
- Swirl background animation

### WAN Details (#60, #61)
- Comprehensive WAN information
- Fixed swirl animation
- InControl API field mapping

### Connection Detection (#62, #63)
- Backend credential storage
- LAN client topology discovery
- Device connection mapping via MAC addresses

### Bug Fixes (#64, #65)
- MAC address lookup from InControl API
- Swirl animation scale adjustments`
  },
  {
    tag: 'v0.11.0',
    name: 'v0.11.0 - Sidebar & Panels',
    date: '2025-10-28',
    body: `## 💼 Sidebar & Device Panels

### Sidebar Enhancements (#66, #67, #68)
- Compact header with Abricos font
- Draggable multi-instance device panels
- Collapsible WAN sections
- Bold larger title
- Separated sections
- Centered scaled animation

### Panel Improvements (#70, #71)
- Fixed drag propagation
- WAN collapse state management
- Replaced broken swirl animation with exact Codrops implementation`
  },
  {
    tag: 'v0.12.0',
    name: 'v0.12.0 - Connection Visualization & Debugging',
    date: '2025-11-07',
    body: `## 🔗 Connection Visualization

### Connection Detection (#73, #77, #81, #82)
- Group-aware position calculations
- Comprehensive device connection detection
- Refactored connection graph building
- Debug logging for tracking

### Particle Animations (#79, #80, #86)
- Particle animation background
- Rising particles for online devices
- Confined to header with horizontal flow

### Bug Fixes (#84, #85)
- Balance 20X LAN interface detection
- Device-to-device connections
- AP WiFi mesh status handling

### Documentation (#83)
- Repository path handling rules
- Updated COPILOT_RULES.md`
  },
  {
    tag: 'v0.12.1',
    name: 'v0.12.1 - Wireless Mesh & Refresh',
    date: '2025-11-08',
    body: `## 🐛 Bug Fixes

### Wireless Mesh (#88, #90, #92)
- Refresh controls added
- LAN port visualization
- Animated status indicators
- Timestamp handling rule
- Wireless Mesh display for AP devices
- AP Wireless Mesh interface mapping
- Real-time DeviceDetailsPanel refresh`
  },
  {
    tag: 'v0.12.2',
    name: 'v0.12.2 - LAN Port Improvements',
    date: '2025-11-10',
    body: `## 🔌 LAN Port Features

### LAN Port Display (#99, #100, #102, #104, #105)
- Bootstrap Ethernet icons
- WAN interface filtering
- Fixed WAN in LAN PORTS section
- Filtered LAN from WAN CONNECTIONS
- Reverted incorrect implementations`
  },
  {
    tag: 'v0.12.3',
    name: 'v0.12.3 - LAN Port Detection',
    date: '2025-11-12',
    body: `## 🔍 LAN Port Detection

### Debug & Fixes (#106, #107, #108, #109)
- Debug logging for interface data
- LAN port data fetching via InControl2
- Parse LAN ports from port_status.lan_list
- Device API proxy implementation

### VLAN Features (#110, #111)
- Fixed VWAN misclassification
- LAN Network/VLAN display
- MAC/client count
- Collapsible VLANs
- WOVLAN WAN classification fix`
  },
  {
    tag: 'v0.12.4',
    name: 'v0.12.4 - Sidebar Collapsible',
    date: '2025-11-13',
    body: `## 🎨 UI Polish

### Sidebar Improvements (#112, #114, #115)
- Collapsible sidebar functionality
- Updated title and text stroke
- Reverted to original "Flow" text
- 1px text stroke matching glassmorphic background`
  },
  {
    tag: 'v0.13.0',
    name: 'v0.13.0 - Versioning & Footer',
    date: '2025-11-13',
    body: `## 📦 Version Management

### Versioning System (#117)
- Fixed versioning system
- Populated changelog with semantic versioning
- Proper version tracking

### Sidebar Footer (#116)
- Animated stars icon
- Dynamic version display
- "What's New" link to releases`
  }
];

async function createReleases() {
  console.log(`Creating ${releases.length} historical releases...`);
  
  for (const release of releases) {
    try {
      console.log(`Creating release ${release.tag}...`);
      
      await octokit.repos.createRelease({
        owner,
        repo,
        tag_name: release.tag,
        name: release.name,
        body: release.body,
        draft: false,
        prerelease: false,
        target_commitish: 'main'
      });
      
      console.log(`✅ Created ${release.tag}`);
      
      // Rate limiting - wait 1 second between releases
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error creating ${release.tag}:`, error.message);
    }
  }
  
  console.log('\n🎉 All historical releases created!');
  console.log('View them at: https://github.com/davidwheelen/flow/releases');
}

createReleases();
