import React from 'react'
import { db } from '@/lib/db'
import { getAuthUserDetails } from '@/lib/queries'
import { pricingCards } from '@/lib/constants'
import { redirect } from 'next/navigation'
import AgencyPaymentForm from '@/components/forms/agency-payment-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

type Props = {
    params: { agencyId: string }
    searchParams: { plan: string }
}

const CheckoutPage = async ({ params, searchParams }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return redirect('/sign-in')

    const agencyRes = await db.from('Agency').select('*').eq('id', params.agencyId).single()
    if (!agencyRes.data) return redirect('/agency')

    const selectedPlan = pricingCards.find(
        (card) => card.paystackPlanCode === searchParams.plan || card.priceId === searchParams.plan
    )

    if (!selectedPlan) {
        return redirect(`/agency/${params.agencyId}/billing`)
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Left Section: Plan Details */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3" />
                                Secure Checkout
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                                Elevate Your <span className="text-primary italic">Agency</span>
                            </h1>
                            <p className="text-muted-foreground text-xl max-w-lg leading-relaxed">
                                Unlock professional tools and unlimited scale with the <span className="text-white font-bold">{selectedPlan.title}</span> plan.
                            </p>
                        </div>

                        <Card className="border-none bg-white/5 backdrop-blur-2xl shadow-2xl rounded-[40px] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <CardHeader className="p-10 relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <CardTitle className="text-4xl font-black">{selectedPlan.title}</CardTitle>
                                    <div className="px-4 py-1.5 rounded-2xl bg-primary text-primary-foreground text-sm font-black uppercase">
                                        Recommended
                                    </div>
                                </div>
                                <CardDescription className="text-lg text-white/60 mb-8">{selectedPlan.description}</CardDescription>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-black tracking-tighter text-white">{selectedPlan.price}</span>
                                    {selectedPlan.duration && (
                                        <span className="text-xl text-white/40 font-medium">/ {selectedPlan.duration}</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 pt-0 space-y-8 relative z-10">
                                <div className="h-[1px] w-full bg-white/10" />
                                <div className="space-y-6">
                                    <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-white/40">Exclusive Features</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedPlan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3 text-white/80 group/feature">
                                                <div className="p-1 rounded-full bg-emerald-500/20 group-hover/feature:bg-emerald-500/40 transition-colors">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: 'Trusted by 500+ Agencies', icon: '🌟' },
                                { label: 'Cancel Anytime', icon: '∞' },
                                { label: '24/7 Priority Support', icon: '⚡' },
                            ].map((item) => (
                                <div key={item.label} className="text-center p-4 rounded-3xl bg-white/5 border border-white/10">
                                    <span className="text-2xl block mb-2">{item.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section: Payment Form */}
                    <div className="w-full lg:w-[450px] lg:sticky lg:top-12">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 rounded-full" />
                            <div className="relative bg-[#101010] backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl p-2 overflow-hidden">
                                <AgencyPaymentForm
                                    user={user}
                                    agency={agencyRes.data}
                                    plan={selectedPlan}
                                />
                            </div>
                        </div>

                        <p className="mt-8 text-center text-sm text-white/40 font-medium">
                            Questions? <span className="text-primary hover:underline cursor-pointer">Chat with our experts</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
