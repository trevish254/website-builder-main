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

type Props = {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: any
  user: any
  id: string
}

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

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter navigation links based on search query
  const filteredSidebarOpt = useMemo(() => {
    if (!searchQuery) return sidebarOpt
    return sidebarOpt.filter((option) =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sidebarOpt, searchQuery])

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
          'bg-gray-50 dark:bg-gray-950 fixed top-0 border-r-[1px] p-0',
          {
            'hidden md:inline-block z-0 w-[280px]': defaultOpen,
            'inline-block md:hidden z-[100] w-full': !defaultOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
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
            
            {/* Switch Account Button */}
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

            {/* Navigation Search */}
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
          </div>

          {/* MENU Section */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>MENU</span>
              <span className="cursor-pointer">⋯</span>
            </p>
            <div className="space-y-1">
              {filteredSidebarOpt.length === 0 ? (
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  No results found
                </div>
              ) : (
                filteredSidebarOpt.map((sidebarOptions) => {
                  let val = null
                  const result = icons.find(
                    (icon) => icon.value === sidebarOptions.icon
                  )
                  if (result && result.path) {
                    const IconComponent = result.path
                    val = <IconComponent />
                  } else {
                    // Fallback icon if not found
                    val = <Settings className="w-4 h-4" />
                  }
                  const isActive = sidebarOptions.link.includes(id)
                  return (
                    <Link
                      key={sidebarOptions.id}
                      href={sidebarOptions.link}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800',
                        isActive && 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      )}
                    >
                      <span className={clsx('text-gray-600 dark:text-gray-400', isActive && 'text-blue-600 dark:text-blue-400')}>
                        {val}
                      </span>
                      <span className={clsx('text-sm text-gray-700 dark:text-gray-300', isActive && 'text-blue-600 dark:text-blue-400 font-medium')}>
                        {sidebarOptions.name}
                      </span>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* ACCOUNT Section */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>ACCOUNT</span>
              <span className="cursor-pointer">⋯</span>
            </p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Account</span>
                <ChevronDown className="ml-auto h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
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
                <div className="flex flex-col flex-1">
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {roleInfo.title}
                  </span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* SUPPORT Section */}
          <div className="px-6 pb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>SUPPORT</span>
              <span className="cursor-pointer">⋯</span>
            </p>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Setting</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Security</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left">
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Help & center</span>
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="px-6 mt-auto pb-6">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-left text-red-600 dark:text-red-400">
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions
