'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { DollarSign, Users, Activity, BarChart, CreditCard, ShoppingCart } from 'lucide-react'
import CountUp from 'react-countup'

// Map of icons
const iconMap: Record<string, any> = {
    dollar: DollarSign,
    users: Users,
    activity: Activity,
    chart: BarChart,
    credit: CreditCard,
    cart: ShoppingCart,
}

type Props = {
    title: string
    metric: string // e.g. "income", "clients"
    icon?: string
    value?: number // In a real app, we'd fetch this based on the metric
}

export default function CountCard({ title, metric, icon, value }: Props) {
    const Icon = icon ? iconMap[icon] || Activity : Activity

    // Mock data fetching based on metric if value is not provided
    // In production, this would use a react-query hook or server action
    const displayValue = value ?? (metric === 'income' ? 14500.50 : metric === 'clients' ? 245 : 12)
    const isCurrency = metric === 'income' || metric === 'revenue'

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold">
                    {isCurrency && '$'}
                    <CountUp
                        end={displayValue}
                        decimals={isCurrency ? 2 : 0}
                        duration={2}
                        separator=","
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    +20.1% from last month
                </p>
            </div>
        </div>
    )
}
