import { Category } from "../categories/categoryTypes";
import { User } from "../users/userTypes";

// Main Entity
export interface Draft {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  category_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  user?: User;
  category?: Category;
}

// DTOs
export interface CreateDraftDto {
  user_id: string;
  title?: string;
  content?: string;
  category_id?: string;
}

export interface UpdateDraftDto {
  user_id?: string;
  title?: string;
  content?: string;
  category_id?: string;
}

// API Response Types
export interface DraftsApiResponse {
  data: Draft[];
  message?: string;
  statusCode?: number;
}

export interface DraftApiResponse {
  data: Draft;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface DraftWithDetails extends Draft {
  wordCount: number;
  characterCount: number;
  isEmpty: boolean;
  hasTitle: boolean;
  hasContent: boolean;
  hasCategory: boolean;
}

export interface DraftAutoSave {
  draftId: string;
  lastSaved: Date | string;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

export interface DraftGroup {
  category: Category | null;
  drafts: Draft[];
  count: number;
}

export interface DraftStats {
  total: number;
  withTitle: number;
  withContent: number;
  withCategory: number;
  empty: number;
  averageWordCount: number;
}