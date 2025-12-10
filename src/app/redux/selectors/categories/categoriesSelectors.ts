import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { Category, CategoryTree } from '../../types/categories/categoryTypes';

// Base selectors
export const selectCategoriesState = (state: RootState) => state.categories;

export const selectSelectedCategory = (state: RootState) => 
  state.categories.selectedCategory;

export const selectSelectedCategories = (state: RootState) => 
  state.categories.selectedCategories;

export const selectIsCreating = (state: RootState) => 
  state.categories.isCreating;

export const selectIsEditing = (state: RootState) => 
  state.categories.isEditing;

export const selectEditingCategoryId = (state: RootState) => 
  state.categories.editingCategoryId;

export const selectSearchQuery = (state: RootState) => 
  state.categories.searchQuery;

export const selectSortBy = (state: RootState) => 
  state.categories.sortBy;

export const selectViewMode = (state: RootState) => 
  state.categories.viewMode;

export const selectShowInactive = (state: RootState) => 
  state.categories.showInactive;

export const selectFilterByParent = (state: RootState) => 
  state.categories.filterByParent;

export const selectExpandedCategories = (state: RootState) => 
  state.categories.expandedCategories;

// Memoized selectors
export const selectIsCategorySelected = createSelector(
  [
    selectSelectedCategories,
    (_state: RootState, categoryId: string) => categoryId,
  ],
  (selectedCategories, categoryId) => {
    return selectedCategories.some(cat => cat.id === categoryId);
  }
);

export const selectSelectedCategoryIds = createSelector(
  [selectSelectedCategories],
  (selectedCategories) => selectedCategories.map(cat => cat.id)
);

export const selectHasSelectedCategories = createSelector(
  [selectSelectedCategories],
  (selectedCategories) => selectedCategories.length > 0
);

export const selectSelectedCategoriesCount = createSelector(
  [selectSelectedCategories],
  (selectedCategories) => selectedCategories.length
);

export const selectIsCategoryExpanded = createSelector(
  [
    selectExpandedCategories,
    (_state: RootState, categoryId: string) => categoryId,
  ],
  (expandedCategories, categoryId) => {
    return expandedCategories.includes(categoryId);
  }
);

export const selectCategoryById = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], categoryId: string) => categoryId,
  ],
  (categories, categoryId) => {
    return categories.find(cat => cat.id === categoryId) ?? null;
  }
);

export const selectCategoryBySlug = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], slug: string) => slug,
  ],
  (categories, slug) => {
    return categories.find(cat => cat.slug === slug) ?? null;
  }
);

export const selectActiveCategories = createSelector(
  [(_state: RootState, categories: Category[]) => categories],
  (categories) => {
    return categories.filter(cat => cat.is_active);
  }
);

export const selectInactiveCategories = createSelector(
  [(_state: RootState, categories: Category[]) => categories],
  (categories) => {
    return categories.filter(cat => !cat.is_active);
  }
);

export const selectRootCategories = createSelector(
  [(_state: RootState, categories: Category[]) => categories],
  (categories) => {
    return categories.filter(cat => !cat.parent_id);
  }
);

export const selectChildCategories = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], parentId: string) => parentId,
  ],
  (categories, parentId) => {
    return categories.filter(cat => cat.parent_id === parentId);
  }
);

export const selectSortedCategories = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    selectSortBy,
  ],
  (categories, sortBy) => {
    const sorted = [...categories];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        sorted.sort((a, b) => b.followers_count - a.followers_count);
        break;
      case 'recent':
        sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'posts':
        sorted.sort((a, b) => b.posts_count - a.posts_count);
        break;
    }

    return sorted;
  }
);

export const selectFilteredCategories = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    selectSearchQuery,
    selectShowInactive,
    selectFilterByParent,
  ],
  (categories, searchQuery, showInactive, filterByParent) => {
    let filtered = [...categories];

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(cat => cat.is_active);
    }

    // Filter by parent
    if (filterByParent !== null) {
      filtered = filtered.filter(cat => cat.parent_id === filterByParent);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectSortedAndFilteredCategories = createSelector(
  [
    selectSortedCategories,
    selectSearchQuery,
    selectShowInactive,
    selectFilterByParent,
  ],
  (sortedCategories, searchQuery, showInactive, filterByParent) => {
    let filtered = [...sortedCategories];

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(cat => cat.is_active);
    }

    // Filter by parent
    if (filterByParent !== null) {
      filtered = filtered.filter(cat => cat.parent_id === filterByParent);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cat => 
        cat.name.toLowerCase().includes(query) ||
        cat.slug.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectCategoryTree = createSelector(
  [(_state: RootState, categories: Category[]) => categories],
  (categories) => {
    const buildTree = (parentId: string | null = null): CategoryTree[] => {
      return categories
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
          category: cat,
          children: buildTree(cat.id),
        }));
    };

    return buildTree(null);
  }
);

