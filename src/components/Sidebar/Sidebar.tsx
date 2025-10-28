import { useEffect } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuth, useDeviceData } from '@/hooks/useInControl2';
import { getGroups } from '@/services/groupsService';
import { SwirlBackground } from '@/components/SwirlBackground';
import './Sidebar.css';

const APP_VERSION = '0.1.0';

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

  // Load groups on mount when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear groups when not authenticated
      setGroups([]);
      setError(null);
      return;
    }

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
  }, [isAuthenticated, setGroups, setIsLoadingGroups, setError]);

  const handleGroupSelect = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    setSelectedGroup(group);
    setIsLoadingDevices(true);
    setError(null);
    
    // Polling service will handle device loading automatically
    // The useDeviceData hook (lines 26-37) starts polling when selectedGroup changes
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="liquid-glass-sidebar w-72 flex flex-col h-full">
      {/* Flow Title Section */}
      <div className="liquid-glass-panel m-4 overflow-hidden relative" style={{ padding: '8px 16px' }}>
        <SwirlBackground />
        <div className="relative z-10">
          <h2 className="font-bold text-2xl" style={{ color: '#e0e0e0', fontFamily: 'Abricos, sans-serif' }}>
            Flow
          </h2>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="border-t border-gray-700 mx-4"></div>

      {/* Network Groups Section */}
      <div className="px-4 py-3">
        <p className="text-sm font-medium" style={{ color: '#a0a0a0' }}>Network Groups</p>
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
            {!isAuthenticated 
              ? 'Configure your InControl2 credentials in Settings to get started.'
              : 'No groups found'}
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
                    <div 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mt-1.5" 
                      style={{ 
                        fontSize: '11px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      <span style={{ color: '#93c5fd', fontWeight: '500' }}>
                        {group.device_count}
                      </span>
                      <span style={{ color: '#a0a0a0' }}>
                        {group.device_count === 1 ? 'device' : 'devices'}
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

      {/* Version Footer */}
      <div className="liquid-glass-panel m-4 mt-auto">
        <div className="flex items-center justify-between text-xs" style={{ color: '#a0a0a0' }}>
          <div className="flex items-center gap-2">
            <span style={{ color: '#3b82f6' }}>✦</span>
            <span>v{APP_VERSION}</span>
          </div>
          <button 
            className="text-xs hover:underline"
            style={{ color: '#3b82f6' }}
            onClick={() => window.open('https://github.com/davidwheelen/flow/releases', '_blank')}
          >
            What's new
          </button>
        </div>
      </div>
    </div>
  );
}
