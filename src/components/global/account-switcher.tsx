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

    const currentAccount = uniqueAccounts.find(a => a.id === currentId)
    const isAgency = currentAccount?.type === 'agency'

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <div className="p-2">
                    <Button
                        variant="ghost"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "flex items-center gap-4 pl-[5px] pr-4 h-16 transition-all rounded-2xl justify-start overflow-hidden group border border-gray-200 dark:border-gray-800",
                            "w-[50px] md:w-[280px]",
                            "animate-pulse-glow animate-reflection-sweep bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-black/40",
                            "relative shadow-sm"
                        )}
                    >
                        {/* Visual Clue Element: The Rectangle */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300" />

                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                                src={currentLogo || '/assets/chapabiz-logo.png'}
                                alt="Logo"
                                fill
                                className="rounded-lg object-cover border border-border shadow-md group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Status/Switch Indicator Clue */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary text-[10px] flex items-center justify-center text-primary-foreground rounded-full border-2 border-background shadow-sm">
                                <ChevronsUpDown className="w-2.5 h-2.5" />
                            </div>
                        </div>
                        <div className={cn(
                            "flex flex-col items-start min-w-0 flex-1 transition-all duration-300",
                            "opacity-100 visible"
                        )}>
                            <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                {isAgency ? (
                                    <Building2 className="w-3 h-3 text-primary" />
                                ) : (
                                    <Store className="w-3 h-3 text-primary" />
                                )}
                                <span className="font-extrabold text-[10px] uppercase tracking-[0.1em] truncate w-full text-left leading-none">
                                    {isAgency ? 'Agency Account' : 'Subaccount'}
                                </span>
                            </div>
                            <span className="font-extrabold text-base truncate w-full text-left leading-tight mt-1">
                                {currentName || 'Account'}
                            </span>
                        </div>
                        <div className="ml-auto hidden md:flex items-center justify-center p-1.5 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                            <ChevronDown className="h-4 w-4 text-primary/70 group-hover:text-primary group-hover:rotate-180 transition-transform duration-500" />
                        </div>
                    </Button>
                </div>
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
                                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-all rounded-xl"
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
                                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-all rounded-xl"
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
