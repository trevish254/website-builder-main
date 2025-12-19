'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
    title: string
    dataSource?: string
    limit?: number
}

// Mock Data
const activities = [
    { id: 1, user: 'John Doe', action: 'Created a new funnel', time: '2 mins ago', initial: 'JD' },
    { id: 2, user: 'Jane Smith', action: 'Updated website settings', time: '1 hour ago', initial: 'JS' },
    { id: 3, user: 'Alice Johnson', action: 'Deleted a contact', time: '3 hours ago', initial: 'AJ' },
    { id: 4, user: 'Bob Brown', action: 'Published a page', time: '5 hours ago', initial: 'BB' },
    { id: 5, user: 'Charlie Davis', action: 'Added a new team member', time: '1 day ago', initial: 'CD' },
    { id: 6, user: 'Diana Evans', action: 'Changed theme colors', time: '2 days ago', initial: 'DE' },
]

export default function ListCard({ title, dataSource, limit = 5 }: Props) {
    const data = activities.slice(0, limit)

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
            <ScrollArea className="flex-1 -mr-4 pr-4">
                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{item.initial}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.user}</p>
                                <p className="text-xs text-muted-foreground">{item.action}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">{item.time}</div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
