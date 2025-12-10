import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Draft } from '../../types/drafts/draftTypes';

// Helper functions
const getWordCount = (text: string | null): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getCharacterCount = (text: string | null): number => {
  if (!text) return 0;
  return text.length;
};

const isDraftEmpty = (draft: Draft): boolean => {
  return !draft.title && !draft.content;
};

// Base selectors
export const selectDraftsState = (state: RootState) => state.drafts;

export const selectSelectedDraft = (state: RootState) => 
  state.drafts.selectedDraft;

export const selectSelectedDraftIds = (state: RootState) => 
  state.drafts.selectedDraftIds;

export const selectIsCreating = (state: RootState) => 
  state.drafts.isCreating;

export const selectIsEditing = (state: RootState) => 
  state.drafts.isEditing;

export const selectEditingDraftId = (state: RootState) => 
  state.drafts.editingDraftId;

export const selectIsDeleting = (state: RootState) => 
  state.drafts.isDeleting;

export const selectViewMode = (state: RootState) => 
  state.drafts.viewMode;

export const selectSortBy = (state: RootState) => 
  state.drafts.sortBy;

export const selectSearchQuery = (state: RootState) => 
  state.drafts.searchQuery;

export const selectFilterByCategory = (state: RootState) => 
  state.drafts.filterByCategory;

export const selectShowEmptyDrafts = (state: RootState) => 
  state.drafts.showEmptyDrafts;

export const selectAutoSave = (state: RootState) => 
  state.drafts.autoSave;

export const selectAutoSaveEnabled = (state: RootState) => 
  state.drafts.autoSaveEnabled;

export const selectAutoSaveInterval = (state: RootState) => 
  state.drafts.autoSaveInterval;

// Memoized selectors
export const selectIsDraftSelected = createSelector(
  [
    selectSelectedDraftIds,
    (_state: RootState, draftId: string) => draftId,
  ],
  (selectedIds, draftId) => {
    return selectedIds.includes(draftId);
  }
);

export const selectHasSelectedDrafts = createSelector(
  [selectSelectedDraftIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectSelectedDraftsCount = createSelector(
  [selectSelectedDraftIds],
  (selectedIds) => selectedIds.length
);

export const selectAutoSaveForDraft = createSelector(
  [
    selectAutoSave,
    (_state: RootState, draftId: string) => draftId,
  ],
  (autoSave, draftId) => {
    return autoSave[draftId] ?? null;
  }
);

export const selectDraftById = createSelector(
  [
    (_state: RootState, drafts: Draft[]) => drafts,
    (_state: RootState, _drafts: Draft[], draftId: string) => draftId,
  ],
  (drafts, draftId) => {
    return drafts.find(draft => draft.id === draftId) ?? null;
  }
);

export const selectDraftsByIds = createSelector(
  [
    (_state: RootState, drafts: Draft[]) => drafts,
    selectSelectedDraftIds,
  ],
  (drafts, selectedIds) => {
    return drafts.filter(draft => selectedIds.includes(draft.id));
  }
);

export const selectSortedDrafts = createSelector(
  [
    (_state: RootState, drafts: Draft[]) => drafts,
    selectSortBy,
  ],
  (drafts, sortBy) => {
    const sorted = [...drafts];

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
          const titleA = a.title || 'Untitled';
          const titleB = b.title || 'Untitled';
          return titleA.localeCompare(titleB);
        });
        break;
      case 'updated':
        sorted.sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        break;
    }

    return sorted;
  }
);

export const selectFilteredDrafts = createSelector(
  [
    (_state: RootState, drafts: Draft[]) => drafts,
    selectSearchQuery,
    selectFilterByCategory,
    selectShowEmptyDrafts,
  ],
  (drafts, searchQuery, filterByCategory, showEmptyDrafts) => {
    let filtered = [...drafts];

    // Filter by empty status
    if (!showEmptyDrafts) {
      filtered = filtered.filter(draft => !isDraftEmpty(draft));
    }

    // Filter by category
    if (filterByCategory) {
      filtered = filtered.filter(draft => draft.category_id === filterByCategory);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(draft => {
        const title = draft.title?.toLowerCase() ?? '';
        const content = draft.content?.toLowerCase() ?? '';
        return title.includes(query) || content.includes(query);
      });
    }

    return filtered;
  }
);

export const selectSortedAndFilteredDrafts = createSelector(
  [
    selectSortedDrafts,
    selectSearchQuery,
    selectFilterByCategory,
    selectShowEmptyDrafts,
  ],
  (sortedDrafts, searchQuery, filterByCategory, showEmptyDrafts) => {
    let filtered = [...sortedDrafts];

    // Filter by empty status
    if (!showEmptyDrafts) {
      filtered = filtered.filter(draft => !isDraftEmpty(draft));
    }

    // Filter by category
    if (filterByCategory) {
      filtered = filtered.filter(draft => draft.category_id === filterByCategory);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(draft => {
        const title = draft.title?.toLowerCase() ?? '';
        const content = draft.content?.toLowerCase() ?? '';
        return title.includes(query) || content.includes(query);
      });
    }

    return filtered;
  }
);

