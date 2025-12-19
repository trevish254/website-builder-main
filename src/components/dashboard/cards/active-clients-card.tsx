'use client'

import { CardDescription, CardTitle } from '@/components/ui/card'
import { Contact2 } from 'lucide-react'

type Props = {
    title?: string
    count?: number
}

export default function ActiveClientsCard({
    title = 'Active Clients',
    count = 0
}: Props) {
    return (
        <div className="h-full w-full relative p-4">
            <CardDescription className="text-sm mb-2">{title}</CardDescription>
            <CardTitle className="text-4xl">{count}</CardTitle>
            <Contact2 className="absolute right-6 top-6 text-muted-foreground w-6 h-6" />
        </div>
    )
}
