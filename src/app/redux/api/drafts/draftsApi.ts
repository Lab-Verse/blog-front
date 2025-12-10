import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Draft,
  CreateDraftDto,
  UpdateDraftDto,
} from "../../types/drafts/draftTypes";

export const draftsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Drafts CRUD ----------
    getAllDrafts: builder.query<Draft[], void>({
      query: () => ({ url: '/drafts', method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Draft[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
              { type: 'Draft', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Draft' as const, id })),
            ]
          : [{ type: 'Draft', id: 'LIST' }],
    }),

    getDraftById: builder.query<Draft, string>({
      query: (id) => ({ url: `/drafts/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Draft>) => 
        res.data ?? ({} as Draft),
      providesTags: (_result, _error, id) => [{ type: 'Draft', id }],
    }),

    createDraft: builder.mutation<Draft, CreateDraftDto>({
      query: (body) => ({ url: '/drafts', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Draft>) => 
        res.data ?? ({} as Draft),
      invalidatesTags: [{ type: 'Draft', id: 'LIST' }],
    }),

    updateDraft: builder.mutation<Draft, { id: string; data: UpdateDraftDto }>({
      query: ({ id, data }) => ({
        url: `/drafts/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<Draft>) => 
        res.data ?? ({} as Draft),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Draft', id },
        { type: 'Draft', id: 'LIST' },
      ],
    }),

    deleteDraft: builder.mutation<void, string>({
      query: (id) => ({ url: `/drafts/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Draft', id },
        { type: 'Draft', id: 'LIST' },
      ],
    }),

    // ---------- Drafts by User ----------
    getDraftsByUser: builder.query<Draft[], string>({
      query: (userId) => ({ 
        url: `/drafts/user/${userId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<Draft[]>) => res.data ?? [],
      providesTags: (result, _error, userId) =>
        result
          ? [
              { type: 'DraftsByUser', id: userId },
              ...result.map(({ id }) => ({ type: 'Draft' as const, id })),
            ]
          : [{ type: 'DraftsByUser', id: userId }],
    }),

    // ---------- Bulk Operations ----------
    bulkDeleteDrafts: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map(id =>
            fetchWithBQ({ url: `/drafts/${id}`, method: 'DELETE' })
          );
          
          const results = await Promise.all(deletePromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some drafts failed to delete' 
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
      invalidatesTags: [{ type: 'Draft', id: 'LIST' }],
    }),

    // ---------- Convert Draft to Post ----------
    convertDraftToPost: builder.mutation<
      { postId: string },
      { draftId: string; publishData: { slug: string; status: string; published_at?: string } }
    >({
      async queryFn({ draftId, publishData }, _api, _extraOptions, fetchWithBQ) {
        try {
          // Get draft data
          const draftResult = await fetchWithBQ({
            url: `/drafts/${draftId}`,
            method: 'GET',
          });
          
          if (draftResult.error) {
            return { error: draftResult.error };
          }
          
          const draftResponse = draftResult.data as ApiEnvelope<Draft>;
          const draft = draftResponse.data;
          
          if (!draft) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Draft not found' 
              } 
            };
          }

          // Create post from draft
          const postResult = await fetchWithBQ({
            url: '/posts',
            method: 'POST',
            body: {
              title: draft.title || 'Untitled',
              slug: publishData.slug,
              content: draft.content || '',
              user_id: draft.user_id,
              category_id: draft.category_id,
              status: publishData.status,
              published_at: publishData.published_at,
            },
          });
          
          if (postResult.error) {
            return { error: postResult.error };
          }
          
          const postResponse = postResult.data as ApiEnvelope<{ id: string }>;
          
          // Delete draft after successful post creation
          await fetchWithBQ({
            url: `/drafts/${draftId}`,
            method: 'DELETE',
          });
          
          return { data: { postId: postResponse.data?.id ?? '' } };
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
        { type: 'Draft', id: 'LIST' },
        { type: 'Post', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllDraftsQuery,
  useGetDraftByIdQuery,
  useCreateDraftMutation,
  useUpdateDraftMutation,
  useDeleteDraftMutation,
  useGetDraftsByUserQuery,
  useBulkDeleteDraftsMutation,
  useConvertDraftToPostMutation,
} = draftsApi;