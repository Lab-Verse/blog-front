import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Answer,
  CreateAnswerDto,
  UpdateAnswerDto,
} from "../../types/answers/answerTypes";

export const answersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Answers CRUD ----------
    getAllAnswers: builder.query<Answer[], void>({
      query: () => ({ url: '/answers', method: 'GET' }),
      transformResponse: (res: { data?: Answer[] | Record<string, Answer>; results?: Answer[]; answers?: Answer[] } | Answer[] | Record<string, Answer>) => {
        // Handle different response structures
        if (Array.isArray(res)) return res;
        
        // If response is an object with numeric keys (convert to array)
        if (res && typeof res === 'object' && !Array.isArray(res)) {
          const keys = Object.keys(res);
          // Check if all keys are numeric
          if (keys.length > 0 && keys.every(key => !isNaN(Number(key)))) {
            return Object.values(res);
          }
          // Check data property
          if (res.data) {
            if (Array.isArray(res.data)) return res.data;
            // data might be object with numeric keys
            const dataKeys = Object.keys(res.data || {});
            if (dataKeys.every(key => !isNaN(Number(key)))) {
              return Object.values(res.data);
            }
          }
          if (res?.results && Array.isArray(res.results)) return res.results;
          if (res?.answers && Array.isArray(res.answers)) return res.answers;
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Answer', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Answer' as const, id })),
            ]
          : [{ type: 'Answer', id: 'LIST' }],
    }),

    getAnswerById: builder.query<Answer, string>({
      query: (id) => ({ url: `/answers/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Answer>) => 
        res.data ?? ({} as Answer),
      providesTags: (_result, _error, id) => [{ type: 'Answer', id }],
    }),

    createAnswer: builder.mutation<Answer, CreateAnswerDto>({
      query: (body) => ({ url: '/answers', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Answer>) => 
        res.data ?? ({} as Answer),
      invalidatesTags: (_result, _error, { question_id }) => [
        { type: 'Answer', id: 'LIST' },
        { type: 'AnswersByQuestion', id: question_id },
        { type: 'Question', id: question_id },
      ],
    }),

    updateAnswer: builder.mutation<Answer, { id: string; data: UpdateAnswerDto }>({
      query: ({ id, data }) => ({
        url: `/answers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<Answer>) => 
        res.data ?? ({} as Answer),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),

    deleteAnswer: builder.mutation<void, string>({
      query: (id) => ({ url: `/answers/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),

    // ---------- Answers by Question ----------
    getAnswersByQuestion: builder.query<Answer[], string>({
      query: (questionId) => ({ 
        url: `/answers/question/${questionId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<Answer[]>) => res.data ?? [],
      providesTags: (result, _error, questionId) =>
        result
          ? [
              { type: 'AnswersByQuestion', id: questionId },
              ...result.map(({ id }) => ({ type: 'Answer' as const, id })),
            ]
          : [{ type: 'AnswersByQuestion', id: questionId }],
    }),

    // ---------- Answer Actions ----------
    acceptAnswer: builder.mutation<Answer, string>({
      query: (id) => ({
        url: `/answers/${id}`,
        method: 'PATCH',
        body: { is_accepted: true },
      }),
      transformResponse: (res: ApiEnvelope<Answer>) => 
        res.data ?? ({} as Answer),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults: { undo: () => void }[] = [];
        
        // Update the specific answer
        patchResults.push(
          dispatch(
            answersApi.util.updateQueryData(
              'getAnswerById',
              id,
              (draft: Answer) => {
                draft.is_accepted = true;
              }
            )
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach(patch => patch.undo());
        }
      },
    }),

    unacceptAnswer: builder.mutation<Answer, string>({
      query: (id) => ({
        url: `/answers/${id}`,
        method: 'PATCH',
        body: { is_accepted: false },
      }),
      transformResponse: (res: ApiEnvelope<Answer>) => 
        res.data ?? ({} as Answer),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Answer', id },
        { type: 'Answer', id: 'LIST' },
      ],
    }),

    voteAnswer: builder.mutation<
      Answer,
      { answerId: string; voteType: 'upvote' | 'downvote' }
    >({
      async queryFn({ answerId, voteType }, _api, _extraOptions, fetchWithBQ) {
        try {
          // Get current answer
          const answerResult = await fetchWithBQ({
            url: `/answers/${answerId}`,
            method: 'GET',
          });
          
          if (answerResult.error) {
            return { error: answerResult.error };
          }
          
          const answerResponse = answerResult.data as ApiEnvelope<Answer>;
          const answer = answerResponse.data;
          
          if (!answer) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Answer not found' 
              } 
            };
          }

          // Update vote count
          const newVoteCount = voteType === 'upvote' 
            ? answer.votes_count + 1 
            : answer.votes_count - 1;

          // This would typically be a dedicated vote endpoint
          // For now, we'll update the votes_count directly
          const updateResult = await fetchWithBQ({
            url: `/answers/${answerId}`,
            method: 'PATCH',
            body: { votes_count: newVoteCount },
          });
          
          if (updateResult.error) {
            return { error: updateResult.error };
          }
          
          const response = updateResult.data as ApiEnvelope<Answer>;
          return { data: response.data ?? ({} as Answer) };
        } catch (error) {
          return { 
            error: { 
              status: 'CUSTOM_ERROR', 
              error: String(error) 
            } 
          };
        }
      },
      invalidatesTags: (_result, _error, { answerId }) => [
        { type: 'Answer', id: answerId },
      ],
    }),

    // ---------- Bulk Operations ----------
    bulkDeleteAnswers: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map(id =>
            fetchWithBQ({ url: `/answers/${id}`, method: 'DELETE' })
          );
          
          const results = await Promise.all(deletePromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some answers failed to delete' 
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
      invalidatesTags: [{ type: 'Answer', id: 'LIST' }],
    }),

    bulkAcceptAnswers: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const updatePromises = ids.map(id =>
            fetchWithBQ({
              url: `/answers/${id}`,
              method: 'PATCH',
              body: { is_accepted: true },
            })
          );
          
          const results = await Promise.all(updatePromises);
          
          const hasError = results.some(result => result.error);
          if (hasError) {
            return { 
              error: { 
                status: 'CUSTOM_ERROR', 
                error: 'Some answers failed to accept' 
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
      invalidatesTags: [{ type: 'Answer', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllAnswersQuery,
  useGetAnswerByIdQuery,
  useCreateAnswerMutation,
  useUpdateAnswerMutation,
  useDeleteAnswerMutation,
  useGetAnswersByQuestionQuery,
  useAcceptAnswerMutation,
  useUnacceptAnswerMutation,
  useVoteAnswerMutation,
  useBulkDeleteAnswersMutation,
  useBulkAcceptAnswersMutation,
} = answersApi;
