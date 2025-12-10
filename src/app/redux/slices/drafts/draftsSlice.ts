import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Draft, DraftAutoSave } from '../../types/drafts/draftTypes';

interface DraftsState {
  selectedDraft: Draft | null;
  selectedDraftIds: string[];
  isCreating: boolean;
  isEditing: boolean;
  editingDraftId: string | null;
  isDeleting: boolean;
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'oldest' | 'title' | 'updated';
  searchQuery: string;
  filterByCategory: string | null;
  showEmptyDrafts: boolean;
  autoSave: Record<string, DraftAutoSave>;
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in milliseconds
}

const initialState: DraftsState = {
  selectedDraft: null,
  selectedDraftIds: [],
  isCreating: false,
  isEditing: false,
  editingDraftId: null,
  isDeleting: false,
  viewMode: 'list',
  sortBy: 'updated',
  searchQuery: '',
  filterByCategory: null,
  showEmptyDrafts: true,
  autoSave: {},
  autoSaveEnabled: true,
  autoSaveInterval: 30000, // 30 seconds
};

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    setSelectedDraft: (state, action: PayloadAction<Draft | null>) => {
      state.selectedDraft = action.payload;
    },

    addSelectedDraftId: (state, action: PayloadAction<string>) => {
      if (!state.selectedDraftIds.includes(action.payload)) {
        state.selectedDraftIds.push(action.payload);
      }
    },

    removeSelectedDraftId: (state, action: PayloadAction<string>) => {
      state.selectedDraftIds = state.selectedDraftIds.filter(
        id => id !== action.payload
      );
    },

    setSelectedDraftIds: (state, action: PayloadAction<string[]>) => {
      state.selectedDraftIds = action.payload;
    },

    toggleDraftSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedDraftIds.indexOf(action.payload);
      if (index > -1) {
        state.selectedDraftIds.splice(index, 1);
      } else {
        state.selectedDraftIds.push(action.payload);
      }
    },

    clearSelectedDrafts: (state) => {
      state.selectedDraftIds = [];
      state.selectedDraft = null;
    },

    selectAllDrafts: (state, action: PayloadAction<string[]>) => {
      state.selectedDraftIds = action.payload;
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setEditingDraftId: (state, action: PayloadAction<string | null>) => {
      state.editingDraftId = action.payload;
      state.isEditing = action.payload !== null;
    },

    setIsDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },

    setViewMode: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.viewMode = action.payload;
    },

    setSortBy: (
      state,
      action: PayloadAction<'recent' | 'oldest' | 'title' | 'updated'>
    ) => {
      state.sortBy = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setFilterByCategory: (state, action: PayloadAction<string | null>) => {
      state.filterByCategory = action.payload;
    },

    clearFilter: (state) => {
      state.filterByCategory = null;
    },

    setShowEmptyDrafts: (state, action: PayloadAction<boolean>) => {
      state.showEmptyDrafts = action.payload;
    },

    toggleShowEmptyDrafts: (state) => {
      state.showEmptyDrafts = !state.showEmptyDrafts;
    },

    setAutoSave: (state, action: PayloadAction<DraftAutoSave>) => {
      state.autoSave[action.payload.draftId] = action.payload;
    },

    updateAutoSave: (
      state,
      action: PayloadAction<{ 
        draftId: string; 
        updates: Partial<DraftAutoSave> 
      }>
    ) => {
      const existing = state.autoSave[action.payload.draftId];
      if (existing) {
        state.autoSave[action.payload.draftId] = {
          ...existing,
          ...action.payload.updates,
        };
      }
    },

    setAutoSaveStatus: (
      state,
      action: PayloadAction<{ draftId: string; isSaving: boolean }>
    ) => {
      const existing = state.autoSave[action.payload.draftId];
      if (existing) {
        existing.isSaving = action.payload.isSaving;
        if (!action.payload.isSaving) {
          existing.lastSaved = new Date().toISOString();
          existing.hasUnsavedChanges = false;
        }
      }
    },

    setHasUnsavedChanges: (
      state,
      action: PayloadAction<{ draftId: string; hasChanges: boolean }>
    ) => {
      const existing = state.autoSave[action.payload.draftId];
      if (existing) {
        existing.hasUnsavedChanges = action.payload.hasChanges;
      }
    },

    removeAutoSave: (state, action: PayloadAction<string>) => {
      delete state.autoSave[action.payload];
    },

    clearAutoSave: (state) => {
      state.autoSave = {};
    },

    setAutoSaveEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoSaveEnabled = action.payload;
    },

    toggleAutoSave: (state) => {
      state.autoSaveEnabled = !state.autoSaveEnabled;
    },

    setAutoSaveInterval: (state, action: PayloadAction<number>) => {
      state.autoSaveInterval = action.payload;
    },

    resetDraftsState: () => initialState,
  },
});

export const {
  setSelectedDraft,
  addSelectedDraftId,
  removeSelectedDraftId,
  setSelectedDraftIds,
  toggleDraftSelection,
  clearSelectedDrafts,
  selectAllDrafts,
  setIsCreating,
  setIsEditing,
  setEditingDraftId,
  setIsDeleting,
  setViewMode,
  setSortBy,
  setSearchQuery,
  clearSearchQuery,
  setFilterByCategory,
  clearFilter,
  setShowEmptyDrafts,
  toggleShowEmptyDrafts,
  setAutoSave,
  updateAutoSave,
  setAutoSaveStatus,
  setHasUnsavedChanges,
  removeAutoSave,
  clearAutoSave,
  setAutoSaveEnabled,
  toggleAutoSave,
  setAutoSaveInterval,
  resetDraftsState,
} = draftsSlice.actions;

export default draftsSlice.reducer;