import { User } from "../users/userTypes";

// Enums
export enum NotificationType {
  COMMENT = "comment",
  LIKE = "like",
  FOLLOW = "follow",
  MENTION = "mention",
  POST = "post",
  REPLY = "reply",
  SYSTEM = "system",
  WARNING = "warning",
  SUCCESS = "success",
  INFO = "info",
  ERROR = "error",
}

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Main Entity
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
  user?: User;
}

// DTOs
export interface CreateNotificationDto {
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read?: boolean;
  userEmail?: string;
}

export interface UpdateNotificationDto {
  user_id?: string;
  type?: string;
  title?: string;
  message?: string;
  is_read?: boolean;
  userEmail?: string;
}

// API Response Types
export interface NotificationsApiResponse {
  data: Notification[];
  message?: string;
  statusCode?: number;
}

export interface NotificationApiResponse {
  data: Notification;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface NotificationGroup {
  type: string;
  notifications: Notification[];
  count: number;
  unreadCount: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
  today: number;
  thisWeek: number;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: Record<NotificationType, boolean>;
}
