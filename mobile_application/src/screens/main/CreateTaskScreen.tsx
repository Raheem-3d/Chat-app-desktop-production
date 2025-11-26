// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useCreateTask } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import theme from '../../theme';
// import { TaskStatus, TaskPriority } from '../../types';
// import { canCreateTask } from '../../utils/permissions';

// const createTaskSchema = z.object({
//   title: z.string().min(3, 'Title must be at least 3 characters'),
//   description: z.string().optional(),
//   status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
//   priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
// });

// type CreateTaskFormData = z.infer<typeof createTaskSchema>;

// export default function CreateTaskScreen() {
//   const navigation = useNavigation();
//   const { user } = useAuthStore();
//   const createTask = useCreateTask();

//   // Check if user has permission to create tasks
//   const hasCreatePermission = canCreateTask(user?.role, user?.isSuperAdmin);

//   React.useEffect(() => {
//     if (!hasCreatePermission) {
//       Alert.alert(
//         'Permission Denied',
//         'You do not have permission to create tasks. Only SUPER_ADMIN, ORG_ADMIN, MANAGER, EMPLOYEE, and ORG_MEMBER can create tasks.',
//         [{ text: 'OK', onPress: () => navigation.goBack() }]
//       );
//     }
//   }, [hasCreatePermission]);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CreateTaskFormData>({
//     resolver: zodResolver(createTaskSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       status: 'TODO',
//       priority: 'MEDIUM',
//     },
//   });

//   const onSubmit = async (data: CreateTaskFormData) => {
//     try {
//       await createTask.mutateAsync({
//         ...data,
//       });
//       Alert.alert('Success', 'Task created successfully', [
//         { text: 'OK', onPress: () => navigation.goBack() },
//       ]);
//     } catch (error: any) {
//       Alert.alert('Error', error?.response?.data?.error || 'Failed to create task');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="close" size={24} color={theme.colors.text.primary} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Create Task</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Title */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Title *</Text>
//             <Controller
//               control={control}
//               name="title"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   style={[styles.input, errors.title && styles.inputError]}
//                   placeholder="Enter task title"
//                   placeholderTextColor={theme.colors.text.secondary}
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                 />
//               )}
//             />
//             {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
//           </View>

//           {/* Description */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Description</Text>
//             <Controller
//               control={control}
//               name="description"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <TextInput
//                   style={[styles.textArea, errors.description && styles.inputError]}
//                   placeholder="Enter task description"
//                   placeholderTextColor={theme.colors.text.secondary}
//                   value={value}
//                   onChangeText={onChange}
//                   onBlur={onBlur}
//                   multiline
//                   numberOfLines={4}
//                   textAlignVertical="top"
//                 />
//               )}
//             />
//           </View>

//           {/* Status */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Status *</Text>
//             <Controller
//               control={control}
//               name="status"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.optionGroup}>
//                   {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
//                     <TouchableOpacity
//                       key={status}
//                       style={[
//                         styles.optionButton,
//                         value === status && styles.optionButtonActive,
//                       ]}
//                       onPress={() => onChange(status)}
//                     >
//                       <Text
//                         style={[
//                           styles.optionText,
//                           value === status && styles.optionTextActive,
//                         ]}
//                       >
//                         {status.replace('_', ' ')}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             />
//           </View>

//           {/* Priority */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Priority *</Text>
//             <Controller
//               control={control}
//               name="priority"
//               render={({ field: { onChange, value } }) => (
//                 <View style={styles.optionGroup}>
//                   {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((priority) => (
//                     <TouchableOpacity
//                       key={priority}
//                       style={[
//                         styles.optionButton,
//                         value === priority && styles.optionButtonActive,
//                       ]}
//                       onPress={() => onChange(priority)}
//                     >
//                       <Text
//                         style={[
//                           styles.optionText,
//                           value === priority && styles.optionTextActive,
//                         ]}
//                       >
//                         {priority}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               )}
//             />
//           </View>

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[styles.submitButton, createTask.isPending && styles.submitButtonDisabled]}
//             onPress={handleSubmit(onSubmit)}
//             disabled={createTask.isPending}
//           >
//             {createTask.isPending ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>Create Task</Text>
//             )}
//           </TouchableOpacity>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background.default,
//   },
//   keyboardView: {
//     flex: 1,
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
//   headerTitle: {
//     ...theme.typography.h3,
//     color: theme.colors.text.primary,
//   },
//   scrollContent: {
//     padding: theme.spacing.lg,
//   },
//   inputGroup: {
//     marginBottom: theme.spacing.lg,
//   },
//   label: {
//     ...theme.typography.body2,
//     fontWeight: '600',
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.xs,
//   },
//   input: {
//     ...theme.typography.body1,
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     color: theme.colors.text.primary,
//   },
//   textArea: {
//     ...theme.typography.body1,
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     color: theme.colors.text.primary,
//     minHeight: 100,
//   },
//   inputError: {
//     borderColor: theme.colors.error.main,
//   },
//   errorText: {
//     ...theme.typography.caption,
//     color: theme.colors.error.main,
//     marginTop: theme.spacing.xs,
//   },
//   optionGroup: {
//     flexDirection: 'row',
//     gap: theme.spacing.sm,
//   },
//   optionButton: {
//     flex: 1,
//     paddingVertical: theme.spacing.sm,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//   },
//   optionButtonActive: {
//     backgroundColor: theme.colors.primary[500],
//     borderColor: theme.colors.primary[500],
//   },
//   optionText: {
//     ...theme.typography.body2,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//     color: theme.colors.text.secondary,
//   },
//   optionTextActive: {
//     color: '#fff',
//   },
//   submitButton: {
//     backgroundColor: theme.colors.primary[500],
//     borderRadius: 8,
//     paddingVertical: theme.spacing.md,
//     alignItems: 'center',
//     marginTop: theme.spacing.lg,
//   },
//   submitButtonDisabled: {
//     opacity: 0.6,
//   },
//   submitButtonText: {
//     ...theme.typography.button,
//     color: '#fff',
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTask } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
import { TaskStatus, TaskPriority } from '../../types';
import { canCreateTask } from '../../utils/permissions';

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
  inputBg: '#1e293b',
  inputBorder: '#334155',
};

