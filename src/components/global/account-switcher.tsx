'use client'

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Building2, Store, Check, PlusCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from '@/providers/sidebar-provider'

type Props = {
    user: any
    currentId?: string
    currentLogo?: string
    currentName?: string
}

const AccountSwitcher = ({ user, currentId, currentLogo, currentName }: Props) => {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()
    const { isPanelCollapsed } = useSidebar()

    if (!user) return null

    const agency = user.Agency
    const subAccounts = user.Agency?.SubAccount || []
    const invitedAgencies = user.InvitedAgencies || []
    const permissions = user.Permissions || []

    // Combine all selectable accounts
    const allAccounts = [
        ...(agency ? [{
            id: agency.id,
            name: agency.name,
            logo: agency.agencyLogo,
            type: 'agency',
            link: `/agency/${agency.id}`
        }] : []),
        ...invitedAgencies.map((a: any) => ({
            id: a.id,
            name: a.name,
            logo: a.agencyLogo,
            type: 'agency',
            link: `/agency/${a.id}`
        })),
        ...subAccounts.map((s: any) => ({
            id: s.id,
            name: s.name,
            logo: s.subAccountLogo,
            type: 'subaccount',
            link: `/subaccount/${s.id}`
        })),
        ...permissions
            .filter((p: any) => p.access && p.SubAccount)
            .map((p: any) => ({
                id: p.SubAccount.id,
                name: p.SubAccount.name,
                logo: p.SubAccount.subAccountLogo,
                type: 'subaccount',
                link: `/subaccount/${p.SubAccount.id}`
            }))
    ]

    // Remove duplicates by ID (user might have permissions to subaccounts in their own agency)
    const uniqueAccounts = allAccounts.filter((account, index, self) =>
        index === self.findIndex((a) => a.id === account.id)
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex items-center gap-4 pl-[5px] pr-4 h-16 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all rounded-none justify-start overflow-hidden group border-r border-gray-200 dark:border-gray-800 md:border-r-0",
                        "w-[50px] md:w-[290px]"
                    )}
                >
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                            src={currentLogo || '/assets/chapabiz-logo.png'}
                            alt="Logo"
                            fill
                            className="rounded-lg object-cover border border-border shadow-md group-hover:scale-105 transition-transform"
                        />
                    </div>
                    <div className={cn(
                        "flex flex-col items-start min-w-0 flex-1 transition-all duration-300",
                        "opacity-100 visible"
                    )}>
                        <span className="font-extrabold text-base truncate w-full text-left leading-none">
                            {currentName || 'Account'}
                        </span>
                    </div>
                    <div className="ml-auto flex items-center justify-center p-1 rounded-md bg-muted/40 border border-border/50 group-hover:bg-muted/60 transition-colors">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0 shadow-2xl border-border/50 backdrop-blur-2xl bg-background/98">
                <Command className="bg-transparent">
                    <CommandInput placeholder="Search accounts..." className="h-12" />
                    <CommandList className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <CommandEmpty>No account found.</CommandEmpty>

                        <CommandGroup heading="Agencies">
                            {uniqueAccounts.filter(a => a.type === 'agency').map((account) => (
                                <CommandItem
                                    key={account.id}
                                    onSelect={() => {
                                        router.push(account.link)
                                        setOpen(false)
                                    }}
                                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-all"
                                >
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <Image
                                            src={account.logo || '/assets/chapabiz-logo.png'}
                                            alt={account.name}
                                            fill
                                            className="rounded-lg object-cover border border-border"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-base font-bold truncate">{account.name}</span>
                                        <span className="text-xs text-muted-foreground font-medium">Agency Account</span>
                                    </div>
                                    {currentId === account.id && (
                                        <Check className="h-5 w-5 text-primary" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Sub Accounts">
                            {uniqueAccounts.filter(a => a.type === 'subaccount').map((account) => (
                                <CommandItem
                                    key={account.id}
                                    onSelect={() => {
                                        router.push(account.link)
                                        setOpen(false)
                                    }}
                                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-all"
                                >
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <Image
                                            src={account.logo || '/assets/chapabiz-logo.png'}
                                            alt={account.name}
                                            fill
                                            className="rounded-lg object-cover border border-border"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-base font-bold truncate">{account.name}</span>
                                        <span className="text-xs text-muted-foreground font-medium">Sub Account</span>
                                    </div>
                                    {currentId === account.id && (
                                        <Check className="h-5 w-5 text-primary" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <div className="p-3">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-sm h-11 gap-3 font-bold hover:bg-primary/20 hover:text-primary transition-all rounded-lg"
                            onClick={() => {
                                router.push(`/agency/${agency?.id}/all-subaccounts?openAdd=true`)
                                setOpen(false)
                            }}
                        >
                            <PlusCircle className="h-5 w-5" />
                            Create Sub Account
                        </Button>
                    </div>
                </Command>
            </PopoverContent>
        </Popover >
    )
}

export default AccountSwitcher
