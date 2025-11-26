// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import theme from '../../theme';

// const forgotPasswordSchema = z.object({
//   email: z.string().email('Invalid email address'),
// });

// type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// export default function ForgotPasswordScreen() {
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ForgotPasswordFormData>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: '',
//     },
//   });

//   const onSubmit = async (data: ForgotPasswordFormData) => {
//     setIsLoading(true);

//     try {
//       // TODO: Implement password reset endpoint
//       // await apiClient.post('/auth/forgot-password', { email: data.email });
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));

//       Alert.alert(
//         'Success',
//         'Password reset instructions have been sent to your email.',
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.goBack(),
//           },
//         ]
//       );
//     } catch (error: any) {
//       Alert.alert(
//         'Error',
//         'Failed to send password reset email. Please try again.'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
//           </TouchableOpacity>
//         </View>

//         {/* Icon */}
//         <View style={styles.iconContainer}>
//           <View style={styles.iconCircle}>
//             <Ionicons name="lock-closed-outline" size={48} color={theme.colors.primary[500]} />
//           </View>
//         </View>

//         {/* Title & Description */}
//         <View style={styles.titleContainer}>
//           <Text style={styles.title}>Forgot Password?</Text>
//           <Text style={styles.subtitle}>
//             Enter your email address and we'll send you instructions to reset your password.
//           </Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           <View style={styles.field}>
//             <Text style={styles.label}>Email Address</Text>
//             <Controller
//               control={control}
//               name="email"
//               render={({ field: { onChange, onBlur, value } }) => (
//                 <View style={styles.inputContainer}>
//                   <Ionicons
//                     name="mail-outline"
//                     size={20}
//                     color={theme.colors.text.secondary}
//                     style={styles.inputIcon}
//                   />
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter your email"
//                     placeholderTextColor={theme.colors.text.secondary}
//                     value={value}
//                     onChangeText={onChange}
//                     onBlur={onBlur}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                   />
//                 </View>
//               )}
//             />
//             {errors.email && (
//               <Text style={styles.errorText}>{errors.email.message}</Text>
//             )}
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               isLoading && styles.submitButtonDisabled,
//             ]}
//             onPress={handleSubmit(onSubmit)}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitButtonText}>Send Reset Link</Text>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Back to Login */}
//         <View style={styles.footer}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backToLoginText}>
//               Remember your password?{' '}
//               <Text style={styles.backToLoginLink}>Sign In</Text>
//             </Text>
//           </TouchableOpacity>
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
//   scrollContent: {
//     flexGrow: 1,
//     padding: theme.spacing.lg,
//   },
//   header: {
//     marginBottom: theme.spacing.xl,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: theme.colors.background.paper,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     alignItems: 'center',
//     marginBottom: theme.spacing.xl,
//   },
//   iconCircle: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: theme.colors.primary[100],
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   titleContainer: {
//     marginBottom: theme.spacing.xl,
//   },
//   title: {
//     ...theme.typography.h1,
//     color: theme.colors.text.primary,
//     textAlign: 'center',
//     marginBottom: theme.spacing.sm,
//   },
//   subtitle: {
//     ...theme.typography.body1,
//     color: theme.colors.text.secondary,
//     textAlign: 'center',
//   },
//   form: {
//     gap: theme.spacing.lg,
//   },
//   field: {
//     gap: theme.spacing.xs,
//   },
//   label: {
//     ...theme.typography.body2,
//     fontWeight: '600',
//     color: theme.colors.text.primary,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//     paddingHorizontal: theme.spacing.md,
//   },
//   inputIcon: {
//     marginRight: theme.spacing.sm,
//   },
//   input: {
//     flex: 1,
//     ...theme.typography.body1,
//     paddingVertical: theme.spacing.sm,
//     color: theme.colors.text.primary,
//   },
//   errorText: {
//     ...theme.typography.caption,
//     color: theme.colors.error.main,
//   },
//   submitButton: {
//     backgroundColor: theme.colors.primary[500],
//     borderRadius: 8,
//     paddingVertical: theme.spacing.md,
//     alignItems: 'center',
//     marginTop: theme.spacing.md,
//   },
//   submitButtonDisabled: {
//     backgroundColor: theme.colors.gray[300],
//   },
//   submitButtonText: {
//     ...theme.typography.button,
//     color: '#fff',
//   },
//   footer: {
//     marginTop: theme.spacing.xl,
//     alignItems: 'center',
//   },
//   backToLoginText: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//   },
//   backToLoginLink: {
//     color: theme.colors.primary[500],
//     fontWeight: '600',
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
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  inputBg: '#1e293b',
  inputBorder: '#334155',
};

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      // TODO: Implement password reset endpoint
      // await apiClient.post('/auth/forgot-password', { email: data.email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEmailSent(true);
      
      setTimeout(() => {
        Alert.alert(
          'Success',
          'Password reset instructions have been sent to your email.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 500);
    } catch (error: any) {
      Alert.alert(
        'Error',
        'Failed to send password reset email. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
              <Ionicons name="checkmark-circle" size={80} color={colors.success} />
            </View>
          </View>
          
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successSubtitle}>
            We've sent password reset instructions to your email address. Please check your inbox and follow the link.
          </Text>

          <View style={styles.successSteps}>
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary + '30' }]}>
                <Text style={[styles.stepNumberText, { color: colors.primary }]}>1</Text>
              </View>
              <Text style={styles.stepText}>Check your email inbox</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary + '30' }]}>
                <Text style={[styles.stepNumberText, { color: colors.primary }]}>2</Text>
              </View>
              <Text style={styles.stepText}>Click the reset link</Text>
            </View>
            
            <View style={styles.stepItem}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary + '30' }]}>
                <Text style={[styles.stepNumberText, { color: colors.primary }]}>3</Text>
              </View>
              <Text style={styles.stepText}>Create a new password</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => setEmailSent(false)}
          >
            <Ionicons name="mail" size={16} color={colors.primary} />
            <Text style={styles.resendButtonText}>Resend Email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBackButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Animated Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <View style={styles.iconCircle}>
            <Ionicons name="key" size={56} color="#fff" />
          </View>
        </View>

        {/* Title & Description */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={[
                    styles.inputWrapper,
                    emailFocused && styles.inputWrapperFocused,
                    errors.email && styles.inputWrapperError,
                  ]}
                >
                  <View
                    style={[
                      styles.inputIconBox,
                      emailFocused && { backgroundColor: colors.primary + '30' },
                    ]}
                  >
                    <Ionicons
                      name="mail"
                      size={20}
                      color={emailFocused ? colors.primary : colors.textTertiary}
                    />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="name@company.com"
                    placeholderTextColor={colors.textTertiary}
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      setEmailFocused(false);
                    }}
                    onFocus={() => setEmailFocused(true)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              )}
            />
            {errors.email && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={styles.errorText}>{errors.email.message}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.submitButtonText}>Send Reset Link</Text>
                <Ionicons name="paper-plane" size={18} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text style={styles.infoText}>
              The reset link will expire in 1 hour
            </Text>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need more help?</Text>
          <View style={styles.helpOptions}>
            <TouchableOpacity style={styles.helpOption}>
              <View style={[styles.helpIconBox, { backgroundColor: colors.info + '20' }]}>
                <Ionicons name="chatbubble-ellipses" size={20} color={colors.info} />
              </View>
              <Text style={styles.helpOptionText}>Contact Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.helpOption}>
              <View style={[styles.helpIconBox, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="help-circle" size={20} color={colors.success} />
              </View>
              <Text style={styles.helpOptionText}>Visit Help Center</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerBackButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    opacity: 0.15,
    top: -10,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
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
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.info + '15',
    padding: 14,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  helpSection: {
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  helpOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  helpOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  // Success state styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIconWrapper: {
    marginBottom: 32,
  },
  successIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  successSteps: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  backButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});