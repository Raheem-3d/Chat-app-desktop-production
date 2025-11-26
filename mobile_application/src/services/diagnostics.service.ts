// Diagnostics service - used to check connectivity to the backend API
import { apiClient } from './api';

export async function checkApiConnection(): Promise<{
  ok: boolean;
  status?: number | null;
  message?: string;
  data?: any;
}> {
  try {
    // Try a lightweight endpoint that should exist on backend
    // Many Next.js apps expose a health endpoint at /api/health
    const res = await apiClient.get<any>('/health');
    return { ok: true, status: 200, data: res };
  } catch (err: any) {
    // Fallback: try root API path
    try {
      const res = await apiClient.get<any>('/');
      return { ok: true, status: 200, data: res };
    } catch (e: any) {
      return {
        ok: false,
        status: e?.statusCode || e?.response?.status || null,
        message: e?.message || 'Unable to reach backend',
      };
    }
  }
}

export default { checkApiConnection };

/**
 * Check a list of endpoints and return status for each
 */
export async function checkEndpoints(endpoints: string[]) {
  const results: Array<{
    endpoint: string;
    ok: boolean;
    status?: number | null;
    message?: string;
    data?: any;
  }> = [];

  for (const ep of endpoints) {
    try {
      const res = await apiClient.get<any>(ep);
      results.push({ endpoint: ep, ok: true, status: 200, data: res });
    } catch (e: any) {
      results.push({
        endpoint: ep,
        ok: false,
        status: e?.statusCode || e?.response?.status || null,
        message: e?.message || 'Request failed',
      });
    }
  }

  return results;
}

/**
 * Return stored token and user (if any)
 */
export async function getStoredAuth(): Promise<{
  tokenStored: string | null;
  tokenMemory: string | null;
  tokenAsync: string | null;
  userStored: any | null;
  userMemory: any | null;
  userAsync: any | null;
  axiosHeader?: string | null;
  lastTokenStorage?: { secureStored: boolean; asyncStored: boolean } | null;
  error?: string | null;
}> {
  try {
    const token = await apiClient.getStoredToken();
    const user = await apiClient.getStoredUser();
    const memoryToken = (apiClient as any)?.getInMemoryToken ? (apiClient as any).getInMemoryToken() : null;
    const memoryUser = (apiClient as any)?.getInMemoryUser ? (apiClient as any).getInMemoryUser() : null;
    const asyncToken = (apiClient as any)?.getAsyncStoredToken ? await (apiClient as any).getAsyncStoredToken() : null;
    const asyncUser = (apiClient as any)?.getAsyncStoredUser ? await (apiClient as any).getAsyncStoredUser() : null;
    const lastStorage = (apiClient as any)?.getLastTokenStorageResult ? (apiClient as any).getLastTokenStorageResult() : null;
    const result: any = {
      tokenStored: token,
      tokenMemory: memoryToken,
      tokenAsync: asyncToken,
      userStored: user,
      userMemory: memoryUser,
      userAsync: asyncUser,
      axiosHeader: (apiClient as any)?.getAxiosAuthHeader ? (apiClient as any).getAxiosAuthHeader() : null,
      lastTokenStorage: lastStorage,
    };
    console.log('[diag] getStoredAuth result:', result);
    return result;
  } catch (err) {
    console.warn('[diag] getStoredAuth error:', err);
    return { tokenStored: null, tokenMemory: null, tokenAsync: null, userStored: null, userMemory: null, userAsync: null, axiosHeader: null, lastTokenStorage: null, error: String(err) };
  }
}
