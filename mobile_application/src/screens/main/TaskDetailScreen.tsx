// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   TextInput,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useApi';
// import theme from '../../theme';
// import { formatDate } from '../../utils';
// import { TaskStatus, TaskPriority } from '../../types';

// type RouteParams = {
//   taskId: string;
// };

// export default function TaskDetailScreen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { taskId } = (route.params as RouteParams) || {};
//   const [isEditing, setIsEditing] = useState(false);
//   const [comment, setComment] = useState('');

//   const { data: task, isLoading, refetch } = useTask(taskId);
//   const updateTask = useUpdateTask();
//   const deleteTask = useDeleteTask();

//   const handleStatusChange = async (status: TaskStatus) => {
//     try {
//       await updateTask.mutateAsync({ taskId, data: { status } });
//       refetch();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update task status');
//     }
//   };

//   const handleDelete = () => {
//     Alert.alert(
//       'Delete Task',
//       'Are you sure you want to delete this task?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteTask.mutateAsync(taskId);
//               navigation.goBack();
//             } catch (error) {
//               Alert.alert('Error', 'Failed to delete task');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const getStatusColor = (status: TaskStatus) => {
//     switch (status) {
//       case 'TODO': return theme.colors.accent; // Use accent for TODO
//       case 'IN_PROGRESS': return theme.colors.primary; // Use primary for IN_PROGRESS
//       case 'DONE': return theme.colors.success; // Use success for DONE
//       default: return theme.colors.text.secondary;
//     }
//   };

//   const getPriorityColor = (priority: TaskPriority) => {
//     switch (priority) {
//       case 'LOW': return theme.colors.success;
//       case 'MEDIUM': return theme.colors.accent;
//       case 'HIGH': return theme.colors.error;
//       default: return theme.colors.text.secondary;
//     }
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <View style={styles.loading}>
//           <ActivityIndicator size="large" color={theme.colors.primary[500]} />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!task) {
//     return (
//       <SafeAreaView style={styles.container} edges={['top']}>
//         <View style={styles.error}>
//           <Text style={styles.errorText}>Task not found</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Task Details</Text>
//         <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
//           <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
//         </TouchableOpacity>
//       </View>

//       <ScrollView style={styles.content}>
//         {/* Title */}
//         <View style={styles.section}>
//           <Text style={styles.title}>{task.title}</Text>
//         </View>

//         {/* Badges */}
//         <View style={styles.badges}>
//           <View style={[styles.badge, { backgroundColor: getStatusColor(task.status) + '20' }]}>
//             <Text style={[styles.badgeText, { color: getStatusColor(task.status) }]}>
//               {task.status.replace('_', ' ')}
//             </Text>
//           </View>
//           <View style={[styles.badge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
//             <Text style={[styles.badgeText, { color: getPriorityColor(task.priority) }]}>
//               {task.priority}
//             </Text>
//           </View>
//         </View>

//         {/* Description */}
//         {task.description && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.description}>{task.description}</Text>
//           </View>
//         )}

//         {/* Quick Actions */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Update Status</Text>
//           <View style={styles.statusButtons}>
//             {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
//               <TouchableOpacity
//                 key={status}
//                 style={[
//                   styles.statusButton,
//                   task.status === status && styles.statusButtonActive,
//                   { borderColor: getStatusColor(status) },
//                 ]}
//                 onPress={() => handleStatusChange(status)}
//               >
//                 <Text
//                   style={[
//                     styles.statusButtonText,
//                     task.status === status && { color: '#fff' },
//                   ]}
//                 >
//                   {status.replace('_', ' ')}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Metadata */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Details</Text>
//           <View style={styles.metaRow}>
//             <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
//             <Text style={styles.metaText}>Created {formatDate(task.createdAt)}</Text>
//           </View>
//           {task.updatedAt && (
//             <View style={styles.metaRow}>
//               <Ionicons name="time-outline" size={20} color={theme.colors.text.secondary} />
//               <Text style={styles.metaText}>Updated {formatDate(task.updatedAt)}</Text>
//             </View>
//           )}
//         </View>
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
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: theme.spacing.lg,
//     paddingVertical: theme.spacing.md,
//     backgroundColor: theme.colors.background.paper,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border.light,
//   },
//   backButton: {
//     padding: theme.spacing.xs,
//   },
//   headerTitle: {
//     ...theme.typography.h3,
//     color: theme.colors.text.primary,
//     flex: 1,
//     textAlign: 'center',
//   },
//   deleteButton: {
//     padding: theme.spacing.xs,
//   },
//   content: {
//     flex: 1,
//     padding: theme.spacing.lg,
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   error: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     ...theme.typography.body1,
//     color: theme.colors.error,
//     fontWeight: '400',
//   },
//   section: {
//     marginBottom: theme.spacing.xl,
//   },
//   title: {
//     ...theme.typography.h2,
//     color: theme.colors.text.primary,
//     fontWeight: '700',
//   },
//   badges: {
//     flexDirection: 'row',
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.lg,
//   },
//   badge: {
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: 8,
//   },
//   badgeText: {
//     ...theme.typography.body2,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   sectionTitle: {
//     ...theme.typography.h4,
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.sm,
//   },
//   description: {
//     ...theme.typography.body1,
//     color: theme.colors.text.secondary,
//     lineHeight: 24,
//     fontWeight: '400',
//   },
//   statusButtons: {
//     flexDirection: 'row',
//     gap: theme.spacing.sm,
//   },
//   statusButton: {
//     flex: 1,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: 8,
//     borderWidth: 2,
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//   },
//   statusButtonActive: {
//     backgroundColor: theme.colors.primary[500],
//     borderColor: theme.colors.primary[500],
//   },
//   statusButtonText: {
//     ...theme.typography.body2,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//     color: theme.colors.text.secondary,
//   },
//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.sm,
//   },
//   metaText: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//     fontWeight: '400',
//   },
// });



