import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/agency'

    const isLocalEnv = process.env.NODE_ENV === 'development'
    const forwardedHost = request.headers.get('x-forwarded-host')
    const host = forwardedHost || request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || (isLocalEnv ? 'http' : 'https')
    const currentOrigin = `${protocol}://${host}`

    if (code) {
        const response = NextResponse.redirect(`${currentOrigin}${next}`)
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        const cookieHeader = request.headers.get('Cookie')
                        if (!cookieHeader) return []
                        return cookieHeader.split(';').map(c => {
                            const [name, ...val] = c.trim().split('=')
                            return { name, value: val.join('=') }
                        })
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        )
                    },
                },
            }
        )
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return response
        }

        console.error('Auth callback error:', error)
    }

    // Return the user to an error page if code is missing or exchange fails
    return NextResponse.redirect(`${currentOrigin}/agency/sign-in?error=auth-code-error`)
}
