'use client'

import { CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Goal } from 'lucide-react'

import { cn } from '@/lib/utils'

type Props = {
    title?: string
    current?: number
    goal?: number
    color?: string
}

export default function AgencyGoalCard({
    title = 'Agency Goal',
    current = 0,
    goal = 20,
    color = 'blue'
}: Props) {
    const percentage = goal > 0 ? (current / goal) * 100 : 0

    return (
        <div className="h-full w-full relative p-4 flex flex-col">
            <h3 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 leading-none mb-1">{title}</h3>
            <p className="text-[8px] text-muted-foreground/50 font-medium mb-4">Milestone Tracker</p>

            <div className="flex flex-col w-full mt-auto">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-muted-foreground text-[10px] font-medium">
                        Current: <span className="font-bold text-foreground">{current}</span>
                    </span>
                    <span className="text-muted-foreground text-[10px] font-medium">
                        Goal: <span className="font-bold text-foreground">{goal}</span>
                    </span>
                </div>
                <Progress
                    value={percentage}
                    className={cn(
                        "h-2",
                        color === 'emerald' && "[&>div]:bg-emerald-500",
                        color === 'blue' && "[&>div]:bg-blue-500",
                        color === 'purple' && "[&>div]:bg-purple-500",
                        color === 'orange' && "[&>div]:bg-orange-500",
                        color === 'yellow' && "[&>div]:bg-yellow-500",
                        color === 'violet' && "[&>div]:bg-violet-500",
                    )}
                />
            </div>
            <Goal className={cn(
                "absolute right-4 top-4 w-5 h-5 opacity-20",
                color === 'emerald' && "text-emerald-500",
                color === 'blue' && "text-blue-500",
                color === 'purple' && "text-purple-500",
                color === 'orange' && "text-orange-500",
                color === 'yellow' && "text-yellow-500",
                color === 'violet' && "text-violet-500",
            )} />
        </div>
    )
}
