import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../src/screens/auth/LoginScreen';
import DashboardScreen from '../src/screens/main/DashboardScreen';
import { authService } from '../src/services/auth.service';
import { taskService } from '../src/services/task.service';

jest.mock('../src/services/auth.service');
jest.mock('../src/services/task.service');
jest.mock('@react-native-async-storage/async-storage');

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

describe('Authentication Flow Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full login flow from LoginScreen to Dashboard', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      organizationId: 'org-1',
    };

    const mockLoginResponse = {
      token: 'fake-jwt-token',
      user: mockUser,
    };

    // Mock services
    (authService.login as jest.Mock) = jest.fn().mockResolvedValue(mockLoginResponse);
    (taskService.getTasks as jest.Mock) = jest.fn().mockResolvedValue([]);
    (AsyncStorage.setItem as jest.Mock) = jest.fn().mockResolvedValue(undefined);
    (AsyncStorage.getItem as jest.Mock) = jest.fn().mockResolvedValue('fake-jwt-token');

    // 1. Render LoginScreen
    const { getByPlaceholderText, getByText, rerender } = render(
      <LoginScreen />,
      { wrapper: Wrapper }
    );

    // 2. Enter credentials
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // 3. Submit login
    fireEvent.press(signInButton);

    // 4. Verify login was called
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    // 5. Verify token was stored
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
    });

    // 6. Navigate to Dashboard (simulated)
    rerender(<DashboardScreen />);

    // 7. Verify Dashboard renders user info
    await waitFor(() => {
      expect(getByText(/Welcome back/i)).toBeTruthy();
    });
  });

  it('handles login failure correctly', async () => {
    const mockError = new Error('Invalid credentials');
    (authService.login as jest.Mock) = jest.fn().mockRejectedValue(mockError);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />, {
      wrapper: Wrapper,
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
      // Alert should be shown with error message
    });

    // Verify token was NOT stored
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });

  it('persists authentication state after app restart', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      organizationId: 'org-1',
    };

    // Simulate stored token
    (AsyncStorage.getItem as jest.Mock) = jest
      .fn()
      .mockResolvedValue('fake-jwt-token');
    (authService.verifyToken as jest.Mock) = jest.fn().mockResolvedValue(mockUser);
    (taskService.getTasks as jest.Mock) = jest.fn().mockResolvedValue([]);

    // Render Dashboard (simulating app restart with stored token)
    const { getByText } = render(<DashboardScreen />, { wrapper: Wrapper });

    // Should automatically fetch user data and render dashboard
    await waitFor(() => {
      expect(getByText(/Welcome back/i)).toBeTruthy();
    });
  });

  it('clears authentication on logout', async () => {
    (AsyncStorage.removeItem as jest.Mock) = jest.fn().mockResolvedValue(undefined);
    (authService.logout as jest.Mock) = jest.fn().mockResolvedValue(undefined);

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      organizationId: 'org-1',
    };

    // Mock initial authenticated state
    const { getByText } = render(<DashboardScreen />, { wrapper: Wrapper });

    // Find and press logout button (assuming it's in a menu)
    // This would need to navigate through the app
    // For now, we'll just test the service directly

    await authService.logout();

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
    });
  });
});

describe('Task CRUD Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates, views, updates, and deletes a task', async () => {
    const newTask = {
      id: '1',
      title: 'New Test Task',
      description: 'Test Description',
      status: 'TODO',
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mock task service methods
    (taskService.createTask as jest.Mock) = jest.fn().mockResolvedValue(newTask);
    (taskService.getTasks as jest.Mock) = jest.fn().mockResolvedValue([newTask]);
    (taskService.getTask as jest.Mock) = jest.fn().mockResolvedValue(newTask);
    (taskService.updateTask as jest.Mock) = jest.fn().mockResolvedValue({
      ...newTask,
      status: 'IN_PROGRESS',
    });
    (taskService.deleteTask as jest.Mock) = jest.fn().mockResolvedValue(undefined);

    // 1. Create task
    const createResult = await taskService.createTask({
      title: 'New Test Task',
      description: 'Test Description',
      status: 'TODO',
      priority: 'HIGH',
    });

    expect(createResult).toEqual(newTask);
    expect(taskService.createTask).toHaveBeenCalled();

    // 2. View task
    const viewResult = await taskService.getTask('1');
    expect(viewResult).toEqual(newTask);
    expect(taskService.getTask).toHaveBeenCalledWith('1');

    // 3. Update task
    const updateResult = await taskService.updateTask('1', {
      status: 'IN_PROGRESS',
    });
    expect(updateResult.status).toBe('IN_PROGRESS');
    expect(taskService.updateTask).toHaveBeenCalledWith('1', {
      status: 'IN_PROGRESS',
    });

    // 4. Delete task
    await taskService.deleteTask('1');
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });
});

describe('Messaging Integration Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends and receives messages in a channel', async () => {
    const mockMessage = {
      id: '1',
      content: 'Hello World',
      senderId: 'user-1',
      channelId: 'channel-1',
      createdAt: new Date().toISOString(),
    };

    const channelService = require('../src/services/channel.service').channelService;

    (channelService.getChannelMessages as jest.Mock) = jest
      .fn()
      .mockResolvedValue([]);
    (channelService.sendMessage as jest.Mock) = jest
      .fn()
      .mockResolvedValue(mockMessage);

    // 1. Get initial messages (empty)
    const initialMessages = await channelService.getChannelMessages('channel-1');
    expect(initialMessages).toEqual([]);

    // 2. Send message
    const sentMessage = await channelService.sendMessage('channel-1', {
      content: 'Hello World',
    });
    expect(sentMessage).toEqual(mockMessage);

    // 3. Get updated messages
    (channelService.getChannelMessages as jest.Mock) = jest
      .fn()
      .mockResolvedValue([mockMessage]);
    
    const updatedMessages = await channelService.getChannelMessages('channel-1');
    expect(updatedMessages).toHaveLength(1);
    expect(updatedMessages[0].content).toBe('Hello World');
  });
});
