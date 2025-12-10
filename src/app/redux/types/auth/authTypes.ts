// Keep these flexible so you don't have to mirror backend enums here.
export type Role = string;           // e.g., 'USER' | 'ADMIN' | ...
export type UserStatus = string;     // e.g., 'ACTIVE' | 'INACTIVE' | ...

export type User = {
  id: string
  username: string
  email: string
  role_id?: string | null
  role?: Role
  status?: UserStatus
  avatarUrl?: string | null
}

export type LoginDto = { email: string; password: string }
export type RegisterDto = {
  username: string
  email: string
  password: string
}
export type RefreshTokenDto = { refreshToken: string }
export type ForgotPasswordDto = { email: string }
export type ResetPasswordDto = { token: string; password: string }

// API responses shaped like your controller/service returns.
export type ApiEnvelope<T> = {
  success: boolean
  message: string
  data?: T
  token?: string         // /forgot-password returns { token }
  user?: User            // /register returns { user }
}

export type LoginData = { accessToken: string; refreshToken: string; user: User }
export type RefreshData = { accessToken: string }
