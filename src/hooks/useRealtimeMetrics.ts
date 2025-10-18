import { useState, useEffect } from 'react';
import { NetworkMetrics } from '@/types/network.types';
import { generateRealtimeMetrics } from '@/utils/mockData';

/**
 * Hook for simulating real-time metric updates
 * WebSocket ready structure for future implementation
 */
export function useRealtimeMetrics(deviceId: string, enabled = true) {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Simulate WebSocket connection
    setIsConnected(true);

    // Generate initial metrics
    setMetrics(generateRealtimeMetrics());

    // Simulate real-time updates every 2 seconds
    const intervalId = setInterval(() => {
      setMetrics(generateRealtimeMetrics());
    }, 2000);

    return () => {
      clearInterval(intervalId);
      setIsConnected(false);
    };
  }, [deviceId, enabled]);

  return {
    metrics,
    isConnected,
  };
}

/**
 * Future WebSocket implementation structure
 */
export function connectToMetricsWebSocket(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _deviceId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onMessage: (metrics: NetworkMetrics) => void
): () => void {
  // TODO: Implement real WebSocket connection
  // const ws = new WebSocket(`wss://api.ic.peplink.com/metrics/${deviceId}`);
  
  // ws.onmessage = (event) => {
  //   const metrics = JSON.parse(event.data);
  //   onMessage(metrics);
  // };

  // ws.onerror = (error) => {
  //   console.error('WebSocket error:', error);
  // };

  // Return cleanup function
  return () => {
    // ws.close();
  };
}
