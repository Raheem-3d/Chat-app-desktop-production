# Mobile Auth Testing Guide

## Backend Setup Complete ✅

The following files have been created:

1. **`/app/api/auth/mobile/login/route.ts`** - Mobile authentication endpoint
   - Returns JWT token instead of session cookies
   - Includes user data and organization information
   
2. **`/lib/mobile-auth.ts`** - JWT verification middleware
   - `verifyMobileToken()` - Verify JWT and get user data
   - `extractUserIdFromToken()` - Extract user ID without full verification

3. **`next.config.mjs`** - Updated with CORS headers
   - Allows mobile app API requests
   - Supports Authorization header

## Testing the Login Flow

### Step 1: Start the Backend

```bash
# Make sure you're in the main project directory
cd "c:\xampp\htdocs\Office_Project\Chat app desktop production"

# Start the Next.js development server
npm run dev
```

The backend should be running at `http://localhost:3000`

### Step 2: Update Mobile App Environment

Edit `mobile_application/.env`:

```env
# Replace 192.168.x.x with your computer's actual IP address
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
EXPO_PUBLIC_DEBUG_MODE=true
```

To find your IP address:
```bash
# Windows
ipconfig

# Look for "IPv4 Address" under your active network adapter
# Example: 192.168.1.100
```

### Step 3: Start the Mobile App

```bash
cd mobile_application
npm start
```

Then scan the QR code with Expo Go app on your phone.

### Step 4: Test the Login

1. Open the app on your device
2. You should see the Login screen
3. Enter credentials:
   - Email: (use an existing user from your database)
   - Password: (the user's password)
4. Tap "Sign In"
5. If successful, you'll be navigated to the Dashboard

### Step 5: Test Registration

1. On the Login screen, tap "Create Account"
2. Fill in the registration form:
   - Full Name
   - Email
   - Company Name
   - Password
   - Confirm Password
3. Tap "Create Account"
4. If successful, you'll be redirected to Login
5. Login with the new credentials

### Step 6: Test Tasks Screen

1. After logging in, tap the "Tasks" tab
2. You should see a list of tasks with filters
3. Test the filters:
   - Status: All / To Do / In Progress / Done
   - Priority: All / Low / Medium / High
4. Tap on a task to navigate to task details (placeholder)
5. Tap the "+" button to create a new task (placeholder)

## API Endpoint Testing (Manual)

You can also test the mobile auth endpoint directly using curl or Postman:

### Login Request

```bash
curl -X POST http://localhost:3000/api/auth/mobile/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Expected Response

```json
{
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "image": null,
    "role": "MEMBER",
    "departmentId": null,
    "organizationId": "org-id",
    "isSuperAdmin": false,
    "organizations": [
      {
        "id": "org-id",
        "name": "Company Name",
        "role": "MEMBER",
        "suspended": false,
        "subscription": {
          "status": "TRIAL",
          "currentPeriodEnd": "2025-12-31T00:00:00Z",
          "trialEnd": "2025-12-31T00:00:00Z"
        }
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using the Token

Include the token in subsequent API requests:

```bash
curl -X GET http://localhost:3000/api/tasks?organizationId=org-id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Troubleshooting

### Issue: "Network request failed"

**Solutions:**
1. Ensure backend is running (`npm run dev`)
2. Check that you're using your computer's IP address, not `localhost`
3. Make sure phone and computer are on the same WiFi network
4. Verify the API URL in `.env` is correct

### Issue: "Invalid credentials"

**Solutions:**
1. Check that the user exists in the database
2. Verify the password is correct
3. Make sure the user has a hashed password (not OAuth-only)

### Issue: CORS error

**Solutions:**
1. Restart the Next.js server after updating `next.config.mjs`
2. Check that the CORS headers are properly configured
3. Clear browser/app cache

### Issue: "No organization found"

**Solutions:**
1. Make sure the user belongs to an organization
2. Check that `organizationId` is set in the user record
3. Verify organization exists in database

## Next Steps

Now that the backend is set up and login works:

1. ✅ **Backend Mobile Auth** - Complete
2. ✅ **RegisterScreen** - Complete
3. ✅ **TasksScreen** - Complete
4. 🚧 **Test Login Flow** - Ready to test
5. **Implement remaining screens:**
   - TaskDetailScreen (task details, comments, status update)
   - ChannelChatScreen (real-time messaging)
   - CreateTaskScreen (task creation form)
   - SettingsScreen (profile, notifications, logout)
   - And more...

## Files Modified/Created

### Backend Files
- ✅ `app/api/auth/mobile/login/route.ts` - New mobile login endpoint
- ✅ `lib/mobile-auth.ts` - New JWT verification middleware
- ✅ `next.config.mjs` - Updated with CORS headers

### Mobile Files
- ✅ `src/screens/auth/RegisterScreen.tsx` - Full implementation
- ✅ `src/screens/main/TasksScreen.tsx` - Full implementation with filters

## Success Criteria

Login flow is working if:
- [x] Mobile auth endpoint responds with user + token
- [x] RegisterScreen creates new user and organization
- [x] TasksScreen displays tasks from backend
- [ ] Token is stored securely in Expo SecureStore
- [ ] Subsequent API calls include Bearer token
- [ ] Token refresh works on 401 errors
- [ ] Logout clears token and navigates to login

## Database Requirements

Make sure you have at least one test user in your database:

```sql
-- Check existing users
SELECT id, name, email, organizationId FROM User;

-- Create a test user if needed (password is "password123")
-- Note: Use bcrypt to hash the password first
```

Happy testing! 🚀
