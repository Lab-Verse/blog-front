import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Tag,
  CreateTagDto,
  UpdateTagDto,
} from "../../types/tags/tagTypes";
import type { Post } from "../../types/posts/postTypes";

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Tags CRUD ----------
    getAllTags: builder.query<Tag[], void>({
      query: () => ({ url: '/tags?include_counts=true', method: 'GET' }),
      transformResponse: (res: unknown) => {
        // Handle different response structures
        if (Array.isArray(res)) return res as Tag[];

        // If response is an object with numeric keys (convert to array)
        if (res && typeof res === 'object' && !Array.isArray(res)) {
          const keys = Object.keys(res);
          // Check if all keys are numeric
          if (keys.length > 0 && keys.every(key => !isNaN(Number(key)))) {
            return Object.values(res) as Tag[];
          }
          // Check data property
          const resObj = res as Record<string, unknown>;
          if (resObj.data) {
            if (Array.isArray(resObj.data)) return resObj.data as Tag[];
            // data might be object with numeric keys
            if (resObj.data && typeof resObj.data === 'object') {
              const dataKeys = Object.keys(resObj.data);
              if (dataKeys.every(key => !isNaN(Number(key)))) {
                return Object.values(resObj.data) as Tag[];
              }
            }
          }
          if (resObj.results && Array.isArray(resObj.results)) return resObj.results as Tag[];
          if (resObj.tags && Array.isArray(resObj.tags)) return resObj.tags as Tag[];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            { type: 'Tag', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Tag' as const, id })),
          ]
          : [{ type: 'Tag', id: 'LIST' }],
    }),

    getTagById: builder.query<Tag, string>({
      query: (id) => ({ url: `/tags/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Tag>) => res.data ?? ({} as Tag),
      providesTags: (_result, _error, id) => [{ type: 'Tag', id }],
    }),

    createTag: builder.mutation<Tag, CreateTagDto>({
      query: (body) => ({ url: '/tags', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Tag>) => res.data ?? ({} as Tag),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),

    updateTag: builder.mutation<Tag, { id: string; data: UpdateTagDto }>({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<Tag>) => res.data ?? ({} as Tag),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Tag', id },
        { type: 'Tag', id: 'LIST' },
      ],
    }),

    deleteTag: builder.mutation<void, string>({
      query: (id) => ({ url: `/tags/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Tag', id },
        { type: 'Tag', id: 'LIST' },
      ],
    }),

    // ---------- Tags with Filters ----------
    getFilteredTags: builder.query<Tag[], Partial<import('../../types/tags/tagTypes').TagFilters> | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.search) params.append('search', filters.search);
        if (filters?.minPostCount !== undefined) params.append('minPostCount', filters.minPostCount.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        return {
          url: `/tags?include_counts=true${params.toString() ? `&${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (res: unknown) => {
        // Reuse same transform logic as getAllTags
        if (Array.isArray(res)) return res as Tag[];

        if (res && typeof res === 'object' && !Array.isArray(res)) {
          const keys = Object.keys(res);
          if (keys.length > 0 && keys.every(key => !isNaN(Number(key)))) {
            return Object.values(res) as Tag[];
          }
          const resObj = res as Record<string, unknown>;
          if (resObj.data) {
            if (Array.isArray(resObj.data)) return resObj.data as Tag[];
            if (resObj.data && typeof resObj.data === 'object') {
              const dataKeys = Object.keys(resObj.data);
              if (dataKeys.every(key => !isNaN(Number(key)))) {
                return Object.values(resObj.data) as Tag[];
              }
            }
          }
          if (resObj.results && Array.isArray(resObj.results)) return resObj.results as Tag[];
          if (resObj.tags && Array.isArray(resObj.tags)) return resObj.tags as Tag[];
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            { type: 'Tag', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Tag' as const, id })),
          ]
          : [{ type: 'Tag', id: 'LIST' }],
    }),

    // ---------- Bulk Operations ----------
    bulkDeleteTags: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map(id =>
            fetchWithBQ({ url: `/tags/${id}`, method: 'DELETE' })
          );

          const results = await Promise.all(deletePromises);

          const hasError = results.some(result => result.error);
          if (hasError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Some tags failed to delete'
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
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),

    // ---------- Tag Relations ----------
    getPostsByTag: builder.query<Post[], string>({
      query: (tagId) => ({ url: `/tags/${tagId}/posts`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Post[]>) => res.data ?? [],
      providesTags: (_result, _error, tagId) => [
        { type: 'TagPosts', id: tagId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetFilteredTagsQuery,
  useBulkDeleteTagsMutation,
  useGetPostsByTagQuery,
} = tagsApi;
