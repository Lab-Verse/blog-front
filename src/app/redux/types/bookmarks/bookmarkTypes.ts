import { Post } from "../posts/postTypes";
import { User } from "../users/userTypes";

// Main Entity
export interface Bookmark {
  id: string;
  user_id: string;
  post_id: string;
  created_at: Date | string;
  user?: User;
  post?: Post;
}



// DTOs
export interface CreateBookmarkDto {
  user_id: string;
  post_id: string;
}

// API Response Types
export interface BookmarksApiResponse {
  data: Bookmark[];
  message?: string;
  statusCode?: number;
}

export interface BookmarkApiResponse {
  data: Bookmark;
  message?: string;
  statusCode?: number;
}

// UI Helper Types
export interface BookmarkWithPost extends Bookmark {
  post: Post;
}

export interface BookmarkGroupByDate {
  date: string;
  bookmarks: Bookmark[];
}