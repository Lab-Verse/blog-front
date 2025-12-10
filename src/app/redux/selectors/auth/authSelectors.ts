import type { RootState } from './../../store'
import { cookies } from '../../utils/cookies'

export const selectAuth = (s: RootState) => s.auth
export const selectUser = (s: RootState) => s.auth.user
export const selectAccessToken = () => cookies.getAccessToken()
export const selectRefreshToken = () => cookies.getRefreshToken()
export const selectIsAuthenticated = (s: RootState) => Boolean(cookies.getAccessToken() && s.auth.user)
export const selectUserRole = (s: RootState) => s.auth.user?.role
export const selectUserId = (s: RootState) => s.auth.user?.id
