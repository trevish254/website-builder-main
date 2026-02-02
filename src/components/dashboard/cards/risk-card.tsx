'use client'

import { ShieldAlert, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    title?: string
    color?: string
}

export default function RiskCard({
    title = 'Risk Guard',
    color = 'violet'
}: Props) {
    return (
        <div className="p-4 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 leading-none mb-1">{title}</h3>
                    <p className="text-[8px] text-muted-foreground/50 font-medium tracking-wide">AI Threat Detection</p>
                </div>
                <ShieldAlert className={cn(
                    "w-5 h-5",
                    color === 'blue' && "text-blue-500",
                    color === 'emerald' && "text-emerald-500",
                    color === 'purple' && "text-purple-500",
                    color === 'orange' && "text-orange-500",
                    color === 'yellow' && "text-yellow-500",
                    color === 'violet' && "text-violet-500",
                )} />
            </div>

            <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 flex items-start gap-3 group transition-all hover:bg-muted/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping mt-1.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-foreground">Churn Risk: Enterprise B</span>
                        <span className="text-[8px] text-muted-foreground">Detected unusual low engagement over last 7 days</span>
                    </div>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border/20 flex items-start gap-3 group transition-all hover:bg-muted/50 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-foreground">Pending Contract Renewal</span>
                        <span className="text-[8px] text-muted-foreground">SaaS Corp renewal due in 12 days</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/5 flex items-center justify-between">
                <span className="text-[8px] font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded tracking-widest uppercase">High Priority</span>
                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Global Guard Active</span>
            </div>
        </div>
    )
}
