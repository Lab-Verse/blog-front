import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { CommentReply } from '../../types/commentReplies/commentReplyTypes';

// Base selectors
export const selectCommentRepliesState = (state: RootState) => state.commentReplies;

export const selectSelectedReply = (state: RootState) => 
  state.commentReplies.selectedReply;

export const selectIsCreating = (state: RootState) => 
  state.commentReplies.isCreating;

export const selectIsEditing = (state: RootState) => 
  state.commentReplies.isEditing;

export const selectEditingReplyId = (state: RootState) => 
  state.commentReplies.editingReplyId;

export const selectReplyingToCommentId = (state: RootState) => 
  state.commentReplies.replyingToCommentId;

export const selectExpandedComments = (state: RootState) => 
  state.commentReplies.expandedComments;

// Memoized selectors
export const selectIsCommentExpanded = createSelector(
  [
    selectExpandedComments,
    (_state: RootState, commentId: string) => commentId,
  ],
  (expandedComments, commentId) => {
    return expandedComments.includes(commentId);
  }
);

export const selectIsReplyingToComment = createSelector(
  [
    selectReplyingToCommentId,
    (_state: RootState, commentId: string) => commentId,
  ],
  (replyingToCommentId, commentId) => {
    return replyingToCommentId === commentId;
  }
);

export const selectIsEditingReply = createSelector(
  [
    selectEditingReplyId,
    (_state: RootState, replyId: string) => replyId,
  ],
  (editingReplyId, replyId) => {
    return editingReplyId === replyId;
  }
);

export const selectReplyById = createSelector(
  [
    (_state: RootState, replies: CommentReply[]) => replies,
    (_state: RootState, _replies: CommentReply[], replyId: string) => replyId,
  ],
  (replies, replyId) => {
    return replies.find(reply => reply.id === replyId) ?? null;
  }
);

export const selectRepliesByUser = createSelector(
  [
    (_state: RootState, replies: CommentReply[]) => replies,
    (_state: RootState, _replies: CommentReply[], userId: string) => userId,
  ],
  (replies, userId) => {
    return replies.filter(reply => reply.user_id === userId);
  }
);

export const selectSortedReplies = createSelector(
  [(_state: RootState, replies: CommentReply[]) => replies],
  (replies) => {
    return [...replies].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }
);

export const selectRecentReplies = createSelector(
  [
    (_state: RootState, replies: CommentReply[]) => replies,
    (_state: RootState, _replies: CommentReply[], limit: number) => limit,
  ],
  (replies, limit) => {
    return [...replies]
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
  }
);

export const selectRepliesCount = createSelector(
  [(_state: RootState, replies: CommentReply[]) => replies],
  (replies) => replies.length
);

export const selectRepliesStats = createSelector(
  [(_state: RootState, replies: CommentReply[]) => replies],
  (replies) => {
    const uniqueUsers = new Set(replies.map(r => r.user_id)).size;
    
    return {
      total: replies.length,
      uniqueUsers,
      avgContentLength: replies.length > 0
        ? Math.round(
            replies.reduce((sum, r) => sum + r.content.length, 0) / replies.length
          )
        : 0,
    };
  }
);

export const selectHasActiveReply = createSelector(
  [selectIsCreating, selectIsEditing],
  (isCreating, isEditing) => {
    return isCreating || isEditing;
  }
);