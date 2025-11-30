'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TinyChart from '@/components/finance/tiny-chart'
import { Clock } from 'lucide-react'
import { useMemo } from 'react'

const TotalIncomeCard = () => {
  // Generate mock data for the chart
  const chartData = useMemo(() => {
    return [65, 70, 68, 75, 80, 85, 82, 90, 95, 100]
  }, [])

  return (
    <Card className="min-h-[280px] flex flex-col">
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
      <CardContent className="flex flex-col flex-1">
        <div className="text-2xl font-bold mb-auto">$12,100.50</div>
        <div className="-mx-6 -mb-6 mt-4">
          <TinyChart data={chartData} color="#10B981" />
        </div>
      </CardContent>
    </Card>
  )
}

export default TotalIncomeCard

