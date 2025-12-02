'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    CreditCard,
    Mail,
    TrendingUp,
    Users,
    ExternalLink,
} from 'lucide-react'
import Link from 'next/link'

interface ClientHealthData {
    id: string
    name: string
    healthScore: number
    lastLogin: string
    paymentStatus: 'Paid' | 'Pending' | 'Overdue'
    funnelPerformance: number
    supportTickets: number
}

// Mock data for 4 clients with varying health scores
const mockClients: ClientHealthData[] = [
    {
        id: 'client-001',
        name: 'Acme Corporation',
        healthScore: 92,
        lastLogin: '2 hours ago',
        paymentStatus: 'Paid',
        funnelPerformance: 87,
        supportTickets: 1,
    },
    {
        id: 'client-002',
        name: 'TechStart Inc',
        healthScore: 68,
        lastLogin: '1 day ago',
        paymentStatus: 'Pending',
        funnelPerformance: 64,
        supportTickets: 3,
    },
    {
        id: 'client-003',
        name: 'Global Solutions',
        healthScore: 45,
        lastLogin: '5 days ago',
        paymentStatus: 'Overdue',
        funnelPerformance: 42,
        supportTickets: 7,
    },
    {
        id: 'client-004',
        name: 'Digital Ventures',
        healthScore: 28,
        lastLogin: '2 weeks ago',
        paymentStatus: 'Overdue',
        funnelPerformance: 23,
        supportTickets: 12,
    },
]

const getHealthColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
}

const getHealthBgColor = (score: number) => {
    if (score >= 70) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
}

const getHealthStatus = (score: number) => {
    if (score >= 70) return 'Healthy'
    if (score >= 50) return 'Warning'
    return 'At Risk'
}

const getPaymentStatusColor = (status: string) => {
    if (status === 'Paid') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}

const ClientHealthScoreCard = () => {
    const handleSendCheckIn = (clientName: string) => {
        // Simulated email action
        alert(`Check-in email sent to ${clientName}`)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Client Health Score Dashboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockClients.map((client) => (
                        <div
                            key={client.id}
                            className={`p-4 rounded-lg border ${getHealthBgColor(client.healthScore)} transition-all hover:shadow-md`}
                        >
                            {/* Header with Name and Alert */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-sm mb-1">{client.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-bold ${getHealthColor(client.healthScore)}`}>
                                            {client.healthScore}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            / 100
                                        </span>
                                    </div>
                                </div>
                                {client.healthScore < 50 && (
                                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="text-xs font-medium">Alert</span>
                                    </div>
                                )}
                            </div>

                            {/* Health Score Progress Bar */}
                            <div className="mb-3">
                                <Progress
                                    value={client.healthScore}
                                    className="h-2"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Status: <span className={`font-medium ${getHealthColor(client.healthScore)}`}>
                                        {getHealthStatus(client.healthScore)}
                                    </span>
                                </p>
                            </div>

                            {/* Health Indicators */}
                            <div className="space-y-2 mb-3">
                                {/* Last Login */}
                                <div className="flex items-center gap-2 text-xs">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">Last login:</span>
                                    <span className="font-medium">{client.lastLogin}</span>
                                </div>

                                {/* Payment Status */}
                                <div className="flex items-center gap-2 text-xs">
                                    <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">Payment:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(client.paymentStatus)}`}>
                                        {client.paymentStatus}
                                    </span>
                                </div>

                                {/* Funnel Performance */}
                                <div className="flex items-center gap-2 text-xs">
                                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">Funnel:</span>
                                    <span className="font-medium">{client.funnelPerformance}%</span>
                                </div>

                                {/* Support Tickets */}
                                <div className="flex items-center gap-2 text-xs">
                                    <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">Tickets:</span>
                                    <span className={`font-medium ${client.supportTickets > 5 ? 'text-red-600 dark:text-red-400' : ''}`}>
                                        {client.supportTickets} open
                                    </span>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs h-8"
                                    asChild
                                >
                                    <Link href={`#`}>
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View Details
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs h-8"
                                    onClick={() => handleSendCheckIn(client.name)}
                                >
                                    <Mail className="h-3 w-3 mr-1" />
                                    Check-in
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default ClientHealthScoreCard
