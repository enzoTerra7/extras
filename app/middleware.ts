import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if(typeof window !== 'undefined' && localStorage.getItem('token') && verify(localStorage.getItem('token') as string, process.env.ACCESS_TOKEN_SECRET || '')) {
    return NextResponse.redirect(new URL('/home', request.url));
  } else {
    if( typeof window !== 'undefined') localStorage.removeItem('token')
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/', '/dashboard/:path*/:path*'],
// };