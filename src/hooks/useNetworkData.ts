import { useQuery } from '@tanstack/react-query';
import { getDevices } from '@/services/peplinkApi';
import { PeplinkDevice } from '@/types/network.types';

export function useNetworkData(groupId?: string | null) {
  const {
    data: devices,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PeplinkDevice[], Error>({
    queryKey: ['network-devices', groupId],
    queryFn: () => getDevices(groupId),
    enabled: !!groupId || groupId === null, // Enable when groupId is provided or null (mock mode)
    refetchInterval: 5000, // Auto-refresh every 5 seconds for real-time feel
    staleTime: 3000,
  });

  return {
    devices: devices || [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
