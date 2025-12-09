'use client'

import React, { useState } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { Menu, Search, Compass, ChevronDown, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { icons } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

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
    details: any
    id: string
    sidebarLogo: string
    sidebarOpt: SidebarOption[]
    subAccounts: SubAccount[]
    user: any
}

const MobileMenu = ({ details, id, sidebarLogo, sidebarOpt, subAccounts, user }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const pathname = usePathname()

    const filteredOptions = searchQuery
        ? sidebarOpt.filter(opt => opt.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : sidebarOpt

    return (
        <Sheet modal={false}>
            <SheetTrigger
                asChild
                className="absolute left-4 top-4 z-[100] md:!hidden flex"
            >
                <Button variant="outline" size={'icon'}>
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent
                showX={true}
                side={'left'}
                className="inline-block md:hidden z-[100] w-full bg-gray-50 dark:bg-gray-950 p-0"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 relative flex-shrink-0">
                                <Image
                                    src={sidebarLogo}
                                    alt="Logo"
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 block truncate">
                                    {details.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                                    {details.address || 'Organization'}
                                </span>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        <div className="space-y-1">
                            {filteredOptions.map((option) => {
                                const result = icons.find(icon => icon.value === option.icon)
                                const IconComponent = result?.path || Settings
                                const isActive = pathname.includes(option.link)

                                return (
                                    <SheetClose asChild key={option.id}>
                                        <Link
                                            href={option.link}
                                            className={cn(
                                                'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                                isActive && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                            )}
                                        >
                                            <IconComponent
                                                className={cn(
                                                    'w-5 h-5',
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
                                    </SheetClose>
                                )
                            })}
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="mt-auto p-6 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            {user?.avatarUrl ? (
                                <Image
                                    src={user.avatarUrl}
                                    alt="User"
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium block truncate">
                                    {user?.name || 'User'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 block truncate">
                                    {user?.email || 'user@example.com'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu
