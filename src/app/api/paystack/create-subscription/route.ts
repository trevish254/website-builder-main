import { paystack } from '@/lib/paystack'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { email, planCode } = await req.json()

    if (!email || !planCode) {
        return NextResponse.json({ message: 'Email or plan code is missing' }, { status: 400 })
    }

    if (planCode === 'REPLACE_WITH_ACTUAL_PLAN_CODE') {
        return NextResponse.json({
            message: 'You have not configured your Paystack Plan Codes. Please update src/lib/constants.ts with your actual Plan Codes from the Paystack Dashboard.'
        }, { status: 400 })
    }

    console.log('🚀 Initializing Paystack Transaction:', { email, planCode })

    try {
        const { origin } = new URL(req.url)
        const response = await paystack.initializeTransaction({
            email,
            amount: '0', // This is usually required by Paystack API but overridden by plan
            plan: planCode,
            callback_url: `${origin}/agency`,
        })

        if (!response.status) {
            throw new Error(response.message || 'Failed to initialize Paystack transaction')
        }

        return NextResponse.json({
            authorization_url: response.data.authorization_url,
            reference: response.data.reference,
        })
    } catch (error: any) {
        console.error('🔴 Paystack Initialization Error:', error)
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
