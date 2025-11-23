import NextAuth, { User } from 'next-auth'
import { authOptions } from '@/app/api/auth/option'

declare module 'next-auth' {
  interface User {
    id: string | number // API returns id as string (e.g., "NV001")
    username: string
    name: string
    email: string
    avatar: string
  }

  interface Session {
    user: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
