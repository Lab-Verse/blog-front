import { User } from "../users/userTypes";

// Enums
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other',
}

export enum ImageMimeType {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',
  SVG = 'image/svg+xml',
}

export enum VideoMimeType {
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  OGG = 'video/ogg',
}

export enum AudioMimeType {
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',
}

export enum DocumentMimeType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

// Main Entity
export interface Media {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  created_at: Date | string;
  updated_at: Date | string;
  user?: User;
}

// DTOs
export interface CreateMediaDto {
  user_id: string;
  filename: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  }

export interface UpdateMediaDto {
  user_id?: string;
  filename?: string;
  file_path?: string;
  file_url?: string;
  mime_type?: string;
  file_size?: number;
}

// API Response Types
export interface MediaListApiResponse {
  data: Media[];
  message?: string;
  statusCode?: number;
}

export interface MediaApiResponse {
  data: Media;
  message?: string;
  statusCode?: number;
}

// Helper Types
export interface MediaWithPreview extends Media {
  preview?: string;
  thumbnail?: string;
}

export interface MediaUploadProgress {
  mediaId: string;
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

export interface MediaFilter {
  mediaType?: MediaType;
  mimeType?: string;
  minSize?: number;
  maxSize?: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface MediaGroup {
  type: MediaType;
  media: Media[];
  count: number;
  totalSize: number;
}

export interface MediaStats {
  total: number;
  totalSize: number;
  byType: Record<MediaType, number>;
  byUser: Record<string, number>;
}