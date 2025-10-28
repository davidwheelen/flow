/**
 * InControl2 API Type Definitions
 * 
 * These types match the actual InControl2 API response structure.
 */

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
}
