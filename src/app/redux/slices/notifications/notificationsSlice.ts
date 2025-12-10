import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  Notification, 
  NotificationPreferences 
} from '../../types/notifications/notificationTypes';

interface NotificationsState {
  selectedNotification: Notification | null;
  selectedNotificationIds: string[];
  isDrawerOpen: boolean;
  viewMode: 'all' | 'unread' | 'read';
  filterByType: string | null;
  sortBy: 'recent' | 'oldest' | 'unread';
  searchQuery: string;
  isDeleting: boolean;
  preferences: NotificationPreferences;
  soundEnabled: boolean;
  lastChecked: string | null;
}

const initialState: NotificationsState = {
  selectedNotification: null,
  selectedNotificationIds: [],
  isDrawerOpen: false,
  viewMode: 'all',
  filterByType: null,
  sortBy: 'recent',
  searchQuery: '',
  isDeleting: false,
  preferences: {
    email: true,
    push: true,
    inApp: true,
    types: {
      comment: true,
      like: true,
      follow: true,
      mention: true,
      post: true,
      reply: true,
      system: true,
      warning: true,
      success: true,
      info: true,
      error: true,
    },
  },
  soundEnabled: true,
  lastChecked: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedNotification: (state, action: PayloadAction<Notification | null>) => {
      state.selectedNotification = action.payload;
    },

    addSelectedNotificationId: (state, action: PayloadAction<string>) => {
      if (!state.selectedNotificationIds.includes(action.payload)) {
        state.selectedNotificationIds.push(action.payload);
      }
    },

    removeSelectedNotificationId: (state, action: PayloadAction<string>) => {
      state.selectedNotificationIds = state.selectedNotificationIds.filter(
        id => id !== action.payload
      );
    },

    setSelectedNotificationIds: (state, action: PayloadAction<string[]>) => {
      state.selectedNotificationIds = action.payload;
    },

    toggleNotificationSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedNotificationIds.indexOf(action.payload);
      if (index > -1) {
        state.selectedNotificationIds.splice(index, 1);
      } else {
        state.selectedNotificationIds.push(action.payload);
      }
    },

    clearSelectedNotifications: (state) => {
      state.selectedNotificationIds = [];
      state.selectedNotification = null;
    },

    selectAllNotifications: (state, action: PayloadAction<string[]>) => {
      state.selectedNotificationIds = action.payload;
    },

    openNotificationDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeNotificationDrawer: (state) => {
      state.isDrawerOpen = false;
    },

    toggleNotificationDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    setViewMode: (state, action: PayloadAction<'all' | 'unread' | 'read'>) => {
      state.viewMode = action.payload;
    },

    setFilterByType: (state, action: PayloadAction<string | null>) => {
      state.filterByType = action.payload;
    },

    clearFilter: (state) => {
      state.filterByType = null;
    },

    setSortBy: (
      state,
      action: PayloadAction<'recent' | 'oldest' | 'unread'>
    ) => {
      state.sortBy = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },

    setIsDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },

    setPreferences: (state, action: PayloadAction<NotificationPreferences>) => {
      state.preferences = action.payload;
    },

    updatePreferences: (
      state,
      action: PayloadAction<Partial<NotificationPreferences>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    togglePreferenceType: (state, action: PayloadAction<string>) => {
      const type = action.payload as keyof NotificationPreferences['types'];
      if (state.preferences.types[type] !== undefined) {
        state.preferences.types[type] = !state.preferences.types[type];
      }
    },

    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },

    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },

    setLastChecked: (state, action: PayloadAction<string>) => {
      state.lastChecked = action.payload;
    },

    updateLastChecked: (state) => {
      state.lastChecked = new Date().toISOString();
    },

    resetNotificationsState: () => initialState,
  },
});

export const {
  setSelectedNotification,
  addSelectedNotificationId,
  removeSelectedNotificationId,
  setSelectedNotificationIds,
  toggleNotificationSelection,
  clearSelectedNotifications,
  selectAllNotifications,
  openNotificationDrawer,
  closeNotificationDrawer,
  toggleNotificationDrawer,
  setViewMode,
  setFilterByType,
  clearFilter,
  setSortBy,
  setSearchQuery,
  clearSearchQuery,
  setIsDeleting,
  setPreferences,
  updatePreferences,
  togglePreferenceType,
  setSoundEnabled,
  toggleSound,
  setLastChecked,
  updateLastChecked,
  resetNotificationsState,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;