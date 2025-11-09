'use server'
import { t } from 'i18next'
import { authOptions } from "@/app/api/auth/option"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

/**
 * API Response format (snake_case)
 * Note: API uses snake_case, but we convert to camelCase internally
 */
interface AuthApiResponse {
  code: number
  success: boolean
  data: {
    access_token: string
    refresh_token: string
    access_token_expires_at: number // Unix timestamp in seconds
    refresh_token_expires_at?: number // Unix timestamp in seconds
    token_type: string
    user?: {
      id: string
      username: string
      email: string
      role: string
    }
  }
}

/**
 * Converts Unix timestamp to milliseconds
 * API returns timestamps in seconds, but JavaScript uses milliseconds
 */
function convertUnixTimestampToMs(timestamp: number | string): number {
  const num = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
  // If timestamp is less than 1e12, it's likely in seconds (not milliseconds)
  // Multiply by 1000 to convert to milliseconds
  return num < 1e12 ? num * 1000 : num
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiError extends Error {
  constructor(public status: number, message: string, public shouldRedirect?: boolean) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Attempts to refresh the access token using the refresh token
 */
async function refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string; expiresAt: number } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error('[API] ❌ Token refresh failed (api_client):', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        reason: 'REFRESH_API_ERROR'
      })
      return null
    }

    const data: AuthApiResponse = await response.json()
    const expiresAt = data.data?.access_token_expires_at
      ? convertUnixTimestampToMs(data.data.access_token_expires_at) // seconds -> milliseconds
      : Date.now() + 3600000
    const expiresIn = Math.round((expiresAt - Date.now()) / 1000 / 60)
    
    console.log('[API] ✅ Token refresh successful (api_client):', {
      newExpiresIn: `${expiresIn} minutes`,
      newExpiresAt: new Date(expiresAt).toISOString(),
      hasNewRefreshToken: !!data.data?.refresh_token
    })
    
    // Map API response (snake_case) to internal format (camelCase)
    return {
      accessToken: data.data?.access_token || '',
      refreshToken: data.data?.refresh_token || refreshToken,
      expiresAt
    }
  } catch (error) {
    console.error('[API] ❌ Token refresh exception (api_client):', {
      error: error instanceof Error ? error.message : String(error),
      reason: 'REFRESH_NETWORK_ERROR'
    })
    return null
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('[API] 🚪 No session found - redirecting to login:', {
      endpoint,
      reason: 'NO_SESSION'
    })
    redirect('/login')
  }

  // Check if session has error (refresh failed)
  if ((session as any).error === 'RefreshAccessTokenError') {
    console.log('[API] 🚪 Session error detected - redirecting to login:', {
      endpoint,
      userId: session.user?.id,
      username: session.user?.username,
      reason: 'REFRESH_ACCESS_TOKEN_ERROR'
    })
    redirect('/login')
  }

  const token = session?.accessToken

  const { requiresAuth = true, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers as HeadersInit)
  // Only set Content-Type to JSON if not already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const url = `${API_BASE_URL}${endpoint}`
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (!response.ok) {
      if (response.status === 401) {
        console.log('[API] 🔄 401 Unauthorized - attempting token refresh:', {
          endpoint,
          userId: session.user?.id,
          username: session.user?.username,
          reason: 'TOKEN_EXPIRED_OR_INVALID'
        })
        
        // Token expired, try to refresh
        const refreshTokenValue = session?.refreshToken

        if (refreshTokenValue) {
          const refreshed = await refreshToken(refreshTokenValue)

          if (refreshed) {
            console.log('[API] ✅ Token refreshed successfully - retrying request:', {
              endpoint,
              newExpiresAt: new Date(refreshed.expiresAt).toISOString()
            })
            
            // Retry the request with new token
            const newHeaders = new Headers(fetchOptions.headers as HeadersInit)
            newHeaders.set('Content-Type', 'application/json')
            newHeaders.set('Authorization', `Bearer ${refreshed.accessToken}`)

            const retryResponse = await fetch(url, {
              ...fetchOptions,
              headers: newHeaders,
            })

            if (retryResponse.ok) {
              console.log('[API] ✅ Retry request successful:', { endpoint })
              const contentType = retryResponse.headers.get('content-type')
              if (contentType && contentType.includes('application/json')) {
                return retryResponse.json()
              }
              return retryResponse as unknown as T
            }

            // If retry still fails with 401, redirect to login
            if (retryResponse.status === 401) {
              console.log('[API] 🚪 Retry still failed with 401 - redirecting to login:', {
                endpoint,
                reason: 'RETRY_STILL_401'
              })
              redirect('/login')
            }
          } else {
            // Refresh failed, redirect to login
            console.log('[API] 🚪 Token refresh failed - redirecting to login:', {
              endpoint,
              reason: 'REFRESH_FAILED'
            })
            redirect('/login')
          }
        } else {
          // No refresh token available, redirect to login
          console.log('[API] 🚪 No refresh token available - redirecting to login:', {
            endpoint,
            reason: 'NO_REFRESH_TOKEN'
          })
          redirect('/login')
        }

        // If we get here, something went wrong
        throw new ApiError(401, 'Unauthorized', true)
      }

      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        error.message || `HTTP Error: ${response.status}`
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }

    return response as unknown as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    // Check if it's a redirect error (Next.js redirect throws)
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error
    }
    throw new ApiError(0, 'Network error')
  }
}



export { apiClient, ApiError }