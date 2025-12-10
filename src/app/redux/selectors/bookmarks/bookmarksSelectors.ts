import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Bookmark } from '../../types/bookmarks/bookmarkTypes';

// Base selectors
export const selectBookmarksState = (state: RootState) => state.bookmarks;

export const selectSelectedBookmark = (state: RootState) => 
  state.bookmarks.selectedBookmark;

export const selectViewMode = (state: RootState) => 
  state.bookmarks.viewMode;

export const selectSortBy = (state: RootState) => 
  state.bookmarks.sortBy;

export const selectIsCreating = (state: RootState) => 
  state.bookmarks.isCreating;

export const selectSearchQuery = (state: RootState) => 
  state.bookmarks.searchQuery;

export const selectSelectedPostId = (state: RootState) => 
  state.bookmarks.selectedPostId;

// Memoized selectors
export const selectIsPostBookmarked = createSelector(
  [
    (_state: RootState, bookmarks: Bookmark[]) => bookmarks,
    (_state: RootState, _bookmarks: Bookmark[], postId: string) => postId,
  ],
  (bookmarks, postId) => {
    return bookmarks.some(bookmark => bookmark.post_id === postId);
  }
);

export const selectBookmarkByPostId = createSelector(
  [
    (_state: RootState, bookmarks: Bookmark[]) => bookmarks,
    (_state: RootState, _bookmarks: Bookmark[], postId: string) => postId,
  ],
  (bookmarks, postId) => {
    return bookmarks.find(bookmark => bookmark.post_id === postId) ?? null;
  }
);

export const selectSortedBookmarks = createSelector(
  [
    (_state: RootState, bookmarks: Bookmark[]) => bookmarks,
    selectSortBy,
  ],
  (bookmarks, sortBy) => {
    const sorted = [...bookmarks];

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
      case 'title':
        sorted.sort((a, b) => {
          const titleA = a.post?.title ?? '';
          const titleB = b.post?.title ?? '';
          return titleA.localeCompare(titleB);
        });
        break;
    }

    return sorted;
  }
);

export const selectFilteredBookmarks = createSelector(
  [
    (_state: RootState, bookmarks: Bookmark[]) => bookmarks,
    selectSearchQuery,
  ],
  (bookmarks, searchQuery) => {
    if (!searchQuery.trim()) {
      return bookmarks;
    }

    const query = searchQuery.toLowerCase();
    return bookmarks.filter(bookmark => {
      const title = bookmark.post?.title?.toLowerCase() ?? '';
      const content = bookmark.post?.content?.toLowerCase() ?? '';
      return title.includes(query) || content.includes(query);
    });
  }
);

export const selectSortedAndFilteredBookmarks = createSelector(
  [
    selectSortedBookmarks,
    selectSearchQuery,
  ],
  (sortedBookmarks, searchQuery) => {
    if (!searchQuery.trim()) {
      return sortedBookmarks;
    }

    const query = searchQuery.toLowerCase();
    return sortedBookmarks.filter(bookmark => {
      const title = bookmark.post?.title?.toLowerCase() ?? '';
      const content = bookmark.post?.content?.toLowerCase() ?? '';
      return title.includes(query) || content.includes(query);
    });
  }
);

export const selectBookmarksGroupedByDate = createSelector(
  [selectSortedBookmarks],
  (bookmarks) => {
    const grouped = bookmarks.reduce((acc, bookmark) => {
      const date = new Date(bookmark.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(bookmark);
      return acc;
    }, {} as Record<string, Bookmark[]>);

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      bookmarks: items,
    }));
  }
);

export const selectBookmarksGroupedByMonth = createSelector(
  [selectSortedBookmarks],
  (bookmarks) => {
    const grouped = bookmarks.reduce((acc, bookmark) => {
      const date = new Date(bookmark.created_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(bookmark);
      return acc;
    }, {} as Record<string, Bookmark[]>);

    return Object.entries(grouped).map(([month, items]) => ({
      month,
      bookmarks: items,
    }));
  }
);

export const selectRecentBookmarks = createSelector(
  [
    selectSortedBookmarks,
    (_state: RootState, _bookmarks: Bookmark[], limit: number) => limit,
  ],
  (bookmarks, limit) => {
    return bookmarks.slice(0, limit);
  }
);

export const selectBookmarksCount = createSelector(
  [(_state: RootState, bookmarks: Bookmark[]) => bookmarks],
  (bookmarks) => bookmarks.length
);

export const selectBookmarksStats = createSelector(
  [(_state: RootState, bookmarks: Bookmark[]) => bookmarks],
  (bookmarks) => {
    const uniquePosts = new Set(bookmarks.map(b => b.post_id)).size;
    const oldest = bookmarks.length > 0
      ? bookmarks.reduce((oldest, bookmark) => 
          new Date(bookmark.created_at) < new Date(oldest.created_at) 
            ? bookmark 
            : oldest
        )
      : null;
    const newest = bookmarks.length > 0
      ? bookmarks.reduce((newest, bookmark) => 
          new Date(bookmark.created_at) > new Date(newest.created_at) 
            ? bookmark 
            : newest
        )
      : null;

    return {
      total: bookmarks.length,
      uniquePosts,
      oldestBookmark: oldest,
      newestBookmark: newest,
    };
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);