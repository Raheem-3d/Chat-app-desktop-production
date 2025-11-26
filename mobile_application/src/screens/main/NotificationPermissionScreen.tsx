import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationService } from '../../services/notification.service';
import { useTheme } from '../../theme';

export default function NotificationPermissionScreen() {
  const [isRequesting, setIsRequesting] = useState(false);
  const pulseAnim = useState(new Animated.Value(1))[0];
  const { theme } = useTheme();

  React.useEffect(() => {
    // Pulse animation for the bell icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleEnableNotifications = async () => {
    setIsRequesting(true);

    try {
      const token = await notificationService.registerForPushNotifications();
      
      if (token) {
        Alert.alert(
          'Success!',
          'Notifications enabled. You will now receive updates about tasks, messages, and reminders.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to receive updates.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enable notifications');
    } finally {
      setIsRequesting(false);
    }
  };

  const features = [
    {
      icon: 'checkbox',
      color: theme.success.main,
      title: 'Task Updates',
      description: 'Get notified about new assignments and deadlines',
    },
    {
      icon: 'chatbubbles',
      color: theme.info.main,
      title: 'Messages',
      description: 'Never miss direct messages and mentions',
    },
    {
      icon: 'alarm',
      color: theme.warning.main,
      title: 'Reminders',
      description: 'Stay on top of your schedule',
    },
    {
      icon: 'people',
      color: theme.secondary[500],
      title: 'Team Activity',
      description: 'Keep up with your team\'s progress',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background.default,
    },
    content: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
    },
    iconContainer: {
      alignItems: 'center',
      marginBottom: 40,
      position: 'relative',
    },
    iconCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    iconGradient: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: theme.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary[500],
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    decorativeRing: {
      position: 'absolute',
      borderRadius: 999,
      borderWidth: 2,
      borderColor: theme.primary[500] + '30',
    },
    ring1: {
      width: 180,
      height: 180,
      top: -20,
    },
    ring2: {
      width: 220,
      height: 220,
      top: -40,
      borderColor: theme.primary[500] + '15',
    },
    textContainer: {
      marginBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.text.primary,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '400',
      color: theme.text.secondary,
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: 20,
    },
    featuresGrid: {
      gap: 12,
      marginBottom: 32,
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background.paper,
      borderRadius: 16,
      padding: 16,
      gap: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    featureIconBox: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.text.primary,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 13,
      fontWeight: '400',
      color: theme.text.secondary,
      lineHeight: 18,
    },
    buttonContainer: {
      gap: 12,
      marginBottom: 20,
    },
    enableButton: {
      backgroundColor: theme.primary[500],
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: 'center',
      shadowColor: theme.primary[500],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    enableButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: '#fff',
    },
    skipButton: {
      paddingVertical: 12,
      alignItems: 'center',
    },
    skipText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.text.disabled,
    },
    infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: theme.background.paper,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    infoText: {
      fontSize: 13,
      fontWeight: '500',
      color: theme.text.disabled,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Animated Icon */}
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={styles.iconGradient}>
              <Ionicons name="notifications" size={72} color="#fff" />
            </View>
          </Animated.View>
          
          {/* Decorative rings */}
          <View style={[styles.decorativeRing, styles.ring1]} />
          <View style={[styles.decorativeRing, styles.ring2]} />
        </View>

        {/* Title & Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Stay in the Loop</Text>
          <Text style={styles.subtitle}>
            Enable notifications to never miss important updates
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIconBox, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon as any} size={28} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.enableButton}
            onPress={handleEnableNotifications}
            disabled={isRequesting}
            activeOpacity={0.8}
          >
            {isRequesting ? (
              <View style={styles.buttonContent}>
                <Text style={styles.enableButtonText}>Enabling...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons name="notifications" size={20} color="#fff" />
                <Text style={styles.enableButtonText}>Enable Notifications</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={16} color={theme.text.disabled} />
          <Text style={styles.infoText}>
            You can change this anytime in Settings
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}