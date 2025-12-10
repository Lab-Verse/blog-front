import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  Media, 
  MediaFilter,
  MediaUploadProgress 
} from '../../types/media/mediaTypes';

interface MediaState {
  selectedMedia: Media | null;
  selectedMediaIds: string[];
  isUploading: boolean;
  isDeleting: boolean;
  uploadProgress: Record<string, MediaUploadProgress>;
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'oldest' | 'name' | 'size';
  filters: MediaFilter;
  searchQuery: string;
  previewMedia: Media | null;
  isPreviewOpen: boolean;
}

const initialState: MediaState = {
  selectedMedia: null,
  selectedMediaIds: [],
  isUploading: false,
  isDeleting: false,
  uploadProgress: {},
  viewMode: 'grid',
  sortBy: 'recent',
  filters: {},
  searchQuery: '',
  previewMedia: null,
  isPreviewOpen: false,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSelectedMedia: (state, action: PayloadAction<Media | null>) => {
      state.selectedMedia = action.payload;
    },

    addSelectedMediaId: (state, action: PayloadAction<string>) => {
      if (!state.selectedMediaIds.includes(action.payload)) {
        state.selectedMediaIds.push(action.payload);
      }
    },

    removeSelectedMediaId: (state, action: PayloadAction<string>) => {
      state.selectedMediaIds = state.selectedMediaIds.filter(
        id => id !== action.payload
      );
    },

    setSelectedMediaIds: (state, action: PayloadAction<string[]>) => {
      state.selectedMediaIds = action.payload;
    },

    toggleMediaSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedMediaIds.indexOf(action.payload);
      if (index > -1) {
        state.selectedMediaIds.splice(index, 1);
      } else {
        state.selectedMediaIds.push(action.payload);
      }
    },

    clearSelectedMedia: (state) => {
      state.selectedMediaIds = [];
      state.selectedMedia = null;
    },

    selectAllMedia: (state, action: PayloadAction<string[]>) => {
      state.selectedMediaIds = action.payload;
    },

    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },

    setIsDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },

    setUploadProgress: (
      state,
      action: PayloadAction<MediaUploadProgress>
    ) => {
      state.uploadProgress[action.payload.mediaId] = action.payload;
    },

    updateUploadProgress: (
      state,
      action: PayloadAction<{ mediaId: string; progress: number }>
    ) => {
      const existing = state.uploadProgress[action.payload.mediaId];
      if (existing) {
        existing.progress = action.payload.progress;
      }
    },

    setUploadStatus: (
      state,
      action: PayloadAction<{
        mediaId: string;
        status: MediaUploadProgress['status'];
        error?: string;
      }>
    ) => {
      const existing = state.uploadProgress[action.payload.mediaId];
      if (existing) {
        existing.status = action.payload.status;
        if (action.payload.error) {
          existing.error = action.payload.error;
        }
      }
    },

    removeUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },

    clearUploadProgress: (state) => {
      state.uploadProgress = {};
    },

    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<'recent' | 'oldest' | 'name' | 'size'>
    ) => {
      state.sortBy = action.payload;
    },

    setFilters: (state, action: PayloadAction<MediaFilter>) => {
      state.filters = action.payload;
    },

    updateFilters: (state, action: PayloadAction<Partial<MediaFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setPreviewMedia: (state, action: PayloadAction<Media | null>) => {
      state.previewMedia = action.payload;
      state.isPreviewOpen = action.payload !== null;
    },

    openPreview: (state, action: PayloadAction<Media>) => {
      state.previewMedia = action.payload;
      state.isPreviewOpen = true;
    },

    closePreview: (state) => {
      state.previewMedia = null;
      state.isPreviewOpen = false;
    },

    resetMediaState: () => initialState,
  },
});

export const {
  setSelectedMedia,
  addSelectedMediaId,
  removeSelectedMediaId,
  setSelectedMediaIds,
  toggleMediaSelection,
  clearSelectedMedia,
  selectAllMedia,
  setIsUploading,
  setIsDeleting,
  setUploadProgress,
  updateUploadProgress,
  setUploadStatus,
  removeUploadProgress,
  clearUploadProgress,
  setViewMode,
  setSortBy,
  setFilters,
  updateFilters,
  clearFilters,
  setSearchQuery,
  clearSearchQuery,
  setPreviewMedia,
  openPreview,
  closePreview,
  resetMediaState,
} = mediaSlice.actions;

export default mediaSlice.reducer;