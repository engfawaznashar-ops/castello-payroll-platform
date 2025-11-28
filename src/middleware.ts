import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Redirect to dashboard if accessing root
    if (req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/employees/:path*',
    '/upload/:path*',
    '/quality/:path*',
    '/alerts/:path*',
    '/ai/:path*'
  ]
}


