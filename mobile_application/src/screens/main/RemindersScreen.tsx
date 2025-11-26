import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useReminders, useDeleteReminder, useCreateReminder, useCurrentUser, useUsers } from '../../hooks/useApi';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ReminderPriority, ReminderType, User } from '../../types';
import { TextInput } from 'react-native';
import { useTheme } from '../../theme';
import { formatDate } from '../../utils';
import type { Reminder } from '../../types';

export default function RemindersScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { data: reminders, isLoading, refetch, isRefetching } = useReminders();
  const deleteReminder = useDeleteReminder();
  const createReminder = useCreateReminder();
  const { data: currentUser } = useCurrentUser();
  const { data: users } = useUsers();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(getDefaultReminderForm(currentUser));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [creating, setCreating] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.default,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.background.paper,
      borderBottomWidth: 1,
      borderBottomColor: theme.border.light,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: '700',
      color: theme.text.primary,
      textAlign: 'center',
    },
    headerRight: {
      width: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContainer: {
      padding: 24,
    },
    listContainerEmpty: {
      flexGrow: 1,
    },
    reminderCard: {
      backgroundColor: theme.background.paper,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    reminderContent: {
      gap: 8,
    },
    reminderHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    iconContainerOverdue: {
      backgroundColor: '#fee2e2',
    },
    reminderInfo: {
      flex: 1,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text.primary,
    },
    reminderDescription: {
      fontSize: 14,
      color: theme.text.secondary,
      marginTop: 4,
    },
    reminderFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    dateText: {
      fontSize: 12,
      color: theme.text.secondary,
    },
    dateTextOverdue: {
      color: theme.error?.main || theme.secondary[500],
      fontWeight: '600',
    },
    overdueBadge: {
      backgroundColor: '#fee2e2',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
    },
    overdueBadgeText: {
      fontSize: 10,
      color: theme.error?.main || theme.secondary[500],
      fontWeight: '600',
    },
    deleteButton: {
      padding: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text.primary,
      marginTop: 16,
    },
    emptySubtitle: {
      fontSize: 14,
      color: theme.text.secondary,
      textAlign: 'center',
      marginTop: 4,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: theme.background.paper,
      borderRadius: 12,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 24,
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: 16,
    },
    formGroupRow: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text.primary,
      marginBottom: 8,
    },
    inputBox: {
      borderWidth: 1,
      borderColor: theme.border.light,
      borderRadius: 8,
      backgroundColor: theme.background.default,
    },
    input: {
      padding: 12,
      fontSize: 16,
      color: theme.text.primary,
    },
    formActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    buttonPrimary: {
      backgroundColor: theme.primary[500],
    },
    buttonCancel: {
      backgroundColor: theme.background.default,
      borderWidth: 1,
      borderColor: theme.border.light,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text.primary,
    },
  });

  React.useEffect(() => {
    if (showCreate && currentUser) {
      setForm(getDefaultReminderForm(currentUser));
    }
  }, [showCreate, currentUser]);

  const handleCreateReminder = async () => {
    if (!form.title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }
    if (!form.assigneeId) {
      Alert.alert('Validation', 'Assignee is required');
      return;
    }
    setCreating(true);
    try {
      await createReminder.mutateAsync({
        ...form,
        remindAt: form.remindAt instanceof Date ? form.remindAt.toISOString() : form.remindAt,
      });
      setShowCreate(false);
      refetch();
    } catch (e) {
      Alert.alert('Error', 'Failed to create reminder');
    } finally {
      setCreating(false);
    }
  };

  const handleReminderPress = (reminder: Reminder) => {
    if (reminder.taskId) {
      // @ts-ignore
      navigation.navigate('TaskDetail', { taskId: reminder.taskId });
    }
  };

  const handleDeleteReminder = (reminderId: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReminder.mutateAsync(reminderId);
              refetch();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const renderReminder = ({ item }: { item: Reminder }) => {
    const isOverdue = new Date(item.remindAt) < new Date();

    return (
      <TouchableOpacity
        style={styles.reminderCard}
        onPress={() => handleReminderPress(item)}
      >
        <View style={styles.reminderContent}>
          <View style={styles.reminderHeader}>
            <View style={[styles.iconContainer, isOverdue && styles.iconContainerOverdue]}>
              <Ionicons
                name="alarm-outline"
                size={20}
                color={isOverdue ? (theme.error?.main || theme.secondary[500]) : theme.primary[500]}
              />
            </View>
            <View style={styles.reminderInfo}>
              <Text style={styles.reminderTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {item.description && (
                <Text style={styles.reminderDescription} numberOfLines={1}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.reminderFooter}>
            <View style={styles.dateContainer}>
              <Ionicons
                name="time-outline"
                size={16}
                color={isOverdue ? (theme.error?.main || theme.secondary[500]) : theme.text.secondary}
              />
              <Text style={[styles.dateText, isOverdue && styles.dateTextOverdue]}>
                {formatDate(item.remindAt)}
              </Text>
              {isOverdue && (
                <View style={styles.overdueBadge}>
                  <Text style={styles.overdueBadgeText}>OVERDUE</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteReminder(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color={theme.error?.main || theme.secondary[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="alarm-outline" size={64} color={theme.text.secondary} />
      <Text style={styles.emptyTitle}>No reminders</Text>
      <Text style={styles.emptySubtitle}>You don't have any reminders set</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        {currentUser && canCreateReminder(currentUser.role) ? (
          <TouchableOpacity style={styles.headerRight} onPress={() => setShowCreate(true)}>
            <Ionicons name="add-circle-outline" size={28} color={theme.primary[500]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRight} />
        )}
      </View>

      {/* Create Reminder Modal */}
      {showCreate && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Reminder</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title *</Text>
              <TouchableOpacity style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={form.title}
                  onChangeText={text => setForm({ ...form, title: text })}
                  placeholder="Title"
                  autoFocus
                />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TouchableOpacity style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={form.description}
                  onChangeText={text => setForm({ ...form, description: text })}
                  placeholder="Description"
                  multiline
                />
              </TouchableOpacity>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Remind At *</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.input}>{formatDate(form.remindAt)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={form.remindAt instanceof Date ? form.remindAt : new Date(form.remindAt)}
                  mode="datetime"
                  display="default"
                  onChange={(_, date) => {
                    setShowDatePicker(false);
                    if (date) setForm({ ...form, remindAt: date });
                  }}
                />
              )}
            </View>
            <View style={styles.formGroupRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Priority *</Text>
                <TouchableOpacity style={styles.inputBox}>
                  <Picker
                    selectedValue={form.priority}
                    onValueChange={val => setForm({ ...form, priority: val })}
                  >
                    <Picker.Item label="Low" value="LOW" />
                    <Picker.Item label="Medium" value="MEDIUM" />
                    <Picker.Item label="High" value="HIGH" />
                    <Picker.Item label="Urgent" value="URGENT" />
                  </Picker>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.label}>Type *</Text>
                <TouchableOpacity style={styles.inputBox}>
                  <Picker
                    selectedValue={form.type}
                    onValueChange={val => setForm({ ...form, type: val })}
                  >
                    <Picker.Item label="General" value="GENERAL" />
                    <Picker.Item label="Task Deadline" value="TASK_DEADLINE" />
                    <Picker.Item label="Meeting" value="MEETING" />
                    <Picker.Item label="Follow Up" value="FOLLOW_UP" />
                    <Picker.Item label="Personal" value="PERSONAL" />
                  </Picker>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Assignee *</Text>
              <TouchableOpacity style={styles.inputBox}>
                <Picker
                  selectedValue={form.assigneeId}
                  onValueChange={val => setForm({ ...form, assigneeId: val })}
                >
                  {users && users.map(u => (
                    <Picker.Item key={u.id} label={u.name || u.email} value={u.id} />
                  ))}
                </Picker>
              </TouchableOpacity>
            </View>
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, creating && { opacity: 0.6 }]}
                onPress={handleCreateReminder}
                disabled={creating}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setShowCreate(false)}
                disabled={creating}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Reminder List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={reminders || []}
          renderItem={renderReminder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            (!reminders || reminders.length === 0) && styles.listContainerEmpty,
          ]}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.primary[500]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// Helper functions
function getDefaultReminderForm(currentUser: { data?: User | null } | undefined) {
  return {
    title: '',
    description: '',
    remindAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    priority: 'MEDIUM' as ReminderPriority,
    type: 'GENERAL' as ReminderType,
    assigneeId: currentUser?.data?.id || '',
  };
}

function canCreateReminder(role: string | undefined): boolean {
  // Allow most roles to create reminders
  if (!role) return false;
  const allowedRoles = ['SUPER_ADMIN', 'ORG_ADMIN', 'MANAGER', 'EMPLOYEE', 'ORG_MEMBER', 'CLIENT'];
  return allowedRoles.includes(role);
}
