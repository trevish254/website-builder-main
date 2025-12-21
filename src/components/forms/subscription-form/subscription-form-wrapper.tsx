'use client'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { pricingCards } from '@/lib/constants'
import { useModal } from '@/providers/modal-provider'
import { Plan } from '@prisma/client'
import clsx from 'clsx'
import React, { useState } from 'react'
import Loading from '@/components/global/loading'
import SubscriptionForm from '.'

type Props = {
  customerId: string
  planExists: boolean
}

const SubscriptionFormWrapper = ({ customerId, planExists }: Props) => {
  const { data } = useModal()
  const [selectedPriceId, setSelectedPriceId] = useState<string>(
    data?.plans?.defaultPriceId || ''
  )

  const agencyEmail = data?.agency?.companyEmail || data?.user?.email || ''

  return (
    <div className="border-none transition-all">
      <div className="flex flex-col gap-4">
        {data.plans?.plans.map((price) => {
          const paystackPlan = pricingCards.find((p) => p.priceId === price.id)
          return (
            <Card
              onClick={() => setSelectedPriceId(paystackPlan?.paystackPlanCode || (price.id as string))}
              key={price.id}
              className={clsx('relative cursor-pointer transition-all', {
                'border-primary': selectedPriceId === paystackPlan?.paystackPlanCode || selectedPriceId === price.id,
              })}
            >
              <CardHeader>
                <CardTitle>
                  KSh {price.unit_amount ? (price.unit_amount / 100).toLocaleString() : '0'}
                  <p className="text-sm text-muted-foreground">
                    {price.nickname}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paystackPlan?.description}
                  </p>
                </CardTitle>
              </CardHeader>
              {(selectedPriceId === paystackPlan?.paystackPlanCode || selectedPriceId === price.id) && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4" />
              )}
            </Card>
          )
        })}

        {selectedPriceId && !planExists && (
          <>
            <h1 className="text-xl mt-4">Subscription Plan</h1>
            <SubscriptionForm
              selectedPriceId={selectedPriceId}
              email={agencyEmail}
            />
          </>
        )}

        {!selectedPriceId && (
          <div className="flex items-center justify-center w-full h-40">
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionFormWrapper
