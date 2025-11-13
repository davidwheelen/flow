import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useAuth, useDeviceData } from '@/hooks/useInControl2';
import { getGroups } from '@/services/groupsService';
import { SwirlBackground } from '@/components/SwirlBackground';
import { RefreshButton } from '@/components/ui/RefreshButton';
import './Sidebar.css';

// @ts-ignore - Injected at build time via Vite define
const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.3.0';

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
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useAppStore();

  const { isAuthenticated } = useAuth();
  const [isRefreshingGroups, setIsRefreshingGroups] = useState(false);
  
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

  const handleRefreshGroups = async () => {
    if (!isAuthenticated || isRefreshingGroups) return;
    
    setIsRefreshingGroups(true);
    setError(null);
    
    try {
      const groupsData = await getGroups();
      setGroups(groupsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh groups');
    } finally {
      setIsRefreshingGroups(false);
    }
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div 
      className="liquid-glass-sidebar flex flex-col h-full relative transition-all duration-300 ease-in-out"
      style={{
        width: isSidebarCollapsed ? '48px' : '288px',
      }}
    >
      {/* Toggle Handle - Always Visible */}
      <button
        onClick={toggleSidebarCollapse}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 p-2 rounded-lg transition-all hover:scale-110"
        style={{
          background: 'rgba(45, 45, 45, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" style={{ color: '#e0e0e0' }} />
        ) : (
          <ChevronLeft className="w-4 h-4" style={{ color: '#e0e0e0' }} />
        )}
      </button>

      {/* Sidebar Content - Hidden when collapsed */}
      <div 
        className="flex flex-col h-full transition-opacity duration-300"
        style={{
          opacity: isSidebarCollapsed ? 0 : 1,
          pointerEvents: isSidebarCollapsed ? 'none' : 'auto',
        }}
      >
        {/* Flow Title Section */}
        <div className="liquid-glass-panel m-4 overflow-hidden relative" style={{ padding: '8px 16px' }}>
          <SwirlBackground />
          <div className="relative z-10">
            <h2 
              className="font-bold text-2xl" 
              style={{ 
                color: '#e0e0e0', 
                fontFamily: 'Abricos, sans-serif',
                textShadow: '1px 1px 0 rgba(45, 45, 45, 0.25), -1px -1px 0 rgba(45, 45, 45, 0.25), 1px -1px 0 rgba(45, 45, 45, 0.25), -1px 1px 0 rgba(45, 45, 45, 0.25)'
              }}
            >
              Flow
            </h2>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-gray-700 mx-4"></div>

        {/* Network Groups Section */}
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm font-medium" style={{ color: '#a0a0a0' }}>Network Groups</p>
          {isAuthenticated && (
            <RefreshButton
              onClick={handleRefreshGroups}
              isLoading={isRefreshingGroups}
              icon={<RefreshCw size={14} />}
              size="sm"
            />
          )}
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
              <div className="stars-icon-container">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  fill="currentColor" 
                  className="stars-icon" 
                  viewBox="0 0 16 16"
                  style={{ color: '#3b82f6' }}
                >
                  <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
                </svg>
              </div>
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

      {/* Collapsed State Icon - Only visible when collapsed */}
      {isSidebarCollapsed && (
        <div className="flex items-center justify-center h-full">
          <div className="transform -rotate-90 whitespace-nowrap">
            <p 
              className="text-xs font-medium tracking-wider"
              style={{ 
                color: '#a0a0a0',
                textShadow: '1px 1px 0 rgba(45, 45, 45, 0.25), -1px -1px 0 rgba(45, 45, 45, 0.25), 1px -1px 0 rgba(45, 45, 45, 0.25), -1px 1px 0 rgba(45, 45, 45, 0.25)'
              }}
            >
              FLOW
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
