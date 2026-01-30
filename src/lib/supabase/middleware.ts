import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    console.log('Middleware Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Middleware Supabase Key Length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)

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

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError) {
        console.error('[Middleware] getUser error:', userError)
    }

    if (user) {
        console.log(`[Middleware] User authenticated: ${user.email}`)
    } else {
        console.log(`[Middleware] User NOT authenticated for path: ${request.nextUrl.pathname}`)
    }

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/agency/sign-in') &&
        !request.nextUrl.pathname.startsWith('/agency/sign-up') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/site') &&
        !request.nextUrl.pathname.startsWith('/api/uploadthing') &&
        !request.nextUrl.pathname.startsWith('/api/heartbeat') &&
        !request.nextUrl.pathname.startsWith('/api/paystack/webhook') &&
        !request.nextUrl.pathname.startsWith('/inventory-preview') &&
        !request.nextUrl.pathname.startsWith('/inventory-checkout') &&
        request.nextUrl.pathname !== '/'
    ) {
        // Build redirect URL respecting ngrok/forwarded headers
        const forwardedHost = request.headers.get('x-forwarded-host')
        const host = forwardedHost || request.headers.get('host') || request.nextUrl.host
        const protocol = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol === 'https:' ? 'https' : 'http')
        const redirectUrl = new URL('/agency/sign-in', `${protocol}://${host}`)

        // IMPORTANT: We MUST create the redirect response and then copy cookies from supabaseResponse
        // to it, otherwise a refreshed token session will be lost.
        const response = NextResponse.redirect(redirectUrl)
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            response.cookies.set(cookie.name, cookie.value)
        })
        return response
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    return supabaseResponse
}
