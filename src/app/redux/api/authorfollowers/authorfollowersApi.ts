import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  AuthorFollower,
  CreateAuthorFollowerDto,
} from "../../types/authorfollowers/authorfollowersTypes";

export const authorFollowersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Follow/Unfollow ----------
    followAuthor: builder.mutation<AuthorFollower, CreateAuthorFollowerDto>({
      query: (body) => ({ url: '/author-followers', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<AuthorFollower>) => 
        res.data ?? ({} as AuthorFollower),
      invalidatesTags: (_result, _error, { author_id, follower_id }) => [
        { type: 'AuthorFollower', id: 'LIST' },
        { type: 'AuthorFollowers', id: author_id },
        { type: 'AuthorFollowing', id: follower_id },
        { type: 'User', id: author_id },
        { type: 'User', id: follower_id },
      ],
    }),

    unfollowAuthor: builder.mutation<void, string>({
      query: (id) => ({ url: `/author-followers/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'AuthorFollower', id: 'LIST' },
      ],
    }),

    // ---------- Get Followers/Following ----------
    getFollowersByAuthor: builder.query<AuthorFollower[], string>({
      query: (authorId) => ({ 
        url: `/author-followers/followers/${authorId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<AuthorFollower[]>) => res.data ?? [],
      providesTags: (result, _error, authorId) =>
        result
          ? [
              { type: 'AuthorFollowers', id: authorId },
              ...result.map(({ id }) => ({ type: 'AuthorFollower' as const, id })),
            ]
          : [{ type: 'AuthorFollowers', id: authorId }],
    }),

    getFollowingByUser: builder.query<AuthorFollower[], string>({
      query: (userId) => ({ 
        url: `/author-followers/following/${userId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<AuthorFollower[]>) => res.data ?? [],
      providesTags: (result, _error, userId) =>
        result
          ? [
              { type: 'AuthorFollowing', id: userId },
              ...result.map(({ id }) => ({ type: 'AuthorFollower' as const, id })),
            ]
          : [{ type: 'AuthorFollowing', id: userId }],
    }),

    // ---------- Helper Mutations ----------
    toggleFollow: builder.mutation<
      { action: 'followed' | 'unfollowed'; relationship?: AuthorFollower },
      { userId: string; authorId: string; existingFollowId?: string }
    >({
      async queryFn(
        { userId, authorId, existingFollowId },
        _api,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          if (existingFollowId) {
            // Unfollow
            const unfollowResult = await fetchWithBQ({
              url: `/author-followers/${existingFollowId}`,
              method: 'DELETE',
            });
            
            if (unfollowResult.error) {
              return { error: unfollowResult.error };
            }
            
            return { data: { action: 'unfollowed' as const } };
          } else {
            // Follow
            const followResult = await fetchWithBQ({
              url: '/author-followers',
              method: 'POST',
              body: {
                follower_id: userId,
                author_id: authorId,
              },
            });
            
            if (followResult.error) {
              return { error: followResult.error };
            }
            
            const response = followResult.data as ApiEnvelope<AuthorFollower>;
            return { 
              data: { 
                action: 'followed' as const, 
                relationship: response.data 
              } 
            };
          }
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: (_result, _error, { userId, authorId }) => [
        { type: 'AuthorFollower', id: 'LIST' },
        { type: 'AuthorFollowers', id: authorId },
        { type: 'AuthorFollowing', id: userId },
        { type: 'User', id: authorId },
        { type: 'User', id: userId },
      ],
    }),

    // ---------- Bulk Operations ----------
    bulkFollowAuthors: builder.mutation<void, { userId: string; authorIds: string[] }>({
      async queryFn({ userId, authorIds }, _api, _extraOptions, fetchWithBQ) {
        try {
          const followPromises = authorIds.map(authorId =>
            fetchWithBQ({
              url: '/author-followers',
              method: 'POST',
              body: {
                follower_id: userId,
                author_id: authorId,
              },
            })
          );
          
          const results = await Promise.all(followPromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some follows failed' 
              } 
            };
          }
          
          return { data: undefined };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'AuthorFollower', id: 'LIST' },
        { type: 'AuthorFollowing', id: userId },
      ],
    }),

    bulkUnfollowAuthors: builder.mutation<void, string[]>({
      async queryFn(followIds, _api, _extraOptions, fetchWithBQ) {
        try {
          const unfollowPromises = followIds.map(id =>
            fetchWithBQ({ url: `/author-followers/${id}`, method: 'DELETE' })
          );
          
          const results = await Promise.all(unfollowPromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some unfollows failed' 
              } 
            };
          }
          
          return { data: undefined };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: [{ type: 'AuthorFollower', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useFollowAuthorMutation,
  useUnfollowAuthorMutation,
  useGetFollowersByAuthorQuery,
  useGetFollowingByUserQuery,
  useToggleFollowMutation,
  useBulkFollowAuthorsMutation,
  useBulkUnfollowAuthorsMutation,
} = authorFollowersApi;