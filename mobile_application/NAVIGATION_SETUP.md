# Navigation Integration Guide

## Adding Organization Employees Screen to Navigation

To add the new `OrganizationEmployeesScreen` to your app navigation:

### Option 1: Add to Main Tab Navigator

Edit `src/navigation/MainNavigator.tsx`:

```typescript
import OrganizationEmployeesScreen from '../screens/main/OrganizationEmployeesScreen';

// Add to Tab.Screen components
<Tab.Screen 
  name="Employees" 
  component={OrganizationEmployeesScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="people-outline" size={size} color={color} />
    ),
  }}
/>
```

### Option 2: Add to More/Settings Screen

Edit `src/screens/main/MoreScreen.tsx`:

```typescript
import { useNavigation } from '@react-navigation/native';

// Add menu item
<TouchableOpacity
  style={styles.menuItem}
  onPress={() => navigation.navigate('OrganizationEmployees' as never)}
>
  <Ionicons name="people-outline" size={24} color={theme.colors.text.primary} />
  <Text style={styles.menuText}>Organization Employees</Text>
  <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
</TouchableOpacity>
```

### Option 3: Add as Stack Screen

Edit `src/navigation/RootNavigator.tsx`:

```typescript
import OrganizationEmployeesScreen from '../screens/main/OrganizationEmployeesScreen';

// In your Stack.Navigator
<Stack.Screen 
  name="OrganizationEmployees" 
  component={OrganizationEmployeesScreen}
  options={{
    title: 'Organization Employees',
    headerShown: true,
  }}
/>
```

## Permission-based Navigation

You can also conditionally show the navigation item based on user permissions:

```typescript
import { usePermissions } from '../hooks/usePermissions';

function MoreScreen() {
  const permissions = usePermissions();
  
  return (
    <>
      {/* Only show for ORG_ADMIN and above */}
      {permissions.canManageUsers() && (
        <TouchableOpacity onPress={() => navigation.navigate('OrganizationEmployees' as never)}>
          <Text>Manage Employees</Text>
        </TouchableOpacity>
      )}
    </>
  );
}
```

## Update Type Definitions

Add to `src/types/index.ts` in `RootStackParamList`:

```typescript
export type RootStackParamList = {
  // ... existing routes
  OrganizationEmployees: undefined;
  // ... rest of routes
};
```

## Quick Setup Example

Here's a complete example for adding it to the More screen:

**File: `src/screens/main/MoreScreen.tsx`**

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores';
import { usePermissions } from '../../hooks/usePermissions';
import theme from '../../theme';

export default function MoreScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const permissions = usePermissions();

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Profile',
      route: 'Profile',
      show: true,
    },
    {
      icon: 'people-outline',
      title: 'Organization Employees',
      route: 'OrganizationEmployees',
      show: permissions.canViewAllChannels(), // Show to admins/managers
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      route: 'Notifications',
      show: true,
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      route: 'Settings',
      show: true,
    },
  ].filter(item => item.show);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>{user?.role}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.route as never)}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={theme.colors.text.primary}
              />
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            navigation.navigate('Login' as never);
          }}
        >
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error.main} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    ...theme.typography.h2,
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  userEmail: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  userRole: {
    ...theme.typography.caption,
    color: theme.colors.primary[500],
    marginTop: 4,
  },
  menuSection: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border.light,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  menuText: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error.main,
  },
  logoutText: {
    ...theme.typography.body1,
    color: theme.colors.error.main,
    marginLeft: theme.spacing.md,
    fontWeight: '600',
  },
});
```

This example provides a complete More screen with permission-based menu items!
