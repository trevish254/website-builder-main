import { pricingCards } from './src/lib/constants'

// Mocking the data we saw from Paystack
const mockSubs = [
    {
        status: 'active',
        subscription_code: 'SUB_xxxxx',
        createdAt: '2025-12-20T13:51:22.000Z',
        next_payment_date: '2026-01-20T13:51:22.000Z',
        plan: { plan_code: 'PLN_m000zvuzd0lchtg', name: 'Unlimited Saas' },
        customer: { customer_code: 'CUS_ybcdcbpbs20lws1' }
    },
    {
        status: 'active',
        subscription_code: 'SUB_yyyyy',
        createdAt: '2025-12-20T13:47:04.000Z',
        next_payment_date: '2026-01-20T13:47:04.000Z',
        plan: { plan_code: 'PLN_94lyi50x08ydc2u', name: 'Basic' },
        customer: { customer_code: 'CUS_ybcdcbpbs20lws1' }
    }
]

const mockTrans = [
    {
        status: 'success',
        reference: 'REF_zzzzz',
        amount: 511500,
        paid_at: '2025-12-21T06:02:55.000Z',
        created_at: '2025-12-21T06:02:18.000Z',
        customer: { customer_code: 'CUS_ybcdcbpbs20lws1' }
    }
]

function resolvePlan() {
    let activeSubscription: any = null; // simulate no sub in DB initially

    console.log('--- REPRODUCING RESOLUTION LOGIC ---')

    // Simulate fallback logic
    const subsRes = { status: true, data: mockSubs }
    const transRes = { status: true, data: mockTrans }

    let latestActiveSub = null
    let latestPaidTrans = null

    if (subsRes.status && Array.isArray(subsRes.data)) {
        const sortedSubs = [...subsRes.data].sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        latestActiveSub = sortedSubs.find((s: any) => s.status === 'active')
        console.log('Latest Active Sub found:', latestActiveSub?.plan.name)
    }

    if (transRes.status && Array.isArray(transRes.data)) {
        latestPaidTrans = transRes.data.find((t: any) => t.status === 'success')
        console.log('Latest Paid Trans found at:', latestPaidTrans?.paid_at)
    }

    const subDate = latestActiveSub ? new Date(latestActiveSub.createdAt).getTime() : 0
    const transDate = latestPaidTrans ? new Date(latestPaidTrans.paid_at || latestPaidTrans.created_at).getTime() : 0

    console.log('Sub Date:', new Date(subDate).toISOString())
    console.log('Trans Date:', new Date(transDate).toISOString())

    if (latestPaidTrans && transDate > subDate) {
        console.log('Trans is newer than Sub')
        const transAmount = latestPaidTrans.amount;
        const matchedPlan = pricingCards.find(c => {
            const planCents = c.price === 'Free' ? 0 : parseInt(c.price.replace(/[^0-9]/g, '')) * 100
            const isMatch = Math.abs(transAmount - planCents) < 50000 || transAmount === planCents
            return isMatch
        })

        if (matchedPlan) {
            console.log('Matched Plan from Trans:', matchedPlan.title)
            activeSubscription = {
                active: true,
                customerId: latestPaidTrans.customer.customer_code,
                currentPeriodEndDate: new Date(transDate + 30 * 24 * 60 * 60 * 1000).toISOString(),
                priceId: matchedPlan.paystackPlanCode || matchedPlan.priceId,
                subscriptionId: latestPaidTrans.reference,
                plan: matchedPlan.paystackPlanCode || matchedPlan.priceId,
            }
        }
    }

    if (!activeSubscription?.active && latestActiveSub) {
        console.log('Using Fallback latestActiveSub')
        activeSubscription = {
            active: true,
            customerId: latestActiveSub.customer.customer_code,
            currentPeriodEndDate: latestActiveSub.next_payment_date,
            priceId: latestActiveSub.plan.plan_code,
            subscriptionId: latestActiveSub.subscription_code,
            plan: latestActiveSub.plan.plan_code,
        }
    }

    console.log('Final activeSubscription.priceId:', activeSubscription?.priceId)

    const currentPlanDetails = pricingCards.find((c) => {
        const isMatch = (c.paystackPlanCode && c.paystackPlanCode === activeSubscription?.priceId) ||
            (c.priceId && c.priceId === activeSubscription?.priceId);
        return isMatch;
    }) || pricingCards[0]

    console.log('Final RESOLVED Title:', currentPlanDetails.title)
}

resolvePlan()
