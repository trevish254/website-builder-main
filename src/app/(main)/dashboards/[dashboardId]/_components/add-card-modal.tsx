'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
    Plus,
    DollarSign,
    Contact2,
    Goal,
    Star,
    BarChart3,
    Users2,
    LineChart,
    Wallet,
    Zap,
    Brain,
    Wrench,
    Activity,
    Search,
    ChevronRight,
    MessageSquare,
    StickyNote,
    TrendingUp,
    LayoutGrid,
    Sparkles,
    AlertCircle,
    ShieldAlert,
    CheckSquare,
    Type,
    FileText,
    File,
    Bookmark,
    Table,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import CountCard from '@/components/dashboard/cards/count-card'
import GraphCard from '@/components/dashboard/cards/graph-card'
import ListCard from '@/components/dashboard/cards/list-card'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'

type Props = {
    isOpen: boolean
    onClose: () => void
    onAdd: (type: string, config?: any) => void
}

const CATEGORIES = [
    { id: 'featured', label: 'Featured', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', tremor: 'amber' },
    { id: 'performance', label: 'Performance', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-500/10', tremor: 'blue' },
    { id: 'team', label: 'Team & Workload', icon: Users2, color: 'text-indigo-500', bg: 'bg-indigo-500/10', tremor: 'indigo' },
    { id: 'growth', label: 'Growth & Traffic', icon: LineChart, color: 'text-yellow-500', bg: 'bg-yellow-500/10', tremor: 'yellow' },
    { id: 'financial', label: 'Financial', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10', tremor: 'emerald' },
    { id: 'operations', label: 'Operations', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10', tremor: 'orange' },
    { id: 'insights', label: 'Insights', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10', tremor: 'purple' },
    { id: 'utility', label: 'Utility', icon: Wrench, color: 'text-slate-500', bg: 'bg-slate-500/10', tremor: 'slate' },
]

const CARD_TYPES = [
    // PERFORMANCE CATEGORY
    {
        type: 'graph',
        title: 'Sales Trends',
        description: 'Track volume and growth of sales transactions over time.',
        categories: ['performance', 'featured'],
        config: { title: 'Sales Trends', chartType: 'line', dataSource: 'sales' },
        color: 'bg-indigo-500/10',
    },
    {
        type: 'graph',
        title: 'Revenue Distribution',
        description: 'Detailed view of income across multiple channels.',
        categories: ['performance', 'financial', 'featured'],
        config: { title: 'Revenue', chartType: 'area', dataSource: 'revenue' },
        color: 'bg-blue-500/10',
    },
    {
        type: 'agency-goal',
        title: 'Server Latency',
        description: 'Real-time monitoring of API response times and infrastructure health.',
        categories: ['performance', 'operations'],
        config: { title: 'Systems Health' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'graph',
        title: 'Conversion Rate',
        description: 'Percentage of visitors who complete a desired goal.',
        categories: ['performance', 'growth'],
        config: { title: 'Conversion Rate', chartType: 'bar', dataSource: 'conversion' },
        color: 'bg-emerald-500/10',
    },

    // GROWTH & TRAFFIC
    {
        type: 'graph',
        title: 'Website Visitors',
        description: 'Aggregate view of unique visitors and page sessions over time.',
        categories: ['growth', 'featured'],
        config: { title: 'Visitor Volume', chartType: 'area', dataSource: 'websiteVisitors' },
        color: 'bg-yellow-500/10',
    },
    {
        type: 'graph',
        title: 'Lead Sources',
        description: 'Breakdown of where your acquisition is coming from.',
        categories: ['growth'],
        config: { title: 'Channel Mix', chartType: 'donut', dataSource: 'leadSources' },
        color: 'bg-yellow-500/10',
    },
    {
        type: 'graph',
        title: 'Funnel Steps',
        description: 'Conversion drop-off analysis from impression to sale.',
        categories: ['growth', 'featured'],
        config: { title: 'Acquisition Funnel', chartType: 'funnel', dataSource: 'funnel' },
        color: 'bg-yellow-500/10',
    },
    {
        type: 'graph',
        title: 'Traffic Trend',
        description: 'Daily traffic fluctuations and peak activity windows.',
        categories: ['growth'],
        config: { title: 'Traffic Pulse', chartType: 'line', dataSource: 'trafficTrend' },
        color: 'bg-yellow-500/10',
    },
    {
        type: 'graph',
        title: 'Signup Growth',
        description: 'Net new user signups and account creations per month.',
        categories: ['growth'],
        config: { title: 'New Accounts', chartType: 'area', dataSource: 'sales' },
        color: 'bg-yellow-500/10',
    },

    // FINANCIAL CATEGORY
    {
        type: 'graph',
        title: 'Revenue vs Expenses',
        description: 'Comparative breakdown of gross income against operational costs.',
        categories: ['financial', 'featured'],
        config: { title: 'P&L Comparison', chartType: 'bar', dataSource: 'revVsExp' },
        color: 'bg-emerald-500/10',
    },
    {
        type: 'graph',
        title: 'Cashflow Trend',
        description: 'Monthly movement of net liquid assets through the business.',
        categories: ['financial', 'featured'],
        config: { title: 'Cashflow Pulse', chartType: 'line', dataSource: 'cashflow' },
        color: 'bg-emerald-500/10',
    },
    {
        type: 'graph',
        title: 'Profit Split',
        description: 'Contribution breakdown from services, products, and subscriptions.',
        categories: ['financial'],
        config: { title: 'Revenue Share', chartType: 'donut', dataSource: 'profitSplit' },
        color: 'bg-emerald-500/10',
    },
    {
        type: 'graph',
        title: 'Client Value',
        description: 'Top-tier accounts ranked by their periodic billing volume.',
        categories: ['financial'],
        config: { title: 'Client LTV', chartType: 'bar', dataSource: 'clientValue' },
        color: 'bg-emerald-500/10',
    },
    {
        type: 'income',
        title: 'Net Profit KPI',
        description: 'High-level real-time tracker for bottom-line earnings.',
        categories: ['financial'],
        config: { title: 'Net Profit' },
        color: 'bg-emerald-500/10',
    },

    // TEAM CATEGORY
    {
        type: 'graph',
        title: 'Tasks per User',
        description: 'Individual task counts assigned to each active team member.',
        categories: ['team', 'featured'],
        config: { title: 'User Task Load', chartType: 'bar', dataSource: 'teamWorkload' },
        color: 'bg-indigo-500/10',
    },
    {
        type: 'graph',
        title: 'Status Distribution',
        description: 'High-level breakdown of tasks across workflow stages.',
        categories: ['team'],
        config: { title: 'Workflow Balance', chartType: 'donut', dataSource: 'taskStatus' },
        color: 'bg-blue-500/10',
    },
    {
        type: 'heatmap',
        title: 'Workload Density',
        description: 'Interactive heatmap showing team activity levels over the last 30 days.',
        categories: ['team', 'featured'],
        config: { title: 'Workload Heatmap' },
        color: 'bg-emerald-500/10',
    },
    {
        type: 'pressure',
        title: 'Deadline Pressure',
        description: 'Tracking tasks nearing due dates and potential bottlenecks.',
        categories: ['team'],
        config: { title: 'Priority Hotspots' },
        color: 'bg-rose-500/10',
    },
    {
        type: 'graph',
        title: 'Productivity Trend',
        description: 'Team-wide task completion velocity over the current sprint.',
        categories: ['team'],
        config: { title: 'Velocity Trend', chartType: 'area', dataSource: 'productivity' },
        color: 'bg-purple-500/10',
    },

    // OPERATIONS CATEGORY
    {
        type: 'graph',
        title: 'Pipeline Stages',
        description: 'Visual breakdown of leads moving through your business pipeline.',
        categories: ['operations', 'featured'],
        config: { title: 'Pipeline Funnel', chartType: 'funnel', dataSource: 'pipelineStages' },
        color: 'bg-orange-500/10',
    },
    {
        type: 'graph',
        title: 'Deal Stages',
        description: 'Comparative volume of active deals across horizontal stages.',
        categories: ['operations'],
        config: { title: 'Deal Velocity', chartType: 'horizontal-bar', dataSource: 'dealStages' },
        color: 'bg-orange-500/10',
    },
    {
        type: 'graph',
        title: 'Order Status',
        description: 'Fulfillment tracking from processing to successful delivery.',
        categories: ['operations', 'featured'],
        config: { title: 'Order Flow', chartType: 'donut', dataSource: 'orderStatus' },
        color: 'bg-orange-500/10',
    },
    {
        type: 'graph',
        title: 'Inventory Movement',
        description: 'Inflow and outflow of product stock over the last period.',
        categories: ['operations'],
        config: { title: 'Stock Liquidity', chartType: 'stacked-bar', dataSource: 'inventoryMovement' },
        color: 'bg-orange-500/10',
    },
    {
        type: 'graph',
        title: 'Workflow Distribution',
        description: 'Internal process allocation across different department queues.',
        categories: ['operations'],
        config: { title: 'Workflow Balance', chartType: 'donut', dataSource: 'orderStatus' },
        color: 'bg-orange-500/10',
    },
    {
        type: 'list',
        title: 'System Pulse',
        description: 'Real-time feed of granular system logs and automation logs.',
        categories: ['operations'],
        config: { title: 'Live Events', limit: 4 },
        color: 'bg-orange-500/10',
    },

    // INSIGHTS CATEGORY
    {
        type: 'graph',
        title: 'Predictive Forecast',
        description: 'AI-calculated revenue and growth projections for the next quarter.',
        categories: ['insights', 'featured'],
        config: { title: 'Revenue Forecast', chartType: 'line', dataSource: 'forecast' },
        color: 'bg-purple-500/10',
    },
    {
        type: 'risk',
        title: 'Risk Hub',
        description: 'Real-time identification of operational and financial churn risks.',
        categories: ['insights'],
        config: { title: 'Churn Risk' },
        color: 'bg-purple-500/10',
    },
    {
        type: 'score',
        title: 'Efficiency Score',
        description: 'Aggregate performance rating based on team and operational data.',
        categories: ['insights', 'featured'],
        config: { title: 'Performance Index' },
        color: 'bg-purple-500/10',
    },
    {
        type: 'summary',
        title: 'Smart Summary',
        description: 'GPT-powered natural language overview of your weekly business performance.',
        categories: ['insights'],
        config: { title: 'Briefing' },
        color: 'bg-purple-500/10',
    },
    {
        type: 'graph',
        title: 'Anomaly Detection',
        description: 'Identify unusual patterns or spikes in your business metrics.',
        categories: ['insights'],
        config: { title: 'Metric Deviations', chartType: 'scatter', dataSource: 'anomalies' },
        color: 'bg-purple-500/10',
    },

    // UTILITY CATEGORY
    {
        type: 'notes',
        title: 'Strategic Notes',
        description: 'Multi-line persistent workspace for internal strategies and context.',
        categories: ['utility', 'featured'],
        config: { title: 'Business Strategy' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'discussion',
        title: 'Team Hub',
        description: 'Internal thread for departmental updates and team collaboration.',
        categories: ['utility', 'featured'],
        config: { title: 'Operations Chat' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'list',
        title: 'Activity Pulse',
        description: 'Live audit log of recent account actions and system updates.',
        categories: ['utility'],
        config: { title: 'Recent Events', limit: 4 },
        color: 'bg-slate-500/10',
    },
    {
        type: 'table',
        title: 'Data Grid',
        description: 'Structured row-based view for managing granular record sets.',
        categories: ['utility', 'featured'],
        config: { title: 'Inventory Table' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'checklist',
        title: 'Action List',
        description: 'Task-based checklist for managing recurring operational to-dos.',
        categories: ['utility'],
        config: { title: 'Opening Tasks' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'text',
        title: 'Content Block',
        description: 'Distraction-free text area for static documentation or briefings.',
        categories: ['utility'],
        config: { title: 'Weekly Brief' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'doc',
        title: 'File Manager',
        description: 'Document repository for quick access to internal business PDFs.',
        categories: ['utility'],
        config: { title: 'Company Policy' },
        color: 'bg-slate-500/10',
    },
    {
        type: 'bookmark',
        title: 'Quick Links',
        description: 'Link repository for frequently visited external business tools.',
        categories: ['utility'],
        config: { title: 'Tool Log' },
        color: 'bg-slate-500/10',
    },
]

const renderPreview = (card: any, tremorColor: string = 'blue') => {
    switch (card.type) {
        case 'graph':
            return <GraphCard {...card.config} color={tremorColor} />
        case 'income':
            return (
                <div className="relative p-3 flex flex-col items-center justify-center h-full text-foreground">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground opacity-50 mb-1 leading-none">Revenue</span>
                    <span className="text-xl font-light tracking-tighter text-foreground">$24,900</span>
                    <DollarSign className={cn("absolute right-1 top-1 w-4 h-4 opacity-20", `text-${tremorColor}-500`)} />
                </div>
            )
        case 'potential-income':
            return (
                <div className="relative p-3 flex flex-col items-center justify-center h-full text-foreground">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground opacity-50 mb-1 leading-none">Projected</span>
                    <span className="text-xl font-light tracking-tighter text-foreground">$12,400</span>
                    <TrendingUp className={cn("absolute right-1 top-1 w-4 h-4 opacity-20", `text-${tremorColor}-500`)} />
                </div>
            )
        case 'active-clients':
            return (
                <div className="relative p-3 flex flex-col items-center justify-center h-full text-foreground">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground opacity-50 mb-1 leading-none">Accounts</span>
                    <span className="text-2xl font-light tracking-tighter text-center leading-none text-foreground">85</span>
                    <Contact2 className={cn("absolute right-1 top-1 w-4 h-4 opacity-20", `text-${tremorColor}-500`)} />
                </div>
            )
        case 'agency-goal':
            return (
                <div className="relative p-3 flex flex-col justify-center h-full text-foreground">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] opacity-50 uppercase font-bold text-foreground">Progress</span>
                        <span className="text-[8px] font-bold text-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-1.5 shadow-sm" />
                    <Goal className={cn("absolute right-1 top-1 w-4 h-4 opacity-20", `text-${tremorColor}-500`)} />
                </div>
            )
        case 'heatmap':
            return (
                <div className="p-2 h-full flex flex-col justify-center gap-1.5 overflow-hidden">
                    <div className="flex justify-between items-center mb-1 px-1">
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Activity density</span>
                        <div className="flex gap-0.5">
                            {[0.2, 0.4, 0.6, 0.9].map(o => (
                                <div key={o} className={cn("w-1.5 h-1.5 rounded-[2px]", `bg-${tremorColor}-500`)} style={{ opacity: o }} />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 28 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "aspect-square rounded-[3px] transition-all",
                                    `bg-${tremorColor}-500`
                                )}
                                style={{
                                    opacity: Math.random() > 0.4 ? (Math.random() * 0.8 + 0.1) : 0.05
                                }}
                            />
                        ))}
                    </div>
                </div>
            )
        case 'pressure':
            return (
                <div className="p-3 h-full flex flex-col justify-center gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 text-rose-500" />
                            <span className="text-[10px] font-bold text-foreground">Critical Deadlines</span>
                        </div>
                        <span className="text-[10px] font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">12 Overdue</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-[8px] font-bold text-muted-foreground uppercase tracking-tight">
                            <span>Resource Pressure</span>
                            <span>88%</span>
                        </div>
                        <Progress value={88} className="h-1 bg-rose-500/10" />
                    </div>
                </div>
            )
        case 'summary':
            return (
                <div className="p-3 h-full flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        <span className="text-[10px] font-bold text-foreground">AI Intelligence</span>
                    </div>
                    <div className="space-y-1.5 min-w-0">
                        <div className="h-1.5 w-full bg-muted rounded-full animate-pulse" />
                        <div className="h-1.5 w-[90%] bg-muted rounded-full animate-pulse delay-75" />
                        <div className="h-1.5 w-[75%] bg-muted rounded-full animate-pulse delay-150" />
                        <p className="text-[9px] text-muted-foreground italic leading-tight pt-1">"Revenue is trending 12% above last month with lower acquisition costs."</p>
                    </div>
                </div>
            )
        case 'score':
            return (
                <div className="p-2 h-full flex flex-col items-center justify-center gap-2 relative">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/20" />
                            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="175" strokeDashoffset="35" className={cn("transition-all duration-1000", `text-${tremorColor}-500`)} />
                        </svg>
                        <span className="absolute text-sm font-black text-foreground">84</span>
                    </div>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Healthy Score</span>
                </div>
            )
        case 'risk':
            return (
                <div className="p-3 h-full flex flex-col justify-center gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <ShieldAlert className="w-3 h-3 text-rose-500" />
                            <span className="text-[10px] font-bold text-foreground">Risk Guard</span>
                        </div>
                        <span className="text-[8px] font-black text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">High Priority</span>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40 border border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-rose-500 animate-ping" />
                            <span className="text-[9px] font-medium text-foreground">Potential churn: Enterprise B</span>
                        </div>
                    </div>
                </div>
            )
        case 'discussion':
            return (
                <div className="p-3 flex flex-col gap-2 h-full justify-center text-foreground">
                    <div className="bg-muted rounded-md px-2 py-1 text-[8px] w-[70%] text-foreground">Update on Q1?</div>
                    <div className="bg-primary text-primary-foreground rounded-md px-2 py-1 text-[8px] w-[70%] self-end">Almost done.</div>
                </div>
            )
        case 'table':
            return (
                <div className="p-3 h-full flex flex-col justify-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <Table className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-foreground">Data Entry</span>
                    </div>
                    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20">
                        <div className="grid grid-cols-3 gap-2 p-2 border-b border-border/50 bg-muted/40">
                            <div className="h-1 bg-muted-foreground/20 rounded-full" />
                            <div className="h-1 bg-muted-foreground/20 rounded-full" />
                            <div className="h-1 bg-muted-foreground/20 rounded-full" />
                        </div>
                        <div className="p-2 space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-1.5 bg-muted-foreground/10 rounded-full w-full" />
                                <div className="h-1.5 bg-muted-foreground/10 rounded-full w-[80%]" />
                                <div className="h-1.5 bg-muted-foreground/10 rounded-full w-[60%]" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="h-1.5 bg-muted-foreground/10 rounded-full w-[90%]" />
                                <div className="h-1.5 bg-muted-foreground/10 rounded-full w-[70%]" />
                                <div className="h-1.5 bg-muted-foreground/10 rounded-full w-[85%]" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        case 'checklist':
            return (
                <div className="p-4 h-full flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                        <span className="text-[11px] font-bold text-foreground leading-none">Task Queue</span>
                    </div>
                    <div className="space-y-3">
                        {[1, 0.6, 0.4].map((o, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={cn("w-3.5 h-3.5 rounded-md border-2 border-border/50 flex items-center justify-center transition-colors", i === 0 && "bg-emerald-500 border-emerald-500")}>
                                    {i === 0 && <Plus className="w-2 h-2 text-white rotate-45" />}
                                </div>
                                <div className="h-1.5 bg-muted rounded-full flex-1" style={{ opacity: o }} />
                            </div>
                        ))}
                    </div>
                </div>
            )
        case 'text':
            return (
                <div className="p-4 h-full flex flex-col justify-center gap-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Type className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] font-bold text-foreground">Content Block</span>
                    </div>
                    <div className="space-y-1.5">
                        <div className="h-2 w-full bg-muted rounded-full" />
                        <div className="h-2 w-[95%] bg-muted rounded-full" />
                        <div className="h-2 w-[40%] bg-muted rounded-full" />
                    </div>
                </div>
            )
        case 'doc':
            return (
                <div className="p-4 h-full flex flex-col items-center justify-center gap-3 group/doc">
                    <div className="w-12 h-16 rounded-lg bg-slate-50 dark:bg-zinc-800 border-2 border-border/50 relative overflow-hidden group-hover/doc:border-primary/40 transition-colors duration-500">
                        <div className="absolute top-0 right-0 w-4 h-4 bg-muted/40 rounded-bl-lg" />
                        <div className="p-2 pt-6 space-y-1.5">
                            <div className="h-1 w-full bg-muted-foreground/10 rounded-full" />
                            <div className="h-1 w-[80%] bg-muted-foreground/10 rounded-full" />
                        </div>
                    </div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">policy_v2.pdf</span>
                </div>
            )
        case 'bookmark':
            return (
                <div className="p-4 h-full flex flex-col justify-center gap-3">
                    <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-bold text-foreground">Resource Hub</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map(i => (
                            <div key={i} className="p-2 rounded-xl bg-muted/40 border border-border/50 flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-white dark:bg-zinc-700 shadow-sm" />
                                <div className="h-1 bg-muted-foreground/30 rounded-full flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            )
        default:
            return <div className="text-[10px] text-muted-foreground p-4 text-foreground">Preview not available</div>
    }
}

export default function AddCardModal({ isOpen, onClose, onAdd }: Props) {
    const [selectedCategory, setSelectedCategory] = useState('featured')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCards = useMemo(() => {
        return CARD_TYPES.filter(card => {
            const matchesCategory = card.categories.includes(selectedCategory)
            const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && (searchQuery === '' || matchesSearch)
        })
    }, [selectedCategory, searchQuery])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 border-none shadow-2xl sm:max-w-[1240px] h-[85vh] bg-background overflow-hidden">
                <div className="flex flex-row h-full w-full overflow-hidden bg-white dark:bg-[#09090b]">

                    {/* LEFT SIDEBAR: CATEGORIES */}
                    <aside className="w-[300px] shrink-0 border-r border-border/50 bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-xl flex flex-col h-full z-20">
                        {/* Sidebar Header */}
                        <div className="p-8 border-b border-border/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 shadow-sm transition-transform hover:scale-105 duration-300">
                                    <LayoutGrid className="w-5 h-5 text-primary" />
                                </div>
                                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">Widget Hub</DialogTitle>
                            </div>
                            <DialogDescription className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium">
                                Design your perfect dashboard with high-fidelity modules.
                            </DialogDescription>
                        </div>

                        {/* Category List */}
                        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
                            <div className="px-4 py-3 flex items-center justify-between">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                                    Collections
                                </span>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.04] border border-primary/10 text-[9px] font-black uppercase tracking-widest text-primary shadow-sm">
                                    <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                                    {filteredCards.length} Tools
                                </div>
                            </div>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group text-sm font-semibold relative overflow-hidden",
                                        selectedCategory === cat.id
                                            ? "bg-white dark:bg-zinc-800 shadow-xl shadow-black/5 ring-1 ring-border/50 text-foreground translate-x-1"
                                            : "hover:bg-primary/5 text-muted-foreground/60 hover:text-foreground hover:translate-x-1"
                                    )}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-transform group-hover:scale-110 duration-300",
                                            selectedCategory === cat.id ? cat.bg : "bg-transparent"
                                        )}>
                                            <cat.icon className={cn("w-4 h-4", selectedCategory === cat.id ? cat.color : "opacity-40")} />
                                        </div>
                                        <span>{cat.label}</span>
                                    </div>
                                    {selectedCategory === cat.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                    )}
                                </button>
                            ))}
                        </nav>

                    </aside>

                    {/* RIGHT CONTENT: DISCOVERY AREA */}
                    <main className="flex-1 flex flex-col h-full bg-white dark:bg-[#09090b] min-w-0 overflow-hidden relative shadow-inner">
                        {/* Header: Search & Info */}
                        <header className="flex-none p-4 md:p-5 border-b border-border/40 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-3xl z-30">
                            <div className="max-w-3xl mx-auto">
                                <div className="relative group w-full">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
                                    </div>
                                    <Input
                                        placeholder="Search tools..."
                                        className="pl-10 h-10 bg-muted/30 border-border/20 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary/5 rounded-xl text-sm transition-all duration-500 shadow-sm text-foreground"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-muted/50 text-[9px] items-center gap-1 hidden sm:flex text-muted-foreground font-mono opacity-60">
                                        <kbd>⌘</kbd>F
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Grid: Tools Discovery */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar bg-slate-50/10 dark:bg-zinc-950/20">
                            <div className="max-w-6xl mx-auto">
                                {filteredCards.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                                        {filteredCards.map((card) => (
                                            <div
                                                key={card.type + card.title}
                                                onClick={() => {
                                                    onAdd(card.type, card.config || {})
                                                    onClose()
                                                }}
                                                className="group relative flex flex-col h-[400px] rounded-[40px] border border-border/40 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)] transition-all duration-700 cursor-pointer overflow-hidden p-3 ring-1 ring-black/[0.02] dark:ring-white/[0.02]"
                                            >
                                                {/* Card Preview Window */}
                                                <div className="relative h-[220px] rounded-[30px] bg-slate-50 dark:bg-black/40 border border-border/20 p-6 overflow-hidden flex items-center justify-center transition-colors duration-500 group-hover:bg-primary/5">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                    {/* Widget Preview Hub */}
                                                    <div className="w-full h-full transform scale-[0.85] transition-all duration-700 group-hover:scale-[0.88] z-10 flex items-center justify-center">
                                                        <div className="w-full h-full bg-white dark:bg-zinc-900 shadow-[0_24px_48px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_48px_rgba(0,0,0,0.4)] rounded-[24px] border border-border/40 p-5 overflow-hidden relative">
                                                            {renderPreview(card, CATEGORIES.find(c => c.id === (card.categories[selectedCategory === 'featured' ? 1 : 0] || card.categories[0]))?.tremor)}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-background/5 to-transparent pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    {/* Add Trigger Layer */}
                                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-30 backdrop-blur-[6px]">
                                                        <div className="w-16 h-16 rounded-[28px] bg-primary text-primary-foreground flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 rotate-12 group-hover:rotate-0 transition-all duration-700">
                                                            <Plus className="w-8 h-8 stroke-[2.5]" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card Metadata Section */}
                                                <div className="px-6 py-6 flex flex-col justify-center flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex flex-col gap-1">
                                                            <h3 className="text-lg font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary">{card.title}</h3>
                                                            {card.categories.includes('featured') && (
                                                                <div className="flex">
                                                                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 text-[8px] font-black px-1.5 py-0 uppercase tracking-wider">Featured</Badge>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                                                            <ChevronRight className="w-4 h-4 text-primary" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[12px] text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium transition-colors duration-300 group-hover:text-muted-foreground">{card.description}</p>
                                                </div>

                                                {/* Select Action Overlay */}
                                                <div className="absolute top-6 right-6 z-40 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                                    <div className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground shadow-2xl text-[9px] font-black uppercase tracking-[0.1em] border border-white/20">
                                                        Install
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-[500px] flex flex-col items-center justify-center text-center opacity-40 py-20">
                                        <div className="p-10 rounded-[48px] bg-muted/20 border border-border/50 mb-8 scale-110 shadow-inner">
                                            <Search className="w-16 h-16 text-muted-foreground" />
                                        </div>
                                        <h4 className="text-2xl font-black tracking-tight text-foreground mb-4 font-sans">No widgets matched your search</h4>
                                        <p className="text-muted-foreground max-w-sm mx-auto font-medium">Try broadening your terms or explore different categories in the sidebar.</p>
                                        <button
                                            onClick={() => { setSearchQuery(''); setSelectedCategory('featured'); }}
                                            className="mt-8 px-6 py-2 rounded-full border border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-colors"
                                        >
                                            Reset Filters
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </DialogContent>
        </Dialog>
    )
}
