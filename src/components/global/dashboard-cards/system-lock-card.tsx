'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveBullet } from '@nivo/bullet'
import { Lock } from 'lucide-react'

const SystemLockCard = () => {
  const bulletData = [
    {
      id: 'growth',
      ranges: [0, 100],
      measures: [37],
      markers: [50],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg">System Lock</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">37% Growth rate</div>
        <div className="h-24">
          <ResponsiveBullet
            data={bulletData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            spacing={46}
            titleAlign="start"
            titleOffsetX={-70}
            measureSize={0.2}
            measureColors={['#3b82f6']}
            rangeColors={['#e5e7eb']}
            markerColors={['#9ca3af']}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemLockCard

