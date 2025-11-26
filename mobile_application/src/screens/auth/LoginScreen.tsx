// // Login screen
// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import theme from '../../theme';
// import { useLogin } from '../../hooks/useApi';
// import { useAuthStore } from '../../stores';
// import { apiClient } from '../../services/api';

// export default function LoginScreen({ navigation }: any) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const login = useLogin();
//   const setUser = useAuthStore((state) => state.setUser);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Error', 'Please enter email and password');
//       return;
//     }

//     try {
//       const result = await login.mutateAsync({ email, password });

//       console.log(email,password,'email','password')
//       setUser(result.user);
//       try {
//         const token = await apiClient.getStoredToken();
//         console.log('[login] stored token present:', Boolean(token));
//         if (!token) {
//           Alert.alert('Login Warning', 'Login succeeded but token was not stored. Please try again or restart the app.');
//         }
//       } catch (e) {
//         console.warn('[login] error reading stored token:', e);
//       }
//     } catch (error: any) {
//       Alert.alert('Login Failed', error.message || 'Invalid credentials');

//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.logoContainer}>
//             <Ionicons name="briefcase" size={48} color={theme.colors.primary[600]} />
//           </View>
//           <Text style={styles.title}>Welcome Back</Text>
//           <Text style={styles.subtitle}>Sign in to your account to continue</Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           {/* Email Input */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email Address</Text>
//             <View style={styles.inputWrapper}>
//               <Ionicons
//                 name="mail-outline"
//                 size={20}
//                 color={theme.colors.gray[400]}
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="name@company.com"
//                 placeholderTextColor={theme.colors.gray[400]}
//                 value={email}
//                 onChangeText={setEmail}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//                 autoComplete="email"
//               />
//             </View>
//           </View>

//           {/* Password Input */}
//           <View style={styles.inputContainer}>
//             <View style={styles.labelRow}>
//               <Text style={styles.label}>Password</Text>
//               <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
//                 <Text style={styles.link}>Forgot password?</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.inputWrapper}>
//               <Ionicons
//                 name="lock-closed-outline"
//                 size={20}
//                 color={theme.colors.gray[400]}
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={[styles.input, { flex: 1 }]}
//                 placeholder="Enter your password"
//                 placeholderTextColor={theme.colors.gray[400]}
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 onPress={() => setShowPassword(!showPassword)}
//                 style={styles.eyeIcon}
//               >
//                 <Ionicons
//                   name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//                   size={20}
//                   color={theme.colors.gray[400]}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Login Button */}
//           <TouchableOpacity
//             style={[styles.button, login.isPending && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={login.isPending}
//           >
//             {login.isPending ? (
//               <ActivityIndicator color="#FFF" />
//             ) : (
//               <>
//                 <Ionicons name="log-in-outline" size={20} color="#FFF" />
//                 <Text style={styles.buttonText}>Sign In</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           {/* Register Link */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account? </Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//               <Text style={styles.link}>Create account</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background.default,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: theme.spacing.lg,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: theme.spacing.xl,
//   },
//   logoContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: theme.borderRadius.lg,
//     backgroundColor: theme.colors.primary[50],
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: theme.spacing.md,
//   },
//   title: {
//     ...theme.typography.h2,
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.xs,
//   },
//   subtitle: {
//     ...theme.typography.body1,
//     color: theme.colors.text.secondary,
//     textAlign: 'center',
//   },
//   form: {
//     width: '100%',
//   },
//   inputContainer: {
//     marginBottom: theme.spacing.lg,
//   },
//   label: {
//     ...theme.typography.body2,
//     fontWeight: '600',
//     color: theme.colors.text.primary,
//     marginBottom: theme.spacing.sm,
//   },
//   labelRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: theme.spacing.sm,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: theme.colors.gray[50],
//     borderRadius: theme.borderRadius.md,
//     borderWidth: 1,
//     borderColor: theme.colors.border.light,
//     paddingHorizontal: theme.spacing.md,
//     height: 50,
//   },
//   inputIcon: {
//     marginRight: theme.spacing.sm,
//   },
//   input: {
//     flex: 1,
//     ...theme.typography.body1,
//     color: theme.colors.text.primary,
//     padding: 0,
//   },
//   eyeIcon: {
//     padding: theme.spacing.xs,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: theme.spacing.sm,
//     backgroundColor: theme.colors.primary[600],
//     borderRadius: theme.borderRadius.md,
//     height: 50,
//     marginTop: theme.spacing.md,
//     ...theme.shadows.md,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   buttonText: {
//     ...theme.typography.button,
//     color: theme.colors.text.white,
//   },
//   link: {
//     ...theme.typography.body2,
//     color: theme.colors.primary[600],
//     fontWeight: '600',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: theme.spacing.lg,
//   },
//   footerText: {
//     ...theme.typography.body2,
//     color: theme.colors.text.secondary,
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '../../hooks/useApi';
import { useAuthStore } from '../../stores';
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

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const login = useLogin();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const result = await login.mutateAsync({ email, password });
      setUser(result.user);
      
      try {
        const token = await apiClient.getStoredToken();
        console.log('[login] stored token present:', Boolean(token));
        if (!token) {
          Alert.alert('Login Warning', 'Login succeeded but token was not stored. Please try again or restart the app.');
        }
      } catch (e) {
        console.warn('[login] error reading stored token:', e);
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Animated Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoGlow} />
            <View style={styles.logoContainer}>
              <Ionicons name="briefcase" size={56} color="#fff" />
            </View>
          </View>
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your productivity journey
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                emailFocused && styles.inputWrapperFocused,
              ]}
            >
              <View style={[styles.inputIconBox, emailFocused && { backgroundColor: colors.primary + '30' }]}>
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
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.link}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputWrapper,
                passwordFocused && styles.inputWrapperFocused,
              ]}
            >
              <View style={[styles.inputIconBox, passwordFocused && { backgroundColor: colors.primary + '30' }]}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={passwordFocused ? colors.primary : colors.textTertiary}
                />
              </View>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, login.isPending && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={login.isPending}
            activeOpacity={0.8}
          >
            {login.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color={colors.text} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={20} color={colors.text} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={16} color={colors.success} />
            <Text style={styles.featureText}>Secure & Encrypted</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="time" size={16} color={colors.primary} />
            <Text style={styles.featureText}>24/7 Access</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="people" size={16} color={colors.accent} />
            <Text style={styles.featureText}>Team Collaboration</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: 60,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 24,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
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
  inputContainer: {
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
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
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardLight,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textTertiary,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.cardLight,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
});