'use client'
import React from 'react'
import {
    Users,
    UserPlus,
    ShoppingCart,
    DollarSign,
    RefreshCcw,
    MoreHorizontal,
    Calendar,
    ChevronDown,
    Settings2,
    Filter,
    Download,
    Eye
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface ProductDashboardClientProps {
    subaccountId: string
    subaccountDetails: any
    orderStats: any
    products: any[]
    contacts: any[]
    totalRevenue: number
}

const chartData = [
    { name: 'Jan', revenue: 4000, expenditure: 2400 },
    { name: 'Feb', revenue: 3000, expenditure: 1398 },
    { name: 'Mar', revenue: 2000, expenditure: 9800 },
    { name: 'Apr', revenue: 2780, expenditure: 3908 },
    { name: 'May', revenue: 1890, expenditure: 4800 },
    { name: 'Jun', revenue: 2390, expenditure: 3800 },
    { name: 'Jul', revenue: 3490, expenditure: 4300 },
]

const countries = [
    { name: 'Singapore', flag: '🇸🇬', growth: '+90%', active: true },
    { name: 'Brazil', flag: '🇧🇷', growth: '+90%', active: true },
    { name: 'United States', flag: '🇺🇸', growth: '+90%', active: true },
    { name: 'Poland', flag: '🇵🇱', growth: '-9%', active: false },
    { name: 'Netherland', flag: '🇳🇱', growth: '+90%', active: true },
]

const ProductDashboardClient: React.FC<ProductDashboardClientProps> = ({
    subaccountId,
    subaccountDetails,
    orderStats,
    products,
    contacts,
    totalRevenue,
}) => {
    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-50 dark:bg-background text-foreground font-light transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-light tracking-tight text-foreground">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-card shadow-sm border border-slate-100 dark:border-border hover:bg-slate-100 dark:hover:bg-accent">
                        <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-card shadow-sm border border-slate-100 dark:border-border hover:bg-slate-100 dark:hover:bg-accent">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        title: 'TOTAL CUSTOMER',
                        value: contacts.length.toLocaleString(),
                        change: '+42%',
                        trend: 'up',
                        icon: Users,
                        color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
                        subText: 'From the last month',
                    },
                    {
                        title: 'NEW MEMBER',
                        value: '908.90K',
                        change: '-9%',
                        trend: 'down',
                        icon: UserPlus,
                        color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
                        subText: 'From the last month',
                    },
                    {
                        title: 'TOTAL ORDERS',
                        value: orderStats.totalOrders.toLocaleString(),
                        change: '+190%',
                        trend: 'up',
                        icon: ShoppingCart,
                        color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
                        subText: 'From the last month',
                    },
                    {
                        title: 'TOTAL REVENUE',
                        value: `$${totalRevenue.toLocaleString()}`,
                        change: '+90%',
                        trend: 'up',
                        icon: DollarSign,
                        color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
                        subText: 'From the last month',
                    },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white dark:bg-card rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                                    <stat.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{stat.title}</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                                <h3 className="text-2xl font-light text-foreground">{stat.value}</h3>
                                <Badge className={`px-1.5 py-0.5 rounded-lg border-none text-[10px] font-medium ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                                    {stat.change} {stat.trend === 'up' ? '↗' : '↘'}
                                </Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2 font-light">{stat.subText}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2 border-none shadow-sm bg-white dark:bg-card rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
                        <div>
                            <CardTitle className="text-lg font-light text-foreground">Consolidated Budget</CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-4 rounded-full bg-teal-500" />
                                    <span className="text-xs text-muted-foreground">Revenues</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-4 rounded-full bg-indigo-500" />
                                    <span className="text-xs text-muted-foreground">Expenditures</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-slate-50 dark:hover:bg-accent">
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-slate-50 dark:hover:bg-accent">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 rounded-xl border-slate-100 dark:border-border text-xs font-light px-3 bg-slate-50 dark:bg-background dark:text-foreground">
                                <Calendar className="mr-2 h-3.5 w-3.5 opacity-50" />
                                Months
                                <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-50" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-2">
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 11, fill: '#94a3b8' }}
                                        tickFormatter={(value) => `$${value / 1000}K`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                            backgroundColor: 'var(--card)',
                                            color: 'var(--foreground)'
                                        }}
                                        itemStyle={{ fontSize: '12px', padding: '2px 0' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#14b8a6"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="expenditure"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorExp)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Side List */}
                <Card className="border-none shadow-sm bg-white dark:bg-card rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                        <CardTitle className="text-lg font-light text-foreground">Sales By Country</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-slate-50 dark:hover:bg-accent">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                        <div className="space-y-6 mt-4">
                            {countries.map((country, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-slate-50 dark:bg-background flex items-center justify-center text-lg shadow-sm border border-slate-100 dark:border-border">
                                            {country.flag}
                                        </div>
                                        <span className="text-sm text-muted-foreground font-light">{country.name}</span>
                                    </div>
                                    <Badge className={`px-2 py-0.5 rounded-lg border-none text-[10px] font-medium ${country.active ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                                        {country.growth} {country.active ? '↗' : '↘'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Product Table */}
            <Card className="border-none shadow-sm bg-white dark:bg-card rounded-3xl overflow-hidden mb-8">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <CardTitle className="text-lg font-light text-foreground">Top Product</CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-100 dark:border-border text-xs font-light px-3 bg-slate-50 dark:bg-background shadow-sm hover:bg-slate-100 dark:hover:bg-accent dark:text-foreground">
                            <Settings2 className="mr-2 h-3.5 w-3.5 opacity-50" />
                            Customise
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-100 dark:border-border text-xs font-light px-3 bg-slate-50 dark:bg-background shadow-sm hover:bg-slate-100 dark:hover:bg-accent dark:text-foreground">
                            <Filter className="mr-2 h-3.5 w-3.5 opacity-50" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-100 dark:border-border text-xs font-light px-3 bg-slate-50 dark:bg-background shadow-sm hover:bg-slate-100 dark:hover:bg-accent dark:text-foreground">
                            <Download className="mr-2 h-3.5 w-3.5 opacity-50" />
                            Export
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-background/50 border-y border-slate-100 dark:border-border">
                            <TableRow className="hover:bg-transparent border-slate-100 dark:border-border">
                                <TableHead className="w-12 pl-6">
                                    <Checkbox className="rounded" />
                                </TableHead>
                                <TableHead className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Product</TableHead>
                                <TableHead className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Revenue</TableHead>
                                <TableHead className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Sales</TableHead>
                                <TableHead className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Reviews</TableHead>
                                <TableHead className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Visibility Score</TableHead>
                                <TableHead className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider pr-6">Views</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.length > 0 ? products.map((product, i) => (
                                <TableRow key={i} className="border-b border-slate-50 dark:border-border/40 hover:bg-slate-50/50 dark:hover:bg-accent/50 transition-colors">
                                    <TableCell className="pl-6">
                                        <Checkbox className="rounded" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-background border border-slate-200 dark:border-border">
                                                {product.images?.[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full bg-slate-200 dark:bg-background text-muted-foreground">
                                                        <span className="text-[10px]">No img</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-sm font-light text-foreground max-w-[200px] truncate">{product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-light">${(product.price * 10).toLocaleString()}.90</TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-light">{(Math.random() * 5000 + 1000).toFixed(0).toLocaleString()}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-light">{(Math.random() * 10000).toFixed(0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((step) => (
                                                    <div
                                                        key={step}
                                                        className={`w-1 h-3 rounded-full ${step <= Math.floor(Math.random() * 10 + 1) ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-muted-foreground font-light">{(Math.random() * 100).toFixed(0)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground font-light pr-6">
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="h-3 w-3 text-muted-foreground/60" />
                                            {(Math.random() * 10000).toFixed(2).toLocaleString()}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                // Dummy rows if no products
                                [1, 2, 3, 4].map((_, i) => (
                                    <TableRow key={i} className="border-b border-slate-50 dark:border-border/40">
                                        <TableCell className="pl-6"><Checkbox className="rounded" /></TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                                <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                                            </div>
                                        </TableCell>
                                        <TableCell><div className="h-4 w-16 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-12 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-4 w-12 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell><div className="h-3 w-24 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></TableCell>
                                        <TableCell className="pr-6"><div className="h-4 w-12 bg-slate-50 dark:bg-slate-800 rounded animate-pulse" /></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductDashboardClient
