import { getAuthUserDetails } from '@/lib/queries'
import { off } from 'process'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
  id: string
  type: 'agency' | 'subaccount'
  defaultUser?: any
  userDetails?: any
}

const Sidebar = async ({ id, type, defaultUser, userDetails }: Props) => {
  let user = defaultUser
  let sidebarOpt = []
  let details = userDetails
  let sideBarLogo = '/assets/plura-logo.svg'
  let subaccounts = []

  try {
    if (!user) {
      user = await getAuthUserDetails()
    }
  } catch (error) {
    console.log('Authentication not available, using fallback data:', error)
  }

  // If no user data or authentication failed, create fallback data
  if (!user) {
    if (type === 'subaccount') {
      // Create fallback subaccount data with sidebar options
      const fallbackSubaccount = {
        id: id,
        name: 'Test Subaccount',
        subAccountLogo: '/assets/plura-logo.svg',
        address: '456 Sub St',
        city: 'Sub City',
        zipCode: '54321',
        state: 'Sub State',
        country: 'Sub Country',
        companyEmail: 'sub@example.com',
        companyPhone: '555-0123',
        goal: 10000,
        agencyId: 'mock-agency-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        SubAccountSidebarOption: [
          {
            id: `sub-sidebar-${id}-1`,
            name: 'Overview',
            link: `/subaccount/${id}`,
            icon: 'home',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-2`,
            name: 'Funnels',
            link: `/subaccount/${id}/funnels`,
            icon: 'pipelines',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-3`,
            name: 'Pipelines',
            link: `/subaccount/${id}/pipelines`,
            icon: 'kanban',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-4`,
            name: 'Contacts',
            link: `/subaccount/${id}/contacts`,
            icon: 'person',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-5`,
            name: 'Media',
            link: `/subaccount/${id}/media`,
            icon: 'image',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-6`,
            name: 'Automations',
            link: `/subaccount/${id}/automations`,
            icon: 'settings',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-7`,
            name: 'Settings',
            link: `/subaccount/${id}/settings`,
            icon: 'settings',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
      }

      details = fallbackSubaccount
      sidebarOpt = fallbackSubaccount.SubAccountSidebarOption
      sideBarLogo = fallbackSubaccount.subAccountLogo
      subaccounts = [fallbackSubaccount]

      return (
        <>
          <MenuOptions
            defaultOpen={true}
            details={details}
            id={id}
            sidebarLogo={sideBarLogo}
            sidebarOpt={sidebarOpt}
            subAccounts={subaccounts}
            user={{ id: 'mock-user', name: 'Test User', role: 'AGENCY_OWNER' }}
          />
          <MenuOptions
            details={details}
            id={id}
            sidebarLogo={sideBarLogo}
            sidebarOpt={sidebarOpt}
            subAccounts={subaccounts}
            user={{ id: 'mock-user', name: 'Test User', role: 'AGENCY_OWNER' }}
          />
        </>
      )
    } else {
      // For agency type, create fallback data when no user data
      const fallbackAgency = {
        id: id,
        name: 'Test Agency',
        agencyLogo: '/assets/plura-logo.svg',
        address: '123 Agency St',
        city: 'Agency City',
        zipCode: '12345',
        state: 'Agency State',
        country: 'Agency Country',
        companyEmail: 'agency@example.com',
        companyPhone: '555-0123',
        goal: 10000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        AgencySidebarOption: [
          {
            id: `sidebar-${id}-1`,
            name: 'Dashboard',
            link: `/agency/${id}`,
            icon: 'home',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-2`,
            name: 'Launchpad',
            link: `/agency/${id}/launchpad`,
            icon: 'compass',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-3`,
            name: 'Sub Accounts',
            link: `/agency/${id}/all-subaccounts`,
            icon: 'person',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-4`,
            name: 'Team',
            link: `/agency/${id}/team`,
            icon: 'shield',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-5`,
            name: 'Billing',
            link: `/agency/${id}/billing`,
            icon: 'payment',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-6`,
            name: 'Government Services',
            link: `/agency/${id}/government-services`,
            icon: 'shield',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-7`,
            name: 'Settings',
            link: `/agency/${id}/settings`,
            icon: 'settings',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
      }

      details = fallbackAgency
      sidebarOpt = fallbackAgency.AgencySidebarOption
      sideBarLogo = fallbackAgency.agencyLogo
      subaccounts = []

      return (
        <>
          <MenuOptions
            defaultOpen={true}
            details={details}
            id={id}
            sidebarLogo={sideBarLogo}
            sidebarOpt={sidebarOpt}
            subAccounts={subaccounts}
            user={{ id: 'mock-user', name: 'Test User', role: 'AGENCY_OWNER' }}
          />
          <MenuOptions
            details={details}
            id={id}
            sidebarLogo={sideBarLogo}
            sidebarOpt={sidebarOpt}
            subAccounts={subaccounts}
            user={{ id: 'mock-user', name: 'Test User', role: 'AGENCY_OWNER' }}
          />
        </>
      )
    }
  }

  if (!user.Agency) return

  details =
    type === 'agency'
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)

  if (!details) return

  // Determine which logo to show
  if (type === 'subaccount') {
    // For subaccounts, show subaccount logo if it exists, otherwise fall back to agency logo
    const subaccount = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
    sideBarLogo = subaccount?.subAccountLogo || user.Agency.agencyLogo || '/assets/plura-logo.svg'
    console.log('🔍 Subaccount logo:', subaccount?.subAccountLogo)
    console.log('🔍 Agency logo fallback:', user.Agency.agencyLogo)
    console.log('🔍 Final sidebar logo:', sideBarLogo)
  } else {
    // For agency, show agency logo
    sideBarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'
  }

  sidebarOpt =
    type === 'agency'
      ? user.Agency.AgencySidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
        ?.SubAccountSidebarOption || []

  // Debug logging for agency sidebar options
  if (type === 'agency') {
    console.log('🔍 Agency sidebar options:', user.Agency.AgencySidebarOption)
    console.log('🔍 Final sidebar options:', sidebarOpt)
    console.log('🔍 Sidebar options count:', sidebarOpt.length)

    // If no sidebar options exist, create them on the fly
    if (!sidebarOpt || sidebarOpt.length === 0) {
      console.log('🔧 No sidebar options found, creating fallback options for agency:', id)
      sidebarOpt = [
        {
          id: `sidebar-${id}-1`,
          name: 'Dashboard',
          link: `/agency/${id}`,
          icon: 'home',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-2`,
          name: 'Launchpad',
          link: `/agency/${id}/launchpad`,
          icon: 'compass',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-3`,
          name: 'Sub Accounts',
          link: `/agency/${id}/all-subaccounts`,
          icon: 'person',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-4`,
          name: 'Team',
          link: `/agency/${id}/team`,
          icon: 'shield',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-5`,
          name: 'Billing',
          link: `/agency/${id}/billing`,
          icon: 'payment',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-tasks`,
          name: 'Tasks',
          link: `/agency/${id}/tasks`,
          icon: 'check',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-messages`,
          name: 'Messages',
          link: `/agency/${id}/messages`,
          icon: 'messages',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-gov-services`,
          name: 'Government Services',
          link: `/agency/${id}/government-services`,
          icon: 'shield',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-7`,
          name: 'Settings',
          link: `/agency/${id}/settings`,
          icon: 'settings',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
      console.log('✅ Created fallback sidebar options:', sidebarOpt)
    } else {
      // Check if Messages is missing from existing options
      const hasMessages = sidebarOpt.some((option: any) => option.name === 'Messages')
      if (!hasMessages) {
        console.log('🔧 Adding Messages to existing sidebar options')
        sidebarOpt.push({
          id: `sidebar-${id}-messages`,
          name: 'Messages',
          link: `/agency/${id}/messages`,
          icon: 'messages',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        console.log('✅ Added Messages to sidebar options')
      }

      // Check if Tasks is missing from existing options
      const hasTasks = sidebarOpt.some((option: any) => option.name === 'Tasks')
      if (!hasTasks) {
        console.log('🔧 Adding Tasks to existing sidebar options')
        sidebarOpt.push({
          id: `sidebar-${id}-tasks`,
          name: 'Tasks',
          link: `/agency/${id}/tasks`,
          icon: 'check',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        console.log('✅ Added Tasks to sidebar options')
      }

      // Check if Government Services is missing from existing options
      const hasGovernmentServices = sidebarOpt.some((option: any) => option.name === 'Government Services')
      if (!hasGovernmentServices) {
        console.log('🔧 Adding Government Services to existing sidebar options')
        sidebarOpt.push({
          id: `sidebar-${id}-gov-services`,
          name: 'Government Services',
          link: `/agency/${id}/government-services`,
          icon: 'shield',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        console.log('✅ Added Government Services to sidebar options')
      }
    }
  }

  // Debug logging for subaccount sidebar options
  if (type === 'subaccount') {
    const targetSubaccount = user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
    console.log('🔍 Target subaccount:', targetSubaccount?.name, targetSubaccount?.id)
    console.log('🔍 Subaccount sidebar options:', targetSubaccount?.SubAccountSidebarOption)
    console.log('🔍 Final sidebar options:', sidebarOpt)

    // If no sidebar options exist, create them on the fly
    if (!sidebarOpt || sidebarOpt.length === 0) {
      console.log('🔧 No sidebar options found, creating fallback options for subaccount:', id)
      sidebarOpt = [
        {
          id: `sub-sidebar-${id}-1`,
          name: 'Overview',
          link: `/subaccount/${id}`,
          icon: 'home',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sub-sidebar-${id}-2`,
          name: 'Funnels',
          link: `/subaccount/${id}/funnels`,
          icon: 'pipelines',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sub-sidebar-${id}-3`,
          name: 'Pipelines',
          link: `/subaccount/${id}/pipelines`,
          icon: 'kanban',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sub-sidebar-${id}-4`,
          name: 'Contacts',
          link: `/subaccount/${id}/contacts`,
          icon: 'person',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sub-sidebar-${id}-5`,
          name: 'Media',
          link: `/subaccount/${id}/media`,
          icon: 'image',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sub-sidebar-${id}-6`,
          name: 'Automations',
          link: `/subaccount/${id}/automations`,
          icon: 'settings',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sub-sidebar-${id}-7`,
          name: 'Settings',
          link: `/subaccount/${id}/settings`,
          icon: 'settings',
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
      console.log('✅ Created fallback sidebar options:', sidebarOpt)
    }
  }

  subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  )

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  )
}

export default Sidebar
