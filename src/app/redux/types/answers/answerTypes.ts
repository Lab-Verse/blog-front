import { Question } from "../questions/questionTypes";

// Main Entity
export interface Answer {
  id: string;
  question_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  votes_count: number;
  created_at: Date | string;
  updated_at: Date | string;
  question?: Question;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  // Add other user fields
}

// DTOs
export interface CreateAnswerDto {
  question_id: string;
  user_id: string;
  content: string;
  is_accepted?: boolean;
}

export interface UpdateAnswerDto {
  question_id?: string;
  user_id?: string;
  content?: string;
  is_accepted?: boolean;
}

// API Response Types
export interface AnswersApiResponse {
  data: Answer[];
  message?: string;
  statusCode?: number;
}

export interface AnswerApiResponse {
  data: Answer;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface AnswerWithDetails extends Answer {
  wordCount: number;
  characterCount: number;
  hasVotes: boolean;
  isTopAnswer: boolean;
}

export interface AnswerGroup {
  questionId: string;
  question?: Question;
  answers: Answer[];
  count: number;
  acceptedAnswer?: Answer;
  topAnswer?: Answer;
}

export interface AnswerStats {
  total: number;
  accepted: number;
  notAccepted: number;
  totalVotes: number;
  averageVotes: number;
  withVotes: number;
  withoutVotes: number;
}

export interface VoteAction {
  answerId: string;
  voteType: 'upvote' | 'downvote';
}