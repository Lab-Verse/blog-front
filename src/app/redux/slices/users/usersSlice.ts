import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  UserState,
  User,
  UserProfile,
  Post,
  Draft,
  Bookmark,
  Follower,
  Following,
  Notification,
} from '../../types/users/userTypes';

const initialState: UserState = {
  users: [],
  selectedUser: null,
  userProfile: null,
  userPosts: [],
  userDrafts: [],
  userBookmarks: [],
  userFollowers: [],
  userFollowing: null,
  userNotifications: [],
  loading: false,
  error: null,
  uploadingProfilePicture: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set users
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set selected user
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    // Add user
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },

    // Update user in list
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },

    // Remove user from list
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },

    // Set user profile
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Update profile picture uploading state
    setUploadingProfilePicture: (state, action: PayloadAction<boolean>) => {
      state.uploadingProfilePicture = action.payload;
    },

    // Set user posts
    setUserPosts: (state, action: PayloadAction<Post[]>) => {
      state.userPosts = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set user drafts
    setUserDrafts: (state, action: PayloadAction<Draft[]>) => {
      state.userDrafts = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set user bookmarks
    setUserBookmarks: (state, action: PayloadAction<Bookmark[]>) => {
      state.userBookmarks = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set user followers
    setUserFollowers: (state, action: PayloadAction<Follower[]>) => {
      state.userFollowers = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set user following
    setUserFollowing: (state, action: PayloadAction<Following>) => {
      state.userFollowing = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set user notifications
    setUserNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.userNotifications = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Mark notification as read
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.userNotifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
    },

    // Mark all notifications as read
    markAllNotificationsAsRead: (state) => {
      state.userNotifications.forEach((notification) => {
        notification.isRead = true;
      });
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.userNotifications = [];
    },

    // Reset user state
    resetUserState: () => initialState,

    // Clear user data (for logout)
    clearUserData: (state) => {
      state.selectedUser = null;
      state.userProfile = null;
      state.userPosts = [];
      state.userDrafts = [];
      state.userBookmarks = [];
      state.userFollowers = [];
      state.userFollowing = null;
      state.userNotifications = [];
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUsers,
  setSelectedUser,
  addUser,
  updateUserInList,
  removeUser,
  setUserProfile,
  setUploadingProfilePicture,
  setUserPosts,
  setUserDrafts,
  setUserBookmarks,
  setUserFollowers,
  setUserFollowing,
  setUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  resetUserState,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;