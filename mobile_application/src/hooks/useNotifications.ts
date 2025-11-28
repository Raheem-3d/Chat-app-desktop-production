import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService, getNotificationNavigationParams } from '../services/notification.service';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook for managing push notifications
 */
export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    // Register for push notifications
    notificationService.registerForPushNotifications().then((token) => {
      setExpoPushToken(token);
      // Send token to backend
      if (token) {
        notificationService.sendTokenToBackend(token).catch((error) => {
          console.error('Failed to send push token to backend:', error);
        });
      }
    });

    // Listen for notifications received while app is foregrounded
    const notificationReceivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        setNotification(notification);
      }
    );

    // Listen for notification interactions (user taps notification)
    const notificationResponseSubscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        const navParams = getNotificationNavigationParams(response.notification);
        // @ts-ignore
        navigation.navigate(navParams.screen, navParams.params);
      }
    );

    return () => {
      notificationReceivedSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, [navigation]);

  return {
    expoPushToken,
    notification,
  };
}

/**
 * Hook for managing badge count
 */ // 
export function useBadgeCount() {
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    // Get initial badge count
    notificationService.getBadgeCount().then(setBadgeCount);
  }, []);

  const updateBadgeCount = async (count: number) => {
    await notificationService.setBadgeCount(count);
    setBadgeCount(count);
  };

  const incrementBadge = async () => {
    const newCount = badgeCount + 1;
    await updateBadgeCount(newCount);
  };

  const clearBadge = async () => {
    await notificationService.clearBadge();
    setBadgeCount(0);
  };

  return {
    badgeCount,
    updateBadgeCount,
    incrementBadge,
    clearBadge,
  };
}

/**
 * Hook for scheduling reminders
 */
export function useReminders() {
  const scheduleReminder = async (
    title: string,
    body: string,
    triggerDate: Date,
    data?: any
  ): Promise<string> => {
    return await notificationService.scheduleReminder(title, body, triggerDate, data);
  };

  const cancelReminder = async (notificationId: string) => {
    await notificationService.cancelNotification(notificationId);
  };

  return {
    scheduleReminder,
    cancelReminder,
  };
}
