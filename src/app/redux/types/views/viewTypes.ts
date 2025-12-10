import { User } from "../users/userTypes";

// Enums
export enum ViewableType {
  POST = 'post',
  QUESTION = 'question',
  ANSWER = 'answer',
  DRAFT = 'draft',
  MEDIA = 'media',
}

// Main Entity
export interface View {
  id: string;
  user_id: string | null;
  viewable_type: string;
  viewable_id: string;
  ip_address: string;
  created_at: Date | string;
  user?: User;
}

// DTOs
export interface CreateViewDto {
  user_id?: string;
  viewable_type: string;
  viewable_id: string;
  ip_address: string;
}

// API Response Types
export interface ViewsApiResponse {
  data: View[];
  message?: string;
  statusCode?: number;
}

export interface ViewApiResponse {
  data: View;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface ViewGroup {
  viewableId: string;
  viewableType: string;
  views: View[];
  count: number;
  uniqueUsers: number;
  uniqueIPs: number;
}

export interface ViewStats {
  total: number;
  authenticated: number;
  anonymous: number;
  uniqueUsers: number;
  uniqueIPs: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  byType: Record<string, number>;
}

export interface ViewTimeline {
  date: string;
  count: number;
  uniqueVisitors: number;
}

export interface ViewAnalytics {
  totalViews: number;
  uniqueVisitors: number;
  averageViewsPerDay: number;
  peakViewDate: string;
  peakViewCount: number;
  viewsByHour: Record<number, number>;
  viewsByDay: Record<string, number>;
  topViewers: User[];
  recentViews: View[];
}

export interface ViewTrackingConfig {
  debounceTime: number; // milliseconds
  trackAnonymous: boolean;
  excludeOwnViews: boolean;
}