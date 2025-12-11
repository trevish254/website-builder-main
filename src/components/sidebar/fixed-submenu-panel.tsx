'use client'

import React from 'react'
import { useSidebar } from '@/providers/sidebar-provider'
import { icons } from '@/lib/constants'

import { Settings, Search, Compass, ChevronDown, PlusCircleIcon, Users, LayoutGrid, Share2, EyeOff, Star, Clock, Building2, Briefcase, TrendingUp, UserPlus, Shield, Mail, User, Hash, CheckCircle, Circle, Calendar, AlertCircle, List, FileText, Globe, Archive, CreditCard, DollarSign, Receipt, Wallet, Zap, Package, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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
    subAccountType?: 'AGENCY' | 'TEAM' | 'INDIVIDUAL' | 'ORGANIZATION'
    companyName?: string
    createdAt: string
}

type Props = {
    sidebarOptions: SidebarOption[]
    subAccounts: SubAccount[]
    user: any
    details: any
    details: any
    agencyId?: string
    teamMembers?: any[]
}

// Define menu categories matching the icon dock
const MENU_CATEGORIES = [
    {
        id: 'home',
        label: 'Home',
        matchNames: ['Overview', 'Launchpad']
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        matchNames: ['Dashboard']
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
        matchNames: ['Billing']
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

const FixedSubmenuPanel = ({ sidebarOptions, subAccounts, user, details, agencyId, teamMembers }: Props) => {
    const { hoveredMenuItem, activeCategory, setHoveredMenuItem, isPanelCollapsed, setIsPanelCollapsed } = useSidebar()
    const pathname = usePathname()
    const [searchQuery, setSearchQuery] = React.useState('')

    // Get the active category or use the hovered one
    const displayCategory = hoveredMenuItem || activeCategory

    // Get options for the current category
    const getCurrentCategoryOptions = () => {
        if (!displayCategory) {
            return sidebarOptions.slice(0, 8)
        }

        const category = MENU_CATEGORIES.find(c => c.id === displayCategory)

        if (category) {
            console.log('FixedSubmenuPanel Debug:', {
                displayCategory,
                matchNames: category.matchNames,
                sidebarOptions: sidebarOptions.map(o => o.name),
                filtered: sidebarOptions.filter(opt => category.matchNames.includes(opt.name))
            })
            return sidebarOptions.filter(opt =>
                category.matchNames.some(n => n.toLowerCase() === opt.name.toLowerCase())
            )
        }

        return []
    }

    const filteredOptions = getCurrentCategoryOptions().filter(
        (option) =>
            option.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getCategoryLabel = () => {
        if (!displayCategory) return 'Menu'
        if (displayCategory === 'home') return 'Quick Access'
        return displayCategory.charAt(0).toUpperCase() + displayCategory.slice(1)
    }

    // Don't render anything if panel is collapsed
    // We handle the width transition in the parent wrapper
    // but we can hide content here if needed

    return (
        <>
            <div
                onMouseEnter={() => {
                    if (isPanelCollapsed && hoveredMenuItem) {
                        setHoveredMenuItem(hoveredMenuItem)
                        // Re-assert state after IconDock's timeout (100ms) to prevent flickering
                        setTimeout(() => setHoveredMenuItem(hoveredMenuItem), 120)
                    }
                }}
                onMouseLeave={() => {
                    if (isPanelCollapsed) {
                        setHoveredMenuItem(null)
                    }
                }}
                className={cn(
                    "fixed top-0 bottom-0 z-20 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 ease-out flex flex-col",
                    isPanelCollapsed
                        ? (hoveredMenuItem ? "w-[200px] left-[60px] opacity-100 pointer-events-auto border-l border-l-gray-200 dark:border-l-gray-800" : "w-0 opacity-0 pointer-events-none")
                        : "w-[200px] left-[60px]"
                )}
            >
                {/* Search Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-800 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Label */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                        {getCategoryLabel()}
                    </p>
                </div>

                {/* Scrollable Menu Items */}
                <div className="flex-1 overflow-y-auto px-3 py-2">
                    {displayCategory === 'dashboard' ? (
                        /* Custom Dashboard Panel */
                        <div className="space-y-3">
                            {/* Add Dashboard Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Dashboard</span>
                            </Button>

                            {/* Dashboards Section with Dropdown */}
                            <div className="space-y-1">
                                <button className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                                    <span>Dashboards</span>
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                <div className="space-y-0.5 pl-1">
                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">All Dashboards</span>
                                    </Link>

                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">My Dashboards</span>
                                    </Link>

                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Assigned to me</span>
                                    </Link>

                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Private</span>
                                    </Link>

                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Favorites</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Recents Section */}
                            <div className="space-y-1">
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Recents
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Recent Dashboards</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : displayCategory === 'clients' ? (
                        /* Custom Clients Panel */
                        <div className="space-y-3">
                            {/* Add Subaccount Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => {
                                    // Navigate to create subaccount modal/page
                                }}
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Subaccount</span>
                            </Button>

                            {/* Subaccounts Section */}
                            <div className="space-y-0.5 pl-1">
                                <Link
                                    href={`/agency/${agencyId}/all-subaccounts`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">All Subaccounts</span>
                                    <span className="ml-auto text-xs text-gray-400">{subAccounts.length}</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Team Subaccount</span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {subAccounts.filter(s => s.subAccountType === 'TEAM').length}
                                    </span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Agency Subaccounts</span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {subAccounts.filter(s => !s.subAccountType || s.subAccountType === 'AGENCY').length}
                                    </span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Individual Subaccount</span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {subAccounts.filter(s => s.subAccountType === 'INDIVIDUAL').length}
                                    </span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Briefcase className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Organization Subaccount</span>
                                    <span className="ml-auto text-xs text-gray-400">
                                        {subAccounts.filter(s => s.subAccountType === 'ORGANIZATION').length}
                                    </span>
                                </Link>

                                <div className="pt-2 pb-1">
                                    <div className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        Assigned to me
                                    </div>
                                    <div className="space-y-0.5">
                                        {subAccounts.filter(subAccount => {
                                            const permission = user?.Permissions?.find(
                                                (p: any) => p.subAccountId === subAccount.id
                                            )
                                            return permission?.access
                                        }).length > 0 ? (
                                            subAccounts
                                                .filter(subAccount => {
                                                    const permission = user?.Permissions?.find(
                                                        (p: any) => p.subAccountId === subAccount.id
                                                    )
                                                    return permission?.access
                                                })
                                                .map((subAccount) => (
                                                    <Link
                                                        key={subAccount.id}
                                                        href={`/subaccount/${subAccount.id}`}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <div className="relative w-4 h-4">
                                                            <Image
                                                                src={subAccount.subAccountLogo}
                                                                alt="Subaccount Logo"
                                                                fill
                                                                className="rounded-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-sm truncate">{subAccount.name}</span>
                                                    </Link>
                                                ))
                                        ) : (
                                            <div className="px-3 py-2 text-sm text-gray-500">No subaccounts assigned</div>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href={`/agency/${agencyId}/analytics`}
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 group"
                                >
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Analytics</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                                        <ChevronRight className="h-3 w-3" />
                                    </Button>
                                </Link>
                            </div>

                            {/* Recent Section */}
                            <div className="space-y-1">
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Recent Subaccounts
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    {[...subAccounts]
                                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                        .slice(0, 3)
                                        .map((subAccount) => (
                                            <Link
                                                key={subAccount.id}
                                                href={`/subaccount/${subAccount.id}`}
                                                className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                            >
                                                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                <span className="text-sm truncate">{subAccount.name}</span>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ) : displayCategory === 'team' ? (
                        /* Custom Teams Panel */
                        <div className="space-y-3">
                            {/* Quick Invite Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                                onClick={() => {
                                    // Navigate to team page with invite modal open trigger if possible, or just team page
                                    if (agencyId) window.location.href = `/agency/${agencyId}/team`
                                }}
                            >
                                <UserPlus className="w-4 h-4" />
                                <span className="text-sm font-medium">Quick Invite</span>
                            </Button>

                            {/* Team Members Section */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between px-2 py-1.5">
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Team Members
                                    </span>
                                    <Link href={`/agency/${agencyId}/team`}>
                                        <PlusCircleIcon className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                                    </Link>
                                </div>
                                <div className="space-y-0.5 pl-1 max-h-[200px] overflow-y-auto">
                                    {teamMembers && teamMembers.length > 0 ? (
                                        teamMembers.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                            >
                                                <div className="relative w-5 h-5 min-w-[20px]">
                                                    <Image
                                                        src={member.avatarUrl}
                                                        alt={member.name}
                                                        fill
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-sm truncate text-gray-700 dark:text-gray-300">{member.name}</span>
                                                    <span className="text-[10px] text-gray-500 truncate">{member.role}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">No team members found</div>
                                    )}
                                </div>
                            </div>

                            {/* Management Sections */}
                            <div className="space-y-0.5 pl-1 border-t border-gray-200 dark:border-gray-800 pt-2">
                                <Link
                                    href={`/agency/${agencyId}/team?tab=roles`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Roles & Permissions</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/team?tab=flowboard`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Flowboard</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/team?tab=settings`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Settings</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/team?tab=analytics`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Analytics</span>
                                </Link>
                            </div>
                        </div>
                    ) : displayCategory === 'messages' ? (
                        /* Custom Messages Panel */
                        <div className="space-y-3">
                            {/* New Message Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">New Message</span>
                            </Button>

                            {/* Inbox Categories */}
                            <div className="space-y-0.5 pl-1">
                                <Link
                                    href={`/agency/${agencyId}/messages`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Inbox</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=me`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Me</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=team`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Team</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=agency`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Agency</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=personal`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Personal</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=groups`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Groups</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=channels`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Channels</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=read`}
                                    className="flex items-center justify-between px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Read</span>
                                    </div>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">12</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/messages?filter=unread`}
                                    className="flex items-center justify-between px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Circle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Unread</span>
                                    </div>
                                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">5</span>
                                </Link>
                            </div>
                        </div>
                    ) : displayCategory === 'pipelines' ? (
                        /* Custom Tasks Panel */
                        /* Custom Tasks Panel */
                        <div className="space-y-3">
                            {/* Add Task Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Create Task</span>
                            </Button>

                            {/* My Tasks Section */}
                            <div className="space-y-1">
                                {getCurrentCategoryOptions().length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Apps
                                        </div>
                                        <div className="space-y-0.5 pl-1">
                                            {getCurrentCategoryOptions().map((option) => {
                                                const iconResult = icons.find(icon => icon.value === option.icon)
                                                const IconComponent = iconResult?.path || Settings
                                                return (
                                                    <Link
                                                        key={option.id}
                                                        href={option.link}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        <span className="text-sm">{option.name}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    My Tasks
                                </div>
                                <div className="space-y-0.5 pl-1">
                                    <Link
                                        href={`/agency/${agencyId}/tasks`}
                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">All tasks</span>
                                    </Link>

                                    <Link
                                        href={`/agency/${agencyId}/tasks?filter=assigned`}
                                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm">Assigned to me</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">12</span>
                                    </Link>

                                    <Link
                                        href={`/agency/${agencyId}/tasks?filter=overdue`}
                                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm">Today & Overdue</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">3</span>
                                    </Link>

                                    <Link
                                        href={`/agency/${agencyId}/tasks?filter=personal`}
                                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm">Personal List</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">5</span>
                                    </Link>

                                    <Link
                                        href={`/agency/${agencyId}/tasks?filter=priority`}
                                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm">Priority</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">8</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Other Links */}
                            <div className="space-y-0.5 pl-1 border-t border-gray-200 dark:border-gray-800 pt-2">
                                <Link
                                    href={`/agency/${agencyId}/tasks/pool`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Task Pool</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/team?tab=calendar`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Calendar</span>
                                </Link>
                            </div>
                        </div>
                    ) : displayCategory === 'content' ? (
                        /* Custom Content Panel */
                        /* Custom Content Panel */
                        <div className="space-y-3">
                            {/* Create Docs Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Create Docs</span>
                            </Button>

                            {/* Document Categories */}
                            <div className="space-y-0.5 pl-1">
                                {getCurrentCategoryOptions().length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Apps
                                        </div>
                                        <div className="space-y-0.5">
                                            {getCurrentCategoryOptions().map((option) => {
                                                const iconResult = icons.find(icon => icon.value === option.icon)
                                                const IconComponent = iconResult?.path || Settings
                                                return (
                                                    <Link
                                                        key={option.id}
                                                        href={option.link}
                                                        className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                                    >
                                                        <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        <span className="text-sm">{option.name}</span>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                                <Link
                                    href={`/agency/${agencyId}/client-docs`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">All Docs</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">My Docs</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">4</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Shared with me</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">2</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Private</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">1</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Meeting Notes</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">7</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Archive className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Archived</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">12</span>
                                </Link>

                                <Link
                                    href="#"
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm">Favourite</span>
                                    </div>
                                    <span className="text-xs text-gray-400 font-medium">3</span>
                                </Link>

                                {/* Recent Section */}
                                <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                                    <div className="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Recent
                                    </div>
                                    <div className="space-y-0.5">
                                        {/* Placeholder Recent Docs */}
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        >
                                            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm truncate">Project Proposal</span>
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                        >
                                            <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <span className="text-sm truncate">Q4 Marketing Plan</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : displayCategory === 'finance' ? (
                        /* Custom Finance Panel */
                        /* Custom Finance Panel */
                        <div className="space-y-3">
                            {/* Add Payment Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Payment</span>
                            </Button>

                            {/* Finance Categories */}
                            <div className="space-y-0.5 pl-1">
                                <Link
                                    href={`/agency/${agencyId}/finance`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Initiate Payment</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/finance`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">APIs</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/finance`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Analytics</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/finance`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Receipt className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Invoices</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/finance`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Transactions</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/finance`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Reports</span>
                                </Link>
                            </div>
                        </div>
                    ) : displayCategory === 'upgrade' ? (
                        /* Custom Upgrade Panel */
                        /* Custom Upgrade Panel */
                        <div className="space-y-3">
                            {/* Upgrade Plan Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                size="sm"
                            >
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">Upgrade Plan</span>
                            </Button>

                            {/* Subscription Categories */}
                            <div className="space-y-0.5 pl-1">
                                <Link
                                    href={`/agency/${agencyId}/billing`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Package className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Current Plan</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/billing`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Star className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Available Plans</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/billing`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Billing History</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/billing`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Receipt className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Invoices</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/billing`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Wallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Payment Methods</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/billing`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Award className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Add-ons</span>
                                </Link>
                            </div>
                        </div>
                    ) : displayCategory === 'kra' ? (
                        /* Custom KRA Panel */
                        <div className="space-y-3">
                            {/* File Return Button */}
                            <Button
                                className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                                onClick={() => {
                                    window.location.href = `/agency/${agencyId}/government-services/file-returns`
                                }}
                            >
                                <PlusCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">File Return</span>
                            </Button>

                            {/* KRA/Government Services Categories */}
                            <div className="space-y-0.5 pl-1">
                                <Link
                                    href={`/agency/${agencyId}/government-services/file-returns`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Tax Returns</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/government-services`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Compliance</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/government-services/generate-prns`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Receipt className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">VAT/Tax Invoices</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/government-services/verify-documents`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Certificates</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/government-services`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Filing Deadlines</span>
                                </Link>

                                <Link
                                    href={`/agency/${agencyId}/government-services`}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                >
                                    <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm">Reports</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* Regular Menu Items for Other Categories */
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


                {/* Account Switcher */}
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
                                            src={details?.agencyLogo || details?.subAccountLogo || '/assets/plura-logo.svg'}
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
                                    {user?.InvitedAgencies && user.InvitedAgencies.length > 0 && (
                                        <CommandGroup heading="Invited Agencies">
                                            {user.InvitedAgencies.map((agency: any) => (
                                                <CommandItem key={agency.id}>
                                                    <Link
                                                        href={`/agency/${agency.id}`}
                                                        className="flex gap-3 w-full"
                                                    >
                                                        <div className="relative w-10 h-10">
                                                            <Image
                                                                src={agency.agencyLogo || '/assets/plura-logo.svg'}
                                                                alt="Agency Logo"
                                                                fill
                                                                className="rounded-md object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1 min-w-0">
                                                            <span className="truncate">{agency.name}</span>
                                                            <span className="text-xs text-muted-foreground truncate">
                                                                {agency.role || 'Team Member'}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </CommandItem>
                                            ))}
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
                </div >
            </div >
            {/* Collapse Toggle Button */}
            < div
                className={
                    cn(
                        "fixed top-6 z-30 transition-all duration-300 ease-out",
                        isPanelCollapsed ? "left-[90px]" : "left-[270px]"
                    )
                }
            >
                <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md border-gray-200 dark:border-gray-800 hover:bg-gray-100 flex items-center justify-center p-0"
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                >
                    {isPanelCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    ) : (
                        <ChevronLeft className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    )}
                </Button>
            </div >
        </>
    )
}

export default FixedSubmenuPanel
