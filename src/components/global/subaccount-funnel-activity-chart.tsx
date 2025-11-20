'use client'

import { ResponsiveFunnel } from '@nivo/funnel'
import React from 'react'

type FunnelPage = {
  id: string
  name: string
  visits: number
  order: number
}

type Funnel = {
  id: string
  name: string
  FunnelPage?: FunnelPage[]
  FunnelPages?: FunnelPage[]
}

type SubaccountFunnelActivityChartProps = {
  funnels: Funnel[]
}

const SubaccountFunnelActivityChart: React.FC<
  SubaccountFunnelActivityChartProps
> = ({ funnels }) => {
  // Transform funnel data into funnel chart format
  const transformData = () => {
    if (!funnels || funnels.length === 0) {
      return []
    }

    // Aggregate all funnel pages across all funnels, sorted by order
    const allPages: Array<FunnelPage & { funnelName: string }> = []

    funnels.forEach((funnel) => {
      const pages = funnel.FunnelPage || funnel.FunnelPages || []
      pages.forEach((page) => {
        allPages.push({
          ...page,
          funnelName: funnel.name,
        })
      })
    })

    // Group by order to show funnel steps
    // If multiple funnels have pages at the same order, aggregate them
    const orderMap = new Map<number, { visits: number; labels: string[] }>()

    allPages.forEach((page) => {
      const order = page.order || 0
      const existing = orderMap.get(order) || { visits: 0, labels: [] }
      orderMap.set(order, {
        visits: existing.visits + (page.visits || 0),
        labels: [...existing.labels, page.name],
      })
    })

    // Convert to funnel chart format, sorted by order
    const sortedOrders = Array.from(orderMap.keys()).sort((a, b) => a - b)

    return sortedOrders.map((order, index) => {
      const data = orderMap.get(order)!
      // Use the first label or create a generic one
      const label =
        data.labels.length > 0
          ? data.labels[0] + (data.labels.length > 1 ? ` (+${data.labels.length - 1})` : '')
          : `Step ${index + 1}`

      return {
        id: `step_${order}`,
        value: data.visits,
        label: label,
      }
    })
  }

  const funnelData = transformData()

  // If no data, show empty state
  if (funnelData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <p>No funnel activity data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveFunnel
        data={funnelData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        valueFormat=">-.4s"
        colors={{ scheme: 'spectral' }}
        borderWidth={20}
        labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
        beforeSeparatorLength={100}
        beforeSeparatorOffset={20}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        motionConfig="wobbly"
        animate={true}
      />
    </div>
  )
}

export default SubaccountFunnelActivityChart

