// Permission Guard Component
// Use this to wrap components that require specific permissions

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { Role } from '../types';
import { Permission, hasPermission } from '../utils/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission: Permission;
  role: Role | undefined | null;
  isSuperAdmin?: boolean;
  fallback?: React.ReactNode;
  showMessage?: boolean;
}

export default function PermissionGuard({
  children,
  permission,
  role,
  isSuperAdmin,
  fallback,
  showMessage = true,
}: PermissionGuardProps) {
  const hasAccess = hasPermission(role, permission, isSuperAdmin);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (!showMessage) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Ionicons
          name="lock-closed"
          size={48}
          color={theme.colors.text.secondary}
        />
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.message}>
          You don't have permission to access this feature
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.default,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  message: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
