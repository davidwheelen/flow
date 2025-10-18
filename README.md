# Flow - Peplink InControl Network Visualizer

Real-time network visualization tool for Peplink InControl devices with **true isometric 3D rendering**.

## Features

- 🎨 **Isometric 3D Visualization** - Professional technical diagram style with depth perception
- 🌐 Real-time device connection monitoring
- 📊 Visual data flow representation with animated particles
- 🔌 Support for WAN, Cellular, WiFi, and SFP connections
- ⚡ Live speed (MB/s) and latency (ms) metrics
- 🎮 Interactive camera controls (pan, zoom, rotate view)
- 🎯 Device hover and selection with detailed information
- 🔄 Auto-refresh every 5 seconds for real-time updates
- 📱 Responsive full-viewport layout

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast dev server and optimized builds
- **HTML5 Canvas** - High-performance isometric 3D rendering
- **TailwindCSS** - Utility-first styling
- **React Query** - Data fetching and caching
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
flow/
├── src/
│   ├── components/
│   │   ├── IsometricCanvas/       # Isometric 3D rendering system
│   │   │   ├── IsometricCanvas.tsx     # Main canvas component
│   │   │   ├── IsometricRenderer.ts    # Core rendering engine
│   │   │   ├── IsometricDevice.tsx     # Device 3D box renderer
│   │   │   └── IsometricConnection.tsx # Connection line renderer
│   │   ├── NetworkDiagram/        # Network diagram container
│   │   ├── DeviceNode/            # (Legacy - kept for reference)
│   │   ├── ConnectionEdge/        # (Legacy - kept for reference)
│   │   └── MetricsPanel/          # Side panel with statistics
│   ├── hooks/
│   │   ├── useNetworkData.ts      # React Query hook for devices
│   │   └── useRealtimeMetrics.ts  # Real-time metrics simulation
│   ├── services/
│   │   └── peplinkApi.ts          # API service layer (mock)
│   ├── types/
│   │   └── network.types.ts       # TypeScript type definitions
│   ├── utils/
│   │   ├── isometricMath.ts       # Isometric coordinate transformations
│   │   ├── isometricLayout.ts     # 3D positioning algorithm
│   │   ├── mockData.ts            # Sample network data
│   │   └── layoutHelpers.ts       # (Legacy - kept for reference)
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # TailwindCSS configuration
└── package.json                  # Dependencies and scripts
```

## Design System

### Connection Colors

- **WAN**: Blue (#3b82f6)
- **Cellular**: Purple (#a855f7)
- **WiFi**: Green (#22c55e)
- **SFP**: Orange (#f97316)

### Status Colors

- **Connected**: Green (#22c55e)
- **Disconnected**: Red (#ef4444)
- **Degraded**: Amber (#f59e0b)

## Features in Detail

### Isometric 3D Rendering

The application uses a custom isometric rendering system built on HTML5 Canvas:

- **Isometric Projection**: Standard 30° angles for authentic technical drawing appearance
- **3D Positioning**: Devices positioned in 3D space with proper depth sorting
- **Depth Perception**: Shadows, face shading, and back-to-front rendering
- **Performance**: 60fps animation loop with efficient canvas rendering

### Device Visualization

Each device is rendered as a 3D isometric box:
- **Three visible faces**: Top (lightest), front (device info), and right side (medium shade)
- **Device information**: Name, model, and IP address on front face
- **Connection ports**: Colored indicators on top edge by connection type
- **Status indicators**: Pulsing animation for active connections
- **Interactive**: Hover highlighting and click selection

### Connection Visualization

Connections between devices are drawn in isometric space:
- **Color coding by type**:
  - WAN: Blue (#3b82f6) - Solid line
  - Cellular: Purple (#a855f7) - Dashed line
  - WiFi: Green (#22c55e) - Dotted line
  - SFP: Orange (#f97316) - Thick solid line
- **Animated data flow**: Particles moving along connection paths
- **Metrics display**: Speed (Mbps) and latency (ms) in labeled badges
- **Depth awareness**: Proper rendering order with devices

### Camera Controls

Interactive controls for navigating the 3D view:
- **Pan**: Click and drag to move the view
- **Zoom**: Mouse wheel to zoom in/out (or use +/- buttons)
- **Fit to View**: Automatically frame all devices
- **Reset View**: Return to default camera position
- **Zoom Range**: 0.1x to 3x magnification

### Network Diagram

- Interactive isometric canvas with full 3D perspective
- Radial layout with hub device at center
- Animated particle flow showing data transfer
- Connection type color coding
- Real-time metric updates every 5 seconds

### Metrics Panel

- Total device count
- Active vs total connections
- Breakdown by connection type
- Real-time update indicator
- Last updated timestamp

## Roadmap

- [x] Isometric 3D visualization system
- [x] Canvas-based rendering engine
- [x] Device 3D box rendering
- [x] Connection line rendering with animations
- [x] Camera controls (pan, zoom, fit, reset)
- [ ] Improved hit detection for device hover
- [ ] Optional isometric grid floor
- [ ] Device grouping and filtering
- [ ] Peplink InControl API integration
- [ ] WebSocket for real-time updates
- [ ] Historical metrics and analytics
- [ ] Export/screenshot functionality
- [ ] Alert notifications
- [ ] Multi-site support
- [ ] Custom node layouts
- [ ] Performance optimization for large networks (100+ devices)
- [ ] Mobile responsive improvements

## API Integration

The project is structured for easy API integration. Key files to update:

1. **src/services/peplinkApi.ts** - Replace mock functions with real API calls
2. **src/hooks/useRealtimeMetrics.ts** - Implement WebSocket connection
3. Add environment variables in `.env`:
   ```
   VITE_API_BASE_URL=https://api.ic.peplink.com
   VITE_API_KEY=your_api_key_here
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
