'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface OrdersPerformanceGaugeProps {
    value?: number
    label?: string
    subLabel?: string
    className?: string
}

const OrdersPerformanceGauge = ({
    value = 84.60,
    label = "Operational Performance",
    subLabel = "Efficiency index vs last 24h",
    className
}: OrdersPerformanceGaugeProps) => {
    // Gauge parameters
    const size = 300 // Increased size to prevent clipping
    const strokeWidth = 14
    const radius = 120
    const center = 150

    // Level Color Mapping: Red -> Blue -> Yellow -> Green
    const getLevelColor = (ratio: number) => {
        if (ratio <= 0.25) return "#ef4444" // RED: Critical/Low
        if (ratio <= 0.50) return "#3b82f6" // BLUE: Stabilizing
        if (ratio <= 0.75) return "#eab308" // YELLOW: Optimized
        return "#10b981" // GREEN: Peak Performance
    }

    const currentColor = getLevelColor(value / 100)

    // Tick marks calculation
    const totalTicks = 60 // Even higher fidelity
    const tickMarks = Array.from({ length: totalTicks })

    return (
        <div className={cn("flex flex-col items-center justify-center pt-4 pb-12", className)}>
            <div className="relative" style={{ width: size, height: size / 1.7 }}>
                {/* SVG Layer */}
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    <defs>
                        {/* Unique and more robust glow filter */}
                        <filter id="gauge-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <g>
                        {tickMarks.map((_, i) => {
                            const ratio = i / (totalTicks - 1)
                            // Map 0-1 ratio to -180 to 0 degrees (Left to Right)
                            const angleInDeg = ratio * 180 - 180
                            const angleInRad = angleInDeg * (Math.PI / 180)

                            const isHighlighted = (ratio * 100) <= value
                            const tickColor = getLevelColor(ratio)

                            // Direct coordinate calculation for absolute precision
                            const xOuter = center + radius * Math.cos(angleInRad)
                            const yOuter = center + radius * Math.sin(angleInRad)
                            const xInner = center + (radius - 12) * Math.cos(angleInRad)
                            const yInner = center + (radius - 12) * Math.sin(angleInRad)

                            return (
                                <motion.line
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.005 }}
                                    x1={xInner}
                                    y1={yInner}
                                    x2={xOuter}
                                    y2={yOuter}
                                    stroke={isHighlighted ? tickColor : "currentColor"}
                                    strokeWidth={isHighlighted ? 4 : 2}
                                    strokeLinecap="round"
                                    filter={isHighlighted ? "url(#gauge-glow-filter)" : "none"}
                                    className={cn(
                                        "transition-all duration-700 ease-in-out",
                                        isHighlighted ? "opacity-100" : "opacity-30 dark:opacity-40"
                                    )}
                                />
                            )
                        })}
                    </g>

                    {/* Scale Labels - Perfectly positioned at fixed intervals */}
                    {[0, 25, 50, 75, 100].map((val) => {
                        const ratio = val / 100
                        const angleInRad = (ratio * 180 - 180) * (Math.PI / 180)
                        const x = center + (radius - 40) * Math.cos(angleInRad)
                        const y = center + (radius - 40) * Math.sin(angleInRad)

                        return (
                            <text
                                key={val}
                                x={x}
                                y={y}
                                fill="currentColor"
                                className="text-[10px] font-bold opacity-30 fill-muted-foreground"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {val}
                            </text>
                        )
                    })}
                </svg>

                {/* Central Readout Overaly */}
                <div className="absolute inset-x-0 bottom-1 flex flex-col items-center justify-center text-center">
                    <div className="relative group">
                        <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-black tracking-tighter block transition-colors duration-1000"
                            style={{ color: currentColor }}
                        >
                            {value.toFixed(2)}%
                        </motion.span>
                        <div
                            className="absolute -inset-6 blur-3xl opacity-10 group-hover:opacity-20 transition-all duration-1000 rounded-full -z-10"
                            style={{ backgroundColor: currentColor }}
                        />
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-2 opacity-60">
                        {subLabel}
                    </span>
                </div>
            </div>

            {/* Premium Legend & Live Status */}
            <div className="mt-12 flex items-center justify-between w-full max-w-[280px] px-8">
                <div className="flex items-center gap-3">
                    <div
                        className="w-2.5 h-2.5 rounded-full shadow-2xl transition-colors duration-1000 animate-pulse"
                        style={{ backgroundColor: currentColor, boxShadow: `0 0 15px ${currentColor}80` }}
                    />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest leading-none">{label}</span>
                </div>
                <div
                    className="px-4 py-1.5 rounded-full border transition-all duration-1000 bg-card/60 backdrop-blur-md shadow-sm"
                    style={{ borderColor: `${currentColor}50` }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full animate-blink" style={{ backgroundColor: currentColor }} />
                        <span className="text-[11px] font-black uppercase tracking-widest leading-none" style={{ color: currentColor }}>
                            Live
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrdersPerformanceGauge
