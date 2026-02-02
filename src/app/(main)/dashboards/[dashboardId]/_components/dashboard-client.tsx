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
    Layout,
    Search,
    RefreshCw,
    Eye,
    Edit3,
    Filter,
} from 'lucide-react'
import { updateDashboard, createDashboardCard, populateDashboardWithDefaults } from '@/lib/dashboard-queries'
import { toast } from 'sonner'
import DashboardGrid from './dashboard-grid'
import { Input } from '@/components/ui/input'
import AddCardModal from './add-card-modal'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

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
    const [searchQuery, setSearchQuery] = useState('')
    const [isEditMode, setIsEditMode] = useState(isOwner)
    const [isLiveRefreshing, setIsLiveRefreshing] = useState(false)

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

    const handleAddCard = async (type: string, config: any = {}) => {
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
            config: config,
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
            router.refresh()
        } else {
            toast.error('Failed to populate defaults')
        }
    }

    const handleRefresh = async () => {
        setIsLiveRefreshing(true)
        router.refresh()
        setTimeout(() => {
            setIsLiveRefreshing(false)
            toast.success('Dashboard data synchronized')
        }, 800)
    }

    const filteredCards = cards.filter((card: any) => {
        const query = searchQuery.toLowerCase()
        const cardTitle = (card.config?.title || card.cardType).toLowerCase()
        return cardTitle.includes(query)
    })

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#09090b]">
            <AddCardModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
                onAdd={handleAddCard}
            />

            {/* Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-md sticky top-16 z-50">
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

                <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search widgets, metrics, or insights..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-100/50 dark:bg-zinc-800/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRefresh}
                        className={cn("text-muted-foreground", isLiveRefreshing && "animate-spin text-primary")}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>

                    <div className="h-4 w-[1px] bg-border mx-1" />

                    {isOwner && (
                        <>
                            <div className="flex items-center p-1 bg-slate-100 dark:bg-zinc-800 rounded-lg mr-2">
                                <Button
                                    variant={!isEditMode ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setIsEditMode(false)}
                                    className="h-7 px-3 text-[11px] font-bold uppercase tracking-wider"
                                >
                                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                                    View
                                </Button>
                                <Button
                                    variant={isEditMode ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setIsEditMode(true)}
                                    className="h-7 px-3 text-[11px] font-bold uppercase tracking-wider"
                                >
                                    <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                    Edit
                                </Button>
                            </div>

                            <Button onClick={() => setIsAddCardOpen(true)} className="shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Card
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Management</div>
                                    <DropdownMenuItem onClick={() => setIsAddCardOpen(true)}>
                                        <Plus className="w-4 h-4 mr-2" /> Add New Widget
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handlePopulateDefaults}>
                                        <Layout className="w-4 h-4 mr-2" /> Restore Defaults
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sharing</div>
                                    <DropdownMenuItem>
                                        <Share2 className="w-4 h-4 mr-2" /> Share Dashboard
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            {/* Grid Area */}
            <div className="p-6">
                {filteredCards.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                        <div className="p-4 rounded-full bg-muted">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">
                                {searchQuery ? "No matching widgets found" : "This dashboard is empty"}
                            </h3>
                            <p className="text-muted-foreground max-w-sm">
                                {searchQuery
                                    ? `We couldn't find any widgets matching "${searchQuery}". Try a different term or clear the search.`
                                    : "Add your first card to start visualizing your data."
                                }
                            </p>
                            {searchQuery && (
                                <Button variant="link" onClick={() => setSearchQuery('')}>
                                    Clear Search
                                </Button>
                            )}
                        </div>
                        {!searchQuery && (
                            <div className="flex gap-4">
                                <Button onClick={() => handleAddCard('count')}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Card
                                </Button>
                                <Button variant="outline" onClick={handlePopulateDefaults}>
                                    Populate with Demo Data
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <DashboardGrid
                        cards={filteredCards}
                        setCards={setCards}
                        isEditMode={isEditMode}
                        dashboardId={dashboard.id}
                    />
                )}
            </div>
        </div>
    )
}
