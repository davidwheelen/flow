# Flow - Peplink InControl Network Visualizer

Real-time network visualization tool for Peplink InControl devices with Isoflow-style layouts.

## Features

- 🌐 Real-time device connection monitoring
- 📊 Visual data flow representation
- 🔌 Support for WAN, Cellular, WiFi, and SFP connections
- ⚡ Live speed (MB/s) and latency (ms) metrics
- 🎨 Clean, intuitive Isoflow-inspired interface
- 🔄 Auto-refresh every 5 seconds for real-time updates
- 📱 Responsive full-viewport layout

## Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast dev server and optimized builds
- **React Flow** - Interactive network diagrams
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
│   │   ├── NetworkDiagram/     # Main React Flow canvas
│   │   ├── DeviceNode/         # Custom device node component
│   │   ├── ConnectionEdge/     # Custom edge component
│   │   └── MetricsPanel/       # Side panel with statistics
│   ├── hooks/
│   │   ├── useNetworkData.ts   # React Query hook for devices
│   │   └── useRealtimeMetrics.ts # Real-time metrics simulation
│   ├── services/
│   │   └── peplinkApi.ts       # API service layer (mock)
│   ├── types/
│   │   └── network.types.ts    # TypeScript type definitions
│   ├── utils/
│   │   ├── mockData.ts         # Sample network data
│   │   └── layoutHelpers.ts    # Layout algorithms
│   ├── App.tsx                 # Main app component
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
├── index.html                  # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # TailwindCSS configuration
└── package.json               # Dependencies and scripts
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

### Device Nodes

Each device node displays:
- Device name and model
- IP address
- All connections with type-specific icons
- Real-time metrics for active connections:
  - Speed (Mbps)
  - Latency (ms)
  - Upload/Download speeds
- Color-coded status indicators
- Animated pulse for active connections

### Network Diagram

- Interactive canvas with pan and zoom
- Automatic layout with React Flow
- Animated edges showing data flow
- Connection type color coding
- Fit-to-view on load

### Metrics Panel

- Total device count
- Active vs total connections
- Breakdown by connection type
- Real-time update indicator
- Last updated timestamp

## Roadmap

- [ ] Peplink InControl API integration
- [ ] WebSocket for real-time updates
- [ ] Device grouping and filtering
- [ ] Historical metrics and analytics
- [ ] Export/screenshot functionality
- [ ] Alert notifications
- [ ] Multi-site support
- [ ] Custom node layouts
- [ ] Performance optimization for large networks
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
