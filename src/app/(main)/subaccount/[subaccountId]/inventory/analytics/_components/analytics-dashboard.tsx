'use client'

import React, { useState } from 'react'
import {
    RefreshCcw,
    MoreVertical,
    MoreHorizontal,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Truck,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Users,
    Repeat,
    LayoutDashboard
} from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Card as Card2, CardHeader as CardHeader2, CardTitle as CardTitle2, CardToolbar, CardContent as CardContent2 } from '@/components/ui/card-2'
import { Badge } from '@/components/ui/badge-2'
import { Button } from '@/components/ui/button' // Regular button used everywhere
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu-2'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { PricingWithChart } from '@/components/ui/pricing-with-chart'
import { InteractiveBarChart } from '@/components/ui/interactive-bar-chart'
import { CategoryBarChart } from '@/components/ui/category-bar-chart'
import { cn } from '@/lib/utils'

// Mock Data
const cashflowData = [
    { name: 'Sun', value: 4000 },
    { name: 'Mon', value: 4500 },
    { name: 'Tue', value: 5200 },
    { name: 'Wed', value: 4800 },
    { name: 'Thu', value: 6100 },
    { name: 'Fri', value: 5900 },
    { name: 'Sat', value: 6500 },
    { name: 'Sun2', value: 7000 },
    { name: 'Mon2', value: 6800 },
    { name: 'Tue2', value: 7400 },
    { name: 'Wed2', value: 7100 },
    { name: 'Thu2', value: 7800 },
    { name: 'Fri2', value: 8200 },
    { name: 'Sat2', value: 8500 },
]

// Data for Donut Chart with specific label positions implied by "spider" layout
const salesChannelData = [
    { name: 'Online', value: 45, color: '#EF4444' },
    { name: 'Retail', value: 25, color: '#F87171' },
    { name: 'Referral', value: 20, color: '#FCA5A5' },
    { name: 'Others', value: 10, color: '#FEE2E2' },
]

const productCategories = [
    { name: 'Electronics', value: 42000, percentage: 25, color: 'bg-red-500' },
    { name: 'Cash', value: 28000, percentage: 18, color: 'bg-red-300' },
    { name: 'Services', value: 18000, percentage: 12, color: 'bg-red-100' },
]

const salesChannelsList = [
    { name: 'Indonesia', value: 70, color: 'bg-red-500' },
    { name: 'Portugal', value: 20, color: 'bg-red-400' },
    { name: 'Portugal', value: 20, color: 'bg-red-400' },
    { name: 'Portugal', value: 20, color: 'bg-red-400' },
]

const meetings = [
    { title: 'Mesh Weekly Meeting', time: '9.00 AM - 10:30 AM', link: 'On Google Meet', participants: 3 },
    { title: 'Mesh Weekly Meeting', time: '9.00 AM - 10:30 AM', link: '', participants: 0 },
]

type MetricCardProps = {
    title: string
    value: string
    change: string
    subtitle: string
    trend: 'up' | 'down'
    icon: React.ElementType
}

const MetricCard = ({ title, value, change, subtitle, trend, icon: Icon }: MetricCardProps) => (
    <Card2 className="w-full">
        <CardHeader2 className="border-0 py-5 min-h-auto">
            <CardTitle2 className="inline-flex items-center gap-2">
                <Icon className="size-5 text-slate-500" />
                {title}
            </CardTitle2>
            <CardToolbar>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="dim" size="sm" mode="icon">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                        <DropdownMenuItem>Pin to Dashboard</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardToolbar>
        </CardHeader2>
        <CardContent2 className="pt-0 pb-5">
            <div className="flex items-center gap-2.5 mb-2.5">
                <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
            </div>

            <div className="flex items-center gap-2 mb-0">
                <Badge variant={trend === 'up' ? 'success' : 'destructive'} appearance="light">
                    {trend === 'up' ? (
                        <TrendingUp className="w-3.5 h-3.5 mr-1" />
                    ) : (
                        <TrendingUp className="w-3.5 h-3.5 mr-1 rotate-180" />
                    )}
                    {change}
                </Badge>
                <span className="text-sm text-muted-foreground">{subtitle}</span>
            </div>
        </CardContent2>
    </Card2>
)

// Custom Label for Donut Chart (Spider Lines)
const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 2.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Calculate line points
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#94a3b8" fill="none" strokeWidth={1} />
            <circle cx={ex} cy={ey} r={2} fill="#94a3b8" stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#64748b" fontSize={10} fontWeight={500} dy={3}>
                {`${name}`}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} fill="#334155" fontSize={10} fontWeight={700}>
                {`${value}%`}
            </text>
        </g>
    );
};

