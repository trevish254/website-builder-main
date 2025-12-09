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
        id: 'tasks',
        icon: 'check',
        label: 'Tasks',
        matchNames: ['Tasks', 'Pipelines', 'Flowboard']
    },
    {
        id: 'content',
        icon: 'document',
        label: 'Content',
        matchNames: ['Client Docs', 'Funnels', 'Websites', 'Media']
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

const IconDock = ({ sidebarOptions, logo }: Props) => {
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
                className="fixed left-0 top-0 h-screen w-[80px] bg-gray-900 dark:bg-gray-950 border-r border-gray-800 dark:border-gray-900 flex flex-col items-center py-4 z-50"
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
                <div className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto">
                    {categorizedOptions.map((category) => {
                        const result = icons.find(icon => icon.value === category.icon)
                        const IconComponent = result?.path || Settings
                        const isActive = isCategoryActive(category)

                        return (
                            <button
                                key={category.id}
                                onMouseEnter={() => handleCategoryHover(category.id)}
                                className={cn(
                                    'w-full flex flex-col items-center justify-center rounded-lg transition-all duration-200 py-2 px-1',
                                    'hover:bg-gray-800 dark:hover:bg-gray-800',
                                    activeCategory === category.id && 'bg-gray-800 dark:bg-gray-800',
                                    isActive && 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                                )}
                            >
                                <IconComponent
                                    className={cn(
                                        'w-5 h-5 transition-colors mb-1',
                                        isActive ? 'text-white' : 'text-gray-400',
                                        activeCategory === category.id && !isActive && 'text-white'
                                    )}
                                />
                                <span className={cn(
                                    'text-[9px] font-medium text-center leading-tight transition-colors',
                                    isActive ? 'text-white' : 'text-gray-400',
                                    activeCategory === category.id && !isActive && 'text-white'
                                )}>
                                    {category.label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* User Avatar Placeholder at Bottom */}
                <div className="mt-auto pt-3 border-t border-gray-800 dark:border-gray-900 w-full px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold mx-auto">
                        U
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}

export default IconDock
