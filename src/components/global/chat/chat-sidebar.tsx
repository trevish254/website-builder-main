'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MessageSquare, Pin, Star, Circle, Trash2, Edit, Users, Video, Check } from 'lucide-react'
import ConnectivityIndicator from '@/components/global/connectivity-indicator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface InboxItem {
    id: string
    title: string
    preview: string
    timestamp: string
    unread: boolean
    unreadCount?: number
    starred: boolean
    pinned: boolean
    avatar?: string
    iconUrl?: string
    description?: string
    email?: string
    isOnline?: boolean
    type?: string
    chatMessages?: any[]
    participants?: {
        id: string
        name: string
        email: string
        avatarUrl: string
    }[]
    participantInfo?: {
        id: string
        name: string
        email: string
        avatarUrl: string
    } | null
}

interface ChatSidebarProps {
    inboxItems: InboxItem[]
    selectedConversationId: string | null
    onSelectConversation: (id: string) => void
    searchQuery: string
    onSearchChange: (query: string) => void
    activeTab: 'all' | 'team' | 'groups' | 'video'
    onTabChange: (tab: 'all' | 'team' | 'groups' | 'video') => void
    onDeleteConversation?: (id: string) => void
    onDeleteBulk?: (ids: string[]) => void
    agencyUsers?: any[]
    onlineUsers?: Set<string>
    onNewMessage?: () => void
    onNewGroup?: () => void
    onNewVideoRoom?: () => void
    notificationSettings?: React.ReactNode
    typingStates?: Record<string, Set<string>>
}

