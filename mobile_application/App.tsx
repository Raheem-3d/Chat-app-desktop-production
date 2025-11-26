// Main App component
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useAuthStore } from './src/stores';
import { authService } from './src/services/auth.service';
import { apiClient } from './src/services/api';
import { ThemeProvider, useTheme } from './src/theme';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes (formerly cacheTime)
    },
  },
});

const AppContent = () => {
  const { themeType } = useTheme();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      // initialize api client (restore stored token to axios defaults)
      try {
        await apiClient.init();
      } catch (e) {
        console.warn('[App] apiClient.init failed:', e);
      }
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  return (
    <>
      <StatusBar style={themeType === 'dark' ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AppContent />
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
