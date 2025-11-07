# AP WiFi Mesh Connection Status Implementation

## Summary
This PR implements proper handling of AP (Access Point) WiFi mesh connections in the pollingService.ts file. The changes enable the system to correctly detect AP devices, handle their WiFi mesh connections, and build proper network topology for AP mesh networks.

## Changes Made

### 1. Import Addition
Added `ConnectionStatus` type import to properly type connection status variables.

### 2. mapDevice() Method Updates

#### AP Device Detection
The method now detects AP devices by checking if the model name contains "ap one" or "ap pro":
```typescript
const isAccessPoint = device.model.toLowerCase().includes('ap one') || 
                     device.model.toLowerCase().includes('ap pro');
```

#### Interface Handling for APs
For AP devices, the method now:
- **Hardwired WAN**: Detects ethernet WAN connections
- **WiFi Mesh**: Detects WiFi/WLAN interfaces and marks them as connected if the device is online
- **Status Logic**: 
  - If the AP is online and has a WiFi interface → status = 'connected'
  - If the AP is offline → all connections status = 'disconnected'
  - Regular devices continue to use interface-level status

#### Regular Device Handling
Regular (non-AP) devices continue to work as before:
- WAN interfaces are mapped normally
- Cellular, WiFi, and SFP connections are detected as before
- Connection status is based on interface status

### 3. buildConnectionGraph() Method Updates

#### WiFi Mesh Topology Creation
Added logic to create WiFi mesh connections for online AP devices:
- Identifies online AP devices
- Finds potential mesh partners:
  - Balance routers (devices with "balance" in model name)
  - Other AP devices
- Creates WiFi connections from AP to target devices
- Only creates connections when both devices are online

## Expected Behavior

### For AP Devices
1. **Detection**: AP One and AP Pro models are automatically detected
2. **WAN Connection**: If AP has ethernet WAN port connected, it will show as 'wan' type
3. **WiFi Mesh**: If AP is online, WiFi interface shows as 'connected'
4. **Topology**: Online APs create mesh connections to:
   - Balance routers (primary connection)
   - Other APs (mesh extension)

### For Regular Devices
1. **No Change**: Regular devices (Balance, MAX, etc.) continue to work as before
2. **Connection Types**: WAN, Cellular, WiFi, SFP connections work normally
3. **Status**: Based on interface-level status from API

## Testing

### Build and Lint
- ✅ TypeScript compilation successful
- ✅ ESLint checks passed
- ✅ No new warnings or errors

### Code Quality
- Minimal changes to existing code
- Backward compatible with non-AP devices
- Clear separation of AP vs regular device logic
- Proper typing with ConnectionStatus

## Screenshots Required

The following screenshots would demonstrate the functionality (cannot be captured without live InControl environment):

### 1. ap-mesh-connections.png
Would show:
- AP devices with WiFi mesh connections
- Green/connected status for online APs
- Mesh connections between APs and Balance routers
- Mesh connections between multiple APs

### 2. ap-wan-status.png
Would show:
- AP device with hardwired WAN connection
- AP device with WiFi mesh connection
- Connection status (connected/disconnected) based on device status
- Interface details in the connection panel

### 3. connection-debug.png
Would show console output:
```
Connection graph built: [
  {
    name: "AP One AC Mini",
    connections: [
      { type: "wifi", status: "connected", device_id: "123" },
      { type: "wan", status: "connected", device_id: undefined }
    ]
  },
  {
    name: "Balance 310X",
    connections: [
      { type: "wan", status: "connected", device_id: undefined },
      { type: "lan", status: "connected", device_id: "456" }
    ]
  }
]
```

### 4. full-topology.png
Would show:
- Complete network topology with all device types
- Balance router at center
- APs connected via WiFi mesh
- Regular devices with WAN/cellular connections
- Color coding for connection types
- Status indicators for all connections

## Implementation Details

### Connection Status Logic
```typescript
// For APs with WiFi interfaces:
if (isAccessPoint && device.status === 'online') {
  connStatus = 'connected'; // WiFi mesh is active
}

// For offline APs:
if (device.status !== 'online') {
  connStatus = 'disconnected'; // All connections down
}

// For regular devices:
connStatus = iface.status === 'connected' ? 'connected' : 'disconnected';
```

### Mesh Topology Creation
```typescript
// Find mesh partners for online APs:
- Balance routers (primary upstream)
- Other online APs (mesh extension)

// Create bidirectional WiFi connections:
AP → Router (WiFi connection)
AP1 → AP2 (mesh extension)
```

## Benefits

1. **Proper AP Support**: APs are now handled correctly with mesh-specific logic
2. **Accurate Status**: Connection status reflects actual device online/offline state
3. **Mesh Topology**: Visualizes WiFi mesh networks properly
4. **Backward Compatible**: Existing device types continue to work unchanged
5. **Extensible**: Easy to add support for more AP models in the future

## Future Enhancements

Possible future improvements:
- Add support for more AP models (AP Mini, AP XR, etc.)
- Show signal strength for WiFi mesh connections
- Display mesh hop count for multi-hop mesh networks
- Add mesh bandwidth utilization metrics
- Support for mesh roaming events