export const selectEmptyDrafts = createSelector(
  [(_state: RootState, drafts: Draft[]) => drafts],
  (drafts) => {
    return drafts.filter(draft => isDraftEmpty(draft));
  }
);

export const selectDraftsWithTitle = createSelector(
  [(_state: RootState, drafts: Draft[]) => drafts],
  (drafts) => {
    return drafts.filter(draft => draft.title && draft.title.trim().length > 0);
  }
);

export const selectDraftsWithContent = createSelector(
  [(_state: RootState, drafts: Draft[]) => drafts],
  (drafts) => {
    return drafts.filter(draft => draft.content && draft.content.trim().length > 0);
  }
);

export const selectDraftsWithCategory = createSelector(
  [(_state: RootState, drafts: Draft[]) => drafts],
  (drafts) => {
    return drafts.filter(draft => draft.category_id);
  }
);

export const selectDraftsByCategory = createSelector(
  [
    (_state: RootState, drafts: Draft[]) => drafts,
    (_state: RootState, _drafts: Draft[], categoryId: string) => categoryId,
  ],
  (drafts, categoryId) => {
    return drafts.filter(draft => draft.category_id === categoryId);
  }
);

export const selectDraftsGroupedByCategory = createSelector(
  [(_state: RootState, drafts: Draft[]) => drafts],
  (drafts) => {
    const grouped = drafts.reduce((acc, draft) => {
      const categoryId = draft.category_id || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(draft);
      return acc;
    }, {} as Record<string, Draft[]>);

    return Object.entries(grouped).map(([categoryId, items]) => ({
      categoryId: categoryId === 'uncategorized' ? null : categoryId,
      category: items[0]?.category ?? null,
      drafts: items,
      count: items.length,
    }));
  }
);

export const selectRecentDrafts = createSelector(
  [
    selectSortedDrafts,
    (_state: RootState, _drafts: Draft[], limit: number) => limit,
  ],
  (drafts, limit) => {
    return drafts.slice(0, limit);
  }
);

export const selectDraftsStats = createSelector(
  [(_state: RootState, drafts: Draft[]) => drafts],
  (drafts) => {
    const totalWordCount = drafts.reduce(
      (sum, draft) => sum + getWordCount(draft.content),
      0
    );
    
    return {
      total: drafts.length,
      withTitle: drafts.filter(d => d.title && d.title.trim().length > 0).length,
      withContent: drafts.filter(d => d.content && d.content.trim().length > 0).length,
      withCategory: drafts.filter(d => d.category_id).length,
      empty: drafts.filter(d => isDraftEmpty(d)).length,
      averageWordCount: drafts.length > 0 
        ? Math.round(totalWordCount / drafts.length) 
        : 0,
    };
  }
);

export const selectDraftWithDetails = createSelector(
  [
    (_state: RootState, drafts: Draft[]) => drafts,
    (_state: RootState, _drafts: Draft[], draftId: string) => draftId,
  ],
  (drafts, draftId) => {
    const draft = drafts.find(d => d.id === draftId);
    if (!draft) return null;

    return {
      ...draft,
      wordCount: getWordCount(draft.content),
      characterCount: getCharacterCount(draft.content),
      isEmpty: isDraftEmpty(draft),
      hasTitle: !!(draft.title && draft.title.trim().length > 0),
      hasContent: !!(draft.content && draft.content.trim().length > 0),
      hasCategory: !!draft.category_id,
    };
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectSearchQuery, selectFilterByCategory, selectShowEmptyDrafts],
  (searchQuery, filterByCategory, showEmptyDrafts) => {
    return searchQuery.trim().length > 0 || 
           filterByCategory !== null || 
           !showEmptyDrafts;
  }
);

export const selectIsEditingDraft = createSelector(
  [
    selectEditingDraftId,
    (_state: RootState, draftId: string) => draftId,
  ],
  (editingDraftId, draftId) => {
    return editingDraftId === draftId;
  }
);

export const selectDraftsWithUnsavedChanges = createSelector(
  [selectAutoSave],
  (autoSave) => {
    return Object.values(autoSave).filter(item => item.hasUnsavedChanges);
  }
);

export const selectHasUnsavedChanges = createSelector(
  [selectDraftsWithUnsavedChanges],
  (unsavedDrafts) => unsavedDrafts.length > 0
);

export const selectIsSavingDraft = createSelector(
  [
    selectAutoSave,
    (_state: RootState, draftId: string) => draftId,
  ],
  (autoSave, draftId) => {
    return autoSave[draftId]?.isSaving ?? false;
  }
);

export const selectLastSavedTime = createSelector(
  [
    selectAutoSave,
    (_state: RootState, draftId: string) => draftId,
  ],
  (autoSave, draftId) => {
    return autoSave[draftId]?.lastSaved ?? null;
  }
);