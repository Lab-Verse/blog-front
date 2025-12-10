import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { Notification } from "../../types/notifications/notificationTypes";

// Helper function to check if notification is from today
const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const notificationDate = new Date(date);
  return (
    notificationDate.getDate() === today.getDate() &&
    notificationDate.getMonth() === today.getMonth() &&
    notificationDate.getFullYear() === today.getFullYear()
  );
};

// Helper function to check if notification is from this week
const isThisWeek = (date: Date | string): boolean => {
  const today = new Date();
  const notificationDate = new Date(date);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  return notificationDate >= weekAgo;
};

// Base selectors
export const selectNotificationsState = (state: RootState) =>
  state.notifications;

export const selectSelectedNotification = (state: RootState) =>
  state.notifications.selectedNotification;

export const selectSelectedNotificationIds = (state: RootState) =>
  state.notifications.selectedNotificationIds;

export const selectIsDrawerOpen = (state: RootState) =>
  state.notifications.isDrawerOpen;

export const selectViewMode = (state: RootState) =>
  state.notifications.viewMode;

export const selectFilterByType = (state: RootState) =>
  state.notifications.filterByType;

export const selectSortBy = (state: RootState) => state.notifications.sortBy;

export const selectSearchQuery = (state: RootState) =>
  state.notifications.searchQuery;

export const selectIsDeleting = (state: RootState) =>
  state.notifications.isDeleting;

export const selectPreferences = (state: RootState) =>
  state.notifications.preferences;

export const selectSoundEnabled = (state: RootState) =>
  state.notifications.soundEnabled;

export const selectLastChecked = (state: RootState) =>
  state.notifications.lastChecked;

// Memoized selectors
export const selectIsNotificationSelected = createSelector(
  [
    selectSelectedNotificationIds,
    (_state: RootState, notificationId: string) => notificationId,
  ],
  (selectedIds, notificationId) => {
    return selectedIds.includes(notificationId);
  }
);

export const selectHasSelectedNotifications = createSelector(
  [selectSelectedNotificationIds],
  (selectedIds) => selectedIds.length > 0
);

export const selectSelectedNotificationsCount = createSelector(
  [selectSelectedNotificationIds],
  (selectedIds) => selectedIds.length
);

export const selectNotificationById = createSelector(
  [
    (_state: RootState, notifications: Notification[]) => notifications,
    (
      _state: RootState,
      _notifications: Notification[],
      notificationId: string
    ) => notificationId,
  ],
  (notifications, notificationId) => {
    return notifications.find((n) => n.id === notificationId) ?? null;
  }
);

export const selectNotificationsByIds = createSelector(
  [
    (_state: RootState, notifications: Notification[]) => notifications,
    selectSelectedNotificationIds,
  ],
  (notifications, selectedIds) => {
    return notifications.filter((n) => selectedIds.includes(n.id));
  }
);

export const selectUnreadNotifications = createSelector(
  [(_state: RootState, notifications: Notification[]) => notifications],
  (notifications) => {
    return notifications.filter((n) => !n.isRead);
  }
);

export const selectReadNotifications = createSelector(
  [(_state: RootState, notifications: Notification[]) => notifications],
  (notifications) => {
    return notifications.filter((n) => n.isRead);
  }
);

export const selectUnreadCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications) => unreadNotifications.length
);

export const selectHasUnreadNotifications = createSelector(
  [selectUnreadCount],
  (unreadCount) => unreadCount > 0
);

export const selectSortedNotifications = createSelector(
  [
    (_state: RootState, notifications: Notification[]) => notifications,
    selectSortBy,
  ],
  (notifications, sortBy) => {
    const sorted = [...notifications];

    switch (sortBy) {
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "unread":
        sorted.sort((a, b) => {
          if (a.isRead === b.isRead) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          return a.isRead ? 1 : -1;
        });
        break;
    }

    return sorted;
  }
);

