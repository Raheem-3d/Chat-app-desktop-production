// Organization service - handles organization and employee data
import { apiClient } from './api';
import { Organization, User } from '../types';

export const organizationService = {
  /**
   * Get current user's organization details
   */
  async getMyOrganization(): Promise<Organization | null> {
    try {
      const response = await apiClient.get<{ organization: Organization | null }>(
        '/organization/me'
      );
      return response.organization;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
  },

  /**
   * Get all employees in the organization
   * Returns organization-wise employee details
   */
  async getOrganizationEmployees(): Promise<User[]> {
    try {
      const users = await apiClient.get<User[]>('/users');
      return users;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  /**
   * Get employee details by ID
   */
  async getEmployeeDetails(userId: string): Promise<User | null> {
    try {
      const user = await apiClient.get<User>(`/users/${userId}`);
      return user;
    } catch (error) {
      console.error('Error fetching employee details:', error);
      return null;
    }
  },

  /**
   * Get employees filtered by role
   */
  async getEmployeesByRole(role: string): Promise<User[]> {
    try {
      const users = await apiClient.get<User[]>('/users');
      return users.filter(user => user.role === role);
    } catch (error) {
      console.error('Error fetching employees by role:', error);
      return [];
    }
  },

  /**
   * Get employees filtered by department
   */
  async getEmployeesByDepartment(departmentId: string): Promise<User[]> {
    try {
      const users = await apiClient.get<User[]>('/users');
      return users.filter(user => user.departmentId === departmentId);
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      return [];
    }
  },
};
