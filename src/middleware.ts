import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // const cookieStore = cookies()
  // const accessToken = cookieStore.get('access_token')
  //
  // if (accessToken?.value && request.nextUrl.pathname.startsWith('/login')) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }
  //
  // if (!accessToken?.value && request.nextUrl.pathname.startsWith('/login')) {
  //   return NextResponse.next()
  // }
  //
  // if (!accessToken?.value && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:path*',
}