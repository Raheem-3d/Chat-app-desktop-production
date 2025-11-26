import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores';
import { useUpdateUser, useLogout } from '../../hooks/useApi';
import { useTheme } from '../../theme';
import { spacing, borderRadius, typography, shadows } from '../../theme';


export default function SettingsScreen() {
  const navigation = useNavigation();
  const { user, logout: logoutStore } = useAuthStore();
  const { theme, themeType, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  const updateUser = useUpdateUser();
  const logout = useLogout();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.default,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: theme.background.paper,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    headerTitle: {
      ...typography.h2,
      color: theme.text.primary,
    },
    content: {
      padding: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: theme.text.primary,
      marginBottom: spacing.md,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      padding: spacing.md,
      backgroundColor: theme.background.paper,
      borderRadius: 12,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    avatarText: {
      ...typography.h2,
      color: '#fff',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      ...typography.h3,
      color: theme.text.primary,
    },
    profileEmail: {
      ...typography.body2,
      color: theme.text.secondary,
      marginTop: 4,
    },
    field: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.body2,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: spacing.xs,
    },
    input: {
      ...typography.body1,
      backgroundColor: theme.background.paper,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border.light,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: theme.text.primary,
    },
    inputDisabled: {
      backgroundColor: theme.gray[100],
      color: theme.text.secondary,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    buttonPrimary: {
      backgroundColor: theme.primary[500],
    },
    buttonPrimaryText: {
      ...typography.button,
      color: '#fff',
    },
    buttonSecondary: {
      backgroundColor: theme.background.paper,
      borderWidth: 1,
      borderColor: theme.border.main,
    },
    buttonSecondaryText: {
      ...typography.button,
      color: theme.text.primary,
    },
    buttonDanger: {
      backgroundColor: theme.background.paper,
      borderWidth: 1,
      borderColor: theme.error.main,
    },
    buttonDangerText: {
      ...typography.button,
      color: theme.error.main,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: theme.background.paper,
      borderRadius: 8,
    },
    infoText: {
      ...typography.body1,
      color: theme.text.primary,
    },
    themeOptions: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    themeOption: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      backgroundColor: theme.background.paper,
      borderWidth: 1,
      borderColor: theme.border.light,
      gap: spacing.sm,
    },
    themeOptionActive: {
      backgroundColor: theme.primary[500],
      borderColor: theme.primary[500],
    },
    themeOptionText: {
      ...typography.body2,
      color: theme.text.primary,
      fontWeight: '500',
    },
    themeOptionTextActive: {
      color: '#fff',
    },
  });

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      await updateUser.mutateAsync({
        userId: user.id,
        data: { name },
      });
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout.mutateAsync();
              logoutStore();
              // Navigation will be handled by RootNavigator
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>

          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={user?.email || ''}
              editable={false}
            />
          </View>

          {isEditing ? (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  setName(user?.name || '');
                  setIsEditing(false);
                }}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSave}
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonPrimaryText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonPrimaryText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.field}>
            <Text style={styles.label}>Theme</Text>
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeType === 'light' && styles.themeOptionActive
                ]}
                onPress={() => themeType !== 'light' && toggleTheme()}
              >
                <Ionicons
                  name="sunny-outline"
                  size={20}
                  color={themeType === 'light' ? '#fff' : theme.text.primary}
                />
                <Text style={[
                  styles.themeOptionText,
                  themeType === 'light' && styles.themeOptionTextActive
                ]}>
                  Light
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  themeType === 'dark' && styles.themeOptionActive
                ]}
                onPress={() => themeType !== 'dark' && toggleTheme()}
              >
                <Ionicons
                  name="moon-outline"
                  size={20}
                  color={themeType === 'dark' ? '#fff' : theme.text.primary}
                />
                <Text style={[
                  styles.themeOptionText,
                  themeType === 'dark' && styles.themeOptionTextActive
                ]}>
                  Dark
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={theme.error.main} />
            <Text style={styles.buttonDangerText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
