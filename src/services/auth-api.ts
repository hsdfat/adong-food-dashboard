/**
 * Authentication API Service
 * Handles user registration and authentication-related operations
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

/**
 * Registration Request
 */
export interface RegisterInput {
  username: string
  email: string
  password: string
  role?: string // Optional - defaults to 'user' on backend
}

/**
 * Registration Response (from backend)
 */
export interface RegisterResponse {
  success: boolean
  code: number
  message: string
  data: {
    user_id: string
    username: string
    email: string
    role: string
    created_at: number
  }
}

/**
 * Error Response
 */
export interface ErrorResponse {
  success: false
  code: number
  message: string
}

/**
 * Public registration endpoint - No authentication required
 * Creates a new user with 'user' role by default
 */
export const register = async (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  try {
    console.log('[AuthAPI] Sending registration request to:', `${API_BASE_URL}/auth/register`)
    console.log('[AuthAPI] Request data:', { ...data, password: '***' })

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    console.log('[AuthAPI] Response status:', response.status, response.statusText)

    const result = await response.json()
    console.log('[AuthAPI] Response body:', result)

    if (!response.ok) {
      console.error('[AuthAPI] Registration failed:', result)
      throw new Error(result.message || 'Registration failed')
    }

    console.log('[AuthAPI] Registration successful')
    return result
  } catch (error) {
    console.error('[AuthAPI] Registration error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred during registration')
  }
}

/**
 * Auth API Service
 */
export const authApi = {
  /**
   * Register a new user (public endpoint)
   */
  register,
}
