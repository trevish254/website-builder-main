'use client'

import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Search,
    User as UserIcon,
    CreditCard,
    TrendingUp,
    Calendar,
    MoreHorizontal,
    ArrowUpRight,
    ChevronLeft,
    TrendingDown,
    LayoutDashboard,
    ArrowRight
} from 'lucide-react'
import { format } from 'date-fns'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '@/components/global/custom-modal'
import CustomerDetailForm from '@/components/forms/customer-detail-form'
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    AreaChart,
    Area,
    Tooltip,
    CartesianGrid,
    Cell
} from 'recharts'
import { cn } from '@/lib/utils'

type Customer = {
    id: string
    name: string
    email: string
    totalSpent: number
    orderCount: number
    lastOrderDate: string | null
    status: string
    createdAt: string
}

type Props = {
    customers: Customer[]
    subaccountId: string
    analytics: any
    subaccount: any
}

// Mini Sparkline component for table headers
const HeaderSparkline = () => {
    const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 20))
    return (
        <div className="flex items-end gap-[2px] h-4 mt-2">
            {data.map((val, i) => (
                <div
                    key={i}
                    className="w-1 bg-indigo-500/30 rounded-t-[1px]"
                    style={{ height: `${(val / 20) * 100}%` }}
                />
            ))}
        </div>
    )
}

