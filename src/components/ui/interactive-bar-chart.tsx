"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { date: "2024-04-01", income: 2220, expenses: 1500 },
    { date: "2024-04-02", income: 970, expenses: 1800 },
    { date: "2024-04-03", income: 1670, expenses: 1200 },
    { date: "2024-04-04", income: 2420, expenses: 2600 },
    { date: "2024-04-05", income: 3730, expenses: 2900 },
    { date: "2024-04-06", income: 3010, expenses: 3400 },
    { date: "2024-04-07", income: 2450, expenses: 1800 },
    { date: "2024-04-08", income: 4090, expenses: 3200 },
    { date: "2024-04-09", income: 590, expenses: 1100 },
    { date: "2024-04-10", income: 2610, expenses: 1900 },
    { date: "2024-04-11", income: 3270, expenses: 3500 },
    { date: "2024-04-12", income: 2920, expenses: 2100 },
    { date: "2024-04-13", income: 3420, expenses: 3800 },
    { date: "2024-04-14", income: 1370, expenses: 2200 },
    { date: "2024-04-15", income: 1200, expenses: 1700 },
    { date: "2024-04-16", income: 1380, expenses: 1900 },
    { date: "2024-04-17", income: 4460, expenses: 3600 },
    { date: "2024-04-18", income: 3640, expenses: 4100 },
    { date: "2024-04-19", income: 2430, expenses: 1800 },
    { date: "2024-04-20", income: 890, expenses: 1500 },
    { date: "2024-04-21", income: 1370, expenses: 2000 },
    { date: "2024-04-22", income: 2240, expenses: 1700 },
    { date: "2024-04-23", income: 1380, expenses: 2300 },
    { date: "2024-04-24", income: 3870, expenses: 2900 },
    { date: "2024-04-25", income: 2150, expenses: 2500 },
    { date: "2024-04-26", income: 750, expenses: 1300 },
    { date: "2024-04-27", income: 3830, expenses: 4200 },
    { date: "2024-04-28", income: 1220, expenses: 1800 },
    { date: "2024-04-29", income: 3150, expenses: 2400 },
    { date: "2024-04-30", income: 4540, expenses: 3800 },
    { date: "2024-05-01", income: 1650, expenses: 2200 },
    { date: "2024-05-02", income: 2930, expenses: 3100 },
    { date: "2024-05-03", income: 2470, expenses: 1900 },
    { date: "2024-05-04", income: 3850, expenses: 4200 },
    { date: "2024-05-05", income: 4810, expenses: 3900 },
    { date: "2024-05-06", income: 4980, expenses: 5200 },
    { date: "2024-05-07", income: 3880, expenses: 3000 },
    { date: "2024-05-08", income: 1490, expenses: 2100 },
    { date: "2024-05-09", income: 2270, expenses: 1800 },
    { date: "2024-05-10", income: 2930, expenses: 3300 },
    { date: "2024-05-11", income: 3350, expenses: 2700 },
    { date: "2024-05-12", income: 1970, expenses: 2400 },
    { date: "2024-05-13", income: 1970, expenses: 1600 },
    { date: "2024-05-14", income: 4480, expenses: 4900 },
    { date: "2024-05-15", income: 4730, expenses: 3800 },
    { date: "2024-05-16", income: 3380, expenses: 4000 },
    { date: "2024-05-17", income: 4990, expenses: 4200 },
    { date: "2024-05-18", income: 3150, expenses: 3500 },
    { date: "2024-05-19", income: 2350, expenses: 1800 },
    { date: "2024-05-20", income: 1770, expenses: 2300 },
    { date: "2024-05-21", income: 820, expenses: 1400 },
    { date: "2024-05-22", income: 810, expenses: 1200 },
    { date: "2024-05-23", income: 2520, expenses: 2900 },
    { date: "2024-05-24", income: 2940, expenses: 2200 },
    { date: "2024-05-25", income: 2010, expenses: 2500 },
    { date: "2024-05-26", income: 2130, expenses: 1700 },
    { date: "2024-05-27", income: 4200, expenses: 4600 },
    { date: "2024-05-28", income: 2330, expenses: 1900 },
    { date: "2024-05-29", income: 780, expenses: 1300 },
    { date: "2024-05-30", income: 3400, expenses: 2800 },
    { date: "2024-05-31", income: 1780, expenses: 2300 },
    { date: "2024-06-01", income: 1780, expenses: 2000 },
    { date: "2024-06-02", income: 4700, expenses: 4100 },
    { date: "2024-06-03", income: 1030, expenses: 1600 },
    { date: "2024-06-04", income: 4390, expenses: 3800 },
    { date: "2024-06-05", income: 880, expenses: 1400 },
    { date: "2024-06-06", income: 2940, expenses: 2500 },
    { date: "2024-06-07", income: 3230, expenses: 3700 },
    { date: "2024-06-08", income: 3850, expenses: 3200 },
    { date: "2024-06-09", income: 4380, expenses: 4800 },
    { date: "2024-06-10", income: 1550, expenses: 2000 },
    { date: "2024-06-11", income: 920, expenses: 1500 },
    { date: "2024-06-12", income: 4920, expenses: 4200 },
    { date: "2024-06-13", income: 810, expenses: 1300 },
    { date: "2024-06-14", income: 4260, expenses: 3800 },
    { date: "2024-06-15", income: 3070, expenses: 3500 },
    { date: "2024-06-16", income: 3710, expenses: 3100 },
    { date: "2024-06-17", income: 4750, expenses: 5200 },
    { date: "2024-06-18", income: 1070, expenses: 1700 },
    { date: "2024-06-19", income: 3410, expenses: 2900 },
    { date: "2024-06-20", income: 4080, expenses: 4500 },
    { date: "2024-06-21", income: 1690, expenses: 2100 },
    { date: "2024-06-22", income: 3170, expenses: 2700 },
    { date: "2024-06-23", income: 4800, expenses: 5300 },
    { date: "2024-06-24", income: 1320, expenses: 1800 },
    { date: "2024-06-25", income: 1410, expenses: 1900 },
    { date: "2024-06-26", income: 4340, expenses: 3800 },
    { date: "2024-06-27", income: 4480, expenses: 4900 },
    { date: "2024-06-28", income: 1490, expenses: 2000 },
    { date: "2024-06-29", income: 1030, expenses: 1600 },
    { date: "2024-06-30", income: 4460, expenses: 4000 },
]

const chartConfig = {
    views: {
        label: "Total Flow",
    },
    income: {
        label: "Income",
        color: "hsl(var(--chart-2))", // Greenish
    },
    expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-1))", // Reddish
    },
} satisfies ChartConfig

export function InteractiveBarChart() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("income")

    const total = React.useMemo(
        () => ({
            income: chartData.reduce((acc, curr) => acc + curr.income, 0),
            expenses: chartData.reduce((acc, curr) => acc + curr.expenses, 0),
        }),
        [],
    )

    return (
        <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Cashflow - Interactive</CardTitle>
                    <CardDescription>
                        Showing total cashflow for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["income", "expenses"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        if (key === 'views') return null // skip views key
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    ${total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    formatter={(value, name) => (
                                        <div className="flex min-w-[130px] items-center gap-2 text-xs text-muted-foreground">
                                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                                ${value.toLocaleString()}
                                            </div>
                                        </div>
                                    )}
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey={activeChart}
                            fill={`var(--color-${activeChart})`}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
