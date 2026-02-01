'use client'

import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Task } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { Calendar, User as UserIcon, MessageSquare, Paperclip, MoreVertical, Edit, Trash, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import CustomModal from '../global/custom-modal'
import CreateTaskForm from '../forms/create-task-form'
import { deleteTask } from '@/lib/actions/tasks'
import { toast } from '../ui/use-toast'
import { TaskBoard, TaskLane } from '@/lib/database.types'

type Props = {
    task: Task & { TaskAssignee?: { userId: string, User?: { avatarUrl: string, name: string } }[] }
    index: number

    subAccountUsers?: { id: string; name: string; avatarUrl: string }[]
    lanes?: TaskLane[]
    teams?: any[]
}

const TaskCard = ({ task, index, subAccountUsers, lanes, teams }: Props) => {
    const { setOpen } = useModal()
    const router = useRouter()
    const assignee = subAccountUsers?.find(u => u.id === task.assignedUserId)

    const getPriorityColor = (priority?: string | null) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
        }
    }

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className=""
                >
                    <Card
                        className={`
                            group/card cursor-grab active:cursor-grabbing 
                            border border-neutral-200 dark:border-neutral-800 shadow-sm 
                            bg-white dark:bg-zinc-900 rounded-xl overflow-hidden
                            ${task.coverImage ? 'aspect-square flex flex-col' : ''}
                            ${snapshot.isDragging
                                ? 'shadow-2xl ring-2 ring-blue-500/40 opacity-100 z-[100] !transition-none'
                                : 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30'
                            }
                        `}
                    >

                        {/* Hover Actions */}
                        <div className="absolute top-2 right-2 z-20 hidden group-hover/card:flex items-center gap-1 opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-sm rounded-full"
                            >
                                <CheckCircle className="w-3 h-3 text-muted-foreground hover:text-green-500" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 bg-white/50 hover:bg-white dark:bg-black/50 dark:hover:bg-black/80 backdrop-blur-sm rounded-full"
                                    >
                                        <MoreVertical className="w-3 h-3 text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setOpen(
                                                <CustomModal
                                                    title="Edit Task Details"
                                                    subheading="Edit your task title, description and more."
                                                    className="max-w-[750px] w-full"
                                                >
                                                    <CreateTaskForm
                                                        laneId={task.laneId}
                                                        subAccountUsers={subAccountUsers}
                                                        lanes={lanes || []}
                                                        teams={teams || []}
                                                        defaultData={task}
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
                                            const response = await deleteTask(task.id)
                                            if (response.error) {
                                                toast({
                                                    variant: 'destructive',
                                                    title: 'Error',
                                                    description: response.error,
                                                })
                                            } else {
                                                toast({
                                                    title: 'Success',
                                                    description: 'Task deleted successfully',
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

                        {task.coverImage && (
                            <div className="w-full flex-1 relative min-h-0">
                                <img
                                    src={task.coverImage}
                                    alt="Task Cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <CardContent className="p-3 flex flex-col gap-2 shrink-0 h-fit">
                            {/* Header: Assignee & Date */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {task.TaskAssignee && task.TaskAssignee.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {task.TaskAssignee.slice(0, 3).map((assignee) => (
                                                <Avatar key={assignee.userId} className="w-6 h-6 border-2 border-white dark:border-neutral-900">
                                                    <AvatarImage src={assignee.User?.avatarUrl} />
                                                    <AvatarFallback>{assignee.User?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                    ) : assignee ? (
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src={assignee.avatarUrl} />
                                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center">
                                            <UserIcon className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">
                                            {task.TaskAssignee && task.TaskAssignee.length > 0
                                                ? `${task.TaskAssignee.length} Assignees`
                                                : assignee
                                                    ? assignee.name
                                                    : 'Unassigned'}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {task.dueDate ? format(new Date(task.dueDate), 'MM/dd hh:mm a') : format(new Date(task.createdAt), 'MM/dd hh:mm a')}
                                        </span>
                                    </div>
                                </div>
                                {task.priority && (
                                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 border-none ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </Badge>
                                )}
                            </div>

                            {/* Body: Title & Description */}
                            <div className="flex flex-col gap-1">
                                <span className="text-sm text-muted-foreground line-clamp-3 font-medium text-neutral-700 dark:text-neutral-300">
                                    {task.title}
                                </span>
                                {task.description && (
                                    <span className="text-xs text-muted-foreground/70 line-clamp-2">
                                        {task.description}
                                    </span>
                                )}
                            </div>

                            {/* Footer: Tags & Assignee (Bottom Right) */}
                            <div className="flex items-center justify-between mt-1">
                                <div className="flex flex-wrap gap-2">
                                    {task.tags && task.tags.map((tag) => (
                                        <div key={tag} className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 rounded-md">
                                            {/* Placeholder for icon mapping, using generic for now if no specific match */}
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-[10px] font-medium text-muted-foreground">{tag}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                                        <MessageSquare className="w-3 h-3" />
                                        <span className="text-[10px] font-medium">0</span>
                                    </div>
                                    <div className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                                        <Paperclip className="w-3 h-3" />
                                        <span className="text-[10px] font-medium">0</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}

export default TaskCard
