'use client'

import { AreaChart, BarChart, LineChart, DonutChart, BarList, ScatterChart } from '@tremor/react'
import { TrendingUp, TrendingDown, Clock, AlertCircle, Users, MousePointer2, Share2, Target, DollarSign, Activity, Brain, ShieldAlert, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    title: string
    chartType?: 'line' | 'bar' | 'area' | 'donut' | 'funnel' | 'horizontal-bar' | 'stacked-bar' | 'scatter'
    dataSource?: string
    color?: string
    className?: string
}

// Mock datasets
const dataSets: Record<string, any[]> = {
    revenue: [
        { date: 'Jan 23', Amount: 2890 }, { date: 'Feb 23', Amount: 2756 },
        { date: 'Mar 23', Amount: 3322 }, { date: 'Apr 23', Amount: 3470 },
        { date: 'May 23', Amount: 3475 }, { date: 'Jun 23', Amount: 3129 },
    ],
    sales: [
        { date: 'Jan 23', Sales: 120 }, { date: 'Feb 23', Sales: 110 },
        { date: 'Mar 23', Sales: 145 }, { date: 'Apr 23', Sales: 160 },
        { date: 'May 23', Sales: 155 }, { date: 'Jun 23', Sales: 140 },
    ],
    conversion: [
        { date: 'Jan 23', Rate: 2.4 }, { date: 'Feb 23', Rate: 2.1 },
        { date: 'Mar 23', Rate: 3.2 }, { date: 'Apr 23', Rate: 3.5 },
        { date: 'May 23', Rate: 3.1 }, { date: 'Jun 23', Rate: 2.8 },
    ],
    taskStatus: [
        { name: 'To Do', value: 12 },
        { name: 'In Progress', value: 8 },
        { name: 'Done', value: 15 },
        { name: 'Blocked', value: 4 },
    ],
    teamWorkload: [
        { name: 'Sarah', Tasks: 12 },
        { name: 'John', Tasks: 8 },
        { name: 'Elena', Tasks: 15 },
        { name: 'Marcus', Tasks: 6 },
    ],
    productivity: [
        { date: 'Mon', Tasks: 4 }, { date: 'Tue', Tasks: 6 },
        { date: 'Wed', Tasks: 8 }, { date: 'Thu', Tasks: 5 },
        { date: 'Fri', Tasks: 9 },
    ],
    // GROWTH DATASETS
    websiteVisitors: [
        { date: 'Jan', Visitors: 12400 }, { date: 'Feb', Visitors: 15600 },
        { date: 'Mar', Visitors: 18900 }, { date: 'Apr', Visitors: 22400 },
        { date: 'May', Visitors: 28900 }, { date: 'Jun', Visitors: 34200 },
    ],
    leadSources: [
        { name: 'Organic', value: 450 },
        { name: 'Social', value: 320 },
        { name: 'Referral', value: 180 },
        { name: 'Paid', value: 120 },
    ],
    funnel: [
        { name: 'Impressions', value: 10000 },
        { name: 'Clicks', value: 2400 },
        { name: 'Leads', value: 850 },
        { name: 'Sales', value: 120 },
    ],
    trafficTrend: [
        { date: 'Mon', Traffic: 1200 }, { date: 'Tue', Traffic: 1500 },
        { date: 'Wed', Traffic: 1300 }, { date: 'Thu', Traffic: 1700 },
        { date: 'Fri', Traffic: 1900 },
    ],
    // FINANCIAL DATASETS
    revVsExp: [
        { date: 'Jan', Revenue: 4500, Expenses: 3100 },
        { date: 'Feb', Revenue: 5200, Expenses: 3400 },
        { date: 'Mar', Revenue: 4800, Expenses: 3200 },
        { date: 'Apr', Revenue: 6100, Expenses: 4000 },
    ],
    cashflow: [
        { date: 'Jan', Flow: 1400 }, { date: 'Feb', Flow: 1800 },
        { date: 'Mar', Flow: 1600 }, { date: 'Apr', Flow: 2100 },
    ],
    profitSplit: [
        { name: 'Services', value: 6500 },
        { name: 'Products', value: 3200 },
        { name: 'Subs', value: 1800 },
    ],
    clientValue: [
        { name: 'Enterprise A', value: 12000 },
        { name: 'Global Tech', value: 8500 },
        { name: 'SaaS Corp', value: 4200 },
    ],
    // OPERATIONS DATASETS
    pipelineStages: [
        { name: 'Discovery', value: 45 },
        { name: 'Proposal', value: 32 },
        { name: 'Negotiation', value: 18 },
        { name: 'Closing', value: 12 },
    ],
    dealStages: [
        { name: 'Lead', value: 120 },
        { name: 'Meeting', value: 85 },
        { name: 'Contract', value: 42 },
        { name: 'Closed', value: 38 },
    ],
    orderStatus: [
        { name: 'Processing', value: 24 },
        { name: 'Shipped', value: 45 },
        { name: 'Delivered', value: 120 },
        { name: 'Returned', value: 4 },
    ],
    inventoryMovement: [
        { date: 'Mon', In: 45, Out: 40 },
        { date: 'Tue', In: 52, Out: 55 },
        { date: 'Wed', In: 38, Out: 30 },
        { date: 'Thu', In: 65, Out: 45 },
    ],
    // INSIGHTS DATASETS
    forecast: [
        { date: 'Jan', value: 2300, predicted: 2300 },
        { date: 'Feb', value: 2500, predicted: 2500 },
        { date: 'Mar', value: 2800, predicted: 2800 },
        { date: 'Apr', predicted: 3100 },
        { date: 'May', predicted: 3400 },
        { date: 'Jun', predicted: 3800 },
    ],
    anomalies: [
        { x: 10, y: 20, z: 100, name: 'Normal' },
        { x: 20, y: 30, z: 120, name: 'Normal' },
        { x: 15, y: 25, z: 110, name: 'Normal' },
        { x: 45, y: 55, z: 400, name: 'Anomaly' },
        { x: 30, y: 40, z: 150, name: 'Normal' },
    ]
}

