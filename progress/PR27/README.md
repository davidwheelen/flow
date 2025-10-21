# PR27: Comprehensive Device Connection Types and Specifications

## Overview
This PR implements a complete device connection types system for all 50+ Peplink device models with proper icon mappings from the isoflow-default icon pack.

## Implementation Details

### Files Created

#### 1. `src/types/connectionTypes.ts`
Defines comprehensive connection type interfaces:
- **Physical Connections**: WAN, LAN, SFP, USB, Console
- **Wireless Connections**: Cellular, WiFi (2.4GHz, 5GHz, 6GHz), WiFi as WAN/LAN
- **Virtual Connections**: SpeedFusion, PepVPN, IPsec, OpenVPN, GRE
- **DeviceConnectionSpec Interface**: Structured specification for device capabilities
- **DeviceSpecification Interface**: Complete device model specification

#### 2. `src/data/deviceSpecifications.ts`
Complete specifications database for all Peplink devices:
- **Balance Series (20-710)**: 14 models - Small to high-performance routers
- **Balance Enterprise (1350-EPX)**: 9 models - Data center and SD-WAN load balancers
- **MAX BR1 Series**: 7 variants - Compact cellular routers
- **MAX BR2 Series**: 3 models - Dual cellular routers
- **MAX HD Series**: 5 models - High-density cellular routers
- **MAX Dome Series**: 3 models - Marine/outdoor cellular routers
- **MAX Transit Series**: 2 models - Mobile/vehicle cellular routers
- **Adapters**: 2 models - MAX Adapter and POTS Adapter
- **AP One Series**: 5 models - WiFi access points
- **Switch Series**: 4 models - Network switches

Total: **54 device models** with complete specifications

#### 3. `src/types/network.types.ts` (Updated)
- Added import for `DeviceConnectionSpec`
- Extended `PeplinkDevice` interface with optional `connectionSpec` property

### Icon Mappings

All devices are mapped to appropriate isoflow-default icons:

| Icon | File | Device Types |
|------|------|--------------|
| 📡 | `router.svg` | Balance 20-710 series |
| ⚖️ | `loadbalancer.svg` | Balance 1350+, SDX, EPX (enterprise) |
| 🔷 | `cube.svg` | MAX series, Domes, Transit, Adapters |
| 📶 | `pyramid.svg` | AP One access points |
| 🔌 | `switch-module.svg` | Switch models |

### Connection Type Categories

#### Physical Connections
- WAN ports (1-16)
- LAN ports (1-48)
- SFP/SFP+ fiber ports
- USB ports
- Console ports

#### Wireless Connections
- Cellular modems (1-4, including 5G)
- WiFi 2.4 GHz radios
- WiFi 5 GHz radios
- WiFi 6 GHz radios (WiFi 6E)
- WiFi as WAN capability
- WiFi as LAN/AP capability

#### Virtual/VPN Connections
- SpeedFusion (bonding VPN)
- PepVPN (site-to-site)
- IPsec VPN
- OpenVPN
- GRE tunnels

## Utility Functions

### `getDeviceSpecification(model: string)`
Retrieve complete specifications for a device by model name.

### `getDevicesByFamily(family: string)`
Get all devices in a product family (Balance, MAX, AP One, Switch, Adapter).

### `getDeviceIcon(model: string)`
Get the full icon path for a device model.

## Testing

- ✅ TypeScript compilation successful
- ✅ ESLint validation passed
- ✅ Build completed without errors
- ✅ All 54 device models included
- ✅ Icon mappings verified

## Screenshots

### 1. Device Specifications Table (1920x1080)
Comprehensive table showing connection counts for all device models.

### 2. Device Detail Panel (800x1000)
Example device detail view showing specifications for Balance 380.

### 3. Icon Mapping Showcase (1600x900)
Visual grid demonstrating icon assignments for all device families.

### 4. Connection Types Legend (1200x800)
Visual guide to all connection types with descriptions.

### 5. Device Comparison (1400x900)
Side-by-side comparison of representative devices from each family.

## Benefits

1. **Comprehensive Coverage**: All 50+ Peplink device models included
2. **Type Safety**: Full TypeScript interfaces for connection specifications
3. **Extensibility**: Easy to add new devices or connection types
4. **Icon Consistency**: Proper mapping to isoflow-default icons
5. **Developer Friendly**: Utility functions for easy specification lookup
6. **Documentation**: Clear connection type categorization

## Future Enhancements

Potential uses of this data:
- Auto-populate device panels with connection counts
- Validate connection configurations against device specs
- Generate topology diagrams with accurate port counts
- Filter devices by capability (e.g., "show all 5G devices")
- Connection compatibility checking

## Notes

- Icons are referenced from `/iconpacks/isoflow-default/` (not modified)
- Connection specifications match official Peplink documentation
- All boolean VPN capabilities indicate support (not count)
- WiFi radios counted by frequency band
- Enterprise models (loadbalancer icon) have higher port counts and SFP support
