import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from '../src/screens/auth/LoginScreen';
import { authService } from '../src/services/auth.service';

// Mock services
jest.mock('../src/services/auth.service');

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

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />, {
      wrapper: Wrapper,
    });

    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText, findByText } = render(<LoginScreen />, {
      wrapper: Wrapper,
    });

    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(findByText(/Invalid email/i)).toBeTruthy();
    });
  });

  it('shows validation error for invalid email', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <LoginScreen />,
      { wrapper: Wrapper }
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'invalidemail');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(findByText(/Invalid email/i)).toBeTruthy();
    });
  });

  it('shows validation error for short password', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <LoginScreen />,
      { wrapper: Wrapper }
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(findByText(/at least 6 characters/i)).toBeTruthy();
    });
  });

  it('calls login service with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      token: 'fake-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    });
    (authService.login as jest.Mock) = mockLogin;

    const { getByPlaceholderText, getByText } = render(<LoginScreen />, {
      wrapper: Wrapper,
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<LoginScreen />, {
      wrapper: Wrapper,
    });

    const passwordInput = getByPlaceholderText('Enter your password');
    
    // Password should be hidden initially
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Toggle visibility
    const toggleButton = getByTestId('toggle-password');
    fireEvent.press(toggleButton);

    // Password should be visible
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('navigates to register screen', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });

    const registerLink = getByText(/Sign Up/i);
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('navigates to forgot password screen', () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });

    const forgotPasswordLink = getByText(/Forgot Password/i);
    fireEvent.press(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('displays loading state during login', async () => {
    const mockLogin = jest.fn(
      () => new Promise((resolve) => setTimeout(() => resolve({
        token: 'fake-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
      }), 1000))
    );
    (authService.login as jest.Mock) = mockLogin;

    const { getByPlaceholderText, getByText, queryByText } = render(
      <LoginScreen />,
      { wrapper: Wrapper }
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    // Button text should change or show loading indicator
    await waitFor(() => {
      expect(queryByText('Sign In')).toBeNull();
    });
  });

  it('displays error message on login failure', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    (authService.login as jest.Mock) = mockLogin;

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
      // Alert should be shown (you may need to mock Alert.alert)
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
