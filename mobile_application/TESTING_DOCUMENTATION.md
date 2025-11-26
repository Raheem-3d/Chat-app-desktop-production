# Mobile App Testing Guide

## Overview
This guide covers testing for the React Native mobile application including unit tests, integration tests, and E2E tests.

---

## Test Setup

### Dependencies
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
```

### Jest Configuration
File: `jest.config.js`
```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};
```

### Jest Setup
File: `jest-setup.js`
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  getBadgeCountAsync: jest.fn(),
  setBadgeCountAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock ImagePicker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock DocumentPicker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

// Mock Alert
global.alert = jest.fn();

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

---

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode
```bash
npm test -- --watch
```

### Coverage Report
```bash
npm test -- --coverage
```

### Specific Test File
```bash
npm test -- LoginScreen.test.tsx
```

### Update Snapshots
```bash
npm test -- -u
```

---

## Test Files

### Unit Tests

#### 1. LoginScreen.test.tsx
**Tests:**
- ✅ Renders login form correctly
- ✅ Shows validation errors for empty fields
- ✅ Shows validation error for invalid email
- ✅ Shows validation error for short password
- ✅ Calls login service with correct credentials
- ✅ Toggles password visibility
- ✅ Navigates to register screen
- ✅ Navigates to forgot password screen
- ✅ Displays loading state during login
- ✅ Displays error message on login failure

**Run:**
```bash
npm test -- LoginScreen.test.tsx
```

#### 2. RegisterScreen.test.tsx
**Tests:**
- ✅ Renders registration form correctly
- ✅ Shows validation errors for empty fields
- ✅ Validates email format
- ✅ Validates password confirmation match
- ✅ Validates minimum password length
- ✅ Calls register service with correct data
- ✅ Toggles password visibility for both password fields
- ✅ Navigates to login screen after successful registration
- ✅ Displays loading state during registration
- ✅ Displays error message on registration failure

**Run:**
```bash
npm test -- RegisterScreen.test.tsx
```

#### 3. TasksScreen.test.tsx
**Tests:**
- ✅ Renders task list correctly
- ✅ Displays loading indicator while fetching tasks
- ✅ Filters tasks by status
- ✅ Filters tasks by priority
- ✅ Navigates to task detail when task is pressed
- ✅ Navigates to create task when FAB is pressed
- ✅ Refreshes tasks on pull-to-refresh
- ✅ Displays empty state when no tasks exist
- ✅ Displays status badges with correct colors
- ✅ Displays priority badges with correct colors
- ✅ Combines status and priority filters correctly

**Run:**
```bash
npm test -- TasksScreen.test.tsx
```

### Integration Tests

#### integration.test.tsx
**Test Suites:**

1. **Authentication Flow Integration Test**
   - ✅ Completes full login flow from LoginScreen to Dashboard
   - ✅ Handles login failure correctly
   - ✅ Persists authentication state after app restart
   - ✅ Clears authentication on logout

2. **Task CRUD Integration Test**
   - ✅ Creates, views, updates, and deletes a task

3. **Messaging Integration Test**
   - ✅ Sends and receives messages in a channel

**Run:**
```bash
npm test -- integration.test.tsx
```

---

## Writing New Tests

### Component Test Template
```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import YourComponent from '../src/components/YourComponent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <NavigationContainer>{children}</NavigationContainer>
  </QueryClientProvider>
);

describe('YourComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<YourComponent />, { wrapper: Wrapper });
    expect(getByText('Expected Text')).toBeTruthy();
  });

  it('handles user interaction', async () => {
    const { getByText } = render(<YourComponent />, { wrapper: Wrapper });
    
    const button = getByText('Click Me');
    fireEvent.press(button);

    await waitFor(() => {
      // Assert expected behavior
    });
  });
});
```

### Service Test Template
```typescript
import { yourService } from '../src/services/your.service';
import { apiClient } from '../src/services/apiClient';

