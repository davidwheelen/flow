# AP WAN Status Screenshot

## What This Would Show:

This screenshot would demonstrate the AP connection states, showing both hardwired WAN and WiFi mesh connections.

### Expected Elements:

1. **AP Device Panel**
   - Device name: e.g., "AP One AC Mini - Office"
   - Model information
   - Firmware version
   - Online/offline status

2. **Connection List**
   - **Hardwired WAN** (if available)
     - Type: WAN (Ethernet)
     - Status: Connected/Disconnected
     - IP Address
     - Speed: e.g., 1000 Mbps
     
   - **WiFi Mesh Connection**
     - Type: WiFi
     - Status: Connected (when device is online)
     - Metrics: Speed, Latency, Upload/Download
     - Connected to: "Balance 310X" (or other device)

3. **Status Logic Display**
   - For online AP with WiFi interface: Status = "Connected"
   - For offline AP: All connections = "Disconnected"
   - For hardwired WAN: Uses interface status
   - Visual indicators matching connection status

4. **Connection Details**
   - Interface ID
   - MAC Address
   - Connection method (DHCP/Static)
   - Gateway information
   - DNS servers

### Key Features Demonstrated:
- Dual connection support (WAN + WiFi mesh)
- Status correctly reflects device state
- Different connection types clearly labeled
- Metrics displayed for each connection
- Online/offline state propagation

### Status Logic:
```typescript
// For AP WiFi connections:
if (device.status?.toLowerCase() === 'online') {
  connStatus = 'connected';
}

// For offline APs:
if (device.status?.toLowerCase() !== 'online') {
  connStatus = 'disconnected';
}
```

### Without Live Environment:
Cannot capture actual screenshot as it requires:
- Active InControl2 account
- AP device with both WAN and WiFi interfaces
- Live network connection
- Running Flow application

### Example Connection States:

**Scenario 1: Online AP with Mesh**
```
Device: AP One AC Mini
Status: Online

Connections:
- WiFi Mesh → Connected (to Balance 310X)
  Speed: 866 Mbps
  Latency: 2ms
  
- WAN (Ethernet) → Disconnected
```

**Scenario 2: Online AP with Hardwired WAN**
```
Device: AP Pro
Status: Online

Connections:
- WAN (Ethernet) → Connected
  IP: 192.168.1.50
  Speed: 1000 Mbps
  Gateway: 192.168.1.1
  
- WiFi Mesh → Connected (to AP One)
  Speed: 1200 Mbps
```

**Scenario 3: Offline AP**
```
Device: AP One AC Mini
Status: Offline

Connections:
- WiFi Mesh → Disconnected
- WAN (Ethernet) → Disconnected
```
