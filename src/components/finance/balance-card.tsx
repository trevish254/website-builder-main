'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRightLeft, ArrowDownLeft, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import SendMoneyForm from './send-money-form'
import ReceiveMoneyForm from './receive-money-form'
import { cn } from '@/lib/utils'

type Props = {
    balance: number
    currency?: string
    agencyId?: string
    subAccountId?: string
}

const BalanceCard = ({ balance, currency = 'KES', agencyId, subAccountId }: Props) => {
    const [isSendOpen, setIsSendOpen] = useState(false)
    const [isReceiveOpen, setIsReceiveOpen] = useState(false)

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 bg-black text-white border-none shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ArrowRightLeft className="w-32 h-32" />
            </div>
            <CardHeader>
                <CardTitle className="text-gray-400 font-medium text-sm">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold mb-2">
                    {currency} {balance.toLocaleString()}
                </div>
                <div className="flex items-center text-green-400 text-sm mb-6">
                    <div className="bg-green-400/20 p-1 rounded mr-2">
                        <ArrowDownLeft className="w-3 h-3" />
                    </div>
                    <span>+5% than last month</span>
                </div>

                <div className="flex gap-4">
                    <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700">
                                <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Send Money</DialogTitle>
                            </DialogHeader>
                            <SendMoneyForm agencyId={agencyId} subAccountId={subAccountId} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex-1 bg-white text-black hover:bg-gray-200">
                                <ArrowDownLeft className="mr-2 h-4 w-4" /> Request
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Request Money</DialogTitle>
                            </DialogHeader>
                            <ReceiveMoneyForm agencyId={agencyId} subAccountId={subAccountId} />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}

export default BalanceCard
