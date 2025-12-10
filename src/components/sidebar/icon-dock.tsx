'use client'

import React from 'react'
import { useSidebar } from '@/providers/sidebar-provider'
import { icons } from '@/lib/constants'
import { Settings } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
    const { setHoveredMenuItem, activeCategory, setActiveCategory } = useSidebar()
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

    const handleCategoryHover = (categoryId: string) => {
        setActiveCategory(categoryId)
        setHoveredMenuItem(categoryId)
    }

    const handleMouseLeave = () => {
        // Don't clear immediately to allow smooth transition to submenu panel
        setTimeout(() => {
            setHoveredMenuItem(null)
        }, 100)
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div
                className="fixed left-0 top-0 h-screen w-[60px] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 z-50 transition-all duration-300"
                onMouseLeave={handleMouseLeave}
            >
                {/* Logo */}
                <div className="mb-6 w-10 h-10 relative flex-shrink-0">
                    <img
                        src={logo}
                        alt="Logo"
                        className="rounded-lg object-cover w-full h-full"
                    />
                </div>

                {/* Category Icons */}
                <div className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto example-scrollbar-hide">
                    {categorizedOptions.map((category) => {
                        const result = icons.find(icon => icon.value === category.icon)
                        const IconComponent = result?.path || Settings
                        const isActive = isCategoryActive(category)

                        return (
                            <button
                                key={category.id}
                                onMouseEnter={() => handleCategoryHover(category.id)}
                                className={cn(
                                    'w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-200 mb-2 group relative',
                                    'hover:bg-gray-100 dark:hover:bg-gray-800', // Hover state
                                    // Open submenu state (not active)
                                    activeCategory === category.id && !isActive && 'bg-gray-100 dark:bg-gray-800',
                                    // Active state
                                    isActive && 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50 scale-105'
                                )}
                            >
                                <IconComponent
                                    className={cn(
                                        'w-5 h-5 transition-all duration-200 mb-0.5',
                                        // Active: White
                                        isActive ? 'text-white' :
                                            // Inactive: Gray-500 (light) / Gray-400 (dark), Hover/Open: Gray-700 / Gray-200
                                            'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200',
                                        activeCategory === category.id && !isActive && 'text-gray-700 dark:text-gray-200'
                                    )}
                                />
                                <span className={cn(
                                    'text-[9px] font-medium text-center leading-none transition-all duration-200 opacity-100', // Always visible
                                    isActive ? 'text-white font-bold' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300',
                                    activeCategory === category.id && !isActive && 'text-gray-600 dark:text-gray-400'
                                )}>
                                    {category.label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* User Avatar at Bottom */}
                <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-800 w-full px-2">
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
        </TooltipProvider>
    )
}

export default IconDock