const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export default function CreateTaskScreen() {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const createTask = useCreateTask();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const hasCreatePermission = canCreateTask(user?.role, user?.isSuperAdmin);

  React.useEffect(() => {
    if (!hasCreatePermission) {
      Alert.alert(
        'Permission Denied',
        'You do not have permission to create tasks.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [hasCreatePermission]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
    },
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask.mutateAsync({
        ...data,
      });
      Alert.alert('Success', 'Task created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to create task');
    }
  };

  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return { icon: 'radio-button-off' as const, color: colors.info };
      case 'IN_PROGRESS':
        return { icon: 'hourglass' as const, color: colors.warning };
      case 'DONE':
        return { icon: 'checkmark-circle' as const, color: colors.success };
    }
  };

  const getPriorityConfig = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW':
        return { icon: 'arrow-down' as const, color: colors.success };
      case 'MEDIUM':
        return { icon: 'remove' as const, color: colors.warning };
      case 'HIGH':
        return { icon: 'arrow-up' as const, color: colors.danger };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Create Task</Text>
            <Text style={styles.headerSubtitle}>Add a new task to your list</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Title *</Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'title' && styles.inputWrapperFocused,
                    errors.title && styles.inputWrapperError,
                  ]}
                >
                  <View
                    style={[
                      styles.inputIconBox,
                      focusedField === 'title' && { backgroundColor: colors.primary + '30' },
                    ]}
                  >
                    <Ionicons
                      name="create"
                      size={20}
                      color={focusedField === 'title' ? colors.primary : colors.textTertiary}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter task title..."
                    placeholderTextColor={colors.textTertiary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('title')}
                  />
                </View>
              )}
            />
            {errors.title && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={styles.errorText}>{errors.title.message}</Text>
              </View>
            )}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.textAreaWrapper,
                    focusedField === 'description' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    style={styles.textArea}
                    placeholder="Describe the task in detail..."
                    placeholderTextColor={colors.textTertiary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      setFocusedField(null);
                    }}
                    onFocus={() => setFocusedField('description')}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              )}
            />
          </View>

          {/* Status Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status *</Text>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View style={styles.optionsGrid}>
                  {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => {
                    const config = getStatusConfig(status);
                    const isSelected = value === status;
                    
                    return (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.optionCard,
                          isSelected && styles.optionCardActive,
                          isSelected && { borderColor: config.color, backgroundColor: config.color + '15' },
                        ]}
                        onPress={() => onChange(status)}
                      >
                        <View
                          style={[
                            styles.optionIcon,
                            { backgroundColor: isSelected ? config.color + '30' : colors.cardLight },
                          ]}
                        >
                          <Ionicons
                            name={config.icon}
                            size={24}
                            color={isSelected ? config.color : colors.textTertiary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && { color: config.color, fontWeight: '700' },
                          ]}
                        >
                          {status.replace('_', ' ')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
          </View>

          {/* Priority Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority *</Text>
            <Controller
              control={control}
              name="priority"
              render={({ field: { onChange, value } }) => (
                <View style={styles.optionsGrid}>
                  {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((priority) => {
                    const config = getPriorityConfig(priority);
                    const isSelected = value === priority;
                    
                    return (
                      <TouchableOpacity
                        key={priority}
                        style={[
                          styles.optionCard,
                          isSelected && styles.optionCardActive,
                          isSelected && { borderColor: config.color, backgroundColor: config.color + '15' },
                        ]}
                        onPress={() => onChange(priority)}
                      >
                        <View
                          style={[
                            styles.optionIcon,
                            { backgroundColor: isSelected ? config.color + '30' : colors.cardLight },
                          ]}
                        >
                          <Ionicons
                            name={config.icon}
                            size={24}
                            color={isSelected ? config.color : colors.textTertiary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && { color: config.color, fontWeight: '700' },
                          ]}
                        >
                          {priority}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={styles.infoText}>
              All fields marked with * are required
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, createTask.isPending && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={createTask.isPending}
          >
            {createTask.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.submitButtonText}>Create Task</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  scrollContent: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  inputWrapperError: {
    borderColor: colors.danger,
  },
  inputIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    padding: 0,
  },
  textAreaWrapper: {
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    padding: 16,
  },
  textArea: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.danger,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionCardActive: {
    borderWidth: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.info + '15',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
});