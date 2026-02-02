'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Copy, Edit, Trash2, ChevronUp, ChevronDown, GripVertical, EyeOff } from 'lucide-react'
import { updateDashboardCard, deleteDashboardCard, createDashboardCard } from '@/lib/dashboard-queries'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import CountCard from '@/components/dashboard/cards/count-card'
import GraphCard from '@/components/dashboard/cards/graph-card'
import ListCard from '@/components/dashboard/cards/list-card'
import NotesCard from '@/components/dashboard/cards/notes-card'
import DiscussionCard from '@/components/dashboard/cards/discussion-card'
import IncomeCard from '@/components/dashboard/cards/income-card'
import ActiveClientsCard from '@/components/dashboard/cards/active-clients-card'
import AgencyGoalCard from '@/components/dashboard/cards/agency-goal-card'
import HeatmapCard from '@/components/dashboard/cards/heatmap-card'
import PressureCard from '@/components/dashboard/cards/pressure-card'
import RiskCard from '@/components/dashboard/cards/risk-card'
import ScoreCard from '@/components/dashboard/cards/score-card'
import SummaryCard from '@/components/dashboard/cards/summary-card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ResponsiveGridLayout = WidthProvider(Responsive)

type Props = {
    cards: any[]
    setCards: (cards: any) => void
    isEditMode: boolean
    dashboardId: string
}

