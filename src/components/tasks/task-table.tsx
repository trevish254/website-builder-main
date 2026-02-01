'use client'

import React from 'react'
import { Task, TaskLane } from '@/lib/database.types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, User as UserIcon, Paperclip, MoreVertical, Tag as TagIcon, Circle } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

type Props = {
    lanes: (TaskLane & { Task: Task[] })[]
    teamMembers: { id: string; name: string; avatarUrl: string }[]
}

const TaskTable = ({ lanes, teamMembers }: Props) => {
    // Flatten tasks from all lanes
    const allTasks = lanes.flatMap(lane =>
        lane.Task.map(task => ({
            ...task,
            laneName: lane.name,
            laneColor: lane.color
        }))
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const getPriorityColor = (priority?: string | null) => {
        switch (priority) {
            case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
            case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
            case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
            default: return 'text-neutral-600 bg-neutral-50 dark:bg-neutral-900/20'
        }
    }

    return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 overflow-hidden mx-4 my-2 shadow-sm">
            <Table>
                <TableHeader className="bg-neutral-50/50 dark:bg-zinc-900/50 text-[11px] uppercase tracking-wider">
                    <TableRow className="hover:bg-transparent border-b border-neutral-200 dark:border-neutral-800">
                        <TableHead className="w-[300px] font-semibold py-3">Task Name</TableHead>
                        <TableHead className="font-semibold py-3">Status</TableHead>
                        <TableHead className="font-semibold py-3">Due Date</TableHead>
                        <TableHead className="font-semibold py-3">Priority</TableHead>
                        <TableHead className="font-semibold py-3">Assignees</TableHead>
                        <TableHead className="font-semibold py-3">Attachments</TableHead>
                        <TableHead className="font-semibold py-3">Tags</TableHead>
                        <TableHead className="text-right font-semibold py-3">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allTasks.map((task) => {
                        const assignee = teamMembers.find(u => u.id === task.assignedUserId)

                        return (
                            <TableRow key={task.id} className="group hover:bg-neutral-50/50 dark:hover:bg-zinc-900/50 border-b border-neutral-100 dark:border-neutral-800/50 transition-colors">
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 border border-blue-100/50 dark:border-blue-800/30">
                                            <Circle className="w-3 h-3 text-blue-600" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{task.title}</span>
                                            {task.description && (
                                                <span className="text-[11px] text-muted-foreground line-clamp-1 italic">{task.description}</span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full shadow-sm"
                                            style={{ backgroundColor: task.laneColor || '#3b82f6' }}
                                        />
                                        <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
                                            {task.laneName}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground whitespace-nowrap">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : '-'}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    {task.priority && (
                                        <Badge variant="outline" className={`text-[10px] font-bold border-none px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex -space-x-1.5 overflow-hidden">
                                        {assignee ? (
                                            <Avatar className="w-6 h-6 border-2 border-white dark:border-zinc-950 shadow-sm">
                                                <AvatarImage src={assignee.avatarUrl} title={assignee.name} />
                                                <AvatarFallback className="text-[10px]">{assignee.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border-2 border-white dark:border-zinc-950">
                                                <UserIcon className="w-2.5 h-2.5 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-1.5 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                        <Paperclip className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-medium">0</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {task.tags?.slice(0, 1).map((tag) => (
                                            <span key={tag} className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-100/50 dark:border-blue-800/30 whitespace-nowrap">
                                                {tag}
                                            </span>
                                        ))}
                                        {task.tags && task.tags.length > 1 && (
                                            <span className="text-[10px] text-muted-foreground font-medium">+{task.tags.length - 1}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            {allTasks.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                    No tasks found. Create one to get started!
                </div>
            )}
        </div>
    )
}

export default TaskTable
