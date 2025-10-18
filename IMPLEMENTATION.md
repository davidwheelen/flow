# Flow Renderer Implementation Summary

## Overview
This document summarizes the implementation of the custom Flow renderer for Peplink InControl network visualization.

## Key Components

### 1. Flow Renderer Library (`src/lib/flow-renderer/`)
A custom visualization library using Paper.js for isometric 3D rendering.

#### Core Classes
- **FlowCanvas.tsx**: Main React component that manages the Paper.js canvas
  - Handles device rendering
  - Manages connection animations
  - Responsive to window resize
  - Isometric grid layout

- **FlowNode.ts**: Represents a network device
  - 3D isometric box rendering
  - Position management
  - Device-specific rendering via icon factory

- **FlowConnection.ts**: Animated connections between devices
  - Curved paths with quadratic bezier
  - Color-coded by connection type (WAN, Cellular, WiFi, SFP)
  - Status-based styling (connected, disconnected, degraded)
  - Animated dashed lines for active connections

#### Device Icons (`src/lib/flow-renderer/icons/`)
Custom 3D isometric renderers for each Peplink model:

1. **Balance 20X** - Small desktop router
   - Compact design
   - 2 WAN ports
   - Cellular antenna indicator

2. **Balance 310X** - Branch office router
   - Medium size
   - 3 WAN ports
   - Dual WiFi antennas
   - Cellular modem

3. **Balance 380** - HQ router
   - Large desktop unit
   - 5 WAN ports
   - 2 cellular modems
   - Dual WiFi antennas
   - Multiple status LEDs

4. **Balance 2500** - Rack mount router
   - 1U rack mount design
   - 8 WAN ports
   - 4 SFP ports
   - Rack mount ears
   - Triple status LEDs

5. **MAX Transit** - Mobile/vehicle router
   - Rugged compact design
   - 4 cellular antennas
   - WiFi antenna
   - Mounting brackets
   - 2 ports

### 2. InControl API Integration (`src/services/incontrolApi.ts`)
Complete API service for Peplink InControl:

- **Authentication**: OAuth2 client credentials flow
- **Groups**: Fetch organization groups
- **Devices**: Group-based device fetching
- **WebSocket**: Real-time device updates
- **Device Mapping**: Automatic mapping from InControl format to app format
- **Mock Fallback**: Automatic fallback to mock data when API not configured

### 3. State Management (`src/store/appStore.ts`)
Zustand store with Immer for immutable state updates:

- Selected group tracking
- Groups list
- Devices list
- Loading states
- Error handling
- Sidebar visibility

### 4. UI Components

#### Sidebar (`src/components/Sidebar/Sidebar.tsx`)
- Group list with device counts
- Group selection
- Loading states
- Error handling with retry
- Selected group indicator

#### App (`src/App.tsx`)
- Main layout with sidebar and canvas
- WebSocket lifecycle management
- Welcome screen
- Empty states

### 5. Mock Data (`src/utils/`)
Development support:

- **mockData.ts**: Mock Peplink devices
- **mockGroups.ts**: Mock organization groups with device mappings

## Technical Stack

### Dependencies Added
- `paper` (0.12.17): Canvas-based vector graphics
- `zustand` (4.5.0): State management
- `immer` (10.0.3): Immutable state updates
- `chroma-js` (2.4.2): Color manipulation
- `pathfinding` (0.4.18): Future path finding (not yet used)

### Dependencies Removed
- `reactflow`: Replaced with custom Flow renderer
- `@tanstack/react-query`: State now managed by Zustand

## Architecture Decisions

### Why Custom Renderer?
1. **Full Control**: Complete control over rendering and animations
2. **3D Isometric**: Native support for isometric projection
3. **Performance**: Direct canvas rendering for large networks
4. **Customization**: Device-specific icon rendering
5. **No Dependencies**: Not tied to React Flow's architecture

### Why Paper.js?
1. **Vector Graphics**: Scalable rendering
2. **Animation**: Built-in animation support
3. **Path Operations**: Complex path manipulation
4. **Well Documented**: Mature library with good docs
5. **TypeScript Support**: Native type definitions

### Why Zustand?
1. **Simple API**: Minimal boilerplate
2. **No Context**: Direct hook access
3. **Immer Integration**: Built-in immutability support
4. **DevTools**: Redux DevTools support
5. **Lightweight**: Small bundle size

## File Structure
```
src/
├── components/
│   └── Sidebar/           # Group selection UI
├── lib/
│   └── flow-renderer/     # Custom renderer library
│       ├── core/          # Core rendering classes
│       ├── icons/         # Device icon renderers
│       └── FlowCanvas.tsx # Main canvas component
├── services/
│   └── incontrolApi.ts    # API integration
├── store/
│   └── appStore.ts        # State management
├── types/
│   └── network.types.ts   # TypeScript types
├── utils/
│   ├── mockData.ts        # Mock devices
│   └── mockGroups.ts      # Mock groups
└── App.tsx                # Main app
```

## Configuration

### Environment Variables
```bash
VITE_INCONTROL_API_URL=https://api.ic.peplink.com
VITE_INCONTROL_CLIENT_ID=your_client_id
VITE_INCONTROL_CLIENT_SECRET=your_client_secret
```

### Mock Data Fallback
When API credentials are not set, the app automatically uses mock data:
- 3 mock groups (Headquarters, Branch Offices, Mobile Units)
- 5 mock devices distributed across groups
- Simulated API delays for realistic testing

## Color Scheme

### Connection Types
- WAN: Blue (#3b82f6)
- Cellular: Purple (#a855f7)
- WiFi: Green (#22c55e)
- SFP: Orange (#f97316)

### Connection Status
- Connected: Green (#22c55e)
- Disconnected: Red (#ef4444)
- Degraded: Amber (#f59e0b)

### Device Rendering
- Body: Dark Grey (#374151)
- Body Light: Medium Grey (#4b5563)
- Top Face: Light Grey (#6b7280)
- Accent: Blue (#3b82f6)
- Ports: Very Dark Grey (#1f2937)
- LEDs: Green (#22c55e)

## Future Enhancements

1. **Interactive Selection**: Click devices to view details
2. **Device Details Panel**: Show metrics and connection info
3. **Topology Detection**: Auto-detect device connections
4. **Path Finding**: Use pathfinding for connection routing
5. **Zoom & Pan**: Canvas navigation controls
6. **Export**: Screenshot and SVG export
7. **Themes**: Dark mode support
8. **Filtering**: Filter by connection type or status
9. **Historical Data**: Show metrics over time
10. **Alerts**: Visual alerts for device issues

## Testing

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

### Dev Server
```bash
npm run dev
```

## Notes

- All builds pass successfully
- No linting errors
- Mock data works out of the box
- Ready for API integration when credentials are provided
- WebSocket connection only attempted when API is configured
