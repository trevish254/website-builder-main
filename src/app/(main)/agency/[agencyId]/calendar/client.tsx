'use client'

import React, { useState } from 'react'
import { startOfWeek, addWeeks, subWeeks, format } from 'date-fns'
import { Task } from '@/lib/database.types'
import CalendarHeader from './_components/calendar-header'
import CalendarGrid from './_components/calendar-grid'

type Props = {
    agencyId: string
    tasks: Task[]
    teamMembers: any[]
}

const CalendarClient = ({ agencyId, tasks, teamMembers }: Props) => {
    const [currentDate, setCurrentDate] = useState(new Date())

    // Navigation handlers
    const onNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))
    const onPrevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
    const onToday = () => setCurrentDate(new Date())

    return (
        <div className="flex flex-col h-full gap-4">
            <CalendarHeader
                currentDate={currentDate}
                onNext={onNextWeek}
                onPrev={onPrevWeek}
                onToday={onToday}
            />

            <div className="flex-1 bg-background border rounded-lg overflow-hidden shadow-sm">
                <CalendarGrid
                    currentDate={currentDate}
                    tasks={tasks}
                    teamMembers={teamMembers}
                />
            </div>
        </div>
    )
}

export default CalendarClient
