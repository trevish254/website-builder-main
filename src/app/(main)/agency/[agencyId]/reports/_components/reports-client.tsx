'use client'

import React, { useState } from 'react'
import {
    FileText,
    Plus,
    Search,
    Filter,
    Settings,
    Calendar,
    MoreHorizontal,
    FileBarChart,
    Eye,
    EyeOff,
    Copy,
    Trash2,
    ExternalLink,
    ChevronDown,
    LayoutGrid,
    List
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MOCK_REPORTS } from './data'
import { CreateReportModal } from './create-report-modal'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import ReportsKanbanBoard from '@/components/ui/reports-kanban-board'

interface ReportsClientProps {
    agencyId: string
    subaccounts?: any[]
    defaultSubaccountId?: string
}

export const ReportsClient: React.FC<ReportsClientProps> = ({
    agencyId,
    subaccounts = [],
    defaultSubaccountId = 'all'
}) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedSubaccountId, setSelectedSubaccountId] = useState<string>(defaultSubaccountId)
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban')

    const filteredReports = MOCK_REPORTS.filter(report => {
        const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSubaccount = selectedSubaccountId === 'all' || report.subaccountId === selectedSubaccountId
        return matchesSearch && matchesSubaccount
    })

    return (
        <div className="flex flex-col gap-6 w-full p-6">
            {/* Top Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Create, manage, and publish performance reports for your clients.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={selectedSubaccountId} onValueChange={setSelectedSubaccountId}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Subaccounts" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subaccounts</SelectItem>
                            {subaccounts.map(sub => (
                                <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                        Templates
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Scheduled
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 bg-primary text-white hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Create Report
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Search reports..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Button
                            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('kanban')}
                            className="gap-2 h-8"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="hidden sm:inline">Kanban</span>
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                            className="gap-2 h-8"
                        >
                            <List className="w-4 h-4" />
                            <span className="hidden sm:inline">List</span>
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 w-full md:w-auto justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    Filter by
                                </div>
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Filter Categories</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Daily Reports</DropdownMenuItem>
                            <DropdownMenuItem>Weekly Reports</DropdownMenuItem>
                            <DropdownMenuItem>Monthly Reports</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Draft Status</DropdownMenuItem>
                            <DropdownMenuItem>Finalized Status</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>


            {/* Conditional View Rendering */}
            {viewMode === 'kanban' ? (
                <ReportsKanbanBoard
                    reports={filteredReports}
                    agencyId={agencyId}
                    onCreateReport={() => setIsCreateModalOpen(true)}
                />
            ) : (
                /* Reports List View */
                <div className="grid grid-cols-1 gap-4">
                    {filteredReports.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => router.push(`/agency/${agencyId}/reports/${report.id}`)}>
                            <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <FileBarChart className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{report.name}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {report.dateRange}
                                            </span>
                                            <span className="hidden md:inline">•</span>
                                            <span>{report.type}</span>
                                            <span className="hidden md:inline">•</span>
                                            <span>Owned by {report.owner}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            report.status === 'Finalized' ? 'default' :
                                                report.status === 'Draft' ? 'secondary' : 'outline'
                                        } className={
                                            report.status === 'Finalized' ? 'bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border-0' :
                                                report.status === 'Scheduled' ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/25 border-0' :
                                                    ''
                                        }>
                                            {report.status}
                                        </Badge>

                                        {report.clientVisible ? (
                                            <Badge variant="outline" className="gap-1 border-blue-200 text-blue-700 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800">
                                                <Eye className="w-3 h-3" /> Public
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="gap-1 text-muted-foreground border-transparent bg-muted/50">
                                                <EyeOff className="w-3 h-3" /> Internal
                                            </Badge>
                                        )}
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/agency/${agencyId}/reports/${report.id}`)
                                            }}>
                                                <ExternalLink className="mr-2 w-4 h-4" /> Open
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                <Copy className="mr-2 w-4 h-4" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={(e) => e.stopPropagation()}>
                                                <Trash2 className="mr-2 w-4 h-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                            </CardContent>
                        </Card>
                    ))}

                    {filteredReports.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No reports found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            <CreateReportModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                agencyId={agencyId}
                subaccounts={subaccounts}
            />
        </div >
    )
}
