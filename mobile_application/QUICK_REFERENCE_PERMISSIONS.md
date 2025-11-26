# Quick Reference - Permissions & Services

## 🔐 Permission Checks (Copy & Paste)

### Import
```typescript
import { usePermissions } from '../hooks/usePermissions';
```

### Usage in Component
```typescript
const permissions = usePermissions();

// Task permissions
{permissions.canCreateTask() && <CreateButton />}
{permissions.canEditTask() && <EditButton />}
{permissions.canDeleteTask() && <DeleteButton />}
{permissions.canViewAllTasks() && <ViewAllButton />}

// Channel permissions
{permissions.canManageChannels() && <ManageChannelsButton />}
{permissions.canViewAllChannels() && <ViewAllChannelsButton />}

// User permissions
{permissions.canManageUsers() && <ManageUsersButton />}
{permissions.canInviteUsers() && <InviteButton />}

// Reports
{permissions.canViewReports() && <ReportsButton />}

// Role checks
{permissions.isSuperAdmin() && <SuperAdminPanel />}
{permissions.isOrgAdmin() && <OrgAdminPanel />}
{permissions.isManager() && <ManagerPanel />}
{permissions.isClient() && <ClientView />}
```

## 🏢 Organization Service (Copy & Paste)

### Import
```typescript
import { organizationService } from '../services/organization.service';
```

### Get Organization Details
```typescript
const org = await organizationService.getMyOrganization();
console.log(org?.name);
```

### Get All Employees
```typescript
const employees = await organizationService.getOrganizationEmployees();
console.log(`Total employees: ${employees.length}`);
```

### Filter by Role
```typescript
const admins = await organizationService.getEmployeesByRole('ORG_ADMIN');
const managers = await organizationService.getEmployeesByRole('MANAGER');
const employees = await organizationService.getEmployeesByRole('EMPLOYEE');
```

### Filter by Department
```typescript
const deptEmployees = await organizationService.getEmployeesByDepartment('dept-id');
```

### Get Employee Details
```typescript
const employee = await organizationService.getEmployeeDetails('user-id');
```

## 🛡️ Permission Guard Component

### Import
```typescript
import PermissionGuard from '../components/PermissionGuard';
import { useAuthStore } from '../stores';
```

### Usage
```typescript
const { user } = useAuthStore();

// Show component only if user has permission
<PermissionGuard
  permission="TASK_CREATE"
  role={user?.role}
  isSuperAdmin={user?.isSuperAdmin}
>
  <CreateTaskForm />
</PermissionGuard>

// With custom fallback
<PermissionGuard
  permission="TASK_DELETE"
  role={user?.role}
  isSuperAdmin={user?.isSuperAdmin}
  fallback={<Text>You cannot delete tasks</Text>}
>
  <DeleteButton />
</PermissionGuard>

// Hide without message
<PermissionGuard
  permission="ORG_USERS_MANAGE"
  role={user?.role}
  isSuperAdmin={user?.isSuperAdmin}
  showMessage={false}
>
  <ManageUsersButton />
</PermissionGuard>
```

## 📋 All Available Permissions

```typescript
type Permission =
  | 'ORG_VIEW'                 // View organization
  | 'ORG_EDIT'                 // Edit organization
  | 'ORG_USERS_INVITE'         // Invite users
  | 'ORG_USERS_MANAGE'         // Manage users
  | 'ORG_DELETE'               // Delete organization
  | 'PROJECT_MANAGE'           // Manage projects
  | 'PROJECT_VIEW_ALL'         // View all projects
  | 'PROJECT_DELETE'           // Delete projects
  | 'TASK_CREATE'              // Create tasks
  | 'TASK_EDIT'                // Edit tasks
  | 'TASK_VIEW'                // View tasks
  | 'TASK_DELETE'              // Delete tasks
  | 'TASK_VIEW_ALL'            // View all tasks
  | 'CHANNEL_VIEW_ALL'         // View all channels
  | 'CHANNEL_MANAGE'           // Manage channels
  | 'CHANNEL_DELETE'           // Delete channels
  | 'REPORTS_VIEW'             // View reports
  | 'SUPER_ADMIN_ACCESS'       // Super admin access
  | 'CROSS_ORG_ACCESS';        // Cross organization access
```

