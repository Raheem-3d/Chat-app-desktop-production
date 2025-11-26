// React Query hooks for data fetching and caching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { taskService } from '../services/task.service';
import { channelService } from '../services/channel.service';
import { userService, notificationService, reminderService,} from '../services/user.service';
import { LoginRequest, RegisterRequest, CreateTaskRequest, UpdateTaskRequest, CreateChannelRequest, SendMessageRequest, CreateReminderRequest, } from '../types';

// Query keys
export const queryKeys = {
  user: ['user'] as const,
  users: ['users'] as const,
  tasks: ['tasks'] as const,
  task: (id: string) => ['task', id] as const,
  channels: ['channels'] as const,
  channel: (id: string) => ['channel', id] as const,
  channelMessages: (id: string) => ['channelMessages', id] as const,
  directMessages: (userId: string) => ['directMessages', userId] as const,
  notifications: ['notifications'] as const,
  reminders: ['reminders'] as const,
};

// Auth hooks 
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: async (data) => {
      queryClient.setQueryData(queryKeys.user, data.user);
      // Ensure the api client has the token in-memory and persisted (fallback)
      try {
        if ((await import('../services/api')).apiClient) {
          const { apiClient } = await import('../services/api');
          if ((apiClient as any).setTokenWithFallback) {
            try {
              const res = await (apiClient as any).setTokenWithFallback(data.token);
              console.log('[useLogin] setTokenWithFallback result:', res);
            } catch (e) {
              console.warn('[useLogin] setTokenWithFallback failed:', e);
            }
          } else {
            try {
              await apiClient.setToken(data.token);
            } catch (e) {
              console.warn('[useLogin] setToken failed:', e);
            }
          }
          if ((apiClient as any).setUser) {
            try {
              await (apiClient as any).setUser(data.user);
            } catch (e) {
              console.warn('[useLogin] setUser failed:', e);
            }
          }
        }
      } catch (e) {
        // don't block UI on diagnostic failures
        // eslint-disable-next-line no-console
        console.warn('[useLogin] failed to set token on apiClient:', e);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => authService.getCurrentUser(),
    staleTime: Infinity, // User data doesn't change frequently
  });
};

// Task hooks
export const useTasks = (params?: {
  status?: string;
  priority?: string;
  assignedTo?: string;
  createdBy?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.tasks, params],
    queryFn: () => taskService.getTasks(params),
    staleTime: 30000, // 30 seconds
  });
};

export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: queryKeys.task(taskId),
    queryFn: () => taskService.getTask(taskId),
    enabled: !!taskId,
  });
};


export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
};


export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: UpdateTaskRequest;
    }) => taskService.updateTask(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({
        queryKey: queryKeys.task(variables.taskId),
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });
};

// Channel hooks
export const useChannels = () => {
  return useQuery({
    queryKey: queryKeys.channels,
    queryFn: () => channelService.getChannels(),
    staleTime: 60000, // 1 minute
  });
};

export const useChannel = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channel(channelId),
    queryFn: () => channelService.getChannel(channelId),
    enabled: !!channelId,
  });
};

export const useChannelMessages = (channelId: string) => {
  return useQuery({
    queryKey: queryKeys.channelMessages(channelId),
    queryFn: () => channelService.getChannelMessages(channelId),
    enabled: !!channelId,
    staleTime: 10000, // 10 seconds (messages updated frequently)
    refetchInterval: 5000, // Polling every 5 seconds (until Socket.IO is implemented)
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateChannelRequest) =>
      channelService.createChannel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels });
    },
  });
};

export const useSendChannelMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      channelId,
      data,
    }: {
      channelId: string;
      data: Omit<SendMessageRequest, 'channelId'>;
    }) => channelService.sendChannelMessage(channelId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.channelMessages(variables.channelId),
      });
    },
  });
};

// User hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => userService.getUsers(),
    staleTime: 300000, // 5 minutes
  });
};

export const useOrganizationMembers = (organizationId: string) => {
  return useQuery({
    queryKey: [...queryKeys.users, organizationId],
    queryFn: () => userService.getUsers(), // Assuming this returns organization members
    enabled: !!organizationId,
    staleTime: 300000, // 5 minutes
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { name?: string; image?: string } }) =>
      userService.updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

export const useDirectMessages = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.directMessages(userId),
    queryFn: () => userService.getDirectMessages(userId),
    enabled: !!userId,
    staleTime: 10000, // 10 seconds
    refetchInterval: 5000, // Polling every 5 seconds
  });
};

export const useSendDirectMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      receiverId,
      data,
    }: {
      receiverId: string;
      data: Omit<SendMessageRequest, 'receiverId'>;
    }) => userService.sendDirectMessage(receiverId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.directMessages(variables.receiverId),
      });
    },
  });
};

// Notification hooks
export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => notificationService.getNotifications(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Poll every 30 seconds
  });
};

export const useMarkNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationIds: string[]) =>
      notificationService.markAsRead(notificationIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

// Reminder hooks
export const useReminders = () => {
  return useQuery({
    queryKey: queryKeys.reminders,
    queryFn: () => reminderService.getReminders(),
    staleTime: 60000, // 1 minute
  });
};

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReminderRequest) =>
      reminderService.createReminder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
    },
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reminderId: string) =>
      reminderService.deleteReminder(reminderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders });
    },
  });
};