export const selectFilteredNotifications = createSelector(
  [
    (_state: RootState, notifications: Notification[]) => notifications,
    selectViewMode,
    selectFilterByType,
    selectSearchQuery,
  ],
  (notifications, viewMode, filterByType, searchQuery) => {
    let filtered = [...notifications];

    // Filter by view mode
    switch (viewMode) {
      case "unread":
        filtered = filtered.filter((n) => !n.isRead);
        break;
      case "read":
        filtered = filtered.filter((n) => n.isRead);
        break;
      // 'all' shows everything
    }

    // Filter by type
    if (filterByType) {
      filtered = filtered.filter((n) => n.type === filterByType);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectSortedAndFilteredNotifications = createSelector(
  [
    selectSortedNotifications,
    selectViewMode,
    selectFilterByType,
    selectSearchQuery,
  ],
  (sortedNotifications, viewMode, filterByType, searchQuery) => {
    let filtered = [...sortedNotifications];

    // Filter by view mode
    switch (viewMode) {
      case "unread":
        filtered = filtered.filter((n) => !n.isRead);
        break;
      case "read":
        filtered = filtered.filter((n) => n.isRead);
        break;
    }

    // Filter by type
    if (filterByType) {
      filtered = filtered.filter((n) => n.type === filterByType);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectNotificationsByType = createSelector(
  [
    (_state: RootState, notifications: Notification[]) => notifications,
    (_state: RootState, _notifications: Notification[], type: string) => type,
  ],
  (notifications, type) => {
    return notifications.filter((n) => n.type === type);
  }
);

export const selectNotificationsGroupedByType = createSelector(
  [(_state: RootState, notifications: Notification[]) => notifications],
  (notifications) => {
    const grouped = notifications.reduce((acc, notification) => {
      const type = notification.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);

    return Object.entries(grouped).map(([type, items]) => ({
      type,
      notifications: items,
      count: items.length,
      unreadCount: items.filter((n) => !n.isRead).length,
    }));
  }
);

export const selectNotificationsGroupedByDate = createSelector(
  [selectSortedNotifications],
  (notifications) => {
    const grouped = notifications.reduce((acc, notification) => {
      const date = new Date(notification.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      notifications: items,
      count: items.length,
      unreadCount: items.filter((n) => !n.isRead).length,
    }));
  }
);

export const selectRecentNotifications = createSelector(
  [
    selectSortedNotifications,
    (_state: RootState, _notifications: Notification[], limit: number) => limit,
  ],
  (notifications, limit) => {
    return notifications.slice(0, limit);
  }
);

export const selectTodayNotifications = createSelector(
  [(_state: RootState, notifications: Notification[]) => notifications],
  (notifications) => {
    return notifications.filter((n) => isToday(n.createdAt));
  }
);

export const selectThisWeekNotifications = createSelector(
  [(_state: RootState, notifications: Notification[]) => notifications],
  (notifications) => {
    return notifications.filter((n) => isThisWeek(n.createdAt));
  }
);

export const selectNotificationsStats = createSelector(
  [(_state: RootState, notifications: Notification[]) => notifications],
  (notifications) => {
    const byType = notifications.reduce((acc, notification) => {
      const type = notification.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      read: notifications.filter((n) => n.isRead).length,
      byType,
      today: notifications.filter((n) => isToday(n.createdAt)).length,
      thisWeek: notifications.filter((n) => isThisWeek(n.createdAt)).length,
    };
  }
);

export const selectNewNotifications = createSelector(
  [
    (_state: RootState, notifications: Notification[]) => notifications,
    selectLastChecked,
  ],
  (notifications, lastChecked) => {
    if (!lastChecked) return notifications;

    const lastCheckedDate = new Date(lastChecked);
    return notifications.filter((n) => new Date(n.createdAt) > lastCheckedDate);
  }
);

export const selectNewNotificationsCount = createSelector(
  [selectNewNotifications],
  (newNotifications) => newNotifications.length
);

export const selectHasNewNotifications = createSelector(
  [selectNewNotificationsCount],
  (count) => count > 0
);

export const selectHasSearchQuery = createSelector(
  [selectSearchQuery],
  (searchQuery) => searchQuery.trim().length > 0
);

export const selectHasActiveFilters = createSelector(
  [selectViewMode, selectFilterByType, selectSearchQuery],
  (viewMode, filterByType, searchQuery) => {
    return (
      viewMode !== "all" ||
      filterByType !== null ||
      searchQuery.trim().length > 0
    );
  }
);

export const selectIsTypeEnabled = createSelector(
  [selectPreferences, (_state: RootState, type: string) => type],
  (preferences, type) => {
    return preferences.types[type as keyof typeof preferences.types] ?? true;
  }
);
