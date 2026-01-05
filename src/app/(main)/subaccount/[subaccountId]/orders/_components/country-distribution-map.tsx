'use client'

import React, { useMemo, useState } from 'react'
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
    Plus,
    Minus,
    Globe,
    XCircle,
    ShoppingCart,
    CheckCircle2,
    RotateCcw,
    Focus,
    ArrowUpRight,
    MapPin
} from 'lucide-react'
import { cn } from '@/lib/utils'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface CountryData {
    country: string
    count: number
    coordinates: [number, number]
    cancels: number
    abandons: number
    successful: number
    growth: string
}

const defaultData: CountryData[] = [
    { country: "United States", count: 120, coordinates: [-100, 40], cancels: 12, abandons: 25, successful: 83, growth: "+12%" },
    { country: "Germany", count: 85, coordinates: [10, 51], cancels: 5, abandons: 15, successful: 65, growth: "+8%" },
    { country: "United Kingdom", count: 65, coordinates: [-2, 54], cancels: 8, abandons: 10, successful: 47, growth: "-2%" },
    { country: "Kenya", count: 45, coordinates: [38, -1], cancels: 2, abandons: 8, successful: 35, growth: "+24%" },
    { country: "Japan", count: 30, coordinates: [138, 38], cancels: 1, abandons: 4, successful: 25, growth: "+5%" },
    { country: "Brazil", count: 25, coordinates: [-55, -10], cancels: 4, abandons: 9, successful: 12, growth: "+15%" },
]

type MetricType = 'total' | 'cancels' | 'abandons' | 'successful'
type RegionType = 'Global' | 'NA' | 'EU' | 'Asia' | 'Africa' | 'SA' | 'Oceania'

const regions: Record<RegionType, { center: [number, number], zoom: number }> = {
    Global: { center: [0, 10], zoom: 1 },
    NA: { center: [-100, 40], zoom: 2.2 },
    EU: { center: [15, 50], zoom: 3.5 },
    Asia: { center: [100, 35], zoom: 2.5 },
    Africa: { center: [20, 5], zoom: 2.5 },
    SA: { center: [-60, -20], zoom: 2.5 },
    Oceania: { center: [135, -25], zoom: 3 },
}

