'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MessageSquare, Pin, Star, Circle } from 'lucide-react'

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
    activeTab: 'inbox' | 'archived'
    onTabChange: (tab: 'inbox' | 'archived') => void
}

const ChatSidebar = ({
    inboxItems,
    selectedConversationId,
    onSelectConversation,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange
}: ChatSidebarProps) => {
    const filteredMessages = inboxItems.filter(msg => {
        if (searchQuery) {
            return msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    return (
        <Card className="lg:col-span-1 flex flex-col overflow-hidden h-full">
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl">Inbox</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant={activeTab === 'inbox' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onTabChange('inbox')}
                        >
                            Inbox
                        </Button>
                        <Button
                            variant={activeTab === 'archived' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => onTabChange('archived')}
                        >
                            Archived
                        </Button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full">
                    <div className="space-y-1 p-4">
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No messages found</p>
                            </div>
                        ) : (
                            filteredMessages.map((message) => (
                                <div
                                    key={message.id}
                                    onClick={() => onSelectConversation(message.id)}
                                    className={`
                    p-4 rounded-lg cursor-pointer transition-all
                    ${selectedConversationId === message.id
                                            ? 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-500'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-900 border-2 border-transparent'
                                        }
                    ${message.unread ? 'bg-gray-50 dark:bg-gray-900' : ''}
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
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`
                            font-semibold text-sm truncate
                            ${message.unread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}
                          `}>
                                                        {message.participantInfo?.name || message.title}
                                                    </span>
                                                    {message.pinned && (
                                                        <Pin className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                    {message.starred && (
                                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {message.timestamp}
                                                </span>
                                            </div>
                                            <p className={` 
                        text-sm truncate mb-1
                        ${message.unread ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}
                      `}>
                                                {message.preview || 'No messages yet'}
                                            </p>
                                            {message.unread && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                                                    <span className="text-xs text-blue-600 dark:text-blue-400">New</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default ChatSidebar
