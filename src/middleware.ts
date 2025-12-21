import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const searchParams = url.searchParams.toString()
  const hostname = request.headers.get('host')

  console.log(`[Middleware] ${request.method} ${url.pathname}`)

  const pathWithSearchParams = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''
    }`

  // If accessing via the landing page domain or localhost (main app), run auth middleware
  // You might need to adjust 'localhost:3000' based on your verified main domain in env
  const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'

  // Check if the hostname matches the main domain
  // Note: strict equality check might fail if port is included/excluded inconsistently
  // But usually host header includes port for localhost.
  const isMainDomain =
    hostname === mainDomain ||
    hostname === 'localhost:3000' ||
    hostname?.endsWith('.ngrok-free.dev') ||
    hostname?.endsWith('.ngrok-free.app')

  if (!isMainDomain && hostname && !url.pathname.startsWith('/api')) {
    console.log(`[Middleware] Rewriting for custom domain: ${hostname}`)
    // Rewrite to /[domain]/[path] to be handled by src/app/[domain]/page.tsx
    // We pass the full hostname as the 'domain' param
    return NextResponse.rewrite(
      new URL(`/${hostname}${pathWithSearchParams}`, request.url)
    )
  }

  // Otherwise, continue with standard auth session handling for the main app
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
