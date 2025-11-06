'use server'
import { t } from 'i18next'
import { authOptions } from "@/app/api/auth/option"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

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
      return null
    }

    const data = await response.json()
    return {
      accessToken: data.data?.access_token || '',
      refreshToken: data.data?.refresh_token || refreshToken,
      expiresAt: data.data?.access_token_expires_at
        ? new Date(data.data.access_token_expires_at).getTime()
        : Date.now() + 3600000
    }
  } catch (error) {
    console.error('Failed to refresh token:', error)
    return null
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('No session found')
    redirect('/login')
  }

  // Check if session has error (refresh failed)
  if ((session as any).error === 'RefreshAccessTokenError') {
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
        // Token expired, try to refresh
        const refreshTokenValue = session?.refreshToken

        if (refreshTokenValue) {
          const refreshed = await refreshToken(refreshTokenValue)

          if (refreshed) {
            // Retry the request with new token
            const newHeaders = new Headers(fetchOptions.headers as HeadersInit)
            newHeaders.set('Content-Type', 'application/json')
            newHeaders.set('Authorization', `Bearer ${refreshed.accessToken}`)

            const retryResponse = await fetch(url, {
              ...fetchOptions,
              headers: newHeaders,
            })

            if (retryResponse.ok) {
              const contentType = retryResponse.headers.get('content-type')
              if (contentType && contentType.includes('application/json')) {
                return retryResponse.json()
              }
              return retryResponse as unknown as T
            }

            // If retry still fails with 401, redirect to login
            if (retryResponse.status === 401) {
              redirect('/login')
            }
          } else {
            // Refresh failed, redirect to login
            redirect('/login')
          }
        } else {
          // No refresh token available, redirect to login
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