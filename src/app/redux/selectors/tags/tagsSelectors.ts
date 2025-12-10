import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Tag } from '../../types/tags/tagTypes';

// Base selectors
export const selectTagsState = (state: RootState) => state.tags;

export const selectSelectedTag = (state: RootState) => 
  state.tags.selectedTag;

export const selectSelectedTags = (state: RootState) => 
  state.tags.selectedTags;

export const selectIsCreating = (state: RootState) => 
  state.tags.isCreating;

export const selectIsEditing = (state: RootState) => 
  state.tags.isEditing;

export const selectEditingTagId = (state: RootState) => 
  state.tags.editingTagId;

export const selectSearchQuery = (state: RootState) => 
  state.tags.searchQuery;

export const selectSortBy = (state: RootState) => 
  state.tags.sortBy;

export const selectViewMode = (state: RootState) => 
  state.tags.viewMode;

export const selectFilterByPostsCount = (state: RootState) => 
  state.tags.filterByPostsCount;

// Memoized selectors
export const selectIsTagSelected = createSelector(
  [
    selectSelectedTags,
    (_state: RootState, tagId: string) => tagId,
  ],
  (selectedTags, tagId) => {
    return selectedTags.some(tag => tag.id === tagId);
  }
);

export const selectSelectedTagIds = createSelector(
  [selectSelectedTags],
  (selectedTags) => selectedTags.map(tag => tag.id)
);

export const selectHasSelectedTags = createSelector(
  [selectSelectedTags],
  (selectedTags) => selectedTags.length > 0
);

export const selectSelectedTagsCount = createSelector(
  [selectSelectedTags],
  (selectedTags) => selectedTags.length
);

export const selectTagById = createSelector(
  [
    (_state: RootState, tags: Tag[]) => tags,
    (_state: RootState, _tags: Tag[], tagId: string) => tagId,
  ],
  (tags, tagId) => {
    return tags.find(tag => tag.id === tagId) ?? null;
  }
);

export const selectTagBySlug = createSelector(
  [
    (_state: RootState, tags: Tag[]) => tags,
    (_state: RootState, _tags: Tag[], slug: string) => slug,
  ],
  (tags, slug) => {
    return tags.find(tag => tag.slug === slug) ?? null;
  }
);

export const selectSortedTags = createSelector(
  [
    (_state: RootState, tags: Tag[]) => tags,
    selectSortBy,
  ],
  (tags, sortBy) => {
    const sorted = [...tags];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        sorted.sort((a, b) => b.posts_count - a.posts_count);
        break;
      case 'recent':
        sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return sorted;
  }
);

export const selectFilteredTags = createSelector(
  [
    (_state: RootState, tags: Tag[]) => tags,
    selectSearchQuery,
    selectFilterByPostsCount,
  ],
  (tags, searchQuery, postsCountFilter) => {
    let filtered = [...tags];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(query) ||
        tag.slug.toLowerCase().includes(query)
      );
    }

    // Apply posts count filter
    if (postsCountFilter) {
      filtered = filtered.filter(tag => {
        const meetsMin = tag.posts_count >= postsCountFilter.min;
        const meetsMax = postsCountFilter.max === null || 
                        tag.posts_count <= postsCountFilter.max;
        return meetsMin && meetsMax;
      });
    }

    return filtered;
  }
);

export const selectSortedAndFilteredTags = createSelector(
  [
    selectSortedTags,
    selectSearchQuery,
    selectFilterByPostsCount,
  ],
  (sortedTags, searchQuery, postsCountFilter) => {
    let filtered = [...sortedTags];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tag => 
        tag.name.toLowerCase().includes(query) ||
        tag.slug.toLowerCase().includes(query)
      );
    }

    // Apply posts count filter
    if (postsCountFilter) {
      filtered = filtered.filter(tag => {
        const meetsMin = tag.posts_count >= postsCountFilter.min;
        const meetsMax = postsCountFilter.max === null || 
                        tag.posts_count <= postsCountFilter.max;
        return meetsMin && meetsMax;
      });
    }

    return filtered;
  }
);

export const selectPopularTags = createSelector(
  [
    (_state: RootState, tags: Tag[]) => tags,
    (_state: RootState, _tags: Tag[], limit: number) => limit,
  ],
  (tags, limit) => {
    return [...tags]
      .sort((a, b) => b.posts_count - a.posts_count)
      .slice(0, limit);
  }
);

export const selectRecentTags = createSelector(
  [
    (_state: RootState, tags: Tag[]) => tags,
    (_state: RootState, _tags: Tag[], limit: number) => limit,
  ],
  (tags, limit) => {
    return [...tags]
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
  }
);

export const selectTagCloud = createSelector(
  [(_state: RootState, tags: Tag[]) => tags],
  (tags) => {
    if (tags.length === 0) return [];

    const maxCount = Math.max(...tags.map(tag => tag.posts_count));
    const minCount = Math.min(...tags.map(tag => tag.posts_count));
    const range = maxCount - minCount || 1;

    return tags.map(tag => {
      const weight = ((tag.posts_count - minCount) / range);
      const size = 12 + Math.round(weight * 24); // Size from 12px to 36px

      return {
        tag,
        size,
        weight,
      };
    }).sort((a, b) => a.tag.name.localeCompare(b.tag.name));
  }
);

export const selectTagsStats = createSelector(
  [(_state: RootState, tags: Tag[]) => tags],
  (tags) => {
    const totalPosts = tags.reduce((sum, tag) => sum + tag.posts_count, 0);
    const averagePosts = tags.length > 0 
      ? Math.round(totalPosts / tags.length) 
      : 0;
    const maxPosts = tags.length > 0 
      ? Math.max(...tags.map(tag => tag.posts_count)) 
      : 0;
    const tagsWithNoPosts = tags.filter(tag => tag.posts_count === 0).length;

    return {
      total: tags.length,
      totalPosts,
      averagePosts,
      maxPosts,
      tagsWithNoPosts,
    };
  }
);

export const selectTagsGroupedByFirstLetter = createSelector(
  [selectSortedTags],
  (tags) => {
    const grouped = tags.reduce((acc, tag) => {
      const firstLetter = tag.name?.charAt(0)?.toUpperCase() || 'T';
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(tag);
      return acc;
    }, {} as Record<string, Tag[]>);

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({
        letter,
        tags: items,
        count: items.length,
      }));
  }
);

export const selectUnusedTags = createSelector(
  [(_state: RootState, tags: Tag[]) => tags],
  (tags) => {
    return tags.filter(tag => tag.posts_count === 0);
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectSearchQuery, selectFilterByPostsCount],
  (searchQuery, postsCountFilter) => {
    return searchQuery.trim().length > 0 || postsCountFilter !== null;
  }
);

export const selectIsEditingTag = createSelector(
  [
    selectEditingTagId,
    (_state: RootState, tagId: string) => tagId,
  ],
  (editingTagId, tagId) => {
    return editingTagId === tagId;
  }
);
