'use client'

import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import {
  ChevronsUpDown,
  ChevronDown,
  Compass,
  Menu,
  PlusCircleIcon,
  Search,
  Home,
  LogOut,
  User,
  Settings,
  Shield,
  HelpCircle,
  Crown,
  Users,
  Eye,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import SubAccountDetails from '../forms/subaccount-details'
import { Separator } from '../ui/separator'
import { icons } from '@/lib/constants'
import { useSidebar } from '@/providers/sidebar-provider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

type Props = {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: any
  user: any
  id: string
}

const SIDEBAR_GROUPS = [
  {
    label: 'MENU',
    options: ['Dashboard', 'Launchpad', 'Overview'],
  },
  {
    label: 'MANAGEMENT',
    options: ['Sub Accounts', 'Team', 'Tasks', 'Messages', 'Client Docs', 'Calendar'],
  },
  {
    label: 'OPERATIONS',
    options: ['Funnels', 'Websites', 'Pipelines', 'Media', 'Automations', 'Contacts'],
  },
  {
    label: 'FINANCE',
    options: ['Billing'],
  },
  {
    label: 'GOV FINANCE',
    options: ['Government Services'],
  },
  {
    label: 'SETTINGS',
    options: ['Settings'],
  },
]

const MenuOptions = ({
  details,
  id,
  sidebarLogo,
  sidebarOpt,
  subAccounts,
  user,
  defaultOpen,
}: Props) => {
  const { setOpen } = useModal()
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { isCollapsed, toggleSidebar } = useSidebar()

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter navigation links based on search query
  const filteredSidebarOpt = useMemo(() => {
    let currentOptions = [...sidebarOpt]

    // Inject Calendar for Agency View if missing
    if (user?.Agency?.id === id) {
      const hasCalendar = currentOptions.find((opt) => opt.name === 'Calendar')
      if (!hasCalendar) {
        currentOptions.push({
          id: 'calendar-override',
          name: 'Calendar',
          icon: 'calendar',
          link: `/agency/${id}/calendar`,
          createdAt: new Date(),
          updatedAt: new Date(),
          agencyId: id,
        } as any)
      }
    }

    if (!searchQuery) return currentOptions

    return currentOptions.filter((option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sidebarOpt, searchQuery, user, id])

  // Group the filtered options
  const groupedSidebarOptions = useMemo(() => {
    const groups: { label: string; options: typeof filteredSidebarOpt }[] = []
    const usedIds = new Set<string>()

    // Process defined groups
    SIDEBAR_GROUPS.forEach((groupDef) => {
      const groupOptions = filteredSidebarOpt.filter((opt) =>
        groupDef.options.includes(opt.name)
      )
      if (groupOptions.length > 0) {
        groups.push({
          label: groupDef.label,
          options: groupOptions,
        })
        groupOptions.forEach((opt) => usedIds.add(opt.id))
      }
    })

    // Catch-all for remaining items (e.g. plugins or unknowns)
    const remainingOptions = filteredSidebarOpt.filter(
      (opt) => !usedIds.has(opt.id)
    )
    if (remainingOptions.length > 0) {
      // If "MENU" group exists, append to it, otherwise create "OTHERS"
      const menuGroup = groups.find((g) => g.label === 'MENU')
      if (menuGroup) {
        menuGroup.options.push(...remainingOptions)
      } else {
        groups.unshift({
          label: 'MENU',
          options: remainingOptions,
        })
      }
    }

    return groups
  }, [filteredSidebarOpt])

  // Get role display information
  const getRoleInfo = () => {
    if (!user?.role) return { title: 'Member', icon: User }

    switch (user.role) {
      case 'AGENCY_OWNER':
        return { title: 'Agency Owner', icon: Crown }
      case 'AGENCY_ADMIN':
        return { title: 'Agency Admin', icon: Shield }
      case 'SUBACCOUNT_USER':
        return { title: 'Subaccount User', icon: Users }
      case 'SUBACCOUNT_GUEST':
        return { title: 'Subaccount Guest', icon: Eye }
      default:
        return { title: 'Member', icon: User }
    }
  }

  const roleInfo = getRoleInfo()
  const RoleIcon = roleInfo.icon

  if (!isMounted) return

  return (
    <TooltipProvider delayDuration={0}>
      <Sheet
        modal={false}
        {...openState}
      >
        <SheetTrigger
          asChild
          className="absolute left-4 top-4 z-[100] md:!hidden felx"
        >
          <Button
            variant="outline"
            size={'icon'}
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent
          showX={!defaultOpen}
          side={'left'}
          className={clsx(
            'bg-gray-50 dark:bg-gray-950 fixed top-0 border-r-[1px] p-0 transition-all duration-200 ease-out will-change-transform',
            {
              'hidden md:inline-block z-0': defaultOpen,
              'inline-block md:hidden z-[100] w-full': !defaultOpen,
              'w-[220px]': defaultOpen && !isCollapsed,
              'w-[60px]': defaultOpen && isCollapsed,
            }
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className={clsx("border-b border-gray-200 dark:border-gray-800", isCollapsed ? "p-2" : "p-6 pb-4")}>
              <div className={clsx("flex items-center gap-3 mb-6", isCollapsed && "justify-center mb-2")}>
                {isCollapsed ? (
                  <div className="w-10 h-10 relative flex-shrink-0">
                    <Image
                      src={sidebarLogo}
                      alt="Logo"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}

                {defaultOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={clsx("ml-auto hidden md:flex", isCollapsed && "!hidden")}
                    onClick={toggleSidebar}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Toggle Button for Collapsed State */}
              {defaultOpen && isCollapsed && (
                <div className="flex justify-center mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Switch Account Button */}
              {!isCollapsed && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Compass className="mr-2 h-4 w-4" />
                      Switch Account
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 h-80 mt-4 z-[200]">
                    <Command className="rounded-lg">
                      <CommandInput placeholder="Search Accounts..." />
                      <CommandList className="pb-16">
                        <CommandEmpty>No results found</CommandEmpty>
                        {(user?.role === 'AGENCY_OWNER' ||
                          user?.role === 'AGENCY_ADMIN') &&
                          user?.Agency && (
                            <CommandGroup heading="Agency">
                              <CommandItem className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                                {defaultOpen ? (
                                  <Link
                                    href={`/agency/${user?.Agency?.id}`}
                                    className="flex gap-4 w-full h-full"
                                  >
                                    <div className="relative w-16">
                                      <Image
                                        src={user?.Agency?.agencyLogo}
                                        alt="Agency Logo"
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      {user?.Agency?.name}
                                      <span className="text-muted-foreground">
                                        {user?.Agency?.address}
                                      </span>
                                    </div>
                                  </Link>
                                ) : (
                                  <SheetClose asChild>
                                    <Link
                                      href={`/agency/${user?.Agency?.id}`}
                                      className="flex gap-4 w-full h-full"
                                    >
                                      <div className="relative w-16">
                                        <Image
                                          src={user?.Agency?.agencyLogo}
                                          alt="Agency Logo"
                                          fill
                                          className="rounded-md object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col flex-1">
                                        {user?.Agency?.name}
                                        <span className="text-muted-foreground">
                                          {user?.Agency?.address}
                                        </span>
                                      </div>
                                    </Link>
                                  </SheetClose>
                                )}
                              </CommandItem>
                            </CommandGroup>
                          )}

                        {/* Invited Agencies */}
                        {user?.InvitedAgencies && user.InvitedAgencies.length > 0 && (
                          <CommandGroup heading="Other Agencies">
                            {user.InvitedAgencies.map((agency: any) => (
                              <CommandItem key={agency.id} className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                                {defaultOpen ? (
                                  <button
                                    onClick={async () => {
                                      console.log('🔄 Switching to agency:', agency.id, agency.name)
                                      const { switchUserAgency } = await import('@/lib/actions/switch-agency')
                                      const result = await switchUserAgency(agency.id)
                                      console.log('✅ Switch result:', result)
                                      if (result.success) {
                                        console.log('🚀 Navigating to:', `/agency/${agency.id}`)
                                        window.location.replace(`/agency/${agency.id}`)
                                      } else {
                                        console.error('Failed to switch agency:', result.error)
                                        alert('Failed to switch agency. Please try again.')
                                      }
                                    }}
                                    className="flex gap-4 w-full h-full text-left"
                                  >
                                    <div className="relative w-16">
                                      <Image
                                        src={agency.agencyLogo || '/assets/plura-logo.svg'}
                                        alt="Agency Logo"
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      {agency.name}
                                      <span className="text-muted-foreground">
                                        {agency.address}
                                      </span>
                                    </div>
                                  </button>
                                ) : (
                                  <SheetClose asChild>
                                    <button
                                      onClick={async () => {
                                        const { switchUserAgency } = await import('@/lib/actions/switch-agency')
                                        const result = await switchUserAgency(agency.id)
                                        if (result.success) {
                                          window.location.replace(`/agency/${agency.id}`)
                                        } else {
                                          console.error('Failed to switch agency:', result.error)
                                          alert('Failed to switch agency. Please try again.')
                                        }
                                      }}
                                      className="flex gap-4 w-full h-full text-left"
                                    >
                                      <div className="relative w-16">
                                        <Image
                                          src={agency.agencyLogo || '/assets/plura-logo.svg'}
                                          alt="Agency Logo"
                                          fill
                                          className="rounded-md object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col flex-1">
                                        {agency.name}
                                        <span className="text-muted-foreground">
                                          {agency.address}
                                        </span>
                                      </div>
                                    </button>
                                  </SheetClose>
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                        <CommandGroup heading="Accounts">
                          {!!subAccounts
                            ? subAccounts.map((subaccount) => (
                              <CommandItem key={subaccount.id}>
                                {defaultOpen ? (
                                  <Link
                                    href={`/subaccount/${subaccount.id}`}
                                    className="flex gap-4 w-full h-full"
                                  >
                                    <div className="relative w-16">
                                      <Image
                                        src={subaccount.subAccountLogo}
                                        alt="subaccount Logo"
                                        fill
                                        className="rounded-md object-contain"
                                      />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      {subaccount.name}
                                      <span className="text-muted-foreground">
                                        {subaccount.address}
                                      </span>
                                    </div>
                                  </Link>
                                ) : (
                                  <SheetClose asChild>
                                    <Link
                                      href={`/subaccount/${subaccount.id}`}
                                      className="flex gap-4 w-full h-full"
                                    >
                                      <div className="relative w-16">
                                        <Image
                                          src={subaccount.subAccountLogo}
                                          alt="subaccount Logo"
                                          fill
                                          className="rounded-md object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col flex-1">
                                        {subaccount.name}
                                        <span className="text-muted-foreground">
                                          {subaccount.address}
                                        </span>
                                      </div>
                                    </Link>
                                  </SheetClose>
                                )}
                              </CommandItem>
                            ))
                            : 'No Accounts'}
                        </CommandGroup>
                      </CommandList>
                      {(user?.role === 'AGENCY_OWNER' ||
                        user?.role === 'AGENCY_ADMIN') && (
                          <SheetClose>
                            <Button
                              className="w-full flex gap-2"
                              onClick={() => {
                                setOpen(
                                  <CustomModal
                                    title="Create A Subaccount"
                                    subheading="You can switch between your agency account and the subaccount from the sidebar"
                                  >
                                    <SubAccountDetails
                                      agencyDetails={user?.Agency as Agency}
                                      userId={user?.id as string}
                                      userName={user?.name}
                                    />
                                  </CustomModal>
                                )
                              }}
                            >
                              <PlusCircleIcon size={15} />
                              Create Sub Account
                            </Button>
                          </SheetClose>
                        )}
                    </Command>
                  </PopoverContent>
                </Popover>
              )}

              {/* Navigation Search */}
              {!isCollapsed && (
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-gray-700 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto">
              {/* GROUPS Section */}
              <div className={clsx("pb-4", isCollapsed ? "px-2" : "px-6")}>
                {groupedSidebarOptions.map((group, groupIdx) => (
                  <div key={group.label} className={clsx("mb-4", groupIdx > 0 && "mt-6")}>
                    {!isCollapsed && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span>{group.label}</span>
                        {groupIdx === 0 && <span className="cursor-pointer">⋯</span>}
                      </p>
                    )}
                    <div className={clsx("space-y-0.5", isCollapsed && "mt-4")}>
                      {isCollapsed ? (
                        <div className="space-y-4">
                          {group.options.map((sidebarOptions) => {
                            let val = null
                            const result = icons.find(
                              (icon) => icon.value === sidebarOptions.icon
                            )
                            if (result && result.path) {
                              const IconComponent = result.path
                              val = <IconComponent className="w-5 h-5" />
                            } else {
                              val = <Settings className="w-5 h-5" />
                            }
                            const isActive = sidebarOptions.link.includes(id)

                            const iconLink = (
                              <Link
                                href={sidebarOptions.link}
                                className={clsx(
                                  'flex items-center justify-center transition-all duration-200 hover:scale-110',
                                  isActive && 'text-blue-600 dark:text-blue-400 scale-105'
                                )}
                              >
                                <span className={clsx('text-gray-600 dark:text-gray-400', isActive && 'text-blue-600 dark:text-blue-400')}>
                                  {val}
                                </span>
                              </Link>
                            )

                            return (
                              <Tooltip key={sidebarOptions.id}>
                                <TooltipTrigger asChild>
                                  {defaultOpen ? iconLink : (
                                    <SheetClose asChild>
                                      {iconLink}
                                    </SheetClose>
                                  )}
                                </TooltipTrigger>
                                <TooltipContent side="right" className="font-medium">
                                  {sidebarOptions.name}
                                </TooltipContent>
                              </Tooltip>
                            )
                          })}
                        </div>
                      ) : (
                        group.options.map((sidebarOptions) => {
                          let val = null
                          const result = icons.find(
                            (icon) => icon.value === sidebarOptions.icon
                          )
                          if (result && result.path) {
                            const IconComponent = result.path
                            val = <IconComponent className="w-4 h-4" />
                          } else {
                            // Fallback icon if not found
                            val = <Settings className="w-4 h-4" />
                          }
                          const isActive = sidebarOptions.link.includes(id)

                          const linkContent = (
                            <Link
                              key={sidebarOptions.id}
                              href={sidebarOptions.link}
                              className={clsx(
                                'flex items-center gap-3 px-3 py-1.5 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                                isActive && 'text-blue-600 dark:text-blue-400',
                                isCollapsed && 'justify-center px-2'
                              )}
                            >
                              <span className={clsx('text-gray-600 dark:text-gray-400', isActive && 'text-blue-600 dark:text-blue-400')}>
                                {val}
                              </span>
                              {!isCollapsed && (
                                <span className={clsx('text-sm text-gray-700 dark:text-gray-300', isActive && 'text-blue-600 dark:text-blue-400 font-medium')}>
                                  {sidebarOptions.name}
                                </span>
                              )}
                            </Link>
                          )

                          // Wrap in SheetClose for mobile to auto-close sidebar
                          return defaultOpen ? linkContent : (
                            <SheetClose asChild key={sidebarOptions.id}>
                              {linkContent}
                            </SheetClose>
                          )
                        })
                      )}
                    </div>
                  </div>
                ))}
                {groupedSidebarOptions.length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                    No results found
                  </div>
                )}
              </div>

              {/* ACCOUNT Section */}
              <div className={clsx("pb-4", isCollapsed ? "px-2" : "px-6")}>
                {!isCollapsed && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>ACCOUNT</span>
                    <span className="cursor-pointer">⋯</span>
                  </p>
                )}
                <div className="space-y-1">
                  <button className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left", isCollapsed && "justify-center px-2")}>
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {!isCollapsed && <span className="text-sm text-gray-700 dark:text-gray-300">Account</span>}
                    {!isCollapsed && <ChevronDown className="ml-auto h-4 w-4 text-gray-600 dark:text-gray-400" />}
                  </button>
                  <button className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left", isCollapsed && "justify-center px-2")}>
                    <div className="relative">
                      {user?.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt="User"
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-gray-900 dark:bg-gray-100 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-50">
                        <RoleIcon className="h-2.5 w-2.5 text-white dark:text-gray-900" />
                      </div>
                    </div>
                    {!isCollapsed && (
                      <>
                        <div className="flex flex-col flex-1">
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            {user?.name || 'User'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {roleInfo.title}
                          </span>
                        </div>
                        <ChevronDown className="ml-auto h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* SUPPORT Section */}
              <div className={clsx("pb-4", isCollapsed ? "px-2" : "px-6")}>
                {!isCollapsed && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>SUPPORT</span>
                    <span className="cursor-pointer">⋯</span>
                  </p>
                )}
                <div className="space-y-1">
                  <button className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left", isCollapsed && "justify-center px-2")}>
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {!isCollapsed && <span className="text-sm text-gray-700 dark:text-gray-300">Setting</span>}
                  </button>
                  <button className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left", isCollapsed && "justify-center px-2")}>
                    <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {!isCollapsed && <span className="text-sm text-gray-700 dark:text-gray-300">Security</span>}
                  </button>
                  <button className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left", isCollapsed && "justify-center px-2")}>
                    <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    {!isCollapsed && <span className="text-sm text-gray-700 dark:text-gray-300">Help & center</span>}
                  </button>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className={clsx("mt-auto pb-6", isCollapsed ? "px-2" : "px-6")}>
              <button className={clsx("w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left text-red-600 dark:text-red-400", isCollapsed && "justify-center px-2")}>
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  )
}

export default MenuOptions
