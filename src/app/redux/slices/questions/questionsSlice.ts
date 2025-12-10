import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Question, QuestionFilters, } from '../../types/questions/questionTypes';

interface QuestionsState {
  selectedQuestion: Question | null;
  selectedQuestionIds: string[];
  isCreating: boolean;
  isEditing: boolean;
  editingQuestionId: string | null;
  isDeleting: boolean;
  viewMode: 'grid' | 'list';
  sortBy: 'recent' | 'oldest' | 'popular' | 'unanswered' | 'mostAnswered';
  filters: QuestionFilters;
  searchQuery: string;
}

const initialState: QuestionsState = {
  selectedQuestion: null,
  selectedQuestionIds: [],
  isCreating: false,
  isEditing: false,
  editingQuestionId: null,
  isDeleting: false,
  viewMode: 'list',
  sortBy: 'recent',
  filters: {},
  searchQuery: '',
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setSelectedQuestion: (state, action: PayloadAction<Question | null>) => {
      state.selectedQuestion = action.payload;
    },

    addSelectedQuestionId: (state, action: PayloadAction<string>) => {
      if (!state.selectedQuestionIds.includes(action.payload)) {
        state.selectedQuestionIds.push(action.payload);
      }
    },

    removeSelectedQuestionId: (state, action: PayloadAction<string>) => {
      state.selectedQuestionIds = state.selectedQuestionIds.filter(
        id => id !== action.payload
      );
    },

    setSelectedQuestionIds: (state, action: PayloadAction<string[]>) => {
      state.selectedQuestionIds = action.payload;
    },

    toggleQuestionSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedQuestionIds.indexOf(action.payload);
      if (index > -1) {
        state.selectedQuestionIds.splice(index, 1);
      } else {
        state.selectedQuestionIds.push(action.payload);
      }
    },

    clearSelectedQuestions: (state) => {
      state.selectedQuestionIds = [];
      state.selectedQuestion = null;
    },

    selectAllQuestions: (state, action: PayloadAction<string[]>) => {
      state.selectedQuestionIds = action.payload;
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setEditingQuestionId: (state, action: PayloadAction<string | null>) => {
      state.editingQuestionId = action.payload;
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
      action: PayloadAction<'recent' | 'oldest' | 'popular' | 'unanswered' | 'mostAnswered'>
    ) => {
      state.sortBy = action.payload;
    },

    setFilters: (state, action: PayloadAction<QuestionFilters>) => {
      state.filters = action.payload;
    },

    updateFilters: (state, action: PayloadAction<Partial<QuestionFilters>>) => {
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

    resetQuestionsState: () => initialState,
  },
});

export const {
  setSelectedQuestion,
  addSelectedQuestionId,
  removeSelectedQuestionId,
  setSelectedQuestionIds,
  toggleQuestionSelection,
  clearSelectedQuestions,
  selectAllQuestions,
  setIsCreating,
  setIsEditing,
  setEditingQuestionId,
  setIsDeleting,
  setViewMode,
  setSortBy,
  setFilters,
  updateFilters,
  clearFilters,
  setSearchQuery,
  clearSearchQuery,
  resetQuestionsState,
} = questionsSlice.actions;

export default questionsSlice.reducer;