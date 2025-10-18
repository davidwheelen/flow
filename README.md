# Flow - Peplink InControl Network Visualizer

Real-time network visualization tool for Peplink InControl devices with Isoflow-style layouts.

## Features

- 🌐 **Real-time device connection monitoring**
- 📊 **Visual data flow representation**
- 🔌 **Support for WAN, Cellular, WiFi, and SFP connections**
- ⚡ **Live speed (MB/s) and latency (ms) metrics**
- 🎨 **Clean, intuitive Isoflow-inspired interface**
- 🔄 **Auto-refresh every 5 seconds for real-time updates**
- 📱 **Responsive full-viewport layout**
- 🏢 **Organization and group navigation**
- 🔧 **Collapsible sidebar for space efficiency**
- ⚙️ **API configuration through UI**
- 🔐 **Secure credential storage**
- 🎭 **Mock data mode for development/demo**

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
│   │   ├── MetricsPanel/       # Side panel with statistics
│   │   ├── Sidebar/            # Organization/group navigation
│   │   ├── Settings/           # API configuration modals
│   │   └── EmptyState/         # Empty state component
│   ├── hooks/
│   │   ├── useNetworkData.ts   # React Query hook for devices
│   │   └── useRealtimeMetrics.ts # Real-time metrics with WebSocket
│   ├── services/
│   │   └── peplinkApi.ts       # InControl API service layer
│   ├── types/
│   │   ├── network.types.ts    # Network type definitions
│   │   └── incontrol.types.ts  # InControl API types
│   ├── utils/
│   │   ├── mockData.ts         # Sample network data
│   │   └── layoutHelpers.ts    # Layout algorithms
│   ├── App.tsx                 # Main app component
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
├── .env.example                # Example environment variables
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

- [x] Peplink InControl API integration
- [x] Organization and group navigation
- [x] Collapsible left sidebar
- [x] API configuration UI
- [x] Mock data mode for development
- [ ] WebSocket for real-time updates (currently polling)
- [ ] Advanced device filtering
- [ ] Historical metrics and analytics
- [ ] Export/screenshot functionality
- [ ] Alert notifications
- [ ] Multi-site support
- [ ] Custom node layouts
- [ ] Performance optimization for large networks
- [ ] Mobile responsive improvements

## API Integration

### Peplink InControl API Setup

Flow integrates with the Peplink InControl API to provide real-time network monitoring and device management. Follow these steps to configure your API connection:

#### 1. Environment Configuration

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your InControl API credentials:

```env
# Peplink InControl API Configuration
VITE_IC_API_URL=https://api.ic.peplink.com/api
VITE_IC_CLIENT_ID=your_client_id_here
VITE_IC_CLIENT_SECRET=your_client_secret_here

# Optional: Use mock data instead of real API (true/false)
VITE_USE_MOCK_DATA=false
```

#### 2. Obtaining API Credentials

1. Log in to your [Peplink InControl account](https://ic.peplink.com)
2. Navigate to **System Settings** > **API Access**
3. Create a new API client
4. Copy your **Client ID** and **Client Secret**
5. Add these credentials to your `.env` file

#### 3. Using the Settings UI

Alternatively, you can configure API credentials through the application UI:

1. Click the **Settings** button in the sidebar (gear icon)
2. Enter your API credentials:
   - **API Base URL**: `https://api.ic.peplink.com/api`
   - **Client ID**: Your InControl client ID
   - **Client Secret**: Your InControl client secret
3. Click **Test Connection** to verify credentials
4. Click **Save** to store the configuration

#### 4. Mock Data Mode

For development and testing without API access, enable mock data mode:

- Set `VITE_USE_MOCK_DATA=true` in `.env`, or
- Check "Use Mock Data" in the Settings modal

Mock mode provides realistic sample data for demonstration purposes.

### API Features

- **Authentication**: OAuth 2.0 client credentials flow with automatic token refresh
- **Organizations**: Browse all organizations accessible with your credentials
- **Groups**: View device groups within each organization
- **Devices**: Monitor devices, connections, and real-time metrics
- **Real-time Updates**: WebSocket streaming for live metrics (5-second refresh in mock mode)

### Security Notes

⚠️ **Important Security Practices:**

- Never commit your `.env` file to version control (it's in `.gitignore`)
- Keep your client secret secure and rotate it regularly
- Use environment variables in production deployments
- Consider using a backend proxy to hide credentials from the client

### API Rate Limits

Be aware of InControl API rate limits:
- Organization/Group queries: Cached to minimize API calls
- Device metrics: Refreshed every 5 seconds
- Use mock mode for development to avoid hitting rate limits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
