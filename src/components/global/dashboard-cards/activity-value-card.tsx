'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveBullet } from '@nivo/bullet'

const ActivityValueCard = () => {
  const bulletData = Array.from({ length: 5 }).map((_, i) => ({
    id: `activity-${i}`,
    ranges: [0, 100],
    measures: [Math.floor(Math.random() * 80) + 20],
    markers: [],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Activity Manager Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">$41.30 USD</div>
        <div className="h-32">
          <ResponsiveBullet
            data={bulletData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            spacing={20}
            titleAlign="start"
            titleOffsetX={-70}
            measureSize={0.2}
            measureColors={['#3b82f6']}
            rangeColors={['#e5e7eb']}
          />
        </div>
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === 0 ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ActivityValueCard

