import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { AuthorFollower, } from '../../types/authorfollowers/authorfollowersTypes';

// Base selectors
export const selectAuthorFollowersState = (state: RootState) => state.authorFollowers;

export const selectSelectedFollower = (state: RootState) => 
  state.authorFollowers.selectedFollower;

export const selectSelectedFollowerIds = (state: RootState) => 
  state.authorFollowers.selectedFollowerIds;

export const selectViewMode = (state: RootState) => 
  state.authorFollowers.viewMode;

export const selectSortBy = (state: RootState) => 
  state.authorFollowers.sortBy;

export const selectSearchQuery = (state: RootState) => 
  state.authorFollowers.searchQuery;

export const selectFilterByAuthor = (state: RootState) => 
  state.authorFollowers.filterByAuthor;

export const selectFilterByFollower = (state: RootState) => 
  state.authorFollowers.filterByFollower;

export const selectIsFollowingMap = (state: RootState) => 
  state.authorFollowers.isFollowing;

export const selectFollowSuggestions = (state: RootState) => 
  state.authorFollowers.followSuggestions;

export const selectShowSuggestions = (state: RootState) => 
  state.authorFollowers.showSuggestions;

// Memoized selectors
export const selectIsFollowerSelected = createSelector(
  [
    selectSelectedFollowerIds,
    (_state: RootState, followerId: string) => followerId,
  ],
  (selectedIds, followerId) => {
    return selectedIds.includes(followerId);
  }
);

export const selectHasSelectedFollowers = createSelector(
  [selectSelectedFollowerIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectSelectedFollowersCount = createSelector(
  [selectSelectedFollowerIds],
  (selectedIds) => selectedIds.length
);

export const selectIsFollowingAuthor = createSelector(
  [
    selectIsFollowingMap,
    (_state: RootState, authorId: string) => authorId,
  ],
  (isFollowingMap, authorId) => {
    return isFollowingMap[authorId] ?? false;
  }
);

export const selectFollowerById = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    (_state: RootState, _followers: AuthorFollower[], followerId: string) => followerId,
  ],
  (followers, followerId) => {
    return followers.find(f => f.id === followerId) ?? null;
  }
);

export const selectFollowersByIds = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    selectSelectedFollowerIds,
  ],
  (followers, selectedIds) => {
    return followers.filter(f => selectedIds.includes(f.id));
  }
);

export const selectSortedFollowers = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    selectSortBy,
  ],
  (followers, sortBy) => {
    const sorted = [...followers];

    switch (sortBy) {
      case 'recent':
        sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'oldest':
        sorted.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case 'name':
        sorted.sort((a, b) => {
          const nameA = a.follower?.username ?? a.author?.username ?? '';
          const nameB = b.follower?.username ?? b.author?.username ?? '';
          return nameA.localeCompare(nameB);
        });
        break;
    }

    return sorted;
  }
);

export const selectFilteredFollowers = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    selectSearchQuery,
    selectFilterByAuthor,
    selectFilterByFollower,
  ],
  (followers, searchQuery, filterByAuthor, filterByFollower) => {
    let filtered = [...followers];

    // Filter by author
    if (filterByAuthor) {
      filtered = filtered.filter(f => f.author_id === filterByAuthor);
    }

    // Filter by follower
    if (filterByFollower) {
      filtered = filtered.filter(f => f.follower_id === filterByFollower);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => {
        const followerName = f.follower?.username?.toLowerCase() ?? '';
        const authorName = f.author?.username?.toLowerCase() ?? '';
        const followerEmail = f.follower?.email?.toLowerCase() ?? '';
        const authorEmail = f.author?.email?.toLowerCase() ?? '';
        
        return followerName.includes(query) || 
               authorName.includes(query) ||
               followerEmail.includes(query) ||
               authorEmail.includes(query);
      });
    }

    return filtered;
  }
);

export const selectSortedAndFilteredFollowers = createSelector(
  [
    selectSortedFollowers,
    selectSearchQuery,
    selectFilterByAuthor,
    selectFilterByFollower,
  ],
  (sortedFollowers, searchQuery, filterByAuthor, filterByFollower) => {
    let filtered = [...sortedFollowers];

    // Filter by author
    if (filterByAuthor) {
      filtered = filtered.filter(f => f.author_id === filterByAuthor);
    }

    // Filter by follower
    if (filterByFollower) {
      filtered = filtered.filter(f => f.follower_id === filterByFollower);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => {
        const followerName = f.follower?.username?.toLowerCase() ?? '';
        const authorName = f.author?.username?.toLowerCase() ?? '';
        const followerEmail = f.follower?.email?.toLowerCase() ?? '';
        const authorEmail = f.author?.email?.toLowerCase() ?? '';
        
        return followerName.includes(query) || 
               authorName.includes(query) ||
               followerEmail.includes(query) ||
               authorEmail.includes(query);
      });
    }

    return filtered;
  }
);

