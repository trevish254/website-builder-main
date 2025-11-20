'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

const TimeRemainingCard = () => {
  const days = 15
  const hours = 12
  const minutes = 23
  const totalDays = 30
  const progress = (days / totalDays) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">Time Remaining</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">
          {days} Days {hours} hrs. {minutes} minutes
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${
                i < Math.floor((progress / 100) * 20)
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TimeRemainingCard

