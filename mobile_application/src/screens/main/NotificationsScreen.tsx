// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   RefreshControl,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useNotifications, useMarkNotificationsAsRead } from '../../hooks/useApi';
// import theme from '../../theme';
// import { formatDate } from '../../utils';
// import { Notification } from '../../types';

// export default function NotificationsScreen() {
//   const { data: notifications, isLoading, refetch, isRefetching } = useNotifications();
//   const markAsRead = useMarkNotificationsAsRead();

//   const handleNotificationPress = async (notification: Notification) => {
//     if (!notification.read) {
//       try {
//         await markAsRead.mutateAsync([notification.id]);
//         refetch();
//       } catch (error) {
//         console.error('Failed to mark notification as read:', error);
//       }
//     }
//   };

//   const renderNotification = ({ item }: { item: Notification }) => (
//     <TouchableOpacity
//       style={[styles.notificationCard, !item.read && styles.notificationUnread]}
//       onPress={() => handleNotificationPress(item)}
//     >
//       <View style={styles.iconContainer}>
//         <Ionicons
//           name={getNotificationIcon(item.type)}
//           size={24}
//           color={theme.colors.primary[500]}
//         />
//       </View>
//       <View style={styles.notificationContent}>
//         <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>
//           Notification
//         </Text>
//         <Text style={styles.notificationMessage} numberOfLines={2}>
//           {item.type}
//         </Text>
//         <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
//       </View>
//       {!item.read && <View style={styles.unreadDot} />}
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Ionicons name="notifications-outline" size={64} color={theme.colors.text.secondary} />
//       <Text style={styles.emptyTitle}>No notifications</Text>
//       <Text style={styles.emptySubtitle}>You're all caught up!</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Notifications</Text>
//       </View>

//       {/* Notification List */}
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={theme.colors.primary[500]} />
//         </View>
//       ) : (
//         <FlatList
//           data={notifications || []}
//           renderItem={renderNotification}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={[
//             styles.listContainer,
//             (!notifications || notifications.length === 0) && styles.listContainerEmpty,
//           ]}
//           ListEmptyComponent={renderEmptyState}
//           refreshControl={
//             <RefreshControl
//               refreshing={isRefetching}
//               onRefresh={refetch}
//               tintColor={theme.colors.primary[500]}
//             />
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// function getNotificationIcon(type: string) {
//   switch (type) {
//     case 'TASK_ASSIGNED':
//       return 'checkbox-outline';
//     case 'MESSAGE':
//       return 'chatbubble-outline';
//     case 'REMINDER':
//       return 'alarm-outline';
//     default:
//       return 'notifications-outline';
//   }
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContainer: {
//     padding: theme.spacing.lg,
//   },
//   listContainerEmpty: {
//     flexGrow: 1,
//   },
//   notificationCard: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     padding: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     ...theme.shadows.sm,
//   },
//   notificationUnread: {
//     backgroundColor: theme.colors.primary[50],
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: theme.colors.primary[100],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: theme.spacing.md,
//   },
//   notificationContent: {
//     flex: 1,
//   },
//   notificationTitle: {
//     ...theme.typography.body1,
//     color: theme.colors.text.primary,
//     marginBottom: 4,
//   },
//   notificationTitleUnread: {
//     fontWeight: '600',
//   },
//   notificationMessage: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     marginBottom: 4,
//   },
//   notificationTime: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
//   },
//   unreadDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: theme.colors.primary[500],
//     marginLeft: theme.spacing.sm,
//     marginTop: 6,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: theme.spacing.xl,
//   },
//   emptyTitle: {
//     ...theme.typography.h3,
//     color: theme.colors.text.primary,
//     marginTop: theme.spacing.md,
//   },
//   emptySubtitle: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     textAlign: 'center',
//     marginTop: theme.spacing.xs,
//   },
// });



import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, useMarkNotificationsAsRead } from '../../hooks/useApi';
import { formatDate } from '../../utils';
import { Notification } from '../../types';

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

export default function NotificationsScreen() {
  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications();
  const markAsRead = useMarkNotificationsAsRead();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const filteredNotifications = filter === 'unread' 
    ? notifications?.filter(n => !n.read) 
    : notifications;

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markAsRead.mutateAsync([notification.id]);
        refetch();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications?.filter(n => !n.read).map(n => n.id) || [];
    if (unreadIds.length > 0) {
      try {
        await markAsRead.mutateAsync(unreadIds);
        refetch();
      } catch (error) {
        console.error('Failed to mark all as read:', error);
      }
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return {
          icon: 'checkbox' as const,
          color: colors.success,
          bg: colors.success + '20',
          title: 'Task Assigned',
        };
      case 'TASK_UPDATED':
        return {
          icon: 'sync' as const,
          color: colors.info,
          bg: colors.info + '20',
          title: 'Task Updated',
        };
      case 'MESSAGE':
        return {
          icon: 'chatbubble' as const,
          color: colors.accent,
          bg: colors.accent + '20',
          title: 'New Message',
        };
      case 'MENTION':
        return {
          icon: 'at' as const,
          color: colors.warning,
          bg: colors.warning + '20',
          title: 'Mentioned You',
        };
      case 'REMINDER':
        return {
          icon: 'alarm' as const,
          color: colors.danger,
          bg: colors.danger + '20',
          title: 'Reminder',
        };
      case 'TEAM_UPDATE':
        return {
          icon: 'people' as const,
          color: colors.primary,
          bg: colors.primary + '20',
          title: 'Team Update',
        };
      default:
        return {
          icon: 'notifications' as const,
          color: colors.textTertiary,
          bg: colors.cardLight,
          title: 'Notification',
        };
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const config = getNotificationConfig(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.read && styles.notificationUnread,
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
          {!item.read && (
            <View style={[styles.unreadIndicator, { backgroundColor: config.color }]} />
          )}
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>
              {config.title}
            </Text>
            <Text style={styles.notificationTime}>{getTimeAgo(item.createdAt)}</Text>
          </View>
          
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {item.message || item.type}
          </Text>
          
          {item.metadata && (
            <View style={styles.metadataContainer}>
              <View style={[styles.metadataBadge, { backgroundColor: config.color + '15' }]}>
                <Text style={[styles.metadataText, { color: config.color }]}>
                  {item.metadata.category || 'Info'}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="notifications" size={20} color={colors.primary} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{notifications?.length || 0}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="alert-circle" size={20} color={colors.warning} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
        </View>
      </View>

      {/* Filters & Actions */}
      <View style={styles.actionsRow}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'unread' && styles.filterButtonActive,
            ]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'unread' && styles.filterButtonTextActive,
              ]}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </Text>
          </TouchableOpacity>
        </View>
        
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Ionicons name="checkmark-done" size={18} color={colors.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="notifications-off-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {filter === 'unread' ? "You're all caught up!" : 'No notifications yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {filter === 'unread' 
          ? 'All your notifications have been read'
          : 'Notifications will appear here when you receive them'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications || []}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            (!filteredNotifications || filteredNotifications.length === 0) && styles.listContainerEmpty,
          ]}
          ListHeaderComponent={notifications && notifications.length > 0 ? renderHeader : null}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
  },
  filterButtonActive: {
    backgroundColor: colors.primary + '30',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterButtonTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
  },
  markAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationUnread: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.card,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  metadataBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metadataText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});