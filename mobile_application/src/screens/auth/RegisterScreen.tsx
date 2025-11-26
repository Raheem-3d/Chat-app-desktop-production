// import React, { useState } from 'react';
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
// import theme from '../../theme';
// import { apiClient } from '../../services/api';

// // Validation schema
// const registerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string(),
//   companyName: z.string().min(2, 'Company name must be at least 2 characters'),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ['confirmPassword'],
// });

// type RegisterFormData = z.infer<typeof registerSchema>;

// export default function RegisterScreen() {
//   const navigation = useNavigation();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       companyName: '',
//     },
//   });

//   const onSubmit = async (data: RegisterFormData) => {
//     setIsLoading(true);
//     try {
//       // Register user and create organization
//       const response = await apiClient.post('/register', {
//         name: data.name,
//         email: data.email,
//         password: data.password,
//         organizationName: data.companyName,
//       });

//       Alert.alert(
//         'Success',
//         'Account created successfully! Please login.',
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.navigate('Login' as never),
//           },
//         ]
//       );
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.error || 'Registration failed. Please try again.';
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.title}>Create Account</Text>
//             <Text style={styles.subtitle}>
//               Sign up to get started with your team
//             </Text>
//           </View>

//           {/* Form */}
//           <View style={styles.form}>
//             {/* Name Input */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Full Name</Text>
//               <Controller
//                 control={control}
//                 name="name"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View
//                     style={[
//                       styles.inputContainer,
//                       errors.name && styles.inputError,
//                     ]}
//                   >
//                     <Ionicons
//                       name="person-outline"
//                       size={20}
//                       color={theme.colors.text.secondary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="John Doe"
//                       placeholderTextColor={theme.colors.text.secondary}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       autoCapitalize="words"
//                     />
//                   </View>
//                 )}
//               />
//               {errors.name && (
//                 <Text style={styles.errorText}>{errors.name.message}</Text>
//               )}
//             </View>

//             {/* Email Input */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Email</Text>
//               <Controller
//                 control={control}
//                 name="email"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View
//                     style={[
//                       styles.inputContainer,
//                       errors.email && styles.inputError,
//                     ]}
//                   >
//                     <Ionicons
//                       name="mail-outline"
//                       size={20}
//                       color={theme.colors.text.secondary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="john@example.com"
//                       placeholderTextColor={theme.colors.text.secondary}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                     />
//                   </View>
//                 )}
//               />
//               {errors.email && (
//                 <Text style={styles.errorText}>{errors.email.message}</Text>
//               )}
//             </View>

//             {/* Company Name Input */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Company Name</Text>
//               <Controller
//                 control={control}
//                 name="companyName"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View
//                     style={[
//                       styles.inputContainer,
//                       errors.companyName && styles.inputError,
//                     ]}
//                   >
//                     <Ionicons
//                       name="business-outline"
//                       size={20}
//                       color={theme.colors.text.secondary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Acme Inc."
//                       placeholderTextColor={theme.colors.text.secondary}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       autoCapitalize="words"
//                     />
//                   </View>
//                 )}
//               />
//               {errors.companyName && (
//                 <Text style={styles.errorText}>{errors.companyName.message}</Text>
//               )}
//             </View>

//             {/* Password Input */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Password</Text>
//               <Controller
//                 control={control}
//                 name="password"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View
//                     style={[
//                       styles.inputContainer,
//                       errors.password && styles.inputError,
//                     ]}
//                   >
//                     <Ionicons
//                       name="lock-closed-outline"
//                       size={20}
//                       color={theme.colors.text.secondary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="••••••••"
//                       placeholderTextColor={theme.colors.text.secondary}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       secureTextEntry={!showPassword}
//                     />
//                     <TouchableOpacity
//                       onPress={() => setShowPassword(!showPassword)}
//                       style={styles.eyeIcon}
//                     >
//                       <Ionicons
//                         name={showPassword ? 'eye-outline' : 'eye-off-outline'}
//                         size={20}
//                         color={theme.colors.text.secondary}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               />
//               {errors.password && (
//                 <Text style={styles.errorText}>{errors.password.message}</Text>
//               )}
//             </View>

//             {/* Confirm Password Input */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Confirm Password</Text>
//               <Controller
//                 control={control}
//                 name="confirmPassword"
//                 render={({ field: { onChange, onBlur, value } }) => (
//                   <View
//                     style={[
//                       styles.inputContainer,
//                       errors.confirmPassword && styles.inputError,
//                     ]}
//                   >
//                     <Ionicons
//                       name="lock-closed-outline"
//                       size={20}
//                       color={theme.colors.text.secondary}
//                       style={styles.inputIcon}
//                     />
//                     <TextInput
//                       style={styles.input}
//                       placeholder="••••••••"
//                       placeholderTextColor={theme.colors.text.secondary}
//                       value={value}
//                       onChangeText={onChange}
//                       onBlur={onBlur}
//                       secureTextEntry={!showConfirmPassword}
//                     />
//                     <TouchableOpacity
//                       onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//                       style={styles.eyeIcon}
//                     >
//                       <Ionicons
//                         name={
//                           showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
//                         }
//                         size={20}
//                         color={theme.colors.text.secondary}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//               />
//               {errors.confirmPassword && (
//                 <Text style={styles.errorText}>
//                   {errors.confirmPassword.message}
//                 </Text>
//               )}
//             </View>

