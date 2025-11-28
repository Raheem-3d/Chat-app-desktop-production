import { expoPushService } from './expo-push.service';
import { db } from '@/lib/db';
/**
 * Notification helper service for sending notifications for specific events
 */
export class NotificationHelperService {
  /**
   * Send notification to user about a new message
   */
  static async notifyNewMessage(
    recipientUserId: string,
    senderName: string,
    channelId?: string,
    channelName?: string
  ): Promise<boolean> {
    try {
      return await expoPushService.sendPushNotification({
        userId: recipientUserId,
        title: `New Message from ${senderName}`,
        body: channelName ? `in ${channelName}` : ' message received',
        data: {
          channelId: channelId || null,
          channelName: channelName || null,
          senderName,
          type: 'message',
        },
        badge: 1,
      });
    } catch (error) {
      console.error('Error sending message notification:', error);
      return false;
    }
  }

  /**
   * Send notification about task assignment
   */
  static async notifyTaskAssignment(
    assigneeUserId: string,
    taskTitle: string,
    assignerName: string,
    taskId: string
  ): Promise<boolean> {
    try {
      return await expoPushService.sendPushNotification({
        userId: assigneeUserId,
        title: 'Task Assigned',
        body: `${assignerName} assigned "${taskTitle}" to you`,
        data: {
          taskId,
          taskTitle,
          assignerName,
          type: 'task_assignment',
        },
        badge: 1,
      });
    } catch (error) {
      console.error('Error sending task assignment notification:', error);
      return false;
    }
  }

  /**
   * Send notification about task due date
   */
  static async notifyTaskDueSoon(
    assigneeUserId: string,
    taskTitle: string,
    dueDate: string,
    taskId: string
  ): Promise<boolean> {
    try {
      return await expoPushService.sendPushNotification({
        userId: assigneeUserId,
        title: 'Task Due Soon',
        body: `"${taskTitle}" is due on ${dueDate}`,
        data: {
          taskId,
          taskTitle,
          dueDate,
          type: 'task_due_soon',
        },
      });
    } catch (error) {
      console.error('Error sending task due soon notification:', error);
      return false;
    }
  }

  /**
   * Send notification about task status change
   */
  static async notifyTaskStatusChange(
    assigneeUserId: string,
    taskTitle: string,
    newStatus: string,
    taskId: string,
    changedBy: string
  ): Promise<boolean> {
    try {
      return await expoPushService.sendPushNotification({
        userId: assigneeUserId,
        title: 'Task Status Updated',
        body: `"${taskTitle}" status changed to ${newStatus} by ${changedBy}`,
        data: {
          taskId,
          taskTitle,
          newStatus,
          changedBy,
          type: 'task_status_changed',
        },
      });
    } catch (error) {
      console.error('Error sending task status notification:', error);
      return false;
    }
  }

  /**
   * Send notification about task comment
   */
  static async notifyTaskComment(
    taskAssigneeUserId: string,
    taskTitle: string,
    commentAuthor: string,
    taskId: string
  ): Promise<boolean> {
    try {
      return await expoPushService.sendPushNotification({
        userId: taskAssigneeUserId,
        title: 'New Comment on Task',
        body: `${commentAuthor} commented on "${taskTitle}"`,
        data: {
          taskId,
          taskTitle,
          commentAuthor,
          type: 'task_comment',
        },
      });
    } catch (error) {
      console.error('Error sending task comment notification:', error);
      return false;
    }
  }

  /**
   * Send notification about reminder
   */
  static async notifyReminder(
    userId: string,
    reminderTitle: string,
    reminderId: string
  ): Promise<boolean> {
    try {
      return await expoPushService.sendPushNotification({
        userId,
        title: 'Reminder',
        body: reminderTitle,
        data: {
          reminderId,
          reminderTitle,
          type: 'reminder',
        },
        badge: 1,
      });
    } catch (error) {
      console.error('Error sending reminder notification:', error);
      return false;
    }
  }

  /**
   * Send notification to multiple users (broadcast)
   */
  static async notifyMultipleUsers(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<{ success: number; failed: number }> {
    try {
      return await expoPushService.sendBatchPushNotifications({
        userIds,
        title,
        body,
        data,
      });
    } catch (error) {
      console.error('Error sending batch notifications:', error);
      return { success: 0, failed: userIds.length };
    }
  }

  /**
   * Send notification to all organization members
   */
  static async notifyOrganizationMembers(
    organizationId: string,
    title: string,
    body: string,
    excludeUserId?: string,
    data?: Record<string, any>
  ): Promise<{ success: number; failed: number }> {
    try {
      const users = await db.user.findMany({
        where: {
          organizationId,
          ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
        },
        select: { id: true },
      });

      const userIds = users.map((u) => u.id);
      if (userIds.length === 0) {
        return { success: 0, failed: 0 };
      }

      return await this.notifyMultipleUsers(userIds, title, body, data);
    } catch (error) {
      console.error('Error notifying organization members:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Send notification to channel members
   */
  static async notifyChannelMembers(
    channelId: string,
    title: string,
    body: string,
    excludeUserId?: string,
    data?: Record<string, any>
  ): Promise<{ success: number; failed: number }> {
    try {
      const channel = await db.channel.findUnique({
        where: { id: channelId },
        include: {
          members: {
            select: { userId: true },
          },
        },
      });

      if (!channel) {
        console.warn(`Channel ${channelId} not found`);
        return { success: 0, failed: 0 };
      }

      let userIds = channel.members.map((m) => m.userId);
      if (excludeUserId) {
        userIds = userIds.filter((id) => id !== excludeUserId);
      }

      if (userIds.length === 0) {
        return { success: 0, failed: 0 };
      }

      return await this.notifyMultipleUsers(userIds, title, body, data);
    } catch (error) {
      console.error('Error notifying channel members:', error);
      return { success: 0, failed: 0 };
    }
  }
}

export const notificationHelperService = NotificationHelperService;
