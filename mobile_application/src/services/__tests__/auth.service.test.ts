import { authService } from '../auth.service';
import { apiClient } from '../api';

jest.mock('../api');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          image: null,
          organizations: [
            {
              id: 'org-1',
              name: 'Test Org',
              role: 'MEMBER',
            },
          ],
        },
        token: 'mock-jwt-token',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);
      (apiClient.setToken as jest.Mock).mockResolvedValue(undefined);
      (apiClient.setUser as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual(mockResponse);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/mobile/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(apiClient.setToken).toHaveBeenCalledWith('mock-jwt-token');
    });

    it('should throw error when login fails', async () => {
      const mockError = new Error('Invalid credentials');

      (apiClient.post as jest.Mock).mockRejectedValue(mockError);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpass',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should clear auth data', async () => {
      (apiClient.clearAuth as jest.Mock).mockResolvedValue(undefined);

      await authService.logout();

      expect(apiClient.clearAuth).toHaveBeenCalledTimes(1);
    });
  });
});
