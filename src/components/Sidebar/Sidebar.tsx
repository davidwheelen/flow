import { useState, useEffect } from 'react';
import { Menu, X, RefreshCw, Settings } from 'lucide-react';
import { Organization, Group, ApiConfig } from '@/types/incontrol.types';
import { getOrganizations, getGroups } from '@/services/peplinkApi';
import OrganizationTree from './OrganizationTree';
import ConnectionStatus from '../Settings/ConnectionStatus';
import styles from './Sidebar.module.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedOrgId: string | null;
  selectedGroupId: string | null;
  onSelectOrganization: (orgId: string) => void;
  onSelectGroup: (groupId: string) => void;
  onOpenSettings: () => void;
  apiConfig: ApiConfig;
}

function Sidebar({
  collapsed,
  onToggle,
  selectedOrgId,
  selectedGroupId,
  onSelectOrganization,
  onSelectGroup,
  onOpenSettings,
  apiConfig,
}: SidebarProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [groupsMap, setGroupsMap] = useState<Map<string, Group[]>>(new Map());
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations();
  }, [apiConfig.useMockData]); // Reload when mock mode changes

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const orgs = await getOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organizations');
      console.error('Error loading organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load groups when organization is expanded
  const handleToggleOrganization = async (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    
    if (expandedOrgs.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
      
      // Load groups if not already loaded
      if (!groupsMap.has(orgId)) {
        setLoadingGroups(true);
        try {
          const groups = await getGroups(orgId);
          setGroupsMap(new Map(groupsMap).set(orgId, groups));
        } catch (err) {
          console.error('Error loading groups:', err);
        } finally {
          setLoadingGroups(false);
        }
      }
    }
    
    setExpandedOrgs(newExpanded);
  };

  const handleRefresh = () => {
    loadOrganizations();
    setGroupsMap(new Map()); // Clear cached groups
    setExpandedOrgs(new Set()); // Collapse all
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && (
        <div className={styles.overlay} onClick={onToggle} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <Menu className="w-5 h-5" />
            <span className={styles.title}>Flow</span>
          </div>
          <button className={styles.collapseButton} onClick={onToggle}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={styles.statusSection}>
          <ConnectionStatus
            isConnected={!error && organizations.length > 0}
            error={error || undefined}
            useMockData={apiConfig.useMockData}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Organizations</span>
            {organizations.length > 0 && (
              <span className={styles.badge}>{organizations.length}</span>
            )}
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>Loading organizations...</span>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>Failed to load organizations</p>
              <button onClick={loadOrganizations} className={styles.retryButton}>
                Retry
              </button>
            </div>
          ) : (
            <OrganizationTree
              organizations={organizations}
              groups={groupsMap}
              selectedOrgId={selectedOrgId}
              selectedGroupId={selectedGroupId}
              expandedOrgs={expandedOrgs}
              onSelectOrganization={onSelectOrganization}
              onSelectGroup={onSelectGroup}
              onToggleOrganization={handleToggleOrganization}
              loadingGroups={loadingGroups}
            />
          )}
        </div>

        <div className={styles.footer}>
          <button
            onClick={handleRefresh}
            className={styles.footerButton}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenSettings}
            className={styles.footerButton}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Toggle button when collapsed */}
      {collapsed && (
        <button className={styles.toggleButton} onClick={onToggle}>
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

export default Sidebar;
