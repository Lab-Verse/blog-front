import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  View,
  CreateViewDto,
} from "../../types/views/viewTypes";

export const viewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Views ----------
    createView: builder.mutation<View, CreateViewDto>({
      query: (body) => ({ url: '/views', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<View>) => 
        res.data ?? ({} as View),
      invalidatesTags: (_result, _error, { viewable_id, viewable_type, user_id }) => [
        { type: 'View', id: 'LIST' },
        { type: 'ViewsByViewable', id: `${viewable_type}-${viewable_id}` },
        ...(user_id ? [{ type: 'ViewsByUser' as const, id: user_id }] : []),
        ...(viewable_type === 'post' 
          ? [{ type: 'Post' as const, id: viewable_id }] 
          : []
        ),
        ...(viewable_type === 'question' 
          ? [{ type: 'Question' as const, id: viewable_id }] 
          : []
        ),
      ],
    }),

    getViewsByUser: builder.query<View[], string>({
      query: (userId) => ({ 
        url: `/views/user/${userId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<View[]>) => res.data ?? [],
      providesTags: (result, _error, userId) =>
        result
          ? [
              { type: 'ViewsByUser', id: userId },
              ...result.map(({ id }) => ({ type: 'View' as const, id })),
            ]
          : [{ type: 'ViewsByUser', id: userId }],
    }),

    getViewsByPost: builder.query<View[], string>({
      query: (postId) => ({ 
        url: `/views/post/${postId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<View[]>) => res.data ?? [],
      providesTags: (result, _error, postId) =>
        result
          ? [
              { type: 'ViewsByViewable', id: `post-${postId}` },
              ...result.map(({ id }) => ({ type: 'View' as const, id })),
            ]
          : [{ type: 'ViewsByViewable', id: `post-${postId}` }],
    }),

    // ---------- Track View (with smart tracking) ----------
    trackView: builder.mutation<
      View | null,
      { 
        viewableType: string; 
        viewableId: string; 
        userId?: string; 
        ipAddress: string;
      }
    >({
      async queryFn(
        { viewableType, viewableId, userId, ipAddress },
        _api,
        _extraOptions,
        fetchWithBQ
      ) {
        try {
          const createResult = await fetchWithBQ({
            url: '/views',
            method: 'POST',
            body: {
              user_id: userId,
              viewable_type: viewableType,
              viewable_id: viewableId,
              ip_address: ipAddress,
            },
          });
          
          if (createResult.error) {
            return { error: createResult.error };
          }
          
          const response = createResult.data as ApiEnvelope<View>;
          return { data: response.data ?? null };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: (_result, _error, { viewableId, viewableType, userId }) => [
        { type: 'View', id: 'LIST' },
        { type: 'ViewsByViewable', id: `${viewableType}-${viewableId}` },
        ...(userId ? [{ type: 'ViewsByUser' as const, id: userId }] : []),
        ...(viewableType === 'post' 
          ? [{ type: 'Post' as const, id: viewableId }] 
          : []
        ),
        ...(viewableType === 'question' 
          ? [{ type: 'Question' as const, id: viewableId }] 
          : []
        ),
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateViewMutation,
  useGetViewsByUserQuery,
  useGetViewsByPostQuery,
  useTrackViewMutation,
} = viewsApi;
