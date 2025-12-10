import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  QuestionFilters,
} from "../../types/questions/questionTypes";

export const questionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Questions CRUD ----------
    getAllQuestions: builder.query<Question[], QuestionFilters | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        
        if (filters) {
          if (filters.categoryId) params.append('category', filters.categoryId);
          if (filters.userId) params.append('user', filters.userId);
          if (filters.status) params.append('status', filters.status);
          if (filters.hasAnswers !== undefined) {
            params.append('hasAnswers', String(filters.hasAnswers));
          }
          if (filters.isUnanswered !== undefined) {
            params.append('isUnanswered', String(filters.isUnanswered));
          }
        }
        
        return {
          url: `/questions${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (res: unknown): Question[] => {
        // Handle different response structures
        if (Array.isArray(res)) return res as Question[];
        
        if (res && typeof res === 'object') {
          const obj = res as { data?: unknown, results?: unknown, questions?: unknown };
          
          // Check data property
          if (obj.data) {
            if (Array.isArray(obj.data)) return obj.data as Question[];
            if (typeof obj.data === 'object') {
              return Object.values(obj.data) as Question[];
            }
          }
          
          if (Array.isArray(obj.results)) return obj.results as Question[];
          if (Array.isArray(obj.questions)) return obj.questions as Question[];
          
          // If response is an object with numeric keys
          if (typeof res === 'object') {
            return Object.values(res) as Question[];
          }
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Question', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Question' as const, id })),
            ]
          : [{ type: 'Question', id: 'LIST' }],
    }),

    getQuestionById: builder.query<Question, string>({
      query: (id) => ({ url: `/questions/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Question>) => 
        res.data ?? ({} as Question),
      providesTags: (_result, _error, id) => [{ type: 'Question', id }],
    }),

    createQuestion: builder.mutation<Question, CreateQuestionDto>({
      query: (body) => ({ url: '/questions', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Question>) => 
        res.data ?? ({} as Question),
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    }),

    updateQuestion: builder.mutation<
      Question,
      { id: string; data: UpdateQuestionDto }
    >({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<Question>) => 
        res.data ?? ({} as Question),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({ url: `/questions/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    // ---------- Question Actions ----------
    incrementQuestionViews: builder.mutation<void, string>({
      queryFn: async () => {
        return { data: null as unknown as void };
      },
    }),

    closeQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body: { status: 'closed' },
      }),
      transformResponse: (res: ApiEnvelope<Question>) => 
        res.data ?? ({} as Question),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    reopenQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body: { status: 'open' },
      }),
      transformResponse: (res: ApiEnvelope<Question>) => 
        res.data ?? ({} as Question),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    archiveQuestion: builder.mutation<Question, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body: { status: 'archived' },
      }),
      transformResponse: (res: ApiEnvelope<Question>) => 
        res.data ?? ({} as Question),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    // ---------- Bulk Operations ----------
    bulkDeleteQuestions: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map(id =>
            fetchWithBQ({ url: `/questions/${id}`, method: 'DELETE' })
          );
          
          const results = await Promise.all(deletePromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some questions failed to delete' 
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
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    }),

    bulkUpdateQuestionStatus: builder.mutation<
      void,
      { ids: string[]; status: string }
    >({
      async queryFn({ ids, status }, _api, _extraOptions, fetchWithBQ) {
        try {
          const updatePromises = ids.map(id =>
            fetchWithBQ({
              url: `/questions/${id}`,
              method: 'PATCH',
              body: { status },
            })
          );
          
          const results = await Promise.all(updatePromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some questions failed to update' 
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
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useIncrementQuestionViewsMutation,
  useCloseQuestionMutation,
  useReopenQuestionMutation,
  useArchiveQuestionMutation,
  useBulkDeleteQuestionsMutation,
  useBulkUpdateQuestionStatusMutation,
} = questionsApi;
