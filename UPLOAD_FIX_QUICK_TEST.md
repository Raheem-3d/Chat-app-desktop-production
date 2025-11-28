# 🚀 Quick Test Guide - Image Upload Fix

## Status
✅ **Fixed** - Mobile app now sends Bearer token to backend, backend accepts it.

---

## Test It Now

### Step 1: Rebuild Mobile App
```bash
cd mobile_application
npm install  # or pnpm install
npx expo start
```

### Step 2: Select Image & Send
1. Login to the app
2. Go to **Direct Messages** (or Channel Chat)
3. Tap **image icon** 🖼️ to select a photo
4. Tap **send button** ✈️

### Step 3: Check Logs
You should see:
```
LOG   [upload] POST http://10.0.9.63:3000/api/upload token: ***xxxxxx axiosHeader: ***xxxxxx
LOG   [upload] completed successfully
```

✅ **Success!** Image uploaded and appears in message

---

## If You Still See 401

### Option A: Enable Debug Logs
```bash
# In mobile_application/.env
EXPO_PUBLIC_DEBUG_MODE=true
```
Then look for detailed logs.

### Option B: Check Backend Server
```bash
# Make sure backend is running
cd ..  # Go to root
npm run dev  # or npm start
```

### Option C: Verify API URL
In `mobile_application/.env`:
```
EXPO_PUBLIC_API_URL=http://10.0.9.63:3000/api
```
Should match your actual backend.

---

## What Was Fixed

### Mobile App
- ✅ Now loads token **before** uploading (not after)
- ✅ Sets Authorization header on both XHR and axios
- ✅ Logs show token is present: `token: ***xxxxxx`

### Backend
- ✅ `/api/upload` now accepts Bearer token (mobile app)
- ✅ Still accepts session cookies (web app)
- ✅ Works with both authentication methods

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Still getting 401 | Check `EXPO_PUBLIC_API_URL` in `.env` is correct |
| Token shows `none` | Backend might not have restarted; restart server |
| Upload succeeds but no image | Check `public/uploads` folder exists |
| File appears but broken link | Verify backend is serving `/u/` route |

---

## Expected Flow

```
Tap Image
  ↓
Select from library
  ↓
Tap Send
  ↓
[Mobile] Load token from SecureStore
  ↓
[Mobile] Set Authorization header
  ↓
Upload file to /api/upload
  ↓
[Backend] Check auth: Bearer token ✓
  ↓
Save file to public/uploads/
  ↓
Return URL
  ↓
Insert URL in message
  ↓
Send message via socket.io
  ↓
✅ Message appears with image!
```

---

## Need More Help?

See detailed docs:
- **Full Technical Details:** `UPLOAD_AUTH_FIX_COMPLETE.md`
- **Mobile Auth Details:** `mobile_application/AUTH_TOKEN_FIX.md`
