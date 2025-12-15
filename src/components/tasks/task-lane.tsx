'use client'

import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Task, TaskLane as TaskLaneType } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreVertical, Plus } from 'lucide-react'
import TaskCard from './task-card'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import CreateTaskForm from '../forms/create-task-form'

type Props = {
    lane: TaskLaneType & { Task: Task[] }
    index: number
    agencyId?: string
    subAccountId?: string
    teamMembers: { id: string; name: string; avatarUrl: string }[]
}

const TaskLane = ({ lane, index, agencyId, subAccountId, teamMembers }: Props) => {
    const { setOpen } = useModal()

    const handleAddTask = () => {
        setOpen(
            <CustomModal
                title="Create a Task"
                subheading="Add a new task to your board."
            >
                <CreateTaskForm laneId={lane.id} subAccountUsers={teamMembers} />
            </CustomModal>
        )
    }

    return (
        <Draggable draggableId={lane.id} index={index}>
            {(provided, snapshot) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={`h-full min-w-[300px] max-w-[300px] flex flex-col rounded-lg transition-colors duration-300 ${snapshot.isDragging ? 'opacity-50' : ''}`}
                >
                    <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between mb-4 px-1 cursor-grab active:cursor-grabbing group"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                {lane.name}
                            </span>
                            <span className="text-xs text-muted-foreground bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                                {(lane.Task || []).length.toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                onClick={handleAddTask}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <Droppable droppableId={lane.id} type="task">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`
                                    flex-1 flex flex-col gap-3 overflow-y-auto pb-4 px-1
                                    transition-colors duration-200 rounded-lg
                                    ${snapshot.isDraggingOver ? 'bg-neutral-100/50 dark:bg-neutral-800/50' : ''}
                                `}
                            >
                                {(lane.Task || []).map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        subAccountUsers={teamMembers}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            )}
        </Draggable>
    )
}

export default TaskLane
