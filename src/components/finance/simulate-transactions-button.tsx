'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { simulateTransactions } from '@/lib/actions/finance'
import { toast } from 'sonner'
import { Loader2, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
    agencyId?: string
    subAccountId?: string
}

const SimulateTransactionsButton = ({ agencyId, subAccountId }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSimulate = async () => {
        setIsLoading(true)
        try {
            await simulateTransactions(agencyId, subAccountId)
            toast.success('Simulated transactions created!')
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || 'Failed to simulate transactions')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSimulate}
            disabled={isLoading}
            className="ml-auto"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Simulate Data
        </Button>
    )
}

export default SimulateTransactionsButton
