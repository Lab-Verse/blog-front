import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { View } from '../../types/views/viewTypes';

// Helper functions
const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const viewDate = new Date(date);
  return (
    viewDate.getDate() === today.getDate() &&
    viewDate.getMonth() === today.getMonth() &&
    viewDate.getFullYear() === today.getFullYear()
  );
};

const isThisWeek = (date: Date | string): boolean => {
  const today = new Date();
  const viewDate = new Date(date);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return viewDate >= weekAgo;
};

const isThisMonth = (date: Date | string): boolean => {
  const today = new Date();
  const viewDate = new Date(date);
  return (
    viewDate.getMonth() === today.getMonth() &&
    viewDate.getFullYear() === today.getFullYear()
  );
};

// Base selectors
export const selectViewsState = (state: RootState) => state.views;

export const selectSelectedView = (state: RootState) => 
  state.views.selectedView;

export const selectFilterByType = (state: RootState) => 
  state.views.filterByType;

export const selectFilterByUser = (state: RootState) => 
  state.views.filterByUser;

export const selectFilterByViewable = (state: RootState) => 
  state.views.filterByViewable;

export const selectSortBy = (state: RootState) => 
  state.views.sortBy;

export const selectSearchQuery = (state: RootState) => 
  state.views.searchQuery;

export const selectDateRange = (state: RootState) => 
  state.views.dateRange;

export const selectTrackedViews = (state: RootState) => 
  state.views.trackedViews;

export const selectViewDebounceMap = (state: RootState) => 
  state.views.viewDebounceMap;

export const selectTrackingConfig = (state: RootState) => 
  state.views.trackingConfig;

// Memoized selectors
export const selectIsViewTracked = createSelector(
  [
    selectTrackedViews,
    (_state: RootState, viewableKey: string) => viewableKey,
  ],
  (trackedViews, viewableKey) => {
    return trackedViews.includes(viewableKey);
  }
);

export const selectCanTrackView = createSelector(
  [
    selectViewDebounceMap,
    selectTrackingConfig,
    (_state: RootState, viewableKey: string) => viewableKey,
  ],
  (debounceMap, config, viewableKey) => {
    const lastTracked = debounceMap[viewableKey];
    if (!lastTracked) return true;
    
    const now = Date.now();
    return now - lastTracked >= config.debounceTime;
  }
);

export const selectViewById = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    (_state: RootState, _views: View[], viewId: string) => viewId,
  ],
  (views, viewId) => {
    return views.find(v => v.id === viewId) ?? null;
  }
);

export const selectSortedViews = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    selectSortBy,
  ],
  (views, sortBy) => {
    const sorted = [...views];

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
    }

    return sorted;
  }
);

