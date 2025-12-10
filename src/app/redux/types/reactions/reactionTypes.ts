import { Post } from "../posts/postTypes";
import { User } from "../users/userTypes";

// Enums
export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  HAHA = 'haha',
  WOW = 'wow',
  SAD = 'sad',
  ANGRY = 'angry',
}

export enum ReactableType {
  POST = 'post',
  COMMENT = 'comment',
  // Add other reactable types as needed
}

// Main Entity
export interface Reaction {
  id: string;
  user_id: string;
  reactable_type: string;
  reactable_id: string;
  type: ReactionType;
  created_at: Date | string;
  user?: User;
  post?: Post;
}

// DTOs
export interface CreateReactionDto {
  user_id: string;
  reactable_type: string;
  reactable_id: string;
  type?: ReactionType;
}

export interface UpdateReactionDto {
  user_id?: string;
  reactable_type?: string;
  reactable_id?: string;
  type?: ReactionType;
}

// API Response Types
export interface ReactionsApiResponse {
  data: Reaction[];
  message?: string;
  statusCode?: number;
}

export interface ReactionApiResponse {
  data: Reaction;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface ReactionCount {
  type: ReactionType;
  count: number;
}

export interface ReactionSummary {
  total: number;
  byType: Record<ReactionType, number>;
  hasUserReacted: boolean;
  userReaction?: Reaction;
}

export interface ReactionGroup {
  type: ReactionType;
  reactions: Reaction[];
  count: number;
}