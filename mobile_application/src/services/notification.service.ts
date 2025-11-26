import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permissions and get push token
   */
  async registerForPushNotifications(): Promise<string | null> {
    // Check if running on physical device (simulator won't work)
    if (!__DEV__ && Platform.OS === 'web') {
      console.warn('Push notifications are not supported on web');
      return null;
    }

    try {
      // Check existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permissions if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      // Get the token that uniquely identifies this device
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // TODO: Replace with your Expo project ID
      });
      
      this.expoPushToken = tokenData.data;
      console.log('Expo Push Token:', this.expoPushToken);

      // Configure Android notification channel
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  /**
   * Get the current push token
   */
  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: trigger || null, // null means show immediately
    });

    return notificationId;
  }

  /**
   * Send immediate notification
   */
  async sendLocalNotification(title: string, body: string, data?: any): Promise<void> {
    await this.scheduleLocalNotification(title, body, data, null);
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Set badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  /**
   * Clear badge
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Add notification received listener (when app is foregrounded)
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Add notification response listener (when user taps notification)
   */
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners(): void {
    // Manually remove listeners by calling remove() on subscriptions
    // Notifications.removeAllNotificationListeners(); // Deprecated
  }

  /**
   * Example: Schedule a reminder notification
   */
  async scheduleReminder(
    title: string,
    body: string,
    triggerDate: Date,
    data?: any
  ): Promise<string> {
    const seconds = Math.max(1, Math.floor((triggerDate.getTime() - Date.now()) / 1000));
    
    // Schedule notification with time interval
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: { seconds } as any, // Type assertion for complex trigger types
    });
  }

  /**
   * Example: Schedule daily notification
   */
  async scheduleDailyNotification(
    hour: number,
    minute: number,
    title: string,
    body: string,
    data?: any
  ): Promise<string> {
    // Schedule notification with calendar trigger
    const now = new Date();
    const trigger = new Date(now.setHours(hour, minute, 0, 0));
    
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: trigger as any, // Type assertion for complex trigger types
    });
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Helper function to handle notification navigation
export function getNotificationNavigationParams(notification: Notifications.Notification) {
  const data = notification.request.content.data;

  if (data.taskId) {
    return { screen: 'TaskDetail', params: { taskId: data.taskId } };
  }

  if (data.channelId) {
    return { screen: 'ChannelChat', params: { channelId: data.channelId, channelName: data.channelName } };
  }

  if (data.userId) {
    return { screen: 'DirectMessage', params: { userId: data.userId, userName: data.userName } };
  }

  if (data.reminderId) {
    return { screen: 'Reminders' };
  }

  return { screen: 'Dashboard' };
}
