'use client'

import React from 'react'
import BalanceCard from './balance-card'
import StatCard from './stat-card'
import RecentActivities from './recent-activities'
import { Wallet, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SimulateTransactionsButton from './simulate-transactions-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import MpesaSettingsForm from './mpesa-settings-form'
import { Settings } from 'lucide-react'
import IncomeChart from './income-polar-bar'

type Props = {
    balance: number
    transactions: any[]
    agencyId?: string
    subAccountId?: string
    mpesaSettings?: any
}

const DashboardGrid = ({ balance, transactions, agencyId, subAccountId, mpesaSettings }: Props) => {
    // Calculate stats
    const totalEarnings = transactions
        .filter(t => t.type === 'DEPOSIT' || t.type === 'C2B')
        .reduce((acc, t) => acc + t.amount, 0)

    const totalSpending = transactions
        .filter(t => t.type === 'WITHDRAWAL' || t.type === 'B2C' || t.type === 'B2B')
        .reduce((acc, t) => acc + t.amount, 0)

    return (
        <div className="p-4 space-y-6 bg-muted/10 min-h-screen">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Finance Dashboard</h2>
                <div className="flex items-center gap-2">
                    <SimulateTransactionsButton agencyId={agencyId} subAccountId={subAccountId} />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>MPESA Settings</DialogTitle>
                            </DialogHeader>
                            <MpesaSettingsForm
                                agencyId={agencyId}
                                subAccountId={subAccountId}
                                defaultValues={mpesaSettings}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Left Column: Balance & Wallets */}
                <div className="space-y-6">
                    <BalanceCard
                        balance={balance}
                        agencyId={agencyId}
                        subAccountId={subAccountId}
                    />

                    {/* Wallets Placeholder */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Wallets | Total 1 wallet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/20 p-3 rounded-lg border flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🇰🇪</span>
                                        <span className="font-bold">KES</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">Active</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">KES {balance.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Default</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Spending Limit Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Monthly Spending Limit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-orange-500 w-[25%]" />
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="font-bold">KES {totalSpending.toLocaleString()}</span>
                                <span className="text-muted-foreground">spent of KES 500,000</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Column: Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <StatCard
                        title="Total Earnings"
                        amount={`KES ${totalEarnings.toLocaleString()}`}
                        change="+7% This month"
                        changeType="positive"
                        icon={Wallet}
                        className="bg-orange-500 text-white border-none"
                        iconClassName="bg-white/20 text-white"
                    />
                    <StatCard
                        title="Total Spending"
                        amount={`KES ${totalSpending.toLocaleString()}`}
                        change="5% This month"
                        changeType="negative"
                        icon={CreditCard}
                        chartData={[120, 110, 130, 100, 90, 105, 95, 80, 85, 70]}
                    />
                    <StatCard
                        title="Total Income"
                        amount={`KES ${totalEarnings.toLocaleString()}`}
                        change="+8% This month"
                        changeType="positive"
                        icon={DollarSign}
                        chartData={[65, 70, 68, 75, 80, 85, 82, 90, 95, 100]}
                    />
                    <StatCard
                        title="Total Revenue"
                        amount={`KES ${(totalEarnings - totalSpending).toLocaleString()}`}
                        change="+4% This month"
                        changeType="positive"
                        icon={TrendingUp}
                    />
                </div>

                {/* Right Column: Charts */}
                <div className="col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Total Income</CardTitle>
                            <p className="text-xs text-muted-foreground">View your income in a certain period of time</p>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <IncomeChart />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Section: Recent Activities & Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="bg-black text-white border-none relative overflow-hidden h-[200px]">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div className="flex justify-between items-start">
                                <div className="text-2xl font-bold">My Cards</div>
                                <Button size="sm" variant="secondary" className="h-8 text-xs">+ Add new</Button>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="bg-zinc-800 p-4 rounded-xl w-full relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="bg-white/10 px-2 py-0.5 rounded text-[10px]">Active</div>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                        </div>
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-4">**** **** **** 1234</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-3">
                    <RecentActivities transactions={transactions} />
                </div>
            </div>
        </div>
    )
}

export default DashboardGrid
