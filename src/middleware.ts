import { NextRequest, NextResponse } from 'next/server'
import { composeMiddleware } from 'next-compose-middleware'
import { adminMiddleware } from './middleware/admin'
import { securityMiddleware } from './middleware/security'


// The middleware function
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  return composeMiddleware(request, response, {
    scripts: [securityMiddleware, adminMiddleware],
  }) 
}

// Matcher configuration
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
