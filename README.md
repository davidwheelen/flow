# Flow - Peplink InControl Network Visualizer

Real-time network visualization tool for Peplink InControl devices with isometric 3D rendering using custom Flow renderer.

## Features

- 🎨 **Isometric 3D Visualization** - Custom Flow renderer using Paper.js for beautiful isometric device rendering
- 🏢 **Group-Based Organization** - Select and view devices by InControl groups
- 🔐 **InControl2 API Integration** - Direct OAuth 2.0 integration with encrypted credential storage
- 🤖 **Auto-Credentials** - Automatic OAuth credential retrieval using Playwright browser automation
- 📡 **Real-time Updates** - Automatic polling every 30 seconds with rate limiting
- 🔌 **Connection Monitoring** - Track WAN, Cellular, WiFi, and PepVPN connections
- 📊 **Device Icons** - Custom 3D isometric icons for Peplink device models:
  - Balance 20X (small router)
  - Balance 310X (branch router)
  - Balance 380 (HQ router)
  - Balance 2500 (rack mount)
  - MAX Transit (mobile unit)
- 🔄 **Live Metrics** - Speed, latency, upload/download, bandwidth monitoring
- 📱 **Responsive Design** - Full-viewport layout with sidebar navigation
- 🛡️ **Secure Storage** - Web Crypto API encryption for sensitive credentials
- 🚀 **Backend API** - Node.js/Express service for browser automation

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast dev server and optimized builds
- **Paper.js** - Canvas-based 2D vector graphics for isometric rendering
- **Zustand** - State management with Immer for immutability
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API integration
- **Chroma.js** - Color manipulation

## Getting Started

### 🐳 Docker Installation (Recommended)

The easiest way to run Flow is with Docker:

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/davidwheelen/flow.git
cd flow

# Start Flow (frontend + backend)
docker compose up -d

# Access Flow at http://localhost:2727
```

That's it! Flow is now running in production mode with:
- **Frontend** (React/Nginx) on port 2727
- **Backend API** (Node.js/Express) for auto-credentials feature

#### Development Mode

```bash
# Start development environment with hot-reload
docker compose -f docker-compose.flow-dev.yml up

# Access development server at http://localhost:8181
```

See [Deployment Guide](./docs/deployment.md) for complete Docker documentation.

#### Backend API

The backend service runs automatically with Docker Compose and provides:
- Auto-credentials API endpoint for Playwright automation
- CORS protection restricted to frontend
- Rate limiting (10 requests per 15 minutes)
- Health check endpoint

See [Backend README](./backend/README.md) for backend-specific documentation.

### 💻 Local Installation

If you prefer to run Flow locally without Docker:

#### Prerequisites

- Node.js 18 or higher
- npm or yarn

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Build

```bash
npm run build
```

The production build will be in the `dist` directory.

#### Preview Production Build

```bash
npm run preview
```

#### Lint

```bash
npm run lint
```

## Project Structure

```
flow/
├── src/
│   ├── components/
│   │   └── Sidebar/             # Group selection sidebar
│   ├── lib/
│   │   └── flow-renderer/       # Custom Flow rendering library
│   │       ├── core/            # FlowNode, FlowConnection classes
│   │       ├── icons/           # Device icon renderers
│   │       │   └── peplink/     # Peplink-specific icons
│   │       └── FlowCanvas.tsx   # Main canvas component
│   ├── services/
│   │   └── incontrolApi.ts      # InControl API integration
│   ├── store/
│   │   └── appStore.ts          # Zustand state management
│   ├── types/
│   │   └── network.types.ts     # TypeScript type definitions
│   ├── utils/
│   │   ├── mockData.ts          # Mock device data
│   │   └── mockGroups.ts        # Mock group data
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # TailwindCSS configuration
└── package.json                # Dependencies and scripts
```

## Flow Renderer Architecture

The Flow renderer is a custom visualization library inspired by Isoflow but tailored for Peplink devices:

### Components

1. **FlowCanvas** - Main React component that manages the Paper.js canvas
2. **FlowNode** - Represents a network device with isometric 3D rendering
3. **FlowConnection** - Animated connections between devices
4. **Device Icons** - Custom 3D isometric representations of each Peplink model

### Rendering Approach

- Uses Paper.js for vector-based canvas rendering
- Isometric projection with 30° angles for 3D appearance
- Each device model has a custom icon renderer with:
  - 3D box representation (top, front, side faces)
  - Proper shading and depth
  - Connection ports visualization
  - Status LEDs and indicators

## InControl2 API Integration

### Features

- **OAuth 2.0 Authentication** - Secure authentication with InControl2 or custom ICVA servers
- **Encrypted Credentials** - Web Crypto API (AES-GCM 256-bit) for local storage
- **Automatic Polling** - 30-second intervals with 20 req/sec rate limiting
- **Comprehensive Data** - Devices, WAN status, bandwidth, cellular, and PepVPN
- **Glassmorphism UI** - Beautiful settings dialog with credential masking (••••••• display)
- **Token Management** - Automatic refresh before expiration
- **Custom Servers** - Support for both InControl2 and custom ICVA servers

### Quick Setup

1. Click the **Settings** button (gear icon) in the top right
2. Enter your InControl2 credentials:
   - API URL: `https://incontrol2.peplink.com` (or custom ICVA server)
   - Client ID, Client Secret, Organization ID
3. Click **Test & Save**

See [INCONTROL2_INTEGRATION.md](./INCONTROL2_INTEGRATION.md) for detailed documentation.

### Mock Data Fallback

When API credentials are not configured, the application automatically uses mock data for development and testing.

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

### Device Colors

- **Body**: Dark Grey (#374151)
- **Body Light**: Medium Grey (#4b5563)
- **Top**: Light Grey (#6b7280)
- **Accent**: Blue (#3b82f6)

## Roadmap

- [x] Custom Flow renderer with Paper.js
- [x] Isometric 3D device icons
- [x] InControl API integration
- [x] Group-based device loading
- [x] WebSocket real-time updates
- [x] Sidebar navigation
- [x] Docker Compose setup for easy deployment
- [x] Backend API service for auto-credentials
- [x] Playwright browser automation
- [ ] Interactive device selection
- [ ] Device detail panel
- [ ] Historical metrics and analytics
- [ ] Export/screenshot functionality
- [ ] Alert notifications
- [ ] Multi-site topology mapping
- [ ] Performance optimization for large networks
- [ ] Advanced layout algorithms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
