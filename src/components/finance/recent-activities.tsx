'use client'

import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

type Transaction = {
    id: string
    amount: number
    type: string
    status: string
    createdAt: string
    description?: string
    reference?: string
}

type Props = {
    transactions: Transaction[]
}

const RecentActivities = ({ transactions }: Props) => {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search" className="pl-8 w-[200px]" />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Activity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>
                                    <div className="w-4 h-4 border rounded bg-muted/20" />
                                </TableCell>
                                <TableCell className="font-medium">{t.reference || t.id.substring(0, 8)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{t.description || t.type}</span>
                                        <span className="text-xs text-muted-foreground">{t.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell>KES {t.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            t.status === 'COMPLETED'
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : t.status === 'PENDING'
                                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                                    : t.status === 'FAILED'
                                                        ? 'bg-red-100 text-red-700 border-red-200'
                                                        : 'bg-gray-100 text-gray-700 border-gray-200'
                                        }
                                    >
                                        {t.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(new Date(t.createdAt), 'dd MMM, yyyy hh:mm a')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No recent activities found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default RecentActivities
