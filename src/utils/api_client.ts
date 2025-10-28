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

  if (!session) {
    console.log('No session found')
    window.location.href = '/login'
    throw new ApiError(401, t('error.unauthorized'))
  } else {
  }

  const token = session?.accessToken

  const { requiresAuth = true, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers as HeadersInit)
  headers.set('Content-Type', 'application/json')

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
        // const refreshed = await refreshToken()
        // if (refreshed) {
        //   // Retry the request with new token
        //   return apiClient(endpoint, options)
        // }
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



export { apiClient, ApiError }