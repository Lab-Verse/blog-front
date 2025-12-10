import { Post } from "../posts/postTypes";

// Main Entity
export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  posts_count: number;
  followers_count: number;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  parent?: Category;
  children?: Category[];
}

// DTOs
export interface CreateCategoryDto {
  name: string;
  slug: string;
  parent_id?: string;
  is_active?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  parent_id?: string;
  is_active?: boolean;
}

// API Response Types
export interface CategoriesApiResponse {
  data: Category[];
  message?: string;
  statusCode?: number;
}

export interface CategoryApiResponse {
  data: Category;
  message?: string;
  statusCode?: number;
}

export interface CategoryPostsApiResponse {
  data: Post[];
  message?: string;
  statusCode?: number;
}

export interface CategoryFollowersApiResponse {
  data: Follower[];
  message?: string;
  statusCode?: number;
}

export interface Follower {
  id: string;
  user_id: string;
  category_id: string;
  created_at: Date | string;
  // Add other follower fields
}

// Helper Types
export interface CategoryWithChildren extends Category {
  children: Category[];
}

export interface CategoryHierarchy {
  category: Category;
  level: number;
  path: string[];
}

export interface CategoryTree {
  category: Category;
  children: CategoryTree[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  slug: string;
}