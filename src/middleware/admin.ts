import { NextRequest, NextResponse } from 'next/server'
import { getMe } from '@/api/auth'


export async function adminMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  const token = request.cookies.get('token')
  const { pathname } = new URL(request.url)
  
  if (token) {
    const getMeResponse = await getMe()
console.log(getMeResponse)
    response.cookies.set('me', JSON.stringify(getMeResponse.data), {
      path: '/admin', 
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: true
    })
    
    if (pathname.startsWith('/login')){
      return NextResponse.redirect(new URL('/admin/category', request.url))
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
