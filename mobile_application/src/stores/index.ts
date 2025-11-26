// Zustand store for local UI state management
import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) =>
    set({ user, isAuthenticated: user !== null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface UIState {
  currentRoute: string;
  unreadCount: number;
  setCurrentRoute: (route: string) => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentRoute: 'Dashboard',
  unreadCount: 0,
  setCurrentRoute: (route) => set({ currentRoute: route }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  incrementUnreadCount: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  resetUnreadCount: () => set({ unreadCount: 0 }),
}));

interface MessageState {
  messageInput: Record<string, string>; // channelId/userId -> input text
  setMessageInput: (key: string, text: string) => void;
  clearMessageInput: (key: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messageInput: {},
  setMessageInput: (key, text) =>
    set((state) => ({
      messageInput: { ...state.messageInput, [key]: text },
    })),
  clearMessageInput: (key) =>
    set((state) => {
      const newInput = { ...state.messageInput };
      delete newInput[key];
      return { messageInput: newInput };
    }),
}));
