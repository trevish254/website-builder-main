'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    MapPin,
    Navigation,
    CheckCircle2,
    Package,
    Truck,
    Home,
    Clock,
    AlertCircle,
    User,
    Mail,
    CreditCard,
    DollarSign,
    Calendar,
    ChevronRight,
    Download,
    FileText,
    Receipt,
    Printer,
    ExternalLink,
    Image as ImageIcon
} from 'lucide-react'
import { getOrderHistory, updateOrderStatus } from '@/lib/queries'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import OrderInvoice from './order-invoice'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
        unitPrice: number
        totalPrice: number
        Product?: {
            name: string
            images?: string[]
        }
    }>
}

interface ShipmentTrackerProps {
    subAccountId: string
    subaccount: any
    order: Order
}

const ShipmentTracker = ({ subAccountId, subaccount, order }: ShipmentTrackerProps) => {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'logistics' | 'manifest' | 'financials'>('logistics')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchHistory = async () => {
            if (!order.id) return
            setLoading(true)
            const data = await getOrderHistory(order.id)
            setHistory(data)
            setLoading(false)
        }
        fetchHistory()
    }, [order.id])

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return Home
            case 'In Transit':
            case 'Shipped': return Truck
            case 'In Sorting Centre': return Package
            case 'Order Confirmed': return CheckCircle2
            case 'Pending': return Clock
            case 'Cancelled':
            case 'Failed': return AlertCircle
            default: return Package
        }
    }

    const getBadgeStyle = (status: string) => {
        const colors: Record<string, string> = {
            'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'Delivered': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            'In Transit': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'Shipped': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            'Order Confirmed': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
            'Cancelled': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
            'Paid': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        }
        return colors[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }

    const handleGenerateInvoice = async () => {
        try {
            setIsGenerating(true)
            const html2pdf = (await import('html2pdf.js')).default
            const element = document.getElementById('order-invoice-capture')

            if (!element) {
                toast.error("Invoice engine failed to initialize")
                return
            }

            const opt = {
                margin: 0,
                filename: `Invoice_${order.orderId.toUpperCase()}.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    letterRendering: true
                },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            }

            await html2pdf().set(opt).from(element).save()
            toast.success("Invoice generated successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate invoice")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setIsUpdating(true)
            const description = newStatus === 'Shipped' || newStatus === 'In Transit'
                ? 'Order has been dispatched from our warehouse'
                : 'Order has been successfully delivered to the customer'

            const res = await updateOrderStatus(
                order.id,
                newStatus,
                description,
                'Nairobi Logistics Hub'
            )

            if (res) {
                toast.success(`Order marked as ${newStatus}`)
                // Refresh history
                const data = await getOrderHistory(order.id)
                setHistory(data)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to update status")
        } finally {
            setIsUpdating(false)
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent selection:bg-primary/20">
            {/* Header / Summary Section */}
            <div className="p-6 pb-6 rounded-b-[2rem] border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl relative overflow-hidden">
                {/* Decorative Blur Accents */}
                <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -left-24 size-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between mb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <span className="text-[9px] font-semibold text-primary uppercase tracking-[0.2em]">Transaction ID</span>
                            </div>
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono tracking-wider">#{order.orderId.toUpperCase()}</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight leading-none italic">
                                {order.customerName || 'Global Order'}
                            </h3>
                            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400 pt-2 uppercase tracking-[0.1em]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-3.5 opacity-60" />
                                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="size-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                                <div className="flex items-center gap-2">
                                    <Mail className="size-3.5 opacity-60" />
                                    {order.customerEmail || 'unlisted@client.io'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-5">
                        <div className={cn("px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.15em] border backdrop-blur-md shadow-lg shadow-black/5", getBadgeStyle(order.orderStatus))}>
                            {order.orderStatus}
                        </div>
                        <div className="text-4xl font-light text-slate-900 dark:text-white tracking-tighter flex items-start gap-1">
                            <span className="text-lg font-medium opacity-40 mt-1">$</span>
                            {order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                {/* Glass Tabs */}
                {/* Glass Tabs */}
                <div className="relative z-10 flex items-center justify-center p-1">
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 w-full max-w-sm mx-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('logistics')}
                            className={cn("flex-1 h-9 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                                activeTab === 'logistics'
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-black/5 scale-[1.02] border border-black/5 dark:border-white/5"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5")}
                        >
                            Logistics
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('manifest')}
                            className={cn("flex-1 h-9 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                                activeTab === 'manifest'
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-black/5 scale-[1.02] border border-black/5 dark:border-white/5"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5")}
                        >
                            Manifest
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('financials')}
                            className={cn("flex-1 h-9 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300",
                                activeTab === 'financials'
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-black/5 scale-[1.02] border border-black/5 dark:border-white/5"
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5")}
                        >
                            Financials
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32">
                <AnimatePresence mode="wait">
                    {activeTab === 'logistics' && (
                        <motion.div
                            key="logistics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Map Visualization */}
                            <div className="relative h-56 bg-muted/50 rounded-3xl overflow-hidden border border-border/50 group shadow-inner">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0,0/800x600?access_token=mock')] bg-cover opacity-10 dark:opacity-5 grayscale" />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

                                {/* Pulse Effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping scale-[3]" />
                                        <div className="relative size-12 bg-slate-900 dark:bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-background shadow-2xl">
                                            <Truck className="size-6 text-background dark:text-slate-900" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Active Waypoint</span>
                                        <span className="text-xs font-bold text-foreground flex items-center gap-2">
                                            <MapPin className="size-3 text-primary" /> Central Distribution Hub
                                        </span>
                                    </div>
                                    <Badge variant="outline" className="bg-background/80 backdrop-blur-md border border-border/50 text-[10px] font-black uppercase p-2 px-3">
                                        Live Tracking Active
                                    </Badge>
                                </div>
                            </div>

                            {/* Logistics Action Center */}
                            {/* Logistics Action Center */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={() => handleStatusUpdate('Shipped')}
                                    disabled={isUpdating || order.orderStatus === 'Shipped' || order.orderStatus === 'In Transit' || order.orderStatus === 'Delivered'}
                                    className="h-16 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 rounded-2xl flex flex-col items-center justify-center gap-1.5 group transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl border border-white/10 dark:border-black/5 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Truck className="size-4 group-hover:translate-x-1 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Mark Shipped</span>
                                </Button>
                                <Button
                                    onClick={() => handleStatusUpdate('Delivered')}
                                    disabled={isUpdating || order.orderStatus === 'Delivered'}
                                    className="h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex flex-col items-center justify-center gap-1.5 group transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl shadow-emerald-500/20 border border-white/10 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CheckCircle2 className="size-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Mark Delivered</span>
                                </Button>
                            </div>

                            {/* Logistics History */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Clock className="size-3" /> Journey History
                                    </h4>
                                    <span className="text-[10px] font-bold text-primary italic">Updates every 15 min</span>
                                </div>

                                <div className="space-y-12 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[1.5px] before:bg-slate-200 dark:before:bg-slate-800 before:rounded-full">
                                    {loading ? (
                                        [1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-8 animate-pulse">
                                                <div className="size-14 bg-muted rounded-2xl shrink-0 border border-border/50" />
                                                <div className="flex-1 space-y-4 py-2">
                                                    <div className="h-4 bg-muted rounded-lg w-1/4" />
                                                    <div className="h-2.5 bg-muted rounded-full w-1/2 opacity-50" />
                                                </div>
                                            </div>
                                        ))
                                    ) : history.length > 0 ? (
                                        history.map((item, index) => {
                                            const Icon = getStatusIcon(item.status)
                                            const isLatest = index === 0

                                            return (
                                                <div key={item.id} className="flex gap-8 group relative z-10">
                                                    <div className={cn(
                                                        "size-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 shadow-xl backdrop-blur-xl",
                                                        isLatest
                                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent scale-110 shadow-slate-900/20 dark:shadow-white/10"
                                                            : "bg-white/50 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-black/5 dark:border-white/5 group-hover:border-primary/40 group-hover:text-primary group-hover:bg-white/80 dark:group-hover:bg-white/10"
                                                    )}>
                                                        <Icon className="size-6" />
                                                    </div>

                                                    <div className="flex-1 pb-2">
                                                        <div className="flex items-start justify-between">
                                                            <div className="space-y-1">
                                                                <h5 className={cn("text-base font-semibold tracking-tight transition-colors", isLatest ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>
                                                                    {item.status}
                                                                </h5>
                                                                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                                                    {item.location || 'Local Terminal'}
                                                                </p>
                                                                {item.description && (
                                                                    <div className="mt-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 group-hover:border-primary/20 transition-all duration-500">
                                                                        <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed font-serif">
                                                                            "{item.description}"
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-right shrink-0 pt-1">
                                                                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                                <div className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 opacity-60">
                                                                    {new Date(item.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-black/5 dark:border-white/10">
                                            <Package className="size-14 mx-auto mb-5 text-slate-300 dark:text-slate-700" />
                                            <p className="text-[11px] font-semibold tracking-[0.3em] text-slate-400 dark:text-slate-600 uppercase">Transit Logs Empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'manifest' && (
                        <motion.div
                            key="manifest"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                <Package className="size-3" /> Item Distribution
                            </h4>
                            <div className="grid gap-6">
                                {order.OrderItem && order.OrderItem.length > 0 ? (
                                    order.OrderItem.map((item) => (
                                        <div key={item.id} className="group p-6 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[2rem] hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex items-center gap-8">
                                            <div className="size-24 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 overflow-hidden shrink-0 relative flex items-center justify-center p-2">
                                                {item.Product?.images?.[0] ? (
                                                    <img src={item.Product.images[0]} alt={item.Product.name} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <ImageIcon className="size-10 text-slate-300 dark:text-slate-700" />
                                                )}
                                                <div className="absolute -top-3 -right-3 size-10 bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center rounded-2xl text-[11px] font-semibold border-4 border-background shadow-lg">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <h5 className="font-semibold text-slate-800 dark:text-slate-100 text-lg line-clamp-1 italic tracking-tight">{item.Product?.name || 'Exclusive Asset Item'}</h5>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5">
                                                        <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">ID-8271</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                        <div className="size-1 rounded-full bg-current animate-pulse" />
                                                        <span className="text-[9px] font-semibold uppercase tracking-[0.1em]">Allocated</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-light text-slate-900 dark:text-white tabular-nums">${item.totalPrice.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-tight mt-1 underline decoration-dotted underline-offset-4">Unit: ${item.unitPrice.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-black/5 dark:border-white/10 opacity-60">
                                        <Package className="size-14 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                                        <p className="text-[11px] font-semibold tracking-[0.3em] uppercase">Inventory Link Missing</p>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Load Analysis */}
                            <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] space-y-6 shadow-2xl relative overflow-hidden group/load">
                                <div className="absolute top-0 right-0 size-32 bg-primary/20 blur-[50px] opacity-0 group-hover/load:opacity-100 transition-opacity duration-700" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="size-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white">Load Analysis</span>
                                    </div>
                                    <span className="text-sm font-light text-white opacity-60 tabular-nums">Current Payload: 4.2 kg</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
                                    <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-blue-500 to-primary" />
                                </div>
                                <div className="grid grid-cols-2 gap-8 relative z-10">
                                    <div className="space-y-1.5 text-left">
                                        <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em]">Cubic Volume</span>
                                        <p className="text-xs font-medium text-white">400 x 300 x 200 mm</p>
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.2em]">Package Architecture</span>
                                        <p className="text-xs font-medium text-white italic">Premium Eco-Seal</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'financials' && (
                        <motion.div
                            key="financials"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Detailed Bill Section */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Receipt className="size-3" /> Financial Audit
                                </h4>

                                <div className="space-y-10">
                                    <Card className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                        <div className="absolute top-0 right-0 size-48 bg-emerald-500/5 blur-[80px] -z-10" />
                                        <div className="p-10 space-y-8">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Order Subtotal</span>
                                                    <span className="text-lg font-light text-slate-900 dark:text-white">${(order.totalPrice * 0.9).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Logistics Premium</span>
                                                    <span className="text-emerald-500 text-[10px] font-semibold uppercase tracking-widest">Complimentary</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Estimated Tax</span>
                                                    <span className="text-lg font-light text-slate-900 dark:text-white">${(order.totalPrice * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-black/5 dark:border-white/5">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1 text-left">
                                                        <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.25em]">Grand Total</span>
                                                        <p className="text-5xl font-light text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-transparent shadow-lg inline-block",
                                                            order.paymentStatus === 'Done' ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-amber-500 text-white shadow-amber-500/20")}>
                                                            {order.paymentStatus === 'Done' ? 'Fully Settled' : 'Payment Imminent'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900 dark:bg-slate-800 p-8 flex items-center justify-between border-t border-white/5">
                                            <div className="flex items-center gap-6">
                                                <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                                                    <CreditCard className="size-7 text-white opacity-80" />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40">Secure Settlement</span>
                                                    <p className="text-sm font-medium text-white tracking-tight">**** 4242 · {order.paymentMethod || 'PRIVATE TOKEN'}</p>
                                                </div>
                                            </div>
                                            <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                                <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Button variant="ghost" className="h-20 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-black/5 dark:border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center justify-center gap-2 group shadow-xl shadow-black/5">
                                            <Printer className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Manifest Print</span>
                                        </Button>
                                        <Button variant="ghost" className="h-20 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-black/5 dark:border-white/10 hover:border-primary/40 transition-all duration-500 flex flex-col items-center justify-center gap-2 group shadow-xl shadow-black/5">
                                            <ExternalLink className="size-5 text-slate-400 group-hover:text-primary transition-colors" />
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Ledger Link</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Risk Assessment */}
                                <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] flex items-center gap-6 group hover:bg-rose-500/10 transition-colors duration-500">
                                    <div className="size-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 shadow-lg shadow-rose-500/5">
                                        <AlertCircle className="size-7 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="text-[10px] font-semibold text-rose-500 uppercase tracking-[0.25em]">Security Protocol</h5>
                                        <p className="text-xs text-rose-500/70 font-medium leading-relaxed italic">
                                            Transaction scoring at 0.02% (Extremely Low Risk). Verified by SecureFlow AI Multi-Factor Analysis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Global Actions Footer */}
            <div className="absolute bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
                <div className="grid grid-cols-2 gap-4 pointer-events-auto">
                    <Button
                        onClick={handleGenerateInvoice}
                        disabled={isGenerating}
                        className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-semibold uppercase text-[11px] tracking-[0.25em] gap-3 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-2xl shadow-black/20 group/invoice"
                    >
                        {isGenerating ? (
                            <div className="flex items-center gap-3">
                                <div className="size-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                Process...
                            </div>
                        ) : (
                            <><FileText className="size-4.5 group-hover/invoice:rotate-12 transition-transform" /> Sign Invoice</>
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full h-14 bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[1.5rem] font-semibold uppercase text-[11px] tracking-[0.25em] gap-3 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 group/export"
                    >
                        <Download className="size-4.5 group-hover/export:-translate-y-1 transition-transform" /> Archive Data
                    </Button>
                </div>
            </div>

            {/* Hidden Invoice Capture Area */}
            <div className="fixed left-[-9999px] top-0">
                <div id="order-invoice-capture">
                    <OrderInvoice order={order} subaccount={subaccount} />
                </div>
            </div>
        </div >
    )
}

export default ShipmentTracker
