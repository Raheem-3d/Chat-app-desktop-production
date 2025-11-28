# Push Notifications Integration Guide

This guide walks you through the complete push notification setup for your chat app across desktop, web, and mobile platforms.

## What Was Implemented

### Backend (Next.js)

1. **Database Schema Updates** (`prisma/schema.prisma`)
   - Added `expoPushToken` field to `User` model
   - Created new `PushNotification` model to track notification history

2. **Expo Push Service** (`lib/services/expo-push.service.ts`)
   - Singleton service for sending push notifications via Expo
   - Methods for single and batch notifications
   - Token validation and invalid token cleanup
   - Notification history tracking

3. **Notification Helper Service** (`lib/services/notification-helper.service.ts`)
   - High-level methods for common notification scenarios
   - Message notifications
   - Task assignment and status notifications
   - Bulk notifications to organization/channel members

4. **API Endpoints**
   - `POST /api/users/push-token` - Register/update push token
   - `GET /api/users/push-token` - Get current push token
   - `DELETE /api/users/push-token` - Clear push token (logout)
   - `POST /api/notifications/send-message` - Send message notifications
   - `POST /api/notifications/send-task` - Send task notifications

### Mobile App (React Native with Expo)

1. **Updated Notification Service** (`src/services/notification.service.ts`)
   - Integrated `sendTokenToBackend()` method
   - Uses Expo project ID from environment variables

2. **Updated Hooks** (`src/hooks/useNotifications.ts`)
   - Automatically sends push token to backend on app load
   - Better error handling

3. **Configuration Updates**
   - `app.json` - Added `expo-notifications` plugin
   - `.env` - Added `EXPO_PUBLIC_EXPO_PROJECT_ID` variable

## Setup Instructions

### Step 1: Get Your Expo Project ID

1. Go to [expo.dev](https://expo.dev)
2. Sign in or create an account
3. Create a new project
4. Copy your **Project ID** from Settings → General → Project ID

### Step 2: Update Environment Variables

**Desktop/Backend:**
```bash
# No changes needed in main .env
# But ensure DATABASE_URL is set correctly
```

**Mobile App (`mobile_application/.env`):**
```
EXPO_PUBLIC_EXPO_PROJECT_ID=your-actual-project-id-here
EXPO_PUBLIC_API_URL=http://your-backend-url/api
```

### Step 3: Database Migration

1. Update Prisma schema:
```bash
cd c:\xampp\htdocs\Office_Project\Chat\ app\ desktop\ production
npx prisma migrate dev --name add_push_notifications
```

2. This creates migration and updates your database with:
   - `expoPushToken` column in User table
   - New `PushNotification` table

### Step 4: Install Dependencies

**Backend:**
```bash
npm install expo-server-sdk
```

**Mobile:**
Already have `expo-notifications` in `package.json`

### Step 5: Test Push Tokens

**Register a push token (on mobile):**
1. Run mobile app
2. App automatically requests notification permissions
3. Token is generated and sent to backend

**Verify token saved:**
```bash
curl -X GET http://localhost:3000/api/users/push-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Step 6: Send Test Notifications

**Option A: Using Expo Console**
1. Go to [Expo Dashboard](https://expo.dev/dashboard)
2. Select your project
3. Use the "Send Notification" tool
4. Paste a valid Expo push token

**Option B: Using API**
```bash
curl -X POST http://your-backend/api/notifications/send-task \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "taskId": "task-id-here",
    "notificationType": "TASK_ASSIGNED",
    "assigneeId": "user-id-here"
  }'
```

## Integration Points

### Sending Message Notifications

After a message is created in your message endpoint:

```typescript
// In your message creation logic
await apiClient.post('/notifications/send-message', {
  messageId: newMessage.id,
});
```

### Sending Task Notifications

After a task is assigned or updated:

```typescript
// When task is assigned
await apiClient.post('/notifications/send-task', {
  taskId: task.id,
  notificationType: 'TASK_ASSIGNED',
  assigneeId: newAssigneeId,
});

// When task status changes
await apiClient.post('/notifications/send-task', {
  taskId: task.id,
  notificationType: 'TASK_STATUS_CHANGED',
});

// When task is due soon (run this via scheduled job)
await apiClient.post('/notifications/send-task', {
  taskId: task.id,
  notificationType: 'TASK_DUE_SOON',
});
```

### Direct Notification Sending

Use the service directly in your backend code:

```typescript
import { notificationHelperService } from '@/lib/services/notification-helper.service';

// Send to single user
await notificationHelperService.notifyNewMessage(
  userId,
  senderName,
  channelId,
  channelName
);

// Broadcast to organization
await notificationHelperService.notifyOrganizationMembers(
  organizationId,
  'Maintenance Notice',
  'System maintenance happening tonight',
);

// Notify channel members
await notificationHelperService.notifyChannelMembers(
  channelId,
  'New announcement',
  'Check the channel for updates'
);
```

## Notification Types Supported

1. **Message Notifications**
   - New messages in channels
   - Direct messages
   - Thread replies

2. **Task Notifications**
   - Task assignment
   - Status changes
   - Due date reminders
   - Comment additions

3. **Reminder Notifications**
   - Custom reminders
   - Scheduled tasks

4. **System Notifications**
   - Announcements
   - Organization-wide messages

## File Structure

```
Backend Files Added:
├── lib/services/
│   ├── expo-push.service.ts          # Core Expo push service
│   └── notification-helper.service.ts # High-level notification helpers
├── app/api/
│   ├── users/push-token/
│   │   └── route.ts                  # Token management endpoints
│   └── notifications/
│       ├── send-message/
│       │   └── route.ts              # Message notification endpoint
│       └── send-task/
│           └── route.ts              # Task notification endpoint
└── prisma/
    └── schema.prisma                 # Updated schema with push fields

Mobile Files Updated:
├── src/services/notification.service.ts    # Updated with backend integration
├── src/hooks/useNotifications.ts          # Updated hook
├── app.json                                 # Added expo-notifications plugin
└── .env                                    # Added EXPO_PROJECT_ID
```

## Troubleshooting

### Push token not generating
- Check notification permissions on device
- Ensure `EXPO_PUBLIC_EXPO_PROJECT_ID` is set correctly
- Test on physical device (simulators have limitations)

### Notifications not received
- Verify token is saved in database
- Check app is using valid Expo project ID
- Ensure app has notification permissions granted

### Invalid token errors
- Tokens expire after device changes
- App will automatically cleanup invalid tokens
- Users should re-grant permission if needed

### Cannot send notifications
- Verify `expo-server-sdk` is installed on backend
- Check Expo project credentials are valid
- Verify user has valid push token in database

## Next Steps

1. **Integrate with existing endpoints:**
   - Add notification calls to message creation
   - Add notification calls to task assignment
   - Add notification calls to reminder triggers

2. **Set up scheduled jobs:**
   - Task due date reminders
   - Notification cleanup (older than 30 days)
   - Token refresh/validation

3. **Add notification preferences:**
   - User can disable specific notification types
   - Quiet hours settings
   - Notification frequency limits

4. **Implement notification UI:**
   - In-app notification center
   - Notification settings panel
   - Notification history view

5. **Monitor and optimize:**
   - Track delivery rates
   - Monitor failed notifications
   - Clean up invalid tokens periodically

## Security Considerations

- Tokens are validated before storing
- Invalid tokens are automatically removed
- All endpoints require authentication
- Notifications are logged for audit trail
- Batch operations limited to authorized users

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all environment variables are set
3. Check server logs for detailed errors
4. Verify database migrations completed
5. Test with curl commands before integrating
