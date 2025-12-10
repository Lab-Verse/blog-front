import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  CommentReply,
  CreateCommentReplyDto,
  UpdateCommentReplyDto,
} from "../../types/commentReplies/commentReplyTypes";

export const commentRepliesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Comment Replies CRUD ----------
    getCommentReplyById: builder.query<CommentReply, string>({
      query: (id) => ({ url: `/comment-replies/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<CommentReply>) => 
        res.data ?? ({} as CommentReply),
      providesTags: (_result, _error, id) => [{ type: 'CommentReply', id }],
    }),

    createCommentReply: builder.mutation<CommentReply, CreateCommentReplyDto>({
      query: (body) => ({ url: '/comment-replies', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<CommentReply>) => 
        res.data ?? ({} as CommentReply),
      invalidatesTags: (_result, _error, { comment_id }) => [
        { type: 'CommentReply', id: 'LIST' },
        { type: 'CommentRepliesByComment', id: comment_id },
      ],
    }),

    updateCommentReply: builder.mutation<
      CommentReply,
      { id: string; data: UpdateCommentReplyDto }
    >({
      query: ({ id, data }) => ({
        url: `/comment-replies/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<CommentReply>) => 
        res.data ?? ({} as CommentReply),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CommentReply', id },
        { type: 'CommentReply', id: 'LIST' },
      ],
    }),

    deleteCommentReply: builder.mutation<void, string>({
      query: (id) => ({ url: `/comment-replies/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'CommentReply', id },
        { type: 'CommentReply', id: 'LIST' },
      ],
    }),

    // ---------- Get Replies by Comment ----------
    getRepliesByComment: builder.query<CommentReply[], string>({
      query: (commentId) => ({ 
        url: `/comment-replies/comment/${commentId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<CommentReply[]>) => res.data ?? [],
      providesTags: (result, _error, commentId) =>
        result
          ? [
              { type: 'CommentRepliesByComment', id: commentId },
              ...result.map(({ id }) => ({ type: 'CommentReply' as const, id })),
            ]
          : [{ type: 'CommentRepliesByComment', id: commentId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCommentReplyByIdQuery,
  useCreateCommentReplyMutation,
  useUpdateCommentReplyMutation,
  useDeleteCommentReplyMutation,
  useGetRepliesByCommentQuery,
} = commentRepliesApi;