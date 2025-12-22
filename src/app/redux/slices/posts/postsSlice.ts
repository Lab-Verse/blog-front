import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post, PostFilters } from '../../types/posts/postTypes';

interface PostsState {
  selectedPost: Post | null;
  selectedPosts: string[]; // For bulk selection
  filters: PostFilters;
  dashboardFilters: import('../../types/posts/postTypes').UserPostsFilters; // Dashboard-specific filters
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'popular' | 'title';
  isCreating: boolean;
  isEditing: boolean;
  bulkActionInProgress: boolean; // For bulk operations loading state
}

const initialState: PostsState = {
  selectedPost: null,
  selectedPosts: [],
  filters: {},
  dashboardFilters: {},
  viewMode: 'grid',
  sortBy: 'recent',
  isCreating: false,
  isEditing: false,
  bulkActionInProgress: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },

    setFilters: (state, action: PayloadAction<PostFilters>) => {
      state.filters = action.payload;
    },

    clearFilters: (state) => {
      state.filters = {};
    },

    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },

    setSortBy: (state, action: PayloadAction<'recent' | 'popular' | 'title'>) => {
      state.sortBy = action.payload;
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    // Bulk Selection Actions
    togglePostSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedPosts.indexOf(action.payload);
      if (index > -1) {
        state.selectedPosts.splice(index, 1);
      } else {
        state.selectedPosts.push(action.payload);
      }
    },

    selectAllPosts: (state, action: PayloadAction<string[]>) => {
      state.selectedPosts = action.payload;
    },

    clearSelection: (state) => {
      state.selectedPosts = [];
    },

    // Dashboard Filters
    setDashboardFilters: (state, action: PayloadAction<import('../../types/posts/postTypes').UserPostsFilters>) => {
      state.dashboardFilters = action.payload;
    },

    updateDashboardFilters: (state, action: PayloadAction<Partial<import('../../types/posts/postTypes').UserPostsFilters>>) => {
      state.dashboardFilters = { ...state.dashboardFilters, ...action.payload };
    },

    clearDashboardFilters: (state) => {
      state.dashboardFilters = {};
    },

    // Bulk Action State
    setBulkActionInProgress: (state, action: PayloadAction<boolean>) => {
      state.bulkActionInProgress = action.payload;
    },

    resetPostsState: () => initialState,
  },
});

export const {
  setSelectedPost,
  setFilters,
  clearFilters,
  setViewMode,
  setSortBy,
  setIsCreating,
  setIsEditing,
  togglePostSelection,
  selectAllPosts,
  clearSelection,
  setDashboardFilters,
  updateDashboardFilters,
  clearDashboardFilters,
  setBulkActionInProgress,
  resetPostsState,
} = postsSlice.actions;

export default postsSlice.reducer;