import { User } from "../users/userTypes";

// Main Entity
export interface CommentReply {
  id: string;
  comment_id: string;
  user_id: string;
  content: string;
  created_at: Date | string;
  updated_at: Date | string;
  comment?: Comment;
  user?: User;
}

// Related Entities (minimal definitions)
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date | string;
  updated_at: Date | string;
  // Add other comment fields
}

// DTOs
export interface CreateCommentReplyDto {
  comment_id: string;
  user_id: string;
  content: string;
}

export interface UpdateCommentReplyDto {
  comment_id?: string;
  user_id?: string;
  content?: string;
}

// API Response Types
export interface CommentRepliesApiResponse {
  data: CommentReply[];
  message?: string;
  statusCode?: number;
}

export interface CommentReplyApiResponse {
  data: CommentReply;
  message?: string;
  statusCode?: number;
}