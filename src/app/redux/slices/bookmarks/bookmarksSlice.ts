import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Bookmark } from '../../types/bookmarks/bookmarkTypes';

interface BookmarksState {
  selectedBookmark: Bookmark | null;
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'oldest' | 'title';
  isCreating: boolean;
  searchQuery: string;
  selectedPostId: string | null;
}

const initialState: BookmarksState = {
  selectedBookmark: null,
  viewMode: 'grid',
  sortBy: 'recent',
  isCreating: false,
  searchQuery: '',
  selectedPostId: null,
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    setSelectedBookmark: (state, action: PayloadAction<Bookmark | null>) => {
      state.selectedBookmark = action.payload;
    },

    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },

    setSortBy: (state, action: PayloadAction<'recent' | 'oldest' | 'title'>) => {
      state.sortBy = action.payload;
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setSelectedPostId: (state, action: PayloadAction<string | null>) => {
      state.selectedPostId = action.payload;
    },

    resetBookmarksState: () => initialState,
  },
});

export const {
  setSelectedBookmark,
  setViewMode,
  setSortBy,
  setIsCreating,
  setSearchQuery,
  clearSearchQuery,
  setSelectedPostId,
  resetBookmarksState,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;