jest.mock('../src/services/apiClient');

describe('YourService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls API endpoint correctly', async () => {
    const mockResponse = { data: 'test' };
    (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await yourService.fetchData();

    expect(apiClient.get).toHaveBeenCalledWith('/endpoint');
    expect(result).toEqual(mockResponse);
  });
});
```

---

## Testing Best Practices

### 1. Use Testing Library Queries
```typescript
// ✅ Good - accessible queries
const button = getByText('Submit');
const input = getByPlaceholderText('Enter name');
const element = getByTestId('unique-id');

// ❌ Avoid - implementation details
const button = container.querySelector('.submit-button');
```

### 2. Wait for Async Operations
```typescript
// ✅ Good - wait for async updates
await waitFor(() => {
  expect(getByText('Success')).toBeTruthy();
});

// ❌ Avoid - synchronous assertions on async code
expect(getByText('Success')).toBeTruthy(); // Might fail
```

### 3. Mock External Dependencies
```typescript
// Mock services
jest.mock('../src/services/auth.service');

// Mock hooks
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));
```

### 4. Test User Behavior, Not Implementation
```typescript
// ✅ Good - test what user sees/does
fireEvent.changeText(emailInput, 'test@example.com');
fireEvent.press(submitButton);
expect(getByText('Welcome')).toBeTruthy();

// ❌ Avoid - test implementation details
expect(component.state.email).toBe('test@example.com');
```

### 5. Cleanup After Each Test
```typescript
afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});
```

---

## Coverage Goals

### Target Coverage
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### View Coverage Report
```bash
npm test -- --coverage
open coverage/lcov-report/index.html
```

---

## File Upload Testing

### Test FileUpload Component
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import FileUpload from '../src/components/FileUpload';

jest.mock('expo-image-picker');

test('picks image successfully', async () => {
  const mockResult = {
    canceled: false,
    assets: [{ uri: 'file://test.jpg', fileName: 'test.jpg' }],
  };
  
  (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);

  const onFileSelected = jest.fn();
  const { getByText } = render(<FileUpload onFileSelected={onFileSelected} />);

  const imageButton = getByText('Image');
  fireEvent.press(imageButton);

  await waitFor(() => {
    expect(onFileSelected).toHaveBeenCalledWith({
      uri: 'file://test.jpg',
      name: 'test.jpg',
      type: 'image/jpeg',
    });
  });
});
```

---

## Push Notification Testing

### Test Notification Service
```typescript
import { notificationService } from '../src/services/notification.service';
import * as Notifications from 'expo-notifications';

jest.mock('expo-notifications');

test('registers for push notifications', async () => {
  (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
    status: 'granted',
  });
  
  (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
    data: 'ExponentPushToken[test-token]',
  });

  const token = await notificationService.registerForPushNotifications();

  expect(token).toBe('ExponentPushToken[test-token]');
});
```

---

## Debugging Tests

### Enable Verbose Logging
```bash
npm test -- --verbose
```

### Debug Single Test
```bash
npm test -- --testNamePattern="renders correctly"
```

### Print Debug Info
```typescript
import { debug } from '@testing-library/react-native';

test('debug test', () => {
  const { debug: debugTree } = render(<Component />);
  debugTree(); // Prints component tree
});
```

---

## CI/CD Integration

### GitHub Actions
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:**
```bash
# Clear cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Async operation was not stopped"
**Solution:**
```typescript
// Add cleanup
afterEach(() => {
  cleanup();
  jest.clearAllTimers();
});
```

### Issue: "Network request failed"
**Solution:**
```typescript
// Mock apiClient
jest.mock('../src/services/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
```

---

## Next Steps

1. **Add E2E Tests** using Detox or Maestro
2. **Add Performance Tests** using React Native Performance
3. **Add Accessibility Tests** using @testing-library/jest-native matchers
4. **Add Visual Regression Tests** using Jest Image Snapshot

---

## Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)
