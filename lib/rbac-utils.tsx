/**
 * Role-Based Access Control (RBAC) Utilities
 * Client-side helpers for permission checks and role-based rendering
 */

import { useAuth } from "@/contexts/auth-context"

export type UserRole = 
  | "SUPER_ADMIN"
  | "ORG_ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "ORG_MEMBER"
  | "CLIENT"

/**
 * Hook to check if user has a specific role
 */
export function useRole() {
  const { user } = useAuth()
  
  return {
    isSuperAdmin: user?.role === "SUPER_ADMIN" || user?.isSuperAdmin,
    isAdmin: ["SUPER_ADMIN", "ORG_ADMIN"].includes(user?.role),
    isManager: ["SUPER_ADMIN", "ORG_ADMIN", "MANAGER"].includes(user?.role),
    isEmployee: user?.role === "EMPLOYEE" || user?.role === "ORG_MEMBER",
    isClient: user?.role === "CLIENT",
    role: user?.role as UserRole,
  }
}

/**
 * Hook to check user permissions
 */
export function usePermissions() {
  const { user, isSuperAdmin } = useAuth()
  const role = user?.role as UserRole
  
  // Super admins have all permissions
  if (isSuperAdmin) {
    return {
      canViewAllOrgs: true,
      canEditOrg: true,
      canDeleteOrg: true,
      canManageUsers: true,
      canInviteUsers: true,
      canViewAllTasks: true,
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: true,
      canViewAllChannels: true,
      canManageChannels: true,
      canDeleteChannels: true,
      canManageProjects: true,
      canViewReports: true,
    }
  }
  
  // Org Admin permissions (within org)
  if (role === "ORG_ADMIN") {
    return {
      canViewAllOrgs: false,
      canEditOrg: true,
      canDeleteOrg: false,
      canManageUsers: true,
      canInviteUsers: true,
      canViewAllTasks: true,
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: true,
      canViewAllChannels: true,
      canManageChannels: true,
      canDeleteChannels: false,
      canManageProjects: true,
      canViewReports: true,
    }
  }
  
  // Manager permissions
  if (role === "MANAGER") {
    return {
      canViewAllOrgs: false,
      canEditOrg: false,
      canDeleteOrg: false,
      canManageUsers: false,
      canInviteUsers: true,
      canViewAllTasks: false,
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: false,
      canViewAllChannels: false,
      canManageChannels: false,
      canDeleteChannels: false,
      canManageProjects: true,
      canViewReports: true,
    }
  }
  
  // Employee permissions
  if (["EMPLOYEE", "ORG_MEMBER"].includes(role)) {
    return {
      canViewAllOrgs: false,
      canEditOrg: false,
      canDeleteOrg: false,
      canManageUsers: false,
      canInviteUsers: false,
      canViewAllTasks: false,
      canCreateTasks: true,
      canEditTasks: true,
      canDeleteTasks: false,
      canViewAllChannels: false,
      canManageChannels: false,
      canDeleteChannels: false,
      canManageProjects: false,
      canViewReports: false,
    }
  }
  
  // Client permissions (read-only)
  return {
    canViewAllOrgs: false,
    canEditOrg: false,
    canDeleteOrg: false,
    canManageUsers: false,
    canInviteUsers: false,
    canViewAllTasks: false,
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canViewAllChannels: false,
    canManageChannels: false,
    canDeleteChannels: false,
    canManageProjects: false,
    canViewReports: true,
  }
}

/**
 * Component wrapper for role-based rendering
 */
export function RoleGuard({ 
  roles, 
  children,
  fallback = null 
}: { 
  roles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { user } = useAuth()
  const userRole = user?.role as UserRole
  
  if (!user || !roles.includes(userRole)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component wrapper for permission-based rendering
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null
}: {
  permission: keyof ReturnType<typeof usePermissions>
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const permissions = usePermissions()
  
  if (!permissions[permission]) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component wrapper for super admin only content
 */
export function SuperAdminOnly({ 
  children,
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { isSuperAdmin } = useAuth()
  
  if (!isSuperAdmin) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Component wrapper for org admin content
 */
export function OrgAdminOnly({ 
  children,
  fallback = null 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { isOrgAdmin } = useAuth()
  
  if (!isOrgAdmin) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

/**
 * Utility to get role display name
 */
export function getRoleDisplayName(role: string | undefined): string {
  const roleMap: Record<string, string> = {
    SUPER_ADMIN: "Super Administrator",
    ORG_ADMIN: "Organization Admin",
    MANAGER: "Manager",
    EMPLOYEE: "Employee",
    ORG_MEMBER: "Member",
    CLIENT: "Client",
  }
  
  return roleMap[role || ""] || role || "Unknown"
}

/**
 * Utility to get role badge color
 */
export function getRoleBadgeVariant(role: string | undefined): "default" | "destructive" | "secondary" | "outline" {
  const colorMap: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
    SUPER_ADMIN: "destructive",
    ORG_ADMIN: "default",
    MANAGER: "secondary",
    EMPLOYEE: "outline",
    ORG_MEMBER: "outline",
    CLIENT: "secondary",
  }
  
  return colorMap[role || ""] || "outline"
}
