// Task service - handles all task-related API calls
import { apiClient } from './api';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskComment,
} from '../types';

export const taskService = {
  /**
   * Get all tasks for the current user
   */
  async getTasks(params?: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    createdBy?: string;
  }): Promise<Task[]> {
    const queryParams = new URLSearchParams(params as any).toString();
    const url = queryParams ? `/tasks?${queryParams}` : '/tasks';
    return await apiClient.get<Task[]>(url);
  },

  /**
   * Get a specific task by ID
   */
  async getTask(taskId: string): Promise<Task> {
    return await apiClient.get<Task>(`/tasks/${taskId}`);
  },

  /**
   * Create a new task
   */
  async createTask(data: CreateTaskRequest): Promise<Task> {
    return await apiClient.post<Task>('/tasks', data);
  },

  /**
   * Update a task
   */
  async updateTask(
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<Task> {
    return await apiClient.patch<Task>(`/tasks/${taskId}`, data);
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<{ message: string }> {
    return await apiClient.delete(`/tasks/${taskId}`);
  },

  /**
   * Get task comments
   */
  async getTaskComments(taskId: string): Promise<TaskComment[]> {
    return await apiClient.get<TaskComment[]>(`/tasks/${taskId}/comments`);
  },

  /**
   * Add a comment to a task
   */
  async addTaskComment(
    taskId: string,
    content: string
  ): Promise<TaskComment> {
    return await apiClient.post<TaskComment>(
      `/task-comments`,
      { taskId, content }
    );
  },
};
