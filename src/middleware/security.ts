import { NextRequest, NextResponse } from 'next/server'
import { defaultConfig } from '@/configs/config_security'
import { SecurityConfig } from '@/type/config_security'
import { composeMiddleware } from 'next-compose-middleware'

function setSecurityHeaders(response: NextResponse, config: SecurityConfig) {
  const { headers } = response

  // if (config.hideHeaderPoweredBy) {
  //   headers.delete('x-powered-by')
  // }

  // if (config.xssProtection) {
  //   headers.set('X-XSS-Protection', '1; mode=block')
  // }

  // if (config.contentTypeOptions) {
  //   headers.set('X-Content-Type-Options', 'nosniff')
  // }

  // if (config.frameguard) {
  //   const { action, domain } = config.frameguard
  //   let value = action as string
  //   if (action === 'ALLOW-FROM' && domain) {
  //     value = `ALLOW-FROM ${domain}`
  //   }
  //   headers.set('X-Frame-Options', value)
  // }

  // if (config.contentSecurityPolicy) {
  //   headers.set(
  //     'Content-Security-Policy',
  //     "default-src 'self'; " +
  //       "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  //       "style-src 'self' 'unsafe-inline'; " +
  //       "img-src 'self' data: https:; " +
  //       "font-src 'self';"
  //   )
  // }

  return response
}

// The middleware function
export async function securityMiddleware(request: NextRequest) {
  const config = defaultConfig
  const response = NextResponse.next()
  // const url = new URL(request.url)

  // Add response headers to prevent caching
  // response.headers.set('Cache-Control', 'no-store, max-age=0')
  // response.headers.set('Pragma', 'no-cache')
  // response.headers.set('Expires', '-1')

  // Host validation
  // if (config.allowedHosts?.length) {
  //   const host = request.headers.get('host')
  //   if (host && !config.allowedHosts.includes(host)) {
  //     return new NextResponse('Invalid Host header', { status: 400 })
  //   }
  // }

  // Force SSL in production
  // if (config.ssl && url.protocol === 'http:') {
  //   url.protocol = 'https:'
  //   return NextResponse.redirect(url)
  // }


  // Apply security headers
  return setSecurityHeaders(response, config)
}

// Matcher configuration
export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
