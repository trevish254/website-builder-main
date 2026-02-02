'use client'

import { cn } from '@/lib/utils'

type Props = {
    title?: string
    color?: string
}

export default function ScoreCard({
    title = 'Health Score',
    color = 'violet'
}: Props) {
    const score = 84
    const radius = 35
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (score / 100) * circumference

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-4">
            <div className="text-center mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 leading-none mb-1">{title}</h3>
                <p className="text-[8px] text-muted-foreground/50 font-medium">Business Efficiency</p>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64" cy="64" r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-muted/10"
                    />
                    <circle
                        cx="64" cy="64" r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={cn(
                            "transition-all duration-1000",
                            color === 'blue' && "text-blue-500",
                            color === 'emerald' && "text-emerald-500",
                            color === 'purple' && "text-purple-500",
                            color === 'orange' && "text-orange-500",
                            color === 'yellow' && "text-yellow-500",
                            color === 'violet' && "text-violet-500",
                        )}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-foreground leading-none">{score}</span>
                    <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tighter">Percent</span>
                </div>
            </div>

            <div className="mt-4 flex gap-1 items-center px-3 py-1 rounded-full bg-muted/30 border border-border/20">
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    color === 'blue' && "bg-blue-500",
                    color === 'emerald' && "bg-emerald-500",
                    color === 'purple' && "bg-purple-500",
                    color === 'orange' && "bg-orange-500",
                    color === 'yellow' && "bg-yellow-500",
                    color === 'violet' && "bg-violet-500",
                )} />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Optimized</span>
            </div>
        </div>
    )
}
