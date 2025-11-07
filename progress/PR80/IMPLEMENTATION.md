# PR80: Update AP Details Display and Animation

## Summary
This PR implements enhanced display for Access Point (AP) devices with wireless mesh information and slows down the particle animation for a more subtle visual effect.

## Changes Implemented

### 1. Type Definitions

#### Added to `src/types/incontrol.types.ts`:
- `IC2SSIDConfig` - SSID configuration interface with security settings (WPA3/WPA2/WPA)
- `IC2RadioInfo` - Radio band information (2.4GHz and 5GHz)
- Extended `IC2Interface` with AP-specific fields: `radio_info` and `ssids`

#### Added to `src/types/network.types.ts`:
- `APSSIDInfo` - SSID display information with name, security policy, and enabled status
- `APInterface` - Extended interface for APs with display name, frequencies, SSIDs, client count, and metrics
- Updated `PeplinkDevice` interface to support both `IC2Interface` and `APInterface` types

### 2. Polling Service Updates (`src/services/pollingService.ts`)

Added new methods for AP interface mapping:

- **`mapAPInterface(iface: IC2Interface): APInterface`**
  - Maps standard IC2Interface to enhanced APInterface
  - Sets display name to "Wireless Mesh" for WiFi interfaces
  - Includes frequency bands, SSIDs, client count, and metrics

- **`getAPFrequencies(iface: IC2Interface): string[]`**
  - Extracts enabled frequency bands (2.4GHz, 5GHz) from radio_info
  - Returns array of frequency strings for display

- **`getAPSSIDs(iface: IC2Interface): APSSIDInfo[]`**
  - Maps SSID configurations to display format
  - Includes SSID name, security policy, and enabled status

- **`getSecurityPolicy(ssid: IC2SSIDConfig): string`**
  - Generates security policy string from SSID config
  - Formats as "WPA3/WPA2 - Personal" or "Open" if no security

- **`getConnectedClients(): number`**
  - Placeholder for client count (returns 0)
  - Ready for future API integration

### 3. Particle Animation Speed Reduction

#### `src/lib/animations/ParticleAnimation.ts`:
- Reduced default `particleSpeed` from `2.0` to `0.5` (75% slower)
- Reduced `DRIFT_FREQUENCY` from `0.05` to `0.02` (60% slower vertical drift)
- Reduced `DRIFT_AMPLITUDE` from `0.5` to `0.3` (40% less drift)

These changes create a more subtle, calming animation effect.

#### `src/lib/flow-renderer/components/DeviceDetailsPanel.tsx`:
- Updated `PARTICLE_SPEED` constant from `2` to `0.5`

### 4. Device Details Panel UI Enhancements

Added to `DeviceDetailsPanel.tsx`:

#### Helper Functions:
- `isAccessPoint(device)` - Detects AP devices by model name
- `isAPInterface(iface)` - Type guard for APInterface
- `formatSpeed(mbps)` - Formats speed values (Mbps/Gbps)

#### Visual Elements Added:
1. **Divider** - Horizontal line separator after header
2. **Wireless Mesh Section** (displayed only for AP devices):
   - Status indicator (green/red dot)
   - Frequency bands display (e.g., "2.4GHz + 5GHz")
   - SSID list with security policies
   - Metrics grid (Latency, Upload, Download)
   - Connected clients count

## UI Layout Example

```
┌─────────────────────────────────┐
│  [Animated Header - Particles]  │
│  AP One AC Mini                  │
│  Access Point                    │
├─────────────────────────────────┤ ← New Divider
│                                  │
│  WIRELESS MESH                   │
│  ┌───────────────────────────┐  │
│  │ ● 2.4GHz + 5GHz          │  │
│  │                           │  │
│  │ Corporate-WiFi            │  │
│  │         WPA3/WPA2 - Personal│
│  │ Guest-Network             │  │
│  │         WPA2 - Personal   │  │
│  │                           │  │
│  │ Latency  Upload  Download │  │
│  │ 5ms      100Mbps 250Mbps  │  │
│  │                           │  │
│  │ Connected Clients: 12     │  │
│  └───────────────────────────┘  │
│                                  │
│  CONNECTIONS (3)                 │
│  ...                             │
└─────────────────────────────────┘
```

## Screenshots Required (when connected to InControl)

The following screenshots would be generated when connected to an InControl account with AP devices:

1. **wireless-mesh.png** - Shows the new Wireless Mesh section with frequency bands and SSIDs
2. **slow-animation.gif** - Demonstrates the slowed particle animation (0.5x speed)
3. **ssid-security.png** - Close-up of SSID list with security policies
4. **metrics-clients.png** - Shows real-time metrics and connected client count

## Testing

- ✅ TypeScript compilation successful
- ✅ ESLint passes with no errors
- ✅ Build completes successfully
- ✅ Backward compatible with non-AP devices
- ⏳ Runtime testing requires InControl2 credentials and AP devices

## Technical Notes

### Type Safety
- Used type guards (`isAPInterface`) to safely check interface types
- Extended existing interfaces without breaking changes
- Proper TypeScript generics for union types

### Performance
- No performance impact from slower animation (same particle count)
- AP interface mapping only occurs for AP devices
- Efficient type checking with early returns

### Extensibility
- `getConnectedClients()` method ready for future API integration
- Security policy formatting supports multiple WPA standards
- Frequency detection supports future bands (e.g., 6GHz)

## Dependencies
No new dependencies added. All changes use existing React, TypeScript, and project utilities.

## Browser Compatibility
Particle animation uses standard Canvas API - compatible with all modern browsers.
