import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import type {
  Category,
  Follower,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../types/categories/categoryTypes";
import { Post } from "../../types/posts/postTypes";
import { extractArrayFromResponse, extractObjectFromResponse } from "@/utils/apiHelpers";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Categories CRUD ----------
    getAllCategories: builder.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      transformResponse: (res: unknown) => {
        console.log('[CategoriesAPI] Raw response:', res);
        const categories = extractArrayFromResponse<Category>(res);
        console.log('[CategoriesAPI] Extracted categories:', categories);
        return categories;
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Category', id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'Category' as const, id })),
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    getCategoryById: builder.query<Category, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'GET' }),
      transformResponse: (res: unknown) => {
        return extractObjectFromResponse<Category>(res) ?? ({} as Category);
      },
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryDto>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      transformResponse: (res: ApiEnvelope<Category>) => 
        res.data ?? ({} as Category),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: string; data: UpdateCategoryDto }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: ApiEnvelope<Category>) => 
        res.data ?? ({} as Category),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    // ---------- Category Relations ----------
    getPostsByCategory: builder.query<Post[], string>({
      query: (categoryId) => ({ 
        url: `/categories/${categoryId}/posts`, 
        method: 'GET' 
      }),
      transformResponse: (res: unknown) => extractArrayFromResponse<Post>(res),
      providesTags: (_result, _error, categoryId) => [
        { type: 'CategoryPosts', id: categoryId },
      ],
    }),

    getFollowersByCategory: builder.query<Follower[], string>({
      query: (categoryId) => ({ 
        url: `/categories/${categoryId}/followers`, 
        method: 'GET' 
      }),
      transformResponse: (res: ApiEnvelope<Follower[]>) => res.data ?? [],
      providesTags: (_result, _error, categoryId) => [
        { type: 'CategoryFollowers', id: categoryId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetPostsByCategoryQuery,
  useGetFollowersByCategoryQuery,
} = categoriesApi;
