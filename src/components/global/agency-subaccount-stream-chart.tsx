'use client'

import { ResponsiveStream } from '@nivo/stream'
import React from 'react'

type FunnelPage = {
  id: string
  visits: number
}

type Funnel = {
  id: string
  name: string
  FunnelPage?: FunnelPage[]
  FunnelPages?: FunnelPage[]
}

type Subaccount = {
  id: string
  name: string
  funnels?: Funnel[]
}

type AgencySubaccountStreamChartProps = {
  subaccounts: Subaccount[]
}

const AgencySubaccountStreamChart: React.FC<
  AgencySubaccountStreamChartProps
> = ({ subaccounts }) => {
  // Transform subaccount data into stream chart format
  const transformData = () => {
    if (!subaccounts || subaccounts.length === 0) {
      return { data: [], keys: [] }
    }

    // Calculate total activity (visits) for each subaccount
    const subaccountActivities = subaccounts.map((subaccount) => {
      let totalVisits = 0
      
      if (subaccount.funnels && subaccount.funnels.length > 0) {
        subaccount.funnels.forEach((funnel) => {
          const pages = funnel.FunnelPage || funnel.FunnelPages || []
          pages.forEach((page) => {
            totalVisits += page.visits || 0
          })
        })
      }

      return {
        name: subaccount.name,
        id: subaccount.id,
        totalVisits,
      }
    })

    // Create time-based data points (simulating activity over time)
    // We'll create 9 data points to match the mock data structure
    const dataPoints = 9
    const data: Array<Record<string, number>> = []

    // Generate data points with some variation
    for (let i = 0; i < dataPoints; i++) {
      const dataPoint: Record<string, number> = {}
      
      subaccountActivities.forEach((subaccount) => {
        // Create variation based on total visits with some randomness
        const baseValue = subaccount.totalVisits || 0
        // Add variation: ±30% of base value, minimum 10
        const variation = baseValue * 0.3
        const randomVariation = (Math.random() - 0.5) * 2 * variation
        const value = Math.max(10, Math.round(baseValue + randomVariation))
        
        dataPoint[subaccount.name] = value
      })

      data.push(dataPoint)
    }

    const keys = subaccountActivities.map((sub) => sub.name)

    return { data, keys }
  }

  const { data, keys } = transformData()

  // If no data, show empty state
  if (data.length === 0 || keys.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <p>No subaccount activity data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveStream
        data={data}
        keys={keys}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        enableGridX={true}
        enableGridY={false}
        borderColor={{ theme: 'background' }}
        dotSize={8}
        dotBorderWidth={2}
        dotBorderColor={{ from: 'color', modifiers: [['darker', 0.7]] }}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolShape: 'circle',
          },
        ]}
        motionConfig="wobbly"
        animate={true}
      />
    </div>
  )
}

export default AgencySubaccountStreamChart

