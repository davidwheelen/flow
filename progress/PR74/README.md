# PR74: Debugging Logs for Connection Creation

This PR adds comprehensive debugging logs to track connection creation between devices.

## Changes Made

### 1. pollingService.ts - buildConnectionGraph() method
Added detailed logging that tracks:
- When the connection graph build process starts
- Each device being processed with its name and model
- Device interfaces with type, status, and MAC address
- LAN clients found for each device
- Current connections for each device

### 2. pollingService.ts - createDeviceConnection() method
Added logging for:
- Connection creation attempts
- Source device (name and model)
- Target device (name and model)
- Determined connection type (wan, lan, cellular, wifi, sfp)

### 3. ConnectionLines.tsx component
Added rendering logs that show:
- When connection lines are being rendered
- All devices with their names and connections

## Debug Output Structure

### Connection Graph Build
```
=== Starting Connection Graph Build ===

Device: [DeviceName] ([DeviceModel])
Interfaces: [Array of interface objects with type, status, mac]
LAN Clients: [Array of LAN client objects]
Current Connections: [Array of connection objects]
```

### Connection Creation
```
Attempting to create connection:
  From: [SourceDevice] ([SourceModel])
  To: [TargetDevice] ([TargetModel])
  Connection Type: [Type]
```

### Rendering
```
=== Rendering Connection Lines ===
Devices: [Array of devices with names and connections]
```

## Required Screenshots

Screenshots should be placed in this directory with the following names:
1. `console-logs.png` - Show the debug output in browser console
2. `device-data.png` - Show the device data structure
3. `connection-creation.png` - Show the connection creation logs
4. `rendering-debug.png` - Show the rendering process logs

## Testing

To see these logs:
1. Run the application with `npm run dev`
2. Open browser developer tools (F12)
3. Navigate to the Console tab
4. Login to the application
5. Select a group with devices
6. Observe the debug output in the console

The logs will appear:
- When devices are polled (every 30 seconds)
- When the connection graph is built
- When connection lines are rendered
