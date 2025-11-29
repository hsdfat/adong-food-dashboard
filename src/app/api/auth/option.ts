import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDictionary } from '@/locales/dictionary'
import Cookies from 'js-cookie'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

/**
 * API Response format (snake_case)
 */
interface AuthApiResponse {
  code: number;
  success: boolean;
  data: {
    access_token: string;
    refresh_token: string;
    access_token_expires_at: number; // Unix timestamp in seconds
    refresh_token_expires_at?: number; // Unix timestamp in seconds
    token_type: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      fullName?: string;
      name?: string;
      avatar?: string;
    };
  };
}

/**
 * Converts Unix timestamp to milliseconds
 * API returns timestamps in seconds, but JavaScript uses milliseconds
 */
function convertUnixTimestampToMs(timestamp: number | string): number {
  const num =
    typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
  // If timestamp is less than 1e12, it's likely in seconds (not milliseconds)
  // Multiply by 1000 to convert to milliseconds
  return num < 1e12 ? num * 1000 : num
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token, trigger }) {
      if (user) {
        // User just logged in - set token with current time as lastRefreshed
        // This prevents immediate refresh attempts right after login
        const userWithTokens = user as User & { accessTokenExpires?: number; accessToken?: string; refreshToken?: string }
        const expiresAt =
          userWithTokens.accessTokenExpires || Date.now() + 3600000
        const expiresIn = Math.round((expiresAt - Date.now()) / 1000 / 60) // minutes

        console.log('[AUTH] 🔐 User logged in:', {
          userId: user.id,
          username: user.username,
          tokenExpiresIn: `${expiresIn} minutes`,
          expiresAt: new Date(expiresAt).toISOString(),
          trigger: trigger || 'login',
        })

        return {
          ...token,
          user: { ...(user as User) },
          accessToken: userWithTokens.accessToken,
          refreshToken: userWithTokens.refreshToken,
          accessTokenExpires: expiresAt,
          lastRefreshed: Date.now(), // Set to current time to prevent immediate refresh
        }
      }

      // Only refresh token if it's actually expired or very close to expiry
      // This prevents unnecessary refresh calls on every request
      if (!token.refreshToken) {
        console.warn('[AUTH] ⚠️ No refresh token available:', {
          hasAccessToken: !!token.accessToken,
          hasAccessTokenExpires: !!token.accessTokenExpires,
          userId: token.user?.id,
          username: token.user?.username,
        })
      }

      if (token.refreshToken && token.accessTokenExpires) {
        const now = Date.now()
        const expiresAt = token.accessTokenExpires as number
        const lastRefreshed = (token.lastRefreshed as number) || 0
        const timeSinceLastRefresh = now - lastRefreshed
        const isExpired = now >= expiresAt
        const timeUntilExpiry = expiresAt - now
        const minutesUntilExpiry = Math.round(timeUntilExpiry / 1000 / 60)
        // Only refresh if expires within 1 minute (not 5 minutes to be less aggressive)
        const expiresVerySoon = now >= expiresAt - 60000 // Expires within 1 minute

        // Don't log on every request - JWT callback runs on every request by design
        // Only log when there's an actual issue (expired/expiring) or refresh attempt

        // Debug: Check if timestamp looks wrong (too small, likely in seconds instead of ms)
        const isTimestampInSeconds = expiresAt < 1e12 // Less than year 2001 in ms
        if (isTimestampInSeconds && expiresAt > 0) {
          console.warn(
            '[AUTH] ⚠️ Timestamp appears to be in seconds, converting:',
            {
              rawExpiresAt: expiresAt,
              convertedExpiresAt: expiresAt * 1000,
              rawDate: new Date(expiresAt).toISOString(),
              convertedDate: new Date(expiresAt * 1000).toISOString(),
            },
          )
          // Fix the timestamp if it's in seconds
          const fixedExpiresAt = expiresAt * 1000
          // Create new token object with fixed timestamp instead of mutating
          const updatedToken = { ...token, accessTokenExpires: fixedExpiresAt }
          // Recalculate with fixed timestamp
          const fixedIsExpired = now >= fixedExpiresAt
          const fixedTimeUntilExpiry = fixedExpiresAt - now
          const fixedMinutesUntilExpiry = Math.round(
            fixedTimeUntilExpiry / 1000 / 60,
          )
          const fixedExpiresVerySoon = now >= fixedExpiresAt - 60000

          // Use fixed values
          const shouldRefresh =
            (fixedIsExpired && timeSinceLastRefresh > 30000) ||
            (fixedExpiresVerySoon && timeSinceLastRefresh > 300000)

          // Log token status check with fixed values
          if (trigger || shouldRefresh || fixedIsExpired) {
            console.log('[AUTH] 🔍 Token status check (FIXED):', {
              trigger: trigger || 'jwt-callback',
              isExpired: fixedIsExpired,
              expiresVerySoon: fixedExpiresVerySoon,
              minutesUntilExpiry: fixedIsExpired
                ? 'EXPIRED'
                : `${fixedMinutesUntilExpiry} min`,
              timeSinceLastRefresh: `${Math.round(timeSinceLastRefresh / 1000)}s`,
              shouldRefresh,
              expiresAt: new Date(fixedExpiresAt).toISOString(),
              now: new Date(now).toISOString(),
              rawExpiresAtValue: expiresAt,
              fixedExpiresAtValue: fixedExpiresAt,
            })
          }

          if (shouldRefresh) {
            console.log('[AUTH] 🔄 Attempting token refresh (FIXED):', {
              reason: fixedIsExpired ? 'TOKEN_EXPIRED' : 'EXPIRES_SOON',
              timeSinceLastRefresh: `${Math.round(timeSinceLastRefresh / 1000)}s`,
              minutesUntilExpiry: fixedIsExpired
                ? 'EXPIRED'
                : `${fixedMinutesUntilExpiry} min`,
            })
            try {
              const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token.refreshToken}`,
                },
              })

              if (response.ok) {
                const data: AuthApiResponse = await response.json()
                const newExpiresAt = data.data?.access_token_expires_at
                  ? convertUnixTimestampToMs(data.data.access_token_expires_at)
                  : Date.now() + 3600000
                const newExpiresIn = Math.round(
                  (newExpiresAt - Date.now()) / 1000 / 60,
                )

                console.log('[AUTH] ✅ Token refresh successful:', {
                  newExpiresIn: `${newExpiresIn} minutes`,
                  newExpiresAt: new Date(newExpiresAt).toISOString(),
                  hasNewRefreshToken: !!data.data?.refresh_token,
                })

                // Map API response (snake_case) to internal format (camelCase)
                return {
                  ...updatedToken,
                  accessToken: data.data?.access_token || updatedToken.accessToken,
                  refreshToken: data.data?.refresh_token || updatedToken.refreshToken,
                  accessTokenExpires: newExpiresAt,
                  lastRefreshed: now,
                }
              }
                const errorText = await response
                  .text()
                  .catch(() => 'Unknown error')
                console.error('[AUTH] ❌ Token refresh failed:', {
                  status: response.status,
                  statusText: response.statusText,
                  error: errorText,
                  reason: 'REFRESH_API_ERROR',
                })
                // Return expired token so the session can be invalidated
                return { ...updatedToken, error: 'RefreshAccessTokenError' }

            } catch (error) {
              console.error('[AUTH] ❌ Token refresh exception:', {
                error: error instanceof Error ? error.message : String(error),
                reason: 'REFRESH_NETWORK_ERROR',
              })
              // Return expired token so the session can be invalidated
              return { ...updatedToken, error: 'RefreshAccessTokenError' }
            }
          }

          return updatedToken
        }

        // Refresh if:
        // 1. Token is already expired AND we haven't refreshed in the last 30 seconds (prevent loops)
        // 2. Token expires very soon (within 1 min) AND we haven't refreshed in the last 5 minutes
        // This prevents refresh on every request while still keeping tokens valid
        const shouldRefresh =
          (isExpired && timeSinceLastRefresh > 30000) ||
          (expiresVerySoon && timeSinceLastRefresh > 300000)

        if (shouldRefresh) {
          console.log('[AUTH] 🔄 Attempting token refresh:', {
            reason: isExpired ? 'TOKEN_EXPIRED' : 'EXPIRES_SOON',
            timeSinceLastRefresh: `${Math.round(timeSinceLastRefresh / 1000)}s`,
            minutesUntilExpiry: isExpired
              ? 'EXPIRED'
              : `${minutesUntilExpiry} min`,
            expiresAt: new Date(expiresAt).toISOString(),
            now: new Date(now).toISOString(),
          })
          try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.refreshToken}`,
              },
            })

            if (response.ok) {
              const data: AuthApiResponse = await response.json()
              const newExpiresAt = data.data?.access_token_expires_at
                ? convertUnixTimestampToMs(data.data.access_token_expires_at)
                : Date.now() + 3600000
              const newExpiresIn = Math.round(
                (newExpiresAt - Date.now()) / 1000 / 60,
              )

              console.log('[AUTH] ✅ Token refresh successful:', {
                newExpiresIn: `${newExpiresIn} minutes`,
                newExpiresAt: new Date(newExpiresAt).toISOString(),
                hasNewRefreshToken: !!data.data?.refresh_token,
              })

              // Map API response (snake_case) to internal format (camelCase)
              return {
                ...token,
                accessToken: data.data?.access_token || token.accessToken,
                refreshToken: data.data?.refresh_token || token.refreshToken,
                accessTokenExpires: newExpiresAt,
                lastRefreshed: now,
              }
            } 
              const errorText = await response
                .text()
                .catch(() => 'Unknown error')
              console.error('[AUTH] ❌ Token refresh failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
                reason: 'REFRESH_API_ERROR',
              })
              // Return expired token so the session can be invalidated
              return { ...token, error: 'RefreshAccessTokenError' }
            
          } catch (error) {
            console.error('[AUTH] ❌ Token refresh exception:', {
              error: error instanceof Error ? error.message : String(error),
              reason: 'REFRESH_NETWORK_ERROR',
            })
            // Return expired token so the session can be invalidated
            return { ...token, error: 'RefreshAccessTokenError' }
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        console.log('[AUTH] 🚪 Session invalidated - logout required:', {
          userId: token.user?.id,
          username: token.user?.username,
          reason: 'REFRESH_TOKEN_FAILED',
          error: 'RefreshAccessTokenError',
        })
        // Signal that session should be invalidated
        return {
          ...session,
          user: token.user,
          accessToken: undefined,
          refreshToken: undefined,
          error: 'RefreshAccessTokenError',
        }
      }

      // Log session access (only occasionally to avoid spam)
      if (Math.random() < 0.01) {
        // Log 1% of session accesses
        console.log('[AUTH] 📋 Session accessed:', {
          userId: token.user?.id,
          username: token.user?.username,
          hasAccessToken: !!token.accessToken,
          hasRefreshToken: !!token.refreshToken,
        })
      }

      return {
        ...session,
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      }
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: 'string' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }
        const { username, password } = credentials

        const dict = await getDictionary()

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
            }),
          })
          console.log('[AUTH] 📤 Login request sent:', {
            url: `${API_BASE_URL}/auth/login`,
            username,
            timestamp: new Date().toISOString(),
          })

          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error')
            console.log('[AUTH] ❌ Login failed:', {
              status: response.status,
              statusText: response.statusText,
              error: errorText,
              username,
              reason: 'LOGIN_API_ERROR',
            })
            throw new Error(dict.login.message.auth_failed)
          }

          console.log('[AUTH] ✅ Login response received:', {
            status: response.status,
            username,
          })

          const data: AuthApiResponse = await response.json()
          const expiresAt = data.data.access_token_expires_at
            ? convertUnixTimestampToMs(data.data.access_token_expires_at)
            : Date.now() + 3600000
          const expiresIn = Math.round((expiresAt - Date.now()) / 1000 / 60)

          console.log('[AUTH] 📦 Login data received:', {
            userId: data.data.user?.id,
            username: data.data.user?.username,
            email: data.data.user?.email,
            role: data.data.user?.role,
            tokenExpiresIn: `${expiresIn} minutes`,
            expiresAt: new Date(expiresAt).toISOString(),
            hasRefreshToken: !!data.data.refresh_token,
          })

          // Store tokens in cookies for client-side access
          if (typeof window !== 'undefined') {
            Cookies.set('name', 'value')
            Cookies.set('access_token', data.data.access_token)
            console.log('[AUTH] 🍪 Storing tokens in cookies')

            if (data.data.refresh_token) {
              Cookies.set('refresh_token', data.data.refresh_token)
            }
            if (data.data.access_token_expires_at) {
              Cookies.set(
                'token_expire',
                String(data.data.access_token_expires_at),
              )
            }
          }

          // Map API response (snake_case) to NextAuth User format (camelCase)
          return {
            id: data.data.user?.id || username, // API returns id as string (e.g., "NV001")
            name: data.data.user?.fullName || data.data.user?.name || username,
            username,
            email: data.data.user?.email || `${username}@email.com`,
            avatar: data.data.user?.avatar || '/assets/img/avatars/8.jpg',
            role: data.data.user?.role || 'user',
            accessToken: data.data.access_token, // snake_case -> camelCase
            refreshToken: data.data.refresh_token, // snake_case -> camelCase
            accessTokenExpires: data.data.access_token_expires_at
              ? convertUnixTimestampToMs(data.data.access_token_expires_at) // snake_case -> camelCase, seconds -> milliseconds
              : Date.now() + 3600000,
          }
        } catch (error) {
          console.error('[AUTH] ❌ Login exception:', {
            error: error instanceof Error ? error.message : String(error),
            username,
            reason: 'LOGIN_EXCEPTION',
          })
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error(dict.login.message.auth_failed)
        }
      },
    }),
  ],
}

declare module 'next-auth' {
  interface User {
    id: string | number; // API returns id as string (e.g., "NV001")
    username: string;
    name: string;
    email: string;
    avatar: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }

  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    error?: 'RefreshAccessTokenError';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    lastRefreshed?: number;
    error?: 'RefreshAccessTokenError';
  }
}
