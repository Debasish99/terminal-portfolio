import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const session = await getSession();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('/login')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
