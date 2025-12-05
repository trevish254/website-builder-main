'use client'

import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { Task } from '@/lib/database.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, User as UserIcon } from 'lucide-react'
import { format } from 'date-fns'

type Props = {
    task: Task & { TaskAssignee?: { userId: string, User?: { avatarUrl: string, name: string } }[] }
    index: number
    subAccountUsers?: { id: string; name: string; avatarUrl: string }[]
}

const TaskCard = ({ task, index, subAccountUsers }: Props) => {
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
                    className="mb-2" // Add margin bottom to separate cards
                >
                    <Card
                        className={`
                            hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border-none shadow-sm bg-white dark:bg-neutral-900 overflow-hidden
                            ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500/20 rotate-2 scale-105 opacity-90 z-50' : ''}
                        `}
                    >
                        {task.coverImage && (
                            <div className="w-full h-32 relative">
                                <img
                                    src={task.coverImage}
                                    alt="Task Cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <CardContent className="p-4 flex flex-col gap-3">
                            {/* Header: Assignee & Date */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {task.TaskAssignee && task.TaskAssignee.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {task.TaskAssignee.slice(0, 3).map((assignee) => (
                                                <Avatar key={assignee.userId} className="w-8 h-8 border-2 border-white dark:border-neutral-900">
                                                    <AvatarImage src={assignee.User?.avatarUrl} />
                                                    <AvatarFallback>{assignee.User?.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>
                                    ) : assignee ? (
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={assignee.avatarUrl} />
                                            <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                            <UserIcon className="w-4 h-4 text-muted-foreground" />
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

                                {task.TaskAssignee && task.TaskAssignee.length > 0 ? (
                                    <div className="flex -space-x-2">
                                        {task.TaskAssignee.map((assignee) => (
                                            <Avatar key={assignee.userId} className="w-6 h-6 border-2 border-white dark:border-neutral-900">
                                                <AvatarImage src={assignee.User?.avatarUrl} />
                                                <AvatarFallback className="text-[10px]">{assignee.User?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                ) : assignee && (
                                    <div className="flex -space-x-2">
                                        <Avatar className="w-6 h-6 border-2 border-white dark:border-neutral-900">
                                            <AvatarImage src={assignee.avatarUrl} />
                                            <AvatarFallback className="text-[10px]">{assignee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    )
}

export default TaskCard
