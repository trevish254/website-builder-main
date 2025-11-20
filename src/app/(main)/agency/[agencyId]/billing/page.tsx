import React from 'react'
import { stripe } from '@/lib/stripe'
import { addOnProducts, pricingCards } from '@/lib/constants'
import { db } from '@/lib/db'
import { Separator } from '@/components/ui/separator'
import PricingCard from './_components/pricing-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import clsx from 'clsx'
import SubscriptionHelper from './_components/subscription-helper'

type Props = {
  params: { agencyId: string }
}

const page = async ({ params }: Props) => {
  console.log('Loading billing page for testing')
  
  // Mock data for testing without Stripe and database
  const mockAddOns = {
    data: [
      {
        id: 'addon-1',
        name: 'Priority Support',
        default_price: {
          unit_amount: 2900 // $29.00
        }
      }
    ]
  }

  const mockAgencySubscription = {
    customerId: 'cus_test123',
    Subscription: {
      active: false,
      priceId: null
    }
  }

  const mockPrices = {
    data: [
      {
        id: 'price_starter',
        unit_amount: 0,
        nickname: 'Starter'
      },
      {
        id: 'price_basic',
        unit_amount: 4900,
        nickname: 'Basic'
      },
      {
        id: 'price_unlimited',
        unit_amount: 19900,
        nickname: 'Unlimited Saas'
      }
    ]
  }

  const currentPlanDetails = pricingCards.find(
    (c) => c.priceId === mockAgencySubscription?.Subscription?.priceId
  ) || pricingCards[0] // Default to Starter plan

  const allCharges = [
    {
      description: 'Starter Plan - Monthly',
      id: 'ch_test123',
      date: `${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}`,
      status: 'Paid',
      amount: '$0',
    },
    {
      description: 'Priority Support Add-on',
      id: 'ch_test456',
      date: `${new Date(Date.now() - 86400000).toLocaleTimeString()} ${new Date(Date.now() - 86400000).toLocaleDateString()}`,
      status: 'Paid',
      amount: '$29',
    }
  ]

  return (
    <>
      <SubscriptionHelper
        prices={mockPrices.data as any}
        customerId={mockAgencySubscription?.customerId || ''}
        planExists={mockAgencySubscription?.Subscription?.active === true}
      />
      <h1 className="text-4xl p-4">Billing</h1>
      <Separator className=" mb-6" />
      <h2 className="text-2xl p-4">Current Plan</h2>
      <div className="flex flex-col lg:!flex-row justify-between gap-8">
        <PricingCard
          planExists={mockAgencySubscription?.Subscription?.active === true}
          prices={mockPrices.data as any}
          customerId={mockAgencySubscription?.customerId || ''}
          amt={
            mockAgencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.price || '$0'
              : '$0'
          }
          buttonCta={
            mockAgencySubscription?.Subscription?.active === true
              ? 'Change Plan'
              : 'Get Started'
          }
          highlightDescription="Want to modify your plan? You can do this here. If you have
          further question contact support@plura-app.com"
          highlightTitle="Plan Options"
          description={
            mockAgencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.description || 'Lets get started'
              : 'Lets get started! Pick a plan that works best for you.'
          }
          duration="/ month"
          features={
            mockAgencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.features || []
              : currentPlanDetails?.features ||
                pricingCards.find((pricing) => pricing.title === 'Starter')
                  ?.features ||
                []
          }
          title={
            mockAgencySubscription?.Subscription?.active === true
              ? currentPlanDetails?.title || 'Starter'
              : 'Starter'
          }
        />
        {mockAddOns.data.map((addOn) => (
          <PricingCard
            planExists={mockAgencySubscription?.Subscription?.active === true}
            prices={mockPrices.data as any}
            customerId={mockAgencySubscription?.customerId || ''}
            key={addOn.id}
            amt={
              //@ts-ignore
              addOn.default_price?.unit_amount
                ? //@ts-ignore
                  `$${addOn.default_price.unit_amount / 100}`
                : '$0'
            }
            buttonCta="Subscribe"
            description="Dedicated support line & teams channel for support"
            duration="/ month"
            features={[]}
            title={'24/7 priority support'}
            highlightTitle="Get support now!"
            highlightDescription="Get priority support and skip the long long with the click of a button."
          />
        ))}
      </div>
      <h2 className="text-2xl p-4">Payment History</h2>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead className="w-[200px]">Description</TableHead>
            <TableHead className="w-[200px]">Invoice Id</TableHead>
            <TableHead className="w-[300px]">Date</TableHead>
            <TableHead className="w-[200px]">Paid</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {allCharges.map((charge) => (
            <TableRow key={charge.id}>
              <TableCell>{charge.description}</TableCell>
              <TableCell className="text-muted-foreground">
                {charge.id}
              </TableCell>
              <TableCell>{charge.date}</TableCell>
              <TableCell>
                <p
                  className={clsx('', {
                    'text-emerald-500': charge.status.toLowerCase() === 'paid',
                    'text-orange-600':
                      charge.status.toLowerCase() === 'pending',
                    'text-red-600': charge.status.toLowerCase() === 'failed',
                  })}
                >
                  {charge.status.toUpperCase()}
                </p>
              </TableCell>
              <TableCell className="text-right">{charge.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default page
