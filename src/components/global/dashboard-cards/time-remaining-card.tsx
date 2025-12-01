'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle2, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

const TimeRemainingCard = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const goals = [
    { id: 1, text: 'Review Q3 Marketing Plan', completed: true },
    { id: 2, text: 'Team Sync at 2:00 PM', completed: false },
    { id: 3, text: 'Finalize Homepage Design', completed: false },
  ]

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Time Management</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {formatTime(time)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="text-sm text-muted-foreground">
          {formatDate(time)}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>Today's Goals</span>
          </div>
          <div className="space-y-2">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-2 text-sm">
                <CheckCircle2
                  className={`w-4 h-4 ${goal.completed ? 'text-green-500' : 'text-gray-300'}`}
                />
                <span className={goal.completed ? 'line-through text-muted-foreground' : ''}>
                  {goal.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Work Hours</span>
            <span className="font-medium">9:00 AM - 5:00 PM</span>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000"
              style={{ width: '65%' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TimeRemainingCard
