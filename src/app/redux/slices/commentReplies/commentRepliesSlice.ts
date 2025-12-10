import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CommentReply } from '../../types/commentReplies/commentReplyTypes';

interface CommentRepliesState {
  selectedReply: CommentReply | null;
  isCreating: boolean;
  isEditing: boolean;
  editingReplyId: string | null;
  replyingToCommentId: string | null;
  expandedComments: string[];
}

const initialState: CommentRepliesState = {
  selectedReply: null,
  isCreating: false,
  isEditing: false,
  editingReplyId: null,
  replyingToCommentId: null,
  expandedComments: [],
};

const commentRepliesSlice = createSlice({
  name: 'commentReplies',
  initialState,
  reducers: {
    setSelectedReply: (state, action: PayloadAction<CommentReply | null>) => {
      state.selectedReply = action.payload;
    },

    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },

    setEditingReplyId: (state, action: PayloadAction<string | null>) => {
      state.editingReplyId = action.payload;
      state.isEditing = action.payload !== null;
    },

    setReplyingToCommentId: (state, action: PayloadAction<string | null>) => {
      state.replyingToCommentId = action.payload;
      state.isCreating = action.payload !== null;
    },

    toggleCommentExpanded: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      const index = state.expandedComments.indexOf(commentId);
      
      if (index > -1) {
        state.expandedComments.splice(index, 1);
      } else {
        state.expandedComments.push(commentId);
      }
    },

    expandComment: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      if (!state.expandedComments.includes(commentId)) {
        state.expandedComments.push(commentId);
      }
    },

    collapseComment: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      state.expandedComments = state.expandedComments.filter(
        id => id !== commentId
      );
    },

    collapseAllComments: (state) => {
      state.expandedComments = [];
    },

    cancelReply: (state) => {
      state.replyingToCommentId = null;
      state.isCreating = false;
    },

    cancelEdit: (state) => {
      state.editingReplyId = null;
      state.isEditing = false;
    },

    resetCommentRepliesState: () => initialState,
  },
});

export const {
  setSelectedReply,
  setIsCreating,
  setIsEditing,
  setEditingReplyId,
  setReplyingToCommentId,
  toggleCommentExpanded,
  expandComment,
  collapseComment,
  collapseAllComments,
  cancelReply,
  cancelEdit,
  resetCommentRepliesState,
} = commentRepliesSlice.actions;

export default commentRepliesSlice.reducer;