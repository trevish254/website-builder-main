'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    LogOut,
    Settings,
    Keyboard,
    HelpCircle,
    Bell,
    UserIcon,
    Mail,
    CreditCard,
    Shield
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { User } from '@supabase/supabase-js'

type Props = {
    user?: User | any
}

const UserButton = ({ user: initialUser }: Props) => {
    const [user, setUser] = useState<User | any>(initialUser)
    const [isMuted, setIsMuted] = useState(false)
    const router = useRouter()
    const params = useParams()
    const supabase = createClient()

    useEffect(() => {
        if (!initialUser) {
            const getUser = async () => {
                const { data: { user } } = await supabase.auth.getUser()
                setUser(user)
            }
            getUser()
        } else {
            setUser(initialUser)
        }
    }, [initialUser])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    const handleSettingsClick = () => {
        if (params.subaccountId) {
            router.push(`/subaccount/${params.subaccountId}/settings`)
        } else if (params.agencyId) {
            router.push(`/agency/${params.agencyId}/settings`)
        }
    }

    if (!user) return null

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Avatar className="cursor-pointer hover:scale-105 transition-transform border-2 border-transparent hover:border-primary/50">
                    <AvatarImage src={user.user_metadata?.avatar_url || user.avatarUrl} />
                    <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold">
                        {(user.email?.charAt(0) || user.name?.charAt(0))?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            </SheetTrigger>
            <SheetContent
                className="w-[400px] sm:w-[540px] bg-background/80 backdrop-blur-xl border-l border-white/10 dark:border-white/5 p-0 mt-16 h-[calc(100vh-64px)]"
                overlayClassName="top-16"
            >
                <div className="h-full flex flex-col">
                    {/* Header Section */}
                    <div className="p-6 pb-8 border-b border-border/40 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent space-y-6">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={user.user_metadata?.avatar_url || user.avatarUrl} />
                                    <AvatarFallback className="text-2xl bg-neutral-900 text-white dark:bg-white dark:text-black">
                                        {(user.email?.charAt(0) || user.name?.charAt(0))?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="absolute bottom-1 right-1 w-5 h-5 bg-black dark:bg-white border-4 border-background rounded-full"></span>
                            </div>
                            <div className="mt-4 text-center">
                                <h2 className="text-xl font-bold tracking-tight">{user.user_metadata?.full_name || user.name || 'User'}</h2>
                                <p className="text-muted-foreground flex items-center justify-center gap-1.5 mt-1 text-sm bg-muted/50 py-1 px-3 rounded-full border border-border/50">
                                    <Mail size={12} />
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Status</span>
                                <div className="flex items-center gap-2 text-foreground font-bold bg-foreground/10 px-2 py-0.5 rounded-full text-xs">
                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                                    Online
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Role</span>
                                <div className="flex items-center gap-2 text-foreground font-bold bg-foreground/10 px-2 py-0.5 rounded-full text-xs">
                                    <Shield size={10} />
                                    {user.app_metadata?.role || user.role || 'Member'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

                        {/* Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">Preferences</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                            <Bell size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium">Mute Notifications</span>
                                            <span className="text-xs text-muted-foreground">Pause all alerts temporarily</span>
                                        </div>
                                    </div>
                                    <Switch checked={isMuted} onCheckedChange={setIsMuted} />
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">Menu</h3>
                            <div className="grid gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={handleSettingsClick}
                                    className="w-full justify-start h-12 gap-3 text-base font-normal hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl"
                                >
                                    <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                        <Settings size={18} />
                                    </div>
                                    Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start h-12 gap-3 text-base font-normal hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl">
                                    <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                        <UserIcon size={18} />
                                    </div>
                                    Profile Settings
                                </Button>
                                <Button variant="ghost" className="w-full justify-start h-12 gap-3 text-base font-normal hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl">
                                    <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                        <CreditCard size={18} />
                                    </div>
                                    Billing & Plans
                                </Button>
                                <Button variant="ghost" className="w-full justify-start h-12 gap-3 text-base font-normal hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl">
                                    <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                        <Keyboard size={18} />
                                    </div>
                                    Keyboard Shortcuts
                                </Button>
                                <Button variant="ghost" className="w-full justify-start h-12 gap-3 text-base font-normal hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl">
                                    <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                                        <HelpCircle size={18} />
                                    </div>
                                    Help & Support
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border/40 bg-white/5 dark:bg-black/20">
                        <Button
                            className="w-full h-12 gap-2 font-bold shadow-lg transition-all bg-neutral-900 text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90 border border-transparent"
                            onClick={handleSignOut}
                        >
                            <LogOut size={18} />
                            Sign Out
                        </Button>
                        <p className="text-center text-xs text-muted-foreground mt-4">
                            Logged in as {user.email}
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default UserButton
