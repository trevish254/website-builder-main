import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { paystackSubscriptionCreated, paystackSubscriptionDisabled } from '@/lib/paystack/paystack-actions'

export async function POST(req: NextRequest) {
    const body = await req.text()
    const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
        .update(body)
        .digest('hex')

    const signature = req.headers.get('x-paystack-signature')

    if (hash !== signature) {
        return new NextResponse('Invalid signature', { status: 400 })
    }

    const event = JSON.parse(body)
    console.log('📬 Paystack Webhook Event:', event.event)

    try {
        switch (event.event) {
            case 'subscription.create':
            case 'charge.success': {
                console.log('📦 Event Data:', JSON.stringify(event.data, null, 2))
                // subscription.create is sent when a subscription is created
                // charge.success might contain subscription details for recurring charges
                const data = event.data
                if (data.subscription_code) {
                    await paystackSubscriptionCreated(
                        data.subscription_code,
                        data.customer.customer_code,
                        data.plan.plan_code,
                        data.customer.email,
                        data.next_payment_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    )
                }
                break
            }
            case 'subscription.disable': {
                await paystackSubscriptionDisabled(event.data.subscription_code)
                break
            }
            default:
                console.log('Unhandled Paystack event:', event.event)
        }
    } catch (error) {
        console.error('🔴 Paystack Webhook Error:', error)
        return new NextResponse('Webhook Error', { status: 500 })
    }

    return new NextResponse('OK', { status: 200 })
}
