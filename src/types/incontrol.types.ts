/**
 * InControl2 API Type Definitions
 * 
 * These types match the actual InControl2 API response structure.
 */

/**
 * LAN Port data from port_status.lan_list
 */
export interface IC2LanPortStatus {
  id: number;
  enable: boolean;
  linkUp: boolean;
  autoSpeed?: boolean;
  speed?: string; // e.g., "1000FD"
  name?: string;
  vlanMode?: string; // e.g., "trunk"
  mode?: string;
  hardwareInfo?: {
    portType?: string;
    supportSpeed?: string[];
  };
}

/**
 * Port status from device API response
 */
export interface IC2PortStatus {
  count?: number;
  timestamp?: number;
  wan_list?: Record<string, unknown>;
  lan_list?: Record<string, IC2LanPortStatus>;
}

/**
 * LAN Port data from device API proxy (legacy)
 */
export interface IC2LanPort {
  name?: string;
  status?: string;
  speed?: string;
  speed_mbps?: number;
  vlan?: string;
  [key: string]: unknown; // Allow for additional fields from API
}

/**
 * Interface/WAN connection from InControl2 API
 */
export interface IC2Interface {
  id: number;
  type: string; // "gobi", "ethernet", "wifi", "sfp", etc.
  virtualType?: string; // "cellular", "wan", etc.
  status: string; // "Connected", "Disconnected", "Standby"
  last_status?: string;
  name: string;
  ip?: string;
  netmask?: string;
  mac_address?: string; // MAC address of the interface
  conn_mode?: string; // "NAT", "IP Forwarding"
  gateway?: string;
  mtu?: number;
  healthcheck?: string; // "pstr", "ping", etc.
  dns_servers?: string[];
  conn_config_method?: string; // "dhcp", "static", "pppoe"
  carrier_name?: string;
  enable?: boolean;
  // Cellular-specific fields
  signal_strength?: number;
  // Speed/bandwidth fields (if available)
  speed_mbps?: number;
  latency_ms?: number;
  upload_mbps?: number;
  download_mbps?: number;
}

/**
 * Device data from InControl2 API
 */
export interface IC2DeviceData {
  id: number;
  sn: string;
  name: string;
  status: string; // "online", "offline"
  product_id: number;
  product_name: string;
  product_code: string;
  model: string;
  fw_ver: string;
  interfaces?: IC2Interface[]; // Use this instead of wans
  mac_info?: Array<{
    interfaceType: string;
    name: string;
    mac: string;
    connId?: number; // Links to interface.id
  }>;
  lan_mac?: string;
  // Bandwidth data (if available at device level)
  bandwidth?: {
    total_upload_mbps: number;
    total_download_mbps: number;
  };
  // PepVPN connections (if available at device level)
  pepvpn?: Array<{
    id: string;
    remote_name: string;
    remote_device_id?: string;
    status: 'connected' | 'disconnected';
    throughput_mbps?: number;
  }>;
  // LAN ports from device API proxy (legacy)
  lanPorts?: IC2LanPort[];
  // Port status from device API response
  port_status?: IC2PortStatus;
  // VLAN interfaces configuration
  vlan_interfaces?: Array<{
    vlan_id: number;
    vlan_ip?: string;
    netmask?: string;
    vlan_ips?: Array<{
      ip: string;
      netmask: string;
    }>;
  }>;
  // Connected clients count
  client_count?: number;
}
