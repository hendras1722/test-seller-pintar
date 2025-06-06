import { NextRequest, NextResponse } from 'next/server'
import { getMe } from '@/api/auth'


export async function adminMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  const token = request.cookies.get('token')
  const { pathname } = new URL(request.url)
  
  if (token) {
    const getMeResponse = await getMe()
    response.cookies.set('me', JSON.stringify(getMeResponse.data), {
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: true
    })
    console.log(getMeResponse)
    if (!getMeResponse.data) return
      if (
        pathname.startsWith('/login') &&
        getMeResponse.data.role.toLowerCase() === 'admin'
      ) {
        return NextResponse.redirect(new URL('/admin/category', request.url))
      } else {
        if (
          pathname.startsWith('/login') &&
          getMeResponse.data.role.toLowerCase() === 'user'
        ) {
          return NextResponse.redirect(new URL('/article', request.url))
        }
      }
  } else {
    response.cookies.delete('me')
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/article',
    '/article/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
