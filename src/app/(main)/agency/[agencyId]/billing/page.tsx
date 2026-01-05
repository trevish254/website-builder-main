import React from 'react'
import { pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import { getAuthUserDetails } from '@/lib/queries'
import { paystack } from '@/lib/paystack'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UsageDashboard from './_components/usage-dashboard'
import { getAgencyTeamMembers } from '@/lib/queries'
import { Layers, Shield, Users, Rocket, Workflow, CheckIcon, Star, BadgeCheck, Headphones } from 'lucide-react'
import {
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
import { cn } from '@/lib/utils'
import SubscriptionHelper from './_components/subscription-helper'

type Props = {
  params: { agencyId: string }
}

const page = async ({ params }: Props) => {
  const userDetails = await getAuthUserDetails()
  if (!userDetails) return null

  const [agencyRes, teamMembers] = await Promise.all([
    db
      .from('Agency')
      .select('customerId, companyEmail, Subscription(*), SubAccount(*)')
      .eq('id', params.agencyId)
      .single(),
    getAgencyTeamMembers(params.agencyId)
  ])

  const { data: agencyData } = agencyRes

  let activeSubscription = Array.isArray(agencyData?.Subscription)
    ? agencyData.Subscription.find((s: any) => s.active === true) || agencyData.Subscription[0]
    : agencyData?.Subscription


  if (!activeSubscription?.active) {
    const customerEmail = agencyData?.companyEmail || userDetails.email
    let codeToUse = agencyData?.customerId

    const isSuspectCode = !codeToUse || !codeToUse.startsWith('CUS_')
    if (isSuspectCode) {
      const customerRes = await paystack.fetchCustomer(customerEmail)
      if (customerRes.status && customerRes.data) {
        codeToUse = customerRes.data.customer_code
      }
    }

    if (codeToUse) {
      let [subsRes, transRes] = await Promise.all([
        paystack.listSubscriptions(codeToUse),
        paystack.listTransactions(codeToUse)
      ])

      if ((!subsRes.data || subsRes.data.length === 0) || (!transRes.data || transRes.data.length === 0)) {
        const [allSubs, allTrans] = await Promise.all([
          paystack.listSubscriptions(),
          paystack.listTransactions()
        ])

        if (subsRes.status && (!subsRes.data || subsRes.data.length === 0)) {
          subsRes.data = (allSubs.data || []).filter((s: any) =>
            s.customer?.customer_code === codeToUse || s.customer?.email?.toLowerCase() === customerEmail.toLowerCase()
          )
        }
        if (transRes.status && (!transRes.data || transRes.data.length === 0)) {
          transRes.data = (allTrans.data || []).filter((t: any) =>
            t.customer?.customer_code === codeToUse || t.customer?.email?.toLowerCase() === customerEmail.toLowerCase()
          )
        }
      }

      let latestActiveSub = null
      let latestPaidTrans = null

      if (subsRes.status && Array.isArray(subsRes.data)) {
        const sortedSubs = [...subsRes.data].sort((a: any) =>
          new Date(a.createdAt).getTime()
        )
        latestActiveSub = sortedSubs.find((s: any) => s.status === 'active')
      }

      if (transRes.status && Array.isArray(transRes.data)) {
        latestPaidTrans = transRes.data.find((t: any) => t.status === 'success')
      }

      const subDate = latestActiveSub ? new Date(latestActiveSub.createdAt).getTime() : 0
      const transDate = latestPaidTrans ? new Date(latestPaidTrans.paid_at || latestPaidTrans.created_at).getTime() : 0

      if (latestPaidTrans && transDate > subDate) {
        const transAmount = latestPaidTrans.amount;
        const matchedPlan = pricingCards.find(c => {
          const planCents = c.price === 'Free' ? 0 : parseInt(c.price.replace(/[^0-9]/g, '')) * 100
          return Math.abs(transAmount - planCents) < 50000 || transAmount === planCents
        })

        if (matchedPlan) {
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
        activeSubscription = {
          active: true,
          customerId: latestActiveSub.customer.customer_code,
          currentPeriodEndDate: latestActiveSub.next_payment_date,
          priceId: latestActiveSub.plan.plan_code,
          subscriptionId: latestActiveSub.subscription_code,
          plan: latestActiveSub.plan.plan_code,
        }
      }

      if (activeSubscription?.customerId?.startsWith('CUS_') && agencyData?.customerId !== activeSubscription.customerId) {
        await db.from('Agency').update({ customerId: activeSubscription.customerId }).eq('id', params.agencyId)
      }
    }
  }

  const prices = {
    data: pricingCards.map(card => ({
      id: card.paystackPlanCode || card.priceId,
      unit_amount: card.price === 'Free' ? 0 : parseInt(card.price.replace(/[^0-9]/g, '')) * 100,
      nickname: card.title,
    }))
  }

  const currentPlanDetails = pricingCards.find((c) => {
    if (!activeSubscription?.priceId) return false;
    const isMatch = (c.paystackPlanCode && c.paystackPlanCode === activeSubscription.priceId) ||
      (c.priceId && c.priceId === activeSubscription.priceId);
    return isMatch;
  }) || pricingCards[0]

  const teamCount = teamMembers.length
  const subaccountCount = agencyData?.SubAccount?.length || 0
  const subaccountLimit = currentPlanDetails.title === 'Starter' ? 3 : 100

  const formattedRenewal = activeSubscription?.currentPeriodEndDate
    ? new Date(activeSubscription.currentPeriodEndDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    : 'N/A'

  return (
    <div className="flex flex-col gap-8 pb-20 relative min-h-screen">
      <SubscriptionHelper
        prices={prices.data as any}
        customerId={activeSubscription?.customerId || ''}
        planExists={activeSubscription?.active === true}
        user={userDetails}
        agency={userDetails.Agency}
      />

      <div className="p-4 md:p-8 space-y-8 relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your billing, plans and view your subscription usage.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 px-0 font-bold uppercase tracking-widest text-xs"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 px-0 font-bold uppercase tracking-widest text-xs"
            >
              Available Plans
            </TabsTrigger>
            <TabsTrigger
              value="addons"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 px-0 font-bold uppercase tracking-widest text-xs"
            >
              Add-ons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8 space-y-12">
            <UsageDashboard
              currentPlan={currentPlanDetails.title}
              teamCount={teamCount}
              subaccountCount={subaccountCount}
              subaccountLimit={subaccountLimit}
              cost={currentPlanDetails.price}
              renewalDate={formattedRenewal}
              isPremium={currentPlanDetails.title !== 'Starter'}
            />
          </TabsContent>

          <TabsContent value="plans" className="mt-8">
            <div className="relative overflow-hidden rounded-[32px] border border-border/50 bg-card/10 backdrop-blur-xl p-1">
              {/* Dots Background inside Tab */}
              <div
                className={cn(
                  'absolute inset-0 z-[-1] size-full opacity-20',
                  '[mask-image:radial-gradient(ellipse_at_center,black,transparent)]',
                )}
                style={{
                  backgroundImage:
                    'radial-gradient(var(--foreground) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }}
              />

              <PricingTable className="w-full">
                <PricingTableHeader>
                  <PricingTableRow className="hover:bg-transparent border-none">
                    <th className="p-8 text-left align-middle min-w-[200px]">
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
                        <th key={card.title} className="p-2 min-w-[280px]">
                          <PricingTablePlan
                            name={card.title}
                            badge={isCurrentPlan ? 'Current' : card.highlight}
                            price={card.price}
                            icon={isStarter ? Shield : isUnlimited ? Rocket : Users}
                            className={cn(
                              'bg-transparent border-none shadow-none',
                              isCurrentPlan && 'bg-primary/5 ring-1 ring-primary/20'
                            )}
                          >
                            <Link
                              href={isCurrentPlan ? '#' : `/agency/${params.agencyId}/billing/checkout?plan=${card.paystackPlanCode || card.priceId}`}
                              target={isCurrentPlan ? '_self' : '_blank'}
                              className="w-full"
                            >
                              <Button
                                disabled={isCurrentPlan}
                                className={cn(
                                  'w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs transition-all',
                                  isCurrentPlan
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02]'
                                )}
                                variant={isCurrentPlan ? 'outline' : 'default'}
                              >
                                {isCurrentPlan ? 'Active Plan' : isStarter ? 'Free Tier' : 'Upgrade Now'}
                              </Button>
                            </Link>
                          </PricingTablePlan>
                        </th>
                      )
                    })}
                  </PricingTableRow>
                </PricingTableHeader>
                <PricingTableBody>
                  {FEATURES.map((feature, index) => (
                    <PricingTableRow key={index} className="hover:bg-muted/30 transition-colors">
                      <PricingTableHead className="p-6 font-bold text-foreground flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-muted/50 transition-colors">
                          <feature.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
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
          </TabsContent>

          <TabsContent value="addons" className="mt-8">
            <div className="flex items-center justify-center p-20 border-2 border-dashed rounded-3xl text-muted-foreground">
              <div className="text-center space-y-2">
                <Layers className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-xl font-medium">Add-ons Coming Soon</p>
                <p className="text-sm">Power up your agency with modular extensions.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const FEATURES = [
  { label: 'Sub Accounts', values: ['3', 'Unlimited', 'Unlimited'], icon: Layers },
  { label: 'Team Members', values: ['2', 'Unlimited', 'Unlimited'], icon: Users },
  { label: 'Pipelines', values: [true, true, true], icon: Workflow },
  { label: 'Guests', values: [true, true, true], icon: Users },
  { label: 'Live collaboration', values: [false, true, true], icon: Users },
  { label: 'Asset library', values: ['50 assets', '500 assets', 'Unlimited assets'], icon: Star },
  { label: 'Export files', values: ['PNG only', 'PNG, PDF, MP4', 'PNG, PDF, MP4, JPEG'], icon: Rocket },
  { label: 'Multiple dimensions', values: ['1:1', '1:1 and 9:16', 'All ratios & custom sizes'], icon: Star },
  { label: 'Dedicated account manager', values: [false, false, true], icon: Users },
  { label: 'Access to help center', values: [true, true, true], icon: Headphones },
  { label: 'Priority support', values: [false, 'Business hours', '24/7 priority'], icon: Headphones },
  { label: 'Advanced analytics', values: [false, true, true], icon: Star },
  { label: 'Storage space', values: ['1 GB', '20 GB', '1 TB'], icon: Star },
  { label: 'User roles & permissions', values: [false, true, true], icon: BadgeCheck },
  { label: 'White-label option', values: [false, false, true], icon: BadgeCheck },
];

export default page
