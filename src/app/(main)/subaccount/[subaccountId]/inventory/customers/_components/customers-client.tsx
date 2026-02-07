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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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
    ExternalLink,
    Users
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

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
}

const CustomersClient = ({ customers, subaccountId }: Props) => {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const activeCustomers = customers.filter(c => c.orderCount > 0).length
    const avgLTV = customers.length > 0 ? totalRevenue / customers.length : 0

    return (
        <div className="flex flex-col gap-8 p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Customer Details</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and analyze your customer base and their purchasing behavior.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search customers..."
                            className="pl-10 bg-muted/20 border-border/50 focus-visible:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button className="font-bold flex gap-2">
                        <Users size={18} />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-b-2 border-b-primary">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <UserIcon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{customers.length}</div>
                        <p className="text-xs text-muted-foreground">+2 since yesterday</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-b-2 border-b-emerald-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">Lifetime customer value</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-b-2 border-b-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Active Buyers</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCustomers}</div>
                        <p className="text-xs text-muted-foreground">{((activeCustomers / customers.length) * 100).toFixed(1)}% of total</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-b-2 border-b-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(avgLTV)}
                        </div>
                        <p className="text-xs text-muted-foreground">Per unique customer</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30">
                            <TableHead className="w-[300px] py-4">Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>LTV</TableHead>
                            <TableHead>Last Interaction</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No customers found. Try a different search term.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-border shadow-sm">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {customer.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base">{customer.name}</span>
                                                <span className="text-xs text-muted-foreground">{customer.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {customer.totalSpent > 0 ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                                                Paying
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-muted/50">
                                                Lead
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <span>{customer.orderCount}</span>
                                            <span className="text-xs text-muted-foreground lowercase">Orders</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.totalSpent)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {customer.lastOrderDate ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground">
                                                        {format(new Date(customer.lastOrderDate), 'MMM dd, yyyy')}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Last Purchase</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="text-muted-foreground">
                                                        {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">Registered</span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <Link href={`/subaccount/${subaccountId}/inventory/customers/${customer.id}`}>
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 font-bold hover:bg-primary/10 hover:text-primary">
                                                    View Details <ArrowUpRight size={14} />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default CustomersClient
