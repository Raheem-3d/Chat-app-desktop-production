# Mobile Application - React Native (Expo)

A comprehensive mobile application built with React Native and Expo for the Office Project chat and task management platform.

## 📱 Features

- **Authentication**: Email/password login with secure token storage
- **Dashboard**: Overview of tasks, channels, and activity
- **Task Management**: Create, update, and track tasks with status updates
- **Channels**: Real-time messaging in channels and direct messages
- **People**: Browse organization members
- **Notifications**: Real-time push notifications
- **Reminders**: Set and manage task reminders
- **Settings**: Profile management, notification preferences, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- Expo CLI (installed automatically)
- For iOS development: macOS with Xcode
- For Android development: Android Studio and Android SDK
- Expo Go app on your physical device (for testing)

### Installation

1. **Navigate to the mobile app directory**:
   ```bash
   cd mobile_application
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy the example .env file
   copy .env.example .env
   ```

   Edit `.env` and set your backend API URL:
   ```env
   EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000/api
   ```

   **Important**: For testing on physical devices, use your computer's local IP address (e.g., `http://192.168.1.100:3000/api`), NOT `localhost`.

### Running the App

1. **Start the Expo development server**:
   ```bash
   npm start
   ```

2. **Run on specific platforms**:
   ```bash
   # Android
   npm run android

   # iOS (macOS only)
   npm run ios

   # Web
   npm run web
   ```

3. **Testing on physical device**:
   - Install Expo Go from App Store (iOS) or Play Store (Android)
   - Scan the QR code shown in the terminal
   - App will load on your device

## 🔧 Development

### Project Structure

```
mobile_application/
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/            # React Query hooks and custom hooks
│   ├── navigation/       # React Navigation setup
│   ├── screens/          # Screen components
│   │   ├── auth/         # Login, Register, ForgotPassword
│   │   └── main/         # Dashboard, Tasks, Channels, etc.
│   ├── services/         # API service layer
│   ├── stores/           # Zustand state management
│   ├── theme/            # Theme configuration
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, icons
├── App.tsx              # Main application entry point
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

### Available Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android device/emulator
npm run ios            # Run on iOS device/simulator
npm run web            # Run in web browser

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors
npm run typecheck      # Run TypeScript type checking
npm run format         # Format code with Prettier
npm test               # Run Jest tests

# Building
npm run build:android  # Build Android APK/AAB
npm run build:ios      # Build iOS app
```

### Code Quality Tools

- **ESLint**: Linting with TypeScript and React rules
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Jest + React Native Testing Library**: Unit and integration testing

## 🔐 Backend Requirements

The mobile app connects to the Next.js backend. You need to set up the following:

### 1. Mobile Authentication Endpoint

Create a custom mobile login endpoint since NextAuth uses cookies (not suitable for mobile):

**Create `app/api/auth/mobile/login/route.ts`**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '7d' }
    );

    // Return user data and token
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. CORS Configuration

Update `next.config.mjs` to allow mobile app requests:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // In production, set to your domain
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 3. JWT Middleware

Create middleware to verify JWT tokens from mobile:

**Create `lib/mobile-auth.ts`**:

```typescript
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function verifyMobileToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}
```

Use this in your API routes:

```typescript
import { verifyMobileToken } from '@/lib/mobile-auth';

export async function GET(request: NextRequest) {
  const user = await verifyMobileToken(request);
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your API logic here
}
```

## 📦 Building for Production

### Android

1. **Configure app signing**:
   - Generate keystore: `keytool -genkeypair -v -storetype PKCS12 -keystore my-app.keystore -alias my-app-alias -keyalg RSA -keysize 2048 -validity 10000`
   - Update `eas.json` with keystore path

2. **Build APK/AAB**:
   ```bash
   npm run build:android
   ```

3. **Install EAS CLI if needed**:
   ```bash
   npm install -g eas-cli
   eas build --platform android
   ```

### iOS

1. **Prerequisites**:
   - Apple Developer account ($99/year)
   - Xcode installed on macOS

2. **Build IPA**:
   ```bash
   npm run build:ios
   ```

3. **Using EAS Build**:
   ```bash
   eas build --platform ios
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

Example service test (`src/services/__tests__/auth.service.test.ts`):

```typescript
import { login } from '../auth.service';
import { apiClient } from '../api';

jest.mock('../api');

describe('AuthService', () => {
  it('should login successfully', async () => {
    const mockResponse = {
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'mock-token',
    };
    
    (apiClient.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await login('test@example.com', 'password');
    
    expect(result).toEqual(mockResponse);
    expect(apiClient.post).toHaveBeenCalledWith('/auth/mobile/login', {
      email: 'test@example.com',
      password: 'password',
    });
  });
});
```

## 🔍 Troubleshooting

### Common Issues

**1. "Network request failed" when logging in**

- Ensure your backend is running on the same network
- Use your computer's local IP address, not `localhost`
- Check CORS is properly configured
- Verify the API URL in `.env` is correct

**2. "Unable to resolve module"**

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

**3. Android build errors**

```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..
```

**4. iOS CocoaPods issues**

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Debug Mode

Enable debug logging by setting in `.env`:

```env
EXPO_PUBLIC_DEBUG_MODE=true
```

This will log API requests/responses to the console.

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native](https://reactnative.dev/)

## 🗺️ Migration Status

See `analysis.md` for detailed mapping between web and mobile features.

### Fully Implemented
- ✅ Authentication (Login)
- ✅ Dashboard with stats
- ✅ Navigation structure
- ✅ API client with auth
- ✅ State management setup

### In Progress (Placeholders Ready)
- 🚧 Task management screens
- 🚧 Channel messaging
- 🚧 Direct messages
- 🚧 People directory
- 🚧 Notifications panel
- 🚧 Settings screens
- 🚧 Reminders

### Future Enhancements
- Push notifications (Expo Notifications configured)
- Socket.IO real-time updates
- File uploads
- Video calls
- Advanced admin features

## 📄 License

Same as parent project.

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Run `npm run lint && npm run typecheck && npm test`
4. Submit PR

---

For questions or issues, refer to the main project documentation or create an issue in the repository.
