'use client'

import React from 'react'
import { Task } from '@/lib/database.types'
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, getHours, getMinutes } from 'date-fns'
import EventCard from './event-card'

type Props = {
    currentDate: Date
    tasks: Task[]
    teamMembers: any[]
}

const CalendarGrid = ({ currentDate, tasks, teamMembers }: Props) => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday start
    const endDay = endOfWeek(currentDate, { weekStartsOn: 1 })
    const days = eachDayOfInterval({ start: startDay, end: endDay })

    // 6am to 8pm
    const hours = Array.from({ length: 15 }, (_, i) => i + 6)

    const getEventsForDay = (day: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false
            return isSameDay(new Date(task.dueDate), day)
        })
    }

    return (
        <div className="flex h-full flex-col overflow-auto bg-white dark:bg-neutral-900">
            {/* Header Row (Days) */}
            <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-20 shadow-sm">
                {/* Time Column Header */}
                <div className="p-4 border-r text-xs text-muted-foreground font-medium text-center flex items-center justify-center bg-muted/20">
                    Time
                </div>
                {days.map((day, i) => (
                    <div
                        key={i}
                        className={`
                    p-4 border-r min-w-[120px] text-center flex flex-col gap-1
                    ${isSameDay(day, new Date()) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                `}
                    >
                        <span className="text-xs font-medium text-muted-foreground uppercase">{format(day, 'EEE')}</span>
                        <span className={`
                    text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full mx-auto
                    ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : 'text-foreground'}
                `}>
                            {format(day, 'd')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Grid Content */}
            <div className="flex-1 relative min-h-[800px]">
                {/* Background Grid Lines logic */}
                <div className="absolute inset-0 grid grid-cols-8 pointer-events-none">
                    <div className="border-r border-neutral-100 dark:border-neutral-800 bg-muted/5 w-full h-full"></div>
                    {days.map((_, i) => (
                        <div key={i} className="border-r border-neutral-100 dark:border-neutral-800 w-full h-full"></div>
                    ))}
                </div>

                {/* Time Slots + Events Overlay */}
                <div className="grid grid-cols-8 relative">
                    {/* Time Labels Column */}
                    <div className="relative text-xs text-muted-foreground font-medium">
                        {hours.map(hour => (
                            <div key={hour} className="h-20 border-b border-neutral-100 dark:border-neutral-800 pr-2 flex justify-end">
                                <span className="-mt-2.5 bg-background px-1">{format(new Date().setHours(hour, 0), 'h a')}</span>
                            </div>
                        ))}
                    </div>

                    {/* Day Columns for Events */}
                    {days.map((day, dayIndex) => {
                        const dayEvents = getEventsForDay(day)
                        return (
                            <div key={dayIndex} className="relative border-b border-transparent">
                                {/* Render horizontal lines for grid visual (matching time col) */}
                                {hours.map(hour => (
                                    <div key={hour} className="h-20 border-b border-neutral-100 dark:border-neutral-800"></div>
                                ))}

                                {/* Render Events */}
                                {dayEvents.map(task => {
                                    if (!task.dueDate) return null
                                    const date = new Date(task.dueDate)
                                    const hour = getHours(date)
                                    const minute = getMinutes(date)

                                    // Calculate top position relative to 6am start
                                    // 6am is 0px top. 
                                    // height of one hour slot is 80px (h-20 in tailwind is 5rem=80px)
                                    const startHour = 6
                                    const pixelsPerHour = 80

                                    // If event is before 6am, clamp to top? or hide? or show just at top?
                                    // For simplicity let's handle events from 6am to 9pm roughly.
                                    let effectiveHour = hour
                                    if (hour < 6) effectiveHour = 6 // Clamp visually

                                    const topPosition = ((effectiveHour - startHour) * pixelsPerHour) + ((minute / 60) * pixelsPerHour)

                                    return (
                                        <EventCard
                                            key={task.id}
                                            task={task}
                                            teamMembers={teamMembers}
                                            style={{
                                                top: `${topPosition}px`,
                                                height: '75px', // Fixed height ~1hr minus margin
                                                width: 'calc(100% - 8px)',
                                                zIndex: 10
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default CalendarGrid
