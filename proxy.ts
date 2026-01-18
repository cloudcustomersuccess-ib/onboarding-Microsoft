import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ✅ CORRECCIÓN para Next.js 16
 * La función debe llamarse "proxy" en lugar de "middleware"
 */
export function proxy(request: NextRequest) {
  // Tu lógica de middleware aquí (si la tienes)
  // Por ahora, simplemente continúa con la petición
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};