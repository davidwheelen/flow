import { useState, useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FolderOpen } from 'lucide-react';
import NetworkDiagram from './components/NetworkDiagram/NetworkDiagram';
import MetricsPanel from './components/MetricsPanel/MetricsPanel';
import Sidebar from './components/Sidebar/Sidebar';
import SettingsModal from './components/Settings/SettingsModal';
import EmptyState from './components/EmptyState/EmptyState';
import { useNetworkData } from './hooks/useNetworkData';
import { setMockDataMode } from './services/peplinkApi';
import { ApiConfig } from './types/incontrol.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function NetworkApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Load API config from localStorage or use defaults
  const getInitialConfig = (): ApiConfig => {
    const stored = localStorage.getItem('apiConfig');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored config:', e);
      }
    }
    return {
      baseUrl: import.meta.env.VITE_IC_API_URL || 'https://api.ic.peplink.com/api',
      clientId: import.meta.env.VITE_IC_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_IC_CLIENT_SECRET || '',
      useMockData: import.meta.env.VITE_USE_MOCK_DATA !== 'false', // Default to true
    };
  };

  const [apiConfig, setApiConfig] = useState<ApiConfig>(getInitialConfig);

  // Set mock data mode on mount and when config changes
  useEffect(() => {
    setMockDataMode(apiConfig.useMockData);
  }, [apiConfig.useMockData]);

  const { devices, isLoading, isError } = useNetworkData(selectedGroupId);

  const handleSelectOrganization = useCallback((orgId: string) => {
    setSelectedOrgId(orgId);
    // Clear group selection when switching organizations
    if (selectedOrgId !== orgId) {
      setSelectedGroupId(null);
    }
  }, [selectedOrgId]);

  const handleSelectGroup = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
  }, []);

  const handleSaveSettings = useCallback((config: ApiConfig) => {
    setApiConfig(config);
    // Store in localStorage for persistence
    localStorage.setItem('apiConfig', JSON.stringify(config));
  }, []);

  // Main content area
  const renderMainContent = () => {
    if (!selectedGroupId && !apiConfig.useMockData) {
      return (
        <EmptyState
          icon={FolderOpen}
          title="No Group Selected"
          message="Select an organization and group from the sidebar to view devices"
        />
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading network data...</p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading network data</p>
            <p className="text-gray-600">Please check your connection and try again.</p>
          </div>
        </div>
      );
    }

    if (devices.length === 0) {
      return (
        <EmptyState
          icon={FolderOpen}
          title="No Devices Found"
          message="This group doesn't have any devices yet"
        />
      );
    }

    return (
      <>
        <NetworkDiagram devices={devices} groupId={selectedGroupId} />
        <MetricsPanel devices={devices} lastUpdated={new Date()} />
      </>
    );
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          selectedOrgId={selectedOrgId}
          selectedGroupId={selectedGroupId}
          onSelectOrganization={handleSelectOrganization}
          onSelectGroup={handleSelectGroup}
          onOpenSettings={() => setSettingsOpen(true)}
          apiConfig={apiConfig}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? 'ml-0' : 'ml-[280px]'
          }`}
          style={{ height: '100vh' }}
        >
          {renderMainContent()}
        </main>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        initialConfig={apiConfig}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkApp />
    </QueryClientProvider>
  );
}

export default App;
