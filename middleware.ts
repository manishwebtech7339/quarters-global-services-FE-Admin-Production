import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserTypeENUM } from './lib/types';

// Public routes that don't require login
const publicRoutes = [
  '/',
  '/login',
  '/forget-password',
  '/reset-password',
  '/admin/login',
  '/agent/register',
  '/agent/onboard',
  '/agent/login',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🟢 Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🍪 Check for session cookie
  const cookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME!;
  const cookieUserRoleName = process.env.NEXT_PUBLIC_SESSION_COOKIE_USER_ROLE!;
  const token = req.cookies.get(cookieName)?.value;
  const userRole = req.cookies.get(cookieUserRoleName)?.value;

  // 🔒 Redirect too login mif nso session
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 🧩 Role-based access protection
  // Admin pages
  if (
    pathname.startsWith('/admin') &&
    userRole !== UserTypeENUM.ADMIN &&
    userRole !== UserTypeENUM.SUBADMIN
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Agent pages
  if (pathname.startsWith('/agent') && userRole !== UserTypeENUM.AGENT) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ User logged in → allow access
  return NextResponse.next();
}

// ⚙️ Matcher automatically excludes system/static/api routes and images
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
