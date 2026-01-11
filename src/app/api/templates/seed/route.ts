/**
 * API Route: Seed Default Templates
 * POST /api/templates/seed
 */

import { NextResponse } from 'next/server'
import { seedDefaultTemplates } from '@/lib/templates'

export async function POST(request: Request) {
    try {
        // Optional: Get userId from request body if you want to attribute templates to a user
        const body = await request.json().catch(() => ({}))
        const userId = body.userId

        const result = await seedDefaultTemplates(userId)

        return NextResponse.json({
            success: result.success,
            message: `Seeded ${result.seeded} templates, skipped ${result.skipped}, errors: ${result.errors}`,
            ...result
        })
    } catch (error) {
        console.error('Error in seed templates API:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to seed templates' },
            { status: 500 }
        )
    }
}