export const selectFilteredViews = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    selectFilterByType,
    selectFilterByUser,
    selectFilterByViewable,
    selectDateRange,
    selectSearchQuery,
  ],
  (views, filterByType, filterByUser, filterByViewable, dateRange, searchQuery) => {
    let filtered = [...views];

    if (filterByType) {
      filtered = filtered.filter(v => v.viewable_type === filterByType);
    }

    if (filterByUser) {
      filtered = filtered.filter(v => v.user_id === filterByUser);
    }

    if (filterByViewable) {
      filtered = filtered.filter(v => v.viewable_id === filterByViewable);
    }

    if (dateRange.startDate) {
      filtered = filtered.filter(v => 
        new Date(v.created_at) >= new Date(dateRange.startDate!)
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(v => 
        new Date(v.created_at) <= new Date(dateRange.endDate!)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.ip_address.toLowerCase().includes(query) ||
        v.user?.username?.toLowerCase().includes(query) ||
        v.user?.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectSortedAndFilteredViews = createSelector(
  [
    selectSortedViews,
    selectFilterByType,
    selectFilterByUser,
    selectFilterByViewable,
    selectDateRange,
    selectSearchQuery,
  ],
  (sortedViews, filterByType, filterByUser, filterByViewable, dateRange, searchQuery) => {
    let filtered = [...sortedViews];

    if (filterByType) {
      filtered = filtered.filter(v => v.viewable_type === filterByType);
    }

    if (filterByUser) {
      filtered = filtered.filter(v => v.user_id === filterByUser);
    }

    if (filterByViewable) {
      filtered = filtered.filter(v => v.viewable_id === filterByViewable);
    }

    if (dateRange.startDate) {
      filtered = filtered.filter(v => 
        new Date(v.created_at) >= new Date(dateRange.startDate!)
      );
    }
    if (dateRange.endDate) {
      filtered = filtered.filter(v => 
        new Date(v.created_at) <= new Date(dateRange.endDate!)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.ip_address.toLowerCase().includes(query) ||
        v.user?.username?.toLowerCase().includes(query) ||
        v.user?.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectAuthenticatedViews = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return views.filter(v => v.user_id !== null);
  }
);

export const selectAnonymousViews = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return views.filter(v => v.user_id === null);
  }
);

export const selectViewsByType = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    (_state: RootState, _views: View[], type: string) => type,
  ],
  (views, type) => {
    return views.filter(v => v.viewable_type === type);
  }
);

export const selectViewsByViewable = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    (_state: RootState, _views: View[], viewableId: string, viewableType: string) => 
      ({ viewableId, viewableType }),
  ],
  (views, { viewableId, viewableType }) => {
    return views.filter(v => 
      v.viewable_id === viewableId && v.viewable_type === viewableType
    );
  }
);

export const selectViewsByUser = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    (_state: RootState, _views: View[], userId: string) => userId,
  ],
  (views, userId) => {
    return views.filter(v => v.user_id === userId);
  }
);

export const selectViewsGroupedByType = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    const grouped = views.reduce((acc, view) => {
      const type = view.viewable_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(view);
      return acc;
    }, {} as Record<string, View[]>);

    return Object.entries(grouped).map(([type, items]) => ({
      type,
      views: items,
      count: items.length,
    }));
  }
);

