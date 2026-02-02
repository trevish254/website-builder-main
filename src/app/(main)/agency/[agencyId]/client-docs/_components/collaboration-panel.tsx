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
    Signal
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

interface Collaborator {
    id: string
    name: string
    role: string
    avatar?: string
    status: 'online' | 'busy' | 'away'
    isViewing: boolean
    color: string
}

interface Version {
    id: string
    author: string
    time: string
    changes: string
    content: any
}

interface CollaborationPanelProps {
    isOpen: boolean
    onClose: () => void
    docId: string
    onRevert: (content: any) => void
}

export default function CollaborationPanel({ isOpen, onClose, docId, onRevert }: CollaborationPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>('collaborators')
    const [inCall, setInCall] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)

    // Mock Collaborators
    const collaborators: Collaborator[] = [
        { id: '1', name: 'You', role: 'Admin', status: 'online', isViewing: true, color: '#3b82f6' },
        { id: '2', name: 'Sarah Wilson', role: 'Editor', status: 'online', isViewing: true, color: '#10b981', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
        { id: '3', name: 'Marcus Chen', role: 'Viewer', status: 'away', isViewing: false, color: '#f59e0b', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' }
    ]

    // Mock Version History
    const versions: Version[] = [
        { id: 'v1', author: 'You', time: '2 mins ago', changes: 'Updated pricing table', content: null },
        { id: 'v2', author: 'Sarah Wilson', time: '1 hour ago', changes: 'Modified terms of service', content: null },
        { id: 'v3', author: 'System', time: 'Yesterday, 4:15 PM', changes: 'Initial template draft', content: null },
        { id: 'v4', author: 'Marcus Chen', time: '2 days ago', changes: 'Added company logo', content: null },
    ]

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
                    {activeTab === 'collaborators' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active in Session</span>
                                <Badge variant="secondary" className="text-[10px]">3 Online</Badge>
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
                                                    c.status === 'online' ? "bg-green-500" : c.status === 'busy' ? "bg-red-500" : "bg-yellow-500"
                                                )} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold flex items-center gap-1">
                                                    {c.name}
                                                    {c.role === 'Admin' && <BadgeCheck size={12} className="text-primary" />}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">{c.role} • {c.isViewing ? 'Viewing Page 1' : 'Idle'}</p>
                                            </div>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full border-dashed gap-2 text-xs py-5 mt-4" size="sm">
                                <Plus size={14} />
                                Invite Collaborator
                            </Button>
                        </div>
                    )}

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
                            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-muted ml-1">
                                {versions.map((v) => (
                                    <div key={v.id} className="relative pl-7 group">
                                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-background border-2 border-muted flex items-center justify-center group-hover:border-primary transition-colors z-10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-muted group-hover:bg-primary" />
                                        </div>
                                        <div className="bg-muted/30 hover:bg-muted/50 p-3 rounded-lg border border-transparent hover:border-border transition-all cursor-pointer">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-bold text-primary">{v.time}</span>
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
                                            <p className="text-xs font-medium mb-1">{v.changes}</p>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                by <span className="text-foreground">{v.author}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'teams' && (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                <Input placeholder="Search teams..." className="pl-8 h-9 text-xs" />
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'Marketing Squad', members: 5, color: 'bg-blue-500' },
                                    { name: 'Design Review', members: 3, color: 'bg-purple-500' },
                                    { name: 'Legal Team', members: 2, color: 'bg-zinc-500' }
                                ].map((team) => (
                                    <div key={team.name} className="flex items-center justify-between p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-900/30 hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-1.5 h-8 rounded-full", team.color)} />
                                            <div>
                                                <p className="text-xs font-bold">{team.name}</p>
                                                <p className="text-[10px] text-muted-foreground">{team.members} members</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight size={14} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="w-full gap-2 text-xs py-5 border-primary/20 text-primary hover:bg-primary/10" size="sm">
                                <Plus size={14} />
                                Create New Team
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
