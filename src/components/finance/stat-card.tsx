import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import TinyChart from './tiny-chart'

type Props = {
    title: string
    amount: string
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: LucideIcon
    className?: string
    iconClassName?: string
    chartData?: number[]
}

const StatCard = ({ title, amount, change, changeType = 'neutral', icon: Icon, className, iconClassName, chartData }: Props) => {
    // Determine chart color based on changeType
    const chartColor = changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#6B7280'

    return (
        <Card className={cn("flex flex-col justify-between overflow-hidden", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-full bg-muted", iconClassName)}>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{amount}</div>
                {change && (
                    <p className={cn("text-xs mt-1", {
                        "text-green-500": changeType === 'positive',
                        "text-red-500": changeType === 'negative',
                        "text-muted-foreground": changeType === 'neutral'
                    })}>
                        {change}
                    </p>
                )}
                {chartData && (
                    <div className="mt-4 -mx-6 -mb-6">
                        <TinyChart data={chartData} color={chartColor} />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default StatCard