const CustomersClient = ({ customers, subaccountId, analytics, subaccount }: Props) => {
    const { setOpen } = useModal()
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState('Customers')

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Data matching the screenshot's pattern (yellow bars followed by dim bars)
    const viewsData = [
        { name: 'W1', value: 16000, dim: false },
        { name: 'W2', value: 9000, dim: false },
        { name: 'W3', value: 2000, dim: false },
        { name: 'W4', value: 4200, dim: false },
        { name: 'W5', value: 3000, dim: false },
        { name: 'W6', value: 1800, dim: false },
        { name: 'W7', value: 9000, dim: false },
        { name: 'W8', value: 2000, dim: false },
        { name: 'W9', value: 2800, dim: false },
        { name: 'W10', value: 6200, dim: false },
        { name: 'W11', value: 4200, dim: false },
        { name: 'W12', value: 13000, dim: false },
        { name: 'W13', value: 15000, dim: false },
        { name: 'W14', value: 6800, dim: false },
        { name: 'W15', value: 6800, dim: false },
        { name: 'W16', value: 13000, dim: false },
        { name: 'W17', value: 6800, dim: false },
        // Future/Dimmed data as seen in screenshot (approx 7 dim bars)
        { name: 'W18', value: 3500, dim: true },
        { name: 'W19', value: 3500, dim: true },
        { name: 'W20', value: 8500, dim: true },
        { name: 'W21', value: 15000, dim: true },
        { name: 'W22', value: 6800, dim: true },
        { name: 'W23', value: 3500, dim: true },
        { name: 'W24', value: 3500, dim: true },
    ]

    // Order trend data for purple area chart
    const orderTrend = analytics?.revenueByMonth?.map((item: any) => ({
        name: item.name,
        value: Math.floor(item.value / 100) || Math.floor(Math.random() * 50)
    })) || []

    return (
        <div className="flex flex-col gap-8 p-8 bg-background min-h-screen text-foreground transition-all duration-300">
            {/* Breadcrumbs & Top Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <ChevronLeft size={16} className="cursor-pointer hover:text-foreground transition-colors mr-2" />
                    <span className="cursor-pointer hover:text-foreground transition-colors">Customers</span>
                    <span className="mx-1">/</span>
                    <span className="text-foreground">{subaccount?.name || 'Everyway'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-xl px-6 h-10 font-bold border-2 transition-all">
                        Compare
                    </Button>
                    <Button className="bg-[#E9FF70] text-black hover:bg-[#D4FF00] rounded-xl px-6 h-10 font-bold shadow-[0_8px_20px_rgba(233,255,112,0.2)] hover:scale-105 transition-all">
                        Analytics
                    </Button>
                </div>
            </div>

            {/* Subaccount Header */}
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 dark:from-indigo-500 dark:to-purple-600 rounded-2xl flex items-center justify-center p-3.5 shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)]">
                    <LayoutDashboard className="w-full h-full text-indigo-600 dark:text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black tracking-tight leading-none capitalize">{subaccount?.name || 'Everyway'}</h1>
                    <p className="text-muted-foreground text-sm mt-2 font-bold flex items-center gap-2">
                        {subaccount?.address}, {subaccount?.city} <span className="w-1 h-1 rounded-full bg-border" /> United States
                    </p>
                </div>
            </div>

            {/* Upper Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Views Bar Chart (Yellow) - REFINED REDESIGN */}
                <div className="lg:col-span-2 bg-card rounded-[3rem] p-10 border border-border shadow-2xl relative overflow-hidden transition-all group hover:shadow-indigo-500/5">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-sm font-bold tracking-tight opacity-70">Views per Week</span>
                            <h2 className="text-5xl font-black tabular-nums tracking-tighter">17,583</h2>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground -mt-2">
                            <MoreHorizontal size={24} />
                        </Button>
                    </div>

                    <div className="h-[240px] w-full mt-8 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={viewsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid
                                    vertical={false}
                                    stroke="currentColor"
                                    className="text-border"
                                    strokeDasharray="0"
                                    opacity={0.15}
                                />
                                <XAxis dataKey="name" hide />
                                <YAxis
                                    ticks={[0, 5000, 10000, 15000, 20000]}
                                    tickFormatter={(value) => value === 0 ? 'Ok' : `${value / 1000}k`}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 13, fontWeight: 700, fill: 'currentColor' }}
                                    className="text-muted-foreground/50"
                                    width={50}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-popover/90 dark:bg-black/80 border border-border p-3.5 rounded-2xl shadow-3xl backdrop-blur-xl ring-1 ring-white/10">
                                                    <p className="text-[11px] font-black uppercase text-muted-foreground/70 mb-1">{payload[0].payload.name}</p>
                                                    <p className="text-xl font-black text-[#E9FF70]">{payload[0].value.toLocaleString()}</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Bar dataKey="value" radius={[5, 5, 0, 0]} barSize={22}>
                                    {viewsData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.dim ? (
                                                // Using a dim color that works in both modes
                                                'rgba(150, 150, 150, 0.15)'
                                            ) : '#E9FF70'}
                                            className="transition-all duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Total Orders Area Chart (Purple) */}
                <div className="bg-card rounded-[3rem] p-10 border border-border shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-purple-500/5">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-muted-foreground text-sm font-bold tracking-tight opacity-70">Total Orders</span>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground -mt-2">
                                <MoreHorizontal size={24} />
                            </Button>
                        </div>
                        <h2 className="text-5xl font-black tabular-nums tracking-tighter">3,234</h2>
                    </div>

                    <div className="h-[150px] w-full -mx-4 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={orderTrend}>
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#818CF8"
                                    strokeWidth={5}
                                    fillOpacity={1}
                                    fill="url(#purpleGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase text-muted-foreground/50 tracking-widest px-2">
                        <span>Aug 15</span>
                        <span>Sep 16</span>
                    </div>
                </div>
            </div>

            {/* Tabs & Table Section */}
            <div className="mt-12 flex flex-col gap-8">
                {/* Tabs */}
                <div className="flex items-center gap-10 border-b border-border">
                    {['Customers', 'Views', 'Orders'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-6 text-sm font-black uppercase tracking-[0.2em] transition-all relative",
                                activeTab === tab
                                    ? "text-[#E9FF70]"
                                    : "text-muted-foreground/60 hover:text-foreground"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#E9FF70] rounded-t-full shadow-[0_-4px_15px_rgba(233,255,112,0.6)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Table Container */}
                <div className="bg-card rounded-[3rem] border border-border overflow-hidden shadow-3xl transition-all">
                    <Table>
                        <TableHeader className="bg-muted/30 border-b border-border/50">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="py-8 px-10 text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>Customer ID</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold italic">integer</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>First name</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold">55 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>Last name</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold">59 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>Company</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold">44 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>Address</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold">47 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>City</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold">22 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-muted-foreground uppercase text-[11px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col gap-1">
                                        <span>Country</span>
                                        <span className="text-[10px] lowercase text-muted-foreground/40 font-bold">8 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right py-8 px-10 h-auto" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 rounded-full bg-muted/50">
                                                <UserIcon className="h-8 w-8 text-muted-foreground/30" />
                                            </div>
                                            <p className="text-muted-foreground font-bold tracking-tight">No customers match your search criteria.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCustomers.map((customer, i) => {
                                    const nameParts = customer.name.split(' ')
                                    const firstName = nameParts[0]
                                    const lastName = nameParts.slice(1).join(' ') || '-'

                                    return (
                                        <TableRow
                                            key={customer.id}
                                            className="border-border/50 hover:bg-muted/40 transition-all group cursor-pointer"
                                            onClick={() => {
                                                setOpen(
                                                    <CustomModal
                                                        title="Customer Profile"
                                                        subheading="View and edit customer details, contact information, and account status."
                                                        className="max-w-2xl"
                                                    >
                                                        <CustomerDetailForm
                                                            subaccountId={subaccountId}
                                                            customer={customer}
                                                        />
                                                    </CustomModal>
                                                )
                                            }}
                                        >
                                            <TableCell className="py-8 px-10 font-mono text-xs text-muted-foreground/60 font-bold">
                                                <span className="text-foreground font-black mr-3">{i + 1}</span>
                                                {customer.id.startsWith('temp-')
                                                    ? `CST-${customer.id.substring(5, 12).toUpperCase()}`
                                                    : `CST-${customer.id.substring(0, 7).toUpperCase()}`}
                                            </TableCell>
                                            <TableCell className="font-black text-sm text-foreground/90">
                                                {firstName}
                                            </TableCell>
                                            <TableCell className="font-black text-sm text-foreground/90">
                                                {lastName}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground font-bold">
                                                {customer.orderCount > 0 ? (customer.email.split('@')[1].split('.')[0].toUpperCase()) : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground font-medium whitespace-nowrap">
                                                {subaccount?.address || '7529 E. Pecan St.'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground font-medium">
                                                {subaccount?.city || 'Naperville'}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground font-medium">
                                                United States
                                            </TableCell>
                                            <TableCell className="text-right py-8 px-10">
                                                <Button variant="ghost" size="icon" className="text-muted-foreground/40 hover:text-foreground opacity-50 group-hover:opacity-100 transition-all hover:bg-background shadow-sm rounded-lg">
                                                    <MoreHorizontal size={20} />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default CustomersClient
