import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Post } from '../../types/posts/postTypes';

// Base selectors
export const selectPostsState = (state: RootState) => state.posts;

export const selectSelectedPost = (state: RootState) => state.posts.selectedPost;

export const selectFilters = (state: RootState) => state.posts.filters;

export const selectViewMode = (state: RootState) => state.posts.viewMode;

export const selectSortBy = (state: RootState) => state.posts.sortBy;

export const selectIsCreating = (state: RootState) => state.posts.isCreating;

export const selectIsEditing = (state: RootState) => state.posts.isEditing;

// Memoized selectors
export const selectHasActiveFilters = createSelector(
  [selectFilters],
  (filters) => {
    return Object.keys(filters).length > 0;
  }
);

export const selectFilteredPosts = createSelector(
  [
    (_state: RootState, posts: Post[]) => posts,
    selectFilters,
    selectSortBy,
  ],
  (posts, filters, sortBy) => {
    let filtered = [...posts];

    // Apply filters
    if (filters.categoryId) {
      filtered = filtered.filter(post => post.category_id === filters.categoryId);
    }
    
    if (filters.userId) {
      filtered = filtered.filter(post => post.user_id === filters.userId);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'popular':
        filtered.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }
);

export const selectPostById = createSelector(
  [
    (_state: RootState, posts: Post[]) => posts,
    (_state: RootState, _posts: Post[], postId: string) => postId,
  ],
  (posts, postId) => {
    return posts.find(post => post.id === postId) ?? null;
  }
);

export const selectPublishedPosts = createSelector(
  [(_state: RootState, posts: Post[]) => posts],
  (posts) => {
    return posts.filter(post => post.status === 'published');
  }
);

export const selectDraftPosts = createSelector(
  [(_state: RootState, posts: Post[]) => posts],
  (posts) => {
    return posts.filter(post => post.status === 'draft');
  }
);

export const selectPostsByCategory = createSelector(
  [
    (_state: RootState, posts: Post[]) => posts,
    (_state: RootState, _posts: Post[], categoryId: string) => categoryId,
  ],
  (posts, categoryId) => {
    return posts.filter(post => post.category_id === categoryId);
  }
);

export const selectPostsByUser = createSelector(
  [
    (_state: RootState, posts: Post[]) => posts,
    (_state: RootState, _posts: Post[], userId: string) => userId,
  ],
  (posts, userId) => {
    return posts.filter(post => post.user_id === userId);
  }
);

export const selectPostsStats = createSelector(
  [(_state: RootState, posts: Post[]) => posts],
  (posts) => {
    return {
      total: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      draft: posts.filter(p => p.status === 'draft').length,
      archived: posts.filter(p => p.status === 'archived').length,
      totalViews: posts.reduce((sum, p) => sum + p.views_count, 0),
      totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0),
      totalComments: posts.reduce((sum, p) => sum + p.comments_count, 0),
    };
  }
);