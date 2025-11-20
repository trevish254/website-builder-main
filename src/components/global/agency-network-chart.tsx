'use client'

import { ResponsiveNetwork } from '@nivo/network'
import React from 'react'

type NetworkNode = {
  id: string
  height: number
  size: number
  color: string
  name?: string
}

type NetworkLink = {
  source: string
  target: string
  distance: number
}

type NetworkData = {
  nodes: NetworkNode[]
  links: NetworkLink[]
}

type AgencyNetworkChartProps = {
  agencyName: string
  subaccounts: Array<{
    id: string
    name: string
    funnels?: Array<{
      id: string
      name: string
      FunnelPage?: Array<{
        id: string
        visits: number
      }>
      FunnelPages?: Array<{
        id: string
        visits: number
      }>
    }>
  }>
}

const AgencyNetworkChart: React.FC<AgencyNetworkChartProps> = ({
  agencyName,
  subaccounts,
}) => {
  // Transform data into network format
  const transformData = (): NetworkData => {
    const nodes: NetworkNode[] = []
    const links: NetworkLink[] = []

    // Main agency node (Node 0)
    const agencyNodeId = 'agency-main'
    nodes.push({
      id: agencyNodeId,
      height: 2,
      size: 32,
      color: 'rgb(244, 117, 96)',
      name: agencyName,
    })

    // Subaccount nodes and their visitor nodes
    subaccounts.forEach((subaccount, subIndex) => {
      const subaccountNodeId = `subaccount-${subaccount.id}`
      
      // Subaccount node
      nodes.push({
        id: subaccountNodeId,
        height: 1,
        size: 24,
        color: 'rgb(97, 205, 187)',
        name: subaccount.name,
      })

      // Link from agency to subaccount
      links.push({
        source: agencyNodeId,
        target: subaccountNodeId,
        distance: 80,
      })

      // Process funnels and their visitors
      if (subaccount.funnels && subaccount.funnels.length > 0) {
        subaccount.funnels.forEach((funnel) => {
          // Handle both FunnelPage and FunnelPages (in case of naming inconsistency)
          const funnelPages = funnel.FunnelPage || funnel.FunnelPages || []
          
          if (funnelPages.length > 0) {
            // Create visitor nodes based on visits
            // For each funnel page, create nodes representing visitors
            // We'll create a node for every 10 visits (or at least 1 node if visits > 0)
            funnelPages.forEach((page, pageIndex) => {
              const visitorCount = Math.max(1, Math.floor((page.visits || 0) / 10))
              
              for (let i = 0; i < visitorCount && i < 10; i++) {
                const visitorNodeId = `${subaccountNodeId}-visitor-${page.id}-${i}`
                nodes.push({
                  id: visitorNodeId,
                  height: 0,
                  size: 12,
                  color: 'rgb(232, 193, 160)',
                })

                // Link from subaccount to visitor
                links.push({
                  source: subaccountNodeId,
                  target: visitorNodeId,
                  distance: 50,
                })
              }
            })
          }
        })
      }
    })

    return { nodes, links }
  }

  const networkData = transformData()

  // If no data, show empty state
  if (networkData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <p>No network data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveNetwork
        data={networkData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={(link) => link.distance}
        centeringStrength={0.3}
        repulsivity={50}
        nodeSize={(node) => node.size}
        activeNodeSize={(node) => 1.5 * node.size}
        nodeColor={(node) => node.color}
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.8]],
        }}
        linkThickness={(link) => 2 + 2 * link.target.data.height}
        linkBlendMode="multiply"
        motionConfig="wobbly"
        animate={true}
        tooltip={({ node }) => (
          <div className="bg-background border rounded-lg p-2 shadow-lg">
            <div className="font-semibold">{node.data.name || node.id}</div>
            {node.data.height === 2 && (
              <div className="text-xs text-muted-foreground">Main Agency</div>
            )}
            {node.data.height === 1 && (
              <div className="text-xs text-muted-foreground">Subaccount</div>
            )}
            {node.data.height === 0 && (
              <div className="text-xs text-muted-foreground">Funnel Visitor</div>
            )}
          </div>
        )}
      />
    </div>
  )
}

export default AgencyNetworkChart

