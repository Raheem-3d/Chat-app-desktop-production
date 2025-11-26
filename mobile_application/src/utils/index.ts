// Utility functions ported from Next.js app
// These are pure functions with no web-specific dependencies

import { TaskPriority, TaskStatus } from '../types';

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return `${formatDate(d)} at ${formatTime(d)}`;
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getDepartmentColor(departmentName: string): {
  background: string;
  text: string;
} {
  const colors = [
    { background: '#FEE2E2', text: '#991B1B' }, // red
    { background: '#DBEAFE', text: '#1E40AF' }, // blue
    { background: '#D1FAE5', text: '#065F46' }, // green
    { background: '#FEF3C7', text: '#92400E' }, // yellow
    { background: '#E9D5FF', text: '#6B21A8' }, // purple
    { background: '#FCE7F3', text: '#9F1239' }, // pink
    { background: '#E0E7FF', text: '#3730A3' }, // indigo
  ];

  // Simple hash function to get consistent color for department
  let hash = 0;
  for (let i = 0; i < departmentName.length; i++) {
    hash = departmentName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getPriorityColor(priority: TaskPriority): {
  background: string;
  text: string;
} {
  switch (priority) {
    case 'LOW':
      return { background: '#DBEAFE', text: '#1E40AF' }; // blue
    case 'MEDIUM':
      return { background: '#FEF3C7', text: '#92400E' }; // yellow
    case 'HIGH':
      return { background: '#FED7AA', text: '#9A3412' }; // orange
    case 'URGENT':
      return { background: '#FEE2E2', text: '#991B1B' }; // red
    default:
      return { background: '#F3F4F6', text: '#374151' }; // gray
  }
}

export function getStatusColor(status: TaskStatus): {
  background: string;
  text: string;
} {
  switch (status) {
    case 'TODO':
      return { background: '#F3F4F6', text: '#374151' }; // gray
    case 'IN_PROGRESS':
      return { background: '#DBEAFE', text: '#1E40AF' }; // blue
    case 'DONE':
      return { background: '#D1FAE5', text: '#065F46' }; // green
    case 'BLOCKED':
      return { background: '#FEE2E2', text: '#991B1B' }; // red
    default:
      return { background: '#F3F4F6', text: '#374151' }; // gray
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(target);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function getFileIcon(filename: string): string {
  const ext = getFileExtension(filename);
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const documentExts = ['pdf', 'doc', 'docx', 'txt'];
  const spreadsheetExts = ['xls', 'xlsx', 'csv'];
  const videoExts = ['mp4', 'mov', 'avi', 'mkv'];

  if (imageExts.includes(ext)) return '🖼️';
  if (documentExts.includes(ext)) return '📄';
  if (spreadsheetExts.includes(ext)) return '📊';
  if (videoExts.includes(ext)) return '🎥';
  return '📎';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
