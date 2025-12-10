import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Reaction, ReactionType } from '../../types/reactions/reactionTypes';

interface ReactionsState {
  selectedReaction: Reaction | null;
  isCreating: boolean;
  activeReactableId: string | null;
  activeReactableType: string | null;
  showReactionPicker: boolean;
  reactionPickerPosition: { x: number; y: number } | null;
  hoveredReactionType: ReactionType | null;
}

const initialState: ReactionsState = {
  selectedReaction: null,
  isCreating: false,
  activeReactableId: null,
  activeReactableType: null,
  showReactionPicker: false,
  reactionPickerPosition: null,
  hoveredReactionType: null,
};

const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {
    setSelectedReaction: (state, action: PayloadAction<Reaction | null>) => {
      state.selectedReaction = action.payload;
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setActiveReactable: (
      state,
      action: PayloadAction<{ id: string; type: string } | null>
    ) => {
      if (action.payload) {
        state.activeReactableId = action.payload.id;
        state.activeReactableType = action.payload.type;
      } else {
        state.activeReactableId = null;
        state.activeReactableType = null;
      }
    },

    showReactionPicker: (
      state,
      action: PayloadAction<{ 
        reactableId: string; 
        reactableType: string;
        position?: { x: number; y: number };
      }>
    ) => {
      state.showReactionPicker = true;
      state.activeReactableId = action.payload.reactableId;
      state.activeReactableType = action.payload.reactableType;
      state.reactionPickerPosition = action.payload.position ?? null;
    },

    hideReactionPicker: (state) => {
      state.showReactionPicker = false;
      state.reactionPickerPosition = null;
      state.hoveredReactionType = null;
    },

    setReactionPickerPosition: (
      state,
      action: PayloadAction<{ x: number; y: number } | null>
    ) => {
      state.reactionPickerPosition = action.payload;
    },

    setHoveredReactionType: (state, action: PayloadAction<ReactionType | null>) => {
      state.hoveredReactionType = action.payload;
    },

    clearActiveReactable: (state) => {
      state.activeReactableId = null;
      state.activeReactableType = null;
      state.showReactionPicker = false;
      state.reactionPickerPosition = null;
      state.hoveredReactionType = null;
    },

    resetReactionsState: () => initialState,
  },
});

export const {
  setSelectedReaction,
  setIsCreating,
  setActiveReactable,
  showReactionPicker,
  hideReactionPicker,
  setReactionPickerPosition,
  setHoveredReactionType,
  clearActiveReactable,
  resetReactionsState,
} = reactionsSlice.actions;

export default reactionsSlice.reducer;