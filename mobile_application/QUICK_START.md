# Mobile Application - Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

```bash
cd mobile_application
npm install
```

### Step 2: Configure API URL

Create `.env` file:

```bash
copy .env.example .env
```

Edit `.env` and replace with your computer's IP address:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:3000/api
```

**To find your IP address:**

Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter.

macOS/Linux:
```bash
ifconfig
```
Look for "inet" under your active network adapter.

### Step 3: Start the Development Server

```bash
npm start
```

This opens the Expo DevTools in your browser.

### Step 4: Run on Device

**Option A: Physical Device (Recommended for testing)**

1. Install "Expo Go" app:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in terminal:
   - iOS: Use Camera app
   - Android: Use Expo Go app scanner

**Option B: Emulator**

Android:
```bash
npm run android
```

iOS (macOS only):
```bash
npm run ios
```

### Step 5: Backend Setup (Required)

The mobile app needs a custom authentication endpoint. Add this to your Next.js backend:

**Create `app/api/auth/mobile/login/route.ts`:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organizations: {
          include: { organization: true },
        },
      },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        organizations: user.organizations.map((org) => ({
          id: org.organization.id,
          name: org.organization.name,
          role: org.role,
        })),
      },
      token,
    });
  } catch (error) {
    console.error('Mobile login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

**Update CORS in `next.config.mjs`:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Step 6: Test the Login

1. Make sure your Next.js backend is running on port 3000
2. Open the mobile app
3. Try logging in with your credentials
4. You should see the dashboard with task stats

## ✅ What Works Now

- ✅ Login screen with email/password
- ✅ Dashboard with task statistics
- ✅ Navigation structure (tabs and stacks)
- ✅ Secure token storage
- ✅ API client with authentication

## 🚧 What's Next

Most screens are placeholders. To implement them:

1. Open a screen file in `src/screens/main/`
2. Replace the `PlaceholderScreen` component with actual UI
3. Use the hooks from `src/hooks/useApi.ts` to fetch data
4. Follow the pattern from `DashboardScreen.tsx`

Example for TasksScreen:

```typescript
import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useTasks } from '@/hooks/useApi';
import { useAuthStore } from '@/stores';

export default function TasksScreen() {
  const { user } = useAuthStore();
  const orgId = user?.organizations[0]?.id;
  
  const { data: tasks, isLoading } = useTasks(orgId || '', {
    enabled: !!orgId,
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}
```

## 📚 Resources

- Full setup: `README.md`
- API mapping: `analysis.md`
- Migration details: `migration_summary.json`
- Type definitions: `src/types/index.ts`
- Example screens: `src/screens/main/DashboardScreen.tsx`

## 🆘 Troubleshooting

**"Network request failed"**
- Use your computer's IP address, not localhost
- Ensure phone and computer are on same WiFi
- Check backend is running
- Verify CORS is configured

**"Unable to resolve module"**
```bash
rm -rf node_modules
npm install
npx expo start -c
```

**Build errors**
```bash
npx expo start -c
```

## 🎉 You're Ready!

The mobile app is now running. Start implementing the placeholder screens one by one, using the existing services and hooks.

Happy coding! 🚀
