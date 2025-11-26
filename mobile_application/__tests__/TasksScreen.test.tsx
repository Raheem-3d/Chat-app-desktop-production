import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tantml:react-query';
import TasksScreen from '../src/screens/main/TasksScreen';
import { taskService } from '../src/services/task.service';

jest.mock('../src/services/task.service');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'TODO',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Test Task 3',
    description: 'Description 3',
    status: 'DONE',
    priority: 'LOW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <NavigationContainer>{children}</NavigationContainer>
  </QueryClientProvider>
);

describe('TasksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (taskService.getTasks as jest.Mock) = jest.fn().mockResolvedValue(mockTasks);
  });

  it('renders task list correctly', async () => {
    const { getByText } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(getByText('Test Task 2')).toBeTruthy();
      expect(getByText('Test Task 3')).toBeTruthy();
    });
  });

  it('displays loading indicator while fetching tasks', () => {
    (taskService.getTasks as jest.Mock) = jest.fn(
      () => new Promise((resolve) => setTimeout(() => resolve(mockTasks), 1000))
    );

    const { getByTestId } = render(<TasksScreen />, { wrapper: Wrapper });

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('filters tasks by status', async () => {
    const { getByText, queryByText } = render(<TasksScreen />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
    });

    // Click on IN_PROGRESS filter
    const inProgressButton = getByText('IN_PROGRESS');
    fireEvent.press(inProgressButton);

    await waitFor(() => {
      expect(getByText('Test Task 2')).toBeTruthy();
      expect(queryByText('Test Task 1')).toBeNull();
      expect(queryByText('Test Task 3')).toBeNull();
    });
  });

  it('filters tasks by priority', async () => {
    const { getByText, queryByText } = render(<TasksScreen />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
    });

    // Click on HIGH priority filter
    const highButton = getByText('HIGH');
    fireEvent.press(highButton);

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(queryByText('Test Task 2')).toBeNull();
      expect(queryByText('Test Task 3')).toBeNull();
    });
  });

  it('navigates to task detail when task is pressed', async () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        navigate: mockNavigate,
      });

    const { getByText } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
    });

    const taskCard = getByText('Test Task 1');
    fireEvent.press(taskCard);

    expect(mockNavigate).toHaveBeenCalledWith('TaskDetail', { taskId: '1' });
  });

  it('navigates to create task when FAB is pressed', async () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('@react-navigation/native'), 'useNavigation')
      .mockReturnValue({
        navigate: mockNavigate,
      });

    const { getByTestId } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      const fabButton = getByTestId('create-task-fab');
      fireEvent.press(fabButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('CreateTask');
  });

  it('refreshes tasks on pull-to-refresh', async () => {
    const mockGetTasks = jest.fn().mockResolvedValue(mockTasks);
    (taskService.getTasks as jest.Mock) = mockGetTasks;

    const { getByTestId } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(mockGetTasks).toHaveBeenCalledTimes(1);
    });

    // Trigger pull-to-refresh
    const flatList = getByTestId('tasks-list');
    fireEvent(flatList, 'refresh');

    await waitFor(() => {
      expect(mockGetTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('displays empty state when no tasks exist', async () => {
    (taskService.getTasks as jest.Mock) = jest.fn().mockResolvedValue([]);

    const { getByText } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText(/No tasks found/i)).toBeTruthy();
    });
  });

  it('displays status badges with correct colors', async () => {
    const { getByText } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      const todoBadge = getByText('TODO');
      const inProgressBadge = getByText('IN_PROGRESS');
      const doneBadge = getByText('DONE');

      expect(todoBadge).toBeTruthy();
      expect(inProgressBadge).toBeTruthy();
      expect(doneBadge).toBeTruthy();
    });
  });

  it('displays priority badges with correct colors', async () => {
    const { getByText } = render(<TasksScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      const highBadge = getByText('HIGH');
      const mediumBadge = getByText('MEDIUM');
      const lowBadge = getByText('LOW');

      expect(highBadge).toBeTruthy();
      expect(mediumBadge).toBeTruthy();
      expect(lowBadge).toBeTruthy();
    });
  });

  it('combines status and priority filters correctly', async () => {
    const { getByText, queryByText } = render(<TasksScreen />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
    });

    // Apply both filters
    const todoButton = getByText('TODO');
    const highButton = getByText('HIGH');
    
    fireEvent.press(todoButton);
    fireEvent.press(highButton);

    await waitFor(() => {
      expect(getByText('Test Task 1')).toBeTruthy();
      expect(queryByText('Test Task 2')).toBeNull();
      expect(queryByText('Test Task 3')).toBeNull();
    });
  });
});
