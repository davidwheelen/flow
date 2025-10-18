import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkDiagram from './components/NetworkDiagram/NetworkDiagram';
import MetricsPanel from './components/MetricsPanel/MetricsPanel';
import { useNetworkData } from './hooks/useNetworkData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function NetworkApp() {
  const { devices, isLoading, isError } = useNetworkData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading network data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error loading network data</p>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <NetworkDiagram devices={devices} />
      <MetricsPanel devices={devices} lastUpdated={new Date()} />
    </div>
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
