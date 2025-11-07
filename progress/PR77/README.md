# PR77 - AP WiFi Mesh Connection Status Handling

## Changes Made

### Updated pollingService.ts

1. **mapDevice method**: 
   - Added detection for AP devices (AP One, AP Pro)
   - Special handling for AP WiFi mesh connections
   - WiFi mesh status is based on device online state
   - Physical WAN port status uses interface status
   - Other interfaces are skipped for APs

2. **buildConnectionGraph method**:
   - Added AP mesh connection logic at the beginning
   - Creates WiFi connections between online APs and routers/other APs
   - Preserves existing WAN/LAN connection logic for non-AP devices
   - Enhanced logging to include model and status information

## Key Features

- Properly identifies AP devices by model name (ap one, ap pro)
- Shows correct WiFi mesh connection status based on device online state
- Creates appropriate WiFi mesh connections in the topology
- Keeps existing WAN port status for hardwired connections
- Doesn't break existing device connection handling

## Screenshots

Note: Screenshots would show:
1. **ap-mesh-topology.png** - AP mesh network connections in the topology view
2. **ap-connection-states.png** - Both WiFi and WAN connection states for AP devices
3. **debug-output.png** - Console logs showing connection detection for APs
4. **full-network.png** - Complete network topology with all connections

These screenshots require a live environment with actual AP devices connected to demonstrate the functionality.

## Testing

The code has been:
- Linted successfully with no errors
- Built successfully with TypeScript compiler
- Changes are minimal and focused on the specific issue

## Technical Details

### AP Device Detection
```typescript
const isAccessPoint = device.model.toLowerCase().includes('ap one') || 
                     device.model.toLowerCase().includes('ap pro');
```

### WiFi Mesh Status Logic
For AP devices with WiFi interfaces:
- If device status is "online", WiFi mesh is "connected"
- If device status is not "online", WiFi mesh is "disconnected"

### Connection Graph Building
1. First pass: Handle AP mesh connections
   - Find online APs
   - Connect them to online routers (Balance) or other APs
   - Create WiFi type connections

2. Second pass: Handle regular WAN/LAN connections
   - Existing logic preserved for Balance routers
   - Non-AP device connections remain unchanged

