import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import { extractArrayFromResponse, extractObjectFromResponse } from "@/utils/apiHelpers";
import type {
  Bookmark,
  CreateBookmarkDto,
} from "../../types/bookmarks/bookmarkTypes";

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Bookmarks ----------
    createBookmark: builder.mutation<Bookmark, CreateBookmarkDto>({
      query: (body) => ({ url: '/bookmarks', method: 'POST', body }),
      transformResponse: (res: unknown) =>
        extractObjectFromResponse<Bookmark>(res) ?? ({} as Bookmark),
      invalidatesTags: (_result, _error, { user_id }) => [
        { type: 'Bookmark', id: 'LIST' },
        { type: 'BookmarksByUser', id: user_id },
      ],
    }),

    getBookmarksByUser: builder.query<Bookmark[], string>({
      query: (userId) => ({ 
        url: `/bookmarks/user/${userId}`, 
        method: 'GET' 
      }),
      transformResponse: (res: unknown) => extractArrayFromResponse<Bookmark>(res),
      providesTags: (result, _error, userId) =>
        result
          ? [
              { type: 'BookmarksByUser', id: userId },
              ...result.map(({ id }) => ({ type: 'Bookmark' as const, id })),
            ]
          : [{ type: 'BookmarksByUser', id: userId }],
    }),

    deleteBookmark: builder.mutation<void, string>({
      query: (id) => ({ url: `/bookmarks/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Bookmark', id },
        { type: 'Bookmark', id: 'LIST' },
      ],
    }),

    // Helper mutation to toggle bookmark (check if exists, then create or delete)
    toggleBookmark: builder.mutation<
      { action: 'created' | 'deleted'; bookmark?: Bookmark },
      { userId: string; postId: string; bookmarkId?: string }
    >({
      async queryFn({ userId, postId, bookmarkId }, _api, _extraOptions, fetchWithBQ) {
        try {
          if (bookmarkId) {
            // Delete existing bookmark
            const deleteResult = await fetchWithBQ({
              url: `/bookmarks/${bookmarkId}`,
              method: 'DELETE',
            });
            
            if (deleteResult.error) {
              return { error: deleteResult.error };
            }
            
            return { data: { action: 'deleted' as const } };
          } else {
            // Create new bookmark
            const createResult = await fetchWithBQ({
              url: '/bookmarks',
              method: 'POST',
              body: { user_id: userId, post_id: postId },
            });
            
            if (createResult.error) {
              return { error: createResult.error };
            }
            
            const response = createResult.data as ApiEnvelope<Bookmark>;
            return { 
              data: { 
                action: 'created' as const, 
                bookmark: response.data 
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
      invalidatesTags: (_result, _error, { userId }) => [
        { type: 'Bookmark', id: 'LIST' },
        { type: 'BookmarksByUser', id: userId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateBookmarkMutation,
  useGetBookmarksByUserQuery,
  useDeleteBookmarkMutation,
  useToggleBookmarkMutation,
} = bookmarksApi;
