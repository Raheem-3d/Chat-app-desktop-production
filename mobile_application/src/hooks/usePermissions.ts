// Hook for managing user permissions
import { useAuthStore } from '../stores';
import { Permission, hasPermission as checkPermission } from '../utils/permissions';

export function usePermissions() {
  const { user } = useAuthStore();

  const hasPermission = (permission: Permission): boolean => {
    return checkPermission(user?.role, permission, user?.isSuperAdmin);
  };

  const canCreateTask = (): boolean => {
    return checkPermission(user?.role, 'TASK_CREATE', user?.isSuperAdmin);
  };

  const canEditTask = (): boolean => {
    return checkPermission(user?.role, 'TASK_EDIT', user?.isSuperAdmin);
  };

  const canDeleteTask = (): boolean => {
    return checkPermission(user?.role, 'TASK_DELETE', user?.isSuperAdmin);
  };

  const canViewAllTasks = (): boolean => {
    return checkPermission(user?.role, 'TASK_VIEW_ALL', user?.isSuperAdmin);
  };

  const canManageChannels = (): boolean => {
    return checkPermission(user?.role, 'CHANNEL_MANAGE', user?.isSuperAdmin);
  };

  const canViewAllChannels = (): boolean => {
    return checkPermission(user?.role, 'CHANNEL_VIEW_ALL', user?.isSuperAdmin);
  };

  const canManageUsers = (): boolean => {
    return checkPermission(user?.role, 'ORG_USERS_MANAGE', user?.isSuperAdmin);
  };

  const canInviteUsers = (): boolean => {
    return checkPermission(user?.role, 'ORG_USERS_INVITE', user?.isSuperAdmin);
  };

  const canViewReports = (): boolean => {
    return checkPermission(user?.role, 'REPORTS_VIEW', user?.isSuperAdmin);
  };

  const isSuperAdmin = (): boolean => {
    return user?.isSuperAdmin === true;
  };

  const isOrgAdmin = (): boolean => {
    return user?.role === 'ORG_ADMIN';
  };

  const isManager = (): boolean => {
    return user?.role === 'MANAGER';
  };

  const isClient = (): boolean => {
    return user?.role === 'CLIENT';
  };

  return {
    user,
    hasPermission,
    canCreateTask,
    canEditTask,
    canDeleteTask,
    canViewAllTasks,
    canManageChannels,
    canViewAllChannels,
    canManageUsers,
    canInviteUsers,
    canViewReports,
    isSuperAdmin,
    isOrgAdmin,
    isManager,
    isClient,
  };
}
