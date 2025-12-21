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
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Download, ChevronLeft, ChevronRight, X } from 'lucide-react'
import clsx from 'clsx'
import { cn } from '@/lib/utils'
import { saveAs } from 'file-saver'

type Charge = {
    id: string
    description: string
    date: string
    status: string
    amount: string
    rawAmount: number
    rawStatus: string
}

type Props = {
    data: Charge[]
}

const ITEMS_PER_PAGE = 10

const BillingHistoryTable = ({ data }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)

    // Filtering logic
    const filteredData = data.filter((charge) => {
        const matchesSearch =
            charge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            charge.id.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'all' || charge.rawStatus.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    const handleStatusChange = (value: string) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchQuery('')
        setStatusFilter('all')
        setCurrentPage(1)
    }

    const exportToCSV = () => {
        const headers = ['Description', 'Invoice ID', 'Date', 'Status', 'Amount']
        const rows = filteredData.map(c => [
            c.description,
            c.id,
            c.date,
            c.status,
            c.amount
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        saveAs(blob, `billing_history_${new Date().toISOString().split('T')[0]}.csv`)
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-sm">
                <div className="flex flex-1 flex-col md:flex-row gap-3 w-full">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors w-4 h-4" />
                        <Input
                            placeholder="Search description or invoice ID..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-10 h-11 border-border/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl transition-all"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full md:w-[200px] h-11 border-border/50 rounded-xl focus:ring-emerald-500/20">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50 backdrop-blur-lg">
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="success">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="abandoned">Abandoned</SelectItem>
                        </SelectContent>
                    </Select>
                    {(searchQuery || statusFilter !== 'all') && (
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="flex items-center gap-2 h-11 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={exportToCSV}
                    className="flex items-center gap-2 w-full md:w-auto h-11 border-border/50 hover:bg-emerald-500/5 hover:text-emerald-500 hover:border-emerald-500/50 rounded-xl transition-all font-medium"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Table wrapper with glassmorphism */}
            <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md overflow-hidden shadow-xl shadow-background/20 transition-all duration-300">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50 hover:bg-transparent">
                            <TableHead className="w-[300px] py-6 font-bold text-foreground">Description</TableHead>
                            <TableHead className="w-[200px] font-bold text-foreground text-center">Reference</TableHead>
                            <TableHead className="w-[150px] font-bold text-foreground">Date</TableHead>
                            <TableHead className="w-[150px] font-bold text-foreground">Status</TableHead>
                            <TableHead className="text-right font-bold text-foreground pr-8">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((charge) => (
                                <TableRow key={charge.id} className="border-border/40 hover:bg-muted/20 transition-all group">
                                    <TableCell className="py-5 font-semibold">
                                        <div className="flex flex-col">
                                            <span>{charge.description}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Internal ID: {charge.id.slice(0, 12)}...
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <code className="bg-muted/50 px-2 py-1 rounded-md text-[11px] font-mono text-muted-foreground">
                                            {charge.id}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {charge.date}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={clsx('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm', {
                                                'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20': charge.rawStatus === 'success',
                                                'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20':
                                                    charge.rawStatus === 'pending',
                                                'bg-red-500/10 text-red-500 ring-1 ring-red-500/20': charge.rawStatus === 'failed' || charge.rawStatus === 'abandoned',
                                            })}
                                        >
                                            <div className={cn(
                                                "w-1.5 h-1.5 rounded-full shrink-0",
                                                charge.rawStatus === 'success' ? "bg-emerald-500 animate-pulse" :
                                                    charge.rawStatus === 'pending' ? "bg-amber-500" : "bg-red-500"
                                            )} />
                                            {charge.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-extrabold pr-8 text-lg tabular-nums">
                                        {charge.amount}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-32 text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold text-foreground">No matching records</p>
                                            <p className="text-sm">We couldn't find any transactions for <b>{searchQuery || statusFilter}</b></p>
                                        </div>
                                        <Button
                                            variant="link"
                                            onClick={clearFilters}
                                            className="text-emerald-500 font-bold"
                                        >
                                            Reset all filters
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-2 mt-4">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="text-foreground font-medium">{startIndex + 1}</span> to <span className="text-foreground font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="text-foreground font-medium">{filteredData.length}</span> results
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="border-border/50 rounded-xl h-10 px-4"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Prev
                        </Button>
                        <div className="hidden sm:flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    className={cn(
                                        "w-10 h-10 p-0 rounded-xl font-bold transition-all",
                                        currentPage === page ? "bg-primary shadow-lg shadow-primary/20" : "border-border/50 hover:bg-muted"
                                    )}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="border-border/50 rounded-xl h-10 px-4"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BillingHistoryTable
