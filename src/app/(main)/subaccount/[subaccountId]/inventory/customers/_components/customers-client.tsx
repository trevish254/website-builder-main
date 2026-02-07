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
    CartesianGrid
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
                    className="w-1 bg-indigo-500/40 rounded-t-[1px]"
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

    // Mock views data for the yellow bar chart
    const viewsData = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
        { name: 'Jul', value: 3490 },
        { name: 'Aug', value: 4000 },
        { name: 'Sep', value: 3000 },
        { name: 'Oct', value: 2000 },
        { name: 'Nov', value: 2780 },
        { name: 'Dec', value: 1890 },
    ]

    // Order trend data for purple area chart
    const orderTrend = analytics?.revenueByMonth?.map((item: any) => ({
        name: item.name,
        value: Math.floor(item.value / 100) || Math.floor(Math.random() * 50)
    })) || []

    return (
        <div className="flex flex-col gap-8 p-8 bg-[#0F0F12] min-h-screen text-[#F8F9FA]">
            {/* Breadcrumbs & Top Toolbar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <ChevronLeft size={14} className="cursor-pointer hover:text-white transition-colors" />
                    <span className="cursor-pointer hover:text-white transition-colors">Customers</span>
                    <span>/</span>
                    <span className="text-slate-300 font-semibold">{subaccount?.name || 'Everyway'}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-transparent border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl px-6 h-10 font-bold border-2">
                        Compare
                    </Button>
                    <Button className="bg-[#E9FF70] text-black hover:bg-[#D4FF00] rounded-xl px-6 h-10 font-bold">
                        Analytics
                    </Button>
                </div>
            </div>

            {/* Subaccount Header */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center p-3 shadow-lg shadow-indigo-500/10">
                    <LayoutDashboard className="w-full h-full text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight leading-none capitalize">{subaccount?.name || 'Everyway'}</h1>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">
                        {subaccount?.address}, {subaccount?.city} · United States
                    </p>
                </div>
            </div>

            {/* Upper Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
                {/* Views Bar Chart (Yellow) */}
                <div className="lg:col-span-2 bg-[#1A1A1E] rounded-[2.5rem] p-8 border border-white/[0.04] shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Views per Week</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h2 className="text-4xl font-black tabular-nums tracking-tighter">17,583</h2>
                                <span className="text-[#E9FF70] text-sm font-bold flex items-center gap-0.5">
                                    <TrendingUp size={14} strokeWidth={3} /> +12.5%
                                </span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-white">
                            <MoreHorizontal size={20} />
                        </Button>
                    </div>
                    <div className="h-[180px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={viewsData}>
                                <Bar
                                    dataKey="value"
                                    fill="#E9FF70"
                                    radius={[4, 4, 0, 0]}
                                    barSize={20}
                                />
                                <XAxis
                                    dataKey="name"
                                    hide
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(233, 255, 112, 0.05)' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-black/90 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{payload[0].payload.name}</p>
                                                    <p className="text-lg font-black text-[#E9FF70]">{payload[0].value.toLocaleString()} views</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Horizontal lines simulated */}
                    <div className="absolute inset-x-8 bottom-[108px] border-b border-white/[0.03]" />
                    <div className="absolute inset-x-8 bottom-[78px] border-b border-white/[0.03]" />
                    <div className="absolute inset-x-8 bottom-[48px] border-b border-white/[0.03]" />
                </div>

                {/* Total Orders Area Chart (Purple) */}
                <div className="bg-[#1A1A1E] rounded-[2.5rem] p-8 border border-white/[0.04] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Orders</span>
                            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-white">
                                <MoreHorizontal size={20} />
                            </Button>
                        </div>
                        <h2 className="text-4xl font-black tabular-nums tracking-tighter">3,234</h2>
                    </div>

                    <div className="h-[140px] w-full -mx-2 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={orderTrend}>
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#818CF8"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#purpleGradient)"
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-black/90 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                                    <p className="text-sm font-black text-white">{payload[0].value.toLocaleString()} orders</p>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        <span>Aug 15</span>
                        <span>Sep 16</span>
                    </div>
                </div>
            </div>

            {/* Tabs & Table Section */}
            <div className="mt-8 flex flex-col gap-6">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-white/[0.03]">
                    {['Customers', 'Views', 'Orders'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
                                activeTab === tab
                                    ? "text-[#E9FF70]"
                                    : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 inset-x-0 h-1 bg-[#E9FF70] rounded-t-full shadow-[0_-4px_12px_rgba(233,255,112,0.4)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-[#1A1A1E]/40 rounded-[2.5rem] border border-white/[0.04] overflow-hidden backdrop-blur-3xl shadow-3xl">
                    <Table>
                        <TableHeader className="border-b border-white/[0.03]">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="py-6 px-8 text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>Customer ID</span>
                                        <span className="text-[9px] font-medium italic mt-0.5 lowercase">integer</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>First name</span>
                                        <span className="text-[9px] font-medium lowercase mt-0.5">55 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>Last name</span>
                                        <span className="text-[9px] font-medium lowercase mt-0.5">59 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>Company</span>
                                        <span className="text-[9px] font-medium lowercase mt-0.5">44 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>Address</span>
                                        <span className="text-[9px] font-medium lowercase mt-0.5">47 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>City</span>
                                        <span className="text-[9px] font-medium lowercase mt-0.5">22 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-slate-500 uppercase text-[10px] font-black tracking-widest h-auto">
                                    <div className="flex flex-col">
                                        <span>Country</span>
                                        <span className="text-[9px] font-medium lowercase mt-0.5">8 rows</span>
                                        <HeaderSparkline />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right py-6 px-8 h-auto" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.map((customer, i) => {
                                const nameParts = customer.name.split(' ')
                                const firstName = nameParts[0]
                                const lastName = nameParts.slice(1).join(' ') || '-'

                                return (
                                    <TableRow
                                        key={customer.id}
                                        className="border-white/[0.02] hover:bg-white/[0.03] transition-colors group cursor-pointer"
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
                                        <TableCell className="py-6 px-8 font-mono text-xs text-slate-500">
                                            <span className="text-slate-300 mr-2">{i + 1}</span>
                                            {customer.id.includes('temp-') ? customer.id.slice(0, 15) + '...' : customer.id.slice(0, 15)}
                                        </TableCell>
                                        <TableCell className="font-bold text-sm text-slate-300">
                                            {firstName}
                                        </TableCell>
                                        <TableCell className="font-bold text-sm text-slate-300 text-left">
                                            {lastName}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-400 font-medium">
                                            {customer.orderCount > 0 ? (customer.email.split('@')[1].split('.')[0].toUpperCase()) : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-400 font-medium whitespace-nowrap">
                                            {subaccount?.address || '7529 E. Pecan St.'}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-400 font-medium">
                                            {subaccount?.city || 'Naperville'}
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-400 font-medium">
                                            United States
                                        </TableCell>
                                        <TableCell className="text-right py-6 px-8">
                                            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-white group-hover:bg-white/5">
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default CustomersClient
