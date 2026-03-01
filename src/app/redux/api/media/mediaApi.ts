import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Media,
  CreateMediaDto,
  UpdateMediaDto,
} from "../../types/media/mediaTypes";

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Media CRUD ----------
    getAllMedia: builder.query<Media[], void>({
      query: () => ({ url: '/media', method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Media[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
            { type: 'Media', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Media' as const, id })),
          ]
          : [{ type: 'Media', id: 'LIST' }],
    }),

    getMediaById: builder.query<Media, string>({
      query: (id) => ({ url: `/media/${id}`, method: 'GET' }),
      transformResponse: (res: ApiEnvelope<Media>) =>
        res.data ?? ({} as Media),
      providesTags: (_result, _error, id) => [{ type: 'Media', id }],
    }),

    createMedia: builder.mutation<Media, CreateMediaDto>({
      query: (body) => ({ url: '/media', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Media>) =>
        res.data ?? ({} as Media),
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),

    updateMedia: builder.mutation<Media, { id: string; data: UpdateMediaDto }>({
      query: ({ id, data }) => ({
        url: `/media/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<Media>) =>
        res.data ?? ({} as Media),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Media', id },
        { type: 'Media', id: 'LIST' },
      ],
    }),

    deleteMedia: builder.mutation<void, string>({
      query: (id) => ({ url: `/media/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Media', id },
        { type: 'Media', id: 'LIST' },
      ],
    }),

    // ---------- Media by User ----------
    getMediaByUser: builder.query<Media[], string>({
      query: (userId) => ({
        url: `/media/user/${userId}`,
        method: 'GET'
      }),
      transformResponse: (res: ApiEnvelope<Media[]>) => res.data ?? [],
      providesTags: (result, _error, userId) =>
        result
          ? [
            { type: 'MediaByUser', id: userId },
            ...result.map(({ id }) => ({ type: 'Media' as const, id })),
          ]
          : [{ type: 'MediaByUser', id: userId }],
    }),

    // ---------- File Upload ----------
    uploadMedia: builder.mutation<Media, FormData>({
      query: (formData) => ({
        url: '/media/upload',
        method: 'POST',
        body: formData,
      }),
      transformResponse: (res: unknown): Media => {
        if (typeof res === 'object' && res !== null) {
          if ('data' in res && res.data) {
            return res.data as Media;
          }
          if ('id' in res) {
            return res as Media;
          }
        }

        console.error('[MediaAPI] Unexpected response format:', res);
        return {} as Media;
      },
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),

    // ---------- Filtered Media ----------
    getFilteredMedia: builder.query<Media[], Partial<import('../../types/media/mediaTypes').MediaFilter> | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters?.mediaType) params.append('mediaType', filters.mediaType);
        if (filters?.mimeType) params.append('mimeType', filters.mimeType);
        if (filters?.minSize !== undefined) params.append('minSize', filters.minSize.toString());
        if (filters?.maxSize !== undefined) params.append('maxSize', filters.maxSize.toString());
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.userId) params.append('userId', filters.userId);

        return {
          url: `/media${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (res: ApiEnvelope<Media[]>) => res.data ?? [],
      providesTags: (result) =>
        result
          ? [
            { type: 'Media', id: 'LIST' },
            ...result.map(({ id }) => ({ type: 'Media' as const, id })),
          ]
          : [{ type: 'Media', id: 'LIST' }],
    }),

    // ---------- Bulk Operations ----------
    bulkDeleteMedia: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map(id =>
            fetchWithBQ({ url: `/media/${id}`, method: 'DELETE' })
          );

          const results = await Promise.all(deletePromises);

          const hasError = results.some(result => result.error);
          if (hasError) {
            return {
              error: {
                status: 'CUSTOM_ERROR',
                error: 'Some media items failed to delete'
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
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllMediaQuery,
  useGetMediaByIdQuery,
  useCreateMediaMutation,
  useUpdateMediaMutation,
  useDeleteMediaMutation,
  useGetMediaByUserQuery,
  useUploadMediaMutation,
  useGetFilteredMediaQuery,
  useBulkDeleteMediaMutation,
} = mediaApi;