const AnalyticsDashboard = ({ subaccountId }: { subaccountId: string }) => {
    return (
        <div className="p-8 space-y-8 max-w-[1600px] mx-auto bg-[#F8F9FC] dark:bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#EF4444] rounded-lg text-white shadow-md shadow-red-200 dark:shadow-none">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Revenue Analytics</h1>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Last updated: Feb 28, 2024</span>
                    <RefreshCcw className="w-3.5 h-3.5 text-slate-400 ml-2 cursor-pointer hover:rotate-180 transition-transform" />
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <MetricCard title="Total Revenue" value="$124,500" change="+3.5%" subtitle="vs last Year" trend="up" icon={DollarSign} />
                <MetricCard title="Monthly Growth Rate" value="+8.3%" change="+1.2%" subtitle="vs last Year" trend="up" icon={TrendingUp} />
                <MetricCard title="Total Sales Orders" value="1,284" change="-1.7%" subtitle="vs last Year" trend="down" icon={ShoppingCart} />
                <MetricCard title="Active Customers" value="742" change="+2.5%" subtitle="vs last Year" trend="up" icon={Users} />
                <MetricCard title="Repeat Purchase Rate" value="34%" change="-2.3%" subtitle="vs last Year" trend="down" icon={Repeat} />
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cashflow Chart */}
                <div className="lg:col-span-2">
                    <InteractiveBarChart />
                </div>

                {/* Revenue by Product Category */}
                <div className="h-full">
                    <CategoryBarChart />
                </div>
            </div>

            {/* Pricing Section */}
            <div className="w-full">
                <PricingWithChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Revenue By Sales Channel (Donut) */}
                <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Revenue By Sales Channel</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[220px] w-full relative mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={salesChannelData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={75}
                                        paddingAngle={4}
                                        dataKey="value"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                    >
                                        {salesChannelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-bold text-slate-900 dark:text-white">100K</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wide">Total</span>
                            </div>
                        </div>
                        <div className="flex justify-between px-8 text-[10px] text-slate-400 mt-2">
                            <div className="text-center">
                                <div className="font-bold text-slate-900 dark:text-white">Others</div>
                                <div>10%</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-900 dark:text-white">Referral</div>
                                <div>20%</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sales Calendar */}
                <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb- px-6 pt-6">
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Sales Calender</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Date Strip */}
                        <div className="flex items-center justify-between px-2 py-4">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400"><ChevronLeft className="w-4 h-4" /></Button>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400">Sun 5</div>
                                <div className="px-3 py-1 rounded-lg text-xs font-bold text-[#EF4444] bg-red-50 dark:bg-red-900/10">Mon 6</div>
                                <div className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400">Tue 7</div>
                                <div className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400">Wed 8</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400"><ChevronRight className="w-4 h-4" /></Button>
                        </div>

                        {/* Tabs */}
                        <div className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="py-3 text-center text-xs font-semibold text-slate-900 dark:text-white border-b-2 border-[#EF4444]">
                                <span className="flex items-center justify-center gap-2">Shipment <Truck className="w-3.5 h-3.5" /></span>
                            </div>
                            <div className="py-3 text-center text-xs font-medium text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <span className="flex items-center justify-center gap-2">Meetings <CalendarIcon className="w-3.5 h-3.5" /></span>
                            </div>
                        </div>

                        {/* Meetings List */}
                        <div className="p-4 space-y-3">
                            {meetings.map((m, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="relative">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-slate-900">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 5}`} alt="avatar" />
                                        </div>
                                        {m.participants > 0 && (
                                            <div className="absolute -right-1 -bottom-1 bg-[#EF4444] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 font-bold">
                                                +{m.participants}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.title}</h4>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{m.time}</span>
                                        </div>
                                        {m.link && (
                                            <button className="flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-slate-900 text-[#EF4444] text-[10px] rounded border border-red-100 dark:border-red-900/30 font-medium hover:bg-red-50 transition-colors">
                                                {m.link} <ChevronRight className="w-2.5 h-2.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue By Sales Channel (List/Regions) */}
                <Card className="shadow-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Revenue By Sales Channel</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50"><MoreVertical className="w-4 h-4 text-slate-400" /></Button>
                    </CardHeader>
                    <CardContent className="space-y-7 pt-4">
                        {salesChannelsList.map((channel, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    <span>{channel.name}</span>
                                    <span>{channel.value}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full", channel.color)}
                                        style={{ width: `${channel.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default AnalyticsDashboard
