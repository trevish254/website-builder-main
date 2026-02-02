'use client'

import { AlertCircle, Activity } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type Props = {
    title?: string
    color?: string
}

export default function PressureCard({
    title = 'System Pressure',
    color = 'blue'
}: Props) {
    const value = 75 // Mock value

    return (
        <div className="p-4 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                    <h3 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 leading-none mb-1">{title}</h3>
                    <p className="text-[8px] text-muted-foreground/50 font-medium tracking-wide">Infrastructure Load</p>
                </div>
                <div className={cn(
                    "p-1.5 rounded-lg",
                    color === 'blue' && "bg-blue-500/10 text-blue-500",
                    color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                    color === 'purple' && "bg-purple-500/10 text-purple-500",
                    color === 'orange' && "bg-orange-500/10 text-orange-500",
                    color === 'yellow' && "bg-yellow-500/10 text-yellow-500",
                    color === 'violet' && "bg-violet-500/10 text-violet-500",
                )}>
                    <Activity className="w-4 h-4" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                    <span>Performance Health</span>
                    <span className={cn(
                        color === 'blue' && "text-blue-500",
                        color === 'emerald' && "text-emerald-500",
                        color === 'purple' && "text-purple-500",
                        color === 'orange' && "text-orange-500",
                        color === 'yellow' && "text-yellow-500",
                        color === 'violet' && "text-violet-500",
                    )}>{value}%</span>
                </div>
                <Progress
                    value={value}
                    className={cn(
                        "h-2",
                        color === 'blue' && "[&>div]:bg-blue-500",
                        color === 'emerald' && "[&>div]:bg-emerald-500",
                        color === 'purple' && "[&>div]:bg-purple-500",
                        color === 'orange' && "[&>div]:bg-orange-500",
                        color === 'yellow' && "[&>div]:bg-yellow-500",
                        color === 'violet' && "[&>div]:bg-violet-500",
                    )}
                />
                <p className="text-[9px] text-muted-foreground/60 leading-tight">
                    Resource utilization is stable within operational parameters.
                </p>
            </div>
        </div>
    )
}
