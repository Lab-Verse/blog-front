import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Update the import path below to match the actual location and filename of your auth.slice file.
// For example, if the file is named 'authSlice.ts' and located in 'src/app/redux/slices/auth/', use:
import { setAccessToken, logout } from "../slices/auth/authSlice";
import { cookies } from "../utils/cookies";

interface RefreshResponse {
  data?: {
    data?: {
      accessToken?: string;
    };
  };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Get token from cookies instead of Redux state
    const token = cookies.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extra) => {
  // console.log('[BaseAPI] Request:', args);
  let result = await rawBaseQuery(args, api, extra);
  // console.log('[BaseAPI] Response:', result);

  if (result.error && "status" in result.error && result.error.status === 401) {
    // Get refresh token from cookies
    const refreshToken = cookies.getRefreshToken();
    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refresh = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST", body: { refreshToken } },
      api,
      extra
    );

    const newAccess = (refresh as RefreshResponse)?.data?.data?.accessToken;
    if (newAccess) {
      // Update access token in cookie
      api.dispatch(setAccessToken(newAccess));
      result = await rawBaseQuery(args, api, extra);
    } else {
      api.dispatch(logout());
    }
  }

  // if (result.error) {
  //   console.error('[BaseAPI] Error:', result.error);
  // }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "UserProfile",
    "UserPosts",
    "UserDrafts",
    "UserBookmarks",
    "UserFollowers",
    "UserFollowing",
    "UserNotifications",
    "Post",
    "PostComments",
    "PostMedia",
    "PostTags",
    "PostReactions",
    "CommentReply",
    "CommentRepliesByComment",
    "Bookmark",
    "BookmarksByUser",
    "Reaction",
    "ReactionsByPost",
    "Tag",
    "TagPosts",
    "Category",
    "CategoryPosts",
    "CategoryFollowers",
    "Media",
    "MediaByUser",
    "Draft",
    "DraftsByUser",
    "Notification",
    "NotificationsByUser",
    "Question",
    "Answer",
    "AnswersByQuestion",
    "AuthorFollower", 
    "AuthorFollowers", 
    "AuthorFollowing",
    "View",
    "ViewsByUser",
    "ViewsByViewable",
  ],
  endpoints: () => ({}),
});
