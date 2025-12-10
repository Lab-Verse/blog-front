// Utility for managing cookies, especially for authentication tokens

export const cookies = {
  // Set authentication tokens
  setAuthTokens: (accessToken: string, refreshToken: string) => {
    cookies.set('accessToken', accessToken, 1) // 1 day
    cookies.set('refreshToken', refreshToken, 7) // 7 days
  },

  // Set a cookie
  set: (name: string, value: string, days: number) => {
    if (typeof document === 'undefined') return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  },

  // Get a cookie
  get: (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  // Get access token
  getAccessToken: (): string | null => {
    return cookies.get('accessToken')
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return cookies.get('refreshToken')
  },

  // Clear authentication tokens
  clearAuthTokens: () => {
    cookies.erase('accessToken')
    cookies.erase('refreshToken')
  },

  // Erase a cookie
  erase: (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999;`
  },
}