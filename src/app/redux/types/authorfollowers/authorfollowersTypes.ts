import { User } from "../users/userTypes";

// Main Entity
export interface AuthorFollower {
  id: string;
  follower_id: string;
  author_id: string;
  created_at: Date | string;
  follower?: User;
  author?: User;
}

// DTOs
export interface CreateAuthorFollowerDto {
  follower_id: string;
  author_id: string;
}

// API Response Types
export interface AuthorFollowersApiResponse {
  data: AuthorFollower[];
  message?: string;
  statusCode?: number;
}

export interface AuthorFollowerApiResponse {
  data: AuthorFollower;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface FollowersGroup {
  authorId: string;
  author?: User;
  followers: AuthorFollower[];
  count: number;
}

export interface FollowingGroup {
  userId: string;
  user?: User;
  following: AuthorFollower[];
  count: number;
}

export interface FollowStats {
  totalFollowers: number;
  totalFollowing: number;
  mutualFollows: number;
  recentFollowers: AuthorFollower[];
  topAuthors: User[];
}

export interface FollowSuggestion {
  user: User;
  mutualFollowers: number;
  score: number;
}