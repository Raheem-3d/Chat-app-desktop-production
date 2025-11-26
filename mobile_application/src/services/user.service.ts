// User and messaging service
import { apiClient } from './api';
import {
  User,
  Message,
  SendMessageRequest,
  Notification,
  Reminder,
  CreateReminderRequest,
  UploadResponse,
} from '../types';

export const userService = {
  /**
   * Get all users in the organization
   */
  async getUsers(): Promise<User[]> {
    return await apiClient.get<User[]>('/users');
  },

  /**
   * Get a specific user
   */
  async getUser(userId: string): Promise<User> {
    return await apiClient.get<User>(`/users/${userId}`);
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: { name?: string; image?: string }
  ): Promise<User> {
    return await apiClient.patch<User>(`/users/${userId}`, data);
  },

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<UploadResponse> {
    return await apiClient.uploadFile('/users/profile-picture', file);
  },

  /**
   * Get direct messages with a user
   */
  async getDirectMessages(
    userId: string,
    limit?: number
  ): Promise<Message[]> {
    const params = limit ? `?userId=${userId}&limit=${limit}` : `?userId=${userId}`;
    const response = await apiClient.get<{ messages?: Message[] } | Message[]>(
      `/messages/direct${params}`
    );
    
    if (Array.isArray(response)) {
      return response;
    }
    return response.messages || [];
  },

  /**
   * Send a direct message
   */
  async sendDirectMessage(
    receiverId: string,
    data: Omit<SendMessageRequest, 'receiverId'>
  ): Promise<Message> {
    return await apiClient.post<Message>('/messages', {
      ...data,
      receiverId,
    });
  },
};

export const notificationService = {
  /**
   * Get user notifications
   */
  async getNotifications(): Promise<Notification[]> {
    return await apiClient.get<Notification[]>('/users/me/notifications');
  },

  /**
   * Mark notifications as read
   */
  async markAsRead(
    notificationIds: string[]
  ): Promise<{ count: number }> {
    return await apiClient.post('/users/me/notifications', {
      notificationIds,
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ count: number; message: string }> {
    return await apiClient.post('/notifications/mark-all-read', {});
  },
};

export const reminderService = {
  /**
   * Get user reminders
   */
  async getReminders(): Promise<Reminder[]> {
    return await apiClient.get<Reminder[]>('/reminders');
  },

  /**
   * Create a reminder
   */
  async createReminder(data: CreateReminderRequest): Promise<Reminder> {
    return await apiClient.post<Reminder>('/reminders', data);
  },

  /**
   * Delete a reminder
   */
  async deleteReminder(
    reminderId: string
  ): Promise<{ message: string }> {
    return await apiClient.delete(`/reminders/${reminderId}`);
  },

  /**
   * Mute/unmute a reminder
   */
  async toggleMuteReminder(reminderId: string): Promise<Reminder> {
    return await apiClient.patch<Reminder>(
      `/reminders/${reminderId}/mute`,
      {}
    );
  },
};

export const uploadService = {
  /**
   * Upload a file (image, document, etc.)
   */
  async uploadFile(file: {
    uri: string;
    name: string;
    type: string;
  }): Promise<UploadResponse> {
    return await apiClient.uploadFile('/upload', file);
  },
};
