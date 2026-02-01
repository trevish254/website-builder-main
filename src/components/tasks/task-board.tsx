'use client'
import React, { useEffect, useState, useRef } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { Task, TaskBoard as TaskBoardType, TaskLane as TaskLaneType } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Plus, ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown, Settings, Table, List, Columns } from 'lucide-react'
import TaskLane from './task-lane'
import TaskTable from './task-table'
import TaskList from './task-list'
import { useRouter } from 'next/navigation'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import CreateLaneForm from '../forms/create-lane-form'
import CreateTaskForm from '../forms/create-task-form'
import { updateLaneOrder, updateTaskOrder } from '@/lib/actions/tasks'
import { toast } from '../ui/use-toast'

type Props = {
    board: TaskBoardType
    lanes: (TaskLaneType & { Task: Task[] })[]
    agencyId?: string
    subAccountId?: string
    teamMembers?: { id: string; name: string; avatarUrl: string }[]
    teams?: any[]
}

const TaskBoard = ({ board, lanes, agencyId, subAccountId, teamMembers = [], teams = [] }: Props) => {
    const [allLanes, setAllLanes] = useState(lanes)
    const [view, setView] = useState<'kanban' | 'table' | 'list'>('kanban')
    const { setOpen } = useModal()
    const router = useRouter()
    const [isDragging, setIsDragging] = useState(false)
    const [activeScrollZone, setActiveScrollZone] = useState<'left' | 'right' | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const scrollInterval = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        setAllLanes(lanes)
    }, [lanes])

    const startScrolling = (direction: 'left' | 'right') => {
        if (scrollInterval.current) return
        scrollInterval.current = setInterval(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft += direction === 'right' ? 25 : -25
            }
        }, 16)
    }

    const stopScrolling = () => {
        if (scrollInterval.current) {
            clearInterval(scrollInterval.current)
            scrollInterval.current = null
        }
    }

    useEffect(() => {
        if (!isDragging) {
            stopScrolling()
            setActiveScrollZone(null)
            return
        }

        const handleMove = (e: MouseEvent | TouchEvent | DragEvent) => {
            let clientX: number

            if ('touches' in e) {
                clientX = e.touches[0].clientX
            } else {
                clientX = (e as MouseEvent).clientX
            }

            const { innerWidth } = window
            const threshold = 150 // Increased capture zone

            if (clientX < threshold) {
                setActiveScrollZone((prev) => {
                    if (prev !== 'left') {
                        stopScrolling()
                        startScrolling('left')
                        return 'left'
                    }
                    return prev
                })
            } else if (clientX > innerWidth - threshold) {
                setActiveScrollZone((prev) => {
                    if (prev !== 'right') {
                        stopScrolling()
                        startScrolling('right')
                        return 'right'
                    }
                    return prev
                })
            } else {
                setActiveScrollZone((prev) => {
                    if (prev !== null) {
                        stopScrolling()
                        return null
                    }
                    return prev
                })
            }
        }

        window.addEventListener('mousemove', handleMove, { capture: true })
        window.addEventListener('dragover', handleMove as any, { capture: true })
        window.addEventListener('touchmove', handleMove, { capture: true })

        return () => {
            window.removeEventListener('mousemove', handleMove, { capture: true })
            window.removeEventListener('dragover', handleMove as any, { capture: true })
            window.removeEventListener('touchmove', handleMove, { capture: true })
            stopScrolling()
        }
    }, [isDragging])

    // Enable Shift + ScrollWheel for horizontal scrolling
    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            // Some browsers/OSs handle this natively, others don't.
            // We explicitely handle Shift + Vertical Scroll -> Horizontal Scroll
            if (e.shiftKey && e.deltaY !== 0) {
                e.preventDefault()
                container.scrollLeft += e.deltaY
            }
        }

        container.addEventListener('wheel', handleWheel, { passive: false })

        return () => {
            container.removeEventListener('wheel', handleWheel)
        }
    }, [])

    const onDragStart = () => {
        setIsDragging(true)
    }

    const onDragEnd = async (result: DropResult) => {
        setIsDragging(false)
        stopScrolling()
        setActiveScrollZone(null)
        const { destination, source, type } = result

        if (!destination) return

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }

        if (type === 'lane') {
            const newLanes = [...allLanes]
            const [removed] = newLanes.splice(source.index, 1)
            newLanes.splice(destination.index, 0, removed)

            setAllLanes(newLanes)

            // Update order in DB
            const updatedLanes = newLanes.map((lane, index) => ({ ...lane, order: index }))
            await updateLaneOrder(updatedLanes)
        } else {
            const newLanes = [...allLanes]
            const sourceLane = newLanes.find((lane) => lane.id === source.droppableId)
            const destLane = newLanes.find((lane) => lane.id === destination.droppableId)

            if (!sourceLane || !destLane) return

            if (source.droppableId === destination.droppableId) {
                const newTasks = [...sourceLane.Task]
                const [removed] = newTasks.splice(source.index, 1)
                newTasks.splice(destination.index, 0, removed)

                sourceLane.Task = newTasks
                setAllLanes(newLanes)

                // Update task order in DB
                const updatedTasks = newTasks.map((task, index) => ({ ...task, order: index }))
                await updateTaskOrder(updatedTasks)
            } else {
                const sourceTasks = [...sourceLane.Task]
                const destTasks = [...destLane.Task]
                const [removed] = sourceTasks.splice(source.index, 1)

                // Update laneId for the moved task
                removed.laneId = destLane.id

                destTasks.splice(destination.index, 0, removed)

                sourceLane.Task = sourceTasks
                destLane.Task = destTasks

                setAllLanes(newLanes)

                // Update task order and laneId in DB
                const updatedDestTasks = destTasks.map((task, index) => ({ ...task, order: index, laneId: destLane.id }))
                const updatedSourceTasks = sourceTasks.map((task, index) => ({ ...task, order: index }))

                // We need to update both lists, but importantly the moved task needs its new laneId
                await updateTaskOrder([...updatedDestTasks, ...updatedSourceTasks])
            }
        }
    }

    const handleAddLane = () => {
        setOpen(
            <CustomModal
                title="Create Section"
                subheading="Sections help you organize your tasks."
            >
                <CreateLaneForm boardId={board.id} />
            </CustomModal>
        )
    }

    const handleAddTask = () => {
        // Default to first lane if available
        const defaultLaneId = allLanes[0]?.id
        if (!defaultLaneId) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please create a lane first',
            })
            return
        }

        setOpen(
            <CustomModal
                title="Create a Task"
                subheading="Add a new task to your board."
                className="max-w-[750px] w-full"
            >
                <CreateTaskForm
                    laneId={defaultLaneId}
                    subAccountUsers={teamMembers}
                    lanes={allLanes}
                    teams={teams}
                />
            </CustomModal>
        )
    }



    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <div className="flex flex-col flex-1 h-full w-full overflow-hidden bg-neutral-50 dark:bg-zinc-950 relative">
                {/* Unified Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm z-10 shrink-0 gap-4">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <h1 className="text-xl font-bold whitespace-nowrap">Tasks</h1>
                        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 hidden md:block" />

                        {/* View Switcher */}
                        <div className="flex items-center gap-1 md:gap-4 text-sm text-muted-foreground overflow-x-auto scrollbar-hide">
                            <button
                                onClick={() => setView('table')}
                                className={`flex items-center gap-2 transition-colors px-2 py-1 rounded-md ${view === 'table' ? 'text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20' : 'hover:text-foreground'}`}
                            >
                                <Table className="w-4 h-4" />
                                <span className="hidden md:inline">Table</span>
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={`flex items-center gap-2 transition-colors px-2 py-1 rounded-md ${view === 'list' ? 'text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20' : 'hover:text-foreground'}`}
                            >
                                <List className="w-4 h-4" />
                                <span className="hidden md:inline">List</span>
                            </button>
                            <button
                                onClick={() => setView('kanban')}
                                className={`flex items-center gap-2 transition-colors px-2 py-1 rounded-md ${view === 'kanban' ? 'text-blue-600 font-medium bg-blue-50 dark:bg-blue-900/20' : 'hover:text-foreground'}`}
                            >
                                <Columns className="w-4 h-4" />
                                <span className="hidden md:inline">Kanban</span>
                            </button>
                        </div>


                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="h-9 pl-9 pr-4 text-small bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-lg w-48 focus:w-64 transition-all focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-muted-foreground/50"
                            />
                        </div>

                        {/* Toolbar Actions */}
                        <div className="flex items-center gap-1 border-r border-neutral-200 dark:border-neutral-800 pr-3 mr-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <Filter className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <ArrowUpDown className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex -space-x-2">
                            {teamMembers.slice(0, 4).map((member) => (
                                <div key={member.id} className="relative">
                                    <img
                                        src={member.avatarUrl}
                                        alt={member.name}
                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 object-cover"
                                    />
                                </div>
                            ))}
                            {teamMembers.length > 4 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-100 flex items-center justify-center text-xs font-medium">
                                    {teamMembers.length - 4}+
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={handleAddTask}
                            className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 text-sm shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Task
                        </Button>
                    </div>
                </div>


                {/* View Container */}
                <div className="flex-1 overflow-hidden relative">
                    {view === 'kanban' ? (
                        <div
                            className="flex-1 overflow-x-auto overflow-y-hidden h-full w-full relative bg-neutral-50 dark:bg-zinc-950 scrollbar-hide"
                            ref={scrollContainerRef}
                        >
                            {/* Auto-scroll Zones - POINTER EVENTS NONE */}
                            {isDragging && (
                                <>
                                    <div
                                        className={`fixed left-0 top-0 bottom-0 w-[120px] z-[100] bg-gradient-to-r from-neutral-500/10 to-transparent transition-all flex items-center justify-start pl-4 pointer-events-none ${activeScrollZone === 'left' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <div className="p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg animate-pulse">
                                            <ChevronLeft className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div
                                        className={`fixed right-0 top-0 bottom-0 w-[120px] z-[100] bg-gradient-to-l from-neutral-500/10 to-transparent transition-all flex items-center justify-end pr-4 pointer-events-none ${activeScrollZone === 'right' ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    >
                                        <div className="p-2 rounded-full bg-white/80 dark:bg-black/80 shadow-lg animate-pulse">
                                            <ChevronRight className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <Droppable droppableId="board" direction="horizontal" type="lane">
                                {(provided) => (
                                    <div
                                        className="flex gap-4 p-4 pr-32 w-max h-full min-h-full"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {allLanes.map((lane, index) => (
                                            <TaskLane
                                                key={lane.id}
                                                lane={lane}
                                                index={index}
                                                agencyId={agencyId}
                                                subAccountId={subAccountId}
                                                allLanes={allLanes}
                                                teamMembers={teamMembers}
                                                teams={teams}
                                            />
                                        ))}
                                        {provided.placeholder}
                                        <Button
                                            onClick={handleAddLane}
                                            variant="outline"
                                            className="min-w-[220px] h-[50px] border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-transparent hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all font-medium text-muted-foreground hover:text-foreground shrink-0"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Section
                                        </Button>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ) : view === 'table' ? (
                        <div className="h-full overflow-y-auto bg-neutral-50 dark:bg-zinc-950 p-4">
                            <TaskTable lanes={allLanes} teamMembers={teamMembers} />
                        </div>
                    ) : view === 'list' ? (
                        <div className="h-full overflow-y-auto bg-neutral-50 dark:bg-zinc-950">
                            <TaskList lanes={allLanes} teamMembers={teamMembers} />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            View not found
                        </div>
                    )}
                </div>
            </div>
        </DragDropContext>
    )
}

export default TaskBoard
