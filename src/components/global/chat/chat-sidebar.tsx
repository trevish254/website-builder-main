'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MessageSquare, Pin, Star, Circle, Trash2, Edit } from 'lucide-react'

export interface InboxItem {
    id: string
    title: string
    preview: string
    timestamp: string
    unread: boolean
    starred: boolean
    pinned: boolean
    avatar?: string
    email?: string
    isOnline?: boolean
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
    activeTab: 'all' | 'team' | 'personal'
    onTabChange: (tab: 'all' | 'team' | 'personal') => void
    onDeleteConversation?: (id: string) => void
    agencyUsers?: any[]
    onlineUsers?: Set<string>
    onNewMessage?: () => void
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
    onNewMessage
}: ChatSidebarProps) => {
    // Filter messages based on search and tabs
    const filteredMessages = inboxItems.filter(msg => {
        // Search filter
        if (searchQuery) {
            return msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
        }

        // Tab filter (Mock implementation for now)
        if (activeTab === 'team') {
            // Logic to filter team messages
            return true
        } else if (activeTab === 'personal') {
            // Logic to filter personal messages
            return true
        }

        return true
    })

    // Get online users list
    const onlineAgencyUsers = agencyUsers.filter(user => onlineUsers.has(user.id))

    return (
        <div className="lg:col-span-1 flex flex-col h-full bg-white dark:bg-background border-r">
            {/* Header */}
            <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Message</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                        onClick={onNewMessage}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-gray-50 dark:bg-gray-900 border-none"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs border border-gray-200 rounded px-1">
                        ⌘/
                    </div>
                </div>
            </div>

            {/* Online Now Section */}
            <div className="px-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-500">Online Now</h3>
                    <button className="text-xs text-blue-600 hover:underline">See all</button>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="flex gap-3">
                        {onlineAgencyUsers.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">No one is online</p>
                        ) : (
                            onlineAgencyUsers.map(user => (
                                <div key={user.id} className="relative flex flex-col items-center gap-1 min-w-[50px]">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border-2 border-white dark:border-background">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-background rounded-full"></span>
                                    </div>
                                    {/* <span className="text-[10px] text-gray-500 truncate w-full text-center">{user.name.split(' ')[0]}</span> */}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Tabs */}
            <div className="px-4 mb-2">
                <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                    {(['all', 'team', 'personal'] as const).map((tab) => (
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
            <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 p-2">
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
                                    group relative p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-900
                                    ${selectedConversationId === message.id ? 'bg-gray-50 dark:bg-gray-900' : ''}
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={message.avatar || message.participantInfo?.avatarUrl || ''} />
                                            <AvatarFallback>
                                                {message.participantInfo?.name?.charAt(0) || message.title.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {message.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-background rounded-full"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className={`font-semibold text-sm truncate ${message.unread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {message.participantInfo?.name || message.title}
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