export const selectCategoryBreadcrumbs = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], categoryId: string) => categoryId,
  ],
  (categories, categoryId) => {
    const breadcrumbs = [];
    let currentId: string | null | undefined = categoryId;

    while (currentId) {
      const category = categories.find(cat => cat.id === currentId);
      if (!category) break;
      
      breadcrumbs.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
      
      currentId = category.parent_id;
    }

    return breadcrumbs;
  }
);

export const selectPopularCategories = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], limit: number) => limit,
  ],
  (categories, limit) => {
    return [...categories]
      .sort((a, b) => b.followers_count - a.followers_count)
      .slice(0, limit);
  }
);

export const selectCategoriesWithMostPosts = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], limit: number) => limit,
  ],
  (categories, limit) => {
    return [...categories]
      .sort((a, b) => b.posts_count - a.posts_count)
      .slice(0, limit);
  }
);

export const selectRecentCategories = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], limit: number) => limit,
  ],
  (categories, limit) => {
    return [...categories]
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, limit);
  }
);

export const selectCategoriesStats = createSelector(
  [(_state: RootState, categories: Category[]) => categories],
  (categories) => {
    const totalPosts = categories.reduce((sum, cat) => sum + cat.posts_count, 0);
    const totalFollowers = categories.reduce((sum, cat) => sum + cat.followers_count, 0);
    const activeCount = categories.filter(cat => cat.is_active).length;
    const inactiveCount = categories.filter(cat => !cat.is_active).length;
    const rootCount = categories.filter(cat => !cat.parent_id).length;
    const averagePosts = categories.length > 0 
      ? Math.round(totalPosts / categories.length) 
      : 0;

    return {
      total: categories.length,
      active: activeCount,
      inactive: inactiveCount,
      root: rootCount,
      totalPosts,
      totalFollowers,
      averagePosts,
    };
  }
);

export const selectCategoryHierarchy = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], categoryId: string) => categoryId,
  ],
  (categories, categoryId) => {
    const getLevel = (id: string, currentLevel = 0): number => {
      const category = categories.find(cat => cat.id === id);
      if (!category || !category.parent_id) return currentLevel;
      return getLevel(category.parent_id, currentLevel + 1);
    };

    const getPath = (id: string, currentPath: string[] = []): string[] => {
      const category = categories.find(cat => cat.id === id);
      if (!category) return currentPath;
      
      const newPath = [category.id, ...currentPath];
      if (!category.parent_id) return newPath;
      
      return getPath(category.parent_id, newPath);
    };

    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return null;

    return {
      category,
      level: getLevel(categoryId),
      path: getPath(categoryId),
    };
  }
);

export const selectEmptyCategories = createSelector(
  [(_state: RootState, categories: Category[]) => categories],
  (categories) => {
    return categories.filter(cat => cat.posts_count === 0);
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectSearchQuery, selectFilterByParent, selectShowInactive],
  (searchQuery, filterByParent, showInactive) => {
    return searchQuery.trim().length > 0 || 
           filterByParent !== null || 
           showInactive;
  }
);

export const selectIsEditingCategory = createSelector(
  [
    selectEditingCategoryId,
    (_state: RootState, categoryId: string) => categoryId,
  ],
  (editingCategoryId, categoryId) => {
    return editingCategoryId === categoryId;
  }
);

export const selectCategoryDepth = createSelector(
  [
    (_state: RootState, categories: Category[]) => categories,
    (_state: RootState, _categories: Category[], categoryId: string) => categoryId,
  ],
  (categories, categoryId) => {
    let depth = 0;
    let currentId: string | null | undefined = categoryId;

    while (currentId) {
      const category = categories.find(cat => cat.id === currentId);
      if (!category || !category.parent_id) break;
      depth++;
      currentId = category.parent_id;
    }

    return depth;
  }
);