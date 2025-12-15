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
        icon: 'category',
        label: 'Dashboard',
        matchNames: ['Dashboard']
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
        matchNames: ['Billing']
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
    },
    {
        id: 'settings',
        icon: 'settings',
        label: 'Settings',
        matchNames: ['Settings']
    }
]


const IconDock = ({ sidebarOptions, logo, user }: Props) => {
    const { setHoveredMenuItem, activeCategory, setActiveCategory, isPanelCollapsed, setIsPanelCollapsed, setPanelTop } = useSidebar()
    const pathname = usePathname()

    // Group sidebar options by category
    const categorizedOptions = MENU_CATEGORIES.map(category => {
        const matchingOptions = sidebarOptions.filter(opt =>
            category.matchNames.includes(opt.name)
        )
        return {
            ...category,
            options: matchingOptions,
            hasOptions: matchingOptions.length > 0
        }
    }).filter(cat => cat.hasOptions)

    // Determine if a category is active based on current route
    const isCategoryActive = (category: typeof MENU_CATEGORIES[0]) => {
        return category.options.some(opt => pathname.includes(opt.link))
    }

    const handleCategoryHover = (categoryId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        setActiveCategory(categoryId)
        setHoveredMenuItem(categoryId)
        const rect = event.currentTarget.getBoundingClientRect()
        setPanelTop(rect.top)
    }

    const handleMouseLeave = () => {
        // Don't clear immediately to allow smooth transition to submenu panel
        setTimeout(() => {
            setHoveredMenuItem(null)
        }, 100)
    }

    return (

        <div
            className="fixed left-0 top-[50px] h-[calc(100vh-50px)] w-[50px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 z-50 transition-all duration-300"
            onMouseLeave={handleMouseLeave}
        >


            {/* Expand Toggle (Visible only when collapsed) */}
            {/* Sidebar Toggle (Always visible) */}
            <div className="w-full flex justify-center mb-4">
                <button
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    {isPanelCollapsed ? (
                        <ChevronsRight size={14} />
                    ) : (
                        <ChevronsLeft size={14} />
                    )}
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
                                'hover:bg-gray-100 dark:hover:bg-gray-800', // Hover state
                                // Open submenu state (not active)
                                activeCategory === category.id && !isActive && 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100',
                                // Active state - Glow Effect
                                isActive && 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 shadow-[0_0_15px_rgba(37,99,235,0.4)] dark:shadow-[0_0_15px_rgba(59,130,246,0.4)] ring-1 ring-blue-200 dark:ring-blue-800'
                            )}
                        >
                            <IconComponent
                                className={cn(
                                    'w-[18px] h-[18px] transition-all duration-200 mb-0.5',
                                    // Icon color logic
                                    !isActive && 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200',
                                    isActive && 'text-currentColor'
                                )}
                            />
                        </button>
                    )
                })}
            </div>



            {/* User Avatar at Bottom */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-800 w-full px-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold mx-auto overflow-hidden">
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                    ) : user ? (
                        // Initials or placeholder
                        user.name?.slice(0, 2).toUpperCase() || 'U'
                    ) : (
                        // Fallback to logo or 'U' if no user
                        'U'
                    )}
                </div>
            </div>
        </div>
    )
}

export default IconDock
