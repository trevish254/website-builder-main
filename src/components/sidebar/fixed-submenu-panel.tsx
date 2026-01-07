'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import { useSidebar } from '@/providers/sidebar-provider'
import { icons } from '@/lib/constants'

import {
    Settings, Search, Compass, ChevronDown, PlusCircleIcon, Users, LayoutGrid, Share2, EyeOff, Star, Clock, Building2, Briefcase, TrendingUp, UserPlus, Shield, Mail, User, Hash, CheckCircle, Circle, Calendar, AlertCircle, List, FileText, Globe, Archive, CreditCard, DollarSign, Receipt, Wallet, Zap, Package, Award, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

type SidebarOption = {
    id: string
    name: string
    icon: string
    link: string
}

type SubAccount = {
    id: string
    name: string
    subAccountLogo: string
    address: string
}

type Props = {
    sidebarOptions: SidebarOption[]
    subAccounts: SubAccount[]
    user: any
    details: any
    agencyId?: string
    type: 'agency' | 'subaccount'
    teamMembers?: any[]
    dashboards?: any[]
}

const MENU_CATEGORIES_RAW = [
    {
        id: 'home',
        label: 'Home',
        matchNames: ['Overview', 'Launchpad']
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        matchNames: ['Dashboards']
    },
    {
        id: 'inventory',
        label: 'Inventory Management',
        matchNames: ['product Dashboard', 'Inventory', 'Orders', 'Order', 'Customer Details', 'Revenue Analytics']
    },
    {
        id: 'clients',
        label: 'Clients',
        matchNames: ['Sub Accounts']
    },
    {
        id: 'team',
        label: 'Teams',
        matchNames: ['Team', 'Contacts']
    },
    {
        id: 'messages',
        label: 'Messages',
        matchNames: ['Messages']
    },
    {
        id: 'funnels',
        label: 'Funnels',
        matchNames: ['Funnels']
    },
    {
        id: 'pipelines',
        label: 'Pipelines',
        matchNames: ['Pipelines', 'Flowboard', 'Tasks']
    },
    {
        id: 'websites',
        label: 'Websites',
        matchNames: ['Websites']
    },
    {
        id: 'content',
        label: 'Content',
        matchNames: ['Client Docs', 'Media']
    },
    {
        id: 'automation',
        label: 'Automation',
        matchNames: ['Automations']
    },
    {
        id: 'finance',
        label: 'Finance',
        matchNames: ['Finance']
    },
    {
        id: 'upgrade',
        label: 'Upgrade',
        matchNames: ['Current Plan', 'Available Plans', 'Billing History', 'Invoices', 'Payment Methods', 'Add-ons', 'Billing']
    },
    {
        id: 'kra',
        label: 'KRA',
        matchNames: ['Government Services']
    },
    {
        id: 'calendar',
        label: 'Calendar',
        matchNames: ['Calendar']
    },
    {
        id: 'settings',
        label: 'Settings',
        matchNames: ['Settings']
    }
]

const FixedSubmenuPanel = ({ sidebarOptions, subAccounts, user, details, agencyId, type, teamMembers = [], dashboards = [] }: Props) => {
    const currentAgencyId = agencyId || (details as any)?.agencyId
    const { hoveredMenuItem, activeCategory, setHoveredMenuItem, isPanelCollapsed, setIsPanelCollapsed, panelTop } = useSidebar()
    const pathname = usePathname()
    const [searchQuery, setSearchQuery] = useState('')
    const panelRef = useRef<HTMLDivElement>(null)
    const [adjustedTop, setAdjustedTop] = useState<number | null>(null)

    const MENU_CATEGORIES = MENU_CATEGORIES_RAW.filter(cat => {
        if (cat.id === 'inventory' && type === 'agency') {
            return false
        }
        return true
    })

    useLayoutEffect(() => {
        if (!isPanelCollapsed || !panelTop || !panelRef.current) {
            setAdjustedTop(null)
            return
        }

        const panelHeight = panelRef.current.offsetHeight
        const viewportHeight = window.innerHeight
        const margin = 20
        const headerSpace = 60

        let newTop = panelTop
        if (panelTop + panelHeight + margin > viewportHeight) {
            newTop = viewportHeight - panelHeight - margin
        }
        if (newTop < headerSpace) {
            newTop = headerSpace
        }

        setAdjustedTop(newTop)
    }, [isPanelCollapsed, panelTop, hoveredMenuItem])

    const displayCategory = hoveredMenuItem || activeCategory

    const getCurrentCategoryOptions = () => {
        if (!displayCategory) return []
        const category = MENU_CATEGORIES.find(c => c.id === displayCategory)
        if (category) {
            return sidebarOptions.filter((opt: SidebarOption) =>
                category.matchNames.some(n => n.toLowerCase() === opt.name.toLowerCase())
            )
        }
        return []
    }

    const filteredOptions = getCurrentCategoryOptions().filter(
        (option: SidebarOption) =>
            option.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getCategoryLabel = () => {
        if (!displayCategory) return 'Menu'
        if (displayCategory === 'home') return 'Quick Access'
        const cat = MENU_CATEGORIES.find(c => c.id === displayCategory)
        return cat ? cat.label : displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)
    }

    return (
        <div
            ref={panelRef}
            onMouseEnter={() => {
                if (isPanelCollapsed && hoveredMenuItem) {
                    setHoveredMenuItem(hoveredMenuItem)
                    setTimeout(() => setHoveredMenuItem(hoveredMenuItem), 120)
                }
            }}
            onMouseLeave={() => {
                if (isPanelCollapsed) {
                    setHoveredMenuItem(null)
                }
            }}
            style={adjustedTop !== null ? { top: `${adjustedTop}px`, bottom: 'auto' } : {}}
            className={cn(
                "fixed z-20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 ease-out flex flex-col",
                (hoveredMenuItem ? "w-[240px] left-[50px] opacity-100 pointer-events-auto border-l border-l-gray-200 dark:border-l-gray-800 h-auto max-h-[calc(100vh-80px)] rounded-[4px] border-b border-b-gray-200 dark:border-b-gray-800" : "w-0 opacity-0 pointer-events-none bottom-0"),
                !isPanelCollapsed && "md:w-[240px] md:left-[50px] md:bottom-0 md:top-16 md:rounded-none md:border-y-0 md:opacity-100 md:pointer-events-auto md:max-h-[calc(100vh-64px)]"
            )}
        >
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {getCategoryLabel()}
                    </h2>
                    <button
                        onClick={() => setIsPanelCollapsed(true)}
                        className="h-6 w-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <ChevronsLeft size={14} />
                    </button>
                </div>
                <div className="relative group">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search..."
                        className="pl-8 h-8 text-xs bg-gray-50/50 dark:bg-zinc-900/50 border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-blue-500/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {displayCategory === 'dashboard' ? (
                    <div className="space-y-3">
                        <Link href={`/dashboards?openAdd=true`} className="block">
                            <Button
                                className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Dashboard</span>
                            </Button>
                        </Link>

                        <div className="space-y-2">
                            <div className="px-2 py-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Filters</p>
                            </div>
                            {[
                                { name: 'All', icon: LayoutGrid, count: dashboards?.length || 0 },
                                { name: 'My', icon: User, count: dashboards?.filter((d: any) => d.createdBy === user?.id).length || 0 },
                                { name: 'Assigned to me', icon: UserPlus, count: dashboards?.filter((d: any) => d.assignedTo?.includes(user?.id)).length || 0 },
                                { name: 'Private', icon: EyeOff, count: dashboards?.filter((d: any) => d.isPrivate).length || 0 },
                                { name: 'Favorites', icon: Star, count: dashboards?.filter((d: any) => d.isFavorite).length || 0 },
                            ].map((item) => {
                                const isActive = pathname.includes(`/dashboards?filter=${item.name.toLowerCase()}`)
                                return (
                                    <Link
                                        key={item.name}
                                        href={`/dashboards?filter=${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        className={cn(
                                            'flex items-center justify-between px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon
                                                className={cn(
                                                    'w-4 h-4',
                                                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                                )}
                                            />
                                            <span className={cn(
                                                'text-sm',
                                                isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                            )}>
                                                {item.name}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.count}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {dashboards && dashboards.length > 0 && (
                            <div className="space-y-2">
                                <div className="px-2 py-1">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recents</p>
                                </div>
                                {dashboards.slice(0, 3).map((dashboard: any) => (
                                    <Link
                                        key={dashboard.id}
                                        href={`/dashboards/${dashboard.id}`}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{dashboard.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : displayCategory === 'team' ? (
                    <div className="space-y-3">
                        {type === 'agency' && (
                            <Link href={`/agency/${currentAgencyId}/team?openAdd=true`} className="block">
                                <Button
                                    className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                                    size="sm"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Team Member</span>
                                </Button>
                            </Link>
                        )}

                        <div className="space-y-0.5">
                            {filteredOptions.map((option) => {
                                const result = icons.find(icon => icon.value === option.icon)
                                const IconComponent = result?.path || Settings
                                const isActive = pathname.includes(option.link)

                                return (
                                    <Link
                                        key={option.id}
                                        href={option.link}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <IconComponent
                                            className={cn(
                                                'w-4 h-4',
                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                            )}
                                        />
                                        <span className={cn(
                                            'text-sm',
                                            isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {option.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>

                        {teamMembers && teamMembers.length > 0 && (
                            <div className="space-y-2">
                                <div className="px-2 py-1">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Team Members ({teamMembers.length})</p>
                                </div>
                                {teamMembers.slice(0, 5).map((member: any) => (
                                    <div
                                        key={member.id}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                                            {member.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{member.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : displayCategory === 'clients' ? (
                    <div className="space-y-3">
                        {type === 'agency' && (
                            <Link href={`/agency/${currentAgencyId}/all-subaccounts?openAdd=true`} className="block">
                                <Button
                                    className="w-full justify-start gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                                    size="sm"
                                >
                                    <PlusCircleIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Client</span>
                                </Button>
                            </Link>
                        )}

                        <div className="space-y-0.5">
                            {filteredOptions.map((option) => {
                                const result = icons.find(icon => icon.value === option.icon)
                                const IconComponent = result?.path || Settings
                                const isActive = pathname.includes(option.link)

                                return (
                                    <Link
                                        key={option.id}
                                        href={option.link}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <IconComponent
                                            className={cn(
                                                'w-4 h-4',
                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                            )}
                                        />
                                        <span className={cn(
                                            'text-sm',
                                            isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {option.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>

                        {subAccounts && subAccounts.length > 0 && (
                            <div className="space-y-2">
                                <div className="px-2 py-1">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Clients ({subAccounts.length})</p>
                                </div>
                                {subAccounts.slice(0, 5).map((subaccount: any) => (
                                    <Link
                                        key={subaccount.id}
                                        href={`/subaccount/${subaccount.id}`}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                    >
                                        <div className="w-6 h-6 relative flex-shrink-0 rounded overflow-hidden">
                                            <Image
                                                src={subaccount.subAccountLogo || '/assets/chapabiz-logo.png'}
                                                alt={subaccount.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">{subaccount.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subaccount.address}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : displayCategory === 'inventory' ? (
                    <div className="space-y-3">
                        <Link href={`/subaccount/${details?.id || 'id'}/inventory?openAdd=true`} className="block">
                            <Button
                                className="w-full justify-start gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Product</span>
                            </Button>
                        </Link>

                        <div className="space-y-0.5">
                            {[
                                { name: 'product Dashboard', icon: LayoutGrid, link: `/subaccount/${details?.id || 'id'}/inventory` },
                                { name: 'Inventory', icon: Package, link: `/subaccount/${details?.id || 'id'}/inventory` },
                                { name: 'Orders', icon: Receipt, link: `/subaccount/${details?.id || 'id'}/orders` },
                                { name: 'Customer Details', icon: Users, link: `/subaccount/${details?.id || 'id'}/inventory/customers` },
                                { name: 'Revenue Analytics', icon: TrendingUp, link: `/subaccount/${details?.id || 'id'}/inventory/analytics` },
                            ].map((item) => {
                                const isActive = pathname === item.link
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                'w-4 h-4',
                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                            )}
                                        />
                                        <span className={cn(
                                            'text-sm',
                                            isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {item.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ) : displayCategory === 'upgrade' ? (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="px-2 py-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Plan Management</p>
                            </div>
                            {filteredOptions.filter((opt: any) =>
                                ['Current Plan', 'Available Plans', 'Add-ons'].includes(opt.name)
                            ).map((option) => {
                                const result = icons.find(icon => icon.value === option.icon)
                                const IconComponent = result?.path || Settings
                                const isActive = pathname.includes(option.link)

                                return (
                                    <Link
                                        key={option.id}
                                        href={option.link}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <IconComponent
                                            className={cn(
                                                'w-4 h-4',
                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                            )}
                                        />
                                        <span className={cn(
                                            'text-sm',
                                            isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {option.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="space-y-2">
                            <div className="px-2 py-1">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Billing & Payments</p>
                            </div>
                            {filteredOptions.filter((opt: any) =>
                                ['Billing History', 'Invoices', 'Payment Methods'].includes(opt.name)
                            ).map((option) => {
                                const result = icons.find(icon => icon.value === option.icon)
                                const IconComponent = result?.path || Settings
                                const isActive = pathname.includes(option.link)

                                return (
                                    <Link
                                        key={option.id}
                                        href={option.link}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <IconComponent
                                            className={cn(
                                                'w-4 h-4',
                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                            )}
                                        />
                                        <span className={cn(
                                            'text-sm',
                                            isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {option.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const result = icons.find(icon => icon.value === option.icon)
                                const IconComponent = result?.path || Settings
                                const isActive = pathname.includes(option.link)

                                return (
                                    <Link
                                        key={option.id}
                                        href={option.link}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                            isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        )}
                                    >
                                        <IconComponent
                                            className={cn(
                                                'w-4 h-4',
                                                isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                                            )}
                                        />
                                        <span className={cn(
                                            'text-sm',
                                            isActive ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                                        )}>
                                            {option.name}
                                        </span>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                                {searchQuery ? 'No results found' : 'No items'}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-800">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 h-auto py-2"
                        >
                            <div className="flex items-center gap-2 w-full min-w-0">
                                <div className="w-6 h-6 relative flex-shrink-0">
                                    <Image
                                        src={details?.agencyLogo || details?.subAccountLogo || '/assets/chapabiz-logo.png'}
                                        alt="Logo"
                                        fill
                                        className="rounded object-cover"
                                    />
                                </div>
                                <span className="truncate flex-1 text-xs">{details?.name || 'Account'}</span>
                                <ChevronDown className="h-3 w-3 flex-shrink-0" />
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[180px]" side="top" align="start" sideOffset={8}>
                        <Command className="rounded-lg">
                            <CommandInput placeholder="Search Accounts..." />
                            <CommandList>
                                <CommandEmpty>No results found</CommandEmpty>
                                {user?.Agency && (
                                    <CommandGroup heading="Agency">
                                        <CommandItem>
                                            <Link
                                                href={`/agency/${user.Agency.id}`}
                                                className="flex gap-3 w-full"
                                            >
                                                <div className="relative w-10 h-10">
                                                    <Image
                                                        src={user.Agency.agencyLogo}
                                                        alt="Agency Logo"
                                                        fill
                                                        className="rounded-md object-contain"
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="truncate">{user.Agency.name}</span>
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        {user.Agency.address}
                                                    </span>
                                                </div>
                                            </Link>
                                        </CommandItem>
                                    </CommandGroup>
                                )}
                                {subAccounts && subAccounts.length > 0 && (
                                    <CommandGroup heading="Sub Accounts">
                                        {subAccounts.map((subaccount) => (
                                            <CommandItem key={subaccount.id}>
                                                <Link
                                                    href={`/subaccount/${subaccount.id}`}
                                                    className="flex gap-3 w-full"
                                                >
                                                    <div className="relative w-10 h-10">
                                                        <Image
                                                            src={subaccount.subAccountLogo}
                                                            alt="Subaccount Logo"
                                                            fill
                                                            className="rounded-md object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className="truncate">{subaccount.name}</span>
                                                        <span className="text-xs text-muted-foreground truncate">
                                                            {subaccount.address}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default FixedSubmenuPanel