export default function GraphCard({ title, chartType = 'area', dataSource = 'revenue', color, className }: Props) {
    const data = dataSets[dataSource] || dataSets.revenue

    // Determine category based on data structure
    const category = (chartType === 'donut' || chartType === 'funnel' || chartType === 'scatter')
        ? []
        : data[0] ? Object.keys(data[0]).filter(k => k !== 'date' && k !== 'name') : []

    const currentColors = color ? [color] : ['blue']
    const multiColors = [color || 'blue', 'slate-400', 'indigo-400', 'cyan-400']

    return (
        <div className="h-full w-full flex flex-col group/graph">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground/80 leading-none mb-1">{title}</h3>
                    <p className="text-[8px] text-muted-foreground/50 font-medium">Smart Insights</p>
                </div>
                {dataSource === 'forecast' || dataSource === 'anomalies' ? (
                    <div className="flex items-center gap-1 text-purple-500 bg-purple-500/10 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        <Brain className="w-2.5 h-2.5 animate-pulse" />
                        AI Calculated
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded text-[9px] font-bold">
                        <Activity className="w-2.5 h-2.5" />
                        Live
                    </div>
                )}
            </div>

            <div className="flex-1 w-full min-h-0 relative">
                {chartType === 'funnel' && (
                    <div className="h-full w-full py-2 overflow-hidden">
                        <BarList
                            data={data}
                            color={color || 'blue'}
                            className="text-[9px]"
                        />
                    </div>
                )}
                {chartType === 'scatter' && (
                    <ScatterChart
                        className="h-full w-full"
                        data={data}
                        x="x"
                        y="y"
                        category="name"
                        colors={[color || 'blue', 'rose']}
                        showAnimation={true}
                        showLegend={false}
                        yAxisWidth={20}
                    />
                )}
                {chartType === 'horizontal-bar' && (
                    <BarChart
                        className="h-full w-full"
                        data={data}
                        index="name"
                        categories={['value']}
                        colors={currentColors}
                        layout="vertical"
                        yAxisWidth={60}
                        showAnimation={true}
                        showLegend={false}
                        showGridLines={false}
                        showXAxis={true}
                        showYAxis={true}
                    />
                )}
                {chartType === 'donut' && (
                    <div className="h-full w-full flex items-center justify-center">
                        <DonutChart
                            className="h-24 w-24"
                            data={data}
                            category="value"
                            index="name"
                            colors={multiColors}
                            showAnimation={true}
                            variant="donut"
                        />
                    </div>
                )}
                {chartType === 'stacked-bar' && (
                    <BarChart
                        className="h-full w-full"
                        data={data}
                        index="date"
                        categories={category}
                        colors={multiColors}
                        stack={true}
                        yAxisWidth={25}
                        showAnimation={true}
                        showLegend={false}
                        showGridLines={false}
                    />
                )}
                {chartType === 'bar' && (
                    <BarChart
                        className="h-full w-full"
                        data={data}
                        index={data[0]?.name ? 'name' : "date"}
                        categories={category}
                        colors={category.length > 1 ? multiColors : currentColors}
                        yAxisWidth={25}
                        showAnimation={true}
                        showLegend={false}
                        showGridLines={false}
                        showXAxis={true}
                        showYAxis={false}
                    />
                )}
                {chartType === 'line' && (
                    <LineChart
                        className="h-full w-full"
                        data={data}
                        index="date"
                        categories={category}
                        colors={category.length > 1 ? multiColors : currentColors}
                        yAxisWidth={25}
                        showAnimation={true}
                        showLegend={false}
                        showGridLines={false}
                    />
                )}
                {chartType === 'area' && (
                    <AreaChart
                        className="h-full w-full"
                        data={data}
                        index="date"
                        categories={category}
                        colors={currentColors}
                        yAxisWidth={25}
                        showAnimation={true}
                        showLegend={false}
                        showGridLines={false}
                    />
                )}
            </div>
        </div>
    )
}
