'use client'

import React from 'react'
import { Task } from '@/lib/database.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { format } from 'date-fns'

type Props = {
    task: Task
    style?: React.CSSProperties
    onClick?: () => void
    teamMembers?: any[]
}

const EventCard = ({ task, style, onClick, teamMembers }: Props) => {
    // Find assignee
    const assignee = teamMembers?.find(user => user.id === task.assignedUserId)

    // Determine color based on priority or random hash if needed.
    // Using simplified logic for now to match designs:
    const getEventStyle = () => {
        // Different pastel colors for visual variety, maybe based on something deterministic like ID char code
        const colors = [
            'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
            'bg-orange-100 border-orange-200 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-300',
            'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300',
            'bg-green-100 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
        ]
        // simple deterministic pick
        const index = (task.id.charCodeAt(0) + task.id.charCodeAt(task.id.length - 1)) % colors.length
        return colors[index]
    }

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <div
                    className={`
            absolute m-1 p-2 rounded-md border text-xs cursor-pointer hover:brightness-95 transition-all
            flex flex-col gap-1 shadow-sm overflow-hidden
            ${getEventStyle()}
          `}
                    style={style}
                    onClick={onClick}
                >
                    <div className="font-semibold line-clamp-1">{task.title}</div>
                    {task.description && (
                        <div className="text-[10px] opacity-80 line-clamp-2 hidden sm:block">
                            {task.description}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-1">
                        <span className="text-[10px] font-mono opacity-70">
                            {task.dueDate ? format(new Date(task.dueDate), 'h:mm a') : 'No time'}
                        </span>
                        {assignee && (
                            <Avatar className="w-4 h-4 border border-white dark:border-black">
                                <AvatarImage src={assignee.avatarUrl} />
                                <AvatarFallback className="text-[8px]">{assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 z-50">
                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-semibold">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">Assigned to:</span>
                        {assignee ? (
                            <div className="flex items-center gap-1">
                                <Avatar className="w-5 h-5">
                                    <AvatarImage src={assignee.avatarUrl} />
                                    <AvatarFallback className="text-[8px]">{assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium">{assignee.name}</span>
                            </div>
                        ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                        )}
                    </div>
                    {task.dueDate && (
                        <div className="mt-1 text-xs text-muted-foreground">
                            Due: {format(new Date(task.dueDate), 'PPP p')}
                        </div>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default EventCard
