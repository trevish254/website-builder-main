'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MessageSquare, Pin, Star, Circle, Trash2, Edit, Users } from 'lucide-react'

export interface InboxItem {
    id: string
    title: string
    preview: string
    timestamp: string
    unread: boolean
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
    activeTab: 'all' | 'team' | 'groups'
    onTabChange: (tab: 'all' | 'team' | 'groups') => void
    onDeleteConversation?: (id: string) => void
    agencyUsers?: any[]
    onlineUsers?: Set<string>
    onNewMessage?: () => void
    onNewGroup?: () => void
    notificationSettings?: React.ReactNode
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
    agencyUsers = [],
    onlineUsers = new Set(),
    onNewMessage,
    onNewGroup,
    notificationSettings
}: ChatSidebarProps) => {
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
        <div className="lg:col-span-1 flex flex-col h-full bg-white dark:bg-background border-r">
            {/* Header */}
            <div className="p-3 pb-1">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Message</h2>
                    <div className="flex items-center gap-1">
                        {notificationSettings}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400"
                            onClick={onNewGroup}
                        >
                            <Users className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                            onClick={onNewMessage}
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <Input
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-8 bg-gray-50 dark:bg-gray-900 border-none text-sm"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs border border-gray-200 rounded px-1">
                        ⌘/
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
                    {(['all', 'team', 'groups'] as const).map((tab) => (
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
            <ScrollArea className="flex-1 px-1">
                <div className="space-y-0.5 p-1">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">No messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                onClick={() => onSelectConversation(message.id)}
                                className={`
                                    group relative p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-900
                                    ${selectedConversationId === message.id ? 'bg-gray-50 dark:bg-gray-900' : ''}
                                `}
                            >
                                <div className="flex items-start gap-2">
                                    <div className="relative">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={message.type === 'group' ? (message.iconUrl || '') : (message.avatar || message.participantInfo?.avatarUrl || '')} />
                                            <AvatarFallback>
                                                {message.type === 'group'
                                                    ? message.title?.charAt(0) || 'G'
                                                    : message.participantInfo?.name?.charAt(0) || message.title?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        {/* Dynamically check if participant is online */}
                                        {(message.type !== 'group' && message.participantInfo?.id && onlineUsers.has(message.participantInfo.id)) && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-background rounded-full animate-pulse shadow-sm"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`font-semibold text-sm truncate ${message.unread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {message.type === 'group' ? message.title : (message.participantInfo?.name || message.title)}
                                            </span>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {message.timestamp}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${message.unread ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                                            {message.preview || 'No messages yet'}
                                        </p>
                                    </div>
                                    {message.unread && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

export default ChatSidebar
