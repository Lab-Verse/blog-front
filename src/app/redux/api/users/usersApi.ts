// apps/web/src/redux/services/users.api.ts
import type { ApiEnvelope } from '../../types/auth/authTypes'
import { baseApi } from '../baseApi'
import type {
  Bookmark,
  CreateUserDto,
  CreateUserProfileDto,
  Draft,
  Follower,
  Following,
  Notification,
  Post,
  UpdateUserDto,
  UpdateUserProfileDto,
  User,
  UserProfile,
} from './../../types/users/userTypes'

export const usersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // ---------- Users ----------
    getAllUsers: b.query<User[], void>({
      query: () => ({ url: '/users', method: 'GET' }),
      transformResponse: (res: ApiEnvelope<User[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [{ type: 'User' as const, id: 'LIST' }, ...result.map(({ id }) => ({ type: 'User' as const, id }))]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    getUserById: b.query<User, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<User>) => res.data ?? ({} as User),
      providesTags: (_res, _err, id) => [{ type: 'User' as const, id }],
    }),

    createUser: b.mutation<User, CreateUserDto>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<User>) => res.data ?? ({} as User),
      invalidatesTags: [{ type: 'User' as const, id: 'LIST' }],
    }),

    updateUser: b.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<User>) => res.data ?? ({} as User),
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' },
      ],
    }),

    deleteUser: b.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'User' as const, id },
        { type: 'User' as const, id: 'LIST' },
      ],
    }),

    // ---------- Profile ----------
    getUserProfile: b.query<UserProfile, string>({
      query: (userId) => ({ url: `/users/${userId}/profile`, method: "GET" }),
      providesTags: (_res, _err, userId) => [
        { type: "UserProfile" as const, id: userId },
      ],
    }),
    // getUserProfile: b.query<UserProfile, string>({
    //   query: (userId) => ({ url: `/users/${userId}/profile`, method: 'GET' }),
    //   transformResponse: (res: ApiEnvelope<UserProfile>) => {
    //     const userProfile = res.data ?? {}
    //     return { ...userProfile, profile_picture: userProfile.profile_picture || '/default-avatar.png' }
    //   },
    //   providesTags: (_res, _err, userId) => [{ type: 'UserProfile' as const, id: userId }],
    // }),

    createUserProfile: b.mutation<UserProfile, { userId: string; data: CreateUserProfileDto }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/profile`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<UserProfile>) => res.data ?? ({} as UserProfile),
      invalidatesTags: (_res, _err, { userId }) => [{ type: 'UserProfile' as const, id: userId }],
    }),

    updateUserProfile: b.mutation<UserProfile, { userId: string; data: UpdateUserProfileDto }>({
      query: ({ userId, data }) => ({
        url: `/users/${userId}/profile`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<UserProfile>) => res.data ?? ({} as UserProfile),
      invalidatesTags: (_res, _err, { userId }) => [{ type: 'UserProfile' as const, id: userId }],
    }),

    uploadProfilePicture: b.mutation<UserProfile, { userId: string; file: File }>({
      query: ({ userId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: `/users/${userId}/profile/upload`,
          method: 'POST',
          body: formData,
        }
      },
      transformResponse: (res: ApiEnvelope<UserProfile>) => res.data ?? ({} as UserProfile),
      invalidatesTags: (_res, _err, { userId }) => [{ type: 'UserProfile' as const, id: userId }],
    }),

    deleteUserProfile: b.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/profile`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, userId) => [{ type: 'UserProfile' as const, id: userId }],
    }),

    // ---------- Content ----------
    // NOTE: Renamed from getUserPosts to avoid collision with postsApi.getUserPosts
    getUserPostsSimple: b.query<Post[], string>({
      query: (userId) => `/users/${userId}/posts`,
      transformResponse: (res: any) => (Array.isArray(res) ? res : (res.data ?? [])),
    }),

    getUserDrafts: b.query<Draft[], string>({
      query: (userId) => ({ url: `/users/${userId}/drafts`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Draft[]>) => res.data ?? [],
      providesTags: (_res, _err, userId) => [{ type: 'UserDrafts' as const, id: userId }],
    }),

    getUserBookmarks: b.query<Bookmark[], string>({
      query: (userId) => ({ url: `/users/${userId}/bookmarks`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Bookmark[]>) => res.data ?? [],
      providesTags: (_res, _err, userId) => [{ type: 'UserBookmarks' as const, id: userId }],
    }),

    // ---------- Social ----------
    getUserFollowers: b.query<Follower[], string>({
      query: (userId) => ({ url: `/users/${userId}/followers`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Follower[]>) => res.data ?? [],
      providesTags: (_res, _err, userId) => [{ type: 'UserFollowers' as const, id: userId }],
    }),

    getUserFollowing: b.query<Following, string>({
      query: (userId) => ({ url: `/users/${userId}/following`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Following>) => res.data ?? ({} as Following),
      providesTags: (_res, _err, userId) => [{ type: 'UserFollowing' as const, id: userId }],
    }),

    // ---------- Notifications ----------
    getUserNotifications: b.query<Notification[], string>({
      query: (userId) => ({
        url: `/users/${userId}/notifications`,
        method: 'GET',
      }),
      transformResponse: (res: ApiEnvelope<Notification[]>) => res.data ?? [],
      providesTags: (_res, _err, userId) => [{ type: 'UserNotifications' as const, id: userId }],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserProfileQuery,
  useCreateUserProfileMutation,
  useUpdateUserProfileMutation,
  useUploadProfilePictureMutation,
  useDeleteUserProfileMutation,
  useGetUserPostsSimpleQuery,
  useGetUserDraftsQuery,
  useGetUserBookmarksQuery,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useGetUserNotificationsQuery,
} = usersApi
