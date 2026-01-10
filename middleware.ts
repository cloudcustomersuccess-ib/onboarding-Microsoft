import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes under /app
  if (pathname.startsWith("/app")) {
    // Check for token in cookies (optional fallback)
    const token = request.cookies.get("auth_token")?.value;

    // Note: We can't check localStorage in middleware (server-side)
    // So we'll rely on client-side protection in the layout component
    // This middleware serves as a secondary layer

    // For now, we let the request through and handle auth in the app layout
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
