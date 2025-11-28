import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Log environment info for debugging
console.log('[NextAuth Route] Initializing NextAuth handler')
console.log('[NextAuth Route] NEXTAUTH_URL:', process.env.NEXTAUTH_URL)
console.log('[NextAuth Route] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET')
console.log('[NextAuth Route] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
console.log('[NextAuth Route] NODE_ENV:', process.env.NODE_ENV)

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


