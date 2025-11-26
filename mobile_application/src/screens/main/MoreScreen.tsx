// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuthStore } from '../../stores';
// import { useLogout } from '../../hooks/useApi';
// import { taskService } from '../../services/task.service';
// import { getStoredAuth } from '../../services/diagnostics.service';
// import theme from '../../theme';

// interface MenuItem {
//   icon: keyof typeof Ionicons.glyphMap;
//   label: string;
//   onPress: () => void;
//   color?: string;
// }

// export default function MoreScreen() {
//   const navigation = useNavigation();
//   const { user, logout: logoutStore } = useAuthStore();
//   const logout = useLogout();

//   const handleLogout = () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await logout.mutateAsync();
//               logoutStore();
//             } catch (error) {
//               console.error('Logout error:', error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const menuItems: MenuItem[] = [
//     {
//       icon: 'alarm-outline',
//       label: 'Reminders',
//       onPress: () => {
//         // @ts-ignore
//         navigation.navigate('Reminders');
//       },
//     },
//     {
//       icon: 'settings-outline',
//       label: 'Settings',
//       onPress: () => {
//         // @ts-ignore
//         navigation.navigate('Settings');
//       },
//     },
//     {
//       icon: 'help-circle-outline',
//       label: 'Help & Support',
//       onPress: () => {
//         Alert.alert(
//           'Help & Support',
//           'For assistance, please contact support@yourapp.com'
//         );
//       },
//     },
//     {
//       icon: 'bug-outline',
//       label: 'Run API Debug',
//       onPress: async () => {
//         try {
//           // get stored auth info
//           const auth = await getStoredAuth();
//           console.log('[Debug] Stored Auth:', auth);
//             // Show both stored, async and in-memory values for debugging
//             const tokenInfo = `stored:${auth.tokenStored ? 'yes' : 'no'}, async:${(auth as any).tokenAsync ? 'yes' : 'no'}, memory:${auth.tokenMemory ? 'yes' : 'no'}`;

//             if (!auth.tokenStored && !(auth as any).tokenAsync && !auth.tokenMemory) {
//               Alert.alert('API Debug', 'No token found. Please login first so the app stores a valid token.');
//               return;
//             }

//           // fetch sample tasks with params to verify data
//           try {
//             const tasks = await taskService.getTasks({ status: 'TODO', priority: 'HIGH' });
//             console.log('[Debug] Fetched tasks (sample):', tasks);
//              Alert.alert('API Debug', `Token info: ${tokenInfo}\nTasks fetched: ${Array.isArray(tasks) ? tasks.length : 'n/a'}`);
//           } catch (apiErr: any) {
//             console.error('API Debug error (request):', apiErr);
//             const status = apiErr?.statusCode ?? apiErr?.status ?? (apiErr?.response?.status ?? 'unknown');
//             const message = apiErr?.message ?? JSON.stringify(apiErr);
//             if (status === 401) {
//               Alert.alert('API Debug', `Unauthorized (401). Token may be expired or invalid.\nMessage: ${message}`);
//             } else {
//               Alert.alert('API Debug', `Request failed (status: ${status})\nMessage: ${message}`);
//             }
//           }
//         } catch (err) {
//           console.error('API Debug error:', err);
//           Alert.alert('API Debug Error', String((err as any)?.message || err));
//         }
//       },
//     },
//     {
//       icon: 'cloud-outline',
//       label: 'Connection Test',
//       onPress: () => {
//         // @ts-ignore
//         navigation.navigate('ConnectionTest');
//       },
//     },
//     {
//       icon: 'information-circle-outline',
//       label: 'About',
//       onPress: () => {
//         Alert.alert(
//           'About',
//           'Office Chat App v1.0.0\n\nA professional team collaboration platform.'
//         );
//       },
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>More</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {user?.name?.charAt(0).toUpperCase() || 'U'}
//             </Text>
//           </View>
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>{user?.name}</Text>
//             <Text style={styles.profileEmail}>{user?.email}</Text>
//           </View>
//         </View>

//         {/* Menu Items */}
//         <View style={styles.menuSection}>
//           {menuItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.menuItem}
//               onPress={item.onPress}
//             >
//               <View style={styles.menuItemLeft}>
//                 <View style={styles.iconContainer}>
//                   <Ionicons
//                     name={item.icon}
//                     size={24}
//                     color={item.color || theme.colors.text.primary}
//                   />
//                 </View>
//                 <Text style={styles.menuItemLabel}>{item.label}</Text>
//               </View>
//               <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Logout Button */}
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Ionicons name="log-out-outline" size={20} color={theme.colors.error.main} />
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>

//         {/* Version */}
//         <Text style={styles.version}>Version 1.0.0</Text>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background.default,
//   },
//   header: {
//     paddingHorizontal: theme.spacing.lg,
//     paddingVertical: theme.spacing.md,
//     backgroundColor: theme.colors.background.paper,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border.light,
//   },
//   headerTitle: {
//     ...theme.typography.h2,
//     color: theme.colors.text.primary,
//   },
//   content: {
//     padding: theme.spacing.lg,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     padding: theme.spacing.lg,
//     marginBottom: theme.spacing.lg,
//     ...theme.shadows.sm,
//   },
//   avatar: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: theme.colors.primary[500],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.md,
//   },
//   avatarText: {
//     ...theme.typography.h2,
//     color: '#fff',
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     ...theme.typography.h3,
//     color: theme.colors.text.primary,
//   },
//   profileEmail: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     marginTop: 4,
//   },
//   menuSection: {
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     marginBottom: theme.spacing.lg,
//     overflow: 'hidden',
//     ...theme.shadows.sm,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: theme.spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border.light,
//   },
//   menuItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: theme.colors.gray[100],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.md,
//   },
//   menuItemLabel: {
//     ...theme.typography.body1,
//     color: theme.colors.text.primary,
//   },
//   logoutButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     padding: theme.spacing.md,
//     marginBottom: theme.spacing.lg,
//     borderWidth: 1,
//     borderColor: theme.colors.error.main,
//     gap: theme.spacing.xs,
//   },
//   logoutText: {
//     ...theme.typography.button,
//     color: theme.colors.error.main,
//   },
//   version: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
//     textAlign: 'center',
//   },
// });



