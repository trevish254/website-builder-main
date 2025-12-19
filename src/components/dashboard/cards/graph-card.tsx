'use client'

import { CardContent } from '@/components/ui/card'
import { AreaChart, BarChart } from '@tremor/react'

type Props = {
    title: string
    chartType?: 'line' | 'bar' | 'area'
    dataSource?: string
    className?: string
}

// Mock data
const chartdata = [
    { date: 'Jan 23', Revenue: 2890, Profit: 2338 },
    { date: 'Feb 23', Revenue: 2756, Profit: 2103 },
    { date: 'Mar 23', Revenue: 3322, Profit: 2194 },
    { date: 'Apr 23', Revenue: 3470, Profit: 2108 },
    { date: 'May 23', Revenue: 3475, Profit: 1812 },
    { date: 'Jun 23', Revenue: 3129, Profit: 1726 },
    { date: 'Jul 23', Revenue: 3490, Profit: 1982 },
    { date: 'Aug 23', Revenue: 2903, Profit: 2012 },
    { date: 'Sep 23', Revenue: 2643, Profit: 2342 },
    { date: 'Oct 23', Revenue: 2837, Profit: 2473 },
    { date: 'Nov 23', Revenue: 2954, Profit: 3848 },
    { date: 'Dec 23', Revenue: 3239, Profit: 3736 },
]

export default function GraphCard({ title, chartType = 'area', dataSource, className }: Props) {
    // In a real app, use dataSource to fetch specific data

    return (
        <div className="h-full w-full flex flex-col pt-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
            <div className="flex-1 w-full min-h-[200px]">
                {chartType === 'bar' ? (
                    <BarChart
                        className="h-full w-full"
                        data={chartdata}
                        index="date"
                        categories={['Revenue', 'Profit']}
                        colors={['blue', 'teal']}
                        yAxisWidth={40}
                        showAnimation={true}
                    />
                ) : (
                    <AreaChart
                        className="h-full w-full"
                        data={chartdata}
                        index="date"
                        categories={['Revenue', 'Profit']}
                        colors={['indigo', 'cyan']}
                        showAnimation={true}

                    />
                )}
            </div>
        </div>
    )
}
