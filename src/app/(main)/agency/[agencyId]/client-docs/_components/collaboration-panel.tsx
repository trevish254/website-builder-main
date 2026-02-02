'use client'
import React, { useState, useEffect } from 'react'
import {
    Users,
    History,
    Mic,
    MicOff,
    Phone,
    PhoneOff,
    Plus,
    Clock,
    RotateCcw,
    UserPlus,
    X,
    MessageSquare,
    ChevronRight,
    Search,
    BadgeCheck,
    Signal,
    Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Tab = 'collaborators' | 'history' | 'teams'

import { Collaborator } from './use-collaboration'

interface CollaborationPanelProps {
    isOpen: boolean
    onClose: () => void
    docId: string
    docTitle: string
    agencyId: string
    onRevert: (content: any) => void
    collaborators: Collaborator[]
    versions: any[]
}

import { getAgencyTeams, getAgencyTeamMembers } from '@/lib/client-docs-queries'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { createClient } from '@/lib/supabase/client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'

export default function CollaborationPanel({ isOpen, onClose, docId, docTitle, agencyId, onRevert, collaborators, versions }: CollaborationPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>('collaborators')
    const [inCall, setInCall] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [teams, setTeams] = useState<any[]>([])
    const [agencyMembers, setAgencyMembers] = useState<any[]>([])
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const { user: supabaseUser } = useSupabaseUser()
    const supabase = createClient()

    useEffect(() => {
        if (isOpen && agencyId && supabaseUser?.id) {
            const load = async () => {
                const [t, m] = await Promise.all([
                    getAgencyTeams(agencyId, supabaseUser.id),
                    getAgencyTeamMembers(agencyId)
                ])
                setTeams(t)
                setAgencyMembers(m)
            }
            load()
        }
    }, [isOpen, agencyId, supabaseUser?.id])

    const sendInvite = async (receiverId: string, receiverName: string) => {
        if (!supabaseUser) return

        const inviteChannel = supabase.channel(`user-notifications:${receiverId}`)
        inviteChannel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await inviteChannel.send({
                    type: 'broadcast',
                    event: 'collab-invite',
                    payload: {
                        docId,
                        docTitle,
                        senderName: supabaseUser.user_metadata?.full_name || supabaseUser.email,
                        senderAvatar: supabaseUser.user_metadata?.avatar_url,
                        url: window.location.href
                    }
                })
                toast.success(`Invitation sent to ${receiverName}`)
                setIsInviteOpen(false)
                supabase.removeChannel(inviteChannel)
            }
        })
    }

    // Remove mock collaborators/versions - we'll use the props now

    useEffect(() => {
        let interval: any
        if (inCall) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        } else {
            setCallDuration(0)
        }
        return () => clearInterval(interval)
    }, [inCall])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartCall = () => {
        setInCall(true)
        toast.success('Voice session started')
    }

    const handleEndCall = () => {
        setInCall(false)
        toast.info('Voice session ended')
    }

    if (!isOpen) return null

    return (
        <div className="w-80 border-l bg-background flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300 z-50">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="font-bold text-sm uppercase tracking-tight">Collaboration Hub</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X size={16} />
                </Button>
            </div>

            {/* Voice Chat Widget */}
            <div className={cn(
                "p-4 border-b transition-all duration-500",
                inCall ? "bg-primary/5 border-primary/20" : "bg-background"
            )}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-2 rounded-lg",
                            inCall ? "bg-primary text-white" : "bg-muted"
                        )}>
                            <Mic size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold">Voice Session</p>
                            <p className="text-[10px] text-muted-foreground">
                                {inCall ? `Active • ${formatTime(callDuration)}` : 'Inactive'}
                            </p>
                        </div>
                    </div>
                    {inCall ? (
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-8 w-8", isMuted && "text-destructive bg-destructive/10")}
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={handleEndCall}
                            >
                                <PhoneOff size={16} />
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" className="h-8 rounded-full gap-2 border-primary/20 text-primary hover:bg-primary/10" onClick={handleStartCall}>
                            <Phone size={14} />
                            Join Call
                        </Button>
                    )}
                </div>
                {inCall && (
                    <div className="flex -space-x-2 overflow-hidden py-1">
                        {collaborators.filter(c => c.status === 'online').map(c => (
                            <TooltipProvider key={c.id}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar className="h-7 w-7 border-2 border-background ring-2 ring-primary/20">
                                            <AvatarImage src={c.avatar} />
                                            <AvatarFallback className="text-[10px]">{c.name[0]}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent><p className="text-xs">{c.name} (Talking...)</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('collaborators')}
                    className={cn(
                        "flex-1 py-3 text-xs font-medium transition-colors relative",
                        activeTab === 'collaborators' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Users size={14} className="inline mr-1" />
                    Users
                    {activeTab === 'collaborators' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "flex-1 py-3 text-xs font-medium transition-colors relative",
                        activeTab === 'history' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <History size={14} className="inline mr-1" />
                    History
                    {activeTab === 'history' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => setActiveTab('teams')}
                    className={cn(
                        "flex-1 py-3 text-xs font-medium transition-colors relative",
                        activeTab === 'teams' ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <UserPlus size={14} className="inline mr-1" />
                    Teams
                    {activeTab === 'teams' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1">
                <div className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active in Session</span>
                            <Badge variant="secondary" className="text-[10px]">{collaborators.length} Online</Badge>
                        </div>
                        <div className="space-y-3">
                            {collaborators.map((c) => (
                                <div key={c.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={c.avatar} />
                                                <AvatarFallback>{c.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className={cn(
                                                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                                                c.status === 'online' ? "bg-green-500" : "bg-zinc-400"
                                            )} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold flex items-center gap-1">
                                                {c.name}
                                                {c.status === 'online' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">Active Now • Collaborator</p>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full ring-2 ring-background shadow-sm" style={{ backgroundColor: c.color }} />
                                </div>
                            ))}
                            {collaborators.length === 0 && (
                                <div className="text-center py-8 opacity-40">
                                    <p className="text-xs">No online collaborators</p>
                                </div>
                            )}
                        </div>

                        <Popover open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full border-dashed gap-2 text-xs py-5 mt-4 group" size="sm">
                                    <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                                    Invite Team Member
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[280px] p-0" align="end">
                                <Command className="rounded-lg border shadow-md">
                                    <CommandInput placeholder="Search team members..." />
                                    <CommandEmpty>No members found.</CommandEmpty>
                                    <CommandGroup className="max-h-[300px] overflow-auto">
                                        {agencyMembers
                                            .filter(m => m.id !== supabaseUser?.id && !collaborators.find(c => c.id === m.id))
                                            .map((member) => (
                                                <CommandItem
                                                    key={member.id}
                                                    onSelect={() => sendInvite(member.id, member.name)}
                                                    className="flex items-center gap-3 p-2 cursor-pointer"
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={member.avatarUrl} />
                                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-medium truncate">{member.name}</span>
                                                        <span className="text-[10px] text-muted-foreground truncate">{member.email}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {activeTab === 'history' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Version History</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-6 w-6"><Clock size={12} /></Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p className="text-xs">Full Timeline</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-muted ml-0.5">
                                {versions.map((v) => (
                                    <div key={v.id} className="relative pl-7 group">
                                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 border-muted flex items-center justify-center group-hover:border-primary transition-colors z-10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-muted group-hover:bg-primary" />
                                        </div>
                                        <div className="bg-muted/30 hover:bg-muted/50 p-3 rounded-lg border border-transparent hover:border-border transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-bold text-primary">
                                                    {new Date(v.createdAt).toLocaleDateString() === new Date().toLocaleDateString()
                                                        ? new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                        : new Date(v.createdAt).toLocaleDateString()
                                                    }
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        onRevert(v.content)
                                                        toast.success('Reverting to version...')
                                                    }}
                                                >
                                                    <RotateCcw size={10} />
                                                </Button>
                                            </div>
                                            <p className="text-xs font-medium mb-1">{v.name || 'Untitled Version'}</p>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                by <span className="text-foreground">{v.User?.name || 'Unknown'}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {versions.length === 0 && (
                                    <div className="text-center py-8 opacity-40">
                                        <p className="text-xs">No snapshots yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Agency Teams</span>
                                <Badge variant="secondary" className="text-[10px]">{teams.length}</Badge>
                            </div>

                            <div className="space-y-3">
                                {teams.map((team) => (
                                    <div key={team.id} className="p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all cursor-pointer group">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color || '#3b82f6' }} />
                                                <span className="text-sm font-bold">{team.name}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[9px] opacity-60 group-hover:opacity-100 transition-opacity">
                                                {team.TeamUser?.length || 0} Members
                                            </Badge>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                            {team.description || 'No description provided for this team.'}
                                        </p>
                                        <div className="flex -space-x-2 overflow-hidden items-center justify-between">
                                            <div className="flex -space-x-1.5">
                                                {team.TeamUser?.slice(0, 4).map((tu: any) => (
                                                    <Avatar key={tu.userId} className="h-6 w-6 border-2 border-background">
                                                        <AvatarImage src={tu.User?.avatarUrl} />
                                                        <AvatarFallback className="text-[8px]">{tu.User?.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {(team.TeamUser?.length || 0) > 4 && (
                                                    <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[7px] font-bold border-2 border-background">
                                                        +{(team.TeamUser?.length || 0) - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all">
                                                <ChevronRight size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {teams.length === 0 && (
                                    <div className="text-center py-12 px-6 bg-muted/20 rounded-2xl border border-dashed border-muted">
                                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                            <Users size={20} className="text-muted-foreground/50" />
                                        </div>
                                        <p className="text-xs font-medium text-muted-foreground">No teams found</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1">Teams defined in agency settings will appear here.</p>
                                    </div>
                                )}
                            </div>

                            <Button variant="outline" className="w-full border-dashed gap-2 text-xs py-5 mt-2" size="sm">
                                <Plus size={14} />
                                Manage Teams
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Session Stats */}
            <div className="p-4 border-t bg-zinc-50 dark:bg-zinc-900/50">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Signal size={10} className="text-green-500" />
                        Latency: 24ms
                    </span>
                    <span>Last sync: Just now</span>
                </div>
            </div>
        </div>
    )
}
