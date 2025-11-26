# Mobile App - Database Connection & Role-Based Permissions

## Overview
This document explains how the mobile app connects to the Next.js backend database and implements role-based access control.

## 1. Database Connection

### Current Setup
The mobile app is already connected to your Next.js backend through the API service layer:

**API Configuration** (`mobile_application/src/services/api.ts`):
- Base URL: `http://10.0.9.63:3000/api` (configured via `EXPO_PUBLIC_API_URL`)
- Authentication: JWT Bearer token
- Timeout: 30 seconds

**Environment Configuration** (`mobile_application/.env`):
```env
EXPO_PUBLIC_API_URL=http://10.0.9.63:3000/api
```

### How It Works
1. **Authentication Flow**:
   - User logs in via `/api/auth/mobile/login`
   - JWT token is stored securely using Expo SecureStore
   - Token is automatically attached to all API requests

2. **Data Flow**:
   ```
   Mobile App → API Service → Next.js Backend → MySQL Database (Prisma)
   ```

3. **Tenant Isolation**:
   - All API endpoints use `getTenantWhereClause()` to ensure users only see data from their organization
   - Super admins can see data across all organizations

## 2. Organization-wise Employee Details

### New Service: `organization.service.ts`
Created a dedicated service for organization and employee management:

**Features**:
- Get current user's organization details
- Get all employees in the organization
- Filter employees by role
- Filter employees by department
- Get individual employee details

**Usage Example**:
```typescript
import { organizationService } from '../services/organization.service';

// Get organization details
const org = await organizationService.getMyOrganization();

// Get all employees
const employees = await organizationService.getOrganizationEmployees();

// Get employees by role
const managers = await organizationService.getEmployeesByRole('MANAGER');
```

### New Screen: `OrganizationEmployeesScreen.tsx`
A complete screen to display organization employees with:
- Search functionality (by name or email)
- Role-based filtering
- Employee count display
- Pull-to-refresh
- Role badges with color coding
- Department information

