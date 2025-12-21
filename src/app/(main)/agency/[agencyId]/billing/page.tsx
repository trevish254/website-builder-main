import React from 'react'
import { stripe } from '@/lib/stripe' // Still needed for some types or if we keep old logic
import { pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import { Separator } from '@/components/ui/separator'
import PricingCard from './_components/pricing-card'
import clsx from 'clsx'
import SubscriptionHelper from './_components/subscription-helper'
import { getAuthUserDetails } from '@/lib/queries'
import { paystack } from '@/lib/paystack'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UsageDashboard from './_components/usage-dashboard'
import { getAgencyTeamMembers } from '@/lib/queries'
import { Layers } from 'lucide-react'

type Props = {
  params: { agencyId: string }
}

const page = async ({ params }: Props) => {
  const userDetails = await getAuthUserDetails()
  if (!userDetails) return null

  // 1. Fetch Subscription and Data from DB
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


  // 2. If no active subscription in DB, check Paystack LIVE as a fallback
  if (!activeSubscription?.active) {
    const customerEmail = agencyData?.companyEmail || userDetails.email

    // a. Resolve the correct customer code
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

      // PAYSTACK BUG WORKAROUND
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

  // Create prices structure for UI components
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

  // Usage calculations
  const teamCount = teamMembers.length
  const subaccountCount = agencyData?.SubAccount?.length || 0

  // Find limit from plan
  const subaccountLimit = currentPlanDetails.title === 'Starter' ? 3 : 100

  const formattedRenewal = activeSubscription?.currentPeriodEndDate
    ? new Date(activeSubscription.currentPeriodEndDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    : 'N/A'

  return (
    <div className="flex flex-col gap-8 pb-20">
      <SubscriptionHelper
        prices={prices.data as any}
        customerId={activeSubscription?.customerId || ''}
        planExists={activeSubscription?.active === true}
        user={userDetails}
        agency={userDetails.Agency}
      />

      <div className="p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Subscription</h1>
          <p className="text-muted-foreground mt-2">
            Manage your billing, plans and view your subscription usage.
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 px-0 font-semibold"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="plans"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 px-0 font-semibold"
            >
              Available Plans
            </TabsTrigger>
            <TabsTrigger
              value="addons"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-4 px-0 font-semibold"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {pricingCards.map((card) => (
                <PricingCard
                  key={card.title}
                  planExists={activeSubscription?.active === true && activeSubscription.priceId === (card.paystackPlanCode || card.priceId)}
                  prices={prices.data as any}
                  customerId={activeSubscription?.customerId || ''}
                  user={userDetails}
                  agency={userDetails.Agency}
                  amt={card.price}
                  buttonCta={
                    activeSubscription?.active === true && activeSubscription.priceId === (card.paystackPlanCode || card.priceId)
                      ? 'Current Plan'
                      : 'Upgrade'
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

export default page
