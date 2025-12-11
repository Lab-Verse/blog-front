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
        console.log('[PostsAPI] Raw response:', res);
        const posts = extractArrayFromResponse<Post>(res);
        console.log('[PostsAPI] Extracted posts:', posts);
        return posts;
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Post', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Post' as const, id })),
            ]
          : [{ type: 'Post', id: 'LIST' }],
      pollingInterval: 5000, // Poll every 5 seconds for real-time updates
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
} = postsApi;
