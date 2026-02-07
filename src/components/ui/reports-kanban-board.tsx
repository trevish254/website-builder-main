'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, GripVertical, Eye, Copy, Trash2, ExternalLink, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Report {
    id: string;
    name: string;
    description?: string;
    type: string;
    dateRange: string;
    status: 'Draft' | 'Scheduled' | 'Finalized' | 'Published';
    owner: string;
    clientVisible: boolean;
    lastUpdated: string;
    subaccountId?: string;
}

interface Column {
    id: string;
    title: string;
    reports: Report[];
    color: string;
}

interface ReportsKanbanBoardProps {
    reports: Report[];
    agencyId: string;
    onCreateReport?: () => void;
}

export default function ReportsKanbanBoard({ reports, agencyId, onCreateReport }: ReportsKanbanBoardProps) {
    const router = useRouter();

    // Group reports by status
    const groupedReports: Column[] = [
        {
            id: 'draft',
            title: 'Draft',
            color: '#8B7355',
            reports: reports.filter(r => r.status === 'Draft'),
        },
        {
            id: 'scheduled',
            title: 'Scheduled',
            color: '#6B8E23',
            reports: reports.filter(r => r.status === 'Scheduled'),
        },
        {
            id: 'finalized',
            title: 'Finalized',
            color: '#CD853F',
            reports: reports.filter(r => r.status === 'Finalized'),
        },
        {
            id: 'published',
            title: 'Published',
            color: '#556B2F',
            reports: reports.filter(r => r.status === 'Published'),
        },
    ];

    const [columns, setColumns] = useState<Column[]>(groupedReports);

    const handleDragStart = (e: React.DragEvent, report: Report, columnId: string) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ report, sourceColumnId: columnId }));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { report, sourceColumnId } = data;

        if (sourceColumnId === targetColumnId) return;

        setColumns((prev) =>
            prev.map((col) => {
                if (col.id === sourceColumnId) {
                    return { ...col, reports: col.reports.filter((r) => r.id !== report.id) };
                }
                if (col.id === targetColumnId) {
                    // Update report status based on column
                    const updatedReport = {
                        ...report,
                        status: col.title as Report['status']
                    };
                    return { ...col, reports: [...col.reports, updatedReport] };
                }
                return col;
            }),
        );
    };

    const handleViewReport = (reportId: string) => {
        router.push(`/agency/${agencyId}/reports/${reportId}`);
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Draft':
                return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            case 'Scheduled':
                return 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'Finalized':
                return 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'Published':
                return 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            default:
                return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300';
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'Monthly':
                return 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
            case 'Weekly':
                return 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
            case 'Daily':
                return 'bg-cyan-100 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    // Get column-specific glassmorphism colors
    const getColumnGlassColor = (columnId: string) => {
        switch (columnId) {
            case 'draft':
                return 'bg-slate-400/20 dark:bg-slate-600/20 border-slate-300/30 dark:border-slate-600/30';
            case 'scheduled':
                return 'bg-blue-400/20 dark:bg-blue-600/20 border-blue-300/30 dark:border-blue-600/30';
            case 'finalized':
                return 'bg-amber-400/20 dark:bg-amber-600/20 border-amber-300/30 dark:border-amber-600/30';
            case 'published':
                return 'bg-emerald-400/20 dark:bg-emerald-600/20 border-emerald-300/30 dark:border-emerald-600/30';
            default:
                return 'bg-white/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/50';
        }
    };

    // Get card-specific glassmorphism colors (more vibrant than column)
    const getCardGlassColor = (columnId: string) => {
        switch (columnId) {
            case 'draft':
                return 'bg-slate-50/90 dark:bg-slate-800/70 border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/95 dark:hover:bg-slate-700/80';
            case 'scheduled':
                return 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-200/50 dark:border-blue-800/50 hover:bg-blue-100/95 dark:hover:bg-blue-900/80';
            case 'finalized':
                return 'bg-amber-50/90 dark:bg-amber-950/70 border-amber-200/50 dark:border-amber-800/50 hover:bg-amber-100/95 dark:hover:bg-amber-900/80';
            case 'published':
                return 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-200/50 dark:border-emerald-800/50 hover:bg-emerald-100/95 dark:hover:bg-emerald-900/80';
            default:
                return 'bg-white/80 dark:bg-slate-800/80 border hover:bg-white dark:hover:bg-slate-700/90';
        }
    };

    // Get empty state colors based on column
    const getEmptyStateColor = (columnId: string) => {
        switch (columnId) {
            case 'draft':
                return { bg: 'bg-slate-100/80 dark:bg-slate-800/80', text: 'text-slate-400 dark:text-slate-500' };
            case 'scheduled':
                return { bg: 'bg-blue-100/80 dark:bg-blue-900/80', text: 'text-blue-400 dark:text-blue-500' };
            case 'finalized':
                return { bg: 'bg-amber-100/80 dark:bg-amber-900/80', text: 'text-amber-400 dark:text-amber-500' };
            case 'published':
                return { bg: 'bg-emerald-100/80 dark:bg-emerald-900/80', text: 'text-emerald-400 dark:text-emerald-500' };
            default:
                return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-400 dark:text-slate-500' };
        }
    };

    return (
        <div className="w-full" data-lenis-prevent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className={`${getColumnGlassColor(column.id)} backdrop-blur-xl rounded-2xl p-4 border flex flex-col h-[calc(100vh-280px)] min-h-[600px] transition-all duration-300`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-5 shrink-0">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-3 h-3 rounded-full shadow-lg"
                                    style={{
                                        backgroundColor: column.color,
                                        boxShadow: `0 0 10px ${column.color}40`
                                    }}
                                />
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                    {column.title}
                                </h3>
                                <Badge className="bg-white/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200/50 dark:border-slate-600/50 text-xs backdrop-blur-sm">
                                    {column.reports.length}
                                </Badge>
                            </div>
                            {column.id === 'draft' && (
                                <button
                                    onClick={onCreateReport}
                                    className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all duration-200 backdrop-blur-sm border border-slate-200/30 dark:border-slate-600/30"
                                >
                                    <Plus className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                </button>
                            )}
                        </div>

                        {/* Reports List */}
                        <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar" data-lenis-prevent>
                            {column.reports.map((report) => (
                                <Card
                                    key={report.id}
                                    className={`cursor-move transition-all duration-200 ${getCardGlassColor(column.id)} backdrop-blur-md hover:shadow-xl group`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, report, column.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            {/* Header */}
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="font-semibold text-slate-900 dark:text-white leading-tight text-sm flex-1">
                                                    {report.name}
                                                </h4>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-500 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                                <svg className="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                </svg>
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem onClick={() => handleViewReport(report.id)}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                View Report
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy className="w-4 h-4 mr-2" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                Share
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5">
                                                <Badge className={`text-[10px] px-2 py-0.5 font-semibold ${getTypeBadgeColor(report.type)}`}>
                                                    {report.type}
                                                </Badge>
                                                {report.clientVisible && (
                                                    <Badge className="text-[10px] px-2 py-0.5 font-semibold bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                                        <Eye className="w-2.5 h-2.5 mr-1" />
                                                        Public
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="text-[11px] font-medium">{report.dateRange.split(',')[0]}</span>
                                                    </div>
                                                </div>

                                                <Avatar className="w-6 h-6 ring-2 ring-white/50 dark:ring-slate-700/50">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${report.owner}`} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-[10px] font-bold">
                                                        {report.owner.split(' ').map((n) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Empty State */}
                            {column.reports.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className={`w-12 h-12 rounded-full ${getEmptyStateColor(column.id).bg} backdrop-blur-sm flex items-center justify-center mb-3`}>
                                        <svg className={`w-6 h-6 ${getEmptyStateColor(column.id).text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className={`text-sm ${getEmptyStateColor(column.id).text} font-medium`}>No {column.title.toLowerCase()} reports</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
