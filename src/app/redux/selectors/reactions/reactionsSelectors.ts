import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Reaction, ReactionType } from '../../types/reactions/reactionTypes';

// Base selectors
export const selectReactionsState = (state: RootState) => state.reactions;

export const selectSelectedReaction = (state: RootState) => 
  state.reactions.selectedReaction;

export const selectIsCreating = (state: RootState) => 
  state.reactions.isCreating;

export const selectActiveReactableId = (state: RootState) => 
  state.reactions.activeReactableId;

export const selectActiveReactableType = (state: RootState) => 
  state.reactions.activeReactableType;

export const selectShowReactionPicker = (state: RootState) => 
  state.reactions.showReactionPicker;

export const selectReactionPickerPosition = (state: RootState) => 
  state.reactions.reactionPickerPosition;

export const selectHoveredReactionType = (state: RootState) => 
  state.reactions.hoveredReactionType;

// Memoized selectors
export const selectHasUserReacted = createSelector(
  [
    (_state: RootState, reactions: Reaction[]) => reactions,
    (_state: RootState, _reactions: Reaction[], userId: string) => userId,
  ],
  (reactions, userId) => {
    return reactions.some(reaction => reaction.user_id === userId);
  }
);

export const selectUserReaction = createSelector(
  [
    (_state: RootState, reactions: Reaction[]) => reactions,
    (_state: RootState, _reactions: Reaction[], userId: string) => userId,
  ],
  (reactions, userId) => {
    return reactions.find(reaction => reaction.user_id === userId) ?? null;
  }
);

export const selectReactionsByType = createSelector(
  [(_state: RootState, reactions: Reaction[]) => reactions],
  (reactions) => {
    return reactions.reduce((acc, reaction) => {
      const type = reaction.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(reaction);
      return acc;
    }, {} as Record<ReactionType, Reaction[]>);
  }
);

export const selectReactionCounts = createSelector(
  [selectReactionsByType],
  (reactionsByType) => {
    return Object.entries(reactionsByType).reduce((acc, [type, reactions]) => {
      acc[type as ReactionType] = reactions.length;
      return acc;
    }, {} as Record<ReactionType, number>);
  }
);

export const selectTotalReactionsCount = createSelector(
  [(_state: RootState, reactions: Reaction[]) => reactions],
  (reactions) => reactions.length
);

export const selectMostPopularReaction = createSelector(
  [selectReactionCounts],
  (counts) => {
    const entries = Object.entries(counts) as [ReactionType, number][];
    if (entries.length === 0) return null;
    
    return entries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    )[0];
  }
);

export const selectReactionGroups = createSelector(
  [selectReactionsByType],
  (reactionsByType) => {
    return Object.entries(reactionsByType).map(([type, reactions]) => ({
      type: type as ReactionType,
      reactions,
      count: reactions.length,
    }));
  }
);

export const selectSortedReactionGroups = createSelector(
  [selectReactionGroups],
  (groups) => {
    return [...groups].sort((a, b) => b.count - a.count);
  }
);

export const selectReactionSummary = createSelector(
  [
    (_state: RootState, reactions: Reaction[]) => reactions,
    (_state: RootState, _reactions: Reaction[], userId: string) => userId,
  ],
  (reactions, userId) => {
    const byType = reactions.reduce((acc, reaction) => {
      const type = reaction.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ReactionType, number>);

    const userReaction = reactions.find(r => r.user_id === userId);

    return {
      total: reactions.length,
      byType,
      hasUserReacted: !!userReaction,
      userReaction: userReaction ?? undefined,
    };
  }
);

export const selectReactionUsers = createSelector(
  [
    (_state: RootState, reactions: Reaction[]) => reactions,
    (_state: RootState, _reactions: Reaction[], reactionType?: ReactionType) => reactionType,
  ],
  (reactions, reactionType) => {
    const filtered = reactionType
      ? reactions.filter(r => r.type === reactionType)
      : reactions;
    
    return filtered
      .map(r => r.user)
      .filter((user): user is NonNullable<typeof user> => user !== undefined);
  }
);

export const selectRecentReactions = createSelector(
  [
    (_state: RootState, reactions: Reaction[]) => reactions,
    (_state: RootState, _reactions: Reaction[], limit: number) => limit,
  ],
  (reactions, limit) => {
    return [...reactions]
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
  }
);

export const selectIsActiveReactable = createSelector(
  [
    selectActiveReactableId,
    selectActiveReactableType,
    (
      _state: RootState,
      _activeId: string | null,
      _activeType: string | null,
      reactableId: string,
      reactableType: string
    ) => ({ reactableId, reactableType }),
  ],
  (activeId, activeType, { reactableId, reactableType }) => {
    return activeId === reactableId && activeType === reactableType;
  }
);

export const selectReactionStats = createSelector(
  [(_state: RootState, reactions: Reaction[]) => reactions],
  (reactions) => {
    const uniqueUsers = new Set(reactions.map(r => r.user_id)).size;
    const typeDistribution = reactions.reduce((acc, reaction) => {
      const type = reaction.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ReactionType, number>);

    const mostPopular = Object.entries(typeDistribution).reduce(
      (max, [type, count]) => 
        count > max.count ? { type: type as ReactionType, count } : max,
      { type: null as ReactionType | null, count: 0 }
    );

    return {
      total: reactions.length,
      uniqueUsers,
      typeDistribution,
      mostPopularType: mostPopular.type,
      mostPopularCount: mostPopular.count,
    };
  }
);