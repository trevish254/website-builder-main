'use client'

import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { Task, TaskBoard as TaskBoardType, TaskLane as TaskLaneType } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TaskLane from './task-lane'
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
}

const TaskBoard = ({ board, lanes, agencyId, subAccountId, teamMembers = [] }: Props) => {
    const [allLanes, setAllLanes] = useState(lanes)
    const { setOpen } = useModal()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setAllLanes(lanes)
    }, [lanes])

    if (!isMounted) return null

    const onDragEnd = async (result: DropResult) => {
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
                <CreateTaskForm laneId={defaultLaneId} subAccountUsers={teamMembers} lanes={allLanes} />
            </CustomModal>
        )
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-neutral-50 dark:bg-zinc-950">
            {/* Main Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleAddTask}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Task
                    </Button>
                </div>
            </div>

            {/* Sub Header - View Toggles & Filters */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button className="flex items-center gap-2 text-blue-600 font-medium">
                            <div className="w-4 h-4 border-2 border-blue-600 rounded-sm" />
                            Table
                        </button>
                        <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                            <div className="w-4 h-4 border-2 border-current rounded-sm" />
                            List View
                        </button>
                        <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                            <div className="w-4 h-4 border-2 border-current rounded-sm" />
                            Kanban
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
                    <Button variant="outline" size="icon" className="rounded-full w-8 h-8 ml-2">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="board" direction="horizontal" type="lane">
                    {(provided) => (
                        <div
                            className="flex gap-6 overflow-x-auto h-full p-6"
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
                                    teamMembers={teamMembers}
                                    allLanes={allLanes}
                                />
                            ))}
                            {provided.placeholder}
                            <Button
                                onClick={handleAddLane}
                                variant="outline"
                                className="min-w-[300px] h-[50px] border-dashed"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Section
                            </Button>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}

export default TaskBoard
