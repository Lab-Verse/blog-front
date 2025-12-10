import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tag } from '../../types/tags/tagTypes';

interface TagsState {
  selectedTag: Tag | null;
  selectedTags: Tag[];
  isCreating: boolean;
  isEditing: boolean;
  editingTagId: string | null;
  searchQuery: string;
  sortBy: 'name' | 'popular' | 'recent';
  viewMode: 'grid' | 'list' | 'cloud';
  filterByPostsCount: {
    min: number;
    max: number | null;
  } | null;
}

const initialState: TagsState = {
  selectedTag: null,
  selectedTags: [],
  isCreating: false,
  isEditing: false,
  editingTagId: null,
  searchQuery: '',
  sortBy: 'popular',
  viewMode: 'cloud',
  filterByPostsCount: null,
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setSelectedTag: (state, action: PayloadAction<Tag | null>) => {
      state.selectedTag = action.payload;
    },

    addSelectedTag: (state, action: PayloadAction<Tag>) => {
      const exists = state.selectedTags.some(tag => tag.id === action.payload.id);
      if (!exists) {
        state.selectedTags.push(action.payload);
      }
    },

    removeSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTags = state.selectedTags.filter(
        tag => tag.id !== action.payload
      );
    },

    setSelectedTags: (state, action: PayloadAction<Tag[]>) => {
      state.selectedTags = action.payload;
    },

    clearSelectedTags: (state) => {
      state.selectedTags = [];
    },

    toggleTagSelection: (state, action: PayloadAction<Tag>) => {
      const index = state.selectedTags.findIndex(
        tag => tag.id === action.payload.id
      );
      if (index > -1) {
        state.selectedTags.splice(index, 1);
      } else {
        state.selectedTags.push(action.payload);
      }
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setEditingTagId: (state, action: PayloadAction<string | null>) => {
      state.editingTagId = action.payload;
      state.isEditing = action.payload !== null;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setSortBy: (state, action: PayloadAction<'name' | 'popular' | 'recent'>) => {
      state.sortBy = action.payload;
    },

    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'cloud'>) => {
      state.viewMode = action.payload;
    },

    setFilterByPostsCount: (
      state,
      action: PayloadAction<{ min: number; max: number | null } | null>
    ) => {
      state.filterByPostsCount = action.payload;
    },

    clearFilter: (state) => {
      state.filterByPostsCount = null;
    },

    resetTagsState: () => initialState,
  },
});

export const {
  setSelectedTag,
  addSelectedTag,
  removeSelectedTag,
  setSelectedTags,
  clearSelectedTags,
  toggleTagSelection,
  setIsCreating,
  setIsEditing,
  setEditingTagId,
  setSearchQuery,
  clearSearchQuery,
  setSortBy,
  setViewMode,
  setFilterByPostsCount,
  clearFilter,
  resetTagsState,
} = tagsSlice.actions;

export default tagsSlice.reducer;