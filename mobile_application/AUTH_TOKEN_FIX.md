# Authentication Token Fix for Upload Endpoint

## Problem
Images/files upload was returning **401 Unauthorized** errors with:
```
axiosAuthHeader present: false
```

This meant the authentication token was NOT being sent to the `/upload` endpoint.

## Root Cause
The token loading was **asynchronous**, but the upload request was firing **synchronously** before the token was available. The sequence was:

1. User clicks send
2. `useOptimisticSend.sendDirect()` is called
3. `uploadWithProgress()` checks for token immediately
4. Token hasn't been loaded from SecureStore yet → `axiosAuthHeader` is empty
5. XHR request sent WITHOUT Authorization header
6. Backend returns 401 Unauthorized

## Solution
Three layers of token loading enforcement:

### 1. **uploadWithProgress.ts** - Explicit Token Loading
```typescript
// CRITICAL: Ensure token is loaded and set on axios defaults BEFORE making the request
let token = apiClient.getInMemoryToken();
if (!token) {
  token = await apiClient.getStoredToken();  // ← Await storage read
  if (token) {
    // Apply token to axios defaults so all subsequent requests have it
    (apiClient as any).client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}
```

**Why this works:**
- We now **wait** for the token to load from SecureStore/AsyncStorage
- We immediately apply it to axios defaults
- XHR request now has the correct Authorization header

### 2. **useOptimisticSend.ts** - Pre-Send Token Guarantee
```typescript
const sendDirect = useCallback(
  async (opts: { receiverId: string; content: string; files?: ... }) => {
    // CRITICAL: Ensure token is loaded before attempting to send/upload
    const storedToken = await apiClient.getStoredToken();
    if (storedToken && !apiClient.getInMemoryToken()) {
      (apiClient as any).client.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
    
    // Now proceed with send...
```

**Why this matters:**
- Catches cases where the token wasn't set during `apiClient.init()`
- Ensures both `sendDirect` AND `sendChannel` have the token ready
- Acts as a safety net before any uploads start

### 3. **App.tsx** - Initialization (Already Present)
```typescript
useEffect(() => {
  const checkAuth = async () => {
    // initialize api client (restore stored token to axios defaults)
    try {
      await apiClient.init();  // ← Loads token on app start
    } catch (e) {
      console.warn('[App] apiClient.init failed:', e);
    }
    // ...
  };
}, []);
```

## Testing the Fix

### Before
```
LOG   [upload] POST http://10.0.9.63:3000/api/upload token: none axiosHeader: none
WARN  [upload] failed status 401 response: {"message":"Unauthorized"}
```

### After (Expected)
```
LOG   [upload] POST http://10.0.9.63:3000/api/upload token: ***xxxxxx axiosHeader: ***xxxxxx
LOG   [upload] completed successfully with url: https://...
```

## Files Changed
1. `src/services/uploadWithProgress.ts` - Added token loading before XHR
2. `src/hooks/useOptimisticSend.ts` - Added token loading before send operations

## What to Test
1. Open app and log in
2. Go to Direct Messages or Channel Chat
3. Select an image or document
4. Send the message
5. Check logs - should see `axiosHeader: ***xxxxxx` (not `none`)
6. File should upload successfully (no 401 error)

## Next Steps
If you still see 401 errors:
1. Check if `EXPO_PUBLIC_DEBUG_MODE=false` or `true` in `.env`
2. Set to `true` to see detailed logs
3. Check that `.env` has correct `EXPO_PUBLIC_API_URL`
4. Verify backend `/api/upload` endpoint has auth middleware configured correctly