export const selectViewsGroupedByViewable = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    const grouped = views.reduce((acc, view) => {
      const key = `${view.viewable_type}-${view.viewable_id}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(view);
      return acc;
    }, {} as Record<string, View[]>);

    return Object.entries(grouped).map(([key, items]) => {
      const [viewableType, viewableId] = key.split('-');
      const uniqueUsers = new Set(items.filter(v => v.user_id).map(v => v.user_id)).size;
      const uniqueIPs = new Set(items.map(v => v.ip_address)).size;

      return {
        viewableId,
        viewableType,
        views: items,
        count: items.length,
        uniqueUsers,
        uniqueIPs,
      };
    });
  }
);

export const selectViewsGroupedByDate = createSelector(
  [selectSortedViews],
  (views) => {
    const grouped = views.reduce((acc, view) => {
      const date = new Date(view.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(view);
      return acc;
    }, {} as Record<string, View[]>);

    return Object.entries(grouped).map(([date, items]) => {
      const uniqueVisitors = new Set(
        items.map(v => v.user_id || v.ip_address)
      ).size;

      return {
        date,
        count: items.length,
        uniqueVisitors,
        views: items,
      };
    });
  }
);

export const selectViewsGroupedByHour = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    const grouped = views.reduce((acc, view) => {
      const hour = new Date(view.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return grouped;
  }
);

export const selectTodayViews = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return views.filter(v => isToday(v.created_at));
  }
);

export const selectThisWeekViews = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return views.filter(v => isThisWeek(v.created_at));
  }
);

export const selectThisMonthViews = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return views.filter(v => isThisMonth(v.created_at));
  }
);

export const selectRecentViews = createSelector(
  [
    selectSortedViews,
    (_state: RootState, _views: View[], limit: number) => limit,
  ],
  (views, limit) => {
    return views.slice(0, limit);
  }
);

export const selectUniqueViewers = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return new Set(views.map(v => v.user_id || v.ip_address)).size;
  }
);

export const selectUniqueUsers = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return new Set(views.filter(v => v.user_id).map(v => v.user_id)).size;
  }
);

export const selectUniqueIPs = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    return new Set(views.map(v => v.ip_address)).size;
  }
);

export const selectTopViewers = createSelector(
  [
    (_state: RootState, views: View[]) => views,
    (_state: RootState, _views: View[], limit: number) => limit,
  ],
  (views, limit) => {
    const userViews = views.filter(v => v.user_id && v.user);
    
    const viewCounts = userViews.reduce((acc, view) => {
      const userId = view.user_id!;
      if (!acc[userId]) {
        acc[userId] = { user: view.user!, count: 0 };
      }
      acc[userId].count++;
      return acc;
    }, {} as Record<string, { user: unknown; count: number }>);

    return Object.values(viewCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => item.user);
  }
);

export const selectViewsStats = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    const byType = views.reduce((acc, view) => {
      const type = view.viewable_type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: views.length,
      authenticated: views.filter(v => v.user_id !== null).length,
      anonymous: views.filter(v => v.user_id === null).length,
      uniqueUsers: new Set(views.filter(v => v.user_id).map(v => v.user_id)).size,
      uniqueIPs: new Set(views.map(v => v.ip_address)).size,
      today: views.filter(v => isToday(v.created_at)).length,
      thisWeek: views.filter(v => isThisWeek(v.created_at)).length,
      thisMonth: views.filter(v => isThisMonth(v.created_at)).length,
      byType,
    };
  }
);

export const selectViewAnalytics = createSelector(
  [(_state: RootState, views: View[]) => views],
  (views) => {
    if (views.length === 0) {
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        averageViewsPerDay: 0,
        peakViewDate: '',
        peakViewCount: 0,
        viewsByHour: {},
        viewsByDay: {},
        topViewers: [],
        recentViews: [],
      };
    }

    const uniqueVisitors = new Set(
      views.map(v => v.user_id || v.ip_address)
    ).size;

    const viewsByDay = views.reduce((acc, view) => {
      const date = new Date(view.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakEntry = Object.entries(viewsByDay).reduce(
      (max, [date, count]) => 
        count > max.count ? { date, count } : max,
      { date: '', count: 0 }
    );

    const viewsByHour = views.reduce((acc, view) => {
      const hour = new Date(view.created_at).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const uniqueDates = Object.keys(viewsByDay).length;
    const averageViewsPerDay = uniqueDates > 0 
      ? Math.round(views.length / uniqueDates) 
      : 0;

    const userViews = views.filter(v => v.user_id && v.user);
    const viewCounts = userViews.reduce((acc, view) => {
      const userId = view.user_id!;
      if (!acc[userId]) {
        acc[userId] = { user: view.user!, count: 0 };
      }
      acc[userId].count++;
      return acc;
    }, {} as Record<string, { user: unknown; count: number }>);

    const topViewers = Object.values(viewCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(item => item.user);

    const recentViews = [...views]
      .sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);

    return {
      totalViews: views.length,
      uniqueVisitors,
      averageViewsPerDay,
      peakViewDate: peakEntry.date,
      peakViewCount: peakEntry.count,
      viewsByHour,
      viewsByDay,
      topViewers,
      recentViews,
    };
  }
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [
    selectFilterByType,
    selectFilterByUser,
    selectFilterByViewable,
    selectDateRange,
    selectSearchQuery,
  ],
  (filterByType, filterByUser, filterByViewable, dateRange, searchQuery) => {
    return filterByType !== null || 
           filterByUser !== null || 
           filterByViewable !== null ||
           dateRange.startDate !== null ||
           dateRange.endDate !== null ||
           searchQuery.trim().length > 0;
  }
);
