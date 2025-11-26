// Authentication service - handles login, register, logout
import { apiClient } from './api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from '../types';

export const authService = {
  /**
   * Login with email and password
   * Note: This will need a custom mobile auth endpoint on the backend
   * For now, we'll attempt to use NextAuth and extract the session
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Option 1: If you create a custom /api/auth/mobile/login endpoint
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/mobile/login',
        credentials
      );
      
      // Store token and user (persist to SecureStore and AsyncStorage fallback)
      if ((apiClient as any).setTokenWithFallback) {
        try {
          const result = await (apiClient as any).setTokenWithFallback(response.token);
          console.log('[auth] setTokenWithFallback result:', result);
        } catch (e) {
          console.warn('[auth] setTokenWithFallback failed:', e);
        }
      } else {
        try {
          await apiClient.setToken(response.token);
        } catch (e) {
          console.warn('[auth] setToken failed:', e);
        }
      }
      // Read back immediately to validate storage (debug)
      try {
        const stored = await apiClient.getStoredToken();
        const asyncStored = (apiClient as any).getAsyncStoredToken ? await (apiClient as any).getAsyncStoredToken() : null;
        console.log('[auth] Stored token after setToken:', { stored: Boolean(stored), asyncStored: Boolean(asyncStored) });
      } catch (e) {
        console.warn('[auth] Failed to read stored token after setToken:', e);
      }
      try {
        await apiClient.setUser(response.user);
      } catch (e) {
        console.warn('[auth] setUser failed:', e);
      }
      
      return response;
    } catch (error) {
      // Option 2: Fallback to NextAuth session-based approach
      // This requires the backend to support cookie-to-token exchange
      throw error;
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<{ user: User }> {
    const response = await apiClient.post<{ user: User }>(
      '/register',
      data
    );
    return response;
  },

  /**
   * Logout - clear local auth data
   */
  async logout(): Promise<void> {
    await apiClient.clearAuth();
  },

  /**
   * Get current user from stored data
   */
  async getCurrentUser(): Promise<User | null> {
    return await apiClient.getStoredUser();
  },

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await apiClient.getStoredToken();
    return token !== null;
  },
};
