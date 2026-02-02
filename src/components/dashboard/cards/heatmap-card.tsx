'use client'

import { cn } from '@/lib/utils'

type Props = {
    title?: string
    color?: string
}

export default function HeatmapCard({
    title = 'Activity Density',
    color = 'blue'
}: Props) {
    // Generate 28 mock activity points
    const points = Array.from({ length: 28 }).map(() => Math.random())

    return (
        <div className="p-4 h-full flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 leading-none mb-1">{title}</h3>
                <p className="text-[8px] text-muted-foreground/50 font-medium tracking-wide">30-Day Activity Log</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-7 gap-1.5">
                    {points.map((val, i) => (
                        <div
                            key={i}
                            className={cn(
                                "aspect-square rounded-[3px] transition-all duration-500",
                                color === 'blue' && "bg-blue-500",
                                color === 'emerald' && "bg-emerald-500",
                                color === 'purple' && "bg-purple-500",
                                color === 'orange' && "bg-orange-500",
                                color === 'yellow' && "bg-yellow-500",
                                color === 'violet' && "bg-violet-500",
                            )}
                            style={{
                                opacity: val > 0.4 ? (val * 0.8 + 0.1) : 0.05
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">Less Activity</span>
                <div className="flex gap-1">
                    {[0.05, 0.3, 0.6, 1].map(o => (
                        <div
                            key={o}
                            className={cn(
                                "w-1.5 h-1.5 rounded-[2px]",
                                color === 'blue' && "bg-blue-500",
                                color === 'emerald' && "bg-emerald-500",
                                color === 'purple' && "bg-purple-500",
                                color === 'orange' && "bg-orange-500",
                                color === 'yellow' && "bg-yellow-500",
                                color === 'violet' && "bg-violet-500",
                            )}
                            style={{ opacity: o }}
                        />
                    ))}
                </div>
                <span className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest leading-none">More Activity</span>
            </div>
        </div>
    )
}
