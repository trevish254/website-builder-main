'use client'

import React from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

type Props = {
    currentDate: Date
    onPrev: () => void
    onNext: () => void
    onToday: () => void
}

const CalendarHeader = ({ currentDate, onPrev, onNext, onToday }: Props) => {
    return (
        <div className="flex items-center justify-between bg-background p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">
                        {format(currentDate, 'MMMM yyyy')}
                    </h1>
                </div>
                <div className="flex items-center border rounded-md overflow-hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPrev}
                        className="rounded-none border-r hover:bg-muted"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onToday}
                        className="rounded-none px-4 font-medium hover:bg-muted"
                    >
                        Today
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNext}
                        className="rounded-none border-l hover:bg-muted"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Placeholder for future view switcher or filters */}
                {/* To match design we could add 'Backlog | Active | Closed' filters here later */}
            </div>
        </div>
    )
}

export default CalendarHeader
