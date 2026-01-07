'use client'

import React from 'react'
import { useSidebar } from '@/providers/sidebar-provider'
import { icons } from '@/lib/constants'
import {
    Compass,
    Settings,
    User,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import UserButton from '@/components/global/user-button'

type SidebarOption = {
    id: string
    name: string
    icon: string
    link: string
}

type Props = {
    sidebarOptions: SidebarOption[]
    logo: string
    user?: any
    type: 'agency' | 'subaccount'
}


// Define menu categories with their icons and associated menu items
const MENU_CATEGORIES = [
    {
        id: 'home',
        icon: 'home',
        label: 'Home',
        matchNames: ['Overview', 'Launchpad']
    },
    {
        id: 'dashboard',
        icon: 'chart',
        label: 'Dashboard',
        matchNames: ['Dashboards']
    },
    {
        id: 'inventory',
        icon: 'package',
        label: 'Inventory',
        matchNames: ['product Dashboard', 'Inventory', 'Orders', 'Order', 'Customer Details', 'Revenue Analytics']
    },
    {
        id: 'clients',
        icon: 'person',
        label: 'Clients',
        matchNames: ['Sub Accounts']
    },
    {
        id: 'team',
        icon: 'users',
        label: 'Teams',
        matchNames: ['Team', 'Contacts']
    },
    {
        id: 'messages',
        icon: 'messages',
        label: 'Messages',
        matchNames: ['Messages']
    },
    {
        id: 'funnels',
        icon: 'pipelines',
        label: 'Funnels',
        matchNames: ['Funnels']
    },
    {
        id: 'pipelines',
        icon: 'kanban',
        label: 'Pipelines',
        matchNames: ['Pipelines', 'Flowboard', 'Tasks']
    },
    {
        id: 'websites',
        icon: 'globe',
        label: 'Websites',
        matchNames: ['Websites']
    },
    {
        id: 'content',
        icon: 'document',
        label: 'Content',
        matchNames: ['Client Docs', 'Media']
    },
    {
        id: 'automation',
        icon: 'settings',
        label: 'Automation',
        matchNames: ['Automations']
    },
    {
        id: 'finance',
        icon: 'payment',
        label: 'Finance',
        matchNames: ['Finance']
    },
    {
        id: 'upgrade',
        icon: 'rocket',
        label: 'Upgrade',
        matchNames: ['Current Plan', 'Available Plans', 'Billing History', 'Invoices', 'Payment Methods', 'Add-ons', 'Billing']
    },
    {
        id: 'kra',
        icon: 'government',
        label: 'KRA',
        matchNames: ['Government Services']
    },
    {
        id: 'calendar',
        icon: 'calendar',
        label: 'Calendar',
        matchNames: ['Calendar']
    }
]


const IconDock = ({ sidebarOptions, logo, user, type }: Props) => {
    const { setHoveredMenuItem, activeCategory, setActiveCategory, isPanelCollapsed, setIsPanelCollapsed, setPanelTop } = useSidebar()
    const pathname = usePathname()

    // Group sidebar options by category
    const categorizedOptions = MENU_CATEGORIES.map(category => {
        const matchingOptions = sidebarOptions.filter(opt =>
            category.matchNames.some(matchName => matchName.toLowerCase() === opt.name.toLowerCase())
        )
        return {
            ...category,
            options: matchingOptions,
            hasOptions: matchingOptions.length > 0
        }
    }).filter(cat => {
        // AGGRESSIVE FILTER: Hide inventory for agency type
        if (cat.id === 'inventory' && type === 'agency') {
            console.log('🚫 IconDock: Filtering out inventory for AGENCY type')
            return false
        }
        if (cat.id === 'inventory') {
            console.log('📦 IconDock Inventory State:', { hasOptions: cat.hasOptions, count: cat.options.length, items: cat.options.map(o => o.name) })
            // FAIL-SAFE: If it's a subaccount, force it to be visible even if empty (though it shouldn't be empty)
            if (type === 'subaccount') return true
        }
        return cat.hasOptions
    })

    console.log('🏗️ IconDock Final Categories:', categorizedOptions.map(c => c.id))

    // Determine if a category is active based on current route
    const isCategoryActive = (category: any) => {
        return category.options.some((opt: any) => {
            // Precise match for dashboard/overview to prevent root-overmatch
            if (opt.link.endsWith('/subaccount/' + (user?.Agency?.SubAccount?.[0]?.id || '')) ||
                opt.link.endsWith('/agency/' + (user?.Agency?.id || ''))) {
                return pathname === opt.link
            }
            // Otherwise check if current path starts with option link
            if (opt.link.length > 5) {
                return pathname.startsWith(opt.link)
            }
            return pathname === opt.link
        })
    }

    const handleCategoryHover = (categoryId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        setActiveCategory(categoryId)
        setHoveredMenuItem(categoryId)
        const rect = event.currentTarget.getBoundingClientRect()
        setPanelTop(rect.top)
    }

    const handleMouseLeave = () => {
        setTimeout(() => {
            setHoveredMenuItem(null)
        }, 100)
    }

    return (
        <div
            className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[50px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 z-50 transition-all duration-300"
            onMouseLeave={handleMouseLeave}
        >
            {/* Sidebar Toggle */}
            <div className="w-full flex justify-center mb-4">
                <button
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    {isPanelCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
                </button>
            </div>

            {/* Category Icons */}
            <div className="flex-1 flex flex-col gap-4 w-full px-2 overflow-y-auto example-scrollbar-hide">
                {categorizedOptions.map((category) => {
                    const result = icons.find(icon => icon.value === category.icon)
                    const IconComponent = result?.path || Settings
                    const isActive = isCategoryActive(category)

                    return (
                        <button
                            key={category.id}
                            onMouseEnter={(e) => handleCategoryHover(category.id, e)}
                            className={cn(
                                'w-10 h-10 flex flex-col items-center justify-center rounded-xl transition-all duration-200 mb-2 group relative',
                                'hover:bg-gray-100 dark:hover:bg-gray-800',
                                activeCategory === category.id && !isActive && 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                isActive && 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            )}
                        >
                            <IconComponent
                                className={cn(
                                    'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                                    isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                                )}
                            />
                        </button>
                    )
                })}
            </div>

            {/* User Avatar at Bottom (Mini Control) */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 w-full px-2">
                <div className="w-10 h-10 mx-auto">
                    <UserButton user={user} />
                </div>
            </div>
        </div>
    )
}

export default IconDock
