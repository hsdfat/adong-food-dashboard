import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDictionary } from '@/locales/dictionary'
import Cookies from 'js-cookie'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token, trigger }) {
      if (user) {
        return { 
          ...token, 
          user: { ...user as User },
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: (user as any).accessTokenExpires || Date.now() + 3600000 // Default 1 hour
        }
      }

      // If token is expired or about to expire (within 5 minutes), try to refresh
      if (token.refreshToken && token.accessTokenExpires) {
        const now = Date.now()
        const expiresAt = token.accessTokenExpires as number
        
        // Refresh if expired or expires within 5 minutes
        if (now >= expiresAt - 300000) {
          try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.refreshToken}`
              }
            })

            if (response.ok) {
              const data = await response.json()
              return {
                ...token,
                accessToken: data.data?.access_token || token.accessToken,
                refreshToken: data.data?.refresh_token || token.refreshToken,
                accessTokenExpires: data.data?.access_token_expires_at 
                  ? new Date(data.data.access_token_expires_at).getTime()
                  : Date.now() + 3600000
              }
            }
          } catch (error) {
            console.error('Failed to refresh token:', error)
            // Return expired token so the session can be invalidated
            return { ...token, error: 'RefreshAccessTokenError' }
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        // Signal that session should be invalidated
        return {
          ...session,
          user: token.user,
          accessToken: undefined,
          refreshToken: undefined,
          error: 'RefreshAccessTokenError'
        }
      }

      return { 
        ...session, 
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
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
          console.log('Credentials login request sent', `${API_BASE_URL}/auth/login`, JSON.stringify({
              username,
              password,
            }))
          console.log('Login response:', response)
          if (!response.ok) {
            throw new Error(dict.login.message.auth_failed)
          }

          const data = await response.json()

          // Store tokens in cookies fr client-side access
          console.log('Running in browser:', typeof window !== 'undefined')
          
          if (typeof window !== 'undefined') {
            Cookies.set('name', 'value')
            Cookies.set('access_token', data.data.access_token)
            console.log('Storing tokens in cookies1', data.data.access_token)

            if (data.data.refresh_token) {
              Cookies.set('refresh_token', data.data.refresh_token)
            }
            if (data.data.access_token_expires_at) {
              Cookies.set('token_expire', data.data.access_token_expires_at)
            }
          } 

          return {
            id: data.user?.id || 1,
            name: data.user?.name || username,
            username: username,
            email: data.user?.email || `${username}@email.com`,
            avatar: data.user?.avatar || '/assets/img/avatars/8.jpg',
            accessToken: data.data.access_token,
            refreshToken: data.data.refresh_token,
            accessTokenExpires: data.data.access_token_expires_at 
              ? new Date(data.data.access_token_expires_at).getTime()
              : Date.now() + 3600000,
          }
        } catch (error) {
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
    id: number
    username: string
    name: string
    email: string
    avatar: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
  }

  interface Session {
    user: User
    accessToken?: string
    refreshToken?: string
    error?: 'RefreshAccessTokenError'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: 'RefreshAccessTokenError'
  }
}