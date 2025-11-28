import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { db } from '@/lib/db';

const expo = new Expo();

interface SendPushNotificationOptions {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  badge?: number;
}

interface SendBatchPushNotificationsOptions {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class ExpoPushService {
  private static instance: ExpoPushService;

  private constructor() {}

  static getInstance(): ExpoPushService {
    if (!ExpoPushService.instance) {
      ExpoPushService.instance = new ExpoPushService();
    }
    return ExpoPushService.instance;
  }

  /**
   * Send a push notification to a single user
   */
  async sendPushNotification(options: SendPushNotificationOptions): Promise<boolean> {
    try {
      const { userId, title, body, data, badge } = options;

      // Get user's push token
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { expoPushToken: true, email: true },
      });

      if (!user || !user.expoPushToken) {
        console.warn(`[ExpoPush] No push token found for user ${userId}`);
        return false;
      }

      // Validate token format
      if (!Expo.isExpoPushToken(user.expoPushToken)) {
        console.warn(`[ExpoPush] Invalid token format for user ${userId}: ${user.expoPushToken}`);
        // Clean up invalid token
        await this.invalidateToken(userId);
        return false;
      }

      // Create message
      const message: ExpoPushMessage = {
        to: user.expoPushToken,
        sound: 'default',
        title,
        body,
        data: data || {},
        badge,
      };

      // Send notification
      const tickets = await expo.sendPushNotificationsAsync([message]);

      // Check for immediate errors
      for (const ticket of tickets) {
        if (ticket.type === 'error') {
          console.error(`[ExpoPush] Error sending to ${user.email}:`, ticket.message);

          // Handle specific errors
          if (
            ticket.message === 'The device token is invalid' ||
            ticket.message === 'Invalid token' ||
            ticket.message === 'Token has expired'
          ) {
            await this.invalidateToken(userId);
          }
          return false;
        }
      }

      // Save notification record
      await db.pushNotification.create({
        data: {
          userId,
          title,
          body,
          data,
          sentAt: new Date(),
        },
      });

      console.log(`[ExpoPush] Notification sent successfully to ${user.email}`);
      return true;
    } catch (error) {
      console.error('[ExpoPush] Error in sendPushNotification:', error);
      return false;
    }
  }

  /**
   * Send push notifications to multiple users
   */
  async sendBatchPushNotifications(
    options: SendBatchPushNotificationsOptions
  ): Promise<{ success: number; failed: number }> {
    const { userIds, title, body, data } = options;
    let successCount = 0;
    let failedCount = 0;

    try {
      // Get all users with push tokens
      const users = await db.user.findMany({
        where: { id: { in: userIds }, expoPushToken: { not: null } },
        select: { id: true, expoPushToken: true, email: true },
      });

      if (users.length === 0) {
        console.warn('[ExpoPush] No valid push tokens found for batch send');
        return { success: 0, failed: userIds.length };
      }

      // Filter valid tokens
      const validMessages: ExpoPushMessage[] = [];
      const userTokenMap: Record<string, string> = {};

      for (const user of users) {
        if (user.expoPushToken && Expo.isExpoPushToken(user.expoPushToken)) {
          validMessages.push({
            to: user.expoPushToken,
            sound: 'default',
            title,
            body,
            data: data || {},
          });
          userTokenMap[user.expoPushToken] = user.id;
        }
      }

      if (validMessages.length === 0) {
        console.warn('[ExpoPush] No valid tokens to send batch notifications');
        return { success: 0, failed: userIds.length };
      }

      // Send notifications in chunks (Expo API limits)
      const chunks = validMessages.reduce((acc, msg, i) => {
        const chunkIndex = Math.floor(i / 100);
        if (!acc[chunkIndex]) acc[chunkIndex] = [];
        acc[chunkIndex].push(msg);
        return acc;
      }, [] as ExpoPushMessage[][]);

      for (const chunk of chunks) {
        const tickets = await expo.sendPushNotificationsAsync(chunk);

        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];
          const message = chunk[i];
          const userId = userTokenMap[message.to as string];

          if (ticket.type === 'error') {
            console.error(`[ExpoPush] Error sending batch notification:`, ticket.message);
            failedCount++;

            // Handle invalid tokens
            if (
              ticket.message === 'The device token is invalid' ||
              ticket.message === 'Invalid token' ||
              ticket.message === 'Token has expired'
            ) {
              await this.invalidateToken(userId);
            }
          } else {
            successCount++;
          }
        }
      }

      // Save notification records
      for (const userId of userIds) {
        try {
          await db.pushNotification.create({
            data: {
              userId,
              title,
              body,
              data,
              sentAt: new Date(),
            },
          });
        } catch (e) {
          console.error(`[ExpoPush] Failed to save notification record for user ${userId}:`, e);
        }
      }

      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error('[ExpoPush] Error in sendBatchPushNotifications:', error);
      return { success: 0, failed: userIds.length };
    }
  }

  /**
   * Invalidate/remove an expired token
   */
  private async invalidateToken(userId: string): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: { expoPushToken: null },
      });
      console.log(`[ExpoPush] Invalidated push token for user ${userId}`);
    } catch (error) {
      console.error(`[ExpoPush] Failed to invalidate token for user ${userId}:`, error);
    }
  }

  /**
   * Get notification history for a user
   */
  async getNotificationHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const notifications = await db.pushNotification.findMany({
        where: { userId },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      return notifications;
    } catch (error) {
      console.error('[ExpoPush] Error fetching notification history:', error);
      return [];
    }
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(notificationIds: string[]): Promise<boolean> {
    try {
      await db.pushNotification.updateMany({
        where: { id: { in: notificationIds } },
        data: { read: true },
      });
      return true;
    } catch (error) {
      console.error('[ExpoPush] Error marking notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete old notifications (cleanup)
   */
  async cleanupOldNotifications(daysOld: number = 30): Promise<number> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - daysOld);

      const result = await db.pushNotification.deleteMany({
        where: { createdAt: { lt: date } },
      });

      console.log(`[ExpoPush] Deleted ${result.count} old notifications`);
      return result.count;
    } catch (error) {
      console.error('[ExpoPush] Error cleaning up old notifications:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const expoPushService = ExpoPushService.getInstance();
