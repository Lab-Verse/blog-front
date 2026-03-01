import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Post,
  Comment,
  PostMedia,
  PostTag,
  CreatePostDto,
  UpdatePostDto,
  PostFilters,
} from "../../types/posts/postTypes";
import type { Reaction } from "../../types/reactions/reactionTypes";
import { extractArrayFromResponse, extractObjectFromResponse } from "@/utils/apiHelpers";

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Posts CRUD ----------
    getAllPosts: builder.query<Post[], PostFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.userId) params.append('userId', filters.userId);

        return {
          url: `/posts${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (res: unknown) => {
        const posts = extractArrayFromResponse<Post>(res);
        return posts;
      },
      providesTags: (result) =>
        result
          ? [
            { type: 'Post', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Post' as const, id })),
          ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    getPostById: builder.query<Post, string>({
      query: (id) => ({ url: `/posts/${id}`, method: 'GET' }),
      transformResponse: (res: unknown) => {
        return extractObjectFromResponse<Post>(res) ?? ({} as Post);
      },
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),

    createPost: builder.mutation<Post, CreatePostDto | FormData>({
      query: (body) => {
        // If body is FormData, it already contains the file and data
        if (body instanceof FormData) {
          return {
            url: '/posts',
            method: 'POST',
            body,
          };
        }
        // Otherwise, send as JSON
        return {
          url: '/posts',
          method: 'POST',
          body,
        };
      },
      transformResponse: (res: ApiEnvelope<Post>) => res.data ?? ({} as Post),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }, { type: 'UserPosts', id: 'LIST' }],
    }),

    updatePost: builder.mutation<Post, { id: string; data: UpdatePostDto | FormData }>({
      query: ({ id, data }) => {
        // If data is FormData, it already contains the file and data
        if (data instanceof FormData) {
          return {
            url: `/posts/${id}`,
            method: 'PATCH',
            body: data,
          };
        }
        // Otherwise, send as JSON
        return {
          url: `/posts/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
      transformResponse: (res: ApiEnvelope<Post>) => res.data ?? ({} as Post),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),

    deletePost: builder.mutation<void, string>({
      query: (id) => ({ url: `/posts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),

    // ---------- Post Relations ----------
    getPostComments: builder.query<Comment[], string>({
      query: (postId) => ({ url: `/comments?post_id=${postId}`, method: 'GET' }),
      transformResponse: (res: unknown) => extractArrayFromResponse<Comment>(res),
      providesTags: (_result, _error, postId) => [
        { type: 'PostComments', id: postId },
      ],
    }),

    getPostMedia: builder.query<PostMedia[], string>({
      query: (postId) => ({ url: `/posts/${postId}/media`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<PostMedia[]>) => res.data ?? [],
      providesTags: (_result, _error, postId) => [
        { type: 'PostMedia', id: postId },
      ],
    }),

    getPostTags: builder.query<PostTag[], string>({
      query: (postId) => ({ url: `/posts/${postId}/tags`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<PostTag[]>) => res.data ?? [],
      providesTags: (_result, _error, postId) => [
        { type: 'PostTags', id: postId },
      ],
    }),

    getPostReactions: builder.query<Reaction[], string>({
      query: (postId) => ({ url: `/posts/${postId}/reactions`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Reaction[]>) => res.data ?? [],
      providesTags: (_result, _error, postId) => [
        { type: 'PostReactions', id: postId },
      ],
    }),

    // ---------- User Posts with Filters ----------
    getUserPosts: builder.query<Post[], { userId: string; filters?: Partial<import('../../types/posts/postTypes').UserPostsFilters> }>({
      query: ({ userId, filters }) => {
        const params = new URLSearchParams();
        if (filters?.status) params.append('status', filters.status);
        if (filters?.categoryId) params.append('categoryId', filters.categoryId);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        return {
          url: `/posts?userId=${userId}${params.toString() ? `&${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (res: unknown) => extractArrayFromResponse<Post>(res),
      providesTags: (result, _error, { userId }) =>
        result
          ? [
            { type: 'UserPosts', id: userId },
            ...result.map(({ id }) => ({ type: 'Post' as const, id })),
          ]
          : [{ type: 'UserPosts', id: userId }],
    }),

    // ---------- Bulk Operations ----------
    bulkDeletePosts: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map(id =>
            fetchWithBQ({ url: `/posts/${id}`, method: 'DELETE' })
          );

          const results = await Promise.all(deletePromises);

          const hasError = results.some(result => result.error);
          if (hasError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Some posts failed to delete'
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
      invalidatesTags: [
        { type: 'Post', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),

    bulkUpdatePostStatus: builder.mutation<void, { ids: string[]; status: import('../../types/posts/postTypes').PostStatus }>({
      async queryFn({ ids, status }, _api, _extraOptions, fetchWithBQ) {
        try {
          const updatePromises = ids.map(id =>
            fetchWithBQ({
              url: `/posts/${id}`,
              method: 'PATCH',
              body: { status }
            })
          );

          const results = await Promise.all(updatePromises);

          const hasError = results.some(result => result.error);
          if (hasError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Some posts failed to update'
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
      invalidatesTags: [
        { type: 'Post', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),

    // ---------- Dashboard Stats ----------
    getPostStats: builder.query<import('../../types/posts/postTypes').PostStats, string>({
      query: (userId) => ({ url: `/posts/stats?userId=${userId}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<import('../../types/posts/postTypes').PostStats>) =>
        res.data ?? {
          totalPosts: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          publishedPosts: 0,
          draftPosts: 0,
          archivedPosts: 0,
          avgViewsPerPost: 0,
          avgLikesPerPost: 0,
          avgCommentsPerPost: 0,
        },
      providesTags: (_result, _error, userId) => [
        { type: 'UserPosts', id: `stats-${userId}` },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostCommentsQuery,
  useGetPostMediaQuery,
  useGetPostTagsQuery,
  useGetPostReactionsQuery,
  useGetUserPostsQuery,
  useBulkDeletePostsMutation,
  useBulkUpdatePostStatusMutation,
  useGetPostStatsQuery,
} = postsApi;
