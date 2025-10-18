import { Building2, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { Organization, Group } from '@/types/incontrol.types';
import styles from './OrganizationTree.module.css';

interface OrganizationTreeProps {
  organizations: Organization[];
  groups: Map<string, Group[]>;
  selectedOrgId: string | null;
  selectedGroupId: string | null;
  expandedOrgs: Set<string>;
  onSelectOrganization: (orgId: string) => void;
  onSelectGroup: (groupId: string) => void;
  onToggleOrganization: (orgId: string) => void;
  loadingGroups: boolean;
}

function OrganizationTree({
  organizations,
  groups,
  selectedOrgId,
  selectedGroupId,
  expandedOrgs,
  onSelectOrganization,
  onSelectGroup,
  onToggleOrganization,
  loadingGroups,
}: OrganizationTreeProps) {
  return (
    <div className={styles.tree}>
      {organizations.length === 0 ? (
        <div className={styles.emptyMessage}>No organizations found</div>
      ) : (
        organizations.map((org) => {
          const isExpanded = expandedOrgs.has(org.id);
          const orgGroups = groups.get(org.id) || [];

          return (
            <div key={org.id} className={styles.orgItem}>
              <div
                className={`${styles.orgHeader} ${selectedOrgId === org.id ? styles.selected : ''}`}
                onClick={() => {
                  onSelectOrganization(org.id);
                  onToggleOrganization(org.id);
                }}
              >
                <button className={styles.expandButton}>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <Building2 className="w-4 h-4" />
                <span className={styles.orgName}>{org.name}</span>
                <span className={styles.count}>{org.deviceCount}</span>
              </div>

              {isExpanded && (
                <div className={styles.groupList}>
                  {loadingGroups && selectedOrgId === org.id ? (
                    <div className={styles.loading}>Loading groups...</div>
                  ) : orgGroups.length === 0 ? (
                    <div className={styles.emptyGroups}>No groups found</div>
                  ) : (
                    orgGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`${styles.groupItem} ${
                          selectedGroupId === group.id ? styles.selectedGroup : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectGroup(group.id);
                        }}
                      >
                        <FolderOpen className="w-4 h-4" />
                        <span className={styles.groupName}>{group.name}</span>
                        <span className={styles.count}>{group.deviceCount}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default OrganizationTree;
