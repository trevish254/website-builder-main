'use client'

import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Task, TaskLane as TaskLaneType } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Plus, Trash, Edit, CheckCircle } from 'lucide-react'
import TaskCard from './task-card'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import CreateTaskForm from '../forms/create-task-form'
import CreateLaneForm from '../forms/create-lane-form'
import { deleteTaskLane } from '@/lib/actions/tasks'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

type Props = {
    lane: TaskLaneType & { Task: Task[] }
    index: number
    agencyId?: string
    subAccountId?: string
    teamMembers: { id: string; name: string; avatarUrl: string }[]
    allLanes: (TaskLaneType & { Task: Task[] })[]
    teams?: any[]
}

const TaskLane = ({ lane, index, agencyId, subAccountId, teamMembers, allLanes, teams = [] }: Props) => {
    const { setOpen } = useModal()
    const router = useRouter()

    const handleAddTask = () => {
        setOpen(
            <CustomModal
                title="Create a Task"
                subheading="Add a new task to your board."
                className="max-w-[750px] w-full"
            >
                <CreateTaskForm
                    laneId={lane.id}
                    subAccountUsers={teamMembers}
                    lanes={allLanes}
                    teams={teams}
                />
            </CustomModal>
        )
    }

    return (
        <Draggable draggableId={lane.id} index={index}>
            {(provided, snapshot) => (
                <div
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    className={`
                        h-full min-h-0 max-h-full min-w-[220px] max-w-[220px] flex flex-col 
                        rounded-2xl p-2
                        bg-neutral-100/50 dark:bg-neutral-900/50
                        border border-neutral-200 dark:border-neutral-800
                        shadow-sm
                        ${snapshot.isDragging
                            ? 'opacity-50 z-[100]'
                            : 'transition-[background-color,border-color,box-shadow,opacity] duration-300 ease-out'}
                    `}
                >
                    <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between mb-2 px-1 cursor-grab active:cursor-grabbing group shrink-0"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 transition-colors">
                                {lane.name}
                            </span>
                            <span className="text-[10px] font-black tracking-tighter text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50 min-w-[28px] text-center">
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setOpen(
                                                <CustomModal
                                                    title="Edit Section Details"
                                                    subheading="Edit the name and color of your section."
                                                >
                                                    <CreateLaneForm
                                                        boardId={lane.boardId}
                                                        defaultData={lane}
                                                    />
                                                </CustomModal>
                                            )
                                        }
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 cursor-pointer hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-900/30"
                                        onClick={async () => {
                                            const response = await deleteTaskLane(lane.id)
                                            if (response.error) {
                                                toast({
                                                    variant: 'destructive',
                                                    title: 'Error',
                                                    description: response.error,
                                                })
                                            } else {
                                                toast({
                                                    title: 'Success',
                                                    description: 'Section deleted successfully',
                                                })
                                                router.refresh()
                                            }
                                        }}
                                    >
                                        <Trash className="w-4 h-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Droppable droppableId={lane.id} type="task">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`
                                    flex-1 flex flex-col gap-2 overflow-y-auto pb-2 px-1
                                    transition-all duration-300 rounded-xl mt-2
                                    ${snapshot.isDraggingOver
                                        ? 'bg-blue-500/[0.08] dark:bg-blue-500/[0.12] ring-2 ring-blue-500/20 ring-inset'
                                        : 'bg-transparent'}
                                `}
                            >
                                {(lane.Task || []).map((task, index) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={index}
                                        subAccountUsers={teamMembers}
                                        lanes={allLanes}
                                        teams={teams}
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
