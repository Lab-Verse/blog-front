import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Answer } from '../../types/answers/answerTypes'

interface AnswersState {
  selectedAnswer: Answer | null
  selectedAnswerIds: string[]
  isCreating: boolean
  isEditing: boolean
  editingAnswerId: string | null
  isDeleting: boolean
  sortBy: 'recent' | 'oldest' | 'votes' | 'accepted'
  searchQuery: string
  filterByQuestion: string | null
  filterByUser: string | null
  showAcceptedOnly: boolean
  replyingToQuestionId: string | null
}

const initialState: AnswersState = {
  selectedAnswer: null,
  selectedAnswerIds: [],
  isCreating: false,
  isEditing: false,
  editingAnswerId: null,
  isDeleting: false,
  sortBy: 'votes',
  searchQuery: '',
  filterByQuestion: null,
  filterByUser: null,
  showAcceptedOnly: false,
  replyingToQuestionId: null,
}

const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    setSelectedAnswer: (state, action: PayloadAction<Answer | null>) => {
      state.selectedAnswer = action.payload
    },

    addSelectedAnswerId: (state, action: PayloadAction<string>) => {
      if (!state.selectedAnswerIds.includes(action.payload)) {
        state.selectedAnswerIds.push(action.payload)
      }
    },

    removeSelectedAnswerId: (state, action: PayloadAction<string>) => {
      state.selectedAnswerIds = state.selectedAnswerIds.filter((id) => id !== action.payload)
    },

    setSelectedAnswerIds: (state, action: PayloadAction<string[]>) => {
      state.selectedAnswerIds = action.payload
    },

    toggleAnswerSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedAnswerIds.indexOf(action.payload)
      if (index > -1) {
        state.selectedAnswerIds.splice(index, 1)
      } else {
        state.selectedAnswerIds.push(action.payload)
      }
    },

    clearSelectedAnswers: (state) => {
      state.selectedAnswerIds = []
      state.selectedAnswer = null
    },

    selectAllAnswers: (state, action: PayloadAction<string[]>) => {
      state.selectedAnswerIds = action.payload
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },

    setEditingAnswerId: (state, action: PayloadAction<string | null>) => {
      state.editingAnswerId = action.payload
      state.isEditing = action.payload !== null
    },

    setIsDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload
    },

    setSortBy: (state, action: PayloadAction<'recent' | 'oldest' | 'votes' | 'accepted'>) => {
      state.sortBy = action.payload
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },

    clearSearchQuery: (state) => {
      state.searchQuery = ''
    },

    setFilterByQuestion: (state, action: PayloadAction<string | null>) => {
      state.filterByQuestion = action.payload
    },

    setFilterByUser: (state, action: PayloadAction<string | null>) => {
      state.filterByUser = action.payload
    },

    clearFilters: (state) => {
      state.filterByQuestion = null
      state.filterByUser = null
      state.showAcceptedOnly = false
    },

    setShowAcceptedOnly: (state, action: PayloadAction<boolean>) => {
      state.showAcceptedOnly = action.payload
    },

    toggleShowAcceptedOnly: (state) => {
      state.showAcceptedOnly = !state.showAcceptedOnly
    },

    setReplyingToQuestionId: (state, action: PayloadAction<string | null>) => {
      state.replyingToQuestionId = action.payload
      state.isCreating = action.payload !== null
    },

    cancelReply: (state) => {
      state.replyingToQuestionId = null
      state.isCreating = false
    },

    resetAnswersState: () => initialState,
  },
})

export const {
  setSelectedAnswer,
  addSelectedAnswerId,
  removeSelectedAnswerId,
  setSelectedAnswerIds,
  toggleAnswerSelection,
  clearSelectedAnswers,
  selectAllAnswers,
  setIsCreating,
  setIsEditing,
  setEditingAnswerId,
  setIsDeleting,
  setSortBy,
  setSearchQuery,
  clearSearchQuery,
  setFilterByQuestion,
  setFilterByUser,
  clearFilters,
  setShowAcceptedOnly,
  toggleShowAcceptedOnly,
  setReplyingToQuestionId,
  cancelReply,
  resetAnswersState,
} = answersSlice.actions

export default answersSlice.reducer