export default function DashboardGrid({ cards, setCards, isEditMode, dashboardId }: Props) {
    const [isDragging, setIsDragging] = useState(false)
    const [activeScrollZone, setActiveScrollZone] = useState<'top' | 'bottom' | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(1200)

    useEffect(() => {
        if (!containerRef.current) return
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])
    const scrollState = useRef({
        isActive: false,
        direction: 'bottom' as 'top' | 'bottom',
        speed: 0,
        lastMouseX: 0,
        lastMouseY: 500,
        scrollYAtLastMove: 0, // NEW: Anchor for projection math
        rafId: null as number | null
    })

    // CRITICAL REFS for High-Fidelity Interaction:
    const lastLayoutRef = useRef<any[]>([])
    const layoutSnapShot = useRef<any[]>([]) // Captures the 'Home' positions before a drag/resize
    const isInteracting = useRef(false)

    // Map database cards to RGL layout
    const generatedLayout = useMemo(() => {
        return cards.map(card => ({
            i: card.id,
            x: card.positionX || 0,
            y: card.positionY || 0,
            w: card.width || 4,
            h: card.height || 4,
        }))
    }, [cards])

    // Generate layouts for all breakpoints to prevent overlap on resize
    const layouts = useMemo(() => ({
        lg: generatedLayout,
        md: generatedLayout,
        sm: generatedLayout,
        xs: generatedLayout,
        xxs: generatedLayout
    }), [generatedLayout])

    // DYNAMIC COMPACTION: 
    // Always use null (no compaction) to prevent automatic rearrangement
    // This gives users full control over card placement
    const currentCompactType = null

    const stopScrolling = useCallback(() => {
        scrollState.current.isActive = false
        if (scrollState.current.rafId) {
            cancelAnimationFrame(scrollState.current.rafId)
            scrollState.current.rafId = null
        }
    }, [])

    const scrollLoop = useCallback(() => {
        if (!scrollState.current.isActive) return

        const speed = scrollState.current.speed
        window.scrollBy(0, speed)

        // Force scroll update for library internal offsets
        window.dispatchEvent(new Event('scroll'))

        // Jitter to wake up high-frequency event listeners
        const jitter = Math.random() > 0.5 ? 0.02 : -0.02

        // PROJECTION MATH:
        // virtualY = currentPhysicalY + (howMuchWeHaveScrolledSinceWeLastMovedTheMouse)
        const currentScrollY = window.scrollY
        const scrollDelta = currentScrollY - scrollState.current.scrollYAtLastMove

        const eventOptions: any = {
            clientX: scrollState.current.lastMouseX + jitter,
            clientY: scrollState.current.lastMouseY + scrollDelta + jitter,
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1,
            which: 1,
            button: 0
        }

        const mouseEv = new MouseEvent('mousemove', eventOptions)
            ; (mouseEv as any)._isSynthetic = true

        // Dispatch to all layers where RGL/Draggable might be listening
        window.dispatchEvent(mouseEv)
        document.dispatchEvent(mouseEv)
        document.body.dispatchEvent(mouseEv)

        scrollState.current.rafId = requestAnimationFrame(scrollLoop)
    }, [])

    const startScrolling = useCallback((direction: 'top' | 'bottom', speed: number) => {
        scrollState.current.direction = direction
        scrollState.current.speed = speed

        if (!scrollState.current.isActive) {
            scrollState.current.isActive = true
            scrollState.current.rafId = requestAnimationFrame(scrollLoop)
        }
    }, [scrollLoop])

    const handleMove = useCallback((e: any) => {
        if (!e) return

        // Robust check for synthetic events to prevent recursion
        const isSynth = e?._isSynthetic || e?.nativeEvent?._isSynthetic || (e?.nativeEvent as any)?._isSynthetic
        if (isSynth) return

        // Robust coordinate extraction 
        const clientX = e.clientX ?? e.nativeEvent?.clientX ?? e.touches?.[0]?.clientX
        const clientY = e.clientY ?? e.nativeEvent?.clientY ?? e.touches?.[0]?.clientY

        if (clientX === undefined || clientY === undefined) return

        // REAL MOVE: Update tracking and reset the projection anchor
        scrollState.current.lastMouseX = clientX
        scrollState.current.lastMouseY = clientY
        scrollState.current.scrollYAtLastMove = window.scrollY

        if (!isDragging) {
            stopScrolling()
            return
        }

        const { innerHeight } = window
        const threshold = 140
        const maxSpeed = 45

        if (clientY < threshold && window.scrollY > 10) {
            const intensity = (threshold - clientY) / threshold
            const speed = -Math.max(10, Math.min(intensity * maxSpeed, maxSpeed))
            setActiveScrollZone('top')
            startScrolling('top', speed)
        } else if (clientY > innerHeight - threshold) {
            const intensity = (clientY - (innerHeight - threshold)) / threshold
            const speed = Math.max(10, Math.min(intensity * maxSpeed, maxSpeed))
            setActiveScrollZone('bottom')
            startScrolling('bottom', speed)
        } else {
            setActiveScrollZone(null)
            stopScrolling()
        }
    }, [isDragging, startScrolling, stopScrolling])

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMove, { capture: true })
            window.addEventListener('touchmove', handleMove, { capture: true })
        } else {
            // CRITICAL: Stop the loop and reset the projecter the instant dragging ends
            stopScrolling()
            setActiveScrollZone(null)
            scrollState.current.accumulatedScroll = 0
            window.removeEventListener('mousemove', handleMove, { capture: true })
            window.removeEventListener('touchmove', handleMove, { capture: true })
        }

        return () => {
            window.removeEventListener('mousemove', handleMove, { capture: true })
            window.removeEventListener('touchmove', handleMove, { capture: true })
        }
    }, [isDragging, handleMove, stopScrolling])

    const performLiquidSync = useCallback((newLayout: any[], activeItem: any) => {
        if (!layoutSnapShot.current.length || !activeItem) return newLayout

        const processed = [...newLayout]
        const collider = activeItem

        // Pass 1: Restoration & Initial Collision Detection
        for (let i = 0; i < processed.length; i++) {
            const item = processed[i]
            if (item.i === collider.i) continue

            const home = layoutSnapShot.current.find(h => h.i === item.i)
            if (!home) continue

            // Check if the collider is currently sitting on the ITEM'S HOME
            const homeIsBlockedByActive = (
                collider.x < home.x + home.w &&
                collider.x + collider.w > home.x &&
                collider.y < home.y + home.h &&
                collider.y + collider.h > home.y
            )

            if (!homeIsBlockedByActive) {
                // Return to base if the active item isn't in the way
                item.x = home.x
                item.y = home.y
            }
        }

        // Pass 2: SOLID PHYSICS (Pushing)
        // We run multiple passes to handle 'Cascading' pushes (A pushes B, B pushes C)
        for (let pass = 0; pass < 2; pass++) {
            for (let i = 0; i < processed.length; i++) {
                const item = processed[i]
                if (item.i === collider.i) continue

                const isOverlapping = (
                    collider.x < item.x + item.w &&
                    collider.x + collider.w > item.x &&
                    collider.y < item.y + item.h &&
                    collider.y + collider.h > item.y
                )

                if (isOverlapping) {
                    // "BUMP" DOWN: Shift the covered item down to clear the active item
                    item.y = Math.ceil(collider.y + collider.h)
                }
            }
        }

        return processed
    }, [])

    const onLayoutChange = (newLayout: any[]) => {
        lastLayoutRef.current = newLayout

        const updatedCards = cards.map(card => {
            const layoutItem = newLayout.find(l => l.i === card.id)
            if (layoutItem) {
                return {
                    ...card,
                    positionX: layoutItem.x,
                    positionY: layoutItem.y,
                    width: layoutItem.w,
                    height: layoutItem.h
                }
            }
            return card
        })
        setCards(updatedCards)
    }

    const syncLayoutToDb = async (finalLayout: any[]) => {
        if (!finalLayout) return

        const updates = finalLayout.map(item => {
            const original = cards.find(c => c.id === item.i)
            if (original && (
                original.positionX !== item.x ||
                original.positionY !== item.y ||
                original.width !== item.w ||
                original.height !== item.h
            )) {
                return updateDashboardCard(item.i, {
                    positionX: item.x,
                    positionY: item.y,
                    width: item.w,
                    height: item.h,
                })
            }
            return null
        }).filter(Boolean)

        if (updates.length > 0) {
            try {
                await Promise.all(updates)
            } catch (err) {
                console.error("Layout sync failed:", err)
                toast.error("Failed to save layout changes")
            }
        }
    }

    const handleDelete = async (cardId: string) => {
        if (!confirm('Are you sure?')) return
        const res = await deleteDashboardCard(cardId)
        if (res.success) {
            setCards((prev: any[]) => prev.filter(c => c.id !== cardId))
            toast.success('Card deleted')
        }
    }

    const handleDuplicate = async (card: any) => {
        const newCard = await createDashboardCard({
            dashboardId,
            cardType: card.cardType,
            positionX: card.positionX,
            positionY: card.positionY + card.height,
            width: card.width,
            height: card.height,
            config: card.config,
        })

        if (newCard) {
            setCards((prev: any[]) => [...prev, newCard])
            toast.success('Card duplicated')
        }
    }

    const renderCardContent = (card: any) => {
        const config = card.config || {}
        switch (card.cardType) {
            case 'count': return <CountCard {...config} />
            case 'graph': return <GraphCard {...config} />
            case 'list': return <ListCard {...config} />
            case 'notes': return <NotesCard cardId={card.id} {...config} />
            case 'discussion': return <DiscussionCard cardId={card.id} config={config} />
            case 'income': return <IncomeCard {...config} />
            case 'potential-income': return <IncomeCard {...config} />
            case 'active-clients': return <ActiveClientsCard {...config} />
            case 'agency-goal': return <AgencyGoalCard {...config} />
            case 'heatmap': return <HeatmapCard {...config} />
            case 'pressure': return <PressureCard {...config} />
            case 'risk': return <RiskCard {...config} />
            case 'score': return <ScoreCard {...config} />
            case 'summary': return <SummaryCard {...config} />
            default:
                return (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md border border-dashed text-xs select-none">
                        {card.cardType} Component
                    </div>
                )
        }
    }

    return (
        <div ref={containerRef} className="relative min-h-screen pb-[100vh] transition-all duration-300 bg-slate-50 dark:bg-[#09090b]">
            <style dangerouslySetInnerHTML={{
                __html: `
                .react-grid-placeholder {
                    background: rgba(59, 130, 246, 0.15) !important;
                    border-radius: 16px !important;
                    border: 3px dashed rgba(59, 130, 246, 0.5) !important;
                    opacity: 1 !important;
                    z-index: 2 !important;
                    transition: all 0.2s ease !important;
                    animation: pulse-placeholder 1.5s ease-in-out infinite;
                }
                @keyframes pulse-placeholder {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                .react-grid-item {
                    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
                }
                .react-grid-item.react-draggable-dragging {
                    z-index: 1000 !important;
                    transition: none !important;
                    opacity: 0.9 !important;
                }
                .react-grid-item.react-grid-placeholder {
                    background: rgba(59, 130, 246, 0.15) !important;
                }
                .react-resizable-handle {
                    z-index: 100 !important;
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .react-grid-item:hover .react-resizable-handle {
                    opacity: 1;
                }
                .react-resizable-handle-s {
                    bottom: 0px;
                    left: 20px;
                    right: 20px;
                    height: 8px;
                    cursor: ns-resize;
                    background: transparent;
                }
                .react-resizable-handle-e {
                    top: 20px;
                    bottom: 20px;
                    right: 0px;
                    width: 8px;
                    cursor: ew-resize;
                    background: transparent;
                }
                .react-resizable-handle-w {
                    top: 20px;
                    bottom: 20px;
                    left: 0px;
                    width: 8px;
                    cursor: ew-resize;
                    background: transparent;
                }
                .react-resizable-handle-se, .react-resizable-handle-sw {
                    width: 12px;
                    height: 12px;
                    background: rgba(148, 163, 184, 0.4);
                    border-radius: 50%;
                    bottom: 4px;
                }
                .react-resizable-handle-se { right: 4px; cursor: nwse-resize; }
                .react-resizable-handle-sw { left: 4px; cursor: nesw-resize; }
                
                /* Visual indicator dots for edges */
                .react-resizable-handle-s::after,
                .react-resizable-handle-e::after,
                .react-resizable-handle-w::after {
                    content: '';
                    position: absolute;
                    background: rgba(148, 163, 184, 0.4);
                    border-radius: 4px;
                }
                .react-resizable-handle-s::after { bottom: 2px; left: 50%; width: 30px; height: 3px; transform: translateX(-50%); }
                .react-resizable-handle-e::after { right: 2px; top: 50%; height: 30px; width: 3px; transform: translateY(-50%); }
                .react-resizable-handle-w::after { left: 2px; top: 50%; height: 30px; width: 3px; transform: translateY(-50%); }
            `}} />

            {/* Hot Zones Visuals */}
            {isDragging && (
                <>
                    <div className={cn(
                        "fixed top-0 left-0 right-0 h-[140px] z-[9999] bg-gradient-to-b from-slate-400/10 to-transparent transition-all flex items-start justify-center pt-8 pointer-events-none duration-300",
                        activeScrollZone === 'top' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
                    )}>
                        <div className="p-3 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-[0_0_30px_rgba(148,163,184,0.3)] border border-slate-500/20 animate-bounce backdrop-blur-md">
                            <ChevronUp className="w-10 h-10 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                    <div className={cn(
                        "fixed bottom-0 left-0 right-0 h-[140px] z-[9999] bg-gradient-to-t from-slate-400/10 to-transparent transition-all flex items-end justify-center pb-8 pointer-events-none duration-300",
                        activeScrollZone === 'bottom' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
                    )}>
                        <div className="p-3 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-[0_0_30px_rgba(148,163,184,0.3)] border border-slate-500/20 animate-bounce backdrop-blur-md">
                            <ChevronDown className="w-10 h-10 text-slate-600 dark:text-slate-400" />
                        </div>
                    </div>
                </>
            )}

            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 800, sm: 600, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 12, sm: 12, xs: 4, xxs: 1 }}
                rowHeight={100}
                width={containerWidth}
                margin={[16, 16]}
                isDraggable={isEditMode}
                isResizable={isEditMode}
                draggableHandle=".drag-handle"
                compactType={currentCompactType}
                preventCollision={true}
                autoSize={true}
                measureBeforeMount={true}
                resizeHandles={['s', 'e', 'w', 'se', 'sw']}
                onLayoutChange={onLayoutChange}
                onDragStart={(l) => {
                    setIsDragging(true)
                    isInteracting.current = true
                    layoutSnapShot.current = JSON.parse(JSON.stringify(l))
                }}
                onDrag={(l, old, newItem, pl, e) => {
                    handleMove(e)
                    // Let react-grid-layout handle collision prevention
                    // Don't apply custom liquid sync during drag
                }}
                onDragStop={(l) => {
                    setIsDragging(false)
                    isInteracting.current = false
                    stopScrolling()
                    syncLayoutToDb(l || lastLayoutRef.current)
                    layoutSnapShot.current = []
                }}
                onResizeStart={(l) => {
                    setIsDragging(true)
                    isInteracting.current = true
                    layoutSnapShot.current = JSON.parse(JSON.stringify(l))
                }}
                onResize={(l, old, newItem, pl, e) => {
                    handleMove(e)
                    // Let react-grid-layout handle collision prevention
                    // Don't apply custom liquid sync during resize
                }}
                onResizeStop={(l) => {
                    setIsDragging(false)
                    isInteracting.current = false
                    stopScrolling()
                    syncLayoutToDb(l || lastLayoutRef.current)
                    layoutSnapShot.current = []
                }}
            >
                {cards.map(card => (
                    <div key={card.id} className={cn(
                        "transition-shadow duration-200",
                        isDragging ? "opacity-90" : "opacity-100"
                    )}>
                        <Card className={cn(
                            "h-full w-full flex flex-col relative group overflow-hidden bg-white dark:bg-zinc-900/50 shadow-sm border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700/50 transition-all duration-300",
                            isDragging && "shadow-2xl ring-2 ring-primary/20 scale-[1.01] border-primary/30"
                        )}>
                            {isEditMode && (
                                <div className="absolute top-0 left-0 right-0 p-2 z-[51] flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {/* Left: Move Handle */}
                                    <div className="drag-handle p-1.5 cursor-grab active:cursor-grabbing bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm rounded-md pointer-events-auto hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>

                                    {/* Right: Actions */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm border shadow-sm pointer-events-auto">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => handleDuplicate(card)}>
                                                <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setCards((prev: any[]) => prev.filter(c => c.id !== card.id))
                                                toast.success('Card hidden from view')
                                            }}>
                                                <EyeOff className="w-3.5 h-3.5 mr-2" /> Hide Card
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(card.id)} className="text-destructive">
                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            <CardContent className="h-full w-full p-4 overflow-hidden">
                                {renderCardContent(card)}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </ResponsiveGridLayout>
        </div>
    )
}
