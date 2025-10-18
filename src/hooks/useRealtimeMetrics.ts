import { useState, useEffect } from 'react';
import { NetworkMetrics } from '@/types/network.types';
import { streamDeviceMetrics } from '@/services/peplinkApi';

/**
 * Hook for real-time metric updates via WebSocket
 */
export function useRealtimeMetrics(deviceIds: string[], enabled = true) {
  const [metrics, setMetrics] = useState<Map<string, NetworkMetrics>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled || deviceIds.length === 0) {
      setIsConnected(false);
      return;
    }

    setIsConnected(true);

    const ws = streamDeviceMetrics(deviceIds, (deviceId, newMetrics) => {
      setMetrics((prev) => {
        const updated = new Map(prev);
        updated.set(deviceId, newMetrics);
        return updated;
      });
    });

    return () => {
      ws.close();
      setIsConnected(false);
    };
  }, [deviceIds.join(','), enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    metrics,
    isConnected,
  };
}

/**
 * Hook for single device metrics
 */
export function useDeviceMetrics(deviceId: string, enabled = true) {
  const { metrics, isConnected } = useRealtimeMetrics([deviceId], enabled);
  
  return {
    metrics: metrics.get(deviceId) || null,
    isConnected,
  };
}