const ChatSidebar = ({
    inboxItems,
    selectedConversationId,
    onSelectConversation,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    onDeleteConversation,
    onDeleteBulk,
    agencyUsers = [],
    onlineUsers = new Set(),
    onNewMessage,
    onNewGroup,
    onNewVideoRoom,
    notificationSettings,
    typingStates = {}
}: ChatSidebarProps) => {
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setSelectedIds(newSet)
    }

    const handleDeleteBulk = () => {
        if (onDeleteBulk) {
            onDeleteBulk(Array.from(selectedIds))
            setSelectedIds(new Set())
        }
    }

    const handleDeleteSingle = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (onDeleteConversation) {
            onDeleteConversation(id)
        }
    }

    // Filter messages based on search and tabs
    const filteredMessages = inboxItems.filter(msg => {
        // Search filter
        if (searchQuery) {
            return msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
        }

        // Tab filter
        if (activeTab === 'team') {
            // Logic to filter direct messages (team)
            return msg.type !== 'group' && msg.participantInfo
        } else if (activeTab === 'groups') {
            // Logic to filter group messages
            return msg.type === 'group'
        } else if (activeTab === 'video') {
            // Logic to filter video rooms
            return msg.type === 'video'
        }

        return true
    })

    // Get a comprehensive list of all online users we know about (from agency OR conversations)
    const onlineAgencyUsers = React.useMemo(() => {
        const usersMap = new Map<string, { id: string, name: string, avatarUrl?: string }>()

        // 1. Add tracked agency users
        agencyUsers.forEach(u => {
            if (onlineUsers.has(u.id)) {
                usersMap.set(u.id, { id: u.id, name: u.name, avatarUrl: u.avatarUrl })
            }
        })

        // 2. Add tracked participants from all conversations
        inboxItems.forEach(item => {
            if (item.participantInfo?.id && onlineUsers.has(item.participantInfo.id)) {
                usersMap.set(item.participantInfo.id, {
                    id: item.participantInfo.id,
                    name: item.participantInfo.name,
                    avatarUrl: item.participantInfo.avatarUrl
                })
            }
        })

        return Array.from(usersMap.values())
    }, [agencyUsers, inboxItems, onlineUsers])

    return (
        <div className="flex flex-col h-full bg-white dark:bg-background overflow-hidden">

            {/* Header */}
            <div className="px-5 py-6 flex flex-col gap-5 border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            Messages
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[11px] text-gray-500 font-medium">
                                {onlineAgencyUsers.length} people online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        {notificationSettings}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105 transition-all"
                            onClick={onNewGroup}
                        >
                            <Users className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-9 w-9 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                            onClick={onNewMessage}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-11 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-sm rounded-xl focus-visible:ring-1 focus-visible:ring-primary transition-all shadow-sm"
                    />
                    <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
                        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-black px-1.5 font-mono text-[10px] font-bold text-gray-400 opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Online Now Section */}
            <div className="px-3 mb-2">
                <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Online Now</h3>
                    <button className="text-[11px] text-blue-600 hover:underline">See all</button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-1">
                    <div className="flex gap-2">
                        {onlineAgencyUsers.length === 0 ? (
                            <p className="text-[10px] text-gray-400 italic">No one is online</p>
                        ) : (
                            onlineAgencyUsers.map(user => (
                                <div key={user.id} className="relative flex flex-col items-center gap-1 min-w-[40px]">
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 border-2 border-white dark:border-background">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white dark:border-background rounded-full"></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Tabs */}
            <div className="px-3 mb-1">
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5">
                    {(['all', 'team', 'groups', 'video'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab as any)}
                            className={`
                                flex-1 text-xs font-medium py-1.5 rounded-md transition-all capitalize
                                ${activeTab === tab
                                    ? 'bg-white dark:bg-background text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar overscroll-contain" data-lenis-prevent>
                <div className="space-y-0.5 p-1">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="h-12 w-12 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                {activeTab === 'video' ? <Video className="h-6 w-6 text-rose-500" /> : <MessageSquare className="h-6 w-6 text-gray-400" />}
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                {activeTab === 'video' ? 'No Video Rooms' : 'No messages found'}
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                {activeTab === 'video' ? 'Create a persistent video room for your team.' : 'Try searching for something else.'}
                            </p>
                            {activeTab === 'video' && (
                                <Button
                                    onClick={onNewVideoRoom}
                                    variant="outline"
                                    className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                                >
                                    Create First Room
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                onClick={() => onSelectConversation(message.id)}
                                className={`
                                    group relative p-4 rounded-xl cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/50 border-l-2
                                    ${selectedConversationId === message.id
                                        ? 'bg-zinc-50 dark:bg-zinc-900/50 border-l-primary shadow-sm'
                                        : 'border-l-transparent'
                                    }
                                    ${selectedIds.has(message.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={cn(
                                            "mt-2 shrink-0 transition-all",
                                            selectedIds.has(message.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}
                                        onClick={(e) => toggleSelect(message.id, e)}
                                    >
                                        <div className={cn(
                                            "h-4 w-4 rounded border flex items-center justify-center transition-colors",
                                            selectedIds.has(message.id)
                                                ? "bg-primary border-primary text-white"
                                                : "border-zinc-300 dark:border-zinc-700"
                                        )}>
                                            {selectedIds.has(message.id) && <Check className="h-2.5 w-2.5" />}
                                        </div>
                                    </div>

                                    <div className="relative shrink-0">
                                        <Avatar className="h-11 w-11 shadow-sm border border-zinc-100 dark:border-zinc-800">
                                            <AvatarImage src={message.type === 'group' ? (message.iconUrl || '') : (message.avatar || message.participantInfo?.avatarUrl || '')} />
                                            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-xs">
                                                {message.type === 'video'
                                                    ? 'V'
                                                    : message.type === 'group'
                                                        ? message.title?.charAt(0) || 'G'
                                                        : message.participantInfo?.name?.charAt(0) || message.title?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        {(message.type !== 'group' && message.participantInfo?.id && onlineUsers.has(message.participantInfo.id)) && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-sm"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`font-bold text-[14px] truncate transition-colors ${message.unread ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                                                {message.type === 'group' ? message.title : (message.participantInfo?.name || message.title)}
                                            </span>
                                            <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap ml-1.5 shrink-0">
                                                {message.timestamp}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className={`text-[12.5px] truncate flex-1 leading-tight ${message.unreadCount && message.unreadCount > 0 ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-500'}`}>
                                                {typingStates[message.id]?.size > 0 ? (
                                                    <span className="text-primary italic animate-pulse">typing...</span>
                                                ) : (
                                                    message.preview || 'No messages yet'
                                                )}
                                            </p>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {Boolean(message.unreadCount && message.unreadCount > 0) && (
                                                    <Badge className="h-5 min-w-[20px] px-1.5 flex items-center justify-center bg-primary hover:bg-primary/90 text-white border-none rounded-full text-[10px] font-extrabold shadow-lg shadow-primary/20">
                                                        {message.unreadCount! > 99 ? '99+' : message.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {message.unread && !message.unreadCount && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        <div className="h-2.5 w-2.5 bg-primary rounded-full shadow-lg shadow-primary/20 animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Bulk Actions Floating Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-6 z-[60] animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-blue-500/20">
                            {selectedIds.size}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Selected</span>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800" />
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-3"
                            onClick={() => setSelectedIds(new Set())}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 rounded-xl shadow-lg shadow-red-500/20"
                            onClick={handleDeleteBulk}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete Selected
                        </Button>
                    </div>
                </div>
            )}
        </div >
    )
}

export default ChatSidebar
