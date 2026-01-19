'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    ArrowLeft,
    Settings,
    Share2,
    Plus,
    Save,
    Trash2,
    Layout
} from 'lucide-react'
import { updateDashboard, createDashboardCard, populateDashboardWithDefaults } from '@/lib/dashboard-queries'
import { toast } from 'sonner'
import DashboardGrid from './dashboard-grid'
import { Input } from '@/components/ui/input'
import AddCardModal from './add-card-modal'

type Props = {
    dashboard: any
    userId: string
    isOwner: boolean
}

export default function DashboardClient({ dashboard, userId, isOwner }: Props) {
    const router = useRouter()
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [title, setTitle] = useState(dashboard.name)
    const [cards, setCards] = useState(dashboard.DashboardCard || [])
    const [isAddCardOpen, setIsAddCardOpen] = useState(false)

    // Sync cards when server updates (e.g. after populate)
    useEffect(() => {
        setCards(dashboard.DashboardCard || [])
    }, [dashboard.DashboardCard])

    const handleTitleUpdate = async () => {
        if (title === dashboard.name) {
            setIsEditingTitle(false)
            return
        }

        const updated = await updateDashboard(dashboard.id, { name: title })
        if (updated) {
            toast.success('Dashboard renamed')
            setIsEditingTitle(false)
        } else {
            toast.error('Failed to rename dashboard')
        }
    }

    const handleAddCard = async (type: string) => {
        // Find best position (next available slot)
        const width = 4
        const height = 4
        const cols = 12

        // Simple collision detection
        const checkCollision = (x: number, y: number, w: number, h: number) => {
            return cards.some((c: any) => {
                const cx = c.positionX || 0
                const cy = c.positionY || 0
                const cw = c.width || 4
                const ch = c.height || 4

                return x < cx + cw && x + w > cx && y < cy + ch && y + h > cy
            })
        }

        let x = 0
        let y = 0

        while (true) {
            // Check if current position is valid
            if (x + width <= cols && !checkCollision(x, y, width, height)) {
                break // Found a spot!
            }

            // Move to next column
            x++

            // Wrap to next row
            if (x + width > cols) {
                x = 0
                y++
                // Optimization: Move y to the bottom of the lowest card in the current row slice?
                // For now, simple y++ scan is fast enough given grid size.
            }
        }

        const newCard = await createDashboardCard({
            dashboardId: dashboard.id,
            cardType: type,
            positionX: x,
            positionY: y,
            width,
            height,
            config: {},
        })

        if (newCard) {
            setCards((prev: any) => [...prev, newCard])
            toast.success('Card added')
        }
    }

    const handlePopulateDefaults = async () => {
        const res = await populateDashboardWithDefaults(dashboard.id)
        if (res.success) {
            toast.success('Default cards added')
            // Refresh local state - hard reload is easiest to get all new cards cleanly
            router.refresh()
            // We could also re-fetch cards, but router.refresh() handles the server component data
        } else {
            toast.error('Failed to populate defaults')
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-background">
            <AddCardModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
                onAdd={handleAddCard}
            />

            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-16 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboards')}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    {isEditingTitle ? (
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleUpdate}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleUpdate()}
                            className="w-64 font-bold text-xl h-auto py-1"
                            autoFocus
                        />
                    ) : (
                        <h1
                            className={`text-2xl font-bold ${isOwner ? 'cursor-pointer hover:underline decoration-dashed underline-offset-4' : ''}`}
                            onClick={() => isOwner && setIsEditingTitle(true)}
                        >
                            {title}
                        </h1>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isOwner && (
                        <>
                            <Button onClick={() => setIsAddCardOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Card
                            </Button>

                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Grid Area */}
            <div className="p-6">
                {cards.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-muted">
                            <Layout className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">This dashboard is empty</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Add your first card to start visualizing your data.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={() => handleAddCard('count')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Card
                            </Button>
                            <Button variant="outline" onClick={handlePopulateDefaults}>
                                Populate with Demo Data
                            </Button>
                        </div>
                    </div>
                ) : (
                    <DashboardGrid
                        cards={cards}
                        setCards={setCards}
                        isEditMode={isOwner}
                        dashboardId={dashboard.id}
                    />
                )}
            </div>
        </div>
    )
}
