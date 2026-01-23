'use client'

import React from 'react'
import { Wifi, WifiOff, AlertTriangle, Activity } from 'lucide-react'
import { useConnectivity, ConnectionQuality } from '@/lib/hooks/use-connectivity'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ConnectivityIndicator = () => {
    const { quality, latency } = useConnectivity()

    if (quality === 'excellent' || quality === 'good') return null

    const config: Record<ConnectionQuality, { icon: any, color: string, label: string, description: string }> = {
        excellent: {
            icon: Wifi,
            color: 'text-emerald-500',
            label: 'Excellent',
            description: 'Your connection is stable.'
        },
        good: {
            icon: Wifi,
            color: 'text-blue-500',
            label: 'Good',
            description: 'Connection is stable.'
        },
        fair: {
            icon: Wifi,
            color: 'text-amber-500',
            label: 'Fair Connection',
            description: 'You might experience slight delays in messaging.'
        },
        poor: {
            icon: AlertTriangle,
            color: 'text-rose-500',
            label: 'Poor Connection',
            description: 'Low bandwidth or high latency detected. Voice calls may drop.'
        },
        offline: {
            icon: WifiOff,
            color: 'text-gray-500',
            label: 'Offline',
            description: 'You are disconnected from the internet.'
        }
    }

    const current = config[quality]
    const Icon = current.icon

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 animate-in fade-in slide-in-from-top-2",
                        quality === 'offline' ? "bg-gray-100 text-gray-600 dark:bg-gray-800" :
                            quality === 'poor' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 border border-rose-200/50" :
                                "bg-amber-50 text-amber-600 dark:bg-amber-900/20 border border-amber-200/50"
                    )}>
                        <Icon className={cn("h-3 w-3", quality === 'poor' && "animate-pulse")} />
                        <span>{current.label}</span>
                        {latency && <span className="opacity-50 font-mono ml-1">{latency}ms</span>}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px] text-xs">
                    <p className="font-semibold mb-1">{current.label}</p>
                    <p className="text-muted-foreground">{current.description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ConnectivityIndicator
