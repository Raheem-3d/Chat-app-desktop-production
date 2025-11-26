// import React, { useState } from 'react';
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
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useTasks } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import { usePermissions } from '../../hooks/usePermissions';
// import { formatDate } from '../../utils';
// import { Task, TaskStatus, TaskPriority } from '../../types';
// import theme from '../../theme';



// const STATUS_FILTERS = [
//   { label: 'All', value: null },
//   { label: 'To Do', value: 'TODO' as TaskStatus },
//   { label: 'In Progress', value: 'IN_PROGRESS' as TaskStatus },
//   { label: 'Done', value: 'DONE' as TaskStatus },
// ];

// // Priority filter options
// const PRIORITY_FILTERS = [
//   { label: 'All', value: null },
//   { label: 'Low', value: 'LOW' as TaskPriority },
//   { label: 'Medium', value: 'MEDIUM' as TaskPriority },
//   { label: 'High', value: 'HIGH' as TaskPriority },
// ];

// export default function TasksScreen() {
//   const navigation = useNavigation();
//   const { user } = useAuthStore();
//   const permissions = usePermissions();
//   const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
//   const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null);
  
//   const organizationId = user?.organizationId;

//   const { data: tasks, isLoading, refetch, isRefetching } = useTasks({
//     status: statusFilter || undefined,
//     priority: priorityFilter || undefined,
//   });

//   const getStatusColor = (status: TaskStatus) => {
//     switch (status) {
//       case 'TODO':
//         return theme.colors.warning.main;
//       case 'IN_PROGRESS':
//         return theme.colors.info.main;
//       case 'DONE':
//         return theme.colors.success.main;
//       default:
//         return theme.colors.text.secondary;
//     }
//   };

//   const getPriorityColor = (priority: TaskPriority) => {
//     switch (priority) {
//       case 'LOW':
//         return theme.colors.success.main;
//       case 'MEDIUM':
//         return theme.colors.warning.main;
//       case 'HIGH':
//         return theme.colors.error.main;
//       default:
//         return theme.colors.text.secondary;
//     }
//   };

//   const renderTaskItem = ({ item }: { item: Task }) => (
//     <TouchableOpacity
//       style={styles.taskCard}
//       onPress={() => {
//         // @ts-ignore - Navigation typing issue with params
//         navigation.navigate('TaskDetail', { taskId: item.id });
//       }}
//     >
//       <View style={styles.taskHeader}>
//         <Text style={styles.taskTitle} numberOfLines={2}>
//           {item.title}
//         </Text>
//         <View style={styles.badges}>
//           <View
//             style={[
//               styles.badge,
//               { backgroundColor: getStatusColor(item.status) + '20' },
//             ]}
//           >
//             <Text
//               style={[styles.badgeText, { color: getStatusColor(item.status) }]}
//             >
//               {item.status.replace('_', ' ')}
//             </Text>
//           </View>
//           <View
//             style={[
//               styles.badge,
//               { backgroundColor: getPriorityColor(item.priority) + '20' },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.badgeText,
//                 { color: getPriorityColor(item.priority) },
//               ]}
//             >
//               {item.priority}
//             </Text>
//           </View>
//         </View>
//       </View>

//       {item.description && (
//         <Text style={styles.taskDescription} numberOfLines={2}>
//           {item.description}
//         </Text>
//       )}

//       <View style={styles.taskFooter}>
//         <View style={styles.footerLeft}>
//           <Text style={styles.taskMeta}>ID: {item.id.slice(0, 8)}</Text>
//         </View>
//         <Ionicons
//           name="chevron-forward"
//           size={20}
//           color={theme.colors.text.secondary}
//         />
//       </View>
//     </TouchableOpacity>
//   );

//   const renderEmptyState = () => (
//     <View style={styles.emptyState}>
//       <Ionicons
//         name="checkmark-done-outline"
//         size={64}
//         color={theme.colors.text.secondary}
//       />
//       <Text style={styles.emptyTitle}>No tasks found</Text>
//       <Text style={styles.emptySubtitle}>
//         {statusFilter || priorityFilter
//           ? 'Try adjusting your filters'
//           : 'Create your first task to get started'}
//       </Text>
//     </View>
//   );

//   const renderFilters = () => (
//     <View style={styles.filtersContainer}>
//       {/* Status Filter */}
//       <View style={styles.filterSection}>
//         <Text style={styles.filterLabel}>Status:</Text>
//         <View style={styles.filterButtons}>
//           {STATUS_FILTERS.map((filter) => (
//             <TouchableOpacity
//               key={filter.label}
//               style={[
//                 styles.filterButton,
//                 statusFilter === filter.value && styles.filterButtonActive,
//               ]}
//               onPress={() => setStatusFilter(filter.value)}
//             >
//               <Text
//                 style={[
//                   styles.filterButtonText,
//                   statusFilter === filter.value && styles.filterButtonTextActive,
//                 ]}
//               >
//                 {filter.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Priority Filter */}
//       <View style={styles.filterSection}>
//         <Text style={styles.filterLabel}>Priority:</Text>
//         <View style={styles.filterButtons}>
//           {PRIORITY_FILTERS.map((filter) => (
//             <TouchableOpacity
//               key={filter.label}
//               style={[
//                 styles.filterButton,
//                 priorityFilter === filter.value && styles.filterButtonActive,
//               ]}
//               onPress={() => setPriorityFilter(filter.value)}
//             >
//               <Text
//                 style={[
//                   styles.filterButtonText,
//                   priorityFilter === filter.value &&
//                     styles.filterButtonTextActive,
//                 ]}
//               >
//                 {filter.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </View>
//   );

