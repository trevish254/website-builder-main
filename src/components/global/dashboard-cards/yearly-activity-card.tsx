'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveBullet } from '@nivo/bullet'
import { BarChart3 } from 'lucide-react'

const YearlyActivityCard = () => {
  const bulletData = [
    {
      id: '2023',
      ranges: [0, 100],
      measures: [45],
      markers: [],
    },
    {
      id: '2024',
      ranges: [0, 100],
      measures: [85],
      markers: [],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">Yearly Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <span className="text-sm text-muted-foreground">2023</span>
          <span className="text-sm text-muted-foreground">2024</span>
        </div>
        <div className="h-32">
          <ResponsiveBullet
            data={bulletData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            spacing={46}
            titleAlign="start"
            titleOffsetX={-70}
            measureSize={0.2}
            measureColors={['#3b82f6']}
            rangeColors={['#e5e7eb']}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default YearlyActivityCard

