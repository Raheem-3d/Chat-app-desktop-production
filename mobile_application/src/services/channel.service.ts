// Channel service - handles channel and channel message operations
import { apiClient } from './api';
import {
  Channel,
  Message,
  CreateChannelRequest,
  SendMessageRequest,
  PaginatedResponse,
} from '../types';

export const channelService = {
  /**
   * Get all channels user is a member of
   */
  async getChannels(): Promise<Channel[]> {
    return await apiClient.get<Channel[]>('/channels');
  },

  /**
   * Get a specific channel
   */
  async getChannel(channelId: string): Promise<Channel> {
    return await apiClient.get<Channel>(`/channels/${channelId}`);
  },

  /**
   * Create a new channel
   */
  async createChannel(data: CreateChannelRequest): Promise<Channel> {
    return await apiClient.post<Channel>('/channels', data);
  },

  /**
   * Get messages for a channel
   */
  async getChannelMessages(
    channelId: string,
    params?: {
      limit?: number;
      before?: string;
    }
  ): Promise<Message[]> {
    const queryParams = new URLSearchParams(params as any).toString();
    const url = queryParams
      ? `/channels/${channelId}/messages?${queryParams}`
      : `/channels/${channelId}/messages`;
    
    const response = await apiClient.get<{ messages?: Message[] } | Message[]>(url);
    
    // Handle both response formats
    if (Array.isArray(response)) {
      return response;
    }
    return response.messages || [];
  },

  /**
   * Send a message to a channel
   */
  async sendChannelMessage(
    channelId: string,
    data: Omit<SendMessageRequest, 'channelId'>
  ): Promise<Message> {
    return await apiClient.post<Message>('/messages', {
      ...data,
      channelId,
    });
  },

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string): Promise<{ message: string }> {
    return await apiClient.delete(`/messages/${messageId}`);
  },

  /**
   * Pin/unpin a message
   */
  async togglePinMessage(messageId: string): Promise<Message> {
    return await apiClient.patch<Message>(`/messages/${messageId}/pin`, {});
  },

  /**
   * React to a message
   */
  async reactToMessage(
    messageId: string,
    emoji: string
  ): Promise<Message> {
    return await apiClient.post<Message>(
      `/messages/${messageId}/react`,
      { emoji }
    );
  },
};