export const selectFollowersByAuthor = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    (_state: RootState, _followers: AuthorFollower[], authorId: string) => authorId,
  ],
  (followers, authorId) => {
    return followers.filter(f => f.author_id === authorId);
  }
);

export const selectFollowingByUser = createSelector(
  [
    (_state: RootState, following: AuthorFollower[]) => following,
    (_state: RootState, _following: AuthorFollower[], userId: string) => userId,
  ],
  (following, userId) => {
    return following.filter(f => f.follower_id === userId);
  }
);

export const selectFollowersCount = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    (_state: RootState, _followers: AuthorFollower[], authorId: string) => authorId,
  ],
  (followers, authorId) => {
    return followers.filter(f => f.author_id === authorId).length;
  }
);

export const selectFollowingCount = createSelector(
  [
    (_state: RootState, following: AuthorFollower[]) => following,
    (_state: RootState, _following: AuthorFollower[], userId: string) => userId,
  ],
  (following, userId) => {
    return following.filter(f => f.follower_id === userId).length;
  }
);

export const selectIsUserFollowingAuthor = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    (_state: RootState, _followers: AuthorFollower[], userId: string, authorId: string) => 
      ({ userId, authorId }),
  ],
  (followers, { userId, authorId }) => {
    return followers.some(f => f.follower_id === userId && f.author_id === authorId);
  }
);

export const selectFollowRelationship = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[]) => followers,
    (_state: RootState, _followers: AuthorFollower[], userId: string, authorId: string) => 
      ({ userId, authorId }),
  ],
  (followers, { userId, authorId }) => {
    return followers.find(f => f.follower_id === userId && f.author_id === authorId) ?? null;
  }
);

export const selectMutualFollows = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[], following: AuthorFollower[]) => 
      ({ followers, following }),
    (
      _state: RootState, 
      _followers: AuthorFollower[], 
      _following: AuthorFollower[],
      userId: string
    ) => userId,
  ],
  ({ followers, following }, userId) => {
    // Users that follow userId
    const userFollowers = followers
      .filter(f => f.author_id === userId)
      .map(f => f.follower_id);
    
    // Users that userId follows
    const userFollowing = following
      .filter(f => f.follower_id === userId)
      .map(f => f.author_id);
    
    // Find mutual follows
    return userFollowers.filter(followerId => 
      userFollowing.includes(followerId)
    );
  }
);

export const selectRecentFollowers = createSelector(
  [
    selectSortedFollowers,
    (_state: RootState, _followers: AuthorFollower[], limit: number) => limit,
  ],
  (followers, limit) => {
    return followers.slice(0, limit);
  }
);

export const selectFollowersGroupedByAuthor = createSelector(
  [(_state: RootState, followers: AuthorFollower[]) => followers],
  (followers) => {
    const grouped = followers.reduce((acc, follower) => {
      const authorId = follower.author_id;
      if (!acc[authorId]) {
        acc[authorId] = [];
      }
      acc[authorId].push(follower);
      return acc;
    }, {} as Record<string, AuthorFollower[]>);

    return Object.entries(grouped).map(([authorId, items]) => ({
      authorId,
      author: items[0]?.author ?? null,
      followers: items,
      count: items.length,
    }));
  }
);

export const selectFollowingGroupedByUser = createSelector(
  [(_state: RootState, following: AuthorFollower[]) => following],
  (following) => {
    const grouped = following.reduce((acc, follow) => {
      const userId = follow.follower_id;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(follow);
      return acc;
    }, {} as Record<string, AuthorFollower[]>);

    return Object.entries(grouped).map(([userId, items]) => ({
      userId,
      user: items[0]?.follower ?? null,
      following: items,
      count: items.length,
    }));
  }
);

export const selectFollowStats = createSelector(
  [
    (_state: RootState, followers: AuthorFollower[], following: AuthorFollower[]) =>
      ({ followers, following }),
    (
      _state: RootState,
      _followers: AuthorFollower[],
      _following: AuthorFollower[],
      userId: string
    ) => userId,
  ],
  ({ followers, following }, userId) => {
    const userFollowers = followers.filter(f => f.author_id === userId);
    const userFollowing = following.filter(f => f.follower_id === userId);
    
    const followerIds = userFollowers.map(f => f.follower_id);
    const followingIds = userFollowing.map(f => f.author_id);
    
    const mutualFollows = followerIds.filter(id => followingIds.includes(id)).length;
    
    const recentFollowers = [...userFollowers]
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    return {
      totalFollowers: userFollowers.length,
      totalFollowing: userFollowing.length,
      mutualFollows,
      recentFollowers,
      topAuthors: [], // Would need additional logic to determine top authors
    };
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectSearchQuery, selectFilterByAuthor, selectFilterByFollower],
  (searchQuery, filterByAuthor, filterByFollower) => {
    return searchQuery.trim().length > 0 || 
           filterByAuthor !== null || 
           filterByFollower !== null;
  }
);