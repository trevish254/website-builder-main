import React from 'react'
import { pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import { getAuthUserDetails } from '@/lib/queries'
import { cn } from '@/lib/utils'
import { Shield, Users, Rocket, Layers, Workflow, CheckIcon, MinusIcon, HelpCircle, Star, BadgeCheck, Headphones } from 'lucide-react'
import {
    type FeatureItem,
    PricingTable,
    PricingTableBody,
    PricingTableHeader,
    PricingTableHead,
    PricingTableRow,
    PricingTableCell,
    PricingTablePlan,
} from '@/components/ui/pricing-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
    params: { agencyId: string }
}

export default async function AvailablePlansPage({ params }: Props) {
    const userDetails = await getAuthUserDetails()
    if (!userDetails) return null

    const { data: agencyData } = await db
        .from('Agency')
        .select('customerId, Subscription(*)')
        .eq('id', params.agencyId)
        .single()

    const activeSubscription = Array.isArray(agencyData?.Subscription)
        ? agencyData.Subscription.find((s: any) => s.active === true) || agencyData.Subscription[0]
        : agencyData?.Subscription

    return (
        <div className="relative min-h-screen overflow-hidden px-4 py-8 md:py-16">
            {/* Dots Background from Prompt demo.tsx */}
            <div
                className={cn(
                    'fixed inset-0 z-[-10] size-full opacity-30',
                    '[mask-image:radial-gradient(ellipse_at_center,black,transparent)]',
                )}
                style={{
                    backgroundImage:
                        'radial-gradient(var(--foreground) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="relative mx-auto flex max-w-5xl flex-col mb-12">
                <h1 className="text-4xl font-black tracking-tight mb-4">Available Plans</h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Choose the perfect plan for your agency. Whether you're just starting out or managing hundreds of subaccounts, we have you covered.
                </p>
                <div className="h-1.5 w-16 bg-primary mt-6 rounded-full" />
            </div>

            <PricingTable className="mx-auto my-5 max-w-6xl">
                <PricingTableHeader>
                    <PricingTableRow>
                        <th className="p-4 text-left align-middle min-w-[200px]">
                            <div className="space-y-1">
                                <h2 className="text-4xl font-black tracking-tighter leading-none">Compare Features</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    FIND THE RIGHT FIT FOR YOU
                                </p>
                            </div>
                        </th>
                        {pricingCards.map((card) => {
                            const isCurrentPlan = activeSubscription?.active === true && activeSubscription.priceId === (card.paystackPlanCode || card.priceId)
                            const isStarter = card.title === 'Starter'
                            const isUnlimited = card.title === 'Unlimited Saas'

                            return (
                                <th key={card.title} className="p-1 min-w-[280px]">
                                    <PricingTablePlan
                                        name={card.title}
                                        badge={isCurrentPlan ? 'Current' : card.highlight}
                                        price={card.price}
                                        icon={isStarter ? Shield : isUnlimited ? Rocket : Users}
                                        className={cn(
                                            'bg-card/50 backdrop-blur-md rounded-[24px]',
                                            isCurrentPlan && 'ring-2 ring-primary border-primary/20'
                                        )}
                                    >
                                        <Link
                                            href={isCurrentPlan ? '#' : `/agency/${params.agencyId}/billing/checkout?plan=${card.paystackPlanCode || card.priceId}`}
                                            target={isCurrentPlan ? '_self' : '_blank'}
                                            className="w-full"
                                        >
                                            <Button
                                                variant={isCurrentPlan ? 'outline' : 'default'}
                                                className={cn(
                                                    "w-full rounded-xl h-12 font-black uppercase tracking-widest text-xs",
                                                    !isCurrentPlan && "shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform",
                                                    isCurrentPlan && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                )}
                                                disabled={isCurrentPlan}
                                            >
                                                {isCurrentPlan ? 'Active' : isStarter ? 'Free Tier' : 'Upgrade Now'}
                                            </Button>
                                        </Link>
                                    </PricingTablePlan>
                                </th>
                            )
                        })}
                    </PricingTableRow>
                </PricingTableHeader>
                <PricingTableBody className="bg-card/20 backdrop-blur-sm rounded-3xl overflow-hidden border">
                    {FEATURES.map((feature, index) => (
                        <PricingTableRow key={index} className="hover:bg-muted/30 transition-colors">
                            <PricingTableHead className="p-6 font-bold text-foreground flex items-center gap-3">
                                {feature.icon && <feature.icon className="w-4 h-4 text-muted-foreground" />}
                                {feature.label}
                            </PricingTableHead>
                            {feature.values.map((value, vIndex) => (
                                <PricingTableCell key={vIndex} className="text-center p-6 text-sm font-medium">
                                    {value}
                                </PricingTableCell>
                            ))}
                        </PricingTableRow>
                    ))}
                </PricingTableBody>
            </PricingTable>
        </div>
    );
}

const FEATURES: (FeatureItem & { icon?: any })[] = [
    {
        label: 'Sub Accounts',
        values: ['3', 'Unlimited', 'Unlimited'],
        icon: Layers
    },
    {
        label: 'Team Members',
        values: ['2', 'Unlimited', 'Unlimited'],
        icon: Users
    },
    {
        label: 'Pipelines',
        values: [true, true, true],
        icon: Workflow
    },
    {
        label: 'Guests',
        values: [true, true, true],
        icon: Users
    },
    {
        label: 'Live collaboration',
        values: [false, true, true],
        icon: Users
    },
    {
        label: 'Asset library',
        values: ['50 assets', '500 assets', 'Unlimited assets'],
        icon: Star
    },
    {
        label: 'Priority support',
        values: [false, 'Business hours', '24/7 priority'],
        icon: Headphones
    },
    {
        label: 'Brand kit & custom colors',
        values: [false, true, true],
        icon: Star
    },
    {
        label: 'Advanced analytics',
        values: [false, true, true],
        icon: Star
    },
    {
        label: 'Storage space',
        values: ['1 GB', '20 GB', '1 TB'],
        icon: Star
    },
    {
        label: 'User roles & permissions',
        values: [false, true, true],
        icon: BadgeCheck
    },
    {
        label: 'White-label option',
        values: [false, false, true],
        icon: BadgeCheck
    },
];
