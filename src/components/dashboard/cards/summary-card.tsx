'use client'

import { Sparkles, BrainCircuit } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    title?: string
    color?: string
}

export default function SummaryCard({
    title = 'Smart Summary',
    color = 'violet'
}: Props) {
    return (
        <div className="p-4 h-full flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-1.5 rounded-lg",
                        color === 'blue' && "bg-blue-500/10 text-blue-500",
                        color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                        color === 'purple' && "bg-purple-500/10 text-purple-500",
                        color === 'orange' && "bg-orange-500/10 text-orange-500",
                        color === 'yellow' && "bg-yellow-500/10 text-yellow-500",
                        color === 'violet' && "bg-violet-500/10 text-violet-500",
                    )}>
                        <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-tight text-foreground leading-none mb-1">{title}</h3>
                        <p className="text-[8px] text-muted-foreground/60 font-medium">Business Narrative</p>
                    </div>
                </div>
                <BrainCircuit className="w-4 h-4 text-muted-foreground/30" />
            </div>

            <div className="space-y-2.5">
                <p className="text-[10px] text-foreground font-medium leading-relaxed bg-muted/20 p-2 rounded-lg border border-border/10">
                    "Weekly performance is <span className={cn(
                        "font-bold",
                        color === 'emerald' ? "text-emerald-500" : "text-primary"
                    )}>up 14%</span>. The sales pipeline indicates a strong close for Q1 with several high-value enterprise deals entering the closing stage."
                </p>
                <div className="flex flex-col gap-1.5 px-1">
                    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                        <div className={cn(
                            "h-full w-3/4 animate-pulse",
                            color === 'blue' && "bg-blue-500/40",
                            color === 'emerald' && "bg-emerald-500/40",
                            color === 'purple' && "bg-purple-500/40",
                            color === 'orange' && "bg-orange-500/40",
                            color === 'yellow' && "bg-yellow-500/40",
                            color === 'violet' && "bg-violet-500/40",
                        )} />
                    </div>
                    <div className="h-1.5 w-2/3 bg-muted/40 rounded-full overflow-hidden">
                        <div className={cn(
                            "h-full w-1/2 animate-pulse delay-300",
                            color === 'blue' && "bg-blue-500/40",
                            color === 'emerald' && "bg-emerald-500/40",
                            color === 'purple' && "bg-purple-500/40",
                            color === 'orange' && "bg-orange-500/40",
                            color === 'yellow' && "bg-yellow-500/40",
                            color === 'violet' && "bg-violet-500/40",
                        )} />
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-2 flex items-center gap-1.5">
                <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Calculated by Agentic Core</span>
                <div className="h-px flex-1 bg-border/5" />
            </div>
        </div>
    )
}
