'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
    CreditCard,
    Users,
    Layers,
    Calendar,
    Zap,
    CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UsageCardProps {
    title: string
    value: string | number
    description?: string
    icon: React.ElementType
    footer?: React.ReactNode
    progress?: number
    limit?: number
    type?: 'default' | 'premium'
}

const UsageCard = ({
    title,
    value,
    description,
    icon: Icon,
    footer,
    progress,
    limit,
    type = 'default'
}: UsageCardProps) => {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-xl group border-none bg-card/50 backdrop-blur-sm",
            type === 'premium' && "ring-2 ring-emerald-500/20"
        )}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
                <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    type === 'premium' ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                    <Icon className="w-4 h-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                {description && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        {description}
                    </p>
                )}
                {(progress !== undefined && limit !== undefined) && (
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{progress} of {limit} used</span>
                            <span className="font-medium text-primary">{Math.round((progress / limit) * 100)}%</span>
                        </div>
                        <Progress value={(progress / limit) * 100} className="h-2" />
                    </div>
                )}
                {footer && <div className="mt-4 pt-4 border-t border-border/50">{footer}</div>}
            </CardContent>
            {type === 'premium' && (
                <div className="absolute top-0 right-0 p-1">
                    <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500 animate-pulse" />
                </div>
            )}
        </Card>
    )
}

interface UsageDashboardProps {
    currentPlan: string
    teamCount: number
    subaccountCount: number
    subaccountLimit: number
    cost: string
    renewalDate: string
    isPremium?: boolean
}

const UsageDashboard = ({
    currentPlan,
    teamCount,
    subaccountCount,
    subaccountLimit,
    cost,
    renewalDate,
    isPremium = false
}: UsageDashboardProps) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 px-4">
                <UsageCard
                    title="Current Plan"
                    value={currentPlan}
                    description={isPremium ? "Active Premium Access" : "Active Plan"}
                    icon={CheckCircle2}
                    type={isPremium ? 'premium' : 'default'}
                    footer={
                        <div className="flex items-center gap-2">
                            <Badge variant={isPremium ? "default" : "secondary"} className={cn(
                                isPremium ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                            )}>
                                {isPremium ? "Pro Feature Set" : "Standard"}
                            </Badge>
                        </div>
                    }
                />
                <UsageCard
                    title="Team Members"
                    value={teamCount}
                    description="Active users"
                    icon={Users}
                />
                <UsageCard
                    title="Subaccounts"
                    value={subaccountCount}
                    description="Projects & Entities"
                    icon={Layers}
                    progress={subaccountCount}
                    limit={subaccountLimit === 0 ? 100 : subaccountLimit} // Fallback if 0
                />
                <UsageCard
                    title="Plan Cost"
                    value={cost}
                    description="Per month"
                    icon={CreditCard}
                />
                <UsageCard
                    title="Renewal Date"
                    value={renewalDate}
                    description="Next billing cycle"
                    icon={Calendar}
                />
            </div>

            <div className="px-4">
                <div className="bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent p-8 rounded-3xl border border-emerald-500/10 shadow-inner relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">
                                Upgrade and get more out of <span className="text-emerald-500">Aventis</span>
                            </h3>
                            <p className="text-muted-foreground text-lg">
                                Scale your agency with unlimited resources and dedicated support.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Efficiency</span>
                                    <span className="text-xl font-bold">+45%</span>
                                </div>
                                <div className="w-[1px] h-8 bg-border/50" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Growth</span>
                                    <span className="text-xl font-bold">2.4x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />
                </div>
            </div>
        </div>
    )
}

export default UsageDashboard
