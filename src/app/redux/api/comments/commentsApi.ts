import { baseApi } from "../baseApi";
import type { Comment } from "../../types/posts/postTypes";
import { extractArrayFromResponse, extractObjectFromResponse } from "@/utils/apiHelpers";

export interface CreateCommentDto {
  post_id: string;
  content: string;
  parent_id?: string;
}

export interface UpdateCommentDto {
  content: string;
}

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Queries ----------
    getCommentsByPost: builder.query<Comment[], string>({
      query: (postId) => ({ url: `/comments?post_id=${postId}`, method: "GET" }),
      transformResponse: (res: unknown) => extractArrayFromResponse<Comment>(res),
      providesTags: (_result, _error, postId) => [
        { type: "PostComments", id: postId },
      ],
    }),

    getCommentById: builder.query<Comment, string>({
      query: (id) => ({ url: `/comments/${id}`, method: "GET" }),
      transformResponse: (res: unknown) => extractObjectFromResponse<Comment>(res) as Comment,
      providesTags: (_result, _error, id) => [{ type: "Comment", id }],
    }),

    getCommentReplies: builder.query<Comment[], string>({
      query: (commentId) => ({ url: `/comments/${commentId}/replies`, method: "GET" }),
      transformResponse: (res: unknown) => extractArrayFromResponse<Comment>(res),
      providesTags: (_result, _error, commentId) => [
        { type: "Comment", id: `replies-${commentId}` },
      ],
    }),

    // ---------- Mutations ----------
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (body) => ({
        url: "/comments",
        method: "POST",
        body,
      }),
      transformResponse: (res: unknown) => extractObjectFromResponse<Comment>(res) as Comment,
      invalidatesTags: (_result, _error, arg) => [
        { type: "PostComments", id: arg.post_id },
        { type: "Comment", id: "LIST" },
      ],
    }),

    updateComment: builder.mutation<Comment, { id: string; data: UpdateCommentDto }>({
      query: ({ id, data }) => ({
        url: `/comments/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (res: unknown) => extractObjectFromResponse<Comment>(res) as Comment,
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comment", id: arg.id },
      ],
    }),

    deleteComment: builder.mutation<void, { id: string; postId: string }>({
      query: ({ id }) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PostComments", id: arg.postId },
        { type: "Comment", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetCommentsByPostQuery,
  useGetCommentByIdQuery,
  useGetCommentRepliesQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
