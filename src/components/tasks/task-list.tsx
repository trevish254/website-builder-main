'use client'

import React from 'react'
import { Task, TaskLane } from '@/lib/database.types'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, User as UserIcon, Paperclip, MoreVertical, Circle, ChevronRight, Hash } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

type Props = {
    lanes: (TaskLane & { Task: Task[] })[]
    teamMembers: { id: string; name: string; avatarUrl: string }[]
}

const TaskList = ({ lanes, teamMembers }: Props) => {
    const getPriorityColor = (priority?: string | null) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
            case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
            case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
            default: return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-900/20'
        }
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            <Accordion type="multiple" defaultValue={lanes.map(l => l.id)} className="w-full space-y-4">
                {lanes.map((lane) => (
                    <AccordionItem
                        key={lane.id}
                        value={lane.id}
                        className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden shadow-sm"
                    >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-neutral-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-center gap-3 w-full text-left">
                                <div
                                    className="w-3 h-3 rounded-full shadow-sm shrink-0"
                                    style={{ backgroundColor: lane.color || '#3b82f6' }}
                                />
                                <span className="font-bold text-neutral-900 dark:text-neutral-100">{lane.name}</span>
                                <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold px-2 py-0 border-none rounded-full h-5">
                                    {lane.Task?.length || 0}
                                </Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0 border-t border-neutral-100 dark:border-neutral-800">
                            {lane.Task && lane.Task.length > 0 ? (
                                <div className="flex flex-col">
                                    {lane.Task.map((task, index) => {
                                        const assignee = teamMembers.find(u => u.id === task.assignedUserId)
                                        return (
                                            <div
                                                key={task.id}
                                                className={`
                                                    group flex items-center justify-between px-4 py-3 
                                                    hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50 
                                                    transition-all cursor-pointer
                                                    ${index !== lane.Task.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800/50' : ''}
                                                `}
                                            >
                                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                                                        <Hash className="w-4 h-4 text-neutral-400 dark:text-neutral-600 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {task.title}
                                                        </span>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            {task.dueDate && (
                                                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground whitespace-nowrap">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {format(new Date(task.dueDate), 'MMM d')}
                                                                </div>
                                                            )}
                                                            {task.tags && task.tags.length > 0 && (
                                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                                    <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
                                                                    <div className="flex gap-1 overflow-hidden">
                                                                        {task.tags.slice(0, 2).map(tag => (
                                                                            <span key={tag} className="text-[10px] text-muted-foreground whitespace-nowrap bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                        {task.tags.length > 2 && (
                                                                            <span className="text-[10px] text-muted-foreground">+{task.tags.length - 2}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 shrink-0 ml-4">
                                                    {task.priority && (
                                                        <Badge variant="outline" className={`text-[10px] font-bold border-none px-2.5 py-0.5 rounded-full shadow-sm hidden sm:flex ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </Badge>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        {assignee ? (
                                                            <Avatar className="w-6 h-6 border-2 border-white dark:border-zinc-950 shadow-sm">
                                                                <AvatarImage src={assignee.avatarUrl} title={assignee.name} />
                                                                <AvatarFallback className="text-[10px]">{assignee.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border-2 border-white dark:border-zinc-950">
                                                                <UserIcon className="w-2.5 h-2.5 text-muted-foreground/30" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-xs text-muted-foreground italic">
                                    No tasks in this section
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            {lanes.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center gap-4 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                        <Circle className="w-8 h-8 opacity-20" />
                    </div>
                    <p>No sections found on this board.</p>
                </div>
            )}
        </div>
    )
}

export default TaskList
