'use client'
import { Badge } from '@/components/ui/badge'
import { FunnelsForSubAccount } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export const columns: ColumnDef<FunnelsForSubAccount>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const funnelName = row.getValue('name') || 'Unnamed Funnel'
      const subAccountId = row.original.subAccountId || 'unknown'
      const funnelId = row.original.id || 'unknown'
      
      return (
        <Link
          className="flex gap-2 items-center"
          href={`/subaccount/${subAccountId}/funnels/${funnelId}`}
        >
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
        // Debug logging to see the actual data structure
        console.log('🔍 Funnel data for date formatting:', {
          id: row.original.id,
          name: row.original.name,
          updatedAt: row.original.updatedAt,
          updatedAtType: typeof row.original.updatedAt
        })
        
        // Convert string to Date object if needed
        const dateValue = row.original.updatedAt
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.error('❌ Invalid date value:', dateValue)
          return <span className="text-muted-foreground">Invalid date</span>
        }
        
        const formattedDate = `${date.toDateString()} ${date.toLocaleTimeString()}`
        return <span className="text-muted-foreground">{formattedDate}</span>
      } catch (error) {
        console.error('❌ Error formatting date:', error, 'Data:', row.original)
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
