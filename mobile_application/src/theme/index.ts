// Theme configuration matching the Next.js app design system

export const lightColors = {
  // Primary colors (matching the blue gradient in web app)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Secondary colors (purple accent)
  secondary: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7', // secondary
    600: '#9333EA',
    700: '#7E22CE',
    800: '#6B21A8',
    900: '#581C87',
  },
  
  // Grayscale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic colors
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#065F46',
  },
  
  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#92400E',
  },
  
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#991B1B',
  },
  
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1E40AF',
  },
  
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
    dark: '#111827',
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    white: '#FFFFFF',
  },
  
  // Border colors
  border: {
    light: '#E5E7EB',
    main: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

export const darkColors = {
  // Primary colors (darker variants for dark theme)
  primary: {
    50: '#1E3A8A',
    100: '#1E40AF',
    200: '#1D4ED8',
    300: '#2563EB',
    400: '#3B82F6',
    500: '#60A5FA', // primary - lighter for dark bg
    600: '#93C5FD',
    700: '#BFDBFE',
    800: '#DBEAFE',
    900: '#EFF6FF',
  },
  
  // Secondary colors (purple accent - adjusted for dark)
  secondary: {
    50: '#581C87',
    100: '#6B21A8',
    200: '#7E22CE',
    300: '#9333EA',
    400: '#A855F7',
    500: '#C084FC', // secondary - lighter for dark bg
    600: '#D8B4FE',
    700: '#E9D5FF',
    800: '#F3E8FF',
    900: '#FAF5FF',
  },
  
  // Grayscale (inverted)
  gray: {
    50: '#111827',
    100: '#1F2937',
    200: '#374151',
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF',
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: '#F3F4F6',
    900: '#F9FAFB',
  },
  
  // Semantic colors (same but potentially adjusted contrast)
  success: {
    light: '#065F46',
    main: '#10B981',
    dark: '#D1FAE5',
  },
  
  warning: {
    light: '#92400E',
    main: '#F59E0B',
    dark: '#FEF3C7',
  },
  
  error: {
    light: '#991B1B',
    main: '#EF4444',
    dark: '#FEE2E2',
  },
  
  info: {
    light: '#1E40AF',
    main: '#3B82F6',
    dark: '#DBEAFE',
  },
  
  // Background colors (dark theme)
  background: {
    default: '#111827', // dark background
    paper: '#1F2937', // slightly lighter for cards
    dark: '#000000',
  },
  
  // Text colors (light text for dark bg)
  text: {
    primary: '#F9FAFB', // light text
    secondary: '#D1D5DB', // lighter gray
    disabled: '#6B7280', // darker gray
    white: '#FFFFFF',
  },
  
  // Border colors (adjusted for dark)
  border: {
    light: '#374151',
    main: '#4B5563',
    dark: '#6B7280',
  },
};

export const colors = lightColors; // Default to light theme

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export * from './ThemeContext';

// Default export for backward compatibility
export default {
  lightColors,
  darkColors,
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