const CountryDistributionMap = ({ data = defaultData }: { data?: CountryData[] }) => {
    const { theme } = useTheme()
    const [position, setPosition] = useState({ coordinates: [0, 10] as [number, number], zoom: 1 })
    const [activeMetric, setActiveMetric] = useState<MetricType>('total')
    const [activeRegion, setActiveRegion] = useState<RegionType>('Global')
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const getMetricValue = (d: CountryData) => {
        switch (activeMetric) {
            case 'cancels': return d.cancels
            case 'abandons': return d.abandons
            case 'successful': return d.successful
            default: return d.count
        }
    }

    const maxCount = useMemo(() => Math.max(...data.map(d => getMetricValue(d))), [data, activeMetric])

    const handleRegionChange = (region: RegionType) => {
        setActiveRegion(region)
        setPosition({ coordinates: regions[region].center, zoom: regions[region].zoom })
    }

    const metricColors = {
        total: '#3b82f6',
        successful: '#10b981',
        cancels: '#ef4444',
        abandons: '#f59e0b'
    }

    const metricIcons = {
        total: Globe,
        successful: CheckCircle2,
        cancels: XCircle,
        abandons: ShoppingCart
    }

    return (
        <div className="w-full h-full flex flex-col gap-5" onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
            {/* High-Fidelity Intelligence Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-xl transition-colors duration-500",
                            activeMetric === 'total' && "bg-blue-500/10 text-blue-500",
                            activeMetric === 'successful' && "bg-emerald-500/10 text-emerald-500",
                            activeMetric === 'cancels' && "bg-rose-500/10 text-rose-500",
                            activeMetric === 'abandons' && "bg-amber-500/10 text-amber-500",
                        )}>
                            {React.createElement(metricIcons[activeMetric], { className: "w-5 h-5 animate-pulse" })}
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-foreground tracking-tight uppercase">Geographic Intelligence</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                Analyzing {activeMetric} across {activeRegion}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtration Controls Overlay */}
                <div className="flex items-center justify-end gap-2">
                    <div className="flex bg-white/5 dark:bg-white/[0.03] p-1 rounded-xl border border-white/30 dark:border-white/10 backdrop-blur-[2px] shadow-2xl">
                        {(['total', 'successful', 'cancels', 'abandons'] as MetricType[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setActiveMetric(m)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all duration-300",
                                    activeMetric === m
                                        ? "bg-white/20 dark:bg-white/10 text-foreground shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-white/40 dark:ring-white/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/10 dark:hover:bg-white/5"
                                )}
                            >
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metricColors[m] }} />
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Region Selector & Zoom Bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {(Object.keys(regions) as RegionType[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => handleRegionChange(r)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300",
                                activeRegion === r
                                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg scale-105"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 bg-white/5 dark:bg-white/[0.03] p-1 rounded-xl border border-white/30 dark:border-white/10 backdrop-blur-[2px] shadow-2xl">
                    <button
                        onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 10) }))}
                        className="p-1.5 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-px h-3 bg-white/20 dark:bg-white/10" />
                    <button
                        onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }))}
                        className="p-1.5 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleRegionChange('Global')}
                        className="p-1.5 hover:bg-white/10 dark:hover:bg-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-all"
                        title="Reset View"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Interactive Map Stage */}
            <div className="flex-1 min-h-[480px] relative overflow-hidden rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-950/40 border border-border/50 shadow-inner group">
                <ComposableMap
                    projectionConfig={{ rotate: [-10, 0, 0], scale: 145 }}
                    className="w-full h-full"
                >
                    <ZoomableGroup
                        zoom={position.zoom}
                        center={position.coordinates}
                        onMoveEnd={(pos) => setPosition({ coordinates: pos.coordinates as [number, number], zoom: pos.zoom })}
                        maxZoom={12}
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={theme === 'dark' ? '#111827' : '#f1f5f9'}
                                        stroke={theme === 'dark' ? '#1f2937' : '#cbd5e1'}
                                        strokeWidth={0.5 / position.zoom} // Keep strokes thin during zoom
                                        onMouseEnter={() => setHoveredCountry(geo.properties.name)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: theme === 'dark' ? '#1f2937' : '#e2e8f0', outline: "none" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {data.map((country) => {
                            const val = getMetricValue(country)
                            if (val === 0) return null
                            const isCountryHovered = hoveredCountry === country.country

                            return (
                                <Marker key={country.country} coordinates={country.coordinates}>
                                    <motion.g
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        whileHover={{ scale: 1.1 }}
                                        className="cursor-pointer"
                                        onMouseEnter={() => setHoveredCountry(country.country)}
                                        onMouseLeave={() => setHoveredCountry(null)}
                                    >
                                        <circle
                                            r={scaleLinear().domain([0, maxCount]).range([5, 18])(val) / (position.zoom * 0.8)}
                                            fill={metricColors[activeMetric]}
                                            fillOpacity={0.6}
                                            stroke={metricColors[activeMetric]}
                                            strokeWidth={1.5 / position.zoom}
                                        />
                                        <circle
                                            r={(scaleLinear().domain([0, maxCount]).range([5, 18])(val) + 4) / (position.zoom * 0.8)}
                                            fill={metricColors[activeMetric]}
                                            fillOpacity={0.15}
                                            className="animate-pulse"
                                        />

                                        {/* Dynamic Country Label */}
                                        <AnimatePresence>
                                            {(isCountryHovered || position.zoom > 3) && (
                                                <motion.text
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    textAnchor="middle"
                                                    y={-20 / position.zoom}
                                                    className="fill-foreground font-black uppercase pointer-events-none"
                                                    style={{
                                                        fontSize: `${11 / position.zoom}px`,
                                                        letterSpacing: '0.1em',
                                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                                    }}
                                                >
                                                    {country.country}
                                                </motion.text>
                                            )}
                                        </AnimatePresence>
                                    </motion.g>
                                </Marker>
                            )
                        })}
                    </ZoomableGroup>
                </ComposableMap>

                {/* Floating Intelligence Tooltip */}
                <AnimatePresence>
                    {hoveredCountry && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="fixed pointer-events-none z-50 bg-white/5 dark:bg-white/[0.03] backdrop-blur-[2px] border border-white/40 dark:border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-5 rounded-[2rem] min-w-[220px]"
                            style={{
                                left: mousePos.x + 20,
                                top: mousePos.y - 40
                            }}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-3.5 text-primary" />
                                        <span className="text-[12px] font-black text-foreground uppercase tracking-tight">
                                            {hoveredCountry}
                                        </span>
                                    </div>
                                    <div className="p-1 bg-primary/10 rounded-md">
                                        <Globe className="size-3 text-primary" />
                                    </div>
                                </div>

                                {data.find(d => d.country === hoveredCountry) ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{activeMetric} Volume</span>
                                            <span className="text-xs font-black text-foreground">
                                                {getMetricValue(data.find(d => d.country === hoveredCountry)!)} units
                                            </span>
                                        </div>
                                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-700"
                                                style={{
                                                    width: `${(getMetricValue(data.find(d => d.country === hoveredCountry)!) / maxCount) * 100}%`,
                                                    backgroundColor: metricColors[activeMetric]
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-[10px] italic text-muted-foreground">No active metrics recorded in this region</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Focus Button */}
                <div className="absolute right-8 bottom-8">
                    <button
                        onClick={() => handleRegionChange('Global')}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 dark:bg-white/[0.03] hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-500 border border-white/40 dark:border-white/20 rounded-2xl shadow-2xl text-[11px] font-black uppercase tracking-widest text-foreground backdrop-blur-[2px] group"
                    >
                        <Focus className="size-4 group-hover:rotate-90 transition-transform duration-500" />
                        Re-Center Intelligence
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CountryDistributionMap
