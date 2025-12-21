import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/agency'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const isLocalEnv = process.env.NODE_ENV === 'development'
            const host = request.headers.get('host')
            const protocol = request.headers.get('x-forwarded-proto') || (isLocalEnv ? 'http' : 'https')
            const currentOrigin = `${protocol}://${host}`

            if (isLocalEnv && !host?.includes('ngrok')) {
                return NextResponse.redirect(`${origin}${next}`)
            } else {
                return NextResponse.redirect(`${currentOrigin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    console.error('Auth error:', error)
    return NextResponse.redirect(`${origin}/agency/sign-in?error=auth-code-error`)
}
