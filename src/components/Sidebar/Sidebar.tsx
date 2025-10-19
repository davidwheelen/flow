import { useEffect } from 'react';
import { Network, ChevronRight, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuth, useDeviceData } from '@/hooks/useInControl2';
import { getGroups, getDevicesByGroup } from '@/services/incontrolApi';

export function Sidebar() {
  const {
    groups,
    selectedGroup,
    isLoadingGroups,
    isLoadingDevices,
    error,
    setGroups,
    setSelectedGroup,
    setDevices,
    setIsLoadingGroups,
    setIsLoadingDevices,
    setError,
    isSidebarOpen,
  } = useAppStore();

  const { isAuthenticated } = useAuth();
  
  // Use device data polling when authenticated
  const { devices: polledDevices } = useDeviceData(
    selectedGroup?.id || null,
    isAuthenticated
  );

  // Update devices when polled data changes
  useEffect(() => {
    if (isAuthenticated && polledDevices.length > 0) {
      setDevices(polledDevices);
      setIsLoadingDevices(false);
    }
  }, [polledDevices, isAuthenticated, setDevices, setIsLoadingDevices]);

  // Load groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      setIsLoadingGroups(true);
      setError(null);
      
      try {
        const groupsData = await getGroups();
        setGroups(groupsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load groups');
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    loadGroups();
  }, [setGroups, setIsLoadingGroups, setError]);

  const handleGroupSelect = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    setSelectedGroup(group);
    setIsLoadingDevices(true);
    setError(null);
    
    // If authenticated, polling service will handle device loading
    // Otherwise, use the old API method
    if (!isAuthenticated) {
      try {
        const devices = await getDevicesByGroup(groupId);
        setDevices(devices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load devices');
        setDevices([]);
      } finally {
        setIsLoadingDevices(false);
      }
    }
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="liquid-glass-sidebar w-72 flex flex-col h-full">
      {/* Header */}
      <div className="liquid-glass-panel m-4">
        <div className="flex items-center gap-2 mb-2">
          <Network className="w-5 h-5" style={{ color: '#3b82f6' }} />
          <h2 className="font-semibold" style={{ color: '#e0e0e0' }}>Flow</h2>
        </div>
        <p className="text-xs" style={{ color: '#a0a0a0' }}>Network Groups</p>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto px-4">
        {isLoadingGroups ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#3b82f6' }} />
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="liquid-glass-card" style={{ 
              background: 'rgba(239, 68, 68, 0.2)',
              borderColor: 'rgba(239, 68, 68, 0.5)'
            }}>
              <p className="text-sm" style={{ color: '#fca5a5' }}>{error}</p>
              <button
                onClick={() => {
                  const loadGroups = async () => {
                    setIsLoadingGroups(true);
                    setError(null);
                    
                    try {
                      const groupsData = await getGroups();
                      setGroups(groupsData);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to load groups');
                    } finally {
                      setIsLoadingGroups(false);
                    }
                  };
                  loadGroups();
                }}
                className="mt-2 text-xs underline"
                style={{ color: '#fca5a5' }}
              >
                Retry
              </button>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="p-4 text-center text-sm" style={{ color: '#a0a0a0' }}>
            No groups found
          </div>
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                className={`
                  liquid-glass-card w-full text-left transition-all
                  ${selectedGroup?.id === group.id ? 'selected-group' : ''}
                `}
                style={{
                  background: selectedGroup?.id === group.id 
                    ? 'rgba(59, 130, 246, 0.25)' 
                    : 'rgba(255, 255, 255, 0.18)',
                  borderColor: selectedGroup?.id === group.id
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate font-medium" style={{ 
                      color: selectedGroup?.id === group.id ? '#93c5fd' : '#e0e0e0' 
                    }}>
                      {group.name}
                    </div>
                    {group.description && (
                      <div className="text-xs truncate mt-0.5" style={{ color: '#a0a0a0' }}>
                        {group.description}
                      </div>
                    )}
                    <div className="liquid-glass-pill inline-block mt-1.5" style={{ fontSize: '11px' }}>
                      <span style={{ color: '#e0e0e0' }}>
                        {group.device_count} {group.device_count === 1 ? 'device' : 'devices'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ml-2 flex-shrink-0 transition-opacity ${
                      selectedGroup?.id === group.id ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ color: '#93c5fd' }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedGroup && (
        <div className="liquid-glass-panel m-4">
          <div className="text-xs" style={{ color: '#a0a0a0' }}>
            <div className="font-medium mb-1">Selected:</div>
            <div className="truncate" style={{ color: '#e0e0e0' }}>{selectedGroup.name}</div>
          </div>
          {isLoadingDevices && (
            <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: '#3b82f6' }}>
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading devices...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