//   if (!organizationId) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <View style={styles.errorState}>
//           <Text style={styles.errorText}>No organization found</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Tasks</Text>
//         {permissions.canCreateTask() && (
//           <TouchableOpacity
//             style={styles.createButton}
//             onPress={() => navigation.navigate('CreateTask' as never)}
//           >
//             <Ionicons name="add" size={24} color="#fff" />
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Filters */}
//       {renderFilters()}

//       {/* Task List */}
//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={theme.colors.primary[500]} />
//         </View>
//       ) : (
//         <FlatList
//           data={tasks || []}
//           renderItem={renderTaskItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={[
//             styles.listContainer,
//             (!tasks || tasks.length === 0) && styles.listContainerEmpty,
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background.default,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
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
//   createButton: {
//     backgroundColor: theme.colors.primary[500],
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filtersContainer: {
//     backgroundColor: theme.colors.background.paper,
//     paddingHorizontal: theme.spacing.lg,
//     paddingVertical: theme.spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border.light,
//   },
//   filterSection: {
//     marginBottom: theme.spacing.sm,
//   },
//   filterLabel: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
//     marginBottom: theme.spacing.xs,
//     fontWeight: '600',
//   },
//   filterButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: theme.spacing.xs,
//   },
//   filterButton: {
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: 16,
//     backgroundColor: theme.colors.background.default,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//   },
//   filterButtonActive: {
//     backgroundColor: theme.colors.primary[500],
//     borderColor: theme.colors.primary[500],
//   },
//   filterButtonText: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
//     fontWeight: '500',
//   },
//   filterButtonTextActive: {
//     color: '#fff',
//   },
//   listContainer: {
//     padding: theme.spacing.lg,
//   },
//   listContainerEmpty: {
//     flexGrow: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   taskCard: {
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 12,
//     padding: theme.spacing.md,
//     marginBottom: theme.spacing.md,
//     ...theme.shadows.sm,
//   },
//   taskHeader: {
//     marginBottom: theme.spacing.sm,
//   },
//   taskTitle: {
//     ...theme.typography.h4,
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.xs,
//   },
//   badges: {
//     flexDirection: 'row',
//     gap: theme.spacing.xs,
//   },
//   badge: {
//     paddingHorizontal: theme.spacing.sm,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   badgeText: {
//     ...theme.typography.caption,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   taskDescription: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     marginBottom: theme.spacing.sm,
//   },
//   taskFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   footerLeft: {
//     flex: 1,
//   },
//   taskMeta: {
//     ...theme.typography.caption,
//     color: theme.colors.text.secondary,
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
//   errorState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     ...theme.typography.body1,
//     color: theme.colors.error.main,
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import { usePermissions } from '../../hooks/usePermissions';
import { formatDate } from '../../utils';
import { Task, TaskStatus, TaskPriority } from '../../types';

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

const STATUS_FILTERS = [
  { label: 'All', value: null, icon: 'apps' },
  { label: 'To Do', value: 'TODO' as TaskStatus, icon: 'radio-button-off' },
  { label: 'In Progress', value: 'IN_PROGRESS' as TaskStatus, icon: 'hourglass' },
  { label: 'Done', value: 'DONE' as TaskStatus, icon: 'checkmark-circle' },
];

const PRIORITY_FILTERS = [
  { label: 'All', value: null, icon: 'apps' },
  { label: 'Low', value: 'LOW' as TaskPriority, icon: 'arrow-down' },
  { label: 'Medium', value: 'MEDIUM' as TaskPriority, icon: 'remove' },
  { label: 'High', value: 'HIGH' as TaskPriority, icon: 'arrow-up' },
];

export default function TasksScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const permissions = usePermissions();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null);
  
  const organizationId = user?.organizationId;

  const { data: tasks, isLoading, refetch, isRefetching } = useTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return { color: colors.info, icon: 'radio-button-off', label: 'To Do' };
      case 'IN_PROGRESS':
        return { color: colors.warning, icon: 'hourglass', label: 'In Progress' };
      case 'DONE':
        return { color: colors.success, icon: 'checkmark-circle', label: 'Done' };
      default:
        return { color: colors.textTertiary, icon: 'ellipse', label: status };
    }
  };

  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW':
        return { color: colors.success, icon: 'arrow-down', label: 'Low' };
      case 'MEDIUM':
        return { color: colors.warning, icon: 'remove', label: 'Medium' };
      case 'HIGH':
        return { color: colors.danger, icon: 'arrow-up', label: 'High' };
      default:
        return { color: colors.textTertiary, icon: 'help', label: priority };
    }
  };

  const getTaskProgress = (task: Task) => {
    if (task.status === 'DONE') return 100;
    if (task.status === 'IN_PROGRESS') return 50;
    return 0;
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    const statusConfig = getStatusConfig(item.status);
    const priorityConfig = getPriorityConfig(item.priority);
    const progress = getTaskProgress(item);

    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('TaskDetail', { taskId: item.id });
        }}
      >
        <View style={styles.taskCardTop}>
          <View style={[styles.taskIconBox, { backgroundColor: statusConfig.color + '20' }]}>
            <Ionicons name={statusConfig.icon as any} size={24} color={statusConfig.color} />
          </View>
          
          <View style={styles.taskBadges}>
            <View style={[styles.badge, { backgroundColor: priorityConfig.color + '20' }]}>
              <Ionicons name={priorityConfig.icon as any} size={12} color={priorityConfig.color} />
              <Text style={[styles.badgeText, { color: priorityConfig.color }]}>
                {priorityConfig.label}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {item.description && (
          <Text style={styles.taskDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        <View style={styles.taskMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="folder-outline" size={14} color={colors.textTertiary} />
            <Text style={styles.metaText}>{item.category || 'General'}</Text>
          </View>
          {item.dueDate && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
              <Text style={styles.metaText}>{formatDate(item.dueDate)}</Text>
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>{statusConfig.label}</Text>
            <Text style={[styles.progressPercent, { color: statusConfig.color }]}>
              {progress}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: statusConfig.color,
                },
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Status Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Status</Text>
        <View style={styles.filterChips}>
          {STATUS_FILTERS.map((filter) => {
            const isActive = statusFilter === filter.value;
            return (
              <TouchableOpacity
                key={filter.label}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  isActive && { backgroundColor: colors.primary + '30', borderColor: colors.primary }
                ]}
                onPress={() => setStatusFilter(filter.value)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={isActive ? colors.primary : colors.textTertiary}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && { color: colors.primary, fontWeight: '700' }
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Priority Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Priority</Text>
        <View style={styles.filterChips}>
          {PRIORITY_FILTERS.map((filter) => {
            const isActive = priorityFilter === filter.value;
            return (
              <TouchableOpacity
                key={filter.label}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                  isActive && { backgroundColor: colors.accent + '30', borderColor: colors.accent }
                ]}
                onPress={() => setPriorityFilter(filter.value)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={isActive ? colors.accent : colors.textTertiary}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && { color: colors.accent, fontWeight: '700' }
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderHeader = () => {
    const todoCount = tasks?.filter(t => t.status === 'TODO').length || 0;
    const inProgressCount = tasks?.filter(t => t.status === 'IN_PROGRESS').length || 0;
    const doneCount = tasks?.filter(t => t.status === 'DONE').length || 0;

    return (
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { borderLeftColor: colors.info }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.info + '20' }]}>
            <Ionicons name="radio-button-off" size={20} color={colors.info} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{todoCount}</Text>
            <Text style={styles.statLabel}>To Do</Text>
          </View>
        </View>

        <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="hourglass" size={20} color={colors.warning} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </View>

        <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{doneCount}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name="checkmark-done-outline" size={64} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>
        {statusFilter || priorityFilter ? 'No tasks found' : 'No tasks yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {statusFilter || priorityFilter
          ? 'Try adjusting your filters to see more tasks'
          : 'Create your first task to get started'}
      </Text>
      {permissions.canCreateTask() && !statusFilter && !priorityFilter && (
        <TouchableOpacity
          style={styles.createTaskButton}
          onPress={() => navigation.navigate('CreateTask' as never)}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.createTaskButtonText}>Create Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!organizationId) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorState}>
          <View style={[styles.errorIcon, { backgroundColor: colors.danger + '20' }]}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
          </View>
          <Text style={styles.errorText}>No organization found</Text>
          <Text style={styles.errorSubtext}>Please contact your administrator</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tasks</Text>
          <Text style={styles.headerSubtitle}>
            {tasks?.length || 0} {tasks?.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>
        {permissions.canCreateTask() && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateTask' as never)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      {renderFilters()}

      {/* Task List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      ) : (
        <FlatList
          data={tasks || []}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            (!tasks || tasks.length === 0) && styles.listContainerEmpty,
          ]}
          ListHeaderComponent={tasks && tasks.length > 0 ? renderHeader : null}
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
  createButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  filtersContainer: {
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterChipActive: {
    borderWidth: 2,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContainer: {
    padding: 20,
  },
  listContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderLeftWidth: 3,
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
  taskCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  taskCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  taskDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  progressSection: {
    marginTop: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.cardLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
    marginBottom: 24,
  },
  createTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createTaskButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.danger,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
