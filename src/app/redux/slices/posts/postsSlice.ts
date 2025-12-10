import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Post, PostFilters } from '../../types/posts/postTypes';

interface PostsState {
  selectedPost: Post | null;
  filters: PostFilters;
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'popular' | 'title';
  isCreating: boolean;
  isEditing: boolean;
}

const initialState: PostsState = {
  selectedPost: null,
  filters: {},
  viewMode: 'grid',
  sortBy: 'recent',
  isCreating: false,
  isEditing: false,
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
  resetPostsState,
} = postsSlice.actions;

export default postsSlice.reducer;