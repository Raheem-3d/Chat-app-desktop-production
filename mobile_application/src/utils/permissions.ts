// Role-based permissions for mobile app
// Mirrors the permissions from the Next.js backend

import { Role } from '../types';

export type Permission =
  | 'ORG_VIEW'
  | 'ORG_EDIT'
  | 'ORG_USERS_INVITE'
  | 'ORG_USERS_MANAGE'
  | 'ORG_DELETE'
  | 'PROJECT_MANAGE'
  | 'PROJECT_VIEW_ALL'
  | 'PROJECT_DELETE'
  | 'TASK_CREATE'
  | 'TASK_EDIT'
  | 'TASK_VIEW'
  | 'TASK_DELETE'
  | 'TASK_VIEW_ALL'
  | 'CHANNEL_VIEW_ALL'
  | 'CHANNEL_MANAGE'
  | 'CHANNEL_DELETE'
  | 'REPORTS_VIEW'
  | 'SUPER_ADMIN_ACCESS'
  | 'CROSS_ORG_ACCESS';

export const DefaultRolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'SUPER_ADMIN_ACCESS',
    'CROSS_ORG_ACCESS',
    'ORG_VIEW',
    'ORG_EDIT',
    'ORG_DELETE',
    'ORG_USERS_INVITE',
    'ORG_USERS_MANAGE',
    'PROJECT_MANAGE',
    'PROJECT_VIEW_ALL',
    'PROJECT_DELETE',
    'TASK_CREATE',
    'TASK_EDIT',
    'TASK_VIEW',
    'TASK_DELETE',
    'TASK_VIEW_ALL',
    'CHANNEL_VIEW_ALL',
    'CHANNEL_MANAGE',
    'CHANNEL_DELETE',
    'REPORTS_VIEW',
  ],
  ORG_ADMIN: [
    'ORG_VIEW',
    'ORG_EDIT',
    'ORG_USERS_INVITE',
    'ORG_USERS_MANAGE',
    'PROJECT_MANAGE',
    'PROJECT_VIEW_ALL',
    'TASK_CREATE',
    'TASK_EDIT',
    'TASK_VIEW',
    'TASK_VIEW_ALL',
    'TASK_DELETE',
    'CHANNEL_VIEW_ALL',
    'CHANNEL_MANAGE',
    'REPORTS_VIEW',
  ],
  MANAGER: [
    'ORG_VIEW',
    'ORG_USERS_INVITE',
    'PROJECT_MANAGE',
    'TASK_CREATE',
    'TASK_EDIT',
    'TASK_VIEW',
    'REPORTS_VIEW',
  ],
  EMPLOYEE: ['TASK_CREATE', 'TASK_EDIT', 'TASK_VIEW'],
  ORG_MEMBER: ['TASK_CREATE', 'TASK_EDIT', 'TASK_VIEW'],
  CLIENT: ['TASK_VIEW', 'REPORTS_VIEW'],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: Role | undefined | null,
  permission: Permission,
  isSuperAdmin?: boolean
): boolean {
  // Super admins have all permissions
  if (isSuperAdmin) return true;

  if (!role) return false;
  
  const perms = DefaultRolePermissions[role] || [];
  return perms.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return DefaultRolePermissions[role] || [];
}

/**
 * Check if user can view all tasks
 */
export function canViewAllTasks(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'TASK_VIEW_ALL', isSuperAdmin);
}

/**
 * Check if user can create tasks
 */
export function canCreateTask(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'TASK_CREATE', isSuperAdmin);
}

/**
 * Check if user can edit tasks
 */
export function canEditTask(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'TASK_EDIT', isSuperAdmin);
}

/**
 * Check if user can delete tasks
 */
export function canDeleteTask(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'TASK_DELETE', isSuperAdmin);
}

/**
 * Check if user can manage channels
 */
export function canManageChannels(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'CHANNEL_MANAGE', isSuperAdmin);
}

/**
 * Check if user can view all channels
 */
export function canViewAllChannels(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'CHANNEL_VIEW_ALL', isSuperAdmin);
}

/**
 * Check if user can manage organization users
 */
export function canManageUsers(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'ORG_USERS_MANAGE', isSuperAdmin);
}

/**
 * Check if user can invite users to organization
 */
export function canInviteUsers(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'ORG_USERS_INVITE', isSuperAdmin);
}

/**
 * Check if user can view reports
 */
export function canViewReports(role: Role | undefined | null, isSuperAdmin?: boolean): boolean {
  return hasPermission(role, 'REPORTS_VIEW', isSuperAdmin);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(isSuperAdmin?: boolean): boolean {
  return isSuperAdmin === true;
}

/**
 * Check if user is org admin
 */
export function isOrgAdmin(role: Role | undefined | null): boolean {
  return role === 'ORG_ADMIN';
}

/**
 * Check if user is manager
 */
export function isManager(role: Role | undefined | null): boolean {
  return role === 'MANAGER';
}

/**
 * Check if user is client
 */
export function isClient(role: Role | undefined | null): boolean {
  return role === 'CLIENT';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    SUPER_ADMIN: 'Super Admin',
    ORG_ADMIN: 'Organization Admin',
    MANAGER: 'Manager',
    EMPLOYEE: 'Employee',
    ORG_MEMBER: 'Organization Member',
    CLIENT: 'Client',
  };
  return roleNames[role] || role;
}

/**
 * Get role description
 */
export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    SUPER_ADMIN: 'Full system access across all organizations',
    ORG_ADMIN: 'Full access to organization settings and users',
    MANAGER: 'Can manage projects and tasks within the organization',
    EMPLOYEE: 'Can create and edit tasks',
    ORG_MEMBER: 'Basic organization member with task access',
    CLIENT: 'View-only access to assigned tasks',
  };
  return descriptions[role] || '';
}
