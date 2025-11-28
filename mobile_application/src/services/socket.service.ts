import { io, Socket } from 'socket.io-client';
import { apiClient } from './api';
import { notificationService } from './notification.service';

// Extract the base URL from the API endpoint (remove /api suffix)
const getSocketUrl = () => {
	const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
	return apiUrl.replace('/api', ''); // converts to http://localhost:3000
};

const SOCKET_URL = getSocketUrl();

class SocketService {
	private socket: Socket | null = null;
	private connected = false;

	async connect() {
		if (this.socket && this.connected) return this.socket;

		let token = apiClient.getInMemoryToken();
		if (!token) {
			try {
				token = await apiClient.getStoredToken();
			} catch (e) {
				// ignore
			}
		}

		this.socket = io(SOCKET_URL, {
			path: '/api/socketio',
			transports: ['websocket', 'polling'],
			auth: token ? { token } : undefined,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: 5,
		});

		this.socket.on('connect', () => {
			this.connected = true;
			// eslint-disable-next-line no-console
			console.log('[socket] connected', this.socket?.id);
		});

		this.socket.on('disconnect', (reason: any) => {
			this.connected = false;
			// eslint-disable-next-line no-console
			console.log('[socket] disconnected', reason);
		});

		this.socket.on('connect_error', (err: any) => {
			// eslint-disable-next-line no-console
			console.warn('[socket] connect_error', err);
		});

		// Listen for incoming messages and show notifications
		this.socket.on('message_received', (data: any) => {
			// eslint-disable-next-line no-console
			console.log('[socket] message_received:', data);
			notificationService.sendLocalNotification(
				data.senderName || 'نیا پیغام',
				data.message || data.content || 'آپ کو نیا پیغام موصول ہوا'
			);
		});

		// Listen for channel messages
		this.socket.on('channel_message', (data: any) => {
			// eslint-disable-next-line no-console
			console.log('[socket] channel_message:', data);
			notificationService.sendLocalNotification(
				data.channelName || 'چینل میں نیا پیغام',
				data.message || data.content || 'نیا پیغام'
			);
		});

		// Listen for direct messages
		this.socket.on('direct_message', (data: any) => {
			// eslint-disable-next-line no-console
			console.log('[socket] direct_message:', data);
			notificationService.sendLocalNotification(
				data.senderName || 'براہ راست پیغام',
				data.message || data.content || 'نیا براہ راست پیغام'
			);
		});

		return this.socket;
	}

	async disconnect() {
		if (this.socket) {
			try {
				this.socket.disconnect();
			} catch (e) {
				// ignore
			}
			this.socket = null;
			this.connected = false;
		}
	}

	// Emit with optional acknowledgement timeout
	async emit(event: string, data?: any, timeout = 5000): Promise<any> {
		if (!this.socket) await this.connect();
		return new Promise((resolve, reject) => {
			try {
				this.socket!.emit(event, data, (res: any) => {
					resolve(res);
				});
				// fallback timeout
				setTimeout(() => {
					resolve(undefined);
				}, timeout);
			} catch (e) {
				reject(e);
			}
		});
	}

	async on(event: string, cb: (...args: any[]) => void) {
		if (!this.socket) await this.connect();
		this.socket?.on(event, cb);
	}

	async off(event: string, cb?: (...args: any[]) => void) {
		if (!this.socket) return;
		if (cb) this.socket.off(event, cb);
		else this.socket.off(event);
	}

	isConnected() {
		return this.connected;
	}
}

export const socketService = new SocketService();
