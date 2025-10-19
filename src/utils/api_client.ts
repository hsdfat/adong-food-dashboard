'use server'
import { t } from 'i18next'
import { authOptions } from "@/app/api/auth/option"
import { getServerSession } from "next-auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const session = await getServerSession(authOptions)
  console.log('Current session in apiClient:', session)
  if (!session) {
    console.log('No session found')
    throw new ApiError(401, t('error.unauthorized'))
  } else {
    console.log('Session found:', session)
  }

  const token = session?.accessToken

  console.log('API Request:')
  const { requiresAuth = true, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  console.log('Using token:', token)
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

  const url = `${API_BASE_URL}${endpoint}`
  console.log('API Request:', url, fetchOptions, headers)
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })
   
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshToken()
        if (refreshed) {
          // Retry the request with new token
          return apiClient(endpoint, options)
        }
        // Redirect to login
        window.location.href = '/login'
        throw new ApiError(401, 'Unauthorized')
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
    throw new ApiError(0, 'Network error')
  }
}

async function refreshToken(): Promise<boolean> {
  try {
    const cookieStore = cookies()
const refreshToken = cookieStore.get('refresh_token')?.value
    if (!refreshToken) {
      return false
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    console.log('Token refreshed:', data)
    cookieStore.set('access_token', data.token)
    if (data.expire) {
      cookieStore.set('token_expire', data.expire)
    }

    return true
  } catch {
    return false
  }
}

export { apiClient, ApiError }