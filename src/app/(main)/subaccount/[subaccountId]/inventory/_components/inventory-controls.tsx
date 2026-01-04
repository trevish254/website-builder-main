'use client'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/lib/hooks/use-debounce' // Assuming this exists or I'll implement a simple one

interface InventoryControlsProps {
    subAccountId: string
}

const InventoryControls: React.FC<InventoryControlsProps> = ({ subAccountId }) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentView = searchParams.get('view') || 'grid'
    const currentSearch = searchParams.get('query') || ''

    const [searchTerm, setSearchTerm] = useState(currentSearch)

    // Simple debounce implementation if hook doesn't exist
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== currentSearch) {
                const params = new URLSearchParams(searchParams.toString())
                if (searchTerm) params.set('query', searchTerm)
                else params.delete('query')
                params.set('page', '1')
                router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm, subAccountId, router, searchParams, currentSearch])

    const setView = (view: 'grid' | 'list') => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('view', view)
        router.push(`/subaccount/${subAccountId}/inventory?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-lg p-1 bg-background">
                <Button
                    variant={currentView === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setView('grid')}
                    className="h-8 w-8"
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                    variant={currentView === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setView('list')}
                    className="h-8 w-8"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <div className="relative w-full sm:w-[300px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                />
            </div>
        </div>
    )
}

export default InventoryControls
