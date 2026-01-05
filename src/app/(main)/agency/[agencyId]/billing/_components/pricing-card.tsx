'use client'
import SubscriptionFormWrapper from '@/components/forms/subscription-form/subscription-form-wrapper'
import CustomModal from '@/components/global/custom-modal'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PricesList } from '@/lib/types'
import { useModal } from '@/providers/modal-provider'
import { useSearchParams } from 'next/navigation'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  features: string[]
  buttonCta: string
  title: string
  description: string
  amt: string
  duration: string
  highlightTitle: string
  highlightDescription: string
  customerId: string
  prices: PricesList['data']
  planExists: boolean
  user: any
  agency: any
}

const PricingCard = ({
  amt,
  buttonCta,
  customerId,
  description,
  duration,
  features,
  highlightDescription,
  highlightTitle,
  planExists,
  prices,
  title,
  user,
  agency,
}: Props) => {
  const { setOpen } = useModal()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const handleManagePlan = async () => {
    if (planExists) return

    const planCode = prices.find((p) => p.nickname === title)?.id || ''
    window.open(`/agency/${agency.id}/billing/checkout?plan=${planCode}`, '_blank')
  }

  return (
    <Card className={cn(
      "flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border-none bg-card/50 backdrop-blur-md overflow-hidden group h-full",
      planExists && "ring-2 ring-emerald-500 shadow-emerald-500/20"
    )}>
      {planExists && (
        <div className="absolute top-0 right-0 p-0 overflow-hidden z-10">
          <div className="bg-emerald-500 text-white text-[10px] font-bold px-8 py-1 rotate-45 translate-x-3 -translate-y-1 shadow-sm uppercase tracking-widest">
            Current
          </div>
        </div>
      )}

      <CardHeader className="space-y-4 pb-8">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-emerald-500 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm min-h-[40px] leading-relaxed">
            {description}
          </CardDescription>
        </div>

        <div className="flex items-baseline gap-1 pt-4">
          <span className="text-5xl font-extrabold tracking-tighter text-foreground">
            {amt}
          </span>
          {duration && (
            <span className="text-sm font-medium text-muted-foreground">
              {duration}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            Features Highlights
          </p>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          className={cn(
            "w-full h-12 text-md font-bold transition-all duration-300",
            planExists
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "bg-primary hover:bg-primary/90 hover:scale-[1.02]"
          )}
          onClick={handleManagePlan}
        >
          {buttonCta}
        </Button>
      </CardFooter>

      {/* Decorative backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  )
}

export default PricingCard
