import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './../../store';
import type { User, Notification, Post, Draft, Bookmark, Follower, UserProfile, Following } from '../../types/users/userTypes';

// Base selectors
export const selectUserState = (state: RootState) => state.users;

// Simple selectors
export const selectUsers = (state: RootState) => state.users.users;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;
export const selectUserProfile = (state: RootState) => state.users.userProfile;
export const selectUserPosts = (state: RootState) => state.users.userPosts;
export const selectUserDrafts = (state: RootState) => state.users.userDrafts;
export const selectUserBookmarks = (state: RootState) => state.users.userBookmarks;
export const selectUserFollowers = (state: RootState) => state.users.userFollowers;
export const selectUserFollowing = (state: RootState) => state.users.userFollowing;
export const selectUserNotifications = (state: RootState) => state.users.userNotifications;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;
export const selectUploadingProfilePicture = (state: RootState) => state.users.uploadingProfilePicture;

// Memoized selectors
export const selectUsersCount = createSelector(
  [selectUsers],
  (users) => users.length
);

export const selectActiveUsers = createSelector(
  [selectUsers],
  (users: User[]) => users.filter((user: User) => user.status === 'active')
);

export const selectInactiveUsers = createSelector(
  [selectUsers],
  (users: User[]) => users.filter((user: User) => user.status === 'inactive')
);

export const selectBannedUsers = createSelector(
  [selectUsers],
  (users: User[]) => users.filter((user: User) => user.status === 'banned')
);

// Get user by ID
export const selectUserById = (userId: string) =>
  createSelector([selectUsers], (users: User[]) =>
    users.find((user: User) => user.id === userId)
  );

// User profile selectors
export const selectUserFullName = createSelector(
  [selectUserProfile],
  (profile: UserProfile | null) => {
    if (!profile) return null;
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile.first_name || profile.last_name || null;
  }
);

export const selectUserProfilePictureUrl = createSelector(
  [selectUserProfile],
  (profile: UserProfile | null) => {
    if (!profile?.profile_picture) return null;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/profile-pictures/${profile.profile_picture}`;
  }
);

export const selectHasUserProfile = createSelector(
  [selectUserProfile],
  (profile: UserProfile | null) => profile !== null
);

// Posts selectors
export const selectUserPostsCount = createSelector(
  [selectUserPosts],
  (posts: Post[]) => posts.length
);

export const selectPublishedPosts = createSelector(
  [selectUserPosts],
  (posts: Post[]) => posts.filter((post: Post) => post.status === 'published')
);

export const selectDraftPosts = createSelector(
  [selectUserPosts],
  (posts: Post[]) => posts.filter((post: Post) => post.status === 'draft')
);

// Drafts selectors
export const selectUserDraftsCount = createSelector(
  [selectUserDrafts],
  (drafts: Draft[]) => drafts.length
);

// Bookmarks selectors
export const selectUserBookmarksCount = createSelector(
  [selectUserBookmarks],
  (bookmarks: Bookmark[]) => bookmarks.length
);

export const selectBookmarkedPostIds = createSelector(
  [selectUserBookmarks],
  (bookmarks: Bookmark[]) => bookmarks.map((bookmark: Bookmark) => bookmark.post_id)
);

export const isPostBookmarked = (postId: string) =>
  createSelector([selectBookmarkedPostIds], (bookmarkedIds: string[]) =>
    bookmarkedIds.includes(postId)
  );

// Followers selectors
export const selectUserFollowersCount = createSelector(
  [selectUserFollowers],
  (followers: Follower[]) => followers.length
);

export const selectFollowerIds = createSelector(
  [selectUserFollowers],
  (followers: Follower[]) => followers.map((follower: Follower) => follower.id)
);

// Following selectors
export const selectFollowingCount = createSelector(
  [selectUserFollowing],
  (following: Following | null) => following?.following?.length || 0
);

export const selectTotalFollowingCount = createSelector(
  [selectFollowingCount],
  (count: number) => count
);

export const selectFollowingAuthorIds = createSelector(
  [selectUserFollowing],
  (following: Following | null) => following?.following?.map((f: { author_id: string }) => f.author_id) || []
);

export const isFollowingAuthor = (authorId: string) =>
  createSelector([selectFollowingAuthorIds], (followingIds: string[]) =>
    followingIds.includes(authorId)
  );

// Notifications selectors
export const selectUserNotificationsCount = createSelector(
  [selectUserNotifications],
  (notifications: Notification[]) => notifications.length
);

export const selectUnreadNotifications = createSelector(
  [selectUserNotifications],
  (notifications: Notification[]) => notifications.filter((n: Notification) => !n.isRead)
);

export const selectUnreadNotificationsCount = createSelector(
  [selectUnreadNotifications],
  (unreadNotifications: Notification[]) => unreadNotifications.length
);

export const selectHasUnreadNotifications = createSelector(
  [selectUnreadNotificationsCount],
  (count: number) => count > 0
);

export const selectNotificationsByType = (type: string) =>
  createSelector([selectUserNotifications], (notifications: Notification[]) =>
    notifications.filter((n: Notification) => n.type === type)
  );

// Combined user stats
export const selectUserStats = createSelector(
  [
    selectUserProfile,
    selectUserPostsCount,
    selectUserFollowersCount,
    selectFollowingCount,
  ],
  (profile: UserProfile | null, postsCount: number, followersCount: number, followingCount: number) => ({
    postsCount: profile?.posts_count || postsCount,
    followersCount: profile?.followers_count || followersCount,
    followingCount: profile?.following_count || followingCount,
  })
);

// User search/filter
export const selectUsersByRole = (role: string) =>
  createSelector([selectUsers], (users: User[]) =>
    users.filter((user: User) => user.role === role)
  );

export const selectUsersByStatus = (status: string) =>
  createSelector([selectUsers], (users: User[]) =>
    users.filter((user: User) => user.status === status)
  );

export const searchUsersByUsername = (searchTerm: string) =>
  createSelector([selectUsers], (users: User[]) =>
    users.filter((user: User) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

export const searchUsersByEmail = (searchTerm: string) =>
  createSelector([selectUsers], (users: User[]) =>
    users.filter((user: User) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

// Check if current data is loading
export const selectIsUserDataLoading = createSelector(
  [selectUserLoading, selectUploadingProfilePicture],
  (loading: boolean, uploading: boolean) => loading || uploading
);

// Error state
export const selectHasUserError = createSelector(
  [selectUserError],
  (error: string | null) => error !== null
);