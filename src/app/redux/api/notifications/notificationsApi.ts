import { baseApi } from "../baseApi";
import type { ApiEnvelope } from "../../types/auth/authTypes";
import { extractArrayFromResponse, extractObjectFromResponse } from "@/utils/apiHelpers";
import type {
  Notification,
  CreateNotificationDto,
} from "../../types/notifications/notificationTypes";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------- Notifications ----------
    createNotification: builder.mutation<Notification, CreateNotificationDto>({
      query: (body) => ({ url: "/notifications", method: "POST", body }),
      transformResponse: (res: unknown) =>
        extractObjectFromResponse<Notification>(res) ?? ({} as Notification),
      invalidatesTags: (_result, _error, { user_id }) => [
        { type: "Notification", id: "LIST" },
        { type: "NotificationsByUser", id: user_id },
      ],
    }),

    getNotificationsByUser: builder.query<Notification[], string>({
      query: (userId) => ({
        url: `/notifications/user/${userId}`,
        method: "GET",
      }),
      transformResponse: (res: unknown) => extractArrayFromResponse<Notification>(res),
      providesTags: (result, _error, userId) =>
        result
          ? [
              { type: "NotificationsByUser", id: userId },
              ...result.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
            ]
          : [{ type: "NotificationsByUser", id: userId }],
    }),

    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      transformResponse: (res: unknown) =>
        extractObjectFromResponse<Notification>(res) ?? ({} as Notification),
      invalidatesTags: (_result, _error, id) => [{ type: "Notification", id }],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults: { undo: () => void }[] = [];

        // Update all queries that might contain this notification
        dispatch(
          notificationsApi.util.updateQueryData(
            "getNotificationsByUser",
            id,
            (draft) => {
              const notification = draft.find((n) => n.id === id);
              if (notification) {
                notification.isRead = true;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
    }),

    deleteNotification: builder.mutation<void, string>({
      query: (id) => ({ url: `/notifications/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
      ],
    }),

    // ---------- Bulk Operations ----------
    markAllAsRead: builder.mutation<void, string>({
      async queryFn(userId, _api, _extraOptions, fetchWithBQ) {
        try {
          // Get all unread notifications
          const notificationsResult = await fetchWithBQ({
            url: `/notifications/user/${userId}`,
            method: "GET",
          });

          if (notificationsResult.error) {
            return { error: notificationsResult.error };
          }

          const response = notificationsResult.data as ApiEnvelope<
            Notification[]
          >;
          const notifications = response.data ?? [];
          const unreadNotifications = notifications.filter((n) => !n.isRead);

          // Mark each as read
          const updatePromises = unreadNotifications.map((notification) =>
            fetchWithBQ({
              url: `/notifications/${notification.id}/read`,
              method: "PATCH",
            })
          );

          await Promise.all(updatePromises);

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (_result, _error, userId) => [
        { type: "NotificationsByUser", id: userId },
      ],
    }),

    bulkDeleteNotifications: builder.mutation<void, string[]>({
      async queryFn(ids, _api, _extraOptions, fetchWithBQ) {
        try {
          const deletePromises = ids.map((id) =>
            fetchWithBQ({ url: `/notifications/${id}`, method: "DELETE" })
          );

          const results = await Promise.all(deletePromises);

          const hasError = results.some((result) => result.error);
          if (hasError) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "Some notifications failed to delete",
              },
            };
          }

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: [{ type: "Notification", id: "LIST" }],
    }),

    clearAllNotifications: builder.mutation<void, string>({
      async queryFn(userId, _api, _extraOptions, fetchWithBQ) {
        try {
          // Get all notifications for user
          const notificationsResult = await fetchWithBQ({
            url: `/notifications/user/${userId}`,
            method: "GET",
          });

          if (notificationsResult.error) {
            return { error: notificationsResult.error };
          }

          const response = notificationsResult.data as ApiEnvelope<
            Notification[]
          >;
          const notifications = response.data ?? [];

          // Delete all notifications
          const deletePromises = notifications.map((notification) =>
            fetchWithBQ({
              url: `/notifications/${notification.id}`,
              method: "DELETE",
            })
          );

          await Promise.all(deletePromises);

          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: String(error),
            },
          };
        }
      },
      invalidatesTags: (_result, _error, userId) => [
        { type: "NotificationsByUser", id: userId },
        { type: "Notification", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useCreateNotificationMutation,
  useGetNotificationsByUserQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useMarkAllAsReadMutation,
  useBulkDeleteNotificationsMutation,
  useClearAllNotificationsMutation,
} = notificationsApi;
