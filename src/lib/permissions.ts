export type Role = 'AGENCY_OWNER' | 'AGENCY_ADMIN' | 'SUBACCOUNT_USER' | 'SUBACCOUNT_GUEST'

export const ROLE_HIERARCHY: Record<Role, number> = {
    AGENCY_OWNER: 100,
    AGENCY_ADMIN: 50,
    SUBACCOUNT_USER: 10,
    SUBACCOUNT_GUEST: 1,
}

export const PERMISSION_DOMAINS = [
    {
        id: 'system_billing',
        name: 'System & Billing',
        description: 'Billing, subscriptions, invoices, and system-wide settings',
        minRole: 'AGENCY_OWNER' as Role,
    },
    {
        id: 'team_roles',
        name: 'Team & Roles',
        description: 'Manage team members, roles, and permissions',
        minRole: 'AGENCY_ADMIN' as Role,
    },
    {
        id: 'workspace_settings',
        name: 'Workspace & Settings',
        description: 'Project settings, branding, and workspace configuration',
        minRole: 'AGENCY_ADMIN' as Role,
    },
    {
        id: 'clients_leads',
        name: 'Clients & Leads',
        description: 'Manage contacts, leads, and client lists',
        minRole: 'SUBACCOUNT_USER' as Role,
    },
    {
        id: 'projects_tasks',
        name: 'Projects & Tasks',
        description: 'Create, edit, and manage projects and task boards',
        minRole: 'SUBACCOUNT_USER' as Role,
    },
    {
        id: 'documents_files',
        name: 'Documents & Files',
        description: 'Upload, edit, and share documents',
        minRole: 'SUBACCOUNT_USER' as Role,
    },
    {
        id: 'campaigns_automation',
        name: 'Campaigns & Automation',
        description: 'Marketing campaigns and workflow automations',
        minRole: 'AGENCY_ADMIN' as Role,
    },
    {
        id: 'integrations',
        name: 'Integrations',
        description: 'Connect third-party apps and services',
        minRole: 'AGENCY_ADMIN' as Role,
    },
    {
        id: 'analytics_logs',
        name: 'Analytics & Logs',
        description: 'View reports, traffic, and system logs',
        minRole: 'SUBACCOUNT_USER' as Role,
    },
    {
        id: 'security',
        name: 'Security',
        description: 'Advanced security settings and audit logs',
        minRole: 'AGENCY_ADMIN' as Role,
    },
]

export const canManageRole = (currentUserRole: Role, targetRole: Role) => {
    return ROLE_HIERARCHY[currentUserRole] > ROLE_HIERARCHY[targetRole]
}

export const isAboveCeiling = (currentUserRole: Role, targetRole: Role) => {
    return ROLE_HIERARCHY[currentUserRole] <= ROLE_HIERARCHY[targetRole]
}

export const hasDomainAccess = (userRole: Role, domainId: string) => {
    const domain = PERMISSION_DOMAINS.find((d) => d.id === domainId)
    if (!domain) return false
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[domain.minRole as Role]
}
