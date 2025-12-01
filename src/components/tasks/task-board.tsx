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
    teamMembers: { id: string; name: string; avatarUrl: string }[]
}

const TaskBoard = ({ board, lanes, agencyId, subAccountId, teamMembers }: Props) => {
    const [allLanes, setAllLanes] = useState(lanes)
    const { setOpen } = useModal()
    const router = useRouter()

    useEffect(() => {
        setAllLanes(lanes)
    }, [lanes])

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
                title="Create a Lane"
                subheading="Lanes help you organize your tasks."
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
            >
                <CreateTaskForm laneId={defaultLaneId} subAccountUsers={teamMembers} />
            </CustomModal>
        )
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full w-full overflow-hidden">
                <div className="flex items-center justify-between mb-4 p-4">
                    <h1 className="text-2xl font-bold">{board.name}</h1>
                    <div className="flex gap-2">
                        <Button onClick={handleAddLane}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lane
                        </Button>
                        <Button onClick={handleAddTask} variant="secondary">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>
                <Droppable droppableId="board" direction="horizontal" type="lane">
                    {(provided) => (
                        <div
                            className="flex gap-4 overflow-x-auto h-full p-4"
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
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    )
}

export default TaskBoard
