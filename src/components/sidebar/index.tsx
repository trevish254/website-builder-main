import { getAuthUserDetails, getAgencyTeamMembers } from '@/lib/queries'
import React from 'react'
import IconDock from './icon-dock'
import FixedSubmenuPanel from './fixed-submenu-panel'
import MobileMenu from './mobile-menu'

type Props = {
  id: string
  type: 'agency' | 'subaccount'
  defaultUser?: any
  userDetails?: any
  dashboards?: any[]
}

const Sidebar = async ({ id, type, defaultUser, userDetails, dashboards }: Props) => {
  let user: any = defaultUser
  let sidebarOpt: any[] = []
  let details: any = userDetails
  let sideBarLogo = '/assets/chapabiz-logo.png'
  let subaccounts: any[] = []
  let teamMembers: any[] = []

  try {
    if (!user) {
      user = await getAuthUserDetails()
    }
    // Fetch team members if it's an agency type
    if (type === 'agency' && id) {
      teamMembers = await getAgencyTeamMembers(id)
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
        subAccountLogo: '/assets/chapabiz-logo.png',
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
          },
          {
            id: `sub-sidebar-${id}-inventory-dash`,
            name: 'product Dashboard',
            link: `/subaccount/${id}/inventory`,
            icon: 'chart',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-inventory-main`,
            name: 'Inventory',
            link: `/subaccount/${id}/inventory`,
            icon: 'package',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-inventory-order`,
            name: 'Orders',
            link: `/subaccount/${id}/orders`,
            icon: 'receipt',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-inventory-customers`,
            name: 'Customer Details',
            link: `/subaccount/${id}/inventory/customers`,
            icon: 'person',
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sub-sidebar-${id}-inventory-analytics`,
            name: 'Revenue Analytics',
            link: `/subaccount/${id}/inventory/analytics`,
            icon: 'analytics',
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
          <IconDock sidebarOptions={sidebarOpt} logo={sideBarLogo} type={type} />
          <FixedSubmenuPanel
            sidebarOptions={sidebarOpt}
            subAccounts={subaccounts}
            user={{ id: 'mock-user', name: 'Test User', role: 'AGENCY_OWNER' }}
            details={details}
            type={type}
          />
          <MobileMenu
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
        agencyLogo: '/assets/chapabiz-logo.png',
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
            name: 'Current Plan',
            link: `/agency/${id}/billing`,
            icon: 'rocket',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-billing-available`,
            name: 'Available Plans',
            link: `/agency/${id}/billing/available-plans`,
            icon: 'payment',
            agencyId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: `sidebar-${id}-billing-history`,
            name: 'Billing History',
            link: `/agency/${id}/billing/history`,
            icon: 'receipt',
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
          },
          {
            id: `sidebar-${id}-calendar`,
            name: 'Calendar',
            link: `/agency/${id}/calendar`,
            icon: 'calendar',
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
          <IconDock sidebarOptions={sidebarOpt} logo={sideBarLogo} type={type} />
          <FixedSubmenuPanel
            sidebarOptions={sidebarOpt}
            subAccounts={subaccounts}
            user={{ id: 'mock-user', name: 'Test User', role: 'AGENCY_OWNER' }}
            details={details}
            type={type}
          />
          <MobileMenu
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

  if (!user.Agency) return

  // Determine details and sidebar options based on type and id
  if (type === 'agency') {
    if (user.Agency.id === id) {
      details = user.Agency
      sidebarOpt = user.Agency.AgencySidebarOption || []
    } else {
      // Check invited agencies
      const invited = user?.InvitedAgencies?.find((agency: any) => agency.id === id)
      details = invited
      sidebarOpt = invited?.AgencySidebarOption || []
    }
  } else {
    // Subaccount logic
    details = user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)

    if (!details) {
      // Check permissions for invited subaccounts
      const permitted = user?.Permissions?.find((p: any) => p.subAccountId === id && p.access)
      if (permitted?.SubAccount) {
        details = permitted.SubAccount
      }
    }

    sidebarOpt = details?.SubAccountSidebarOption || []


    // Add Messages option if not present
    if (!sidebarOpt.find((opt) => opt.name === 'Messages')) {
      sidebarOpt.push({
        id: `sidebar-${details?.id}-messages`,
        name: 'Messages',
        icon: 'messages',
        link: `/subaccount/${details?.id}/messages`,
        subAccountId: details?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    }

    // Add Websites option if not present
    if (!sidebarOpt.find((opt) => opt.name === 'Websites')) {
      sidebarOpt.push({
        id: `sidebar-${details?.id}-websites`,
        name: 'Websites',
        icon: 'globe',
        link: `/subaccount/${details?.id}/websites`,
        subAccountId: details?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    }

    // Add Funnels option if not present
    if (!sidebarOpt.find((opt) => opt.name === 'Funnels')) {
      sidebarOpt.push({
        id: `sidebar-${details?.id}-funnels`,
        name: 'Funnels',
        icon: 'pipelines',
        link: `/subaccount/${details?.id}/funnels`,
        subAccountId: details?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    }

    // Add Pipelines option if not present
    if (!sidebarOpt.find((opt) => opt.name === 'Pipelines')) {
      sidebarOpt.push({
        id: `sidebar-${details?.id}-pipelines`,
        name: 'Pipelines',
        icon: 'kanban',
        link: `/subaccount/${details?.id}/pipelines`,
        subAccountId: details?.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    }

    // Add Inventory Management options
    const inventoryOptions = [
      { name: 'product Dashboard', icon: 'chart', link: `/subaccount/${details?.id}/inventory` },
      { name: 'Inventory', icon: 'package', link: `/subaccount/${details?.id}/inventory` },
      { name: 'Orders', icon: 'receipt', link: `/subaccount/${details?.id}/orders` },
      { name: 'Customer Details', icon: 'person', link: `/subaccount/${details?.id}/inventory/customers` },
      { name: 'Revenue Analytics', icon: 'analytics', link: `/subaccount/${details?.id}/inventory/analytics` },
    ]

    inventoryOptions.forEach(opt => {
      if (!sidebarOpt.find(existing => existing.name.toLowerCase() === opt.name.toLowerCase())) {
        sidebarOpt.push({
          id: `sidebar-${details?.id}-${opt.name.toLowerCase().replace(/\s+/g, '-')}`,
          name: opt.name,
          icon: opt.icon,
          link: opt.link,
          subAccountId: details?.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any)
      } else {
        // If it exists but with the wrong name/case (e.g. 'inventory' instead of 'Inventory'), 
        // we can update it to the preferred case if needed, but for dock matching we'll trust case-insensitive matching.
      }
    })
  }

  if (!details) return

  // Determine which logo to show
  if (type === 'subaccount') {
    // For subaccounts, show subaccount logo if it exists, otherwise fall back to agency logo
    sideBarLogo = (details as any)?.subAccountLogo || user.Agency.agencyLogo || '/assets/chapabiz-logo.png'
  } else {
    // For agency, show agency logo
    sideBarLogo = details.agencyLogo || user.Agency.agencyLogo || '/assets/chapabiz-logo.png'
  }

  if (type === 'agency') {
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
          name: 'Current Plan',
          link: `/agency/${id}/billing`,
          icon: 'rocket',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-billing-available`,
          name: 'Available Plans',
          link: `/agency/${id}/billing/available-plans`,
          icon: 'payment',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-billing-history`,
          name: 'Billing History',
          link: `/agency/${id}/billing/history`,
          icon: 'receipt',
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
        },
        {
          id: `sidebar-${id}-client-docs`,
          name: 'Client Docs',
          link: `/agency/${id}/client-docs`,
          icon: 'document',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `sidebar-${id}-calendar`,
          name: 'Calendar',
          link: `/agency/${id}/calendar`,
          icon: 'calendar',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
      console.log('✅ Created fallback sidebar options:', sidebarOpt)
    } else {
      // Check for billing subpages
      const hasCurrentPlan = sidebarOpt.some((option: any) => option.name === 'Current Plan')
      if (!hasCurrentPlan) {
        console.log('🔧 Adding Current Plan to existing sidebar options')
        // Replace old Billing if it exists
        const billingIndex = sidebarOpt.findIndex((option: any) => option.name === 'Billing')
        const newOpt = {
          id: `sidebar-${id}-billing-current`,
          name: 'Current Plan',
          link: `/agency/${id}/billing`,
          icon: 'rocket',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        if (billingIndex !== -1) {
          sidebarOpt[billingIndex] = newOpt
        } else {
          sidebarOpt.push(newOpt)
        }
        console.log('✅ Added Current Plan to sidebar options')
      }

      const hasAvailablePlans = sidebarOpt.some((option: any) => option.name === 'Available Plans')
      if (!hasAvailablePlans) {
        sidebarOpt.push({
          id: `sidebar-${id}-billing-available`,
          name: 'Available Plans',
          link: `/agency/${id}/billing/available-plans`,
          icon: 'payment',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      const hasBillingHistory = sidebarOpt.some((option: any) => option.name === 'Billing History')
      if (!hasBillingHistory) {
        sidebarOpt.push({
          id: `sidebar-${id}-billing-history`,
          name: 'Billing History',
          link: `/agency/${id}/billing/history`,
          icon: 'receipt',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      const hasInvoices = sidebarOpt.some((option: any) => option.name === 'Invoices')
      if (!hasInvoices) {
        sidebarOpt.push({
          id: `sidebar-${id}-billing-invoices`,
          name: 'Invoices',
          link: `/agency/${id}/billing/invoices`,
          icon: 'receipt',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      const hasPaymentMethods = sidebarOpt.some((option: any) => option.name === 'Payment Methods')
      if (!hasPaymentMethods) {
        sidebarOpt.push({
          id: `sidebar-${id}-billing-payment-methods`,
          name: 'Payment Methods',
          link: `/agency/${id}/billing/payment-methods`,
          icon: 'payment',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      const hasAddons = sidebarOpt.some((option: any) => option.name === 'Add-ons')
      if (!hasAddons) {
        sidebarOpt.push({
          id: `sidebar-${id}-billing-addons`,
          name: 'Add-ons',
          link: `/agency/${id}/billing/add-ons`,
          icon: 'rocket',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      const hasCalendar = sidebarOpt.some((option: any) => option.name === 'Calendar')
      if (!hasCalendar) {
        sidebarOpt.push({
          id: `sidebar-${id}-calendar`,
          name: 'Calendar',
          link: `/agency/${id}/calendar`,
          icon: 'calendar',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      // Check if Messages is missing from existing options

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

      // Check if Client Docs is missing from existing options
      const hasClientDocs = sidebarOpt.some((option: any) => option.name === 'Client Docs')
      if (!hasClientDocs) {
        console.log('🔧 Adding Client Docs to existing sidebar options')
        sidebarOpt.push({
          id: `sidebar-${id}-client-docs`,
          name: 'Client Docs',
          link: `/agency/${id}/client-docs`,
          icon: 'document',
          agencyId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        console.log('✅ Added Client Docs to sidebar options')
      }
    }
  }

  if (type === 'subaccount') {
    const targetSubaccount = user.Agency.SubAccount.find((subaccount: any) => subaccount.id === id)
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
        },
      ]

      // Add Inventory Management options to the fallback
      const inventoryFallbackOptions = [
        { name: 'product Dashboard', icon: 'chart', link: `/subaccount/${id}/inventory` },
        { name: 'Inventory', icon: 'package', link: `/subaccount/${id}/inventory` },
        { name: 'Orders', icon: 'receipt', link: `/subaccount/${id}/orders` },
        { name: 'Customer Details', icon: 'person', link: `/subaccount/${id}/inventory/customers` },
        { name: 'Revenue Analytics', icon: 'analytics', link: `/subaccount/${id}/inventory/analytics` },
      ]

      inventoryFallbackOptions.forEach(opt => {
        if (!sidebarOpt.find(existing => existing.name.toLowerCase() === opt.name.toLowerCase())) {
          sidebarOpt.push({
            id: `sidebar-${id}-${opt.name.toLowerCase().replace(/\s+/g, '-')}-fallback`,
            name: opt.name,
            icon: opt.icon,
            link: opt.link,
            subAccountId: id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any)
        }
      })

      console.log('✅ Created fallback sidebar options with Inventory:', sidebarOpt)
    }
  }

  subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  )

  // Inject Dashboards link if missing
  if (sidebarOpt && !sidebarOpt.find((opt: any) => opt.name === 'Dashboards')) {
    sidebarOpt.splice(1, 0, {
      id: `sidebar-dashboards-${type}`,
      name: 'Dashboards',
      icon: 'chart',
      link: '/dashboards',
      agencyId: type === 'agency' ? id : undefined,
      subAccountId: type === 'subaccount' ? id : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any)
  }

  // Final check for Inventory Management options (ensure they appear in the dock and submenus)
  if (type === 'subaccount') {
    const invItems = [
      { name: 'product Dashboard', icon: 'chart', link: `/subaccount/${id}/inventory` },
      { name: 'Inventory', icon: 'package', link: `/subaccount/${id}/inventory` },
      { name: 'Orders', icon: 'receipt', link: `/subaccount/${id}/orders` },
      { name: 'Customer Details', icon: 'person', link: `/subaccount/${id}/inventory/customers` },
      { name: 'Revenue Analytics', icon: 'analytics', link: `/subaccount/${id}/inventory/analytics` },
    ]
    console.log('💉 Injecting Inventory items for subaccount:', id)
    invItems.forEach(item => {
      if (!sidebarOpt.find((o: any) => o.name.toLowerCase() === item.name.toLowerCase())) {
        sidebarOpt.push({
          id: `manual-inv-${item.name.toLowerCase().replace(/\s+/g, '-')}-${id}`,
          ...item,
          subAccountId: id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any)
      }
    })
  }

  // Inject Client Submenu items
  const clientSubmenus = [
    { name: 'Assigned to me', link: type === 'agency' ? `/agency/${id}/clients/assigned` : `/subaccount/${id}/clients/assigned`, icon: 'person' },
    { name: 'Private', link: type === 'agency' ? `/agency/${id}/clients/private` : `/subaccount/${id}/clients/private`, icon: 'shield' },
    { name: 'All Clients', link: type === 'agency' ? `/agency/${id}/clients/all` : `/subaccount/${id}/clients/all`, icon: 'person' },
    { name: 'Client Profiles', link: type === 'agency' ? `/agency/${id}/clients/profiles` : `/subaccount/${id}/clients/profiles`, icon: 'person' },
    { name: 'Engagement', link: type === 'agency' ? `/agency/${id}/clients/engagement` : `/subaccount/${id}/clients/engagement`, icon: 'analytics' },
    { name: 'Client Insights', link: type === 'agency' ? `/agency/${id}/clients/insights` : `/subaccount/${id}/clients/insights`, icon: 'chart' },
  ]

  clientSubmenus.forEach(item => {
    if (sidebarOpt && !sidebarOpt.find((o: any) => o.name === item.name)) {
      sidebarOpt.push({
        id: `client-sub-${item.name.toLowerCase().replace(/\s+/g, '-')}-${id}`,
        name: item.name,
        icon: item.icon || 'person',
        link: item.link,
        agencyId: type === 'agency' ? id : undefined,
        subAccountId: type === 'subaccount' ? id : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any)
    }
  })

  // Inject Team Submenu items
  const teamSubmenusList = [
    { name: 'All Members', link: type === 'agency' ? `/agency/${id}/team/members` : `/subaccount/${id}/team/members`, icon: 'users' },
    { name: 'Roles & Permissions', link: type === 'agency' ? `/agency/${id}/team/roles` : `/subaccount/${id}/team/roles`, icon: 'shield' },
    { name: 'Availability', link: type === 'agency' ? `/agency/${id}/team/availability` : `/subaccount/${id}/team/availability`, icon: 'clock' },
    { name: 'Workload', link: type === 'agency' ? `/agency/${id}/team/workload` : `/subaccount/${id}/team/workload`, icon: 'chart' },
    { name: 'Performance', link: type === 'agency' ? `/agency/${id}/team/performance` : `/subaccount/${id}/team/performance`, icon: 'trending-up' },
    { name: 'Activity Logs', link: type === 'agency' ? `/agency/${id}/team/activity` : `/subaccount/${id}/team/activity`, icon: 'list' },
    { name: 'Invites', link: type === 'agency' ? `/agency/${id}/team/invites` : `/subaccount/${id}/team/invites`, icon: 'mail' },
  ]

  teamSubmenusList.forEach(item => {
    if (sidebarOpt && !sidebarOpt.find((o: any) => o.name === item.name)) {
      sidebarOpt.push({
        id: `team-sub-${item.name.toLowerCase().replace(/\s+/g, '-')}-${id}`,
        name: item.name,
        icon: item.icon || 'shield',
        link: item.link,
        agencyId: type === 'agency' ? id : undefined,
        subAccountId: type === 'subaccount' ? id : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any)
    }
  })

  // Inject Messages Submenu items
  const messageSubmenusList = [
    { name: 'Inbox', link: type === 'agency' ? `/agency/${id}/messages/inbox` : `/subaccount/${id}/messages/inbox`, icon: 'mail' },
    { name: 'Conversations', link: type === 'agency' ? `/agency/${id}/messages/conversations` : `/subaccount/${id}/messages/conversations`, icon: 'messages' },
    { name: 'Internal', link: type === 'agency' ? `/agency/${id}/messages/internal` : `/subaccount/${id}/messages/internal`, icon: 'shield' },
    { name: 'Subaccounts', link: type === 'agency' ? `/agency/${id}/messages/subaccounts` : `/subaccount/${id}/messages/subaccounts`, icon: 'users' },
    { name: 'Automated', link: type === 'agency' ? `/agency/${id}/messages/automated` : `/subaccount/${id}/messages/automated`, icon: 'zap' },
    { name: 'Announcements', link: type === 'agency' ? `/agency/${id}/messages/announcements` : `/subaccount/${id}/messages/announcements`, icon: 'award' },
    { name: 'System', link: type === 'agency' ? `/agency/${id}/messages/system` : `/subaccount/${id}/messages/system`, icon: 'settings' },
  ]

  messageSubmenusList.forEach(item => {
    if (sidebarOpt && !sidebarOpt.find((o: any) => o.name === item.name)) {
      sidebarOpt.push({
        id: `msg-sub-${item.name.toLowerCase().replace(/\s+/g, '-')}-${id}`,
        name: item.name,
        icon: item.icon || 'messages',
        link: item.link,
        agencyId: type === 'agency' ? id : undefined,
        subAccountId: type === 'subaccount' ? id : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any)
    }
  })

  // Inject Tasks Submenu items
  const tasksSubmenusList = [
    { name: 'All Tasks', link: type === 'agency' ? `/agency/${id}/tasks/all` : `/subaccount/${id}/tasks/all`, icon: 'list' },
    { name: 'Assigned to Me', link: type === 'agency' ? `/agency/${id}/tasks/assigned` : `/subaccount/${id}/tasks/assigned`, icon: 'person' },
    { name: 'Private', link: type === 'agency' ? `/agency/${id}/tasks/private` : `/subaccount/${id}/tasks/private`, icon: 'shield' },
    { name: 'Status', link: type === 'agency' ? `/agency/${id}/tasks/status` : `/subaccount/${id}/tasks/status`, icon: 'settings' },
    { name: 'Priority', link: type === 'agency' ? `/agency/${id}/tasks/priority` : `/subaccount/${id}/tasks/priority`, icon: 'flag' },
    { name: 'Subaccounts', link: type === 'agency' ? `/agency/${id}/tasks/subaccounts` : `/subaccount/${id}/tasks/subaccounts`, icon: 'users' },
    { name: 'Activity', link: type === 'agency' ? `/agency/${id}/tasks/activity` : `/subaccount/${id}/tasks/activity`, icon: 'list' },
  ]

  tasksSubmenusList.forEach(item => {
    if (sidebarOpt && !sidebarOpt.find((o: any) => o.name === item.name)) {
      sidebarOpt.push({
        id: `task-sub-${item.name.toLowerCase().replace(/\s+/g, '-')}-${id}`,
        name: item.name,
        icon: item.icon || 'list',
        link: item.link,
        agencyId: type === 'agency' ? id : undefined,
        subAccountId: type === 'subaccount' ? id : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any)
    }
  })

  // Inject Docs Submenu items
  const docsSubmenusList = [
    { name: 'All Docs', link: type === 'agency' ? `/agency/${id}/docs/all` : `/subaccount/${id}/docs/all`, icon: 'file' },
    { name: 'Shared', link: type === 'agency' ? `/agency/${id}/docs/shared` : `/subaccount/${id}/docs/shared`, icon: 'users' },
    { name: 'Assigned', link: type === 'agency' ? `/agency/${id}/docs/assigned` : `/subaccount/${id}/docs/assigned`, icon: 'person' },
    { name: 'Requests', link: type === 'agency' ? `/agency/${id}/docs/requests` : `/subaccount/${id}/docs/requests`, icon: 'clock' },
    { name: 'Templates', link: type === 'agency' ? `/agency/${id}/docs/templates` : `/subaccount/${id}/docs/templates`, icon: 'file' },
  ]

  docsSubmenusList.forEach(item => {
    if (sidebarOpt && !sidebarOpt.find((o: any) => o.name === item.name)) {
      sidebarOpt.push({
        id: `docs-sub-${item.name.toLowerCase().replace(/\s+/g, '-')}-${id}`,
        name: item.name,
        icon: item.icon || 'file',
        link: item.link,
        agencyId: type === 'agency' ? id : undefined,
        subAccountId: type === 'subaccount' ? id : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any)
    }
  })

  return (
    <>
      <IconDock sidebarOptions={sidebarOpt} logo={sideBarLogo} user={user} type={type} />
      <FixedSubmenuPanel
        sidebarOptions={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
        details={details}
        agencyId={type === 'agency' ? id : undefined}
        teamMembers={teamMembers}
        dashboards={dashboards}
        type={type}
      />
    </>
  )
}

export default Sidebar
