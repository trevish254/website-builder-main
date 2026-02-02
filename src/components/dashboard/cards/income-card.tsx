'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    title?: string
    amount?: number
    currency?: string
    year?: number
    color?: string
}

export default function IncomeCard({
    title = 'Income',
    amount = 0,
    currency = '$',
    year = new Date().getFullYear(),
    color = 'emerald'
}: Props) {
    return (
        <div className="flex flex-col h-full w-full relative group p-1">
            <div className="flex items-center justify-between z-10 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{title}</span>
                <DollarSign className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary/70" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className="text-5xl font-light tracking-tighter text-foreground drop-shadow-sm">
                    <span className="text-2xl mr-1 opacity-50 font-normal">{currency}</span>
                    {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={cn(
                    "mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full border",
                    color === 'emerald' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                    color === 'blue' && "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
                    color === 'purple' && "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400",
                    color === 'orange' && "bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400",
                    color === 'yellow' && "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400",
                    color === 'violet' && "bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400",
                )}>
                    <span className="text-[10px] font-bold">+20.1%</span>
                </div>
            </div>

            <div className="mt-auto z-10 pt-4 flex justify-center border-t border-border/5">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">
                    For the year {year}
                </p>
            </div>
        </div>
    )
}
