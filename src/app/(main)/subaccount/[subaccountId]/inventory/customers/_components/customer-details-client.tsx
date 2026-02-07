'use client'

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    ChevronLeft,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    ShoppingBag,
    Clock,
    ExternalLink,
    MessageSquare,
    Package,
    ArrowRight,
    Plus
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

type Props = {
    customer: any
    subaccountId: string
}

const CustomerDetailsClient = ({ customer, subaccountId }: Props) => {
    return (
        <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
            {/* Back Button & Actions */}
            <div className="flex justify-between items-center">
                <Link href={`/subaccount/${subaccountId}/inventory/customers`}>
                    <Button variant="ghost" className="flex gap-2 font-bold px-0 hover:bg-transparent hover:text-primary">
                        <ChevronLeft size={18} />
                        Back to Customers
                    </Button>
                </Link>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-border/50">Edit Profile</Button>
                    <Button className="font-bold flex gap-2">
                        <Mail size={16} /> Send Email
                    </Button>
                </div>
            </div>

            {/* Profile Header */}
            <div className="flex flex-col lg:flex-row gap-8">
                <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border-b border-border/20" />
                    <CardContent className="relative pt-0 pb-8 px-8">
                        <div className="flex flex-col sm:flex-row items-end gap-6 -mt-12 mb-6">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                                    {customer.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col mb-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-extrabold tracking-tight">{customer.name}</h1>
                                    {customer.stats.totalSpent > 0 ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">VIP Customer</Badge>
                                    ) : (
                                        <Badge variant="secondary">Registered Lead</Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground font-medium">{customer.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-border/50">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total Orders</p>
                                    <p className="text-xl font-extrabold">{customer.stats.orderCount}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Lifetime Spend</p>
                                    <p className="text-xl font-extrabold">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(customer.stats.totalSpent)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Joined Date</p>
                                    <p className="text-xl font-extrabold">{format(new Date(customer.createdAt), 'MMM yyyy')}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order History */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-extrabold tracking-tight flex gap-3 items-center">
                            <Package className="text-primary" /> Order History
                        </h2>
                        <Link href={`/subaccount/${subaccountId}/orders?query=${customer.email}`}>
                            <Button variant="link" className="font-bold flex gap-2">
                                View all in Orders <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead className="font-bold">Order ID</TableHead>
                                    <TableHead className="font-bold">Date</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customer.orders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-medium">
                                            No orders placed by this customer yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    customer.orders.map((order: any) => (
                                        <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-bold">{order.orderId}</TableCell>
                                            <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                                            <TableCell>
                                                <Badge variant={order.paymentStatus === 'Paid' ? 'default' : 'secondary'} className={order.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}>
                                                    {order.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-primary">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalPrice)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {/* Support & Interactions Sidebar */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-extrabold tracking-tight flex gap-3 items-center px-2">
                        <MessageSquare className="text-primary" /> Interactions
                    </h2>

                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Recent Tickets</CardTitle>
                            <CardDescription>Support and pipeline activity</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            {customer.tickets.length === 0 ? (
                                <p className="text-sm text-muted-foreground p-4 bg-muted/20 rounded-xl text-center font-medium border border-dashed border-border/50">
                                    No support tickets found.
                                </p>
                            ) : (
                                customer.tickets.map((ticket: any) => (
                                    <div key={ticket.id} className="flex flex-col gap-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-sm">{ticket.name}</p>
                                            <Badge variant="outline" className="text-[10px] py-0">{ticket.Lane?.Pipeline?.name}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold tracking-tight">
                                            <Clock size={10} /> {format(new Date(ticket.createdAt), 'MMM dd')}
                                            <span>•</span>
                                            <span className="text-primary">{ticket.Lane?.name}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <Button variant="outline" className="w-full font-bold mt-2 flex gap-2">
                                <Plus size={16} /> Create Ticket
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer border border-border/30">
                                <Mail className="text-muted-foreground" size={18} />
                                <span className="text-sm font-medium truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer border border-border/30">
                                <Phone className="text-muted-foreground" size={18} />
                                <span className="text-sm font-medium">No phone provided</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CustomerDetailsClient
