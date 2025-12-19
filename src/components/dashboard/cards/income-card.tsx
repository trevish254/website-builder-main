'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'

type Props = {
    title?: string
    amount?: number
    currency?: string
    year?: number
}

export default function IncomeCard({
    title = 'Income',
    amount = 0,
    currency = '$',
    year = new Date().getFullYear()
}: Props) {
    return (
        <div className="h-full w-full relative p-4">
            <CardDescription className="text-sm mb-2">{title}</CardDescription>
            <CardTitle className="text-4xl mb-2">
                {currency}{amount.toFixed(2)}
            </CardTitle>
            <small className="text-xs text-muted-foreground">
                For the year {year}
            </small>
            <DollarSign className="absolute right-6 top-6 text-muted-foreground w-6 h-6" />
        </div>
    )
}
