'use client'

import { CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Goal } from 'lucide-react'

type Props = {
    title?: string
    current?: number
    goal?: number
}

export default function AgencyGoalCard({
    title = 'Agency Goal',
    current = 0,
    goal = 20
}: Props) {
    const percentage = goal > 0 ? (current / goal) * 100 : 0

    return (
        <div className="h-full w-full relative p-4 flex flex-col">
            <CardTitle className="text-lg mb-4">{title}</CardTitle>
            <div className="flex flex-col w-full mt-auto">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-muted-foreground text-sm">
                        Current: {current}
                    </span>
                    <span className="text-muted-foreground text-sm">
                        Goal: {goal}
                    </span>
                </div>
                <Progress value={percentage} className="h-3" />
            </div>
            <Goal className="absolute right-6 top-6 text-muted-foreground w-6 h-6" />
        </div>
    )
}
