// Types for User Module

import { Bookmark } from "../bookmarks/bookmarkTypes";
import { FollowingGroup as Following } from "../authorfollowers/authorfollowersTypes";
import { Follower } from "../categories/categoryTypes";
import { Draft } from "../drafts/draftTypes";
import { Notification } from "../notifications/notificationTypes";
import { Post } from "../posts/postTypes";

export type { FollowingGroup as Following } from "../authorfollowers/authorfollowersTypes";
export type { Bookmark } from "../bookmarks/bookmarkTypes";
export type { Follower } from "../categories/categoryTypes";
export type { Draft } from "../drafts/draftTypes";
export type { Notification } from "../notifications/notificationTypes";
export type { Post } from "../posts/postTypes";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

export enum Role {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  role_id?: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
  profile_picture?: string;
  phone?: string;
  location?: string;
  website_url?: string;
  company?: string;
  job_title?: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}



// Request DTOs
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
  role_id?: string;
  status?: UserStatus;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  role_id?: string;
  status?: UserStatus;
}

export interface CreateUserProfileDto {
  user_id?: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
  profile_picture?: string;
  phone?: string;
  location?: string;
  website_url?: string;
  company?: string;
  job_title?: string;
}

export interface UpdateUserProfileDto {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  website_url?: string;
  company?: string;
  job_title?: string;
}

// State Types
export interface UserState {
  users: User[];
  selectedUser: User | null;
  userProfile: UserProfile | null;
  userPosts: Post[];
  userDrafts: Draft[];
  userBookmarks: Bookmark[];
  userFollowers: Follower[];
  userFollowing: Following | null;
  userNotifications: Notification[];
  loading: boolean;
  error: string | null;
  uploadingProfilePicture: boolean;
}
