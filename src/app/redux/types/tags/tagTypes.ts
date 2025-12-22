import { Post } from "../posts/postTypes";

// Main Entity
export interface Tag {
  id: string;
  name: string;
  slug: string;
  posts_count: number;
  created_at: Date | string;
  updated_at: Date | string;
}

// DTOs
export interface CreateTagDto {
  name: string;
  slug: string;
}

export interface UpdateTagDto {
  name?: string;
  slug?: string;
}

// API Response Types
export interface TagsApiResponse {
  data: Tag[];
  message?: string;
  statusCode?: number;
}

export interface TagApiResponse {
  data: Tag;
  message?: string;
  statusCode?: number;
}

export interface TagPostsApiResponse {
  data: Post[];
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface TagWithPosts extends Tag {
  posts?: Post[];
}

export interface TagCloud {
  tag: Tag;
  size: number;
  weight: number;
}

export interface PopularTag {
  tag: Tag;
  rank: number;
}

// Filters
export interface TagFilters {
  search?: string;
  minPostCount?: number;
  sortBy?: 'name' | 'posts_count' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}