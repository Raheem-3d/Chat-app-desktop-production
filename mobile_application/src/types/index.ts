// Core type definitions for the mobile application
// These types mirror the Prisma schema from the Next.js backend

export type Role = 
  | 'SUPER_ADMIN'
  | 'ORG_ADMIN'
  | 'MANAGER'
  | 'EMPLOYEE'
  | 'ORG_MEMBER'
  | 'CLIENT';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

export type NotificationType =
  | 'TASK_ASSIGNED'
  | 'TASK_UPDATED'
  | 'TASK_COMMENT'
  | 'CHANNEL_INVITE'
  | 'DIRECT_MESSAGE'
  | 'CHANNEL_MESSAGE'
  | 'REMINDER'
  | 'ANNOUNCEMENT';

export type ReminderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type ReminderType =
  | 'GENERAL'
  | 'TASK_DEADLINE'
  | 'MEETING'
  | 'FOLLOW_UP'
  | 'PERSONAL';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELED';

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  isSuperAdmin: boolean;
  organizationId: string | null;
  departmentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  industry: string | null;
  employeesCount: number | null;
  primaryEmail: string;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  themeColor: string | null;
  trialStart: Date;
  trialEnd: Date;
  trialStatus: string;
  suspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  isDepartment: boolean;
  isTaskThread: boolean;
  organizationId: string | null;
  taskId: string | null;
  taskReferenceId: string | null;
  creatorId: string;
  type: string | null;
  departmentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  department?: Department | null;
  organization?: Pick<Organization, 'id' | 'name'> | null;
  _count?: {
    messages: number;
  };
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string | null;
  channelId: string | null;
  organizationId: string | null;
  isPinned: boolean;
  attachments: Attachment[] | null;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  seenBy: any;
  reactions: Reaction[];
  createdAt: Date;
  updatedAt: Date;
  pinnedMessageId: string | null;
  sender?: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  receiver?: Pick<User, 'id' | 'name' | 'email' | 'image'> | null;
  pinnedMessage?: {
    id: string;
    content: string;
    sender: Pick<User, 'name'>;
  } | null;
  clientId?: string | null;
}

export interface Attachment {
  fileUrl: string;
  fileName: string | null;
  fileType: string | null;
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: Date | null;
  organizationId: string | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  organization?: Pick<Organization, 'id' | 'name'> | null;
  assignments?: TaskAssignment[];
  comments?: TaskComment[];
  channel?: Pick<Channel, 'id' | 'name'> | null;
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: Pick<User, 'id' | 'name' | 'email' | 'image'>;
  recordId?: string | null;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: Pick<User, 'id' | 'name' | 'email' | 'image'>;
}

export interface Notification {
  id: string;
  type: NotificationType;
  messageId: string | null;
  channelId: string | null;
  taskId: string | null;
  reminderId: string | null;
  announcementId: string | null;
  organizationId: string | null;
  content: string;
  read: boolean;
  userId: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description: string | null;
  remindAt: Date;
  isMuted: boolean;
  isSent: boolean;
  isAutomatic: boolean;
  priority: ReminderPriority;
  type: ReminderType;
  creatorId: string;
  assigneeId: string;
  taskId: string | null;
  createdAt: Date;
  updatedAt: Date;
  sentAt: Date | null;
}

export interface Subscription {
  id: string;
  organizationId: string;
  status: SubscriptionStatus;
  trialStart: Date;
  trialEnd: Date;
  trialUsed: boolean;
  currentPeriodEnd: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  organization?: Organization | null;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  organizationName?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  deadline?: string;
  assignees?: string[];
  clientEmails?: {
    email: string;
    role: string;
    access: string;
  }[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  deadline?: string;
}

export interface CreateChannelRequest {
  name: string;
  description?: string;
  isPublic: boolean;
  departmentId?: string | null;
  members?: string[];
}

export interface SendMessageRequest {
  content: string;
  channelId?: string;
  receiverId?: string;
  files?: Attachment[];
  pinnedMessageId?: string;
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  remindAt: string;
  priority: ReminderPriority;
  type: ReminderType;
  assigneeId: string;
  taskId?: string;
}

export interface UploadResponse {
  url: string;
  public_id?: string;
  format?: string;
  resource_type?: string;
}

// Utility Types

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface UserSession {
  token: string;
  user: User;
  expiresAt: Date;
}

// Navigation Types

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  TaskDetail: { taskId: string };
  TaskRecords: { taskId: string };
  CreateTask: undefined;
  ChannelChat: { channelId: string; channelName: string };
  DirectMessage: { userId: string; userName: string };
  Notifications: undefined;
  Settings: undefined;
  Profile: undefined;
  Reminders: undefined;
  CreateReminder: { taskId?: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Channels: undefined;
  People: undefined;
  More: undefined;
};
