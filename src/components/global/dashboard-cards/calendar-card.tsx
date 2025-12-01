'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export default function CalendarCard() {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const events = [
        {
            time: '10:00 AM',
            title: 'Team Standup',
            description: 'Weekly sync with the design team',
        },
        {
            time: '1:00 PM',
            title: 'Client Meeting',
            description: 'Review project requirements',
        },
        {
            time: '3:30 PM',
            title: 'Code Review',
            description: 'Review pull requests for the new feature',
        },
    ]

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Upcoming Events</h4>
                    </div>
                    <div className="space-y-3">
                        {events.map((event, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {event.time}
                                    </span>
                                    <span className="text-sm font-medium">{event.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {event.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
