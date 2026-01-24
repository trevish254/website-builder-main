'use client'

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserPlus, Search, PhoneCall } from 'lucide-react'
import { getAgencyUsers, createNotification } from '@/lib/supabase-queries'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type Props = {
    agencyId: string
    roomId: string
    roomTitle: string
    currentParticipants: string[] // User IDs already in call
    children?: React.ReactNode
}

const InviteToCallModal = ({ agencyId, roomId, roomTitle, currentParticipants, children }: Props) => {
    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [inviting, setInviting] = useState<string | null>(null)

    useEffect(() => {
        if (open && agencyId) {
            const fetchUsers = async () => {
                setLoading(true)
                const agencyUsers = await getAgencyUsers(agencyId)
                setUsers(agencyUsers || [])
                setLoading(false)
            }
            fetchUsers()
        }
    }, [open, agencyId])

    const filteredUsers = users.filter(user =>
        !currentParticipants.includes(user.id) &&
        (user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()))
    )

    const handleInvite = async (user: any) => {
        setInviting(user.id)
        try {
            // 1. Create a notification in the DB
            await createNotification({
                agencyId,
                notification: `You've been invited to join the video call: ${roomTitle}`,
                userId: user.id,
            })

            // 2. Broadcast a realtime signal specifically for this user
            // This allows the recipient's UI to show a "Call Incoming" popup immediately
            await supabase.channel(`user-notifications:${user.id}`).send({
                type: 'broadcast',
                event: 'video-call-invite',
                payload: {
                    roomId,
                    roomTitle,
                    inviterName: 'A teammate' // Fixed for now, can be improved
                }
            })

            toast.success(`Invitation sent to ${user.name || user.email}`)
        } catch (error) {
            console.error('Error inviting user:', error)
            toast.error('Failed to send invitation')
        } finally {
            setInviting(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                        <UserPlus className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-md bg-zinc-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Invite Teammates</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Select a member to call them into this session.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative my-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-rose-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="py-8 text-center text-zinc-500 text-sm">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-8 text-center text-zinc-500 text-sm">No users available to invite</div>
                    ) : (
                        filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 ring-1 ring-white/10">
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback className="bg-zinc-800 text-zinc-400 uppercase">
                                            {user.name?.charAt(0) || user.email.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{user.name || 'Anonymous'}</span>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{user.role}</span>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleInvite(user)}
                                    disabled={inviting === user.id}
                                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold h-8 px-4 rounded-xl"
                                >
                                    {inviting === user.id ? (
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <PhoneCall className="h-3 w-3 mr-2" />
                                            Call
                                        </>
                                    )}
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <div className="pt-4 mt-2 border-t border-white/5 flex justify-end">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteToCallModal
