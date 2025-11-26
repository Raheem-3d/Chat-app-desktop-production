// API Client for communicating with the Next.js backend
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, UserSession } from '../types';

// Read API URL from environment (set EXPO_PUBLIC_API_URL in mobile_application/.env) 
const API_URL = 'http://10.0.9.63:3000/api';
const DEBUG_API = process.env.EXPO_DEBUG_API === 'true';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const ASYNC_TOKEN_KEY = 'async_auth_token';
const ASYNC_USER_KEY = 'async_auth_user';


class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;
  private userInMemory: any | null = null;
  // last token storage attempt details (for diagnostics)
  private lastTokenStorageResult: { secureStored: boolean; asyncStored: boolean } | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    if (DEBUG_API) {
      console.log('[api] Base URL:', API_URL);
    }

    // Request interceptor to add auth token 
    this.client.interceptors.request.use(
      async (config) => {
        if (DEBUG_API) {
          console.log('[api] Request:', config.method, config.baseURL + String(config.url));
          if (config.data) console.log('[api] Request data:', config.data);
          try {
            console.log('[api] Request headers (before interceptor):', config.headers);
          } catch (e) {
            console.log('[api] Request headers logging failed:', e);
          }
        }
        if (!this.token) {
          this.token = await this.getStoredToken();
        }

        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => {
        if (DEBUG_API) {
          console.log('[api] Response:', response.status, response.config.url);
          console.log('[api] Response data:', response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        if (DEBUG_API) {
          console.error('[api] Response error:', error?.response?.status, error?.config?.url);
          console.error('[api] Error data:', (error.response?.data as any) || error.message);
        }

        if (error.response?.status === 401) {
          // Token expired or invalid
          if (DEBUG_API) {
            console.warn('[api] Received 401 but DEBUG_API=true — not clearing auth (debug mode)');
          } else {
            await this.clearAuth();
          }
        }

        const apiError: ApiError = {
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            'An error occurred',
          statusCode: error.response?.status,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Token management
  async setToken(token: string): Promise<void> {
    // Prefer SecureStore but also write to AsyncStorage as fallback
    await this.setTokenWithFallback(token);
  }

  // Also persist to AsyncStorage as a fallback for environments where SecureStore may fail
  async setTokenWithFallback(token: string): Promise<{ secureStored: boolean; asyncStored: boolean }> {
    this.token = token;
    // Set axios header immediately so requests aren't sent unauthenticated
    try {
      this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
      if (DEBUG_API) console.log('[api] set Authorization header on axios defaults (immediate)');
    } catch (e) {
      console.warn('[api] failed to set axios default Authorization header (immediate):', e);
    }

    let secureStored = false;
    let asyncStored = false;

    // helper to run a promise with timeout
    const runWithTimeout = async <T>(p: Promise<T>, ms: number): Promise<{ ok: boolean; result?: T; timedOut?: boolean; error?: any }> => {
      let timeoutId: any;
      const timeoutPromise = new Promise<{ ok: boolean; timedOut: boolean }>((resolve) => {
        timeoutId = setTimeout(() => resolve({ ok: false, timedOut: true }), ms);
      });
      try {
        const res = await Promise.race([p.then(r => ({ ok: true, result: r })), timeoutPromise]) as any;
        if (timeoutId) clearTimeout(timeoutId);
        return res.timedOut ? { ok: false, timedOut: true } : { ok: true, result: res.result };
      } catch (err) {
        if (timeoutId) clearTimeout(timeoutId);
        return { ok: false, error: err };
      }
    };

    try {
      const r = await runWithTimeout(SecureStore.setItemAsync(TOKEN_KEY, token), 3000);
      if (r.ok) secureStored = true;
      else if (r.timedOut) console.warn('[api] SecureStore.setItemAsync timed out');
      else if (r.error) console.warn('[api] SecureStore.setItemAsync failed for token:', r.error);
    } catch (e) {
      console.warn('[api] SecureStore.setItemAsync unexpected error:', e);
    }

    try {
      const r2 = await runWithTimeout(AsyncStorage.setItem(ASYNC_TOKEN_KEY, token), 3000);
      if (r2.ok) asyncStored = true;
      else if (r2.timedOut) console.warn('[api] AsyncStorage.setItem timed out');
      else if (r2.error) console.warn('[api] AsyncStorage.setItem failed for token:', r2.error);
    } catch (e) {
      console.warn('[api] AsyncStorage.setItem unexpected error:', e);
    }

    this.lastTokenStorageResult = { secureStored, asyncStored };
    if (DEBUG_API) console.log('[api] setTokenWithFallback result:', this.lastTokenStorageResult);
    return this.lastTokenStorageResult;
  }

  // Return the token currently stored in memory (if any)
  getInMemoryToken(): string | null {
    return this.token;
  }

  // Return the Authorization header currently set on axios defaults (for diagnostics)
  getAxiosAuthHeader(): string | null {
    try {
      return (this.client?.defaults?.headers?.common as any)?.Authorization || null;
    } catch (e) {
      return null;
    }
  }

  // Return the last token storage attempt details (for diagnostics)
  getLastTokenStorageResult(): { secureStored: boolean; asyncStored: boolean } | null {
    return this.lastTokenStorageResult;
  }

  /**
   * Initialize the api client on app startup.
   * Reads stored token (SecureStore -> AsyncStorage) and applies it to in-memory and axios defaults.
   */
  async init(): Promise<void> {
    try {
      const token = await this.getStoredToken();
      if (token) {
        this.token = token;
        try {
          this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
          if (DEBUG_API) console.log('[api] init applied stored token to axios defaults');
        } catch (e) {
          console.warn('[api] init failed to set axios Authorization header:', e);
        }
      } else if (DEBUG_API) {
        console.log('[api] init found no stored token');
      }
    } catch (e) {
      console.warn('[api] init error reading stored token:', e);
    }
  }

  // Direct AsyncStorage accessors to aid diagnostics
  async getAsyncStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ASYNC_TOKEN_KEY);
    } catch (e) {
      console.warn('[api] getAsyncStoredToken error:', e);
      return null;
    }
  }

  async getAsyncStoredUser(): Promise<any | null> {
    try {
      const u = await AsyncStorage.getItem(ASYNC_USER_KEY);
      return u ? JSON.parse(u) : null;
    } catch (e) {
      console.warn('[api] getAsyncStoredUser error:', e);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) return token;
    } catch (e) {
      console.warn('[api] SecureStore.getItemAsync failed for token:', e);
    }

    try {
      const t = await AsyncStorage.getItem(ASYNC_TOKEN_KEY);
      return t;
    } catch (e) {
      console.warn('[api] AsyncStorage.getItem failed for token:', e);
      return null;
    }
  }

  async clearToken(): Promise<void> {
    this.token = null;
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (e) {
      console.warn('[api] SecureStore.deleteItemAsync failed for token:', e);
    }
    try {
      await AsyncStorage.removeItem(ASYNC_TOKEN_KEY);
    } catch (e) {
      console.warn('[api] AsyncStorage.removeItem failed for token:', e);
    }
    // Remove default Authorization header if present
    try {
      if (this.client && this.client.defaults && this.client.defaults.headers && this.client.defaults.headers.common) {
        delete this.client.defaults.headers.common.Authorization;
        if (DEBUG_API) console.log('[api] cleared axios default Authorization header');
      }
    } catch (e) {
      console.warn('[api] failed to clear axios default Authorization header:', e);
    }
  }

  async setUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('[api] SecureStore.setItemAsync failed for user:', e);
    }
    this.userInMemory = user;
    try {
      await AsyncStorage.setItem(ASYNC_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('[api] AsyncStorage.setItem failed for user:', e);
    }
  }

  async getStoredUser(): Promise<any | null> {
    try {
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      if (userStr) return JSON.parse(userStr);
    } catch (e) {
      console.warn('[api] SecureStore.getItemAsync failed for user:', e);
    }

    try {
      const asyncUser = await AsyncStorage.getItem(ASYNC_USER_KEY);
      return asyncUser ? JSON.parse(asyncUser) : null;
    } catch (e) {
      console.warn('[api] AsyncStorage.getItem failed for user:', e);
      return null;
    }
  }

  // Return user stored in memory if available (not persisted separately)
  getInMemoryUser(): any | null {
    return this.userInMemory;
  }

  async clearAuth(): Promise<void> {
    await this.clearToken();
    try {
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (e) {
      console.warn('[api] SecureStore.deleteItemAsync failed for user:', e);
    }
    this.userInMemory = null;
    try {
      await AsyncStorage.removeItem(ASYNC_USER_KEY);
    } catch (e) {
      console.warn('[api] AsyncStorage.removeItem failed for user:', e);
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // File upload
  async uploadFile(
    url: string,
    file: {
      uri: string;
      name: string;
      type: string;
    }
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
