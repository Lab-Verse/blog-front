import { baseApi } from "../baseApi";
import type {
  ApiEnvelope,
  ForgotPasswordDto,
  LoginData,
  LoginDto,
  RefreshData,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  User,
} from "../../types/auth/authTypes";
import { setCredentials, logout } from "./../../slices/auth/authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    register: b.mutation<ApiEnvelope<LoginData>, RegisterDto>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),

    login: b.mutation<ApiEnvelope<LoginData>, LoginDto>({
      query: (body) => ({ url: "/auth/front-login", method: "POST", body }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const payload = data.data;

          if (payload) {
            dispatch(
              setCredentials({
                accessToken: payload.accessToken,
                refreshToken: payload.refreshToken,
                user: payload.user,
              })
            );
          }
        } catch {}
      },
      invalidatesTags: ["Auth", "User"],
    }),

    refresh: b.mutation<ApiEnvelope<RefreshData>, RefreshTokenDto>({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const access = data.data?.accessToken ?? null;
          if (access) dispatch(setCredentials({ accessToken: access }));
          else dispatch(logout());
        } catch {
          dispatch(logout());
        }
      },
    }),

    logout: b.mutation<ApiEnvelope<{ ok: true }>, { refreshToken?: string } | void>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body: body || {},
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(logout());
      },
      invalidatesTags: ["Auth", "User"],
    }),

    forgotPassword: b.mutation<ApiEnvelope<unknown>, ForgotPasswordDto>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),

    resetPassword: b.mutation<ApiEnvelope<unknown>, ResetPasswordDto>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
