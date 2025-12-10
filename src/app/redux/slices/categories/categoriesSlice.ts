import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Category } from '../../types/categories/categoryTypes';

interface CategoriesState {
  selectedCategory: Category | null;
  selectedCategories: Category[];
  isCreating: boolean;
  isEditing: boolean;
  editingCategoryId: string | null;
  searchQuery: string;
  sortBy: 'name' | 'popular' | 'recent' | 'posts';
  viewMode: 'grid' | 'list' | 'tree';
  showInactive: boolean;
  filterByParent: string | null;
  expandedCategories: string[];
}

const initialState: CategoriesState = {
  selectedCategory: null,
  selectedCategories: [],
  isCreating: false,
  isEditing: false,
  editingCategoryId: null,
  searchQuery: '',
  sortBy: 'name',
  viewMode: 'list',
  showInactive: false,
  filterByParent: null,
  expandedCategories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },

    addSelectedCategory: (state, action: PayloadAction<Category>) => {
      const exists = state.selectedCategories.some(
        cat => cat.id === action.payload.id
      );
      if (!exists) {
        state.selectedCategories.push(action.payload);
      }
    },

    removeSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategories = state.selectedCategories.filter(
        cat => cat.id !== action.payload
      );
    },

    setSelectedCategories: (state, action: PayloadAction<Category[]>) => {
      state.selectedCategories = action.payload;
    },

    clearSelectedCategories: (state) => {
      state.selectedCategories = [];
    },

    toggleCategorySelection: (state, action: PayloadAction<Category>) => {
      const index = state.selectedCategories.findIndex(
        cat => cat.id === action.payload.id
      );
      if (index > -1) {
        state.selectedCategories.splice(index, 1);
      } else {
        state.selectedCategories.push(action.payload);
      }
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setEditingCategoryId: (state, action: PayloadAction<string | null>) => {
      state.editingCategoryId = action.payload;
      state.isEditing = action.payload !== null;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setSortBy: (
      state,
      action: PayloadAction<'name' | 'popular' | 'recent' | 'posts'>
    ) => {
      state.sortBy = action.payload;
    },

    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'tree'>) => {
      state.viewMode = action.payload;
    },

    setShowInactive: (state, action: PayloadAction<boolean>) => {
      state.showInactive = action.payload;
    },

    toggleShowInactive: (state) => {
      state.showInactive = !state.showInactive;
    },

    setFilterByParent: (state, action: PayloadAction<string | null>) => {
      state.filterByParent = action.payload;
    },

    clearFilter: (state) => {
      state.filterByParent = null;
    },

    toggleCategoryExpanded: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const index = state.expandedCategories.indexOf(categoryId);
      
      if (index > -1) {
        state.expandedCategories.splice(index, 1);
      } else {
        state.expandedCategories.push(categoryId);
      }
    },

    expandCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      if (!state.expandedCategories.includes(categoryId)) {
        state.expandedCategories.push(categoryId);
      }
    },

    collapseCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      state.expandedCategories = state.expandedCategories.filter(
        id => id !== categoryId
      );
    },

    expandAllCategories: (state, action: PayloadAction<string[]>) => {
      state.expandedCategories = action.payload;
    },

    collapseAllCategories: (state) => {
      state.expandedCategories = [];
    },

    resetCategoriesState: () => initialState,
  },
});

export const {
  setSelectedCategory,
  addSelectedCategory,
  removeSelectedCategory,
  setSelectedCategories,
  clearSelectedCategories,
  toggleCategorySelection,
  setIsCreating,
  setIsEditing,
  setEditingCategoryId,
  setSearchQuery,
  clearSearchQuery,
  setSortBy,
  setViewMode,
  setShowInactive,
  toggleShowInactive,
  setFilterByParent,
  clearFilter,
  toggleCategoryExpanded,
  expandCategory,
  collapseCategory,
  expandAllCategories,
  collapseAllCategories,
  resetCategoriesState,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;