//             {/* Register Button */}
//             <TouchableOpacity
//               style={[styles.button, isLoading && styles.buttonDisabled]}
//               onPress={handleSubmit(onSubmit)}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.buttonText}>Create Account</Text>
//               )}
//             </TouchableOpacity>

//             {/* Login Link */}
//             <View style={styles.footer}>
//               <Text style={styles.footerText}>Already have an account? </Text>
//               <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
//                 <Text style={styles.linkText}>Sign In</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
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
//   scrollContent: {
//     flexGrow: 1,
//     padding: theme.spacing.lg,
//   },
//   header: {
//     marginTop: theme.spacing.xl,
//     marginBottom: theme.spacing.xl,
//   },
//   title: {
//     ...theme.typography.h1,
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.xs,
//   },
//   subtitle: {
//     ...theme.typography.body1,
//     color: theme.colors.text.secondary,
//   },
//   form: {
//     flex: 1,
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
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.background.paper,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//     paddingHorizontal: theme.spacing.md,
//     height: 50,
//   },
//   inputError: {
//     borderColor: theme.colors.error.main,
//   },
//   inputIcon: {
//     marginRight: theme.spacing.sm,
//   },
//   input: {
//     flex: 1,
//     ...theme.typography.body1,
//     color: theme.colors.text.primary,
//   },
//   eyeIcon: {
//     padding: theme.spacing.xs,
//   },
//   errorText: {
//     ...theme.typography.caption,
//     color: theme.colors.error.main,
//     marginTop: theme.spacing.xs,
//   },
//   button: {
//     backgroundColor: theme.colors.primary[500],
//     borderRadius: 8,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: theme.spacing.md,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     ...theme.typography.button,
//     color: '#fff',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: theme.spacing.lg,
//   },
//   footerText: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//   },
//   linkText: {
//     ...theme.typography.body2,
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
import { apiClient } from '../../services/api';

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

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await apiClient.post('/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        organizationName: data.companyName,
      });

      Alert.alert(
        'Success',
        'Account created successfully! Please login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error || 'Registration failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    name: keyof RegisterFormData,
    placeholder: string,
    icon: string,
    options?: {
      keyboardType?: 'default' | 'email-address';
      autoCapitalize?: 'none' | 'words';
      isPassword?: boolean;
      showPassword?: boolean;
      togglePassword?: () => void;
    }
  ) => {
    const isFocused = focusedField === name;
    const hasError = !!errors[name];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{placeholder}</Text>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value } }) => (
            <View
              style={[
                styles.inputWrapper,
                isFocused && styles.inputWrapperFocused,
                hasError && styles.inputWrapperError,
              ]}
            >
              <View
                style={[
                  styles.inputIconBox,
                  isFocused && { backgroundColor: colors.primary + '30' },
                ]}
              >
                <Ionicons
                  name={icon as any}
                  size={20}
                  color={isFocused ? colors.primary : colors.textTertiary}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textTertiary}
                value={value}
                onChangeText={onChange}
                onBlur={() => {
                  onBlur();
                  setFocusedField(null);
                }}
                onFocus={() => setFocusedField(name)}
                keyboardType={options?.keyboardType || 'default'}
                autoCapitalize={options?.autoCapitalize || 'none'}
                secureTextEntry={options?.isPassword && !options?.showPassword}
              />
              {options?.isPassword && (
                <TouchableOpacity
                  onPress={options.togglePassword}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={options.showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        {hasError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.errorText}>{errors[name]?.message}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <Ionicons name="rocket" size={40} color="#fff" />
            </View>
            
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join us and start collaborating with your team
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '50%' }]} />
            </View>
            <Text style={styles.progressText}>Step 1 of 2</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {renderInput('name', 'Full Name', 'person', {
              autoCapitalize: 'words',
            })}

            {renderInput('email', 'Email Address', 'mail', {
              keyboardType: 'email-address',
            })}

            {renderInput('companyName', 'Company Name', 'business', {
              autoCapitalize: 'words',
            })}

            {renderInput('password', 'Password', 'lock-closed', {
              isPassword: true,
              showPassword: showPassword,
              togglePassword: () => setShowPassword(!showPassword),
            })}

            {renderInput('confirmPassword', 'Confirm Password', 'lock-closed', {
              isPassword: true,
              showPassword: showConfirmPassword,
              togglePassword: () => setShowConfirmPassword(!showConfirmPassword),
            })}

            {/* Password Requirements */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.requirementText}>At least 6 characters</Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={styles.requirementText}>Include letters and numbers</Text>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.registerButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Benefits */}
          <View style={styles.benefits}>
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="shield-checkmark" size={20} color={colors.success} />
              </View>
              <Text style={styles.benefitText}>Secure & Private</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="people" size={20} color={colors.primary} />
              </View>
              <Text style={styles.benefitText}>Team Collaboration</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="flash" size={20} color={colors.accent} />
              </View>
              <Text style={styles.benefitText}>Instant Setup</Text>
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.cardLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
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
  eyeButton: {
    padding: 8,
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
  requirementsBox: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  termsText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  benefits: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    flexWrap: 'wrap',
    paddingBottom: 20,
  },
  benefitItem: {
    alignItems: 'center',
    gap: 8,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
  },
});