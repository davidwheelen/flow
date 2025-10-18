import { useEffect } from 'react';
import { Network, ChevronRight, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
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
    
    try {
      const devices = await getDevicesByGroup(groupId);
      setDevices(devices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
      setDevices([]);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Network className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Flow</h2>
        </div>
        <p className="text-xs text-gray-500">InControl Groups</p>
      </div>

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingGroups ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
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
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Retry
              </button>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No groups found
          </div>
        ) : (
          <div className="p-2">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors
                  ${
                    selectedGroup?.id === group.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{group.name}</div>
                    {group.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {group.description}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-0.5">
                      {group.device_count} {group.device_count === 1 ? 'device' : 'devices'}
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ml-2 flex-shrink-0 transition-opacity ${
                      selectedGroup?.id === group.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedGroup && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600">
            <div className="font-medium mb-1">Selected:</div>
            <div className="truncate">{selectedGroup.name}</div>
          </div>
          {isLoadingDevices && (
            <div className="flex items-center gap-2 mt-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading devices...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
