import { paystack } from '@/lib/paystack'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const { email, planCode } = await req.json()

    if (!email || !planCode) {
        return new NextResponse('Email or plan code is missing', { status: 400 })
    }

    try {
        const response = await paystack.initializeTransaction({
            email,
            amount: '0', // amount is determined by the plan in Paystack
            plan: planCode,
            callback_url: `${process.env.NEXT_PUBLIC_URL}/agency`,
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
        return new NextResponse(error.message || 'Internal Server Error', { status: 500 })
    }
}
