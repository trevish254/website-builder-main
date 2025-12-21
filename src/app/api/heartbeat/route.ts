import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        // Perform a simple query to keep the database active
        // We use supabaseAdmin to bypass RLS and ensure the query executes
        const { data, error } = await supabaseAdmin
            .from('User')
            .select('id')
            .limit(1)

        if (error) {
            console.error('Supabase heartbeat error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            status: 'ok',
            message: 'Heartbeat successful, Supabase is active.',
            timestamp: new Date().toISOString()
        })
    } catch (err) {
        console.error('Unexpected heartbeat error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
