'use client'

import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Task, TaskLane as TaskLaneType } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreVertical, Plus } from 'lucide-react'
import TaskCard from './task-card'
import { Button } from '@/components/ui/button'

type Props = {
    lane: TaskLaneType & { Task: Task[] }
    index: number
    agencyId?: string
    subAccountId?: string
}

const TaskLane = ({ lane, index, agencyId, subAccountId }: Props) => {
    return (
        <Draggable draggableId={lane.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className="h-full min-w-[300px] max-w-[300px] flex flex-col rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                    <div
                        {...provided.dragHandleProps}
                        className="p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: lane.color || '#000' }}
                            />
                            <span className="font-semibold">{lane.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {lane.Task.length}
                            </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    <Droppable droppableId={lane.id} type="task">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="flex-1 p-2 flex flex-col gap-2 overflow-y-auto"
                            >
                                {lane.Task.map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={index}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <div className="p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => { /* TODO: Open Create Task Modal */ }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Task
                        </Button>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default TaskLane
