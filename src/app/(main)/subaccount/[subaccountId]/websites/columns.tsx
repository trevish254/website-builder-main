'use client'
import { Badge } from '@/components/ui/badge'
import { FunnelsForSubAccount } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const columns: ColumnDef<FunnelsForSubAccount>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const funnelName = row.getValue('name') || 'Unnamed Website'
            const subAccountId = row.original.subAccountId || 'unknown'
            const funnelId = row.original.id || 'unknown'
            const favicon = row.original.favicon

            return (
                <Link
                    className="flex gap-2 items-center"
                    href={`/subaccount/${subAccountId}/funnels/${funnelId}`}
                >
                    {favicon && (
                        <div className="relative w-8 h-8">
                            <Image
                                src={favicon}
                                fill
                                alt="Favicon"
                                className="object-contain rounded-sm"
                            />
                        </div>
                    )}
                    {funnelName}
                    <ExternalLink size={15} />
                </Link>
            )
        },
    },
    {
        accessorKey: 'updatedAt',
        header: 'Last Updated',
        cell: ({ row }) => {
            try {
                const dateValue = row.original.updatedAt
                const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue

                if (isNaN(date.getTime())) {
                    return <span className="text-muted-foreground">Invalid date</span>
                }

                const formattedDate = `${date.toDateString()} ${date.toLocaleTimeString()}`
                return <span className="text-muted-foreground">{formattedDate}</span>
            } catch (error) {
                return <span className="text-muted-foreground">Date unavailable</span>
            }
        },
    },
    {
        accessorKey: 'published',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.original.published
            const subDomainName = row.original.subDomainName || 'No domain'

            return status ? (
                <Badge variant={'default'}>Live - {subDomainName}</Badge>
            ) : (
                <Badge variant={'secondary'}>Draft</Badge>
            )
        },
    },
]
