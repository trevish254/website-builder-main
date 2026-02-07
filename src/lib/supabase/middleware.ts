import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1. Skip auth checks for prefetches to optimize performance and avoid race conditions
    // prefetched requests don't need to refresh the session
    if (request.headers.get('purpose') === 'prefetch' || request.headers.get('x-nextjs-data')) {
        return NextResponse.next({ request })
    }

    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Verify session
    let user = null
    let userError = null

    try {
        const { data, error } = await supabase.auth.getUser()
        user = data.user
        userError = error
    } catch (e: any) {
        userError = e
    }

    // Identify error types
    const isConflictError = userError?.message?.includes('refresh_token_already_used') ||
        (userError as any)?.code === 'refresh_token_already_used'

    const isNetworkError = userError?.message?.includes('fetch failed') ||
        userError?.message?.includes('SocketError') ||
        (userError as any)?.code === 'UND_ERR_SOCKET' ||
        userError instanceof TypeError

    // AUTH REDIRECT LOGIC
    const isAuthRoute =
        request.nextUrl.pathname.startsWith('/agency/sign-in') ||
        request.nextUrl.pathname.startsWith('/agency/sign-up') ||
        request.nextUrl.pathname.startsWith('/auth')

    const isPublicRoute =
        request.nextUrl.pathname.startsWith('/site') ||
        request.nextUrl.pathname.startsWith('/api/uploadthing') ||
        request.nextUrl.pathname.startsWith('/api/heartbeat') ||
        request.nextUrl.pathname.startsWith('/api/paystack/webhook') ||
        request.nextUrl.pathname.startsWith('/inventory-preview') ||
        request.nextUrl.pathname.startsWith('/inventory-checkout') ||
        request.nextUrl.pathname === '/'

    // If we have a conflict or network error in development, STAY OPTIMISTIC.
    // This prevents one failed parallel request from logging out the entire session.
    if (!user && (isConflictError || isNetworkError) && process.env.NODE_ENV === 'development') {
        console.log(`[Middleware] Conflict/Network glitch detected for ${request.nextUrl.pathname}. Staying optimistic.`)
        return NextResponse.next({ request })
    }

    // Optimized Redirect Check:
    // ONLY redirect if there is NO user AND it's NOT a public/auth route.
    if (!user && !isAuthRoute && !isPublicRoute) {
        // Final sanity check for development: if cookies are present, don't force redirect yet
        const hasSupabaseCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'))
        if (hasSupabaseCookie && process.env.NODE_ENV === 'development') {
            console.log(`[Middleware] Optimistic pass for ${request.nextUrl.pathname} (session might be refreshing in another request)`)
            return supabaseResponse
        }

        console.log(`[Middleware] Unauthorized access to ${request.nextUrl.pathname}, redirecting to sign-in`)

        const forwardedHost = request.headers.get('x-forwarded-host')
        const host = forwardedHost || request.headers.get('host') || request.nextUrl.host
        const protocol = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol === 'https:' ? 'https' : 'http')
        const redirectUrl = new URL('/agency/sign-in', `${protocol}://${host}`)

        const response = NextResponse.redirect(redirectUrl)
        // Keep existing cookies to allow other parallel requests to succeed
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value)
        })
        return response
    }

    return supabaseResponse
}
