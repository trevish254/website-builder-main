import React from 'react'
import { pricingCards } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import PricingCard from '../_components/pricing-card'
import { db } from '@/lib/db'
import { getAuthUserDetails } from '@/lib/queries'

type Props = {
    params: { agencyId: string }
}

const AvailablePlansPage = async ({ params }: Props) => {
    const userDetails = await getAuthUserDetails()
    if (!userDetails) return null

    const { data: agencyData } = await db
        .from('Agency')
        .select('customerId, Subscription(*)')
        .eq('id', params.agencyId)
        .single()

    const agencySubscription = agencyData ? {
        customerId: agencyData.customerId,
        Subscription: Array.isArray(agencyData.Subscription)
            ? agencyData.Subscription[0]
            : agencyData.Subscription
    } : null

    const prices = {
        data: pricingCards.map(card => ({
            id: card.paystackPlanCode || card.priceId,
            unit_amount: card.price === 'Free' ? 0 : parseInt(card.price.replace(/[^0-9]/g, '')) * 100,
            nickname: card.title,
        }))
    }

    return (
        <div className="flex flex-col gap-10 pb-20 p-4 md:p-8">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Available Plans</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Choose the perfect plan for your agency. Whether you're just starting out or managing hundreds of subaccounts, we have you covered.
                </p>
                <div className="h-1 w-20 bg-emerald-500 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pricingCards.map((card) => (
                    <PricingCard
                        key={card.title}
                        planExists={agencySubscription?.Subscription?.priceId === (card.paystackPlanCode || card.priceId)}
                        prices={prices.data as any}
                        customerId={agencySubscription?.customerId || ''}
                        user={userDetails}
                        agency={userDetails.Agency}
                        amt={card.price}
                        buttonCta={
                            agencySubscription?.Subscription?.priceId === (card.paystackPlanCode || card.priceId)
                                ? 'Current Plan'
                                : 'Select Plan'
                        }
                        highlightDescription={card.description}
                        highlightTitle={card.title}
                        description={card.description}
                        duration={card.duration ? `/ ${card.duration}` : ''}
                        features={card.features}
                        title={card.title}
                    />
                ))}
            </div>

            {/* Decorative background element */}
            <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    )
}

export default AvailablePlansPage
