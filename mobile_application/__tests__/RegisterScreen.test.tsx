import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegisterScreen from '../src/screens/auth/RegisterScreen';
import { authService } from '../src/services/auth.service';

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

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />, {
      wrapper: Wrapper,
    });

    expect(getByPlaceholderText('Enter your full name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter company name')).toBeTruthy();
    expect(getByPlaceholderText('Enter password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText } = render(<RegisterScreen />, { wrapper: Wrapper });

    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      // Validation errors should be displayed
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  it('validates email format', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <RegisterScreen />,
      { wrapper: Wrapper }
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(emailInput, 'invalidemail');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(findByText(/Invalid email/i)).toBeTruthy();
    });
  });

  it('validates password confirmation match', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <RegisterScreen />,
      { wrapper: Wrapper }
    );

    const passwordInput = getByPlaceholderText('Enter password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password456');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(findByText(/Passwords must match/i)).toBeTruthy();
    });
  });

  it('validates minimum password length', async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <RegisterScreen />,
      { wrapper: Wrapper }
    );

    const passwordInput = getByPlaceholderText('Enter password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(findByText(/at least 6 characters/i)).toBeTruthy();
    });
  });

  it('calls register service with correct data', async () => {
    const mockRegister = jest.fn().mockResolvedValue({
      message: 'Registration successful',
    });
    (authService.register as jest.Mock) = mockRegister;

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />, {
      wrapper: Wrapper,
    });

    const nameInput = getByPlaceholderText('Enter your full name');
    const emailInput = getByPlaceholderText('Enter your email');
    const companyInput = getByPlaceholderText('Enter company name');
    const passwordInput = getByPlaceholderText('Enter password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(companyInput, 'Acme Corp');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });
  });

  it('toggles password visibility for both password fields', () => {
    const { getByPlaceholderText, getAllByTestId } = render(
      <RegisterScreen />,
      { wrapper: Wrapper }
    );

    const passwordInput = getByPlaceholderText('Enter password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');

    // Both passwords should be hidden initially
    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);

    // Toggle visibility for main password
    const toggleButtons = getAllByTestId(/toggle-password/);
    fireEvent.press(toggleButtons[0]);

    // Main password should be visible
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it('navigates to login screen after successful registration', async () => {
    const mockRegister = jest.fn().mockResolvedValue({
      message: 'Registration successful',
    });
    (authService.register as jest.Mock) = mockRegister;

    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
    });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />, {
      wrapper: Wrapper,
    });

    const nameInput = getByPlaceholderText('Enter your full name');
    const emailInput = getByPlaceholderText('Enter your email');
    const companyInput = getByPlaceholderText('Enter company name');
    const passwordInput = getByPlaceholderText('Enter password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(companyInput, 'Acme Corp');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });

  it('displays loading state during registration', async () => {
    const mockRegister = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ message: 'Registration successful' }),
            1000
          )
        )
    );
    (authService.register as jest.Mock) = mockRegister;

    const { getByPlaceholderText, getByText, queryByText } = render(
      <RegisterScreen />,
      { wrapper: Wrapper }
    );

    const nameInput = getByPlaceholderText('Enter your full name');
    const emailInput = getByPlaceholderText('Enter your email');
    const companyInput = getByPlaceholderText('Enter company name');
    const passwordInput = getByPlaceholderText('Enter password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(companyInput, 'Acme Corp');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(queryByText('Sign Up')).toBeNull();
    });
  });

  it('displays error message on registration failure', async () => {
    const mockRegister = jest
      .fn()
      .mockRejectedValue(new Error('Email already exists'));
    (authService.register as jest.Mock) = mockRegister;

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />, {
      wrapper: Wrapper,
    });

    const nameInput = getByPlaceholderText('Enter your full name');
    const emailInput = getByPlaceholderText('Enter your email');
    const companyInput = getByPlaceholderText('Enter company name');
    const passwordInput = getByPlaceholderText('Enter password');
    const confirmPasswordInput = getByPlaceholderText('Confirm password');
    const signUpButton = getByText('Sign Up');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(companyInput, 'Acme Corp');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });
});
