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
        <div className="flex flex-col h-full w-full relative group">
            <div className="flex items-center justify-between z-10">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary/70" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className="text-5xl font-light tracking-tighter text-foreground drop-shadow-sm">
                    {isCurrency && <span className="text-2xl mr-1 self-start opacity-50 font-normal">$</span>}
                    <CountUp
                        end={displayValue}
                        decimals={isCurrency ? 2 : 0}
                        duration={2.5}
                        separator=","
                    />
                </div>
                <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <span className="text-[10px] font-bold">+20.1%</span>
                    <Activity className="w-3 h-3" />
                </div>
            </div>

            <div className="mt-auto z-10 pt-4 flex justify-center border-t border-border/10">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                    Global Performance
                </p>
            </div>
        </div>
    )
}
