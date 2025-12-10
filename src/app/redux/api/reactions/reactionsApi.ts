import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Reaction,
  CreateReactionDto,
} from "../../types/reactions/reactionTypes";

export const reactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Reactions ----------
    createReaction: builder.mutation<Reaction, CreateReactionDto>({
      query: (body) => ({ url: '/reactions', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Reaction>) => 
        res.data ?? ({} as Reaction),
      invalidatesTags: (_result, _error, { reactable_id, reactable_type }) => [
        { type: 'Reaction', id: 'LIST' },
        { type: 'ReactionsByPost', id: reactable_id },
        ...(reactable_type === 'post' 
          ? [{ type: 'Post' as const, id: reactable_id }] 
          : []
        ),
      ],
    }),

    getReactionsByPost: builder.query<Reaction[], string>({
      query: (postId) => ({ 
        url: `/reactions/post/${postId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<Reaction[]>) => res.data ?? [],
      providesTags: (result, _error, postId) =>
        result
          ? [
              { type: 'ReactionsByPost', id: postId },
              ...result.map(({ id }) => ({ type: 'Reaction' as const, id })),
            ]
          : [{ type: 'ReactionsByPost', id: postId }],
    }),

    deleteReaction: builder.mutation<void, string>({
      query: (id) => ({ url: `/reactions/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Reaction', id },
        { type: 'Reaction', id: 'LIST' },
      ],
    }),

    // Helper mutation to toggle reaction
    toggleReaction: builder.mutation<
      { action: 'created' | 'deleted'; reaction?: Reaction },
      { 
        userId: string; 
        reactableId: string; 
        reactableType: string;
        reactionType?: string;
        existingReactionId?: string;
      }
    >({
      async queryFn(
        { userId, reactableId, reactableType, reactionType, existingReactionId },
        _api,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          if (existingReactionId) {
            // Delete existing reaction
            const deleteResult = await fetchWithBQ({
              url: `/reactions/${existingReactionId}`,
              method: 'DELETE',
            });
            
            if (deleteResult.error) {
              return { error: deleteResult.error };
            }
            
            return { data: { action: 'deleted' as const } };
          } else {
            // Create new reaction
            const createResult = await fetchWithBQ({
              url: '/reactions',
              method: 'POST',
              body: {
                user_id: userId,
                reactable_id: reactableId,
                reactable_type: reactableType,
                type: reactionType || 'like',
              },
            });
            
            if (createResult.error) {
              return { error: createResult.error };
            }
            
            const response = createResult.data as ApiEnvelope<Reaction>;
            return { 
              data: { 
                action: 'created' as const, 
                reaction: response.data 
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
      invalidatesTags: (_result, _error, { reactableId, reactableType }) => [
        { type: 'Reaction', id: 'LIST' },
        { type: 'ReactionsByPost', id: reactableId },
        ...(reactableType === 'post' 
          ? [{ type: 'Post' as const, id: reactableId }] 
          : []
        ),
      ],
    }),

    // Change reaction type
    changeReaction: builder.mutation<
      Reaction,
      { 
        oldReactionId: string;
        userId: string;
        reactableId: string;
        reactableType: string;
        newReactionType: string;
      }
    >({
      async queryFn(
        { oldReactionId, userId, reactableId, reactableType, newReactionType },
        _api,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          // Delete old reaction
          const deleteResult = await fetchWithBQ({
            url: `/reactions/${oldReactionId}`,
            method: 'DELETE',
          });
          
          if (deleteResult.error) {
            return { error: deleteResult.error };
          }

          // Create new reaction
          const createResult = await fetchWithBQ({
            url: '/reactions',
            method: 'POST',
            body: {
              user_id: userId,
              reactable_id: reactableId,
              reactable_type: reactableType,
              type: newReactionType,
            },
          });
          
          if (createResult.error) {
            return { error: createResult.error };
          }
          
          const response = createResult.data as ApiEnvelope<Reaction>;
          return { data: response.data ?? ({} as Reaction) };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: (_result, _error, { reactableId, reactableType }) => [
        { type: 'Reaction', id: 'LIST' },
        { type: 'ReactionsByPost', id: reactableId },
        ...(reactableType === 'post' 
          ? [{ type: 'Post' as const, id: reactableId }] 
          : []
        ),
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateReactionMutation,
  useGetReactionsByPostQuery,
  useDeleteReactionMutation,
  useToggleReactionMutation,
  useChangeReactionMutation,
} = reactionsApi;