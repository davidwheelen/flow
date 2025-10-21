/**
 * Comprehensive device connection types for Peplink devices
 */

// Physical connection types
export type PhysicalConnectionType = 
  | 'wan'        // WAN Ethernet port
  | 'lan'        // LAN Ethernet port
  | 'sfp'        // SFP/SFP+ fiber port
  | 'usb'        // USB port (for modems, storage, etc.)
  | 'console';   // Console/serial port

// Wireless connection types
export type WirelessConnectionType =
  | 'cellular'        // Cellular modem (general)
  | 'wifi_wan'        // WiFi as WAN
  | 'wifi_lan'        // WiFi as LAN/AP
  | 'wifi_2_4ghz'     // 2.4 GHz WiFi
  | 'wifi_5ghz'       // 5 GHz WiFi
  | 'wifi_6ghz';      // 6 GHz WiFi (WiFi 6E)

// Virtual/VPN connection types
export type VirtualConnectionType =
  | 'speedfusion'  // SpeedFusion VPN
  | 'pepvpn'       // PepVPN
  | 'ipsec'        // IPsec VPN
  | 'openvpn'      // OpenVPN
  | 'gre';         // GRE tunnel

// All connection types combined
export type ConnectionType = 
  | PhysicalConnectionType 
  | WirelessConnectionType 
  | VirtualConnectionType;

/**
 * Device connection specifications
 * Defines the available connection types and their counts for a device
 */
export interface DeviceConnectionSpec {
  // Physical connections
  wan?: number;           // Number of WAN ports
  lan?: number;           // Number of LAN ports
  sfp?: number;           // Number of SFP/SFP+ ports
  usb?: number;           // Number of USB ports
  console?: number;       // Number of console ports (typically 1)

  // Wireless connections
  cellular?: number;      // Number of cellular modems
  wifi_wan?: number;      // WiFi as WAN capability
  wifi_lan?: number;      // WiFi as LAN/AP capability
  wifi_2_4ghz?: number;   // 2.4 GHz radios
  wifi_5ghz?: number;     // 5 GHz radios
  wifi_6ghz?: number;     // 6 GHz radios (WiFi 6E)

  // Virtual connections (typically unlimited but noted as capability)
  speedfusion?: boolean;  // SpeedFusion support
  pepvpn?: boolean;       // PepVPN support
  ipsec?: boolean;        // IPsec VPN support
  openvpn?: boolean;      // OpenVPN support
  gre?: boolean;          // GRE tunnel support
}

/**
 * Complete device specification including model info and connections
 */
export interface DeviceSpecification {
  model: string;                      // Device model name
  family: string;                     // Product family (Balance, MAX, AP One, etc.)
  icon: string;                       // Icon file name (from isoflow-default)
  connectionSpec: DeviceConnectionSpec; // Connection specifications
}
