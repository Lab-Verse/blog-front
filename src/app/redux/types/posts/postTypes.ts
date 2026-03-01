import { Category } from "../categories/categoryTypes";
import { Reaction } from "../reactions/reactionTypes";
import { User } from "../users/userTypes";

// Enums
export enum PostStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

// Comment Entity
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count?: number;
  created_at: Date | string;
  updated_at: Date | string;
  user?: User;
  replies_count?: number;
}

// Main Entities
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  user_id: string;
  category_id: string;
  status: PostStatus;
  featured_image?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  published_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  user?: User;
  category?: Category;
  comments?: Comment[];
  media?: PostMedia[];
  tags?: PostTag[];
  reactions?: Reaction[];
}


export interface PostMedia {
  id: string;
  post_id: string;
  media_url: string;
  media_type: string;
  created_at: Date | string;
  // Add other media fields
}

export interface PostTag {
  id: string;
  post_id: string;
  tag_id: string;
  created_at: Date | string;
  // Add other tag fields
}

// DTOs
export interface CreatePostDto {
  title: string;
  slug: string;
  content: string;
  user_id: string;
  category_id: string;
  status?: PostStatus;
  featured_image?: string;
  published_at?: string;
  excerpt?: string;
  description?: string;
  tag_ids?: string[];
  category_ids?: string[];
  media_ids?: string[];
}

export interface UpdatePostDto {
  title?: string;
  slug?: string;
  content?: string;
  user_id?: string;
  category_id?: string;
  status?: PostStatus;
  featured_image?: string;
  published_at?: string;
}

// Query Filters
export interface PostFilters {
  categoryId?: string;
  userId?: string;
}

// Dashboard Filters
export interface UserPostsFilters {
  userId?: string;
  status?: PostStatus;
  categoryId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'recent' | 'popular' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Bulk Operations
export interface BulkPostDto {
  ids: string[];
  action: 'delete' | 'publish' | 'unpublish' | 'archive';
  status?: PostStatus;
}

// Dashboard Stats
export interface PostStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  publishedPosts: number;
  draftPosts: number;
  archivedPosts: number;
  avgViewsPerPost: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
}

// API Response Types
export interface PostsApiResponse {
  data: Post[];
  message?: string;
  statusCode?: number;
}

export interface PostApiResponse {
  data: Post;
  message?: string;
  statusCode?: number;
}

export interface PostCommentsApiResponse {
  data: Comment[];
  message?: string;
  statusCode?: number;
}

export interface PostMediaApiResponse {
  data: PostMedia[];
  message?: string;
  statusCode?: number;
}

export interface PostTagsApiResponse {
  data: PostTag[];
  message?: string;
  statusCode?: number;
}

export interface PostReactionsApiResponse {
  data: Reaction[];
  message?: string;
  statusCode?: number;
}