## 🎭 Role-Based UI Examples

### Show Different Content by Role
```typescript
const permissions = usePermissions();

return (
  <View>
    {permissions.isSuperAdmin() && (
      <Text>Welcome Super Admin!</Text>
    )}
    
    {permissions.isOrgAdmin() && (
      <Text>Manage your organization</Text>
    )}
    
    {permissions.isManager() && (
      <Text>Manage your projects</Text>
    )}
    
    {permissions.isClient() && (
      <Text>View your assigned tasks</Text>
    )}
  </View>
);
```

### Conditional Navigation
```typescript
const permissions = usePermissions();

const menuItems = [
  {
    title: 'Tasks',
    route: 'Tasks',
    show: true, // Everyone can see
  },
  {
    title: 'Employees',
    route: 'OrganizationEmployees',
    show: permissions.canViewAllChannels(),
  },
  {
    title: 'Reports',
    route: 'Reports',
    show: permissions.canViewReports(),
  },
  {
    title: 'Settings',
    route: 'Settings',
    show: permissions.canManageUsers(),
  },
].filter(item => item.show);
```

## 🔧 Direct Permission Utilities

### Import
```typescript
import {
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
  getRoleDisplayName,
  getRoleDescription,
} from '../utils/permissions';
```

### Usage
```typescript
const { user } = useAuthStore();

// Check specific permission
if (hasPermission(user?.role, 'TASK_CREATE', user?.isSuperAdmin)) {
  // Allow task creation
}

// Check role-specific permission
if (canCreateTask(user?.role, user?.isSuperAdmin)) {
  // Allow task creation
}

// Get role display name
const roleName = getRoleDisplayName(user?.role); // "Organization Admin"

// Get role description
const roleDesc = getRoleDescription(user?.role); // "Full access to organization settings and users"
```

## 🎨 Role Colors

```typescript
const getRoleColor = (role: Role): string => {
  const colors = {
    SUPER_ADMIN: '#9333EA',  // Purple
    ORG_ADMIN: '#DC2626',    // Red
    MANAGER: '#2563EB',      // Blue
    EMPLOYEE: '#059669',     // Green
    ORG_MEMBER: '#0891B2',   // Cyan
    CLIENT: '#F59E0B',       // Orange
  };
  return colors[role] || '#gray';
};
```

## 📱 Complete Screen Example

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { usePermissions } from '../hooks/usePermissions';
import { organizationService } from '../services/organization.service';
import PermissionGuard from '../components/PermissionGuard';

export default function MyScreen() {
  const permissions = usePermissions();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await organizationService.getOrganizationEmployees();
    setEmployees(data);
    setLoading(false);
  };

  return (
    <PermissionGuard
      permission="ORG_VIEW"
      role={permissions.user?.role}
      isSuperAdmin={permissions.user?.isSuperAdmin}
    >
      <View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={employees}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name}</Text>
                <Text>{getRoleDisplayName(item.role)}</Text>
              </View>
            )}
          />
        )}

        {permissions.canInviteUsers() && (
          <Button title="Invite User" onPress={handleInvite} />
        )}
      </View>
    </PermissionGuard>
  );
}
```

## 🚀 Quick Setup Checklist

- [ ] Import `usePermissions` hook
- [ ] Check permissions before showing UI
- [ ] Use `PermissionGuard` for entire components
- [ ] Use `organizationService` for employee data
- [ ] Test with different user roles
- [ ] Verify backend also validates permissions

## 🐛 Common Mistakes to Avoid

❌ **Don't do this:**
```typescript
// Checking permission without user data
if (canCreateTask()) { } // Wrong!
```

✅ **Do this:**
```typescript
const permissions = usePermissions();
if (permissions.canCreateTask()) { } // Correct!
```

❌ **Don't do this:**
```typescript
// Hardcoding role checks
if (user?.role === 'ORG_ADMIN') { }
```

✅ **Do this:**
```typescript
const permissions = usePermissions();
if (permissions.isOrgAdmin()) { }
```

## 📞 Need Help?

- Check `MOBILE_APP_SETUP.md` for detailed documentation
- Check `MOBILE_APP_SUMMARY_URDU.md` for Urdu documentation
- Check `NAVIGATION_SETUP.md` for navigation integration
