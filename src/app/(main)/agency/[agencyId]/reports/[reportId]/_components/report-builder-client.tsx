'use client'

import React, { useState } from 'react'
import {
    Save,
    Send,
    Download,
    Layout,
    PieChart,
    Type,
    Table,
    Plus,
    ChevronRight,
    MoreVertical,
    GripVertical,
    Calendar,
    Filter,
    Users,
    Sparkles,
    X,
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RePieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts'

import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
const ResponsiveGridLayout = WidthProvider(Responsive)
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

interface ReportBuilderClientProps {
    agencyId: string
    reportId: string
}

// Mock initial data
const INITIAL_SECTIONS = [
    { id: 'sec_1', title: 'Overview', active: true },
    { id: 'sec_2', title: 'KPIs', active: false },
    { id: 'sec_3', title: 'Performance Graphs', active: false },
    { id: 'sec_4', title: 'Deliverables', active: false },
]

const CARD_TYPES = [
    { type: 'metric', title: 'Metric Card', icon: Layout, w: 250, h: 200 },
    { type: 'graph', title: 'Graph Card', icon: PieChart, w: 500, h: 400 },
    { type: 'summary', title: 'Text Summary', icon: Type, w: 500, h: 200 },
    { type: 'data', title: 'Data Table', icon: Table, w: 1000, h: 450 },
]

// Mock chart data
const CHART_DATA = [
    { name: 'Mon', value: 400, mobile: 240 },
    { name: 'Tue', value: 300, mobile: 139 },
    { name: 'Wed', value: 200, mobile: 980 },
    { name: 'Thu', value: 278, mobile: 390 },
    { name: 'Fri', value: 189, mobile: 480 },
    { name: 'Sat', value: 239, mobile: 380 },
    { name: 'Sun', value: 349, mobile: 430 },
]

const PIE_DATA = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Organic', value: 300 },
    { name: 'Referral', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const TABLE_DATA = [
    { page: '/home', views: '2,453', bounce: '45%' },
    { page: '/pricing', views: '1,230', bounce: '32%' },
    { page: '/blog/post-1', views: '890', bounce: '65%' },
    { page: '/about', views: '650', bounce: '56%' },
]

export const ReportBuilderClient: React.FC<ReportBuilderClientProps> = ({ agencyId, reportId }) => {
    const [sections, setSections] = useState(INITIAL_SECTIONS)
    const [activeSectionId, setActiveSectionId] = useState('sec_1')
    /* State for layouts per section */
    const [sectionLayouts, setSectionLayouts] = useState<Record<string, any[]>>({
        'sec_1': [
            { i: 'c1', x: 0, y: 0, w: 250, h: 200, type: 'metric' },
            { i: 'c2', x: 250, y: 0, w: 250, h: 200, type: 'metric' },
            { i: 'c3', x: 0, y: 200, w: 500, h: 400, type: 'graph' },
            { i: 'c4', x: 500, y: 0, w: 500, h: 200, type: 'summary' },
        ],
        'sec_2': [
            { i: 'c5', x: 0, y: 0, w: 1000, h: 450, type: 'data' }
        ],
        'sec_3': [],
        'sec_4': []
    })

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)

    const currentLayout = sectionLayouts[activeSectionId] || []

    const [containerWidth, setContainerWidth] = useState(1200)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!containerRef.current) return
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (entry) {
                // Measure the actual available width (subtracting padding)
                const newWidth = entry.contentRect.width
                setContainerWidth(newWidth)
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    const handleLayoutChange = (newLayout: any[]) => {
        setSectionLayouts(prev => {
            const currentSectionLayout = prev[activeSectionId] || []

            // Merge the new layout (x, y, w, h) with our existing data (type, etc.)
            const mergedLayout = newLayout.map(layoutItem => {
                const existingItem = currentSectionLayout.find(item => item.i === layoutItem.i)
                return {
                    ...existingItem, // Keep type and any other metadata
                    ...layoutItem    // Apply new position/size
                }
            })

            return {
                ...prev,
                [activeSectionId]: mergedLayout
            }
        })
    }

    const addCard = (cardType: any) => {
        const newId = `c${Date.now()}`
        const newCard = {
            i: newId,
            x: (currentLayout.length * 200) % 1000,
            y: Infinity,
            w: cardType.w,
            h: cardType.h,
            type: cardType.type
        }

        setSectionLayouts(prev => ({
            ...prev,
            [activeSectionId]: [...(prev[activeSectionId] || []), newCard]
        }))
    }

    const renderCardContent = (item: any) => {
        switch (item.type) {
            case 'metric':
                return (
                    <div className="relative h-full p-6 flex flex-col justify-between overflow-hidden group">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/5 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Revenue</span>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-5xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent tracking-tight">
                                    $42,389
                                </span>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                                    <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">+24%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    vs. last month
                                </p>
                                <div className="h-6 w-16 opacity-50">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={CHART_DATA.slice(-4)}>
                                            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'graph':
                return (
                    <div className="w-full h-full min-h-[100px] flex flex-col p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">Performance Analytics</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Weekly engagement trends</p>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    <span className="text-slate-600 dark:text-slate-400">Desktop</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                    <span className="text-slate-600 dark:text-slate-400">Mobile</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div className="flex-1 w-full min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" strokeOpacity={0.4} className="dark:stroke-slate-800" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                        dx={-5}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '16px',
                                            border: '1px solid rgba(226, 232, 240, 0.4)',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                            padding: '12px 16px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3, stroke: '#fff' }}
                                        activeDot={{ r: 5, strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="mobile"
                                        stroke="#a855f7"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorMobile)"
                                        dot={{ fill: '#a855f7', strokeWidth: 2, r: 3, stroke: '#fff' }}
                                        activeDot={{ r: 5, strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            case 'summary':
                return (
                    <div className="h-full flex flex-col p-6 relative overflow-hidden group">
                        {/* Glass background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-blue-50/30 dark:from-indigo-950/5 dark:to-blue-950/5" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Insight</h4>
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Growth Analysis</p>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                    We've identified a <span className="text-blue-600 font-bold underline decoration-blue-200 decoration-2">significant opportunity</span> in your mobile traffic conversion.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
                                            <ChevronRight className="w-3 h-3 text-emerald-600" />
                                        </div>
                                        <span>Increase in mobile page speed by <span className="font-bold text-emerald-600">1.2s</span></span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
                                            <ChevronRight className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <span>New organic keywords ranking on <span className="font-bold text-blue-600">Page 1</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'data':
                return (
                    <div className="h-full flex flex-col p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-xl">
                                    <Table className="w-5 h-5 text-white dark:text-slate-900" />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">Conversion Breakdown</h4>
                                    <p className="text-xs text-slate-500 font-medium tracking-tight">Channel performance by medium</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider rounded-lg px-4 border-2">
                                    Export CSV
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg border-2">
                                    <Filter className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-hidden">
                            <div className="w-full h-full flex flex-col">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pb-4 mb-2 border-b-2 border-slate-100 dark:border-slate-800">
                                    <div className="col-span-1 text-center">#</div>
                                    <div className="col-span-5">Source / Medium</div>
                                    <div className="col-span-3 text-right">Revenue</div>
                                    <div className="col-span-3 text-right">Conversion</div>
                                </div>

                                {/* Table Rows */}
                                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                                    {[
                                        { id: 1, source: 'google', medium: 'organic', val: '$12,450', conv: 3.2, color: 'blue' },
                                        { id: 2, source: 'facebook', medium: 'paid-ad', val: '$8,920', conv: 2.8, color: 'indigo' },
                                        { id: 3, source: 'newsletter', medium: 'email', val: '$4,130', conv: 5.4, color: 'emerald' },
                                        { id: 4, source: 'direct', medium: 'none', val: '$2,840', conv: 1.2, color: 'slate' },
                                        { id: 5, source: 'linkedin', medium: 'social', val: '$1,290', conv: 0.8, color: 'sky' },
                                    ].map((row) => (
                                        <div
                                            key={row.id}
                                            className="grid grid-cols-12 gap-4 items-center py-4 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 relative overflow-hidden group"
                                        >
                                            <div className="col-span-1 text-center font-bold text-slate-400 text-xs">
                                                {row.id}
                                            </div>
                                            <div className="col-span-5 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-500 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
                                                    {row.source[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                                                        {row.source}
                                                    </span>
                                                    <span className="text-[10px] font-semibold text-slate-400 lowercase">
                                                        {row.medium}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                                    {row.val}
                                                </span>
                                            </div>
                                            <div className="col-span-3">
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                                                        {row.conv}%
                                                    </span>
                                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex justify-end">
                                                        <div
                                                            className={`h-full rounded-full bg-gradient-to-l from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]`}
                                                            style={{ width: `${row.conv * 10}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                            <Layout className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Unknown Module</p>
                        <p className="text-[10px] text-slate-500 font-medium">Card ID: {item.i}</p>
                    </div>
                )
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] -m-4 bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* Top Controls Bar */}
            <div className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/agency/${agencyId}/reports`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                        <h1 className="text-lg font-semibold flex items-center gap-2">
                            Monthly SEO Report
                            <Badge variant="outline" className="ml-2 font-normal text-xs text-amber-600 border-amber-200 bg-amber-50">Draft</Badge>
                        </h1>
                        <p className="text-xs text-muted-foreground">Last saved 2 mins ago</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Save className="w-4 h-4" /> Save
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" /> Export
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-2" />
                    <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4" /> Publish to Client
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden h-full">
                {/* Left Panel - Dynamic Content */}
                <div className="w-80 border-r bg-background flex flex-col shrink-0 h-full relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!selectedCardId ? (
                            <motion.div
                                key="sections"
                                initial={{ x: -320, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="flex flex-col h-full"
                            >
                                <div className="p-4 border-b flex items-center justify-between">
                                    <h2 className="font-semibold text-sm">Sections</h2>
                                    <Button variant="ghost" size="icon" className="h-6 w-6">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <ScrollArea className="flex-1">
                                    <div className="p-2 space-y-1">
                                        {sections.map((section) => (
                                            <div
                                                key={section.id}
                                                className={`flex items-center justify-between p-2 rounded-md text-sm cursor-pointer transition-colors ${activeSectionId === section.id
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'hover:bg-muted text-muted-foreground'
                                                    }`}
                                                onClick={() => setActiveSectionId(section.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <GripVertical className="w-3 h-3 text-muted-foreground/50" />
                                                    {section.title}
                                                </div>
                                                {activeSectionId === section.id && <ChevronRight className="w-3 h-3" />}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>

                                <div className="p-4 border-t">
                                    <p className="text-xs font-medium text-muted-foreground mb-3">Add Element</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {CARD_TYPES.map(cardType => {
                                            const Icon = cardType.icon
                                            return (
                                                <Button
                                                    key={cardType.title}
                                                    variant="outline"
                                                    className="h-auto py-2 px-2 flex flex-col items-center gap-1 border-dashed"
                                                    onClick={() => addCard(cardType)}
                                                >
                                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-[10px]">{cardType.title}</span>
                                                </Button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="settings"
                                initial={{ x: 320, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 320, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50"
                            >
                                <div className="p-4 border-b flex items-center justify-between bg-background">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <h2 className="font-bold text-sm">Card Settings</h2>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-slate-100 transition-colors"
                                        onClick={() => setSelectedCardId(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-8">
                                        <div className="space-y-3">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Card Identity</Label>
                                            <div className="space-y-2">
                                                <Label className="text-xs ml-1">Title</Label>
                                                <Input className="h-10 bg-background border-slate-200" placeholder="Enter title" defaultValue="Total Visits" />
                                            </div>
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div className="space-y-6">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Data Pipeline</Label>

                                            <div className="space-y-2">
                                                <Label className="text-xs ml-1">Source Connection</Label>
                                                <Select defaultValue="google_analytics">
                                                    <SelectTrigger className="h-10 bg-background">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="google_analytics">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                                Google Analytics
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="fb_ads">Facebook Ads</SelectItem>
                                                        <SelectItem value="crm">CRM Data</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs ml-1">Primary Metric</Label>
                                                <Select defaultValue="sessions">
                                                    <SelectTrigger className="h-10 bg-background">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sessions">Sessions</SelectItem>
                                                        <SelectItem value="users">Users</SelectItem>
                                                        <SelectItem value="bounce_rate">Bounce Rate</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button variant="destructive" className="w-full h-11 shadow-lg shadow-red-500/10 font-bold tracking-tight">
                                                Delete Element
                                            </Button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 relative flex overflow-hidden h-full">
                    {/* Main Canvas */}
                    <div
                        ref={containerRef}
                        className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 p-8 transition-all duration-300"
                        data-lenis-prevent
                        onClick={() => selectedCardId && setSelectedCardId(null)}
                    >
                        <div className="max-w-[1200px] mx-auto min-h-[800px] bg-background rounded-xl border shadow-sm p-8 relative">
                            <div className="mb-8 border-b pb-4">
                                <h2 className="text-2xl font-bold">{sections.find(s => s.id === activeSectionId)?.title}</h2>
                                <p className="text-muted-foreground">Section overview and key metrics.</p>
                            </div>

                            <ResponsiveGridLayout
                                className="layout"
                                layouts={{ lg: currentLayout }}
                                width={containerWidth - 64}
                                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                                cols={{ lg: 1000, md: 800, sm: 600, xs: 400, xxs: 200 }}
                                rowHeight={1}
                                onLayoutChange={(l) => handleLayoutChange(l)}
                                isDraggable={true}
                                isResizable={true}
                                draggableHandle=".drag-handle"
                                resizeHandles={['s', 'e', 'se', 'sw', 'nw', 'ne', 'w', 'n']}
                                compactType={null}
                                margin={[0, 0]}
                                containerPadding={[0, 0]}
                                useCSSTransforms={true}
                            >
                                {currentLayout.map((item: any) => (
                                    <div key={item.i}
                                        className={`bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 relative group overflow-hidden ${selectedCardId === item.i ? 'selected border-primary shadow-lg ring-2 ring-primary/10' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedCardId(item.i)
                                        }}
                                    >
                                        {/* Selection Border */}
                                        <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none z-10 transition-colors ${selectedCardId === item.i ? 'border-primary' : 'border-transparent group-hover:border-primary/20'}`} />

                                        {/* Card Header / Controls */}
                                        <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                                            <div className="drag-handle p-1 rounded-md bg-background/80 hover:bg-background shadow-sm border cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 bg-background/80 hover:bg-background shadow-sm border">
                                                    <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="h-full p-4">
                                            {renderCardContent(item)}
                                        </div>
                                    </div>
                                ))}
                            </ResponsiveGridLayout>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
