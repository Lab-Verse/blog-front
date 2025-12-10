import { Category } from "../categories/categoryTypes";
import { User } from "../users/userTypes";

// Enums
export enum QuestionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

// Main Entity
export interface Question {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  status: QuestionStatus;
  views_count: number;
  answers_count: number;
  created_at: Date | string;
  updated_at: Date | string;
  user?: User;
  category?: Category;
}

// DTOs
export interface CreateQuestionDto {
  user_id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  status?: QuestionStatus;
}

export interface UpdateQuestionDto {
  user_id?: string;
  title?: string;
  slug?: string;
  content?: string;
  category_id?: string;
  status?: QuestionStatus;
}

// API Response Types
export interface QuestionsApiResponse {
  data: Question[];
  message?: string;
  statusCode?: number;
}

export interface QuestionApiResponse {
  data: Question;
  message?: string;
  statusCode?: number;
}

// Query Filters
export interface QuestionFilters {
  categoryId?: string;
  userId?: string;
  status?: QuestionStatus;
  hasAnswers?: boolean;
  isUnanswered?: boolean;
}

// Helper Types
export interface QuestionWithDetails extends Question {
  wordCount: number;
  hasAcceptedAnswer: boolean;
  isUnanswered: boolean;
}

export interface QuestionGroup {
  status: QuestionStatus;
  questions: Question[];
  count: number;
}

export interface QuestionStats {
  total: number;
  open: number;
  closed: number;
  archived: number;
  answered: number;
  unanswered: number;
  totalViews: number;
  totalAnswers: number;
  averageAnswers: number;
}