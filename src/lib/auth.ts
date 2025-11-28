import NextAuth, { type NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from 'bcrypt'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('[NextAuth] Authorize attempt for:', credentials?.email)
          
          if (!credentials?.email || !credentials?.password) {
            console.log('[NextAuth] Missing credentials')
            return null
          }

          // Test database connection
          console.log('[NextAuth] Testing database connection...')
          await prisma.$connect()
          console.log('[NextAuth] Database connected successfully')

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log('[NextAuth] User not found:', credentials.email)
            return null
          }

          if (!user.passwordHash) {
            console.log('[NextAuth] User has no password hash')
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isPasswordValid) {
            console.log('[NextAuth] Invalid password for:', credentials.email)
            return null
          }

          console.log('[NextAuth] Authentication successful for:', user.email)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('[NextAuth] Authorization error:', error)
          console.error('[NextAuth] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          })
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login on error
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development' || process.env.NEXTAUTH_DEBUG === 'true',
  logger: {
    error(code, metadata) {
      console.error('[NextAuth Error]', code, metadata)
    },
    warn(code) {
      console.warn('[NextAuth Warn]', code)
    },
    debug(code, metadata) {
      if (process.env.NEXTAUTH_DEBUG === 'true') {
        console.log('[NextAuth Debug]', code, metadata)
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'castello-coffee-secret-key-change-in-production'
}

// Helper function to get session in API routes and server components
export async function auth() {
  return await getServerSession(authOptions)
}
