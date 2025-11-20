'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveTimeRange } from '@nivo/calendar'
import { Clock } from 'lucide-react'
import { useMemo } from 'react'

const TotalIncomeCard = () => {
  // Generate mock data for the last 7 days
  const calendarData = useMemo(() => {
    const data = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const value = Math.floor(Math.random() * 100) + 50
      data.push({
        day: date.toISOString().split('T')[0],
        value: value,
      })
    }
    return data
  }, [])

  const from = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() - 6)
    return date.toISOString().split('T')[0]
  }, [])

  const to = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Total Income</CardTitle>
          </div>
          <select className="text-sm border rounded-md px-2 py-1">
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-32 mb-4">
          <ResponsiveTimeRange
            data={calendarData}
            from={from}
            to={to}
            emptyColor="#eeeeee"
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            colors={['#3b82f6']}
          />
        </div>
        <div className="text-2xl font-bold">$12,100.50</div>
      </CardContent>
    </Card>
  )
}

export default TotalIncomeCard

