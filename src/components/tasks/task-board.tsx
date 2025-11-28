'use client'

import React, { useEffect, useState } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { Task, TaskBoard as TaskBoardType, TaskLane as TaskLaneType } from '@/lib/database.types'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import TaskLane from './task-lane'
import { useRouter } from 'next/navigation'

type Props = {
    board: TaskBoardType
    lanes: (TaskLaneType & { Task: Task[] })[]
    agencyId?: string
    subAccountId?: string
}

const TaskBoard = ({ board, lanes, agencyId, subAccountId }: Props) => {
    const [allLanes, setAllLanes] = useState(lanes)
    const router = useRouter()

    useEffect(() => {
        setAllLanes(lanes)
    }, [lanes])

    const onDragEnd = (result: DropResult) => {
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
            // TODO: Update lane order in DB
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
                // TODO: Update task order in DB
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
                // TODO: Update task order and laneId in DB
            }
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full w-full">
                <div className="flex items-center justify-between mb-4 p-4">
                    <h1 className="text-2xl font-bold">{board.name}</h1>
                    <Button onClick={() => { /* TODO: Open Create Lane Modal */ }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lane
                    </Button>
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
