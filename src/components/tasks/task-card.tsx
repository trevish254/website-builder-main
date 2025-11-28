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
    task: Task
    index: number
}

const TaskCard = ({ task, index }: Props) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="p-3 pb-0 space-y-0">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-medium leading-tight">
                                    {task.title}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-2">
                            <div className="flex flex-wrap gap-1 mb-2">
                                {task.tags && task.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-5">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    {task.assignedUserId ? (
                                        <Avatar className="w-6 h-6">
                                            <AvatarImage src="" /> {/* TODO: Fetch user avatar */}
                                            <AvatarFallback className="text-[10px]">U</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                            <UserIcon className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                    )}
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