import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores';
import { useLogout } from '../../hooks/useApi';
import { taskService } from '../../services/task.service';
import { getStoredAuth } from '../../services/diagnostics.service';

// Modern dark theme colors
const colors = {
  background: '#0f172a',
  card: '#1e293b',
  cardLight: '#334155',
  primary: '#667eea',
  secondary: '#764ba2',
  accent: '#f093fb',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#3b82f6',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
};

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function MoreScreen() {
  const navigation = useNavigation();
  const { user, logout: logoutStore } = useAuthStore();
  const logout = useLogout();

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
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const handleAPIDebug = async () => {
    try {
      const auth = await getStoredAuth();
      console.log('[Debug] Stored Auth:', auth);
      const tokenInfo = `stored:${auth.tokenStored ? 'yes' : 'no'}, async:${(auth as any).tokenAsync ? 'yes' : 'no'}, memory:${auth.tokenMemory ? 'yes' : 'no'}`;

      if (!auth.tokenStored && !(auth as any).tokenAsync && !auth.tokenMemory) {
        Alert.alert('API Debug', 'No token found. Please login first.');
        return;
      }

      try {
        const tasks = await taskService.getTasks({ status: 'TODO', priority: 'HIGH' });
        console.log('[Debug] Fetched tasks:', tasks);
        Alert.alert('API Debug', `Token info: ${tokenInfo}\nTasks fetched: ${Array.isArray(tasks) ? tasks.length : 'n/a'}`);
      } catch (apiErr: any) {
        console.error('API Debug error:', apiErr);
        const status = apiErr?.statusCode ?? apiErr?.status ?? (apiErr?.response?.status ?? 'unknown');
        const message = apiErr?.message ?? JSON.stringify(apiErr);
        if (status === 401) {
          Alert.alert('API Debug', `Unauthorized (401). Token may be expired.\nMessage: ${message}`);
        } else {
          Alert.alert('API Debug', `Request failed (status: ${status})\nMessage: ${message}`);
        }
      }
    } catch (err) {
      console.error('API Debug error:', err);
      Alert.alert('API Debug Error', String((err as any)?.message || err));
    }
  };

  const menuSections: MenuSection[] = [
    {
      title: 'General',
      items: [
        {
          icon: 'alarm',
          label: 'Reminders',
          subtitle: 'Manage your reminders',
          color: colors.warning,
          onPress: () => {
            // @ts-ignore
            navigation.navigate('Reminders');
          },
        },
        {
          icon: 'settings',
          label: 'Settings',
          subtitle: 'App preferences',
          color: colors.info,
          onPress: () => {
            // @ts-ignore
            navigation.navigate('Settings');
          },
        },
        {
          icon: 'notifications',
          label: 'Notifications',
          subtitle: 'Push notification settings',
          color: colors.accent,
          badge: '3',
          onPress: () => {
            Alert.alert('Notifications', 'Notification settings coming soon');
          },
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle',
          label: 'Help & Support',
          subtitle: 'Get help and contact us',
          color: colors.success,
          onPress: () => {
            Alert.alert(
              'Help & Support',
              'For assistance, please contact support@yourapp.com'
            );
          },
        },
        {
          icon: 'information-circle',
          label: 'About',
          subtitle: 'App version and info',
          color: colors.primary,
          onPress: () => {
            Alert.alert(
              'About',
              'Office Chat App v1.0.0\n\nA professional team collaboration platform.'
            );
          },
        },
      ],
    },
    {
      title: 'Developer',
      items: [
        {
          icon: 'bug',
          label: 'API Debug',
          subtitle: 'Run diagnostics',
          color: colors.danger,
          onPress: handleAPIDebug,
        },
        {
          icon: 'cloud',
          label: 'Connection Test',
          subtitle: 'Test server connection',
          color: colors.info,
          onPress: () => {
            // @ts-ignore
            navigation.navigate('ConnectionTest');
          },
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Settings & Options</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileBackground}>
            <View style={styles.profileContent}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
                <View style={[styles.onlineDot, { backgroundColor: colors.success }]} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                {user?.role && (
                  <View style={[styles.roleBadge, { backgroundColor: colors.primary + '30' }]}>
                    <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
                    <Text style={[styles.roleBadgeText, { color: colors.primary }]}>
                      {user.role}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
              <Ionicons name="time" size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.info + '20' }]}>
              <Ionicons name="chatbubbles" size={20} color={colors.info} />
            </View>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex !== section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={[styles.menuIconBox, { backgroundColor: item.color + '20' }]}>
                      <Ionicons name={item.icon} size={24} color={item.color} />
                    </View>
                    <View style={styles.menuItemContent}>
                      <View style={styles.menuItemTitleRow}>
                        <Text style={styles.menuItemLabel}>{item.label}</Text>
                        {item.badge && (
                          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                      )}
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={[styles.logoutIcon, { backgroundColor: colors.danger + '20' }]}>
            <Ionicons name="log-out" size={20} color={colors.danger} />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 Office Chat App</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  content: {
    padding: 20,
  },
  profileCard: {
    marginBottom: 20,
  },
  profileBackground: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuItemSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.danger,
    gap: 12,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  logoutIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.danger,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  version: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textTertiary,
  },
});