import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useApi';
import { formatDate } from '../../utils';
import { TaskStatus, TaskPriority } from '../../types';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

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

type RouteParams = {
  taskId: string;
};

// Progress Circle Component
const ProgressCircle = ({ percentage, size = 120 }: any) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <View style={styles.progressCircleContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.cardLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
        <Text style={styles.progressLabel}>Complete</Text>
      </View>
    </View>
  );
};

export default function TaskDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { taskId } = (route.params as RouteParams) || {};

  const { data: task, isLoading, refetch } = useTask(taskId);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await updateTask.mutateAsync({ taskId, data: { status } });
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask.mutateAsync(taskId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

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

  const getTaskProgress = () => {
    if (task?.status === 'DONE') return 100;
    if (task?.status === 'IN_PROGRESS') return 50;
    return 0;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading task...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.error}>
          <View style={styles.errorIcon}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.danger} />
          </View>
          <Text style={styles.errorText}>Task not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(task.status);
  const priorityConfig = getPriorityConfig(task.priority);
  const progress = getTaskProgress();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Task Details</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card with Progress */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.title}>{task.title}</Text>
              <Text style={styles.category}>{task.category || 'General Task'}</Text>
              
              <View style={styles.badgesRow}>
                <View style={[styles.modernBadge, { backgroundColor: statusConfig.color + '20' }]}>
                  <Ionicons name={statusConfig.icon as any} size={14} color={statusConfig.color} />
                  <Text style={[styles.badgeText, { color: statusConfig.color }]}>
                    {statusConfig.label}
                  </Text>
                </View>
                
                <View style={[styles.modernBadge, { backgroundColor: priorityConfig.color + '20' }]}>
                  <Ionicons name={priorityConfig.icon as any} size={14} color={priorityConfig.color} />
                  <Text style={[styles.badgeText, { color: priorityConfig.color }]}>
                    {priorityConfig.label}
                  </Text>
                </View>
              </View>
            </View>
            
            <ProgressCircle percentage={progress} />
          </View>
        </View>

        {/* Description Card */}
        {task.description && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Description</Text>
            </View>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}

        {/* Status Update Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.accent + '20' }]}>
              <Ionicons name="swap-horizontal" size={20} color={colors.accent} />
            </View>
            <Text style={styles.cardTitle}>Update Status</Text>
          </View>
          
          <View style={styles.statusGrid}>
            {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => {
              const config = getStatusConfig(status);
              const isActive = task.status === status;
              
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusCard,
                    isActive && styles.statusCardActive,
                    isActive && { 
                      backgroundColor: config.color + '20',
                      borderColor: config.color,
                    },
                  ]}
                  onPress={() => handleStatusChange(status)}
                  disabled={updateTask.isLoading}
                >
                  <View style={[
                    styles.statusIcon,
                    isActive && { backgroundColor: config.color + '30' }
                  ]}>
                    <Ionicons
                      name={config.icon as any}
                      size={24}
                      color={isActive ? config.color : colors.textTertiary}
                    />
                  </View>
                  <Text style={[
                    styles.statusText,
                    isActive && { color: config.color, fontWeight: '700' }
                  ]}>
                    {config.label}
                  </Text>
                  {isActive && (
                    <View style={[styles.activeIndicator, { backgroundColor: config.color }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Metadata Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.info + '20' }]}>
              <Ionicons name="information-circle" size={20} color={colors.info} />
            </View>
            <Text style={styles.cardTitle}>Information</Text>
          </View>
            <View style={styles.card}>
                <View>
                  
                </View>

            </View>
          
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="calendar" size={18} color={colors.primary} />
              </View>
              <View style={styles.metaContent}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
              </View>
            </View>

            {task.updatedAt && (
              <View style={styles.metaItem}>
                <View style={[styles.metaIconBox, { backgroundColor: colors.warning + '15' }]}>
                  <Ionicons name="time" size={18} color={colors.warning} />
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.metaLabel}>Updated</Text>
                  <Text style={styles.metaValue}>{formatDate(task.updatedAt)}</Text>
                </View>
              </View>
            )}

            {task.dueDate && (
              <View style={styles.metaItem}>
                <View style={[styles.metaIconBox, { backgroundColor: colors.danger + '15' }]}>
                  <Ionicons name="alarm" size={18} color={colors.danger} />
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.metaLabel}>Due Date</Text>
                  <Text style={styles.metaValue}>{formatDate(task.dueDate)}</Text>
                </View>
              </View>
            )}

            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: colors.success + '15' }]}>
                <Ionicons name="person" size={18} color={colors.success} />
              </View>
              <View style={styles.metaContent}>
                <Text style={styles.metaLabel}>Assigned To</Text>
                <Text style={styles.metaValue}>{task.assignedTo || 'Unassigned'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Edit functionality */}}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>Edit Task</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {/* Share functionality */}}
          >
            <Ionicons name="share-outline" size={20} color={colors.accent} />
            <Text style={[styles.actionButtonText, { color: colors.accent }]}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={[styles.actionButtonText, { color: colors.danger }]}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardLight,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLeft: {
    flex: 1,
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 32,
  },
  category: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textTertiary,
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  modernBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressCircleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  statusGrid: {
    gap: 12,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  statusCardActive: {
    borderWidth: 2,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: colors.cardLight,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaGrid: {
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaContent: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  actionsCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});