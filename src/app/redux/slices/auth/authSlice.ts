import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types/auth/authTypes'
import { cookies } from '../../utils/cookies'

type AuthState = {
  user: User | null
}

const initialState: AuthState = {
  user: null,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set tokens in cookies and user in Redux state
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string | null; user?: User | null }>
    ) => {
      // Store tokens in cookies
      if (action.payload.accessToken && action.payload.refreshToken) {
        cookies.setAuthTokens(action.payload.accessToken, action.payload.refreshToken)
      } else if (action.payload.accessToken) {
        cookies.set('accessToken', action.payload.accessToken, 1)
      }
      
      // Store user in Redux state
      if (action.payload.user !== undefined) {
        state.user = action.payload.user
      }
    },
    // Only update the access token in cookie
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      if (action.payload) {
        cookies.set('accessToken', action.payload, 1)
      }
    },
    // Set user from persisted storage on app boot
    hydrateFromStorage: (
      state,
      action: PayloadAction<{ user?: User | null }>
    ) => {
      state.user = action.payload.user ?? null
    },
    logout: (state) => {
      // Clear cookies
      cookies.clearAuthTokens()
      // Clear Redux state
      state.user = null
    },
  },
})

export const { setCredentials, setAccessToken, hydrateFromStorage, logout } = slice.actions
export default slice.reducer
