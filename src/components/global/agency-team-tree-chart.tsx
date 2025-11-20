'use client'

import { ResponsiveTree } from '@nivo/tree'
import React from 'react'

type Employee = {
  id: string
  userId: string
  subAccountId: string
  role: string | null
  isActive: boolean
  userName?: string
  userEmail?: string
}

type Subaccount = {
  id: string
  name: string
  employees?: Employee[]
}

type AgencyTeamTreeChartProps = {
  agencyName: string
  subaccounts: Subaccount[]
}

// Common access permissions
const ACCESS_PERMISSIONS = [
  'Overview',
  'Funnels',
  'Contacts',
  'Pipelines',
  'Media',
  'Automations',
  'Settings',
]

// Mock employee data to supplement real data
const generateMockEmployees = (subaccountId: string, subaccountName: string) => {
  const mockEmployees = [
    {
      id: `mock-emp-${subaccountId}-1`,
      userId: `mock-user-${subaccountId}-1`,
      subAccountId: subaccountId,
      role: 'MANAGER',
      isActive: true,
      userName: `Team Lead - ${subaccountName}`,
      userEmail: `manager@${subaccountName.toLowerCase().replace(/\s+/g, '')}.com`,
    },
    {
      id: `mock-emp-${subaccountId}-2`,
      userId: `mock-user-${subaccountId}-2`,
      subAccountId: subaccountId,
      role: 'DEVELOPER',
      isActive: true,
      userName: `Developer - ${subaccountName}`,
      userEmail: `dev@${subaccountName.toLowerCase().replace(/\s+/g, '')}.com`,
    },
    {
      id: `mock-emp-${subaccountId}-3`,
      userId: `mock-user-${subaccountId}-3`,
      subAccountId: subaccountId,
      role: 'SALES',
      isActive: true,
      userName: `Sales Rep - ${subaccountName}`,
      userEmail: `sales@${subaccountName.toLowerCase().replace(/\s+/g, '')}.com`,
    },
  ]
  return mockEmployees
}

// Generate access permissions for an employee based on role
const generateAccessPermissions = (role: string | null): string[] => {
  const roleLower = (role || '').toLowerCase()
  
  // Managers get most access
  if (roleLower.includes('manager') || roleLower.includes('ceo') || roleLower.includes('cto')) {
    return ['Overview', 'Funnels', 'Contacts', 'Pipelines', 'Media', 'Automations', 'Settings']
  }
  
  // Developers get technical access
  if (roleLower.includes('developer') || roleLower.includes('designer')) {
    return ['Overview', 'Funnels', 'Pipelines', 'Media']
  }
  
  // Sales gets customer-facing access
  if (roleLower.includes('sales') || roleLower.includes('marketing')) {
    return ['Overview', 'Funnels', 'Contacts', 'Media']
  }
  
  // Support gets limited access
  if (roleLower.includes('support')) {
    return ['Overview', 'Contacts', 'Media']
  }
  
  // Default access
  return ['Overview', 'Funnels', 'Contacts']
}

const AgencyTeamTreeChart: React.FC<AgencyTeamTreeChartProps> = ({
  agencyName,
  subaccounts,
}) => {
  // Transform data into tree format
  const transformData = () => {
    const treeData: any = {
      name: agencyName,
      children: [],
    }

    subaccounts.forEach((subaccount) => {
      const subaccountNode: any = {
        name: subaccount.name,
        children: [],
      }

      // Get employees for this subaccount (mix real and mock)
      const realEmployees = subaccount.employees || []
      const mockEmployees = generateMockEmployees(subaccount.id, subaccount.name)
      
      // Combine real and mock employees, prioritizing real ones
      const allEmployees = [
        ...realEmployees,
        ...mockEmployees.filter(
          (mock) => !realEmployees.some((real) => real.userId === mock.userId)
        ),
      ]

      // Group employees by role (managers/leads first, then team members)
      const managers = allEmployees.filter(
        (emp) =>
          emp.role &&
          (emp.role.toUpperCase().includes('MANAGER') ||
            emp.role.toUpperCase().includes('CEO') ||
            emp.role.toUpperCase().includes('CTO') ||
            emp.role.toUpperCase().includes('CDO'))
      )
      const teamMembers = allEmployees.filter(
        (emp) => !managers.some((mgr) => mgr.id === emp.id)
      )

      // Add managers/team leads
      managers.forEach((manager) => {
        const managerNode: any = {
          name: manager.userName || `Manager (${manager.role || 'Unknown'})`,
          children: [],
        }

        // Add team members under this manager (if any)
        const managerTeamMembers = teamMembers.slice(0, 2) // Limit to 2 per manager for clarity
        managerTeamMembers.forEach((member) => {
          const memberNode: any = {
            name: member.userName || `Team Member (${member.role || 'Member'})`,
            children: [],
          }

          // Add access permissions
          const permissions = generateAccessPermissions(member.role)
          permissions.forEach((permission) => {
            memberNode.children.push({
              name: permission,
            })
          })

          managerNode.children.push(memberNode)
        })

        // If no team members, add manager's own permissions
        if (managerNode.children.length === 0) {
          const managerPermissions = generateAccessPermissions(manager.role)
          managerPermissions.forEach((permission) => {
            managerNode.children.push({
              name: permission,
            })
          })
        }

        subaccountNode.children.push(managerNode)
      })

      // Add remaining team members directly under subaccount
      const remainingMembers = teamMembers.slice(managers.length * 2)
      remainingMembers.forEach((member) => {
        const memberNode: any = {
          name: member.userName || `Team Member (${member.role || 'Member'})`,
          children: [],
        }

        // Add access permissions
        const permissions = generateAccessPermissions(member.role)
        permissions.forEach((permission) => {
          memberNode.children.push({
            name: permission,
          })
        })

        subaccountNode.children.push(memberNode)
      })

      // If no employees at all, add a placeholder
      if (subaccountNode.children.length === 0) {
        subaccountNode.children.push({
          name: 'No team members assigned',
          children: [],
        })
      }

      treeData.children.push(subaccountNode)
    })

    // If no subaccounts, add a placeholder
    if (treeData.children.length === 0) {
      treeData.children.push({
        name: 'No subaccounts',
        children: [],
      })
    }

    return treeData
  }

  const treeData = transformData()

  // If no data, show empty state
  if (!treeData || treeData.children.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] text-muted-foreground">
        <p>No team data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[600px]">
      <ResponsiveTree
        data={treeData}
        identity="name"
        activeNodeSize={24}
        inactiveNodeSize={12}
        nodeColor={{ scheme: 'tableau10' }}
        fixNodeColorAtDepth={1}
        linkThickness={2}
        activeLinkThickness={8}
        inactiveLinkThickness={2}
        linkColor={{ from: 'target.color', modifiers: [['opacity', 0.4]] }}
        margin={{ top: 90, right: 90, bottom: 90, left: 90 }}
        meshDetectionRadius={80}
        motionConfig="wobbly"
        animate={true}
      />
    </div>
  )
}

export default AgencyTeamTreeChart

