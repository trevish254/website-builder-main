'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
    TrendingUp,
    TrendingDown,
    Package,
    RotateCcw,
    CheckCircle2,
    MapPin,
    Search,
    Download,
    Plus,
    MoreVertical,
    Edit,
    Clock,
    Truck,
    XCircle,
    ChevronRight,
    AlertCircle,
    Globe2,
    ArrowUpRight,
    User,
    Users,
    Trash2,
    CheckCircle,
    Image as ImageIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import OrderAnalysisChart from './order-analysis-chart'
import CountryDistributionMap from './country-distribution-map'
import OrdersPerformanceGauge from './orders-performance-gauge'
import ShipmentTracker from './shipment-tracker'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils'
import {
    bulkUpdateOrderStatus,
    bulkDeleteOrders,
    assignOrders,
    getSubAccountTeamMembers
} from '@/lib/queries'
import { toast } from 'sonner'
import { useEffect } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
} from 'recharts'
import {
    Chart,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/tooltip-chart'
import {
    Card as PremiumCard,
    CardContent as PremiumCardContent,
} from '@/components/ui/card-premium'

interface Order {
    id: string
    orderId: string
    customerName?: string
    customerEmail?: string
    totalPrice: number
    paymentMethod?: string
    paymentStatus: string
    orderStatus: string
    createdAt: string
    OrderItem?: Array<{
        id: string
        quantity: number
        Product?: {
            name: string
            images?: string[]
        }
    }>
}

interface OrdersClientProps {
    subAccountId: string
    subaccount: any
    orders: Order[]
    stats: {
        totalOrders: number
        fulfilledOrders: number
        returnOrders: number
        pendingOrdersCount: number
        shippedOrdersCount: number
        canceledOrdersCount: number
        deliveredOrdersCount: number
        totalOrdersChange: number
        returnOrdersChange: number
        avgDeliveryTime?: number
        avgDeliveryTimeChange?: number
        orders: Array<{
            createdAt: string
            totalPrice: number
            orderStatus: string
        }>
        countryDistribution: Array<{
            country: string
            count: number
            successful: number
            cancels: number
            abandons: number
            growth: string
            coordinates: [number, number]
        }>
    }
    count: number
    totalPages: number
    page: number
    searchParams: { [key: string]: string | string[] | undefined }
}

const StatusCard = ({ label, count, color, trend, percentage, icon: Icon, gradientId }: any) => {
    const chartData = [
        { value: count * 0.8 },
        { value: count * 0.95 },
        { value: count * 0.85 },
        { value: count * 1.1 },
        { value: count * 0.9 },
        { value: count * 1.05 },
        { value: count },
    ]

    return (
        <PremiumCard className="overflow-hidden border border-border shadow-xs">
            <PremiumCardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2">
                    <Icon className="size-4" style={{ color: `var(--color-${color}-500)` }} />
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                </div>

                <div className="flex items-end gap-2.5 justify-between">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            <span>Last 7 Days</span>
                            <div className={cn("text-[10px] font-black uppercase tracking-widest",
                                trend === 'up' ? "text-emerald-500" : "text-rose-500")}>
                                {trend === 'up' ? '▲' : '▼'} {percentage}%
                            </div>
                        </div>
                        <div className="text-2xl font-medium text-foreground tracking-tight">{count.toLocaleString()}</div>
                    </div>

                    <div className="max-w-32 h-12 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={`var(--color-${color}-500)`} stopOpacity={0.3} />
                                        <stop offset="100%" stopColor={`var(--color-${color}-500)`} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <RechartsTooltip
                                    cursor={{ stroke: `var(--color-${color}-500)`, strokeWidth: 1, strokeDasharray: '2 2' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const val = payload[0].value as number;
                                            return (
                                                <div className="bg-card/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-2 pointer-events-none">
                                                    <p className="text-[10px] font-black text-foreground">{Math.round(val)}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={`var(--color-${color}-500)`}
                                    fill={`url(#${gradientId})`}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: `var(--color-${color}-500)`, stroke: 'white', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </PremiumCardContent>
        </PremiumCard>
    )
}

const RegionalInsightsCard = ({ data }: { data: any[] }) => {
    const regions = data.slice(0, 3).map(d => ({
        country: d.country,
        growth: d.growth || '+0%',
        percentage: Math.min(100, (d.count / (data[0]?.count || 1)) * 100),
        color: "bg-primary"
    }))

    return (
        <PremiumCard className="overflow-hidden border border-border shadow-xs">
            <PremiumCardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Globe2 className="size-4 text-primary animate-pulse" />
                        <span className="text-sm font-semibold text-foreground">Regional Insights</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
                </div>

                <div className="space-y-4 pt-1">
                    {regions.map((region) => (
                        <div key={region.country} className="space-y-1.5 group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors">{region.country}</span>
                                <div className={cn(
                                    "flex items-center gap-0.5 text-[10px] font-black",
                                    region.growth.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    <ArrowUpRight className="size-2.5" />
                                    {region.growth}
                                </div>
                            </div>
                            <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${region.percentage}%` }}
                                    className={cn("h-full rounded-full transition-all duration-1000", region.percentage > 70 ? "bg-primary" : "bg-primary/70")}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 italic text-center opacity-50">
                    Top performing markets by volume
                </p>
            </PremiumCardContent>
        </PremiumCard>
    )
}

const OrdersClient = ({
    subAccountId,
    subaccount,
    orders,
    stats,
    count,
    totalPages,
    page,
    searchParams,
}: OrdersClientProps) => {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState((searchParams.query as string) || '')
    const [timeInterval, setTimeInterval] = useState('Monthly')
    const [chartType, setChartType] = useState('Line')
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([])
    const [isBulkUpdating, setIsBulkUpdating] = useState(false)
    const [teamMembers, setTeamMembers] = useState<any[]>([])

    useEffect(() => {
        const fetchTeam = async () => {
            const members = await getSubAccountTeamMembers(subAccountId)
            setTeamMembers(members)
        }
        fetchTeam()
    }, [subAccountId])

    // Calculate stats
    const totalOrders = stats.totalOrders
    const fulfilledOrders = stats.fulfilledOrders
    const returnOrders = stats.returnOrders
    const avgDeliveryTime = stats.avgDeliveryTime || 2.4
    const avgDeliveryTimeChange = stats.avgDeliveryTimeChange || 0.7

    // Use dynamic percentage changes from backend
    const totalOrdersChange = stats.totalOrdersChange
    const returnOrdersChange = stats.returnOrdersChange

    const handleSearch = (value: string) => {
        setSearchQuery(value)
        const params = new URLSearchParams(searchParams as any)
        if (value) {
            params.set('query', value)
        } else {
            params.delete('query')
        }
        params.set('page', '1')
        router.push(`?${params.toString()}`)
    }

    const toggleOrderSelection = (orderId: string) => {
        setSelectedOrderIds(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        )
    }

    const toggleAllOrders = () => {
        if (selectedOrderIds.length === orders.length) {
            setSelectedOrderIds([])
        } else {
            setSelectedOrderIds(orders.map(o => o.id))
        }
    }

    const handleBulkStatusUpdate = async (status: string) => {
        try {
            setIsBulkUpdating(true)
            await bulkUpdateOrderStatus(
                selectedOrderIds,
                status,
                subAccountId,
                `Bulk status update to ${status}`,
                'Global Logistics Command'
            )
            toast.success(`Successfully updated ${selectedOrderIds.length} orders`)
            setSelectedOrderIds([])
            router.refresh()
        } catch (error) {
            toast.error("Bulk update failed")
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`Confirm deletion of ${selectedOrderIds.length} orders?`)) return
        try {
            setIsBulkUpdating(true)
            await bulkDeleteOrders(selectedOrderIds, subAccountId)
            toast.success(`Successfully purged ${selectedOrderIds.length} records`)
            setSelectedOrderIds([])
            router.refresh()
        } catch (error) {
            toast.error("Purge failed")
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const handleBulkAssign = async (userId: string) => {
        try {
            setIsBulkUpdating(true)
            await assignOrders(selectedOrderIds, userId, subAccountId)
            toast.success(`Successfully assigned ${selectedOrderIds.length} orders`)
            setSelectedOrderIds([])
            router.refresh()
        } catch (error) {
            toast.error("Assignment failed")
        } finally {
            setIsBulkUpdating(false)
        }
    }

    const openOrderTracking = (order: Order) => {
        setSelectedOrder(order)
        setIsSheetOpen(true)
    }

    const getPaymentLogo = (method?: string) => {
        if (!method) return null
        if (method.toLowerCase().includes('visa')) {
            return (
                <div className="text-[#1434CB] font-bold text-[10px] px-2 py-0.5 bg-white border rounded">
                    VISA
                </div>
            )
        }
        if (method.toLowerCase().includes('paypal')) {
            return (
                <div className="text-[#003087] font-bold text-[10px] px-2 py-0.5 bg-white border rounded">
                    PayPal
                </div>
            )
        }
        return <span className="text-xs">{method}</span>
    }

    const getStatusBadge = (status: string) => {
        const statusColors: Record<string, string> = {
            'Pending': 'bg-orange-100 text-orange-700 border-orange-200',
            'Paid': 'bg-green-100 text-green-700 border-green-200',
            'Order Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
            'Shipped': 'bg-blue-100 text-blue-700 border-blue-200',
            'In Transit': 'bg-purple-100 text-purple-700 border-purple-200',
            'Delivered': 'bg-green-100 text-green-700 border-green-200',
            'Failed': 'bg-red-100 text-red-700 border-red-200',
            'Cancelled': 'bg-red-100 text-red-700 border-red-200',
        }
        return (
            <Badge variant="outline" className={`${statusColors[status] || 'bg-gray-100 text-gray-700'} border text-[10px] px-2 py-0`}>
                <span className="w-1 h-1 rounded-full bg-current mr-1"></span>
                {status}
            </Badge>
        )
    }

    return (
        <div className="relative flex flex-col h-full bg-background overflow-hidden">
            {/* Absolute Crystal Clear Nav Bar */}
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between py-2.5 px-8 bg-white/[0.01] dark:bg-white/[0.01] backdrop-blur-[2px] border-b border-white/20 dark:border-white/10 shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black text-foreground tracking-tight uppercase leading-none">Orders Management</h1>
                        <span className="text-[9px] font-black text-primary/80 uppercase tracking-[0.2em] mt-1 flex items-center gap-1.5 opacity-60">
                            <span className="size-1 rounded-full bg-primary animate-pulse" />
                            ID: {subAccountId.slice(0, 8)}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                        <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest leading-none mb-1">Live Update</div>
                        <div className="text-[10px] font-bold text-foreground">{new Date().toLocaleTimeString()}</div>
                    </div>
                    <Button
                        size="sm"
                        className="h-8 bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 text-[10px] font-black rounded-lg shadow-xl shadow-black/20 dark:shadow-white/10 transition-all hover:scale-[1.02] hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95 px-4 border border-white/5 dark:border-black/5"
                    >
                        <Plus className="w-3 h-3 mr-2" /> CREATE ORDER
                    </Button>
                </div>
            </div>

            {/* Main Content Stage */}
            <div className="flex-1 overflow-auto pt-16 p-4 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-xl relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:brightness-110">
                        {/* Large Decorative Box Background */}
                        <div className="absolute -right-12 -bottom-12 w-56 h-56 opacity-20 group-hover:opacity-40 transition-all duration-700 pointer-events-none transform rotate-12 z-0">
                            <img src="/box.png" alt="box" className="w-full h-full object-contain" />
                        </div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-blue-100 uppercase tracking-widest mb-1">Total Orders</span>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-3xl font-medium text-white">{totalOrders.toLocaleString()}</h2>
                                    <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                                        totalOrdersChange >= 0 ? "text-emerald-300" : "text-rose-300")}>
                                        {totalOrdersChange >= 0 ? '▲' : '▼'} {Math.abs(totalOrdersChange)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-12 mt-4 relative z-10">
                            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <polyline fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" points="0,35 20,30 40,32 60,15 80,18 100,5" />
                                <path d="M0,35 L20,30 L40,32 L60,15 L80,18 L100,5 L100,40 L0,40 Z" fill="white" fillOpacity="0.1" />
                            </svg>
                        </div>
                        <p className="text-[9px] font-bold text-blue-100 uppercase tracking-widest mt-2 italic relative z-10">Performance vs preceding week</p>
                    </Card>

                    <Card className="p-6 bg-card border border-border shadow-sm group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-rose-50/40 dark:hover:bg-rose-900/20 hover:backdrop-blur-xl hover:border-rose-200/50 dark:hover:border-rose-800/50">
                        <div className="absolute right-0 bottom-0 w-48 h-48 opacity-0 group-hover:opacity-20 transition-all duration-500 transform scale-95 group-hover:scale-100 z-0 pointer-events-none">
                            <img src="/returns.png" alt="Returns" className="w-full h-full object-contain object-right-bottom dark:invert" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Return Orders</span>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-3xl font-medium text-foreground transition-colors">{returnOrders.toLocaleString()}</h2>
                                    <div className={cn("text-[10px] font-black uppercase tracking-widest transition-colors",
                                        returnOrdersChange <= 5 ? "text-emerald-500" : "text-rose-500")}>
                                        {returnOrdersChange}% Rate
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="h-16 mt-4 relative z-10">
                            <Chart config={{ layer1: { label: "Processing", color: "#f43f5e" }, layer2: { label: "Completed", color: "#fda4af" } }} className="aspect-auto h-full w-full">
                                <BarChart data={[{ p: 15, c: 10 }, { p: 25, c: 15 }, { p: 18, c: 12 }, { p: 35, c: 20 }, { p: 28, c: 18 }, { p: 12, c: 8 }, { p: 22, c: 14 }, { p: 16, c: 10 }, { p: 32, c: 22 }, { p: 24, c: 16 }, { p: 20, c: 12 }, { p: 28, c: 18 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <Bar dataKey="p" stackId="a" fill="var(--color-layer1)" radius={[0, 0, 4, 4]} barSize={8} />
                                    <Bar dataKey="c" stackId="a" fill="var(--color-layer2)" radius={[4, 4, 0, 0]} barSize={8} />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel indicator="dot" />} cursor={false} />
                                </BarChart>
                            </Chart>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic relative z-10">Return trajectory analytics</p>
                    </Card>

                    <Card className="p-6 bg-card border border-border shadow-sm relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-blue-50/40 dark:hover:bg-blue-900/20 hover:backdrop-blur-xl hover:border-blue-200/50 dark:hover:border-blue-800/50">
                        <div className="absolute right-0 bottom-0 w-48 h-48 opacity-0 group-hover:opacity-20 transition-all duration-500 transform scale-95 group-hover:scale-100 z-0 pointer-events-none">
                            <img src="/delivery.png" alt="Delivery" className="w-full h-full object-contain object-right-bottom dark:invert" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Avg. Delivery Time</span>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-3xl font-medium text-foreground transition-colors">{avgDeliveryTime} <span className="text-sm">Days</span></h2>
                                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-colors">▼ 14.2%</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic relative z-10">Standard turnaround speed</p>
                    </Card>

                    {/* Fulfillment Rate Summary */}
                    <Card className="p-6 bg-card border border-border shadow-sm group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-emerald-50/40 dark:hover:bg-emerald-900/20 hover:backdrop-blur-xl hover:border-emerald-200/50 dark:hover:border-emerald-800/50">
                        <div className="absolute right-0 bottom-0 w-48 h-48 opacity-0 group-hover:opacity-20 transition-all duration-500 transform scale-95 group-hover:scale-100 z-0 pointer-events-none">
                            <img src="/fulfilled.png" alt="Success" className="w-full h-full object-contain object-right-bottom dark:invert" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Fulfillment Rate</span>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-3xl font-medium text-foreground">{totalOrders > 0 ? Math.round((stats.deliveredOrdersCount / totalOrders) * 100) : 0}%</h2>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2.5 mt-4 relative z-10">
                            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Delivered</span>
                                <span className="text-emerald-500">{stats.deliveredOrdersCount} Orders</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span>In Progress</span>
                                <span className="text-amber-500">{stats.pendingOrdersCount + stats.shippedOrdersCount} Orders</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalOrders > 0 ? (stats.deliveredOrdersCount / totalOrders) * 100 : 0}%` }}
                                    className="h-full bg-emerald-500 rounded-full"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6 bg-card border border-border shadow-sm relative overflow-hidden flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-black text-foreground tracking-tight">Order Analytics</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Revenue Flow & Trends</p>
                                </div>
                                <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
                                    <Button variant={chartType === 'Line' ? 'default' : 'ghost'} size="sm" className={cn("h-8 rounded-lg text-[10px] font-black uppercase tracking-widest", chartType === 'Line' && "bg-background text-foreground shadow-sm border border-border translate-y-0")} onClick={() => setChartType('Line')}>Line Chart</Button>
                                    <Button variant={chartType === 'Bar' ? 'default' : 'ghost'} size="sm" className={cn("h-8 rounded-lg text-[10px] font-black uppercase tracking-widest", chartType === 'Bar' && "bg-background text-foreground shadow-sm border border-border translate-y-0")} onClick={() => setChartType('Bar')}>Bar View</Button>
                                </div>
                            </div>
                            <div className="flex-1 min-h-0">
                                <OrderAnalysisChart orders={stats.orders} chartType={chartType} />
                            </div>
                            <div className="mt-6 pt-6 border-t border-border/50">
                                <OrdersPerformanceGauge value={84.60} label="Operational Performance" subLabel="Efficiency index vs last 24h" />
                            </div>
                        </Card>

                        <Card className="p-6 bg-card border border-border shadow-sm flex flex-col h-full overflow-hidden">
                            <div className="flex-1 min-h-[550px]">
                                <CountryDistributionMap data={stats.countryDistribution} />
                            </div>
                        </Card>
                    </div>

                    <div className="xl:col-span-1 flex flex-col gap-4">
                        <StatusCard label="Pending Orders" count={stats.pendingOrdersCount} color="amber" trend="up" percentage={12.5} icon={Clock} gradientId="pendingGradient" />
                        <StatusCard label="Shipped Orders" count={stats.shippedOrdersCount} color="blue" trend="up" percentage={8.4} icon={Truck} gradientId="shippedGradient" />
                        <StatusCard label="Canceled Orders" count={stats.canceledOrdersCount} color="rose" trend="down" percentage={3.2} icon={XCircle} gradientId="canceledGradient" />
                        <StatusCard label="Delivered Orders" count={stats.deliveredOrdersCount} color="emerald" trend="up" percentage={15.9} icon={CheckCircle2} gradientId="deliveredGradient" />
                        <RegionalInsightsCard data={stats.countryDistribution} />
                    </div>
                </div>

                <Card className="bg-card border border-border shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border bg-card/50 backdrop-blur-sm">
                        <div className="flex flex-col md:grid md:grid-cols-3 items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-black text-foreground tracking-tight">Order Inventory</h3>
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">Total Records: <span className="text-primary">{count}</span></p>
                            </div>
                            <div className="flex items-center gap-2 w-full justify-self-center md:items-center md:justify-center">
                                {selectedOrderIds.length > 0 ? (
                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg mr-2 border border-primary/20">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{selectedOrderIds.length} Selected</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedOrderIds([])}
                                                className="h-5 w-5 rounded-full hover:bg-primary/20 hover:text-primary -mr-1"
                                            >
                                                <XCircle className="size-3.5" />
                                            </Button>
                                        </div>

                                        <Button
                                            size="sm"
                                            onClick={() => handleBulkStatusUpdate('Shipped')}
                                            disabled={isBulkUpdating}
                                            className="h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-semibold uppercase px-3 shadow-sm border border-black/10 dark:border-white/10 hover:bg-slate-800 dark:hover:bg-slate-100"
                                        >
                                            <Truck className="size-3 mr-2" /> Shipped
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleBulkStatusUpdate('Delivered')}
                                            disabled={isBulkUpdating}
                                            className="h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-semibold uppercase px-3 shadow-sm border border-black/10 dark:border-white/10 hover:bg-slate-800 dark:hover:bg-slate-100"
                                        >
                                            <CheckCircle className="size-3 mr-2" /> Delivered
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="sm" className="h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-semibold uppercase px-3 shadow-sm border border-black/10 dark:border-white/10 hover:bg-slate-800 dark:hover:bg-slate-100">
                                                    <Users className="size-3 mr-2" /> Assign
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-slate-900 border-white/10 text-white rounded-xl p-1 w-56">
                                                <div className="p-2 text-[10px] font-black text-white/40 uppercase tracking-widest">Team Members</div>
                                                {teamMembers && teamMembers.length > 0 ? teamMembers.map(member => (
                                                    <DropdownMenuItem
                                                        key={member.id}
                                                        onClick={() => handleBulkAssign(member.id)}
                                                        className="rounded-lg focus:bg-white/10 cursor-pointer p-2"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black">
                                                                {member.User?.name?.charAt(0) || member.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <span className="text-xs font-bold">{member.User?.name || member.name || 'Unknown'}</span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                )) : (
                                                    <div className="p-4 text-center text-xs text-white/30 italic">No team members found</div>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button
                                            size="sm"
                                            className="h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-semibold uppercase px-3 shadow-sm border border-black/10 dark:border-white/10 hover:bg-slate-800 dark:hover:bg-slate-100"
                                        >
                                            <Download className="size-3 mr-2" /> Export
                                        </Button>

                                        <Button
                                            size="sm"
                                            onClick={handleBulkDelete}
                                            disabled={isBulkUpdating}
                                            className="h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[10px] font-semibold uppercase px-3 shadow-sm border border-black/10 dark:border-white/10 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white transition-colors"
                                        >
                                            <Trash2 className="size-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 w-full justify-center">
                                        <div className="relative flex-1 max-w-md animate-in fade-in slide-in-from-left-4 duration-300">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <Input placeholder="Search by ID or Customer..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10 h-10 w-full rounded-xl border-border bg-muted/50" />
                                        </div>
                                        <Button variant="outline" size="sm" className="h-10 rounded-xl border-border font-bold px-4 animate-in fade-in slide-in-from-left-4 duration-300"><Download className="w-4 h-4 mr-2" /> Export</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto min-h-[400px]">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-12 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                        <input
                                            type="checkbox"
                                            className="rounded border-border accent-primary cursor-pointer"
                                            checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                                            onChange={toggleAllOrders}
                                        />
                                    </TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground min-w-[180px]">Client & Order ID</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground min-w-[200px]">Product & Manifest</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Timeline</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Financials</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground text-center">Payment Status</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground text-center">Fulfillment</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Logistics Rate</TableHead>
                                    <TableHead className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground text-right overflow-hidden">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className={cn(
                                                "hover:bg-primary/5 transition-colors group cursor-pointer",
                                                selectedOrderIds.includes(order.id) && "bg-primary/5 border-l-2 border-l-primary"
                                            )}
                                            onClick={() => openOrderTracking(order)}
                                        >
                                            <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-border accent-primary cursor-pointer"
                                                    checked={selectedOrderIds.includes(order.id)}
                                                    onChange={() => toggleOrderSelection(order.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm"><User className="size-4" /></div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-black text-foreground uppercase tracking-tight leading-none">{order.customerName || 'Anonymous Client'}</span>
                                                        <span className="text-[10px] font-bold text-primary/80 flex items-center gap-1.5 opacity-70 tracking-wider">#{order.orderId?.toUpperCase() || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground overflow-hidden shadow-sm relative group/thumb">
                                                        {order.OrderItem?.[0]?.Product?.images && order.OrderItem[0].Product.images.length > 0 ? (
                                                            <img src={order.OrderItem[0].Product.images[0]} alt="product" className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" />
                                                        ) : (
                                                            <ImageIcon className="w-4 h-4 opacity-40" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/5 group-hover/thumb:bg-black/0 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-sm text-foreground truncate max-w-[150px] cursor-help" title={order.OrderItem?.[0]?.Product?.name}>{order.OrderItem?.[0]?.Product?.name || 'Bulk Purchase'}</span>
                                                        <span className="text-[9px] font-semibold text-primary uppercase">{order.OrderItem?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} Items</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-[11px] font-semibold text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="font-medium text-foreground">${order.totalPrice.toFixed(2)}</span>
                                                    {getPaymentLogo(order.paymentMethod)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{getStatusBadge(order.paymentStatus === 'Done' ? 'Paid' : 'Pending')}</TableCell>
                                            <TableCell className="text-center">{getStatusBadge(order.orderStatus === 'Delivered' ? 'Delivered' : (order.orderStatus === 'In Transit' || order.orderStatus === 'Shipped' ? 'Shipped' : 'Pending'))}</TableCell>
                                            <TableCell><div className="flex items-center gap-2">{getStatusBadge(order.orderStatus)}</div></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Edit className="w-4 h-4 text-slate-400" /></Button>
                                                    <ChevronRight className="w-4 h-4 text-slate-300" />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3 opacity-40">
                                                <Package className="size-12" />
                                                <p className="text-sm font-black uppercase tracking-[0.2em]">No matching orders found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>


            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl p-0 border-l border-white/5 overflow-hidden shadow-2xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl">
                    <div className="h-full flex flex-col">
                        <div className="p-8 pb-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/20 dark:bg-slate-900/40 backdrop-blur-md">
                            <div className="space-y-0.5">
                                <h2 className="text-xl font-semibold tracking-tight uppercase text-slate-800 dark:text-slate-100">Order Intelligence</h2>
                                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-[0.25em] uppercase">Deep-Dive Analytics & Precision Logistics</p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setIsSheetOpen(false)}
                                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full h-12 w-12 p-0 transition-all hover:rotate-90 group"
                            >
                                <RotateCcw className="w-5 h-5 rotate-45 group-hover:scale-110 transition-transform" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {selectedOrder ? <ShipmentTracker subAccountId={subAccountId} subaccount={subaccount} order={selectedOrder} /> : (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
                                    <div className="size-20 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                                        <MapPin className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                    <span className="font-medium uppercase tracking-[0.3em] text-xs text-muted-foreground">Analysing Logistics Manifest...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default OrdersClient
