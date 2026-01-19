import { useEffect, useRef } from 'react'
import { GridStack } from 'gridstack'
import 'gridstack/dist/gridstack.min.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, GripHorizontal, MoreVertical, Copy, Edit, Trash2 } from 'lucide-react'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Props = {
    cards: any[]
    setCards: (cards: any) => void
    isEditMode: boolean
    dashboardId: string
}

export default function DashboardGrid({ cards, setCards, isEditMode, dashboardId }: Props) {
    const gridRef = useRef<GridStack | null>(null)
    const refs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    useEffect(() => {
        // Initialize GridStack
        if (!gridRef.current) {
            gridRef.current = GridStack.init({
                column: 12,
                cellHeight: 100,
                margin: 0, // We control spacing via CSS override below
                float: false, // Enable gravity - cards float up to fill gaps
                disableOneColumnMode: false, // Allow stacking on mobile
                animate: true,
                staticGrid: !isEditMode, // Initial state
                alwaysShowResizeHandle: false, // Allow resize handle to be shown on hover via CSS?
                // Actually gridstack handles hover for resize handles well if we just enable it.
                resizable: {
                    handles: 'e, se, s, sw, w',
                    autoHide: true,
                    scroll: true // Enable native scroll
                } as any,
                draggable: {
                    handle: '.drag-handle',
                    scroll: true // Enable native scroll
                } as any
            } as any)

            // Bind Events
            // --- Decoupled Scroll Manager (Plan K: Stable Hybrid) ---
            class ScrollManager {
                private rafId: number | null = null;
                private isActive = false;
                private mouseY = 0;
                private readonly edgeThreshold = 100;
                private readonly baseSpeed = 25;

                constructor() {
                    this.loop = this.loop.bind(this);
                    this.handleMouseMove = this.handleMouseMove.bind(this);
                }

                public start() {
                    if (this.isActive) return;
                    this.isActive = true;
                    document.addEventListener('mousemove', this.handleMouseMove, { passive: true });
                    document.addEventListener('touchmove', this.handleMouseMove as any, { passive: true });
                    this.rafId = requestAnimationFrame(this.loop);
                }

                public stop() {
                    this.isActive = false;
                    if (this.rafId) {
                        cancelAnimationFrame(this.rafId);
                        this.rafId = null;
                    }
                    document.removeEventListener('mousemove', this.handleMouseMove);
                    document.removeEventListener('touchmove', this.handleMouseMove as any);
                }

                private handleMouseMove(e: MouseEvent | TouchEvent) {
                    if ('touches' in e) {
                        this.mouseY = e.touches[0].clientY;
                    } else {
                        this.mouseY = (e as MouseEvent).clientY;
                    }
                }

                private loop() {
                    if (!this.isActive) return;

                    const viewportHeight = window.innerHeight;
                    const relativeY = this.mouseY;

                    let scrollAmount = 0;

                    // Detect Proximity
                    if (relativeY > viewportHeight - this.edgeThreshold) {
                        // Bottom Edge
                        const intensity = (relativeY - (viewportHeight - this.edgeThreshold)) / this.edgeThreshold;
                        scrollAmount = Math.min(intensity * this.baseSpeed, this.baseSpeed);
                    } else if (relativeY < this.edgeThreshold) {
                        // Top Edge
                        const intensity = (this.edgeThreshold - relativeY) / this.edgeThreshold;
                        scrollAmount = -Math.min(intensity * this.baseSpeed, this.baseSpeed);
                    }

                    // Apply Scroll (Window)
                    if (scrollAmount !== 0) {
                        window.scrollBy({ top: scrollAmount, behavior: 'instant' });
                    }

                    if (this.isActive) {
                        this.rafId = requestAnimationFrame(this.loop);
                    }
                }
            }

            const scrollManager = new ScrollManager();

            // Bind Events
            gridRef.current.on('dragstart resizestart', (event: Event, el: HTMLElement) => {
                if (gridRef.current) {
                    // 1. Pre-Expand Grid (The "Infinite" Illusion)
                    const currentMaxRow = gridRef.current.engine.getRow();
                    const expansionBuffer = 50;
                    const newMinRow = currentMaxRow + expansionBuffer;

                    gridRef.current.opts.minRow = newMinRow;

                    // 2. Start Scroll Loop (Plan K)
                    scrollManager.start();
                }
            });

            gridRef.current.on('dragstop resizestop', (event: Event, el: HTMLElement) => {
                // Stop Scroll Loop
                scrollManager.stop();
            });

            // Handle layout changes (drag/resize)
            gridRef.current.on('change', async (event: Event, items: any[]) => {
                if (!items) return

                // Sync changes to server
                for (const item of items) {
                    await updateDashboardCard(item.id, {
                        positionX: item.x,
                        positionY: item.y,
                        width: item.w,
                        height: item.h,
                    })
                }
            })











            // separate mouse tracker that runs always when dragging
            const updateMousePosition = (e: MouseEvent | TouchEvent | DragEvent) => {
                let clientY = 0;
                if ('touches' in e) {
                    clientY = e.touches[0]?.clientY || 0;
                } else {
                    clientY = (e as MouseEvent).clientY;
                }
                scrollState.current.mouseY = clientY;

                // Calculate speed immediately
                const viewportHeight = window.innerHeight
                const edgeThreshold = 150 // Larger threshold for easier activation
                const maxSpeed = 35 // Slightly faster max speed

                if (clientY < edgeThreshold) {
                    // Scroll Up
                    const intensity = (edgeThreshold - clientY) / edgeThreshold
                    scrollState.current.speed = -Math.max(2, Math.round(intensity * maxSpeed))
                } else if (clientY > viewportHeight - edgeThreshold) {
                    // Scroll Down
                    const intensity = (clientY - (viewportHeight - edgeThreshold)) / edgeThreshold
                    scrollState.current.speed = Math.max(2, Math.round(intensity * maxSpeed))
                } else {
                    scrollState.current.speed = 0
                }
            }



            // Bind to grid events to start/stop the loop
            // Bind to grid events to start/stop the loop
            // Bind to grid events to start/stop the loop



        }
    }, [])

    // Sync Edit Mode (now represents ownership/access)
    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.setStatic(!isEditMode)
            if (isEditMode) {
                gridRef.current.enableMove(true)
                gridRef.current.enableResize(true)
            } else {
                gridRef.current.enableMove(false)
                gridRef.current.enableResize(false)
            }
        }
    }, [isEditMode])

    // Sync Cards (Adding/Removing)
    useEffect(() => {
        if (!gridRef.current) return

        const grid = gridRef.current

        // Check for new cards to add
        // We defer this slightly to ensure DOM is ready
        setTimeout(() => {
            cards.forEach(card => {
                // Check if grid knows about it
                const existingNode = grid.engine.nodes.find(n => n.id === card.id)
                if (!existingNode) {
                    // React has rendered the element, upgrade it to a widget
                    const el = document.getElementById(card.id)
                    if (el) {
                        grid.makeWidget(el)
                    }
                }
            })
        }, 0)

        // Check for removed cards
        grid.engine.nodes.forEach(node => {
            if (!cards.find(c => c.id === node.id)) {
                if (node.el && !document.contains(node.el)) {
                    grid.removeWidget(node.el, false)
                } else if (node.el) {
                    grid.removeWidget(node.el)
                }
            }
        })

    }, [cards])

    const handleDelete = async (cardId: string) => {
        if (!confirm('Are you sure?')) return
        const res = await deleteDashboardCard(cardId)
        if (res.success) {
            // Pre-cleanup: Tell GridStack to forget this node but NOT remove from DOM
            const grid = gridRef.current
            if (grid) {
                const node = grid.engine.nodes.find(n => n.id === cardId)
                if (node && node.el) {
                    grid.removeWidget(node.el, false)
                }
            }

            setCards((prev: any[]) => prev.filter(c => c.id !== cardId))
            toast.success('Card deleted')
        }
    }

    const handleDuplicate = async (card: any) => {
        // Create duplicate
        // Find best position (simple scan or offset)
        // For simplicity, let's offset by y+1 or let gridstack handle collision if we set autoPosition (but we are setting explicit x/y)
        // Let's just create it at 0,max_y+1 to be safe for now, or use the smarter logic from dashboard-client if we move it here.
        // Or just let gridstack float it.
        const newCard = await createDashboardCard({
            dashboardId,
            cardType: card.cardType,
            positionX: card.positionX,
            positionY: card.positionY + card.height, // Place below original
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
        switch (card.cardType) {
            case 'count':
                return <CountCard
                    title={card.config.title || 'Metric'}
                    metric={card.config.metric}
                    icon={card.config.icon}
                />
            case 'graph':
                return <GraphCard
                    title={card.config.title || 'Chart'}
                    chartType={card.config.chartType}
                    dataSource={card.config.dataSource}
                />
            case 'list':
                return <ListCard
                    title={card.config.title || 'List'}
                    dataSource={card.config.dataSource}
                    limit={card.config.limit}
                />
            case 'notes':
                return <NotesCard
                    cardId={card.id}
                    title={card.config.title || 'Notes'}
                    content={card.config.content}
                />
            case 'discussion':
                return <DiscussionCard
                    cardId={card.id}
                    title={card.config.title || 'Discussion'}
                    config={card.config}
                />
            case 'income':
                return <IncomeCard
                    title={card.config.title || 'Income'}
                    amount={card.config.amount || 0}
                    currency={card.config.currency || '$'}
                    year={card.config.year || new Date().getFullYear()}
                />
            case 'potential-income':
                return <IncomeCard
                    title={card.config.title || 'Potential Income'}
                    amount={card.config.amount || 0}
                    currency={card.config.currency || '$'}
                    year={card.config.year || new Date().getFullYear()}
                />
            case 'active-clients':
                return <ActiveClientsCard
                    title={card.config.title || 'Active Clients'}
                    count={card.config.count || 0}
                />
            case 'agency-goal':
                return <AgencyGoalCard
                    title={card.config.title || 'Agency Goal'}
                    current={card.config.current || 0}
                    goal={card.config.goal || 20}
                />
            default:
                return (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md border border-dashed text-xs select-none">
                        {card.cardType} Component
                    </div>
                )
        }
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .grid-stack-item-content {
                    padding: 20px 10px !important;
                }
            `}} />
            <div className="grid-stack relative min-h-[500px] pb-[50vh]">
                {/* We manually map cards to grid-stack-items. 
                 Gridstack will attach to these on init. 
             */}
                {cards.map(card => (
                    <div
                        key={card.id}
                        id={card.id}
                        className="grid-stack-item group"
                        gs-id={card.id}
                        gs-x={card.positionX}
                        gs-y={card.positionY}
                        gs-w={card.width}
                        gs-h={card.height}
                    >
                        <div className="grid-stack-item-content h-full w-full">
                            <Card className="h-full w-full flex flex-col relative overflow-hidden transition-all hover:ring-2 hover:ring-primary/20 bg-white dark:bg-secondary/20 shadow-sm">
                                {/* Hover Controls */}
                                <div className={cn(
                                    "absolute top-2 right-2 z-50 flex items-center gap-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100",
                                    !isEditMode && "hidden"
                                )}>
                                    <div className="drag-handle cursor-grab p-1.5 hover:bg-muted rounded text-muted-foreground bg-background/80 backdrop-blur-sm shadow-sm ring-1 ring-border">
                                        <GripHorizontal className="w-4 h-4" />
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="h-7 w-7 shadow-sm ring-1 ring-border bg-background/80 backdrop-blur-sm"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem disabled>
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDuplicate(card)}>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(card.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <CardContent className="h-full w-full p-4 overflow-hidden pt-4">
                                    {renderCardContent(card)}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