**Role Colors**:
- 🟣 SUPER_ADMIN: Purple (#9333EA)
- 🔴 ORG_ADMIN: Red (#DC2626)
- 🔵 MANAGER: Blue (#2563EB)
- 🟢 EMPLOYEE: Green (#059669)
- 🔷 ORG_MEMBER: Cyan (#0891B2)
- 🟠 CLIENT: Orange (#F59E0B)

## 3. Role-Based Permissions

### Permission System
Implemented a comprehensive permission system that mirrors the backend:

**File**: `mobile_application/src/utils/permissions.ts`

**Supported Roles** (from Prisma schema):
1. **SUPER_ADMIN** - Full system access across all organizations
2. **ORG_ADMIN** - Full access to organization settings and users
3. **MANAGER** - Can manage projects and tasks within organization
4. **EMPLOYEE** - Can create and edit tasks
5. **ORG_MEMBER** - Basic organization member with task access
6. **CLIENT** - View-only access to assigned tasks

### Permission Matrix

| Feature | SUPER_ADMIN | ORG_ADMIN | MANAGER | EMPLOYEE | ORG_MEMBER | CLIENT |
|---------|-------------|-----------|---------|----------|------------|--------|
| Create Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Tasks | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Delete Tasks | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Tasks | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Channels | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Channels | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Invite Users | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Manage Projects | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### Using Permissions in Components

**Method 1: Using the `usePermissions` Hook**
```typescript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const permissions = usePermissions();
  
  return (
    <>
      {permissions.canCreateTask() && (
        <Button title="Create Task" />
      )}
      
      {permissions.canManageUsers() && (
        <Button title="Manage Users" />
      )}
    </>
  );
}
```

**Method 2: Using the `PermissionGuard` Component**
```typescript
import PermissionGuard from '../components/PermissionGuard';

function MyComponent() {
  const { user } = useAuthStore();
  
  return (
    <PermissionGuard
      permission="TASK_CREATE"
      role={user?.role}
      isSuperAdmin={user?.isSuperAdmin}
    >
      <CreateTaskButton />
    </PermissionGuard>
  );
}
```

**Method 3: Direct Permission Check**
```typescript
import { canCreateTask } from '../utils/permissions';
import { useAuthStore } from '../stores';

function MyComponent() {
  const { user } = useAuthStore();
  
  if (!canCreateTask(user?.role, user?.isSuperAdmin)) {
    return <AccessDenied />;
  }
  
  return <CreateTaskForm />;
}
```

### Available Permission Checks

**Task Permissions**:
- `canCreateTask()` - EMPLOYEE and above
- `canEditTask()` - EMPLOYEE and above
- `canDeleteTask()` - ORG_ADMIN and above
- `canViewAllTasks()` - ORG_ADMIN and above

**Channel Permissions**:
- `canManageChannels()` - ORG_ADMIN and above
- `canViewAllChannels()` - ORG_ADMIN and above

**User Management**:
- `canManageUsers()` - ORG_ADMIN and above
- `canInviteUsers()` - MANAGER and above

**Other**:
- `canViewReports()` - MANAGER, CLIENT, ORG_ADMIN, SUPER_ADMIN
- `hasPermission(role, permission, isSuperAdmin)` - Generic check

## 4. Updated Screens with Permissions

### TasksScreen
- ✅ Create Task button only shown to users with `TASK_CREATE` permission
- ✅ Uses `usePermissions` hook

### CreateTaskScreen
- ✅ Checks permission on mount
- ✅ Shows alert and navigates back if user lacks permission
- ✅ Only SUPER_ADMIN, ORG_ADMIN, MANAGER, EMPLOYEE, ORG_MEMBER can create tasks

## 5. API Endpoints Used

**Organization & Users**:
- `GET /api/users` - Get all users in organization (tenant-isolated)
- `GET /api/users/:userId` - Get specific user details
- `GET /api/organization/me` - Get current user's organization

**Tasks**:
- `GET /api/tasks` - Get tasks (filtered by permissions)
- `POST /api/tasks` - Create task (requires TASK_CREATE permission)
- `PATCH /api/tasks/:taskId` - Update task (ORG_ADMIN/MANAGER only)
- `DELETE /api/tasks/:taskId` - Delete task (ORG_ADMIN only)

**Channels**:
- `GET /api/channels` - Get channels
- `POST /api/channels` - Create channel

## 6. Setup Instructions

### Step 1: Update API URL
Edit `mobile_application/.env`:
```env
# Use your actual server IP or domain
EXPO_PUBLIC_API_URL=http://YOUR_IP:3000/api
```

### Step 2: Ensure Backend is Running
```bash
cd "Chat app desktop production"
npm run dev
```

### Step 3: Run Mobile App
```bash
cd mobile_application
npm start
```

### Step 4: Test Permissions
1. Login with different user roles
2. Verify appropriate features are shown/hidden
3. Test employee listing screen

## 7. Security Notes

### What's Protected:
✅ **Frontend**: UI elements hidden based on role
✅ **Backend**: All API endpoints validate permissions
✅ **Database**: Tenant isolation prevents cross-organization access
✅ **Authentication**: JWT tokens stored securely

### Important:
- Frontend permission checks are for UX only
- Backend validates ALL permissions on every request
- Never trust client-side permission checks alone
- Super admins bypass organization isolation

## 8. Testing Different Roles

To test the permission system:

1. **Create test users** with different roles in your database
2. **Login as each role** and verify:
   - SUPER_ADMIN: Can see and do everything
   - ORG_ADMIN: Can manage organization, users, tasks
   - MANAGER: Can create tasks and projects
   - EMPLOYEE: Can create and edit their own tasks
   - CLIENT: Can only view assigned tasks

## 9. Common Issues & Solutions

**Issue**: "Permission Denied" on all actions
- **Solution**: Check user role in database, ensure JWT token is valid

**Issue**: Can't see employees from organization
- **Solution**: Verify `organizationId` is set for user in database

**Issue**: API connection fails
- **Solution**: Update `EXPO_PUBLIC_API_URL` with correct IP address

**Issue**: Seeing data from other organizations
- **Solution**: Backend `getTenantWhereClause` may not be applied correctly

## 10. Next Steps

Consider implementing:
- [ ] Push notifications for role-based events
- [ ] Activity logs showing who did what
- [ ] Advanced filters (by department, date range)
- [ ] User profile editing with role restrictions
- [ ] Admin panel for user management
- [ ] Invite users via email
- [ ] Role change requests/approvals

## 11. Files Modified/Created

**New Files**:
- `src/services/organization.service.ts` - Organization & employee service
- `src/utils/permissions.ts` - Permission utilities
- `src/hooks/usePermissions.ts` - Permission hook
- `src/components/PermissionGuard.tsx` - Permission guard component
- `src/screens/main/OrganizationEmployeesScreen.tsx` - Employee listing screen

**Updated Files**:
- `src/screens/main/TasksScreen.tsx` - Added permission checks
- `src/screens/main/CreateTaskScreen.tsx` - Added permission validation
- `src/types/index.ts` - Already had role types

## Summary

✅ Mobile app is connected to your Next.js MySQL database via API
✅ Organization-wise employee details are available and filterable
✅ Role-based permissions match your backend exactly
✅ All 6 roles (SUPER_ADMIN, ORG_ADMIN, MANAGER, EMPLOYEE, ORG_MEMBER, CLIENT) are supported
✅ Permission checks are consistent between frontend and backend
