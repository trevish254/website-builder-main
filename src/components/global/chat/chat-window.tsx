'use client'

import React, { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Archive, Trash2, MoreVertical, Paperclip, Image as ImageIcon, Smile, Send, Loader2, Phone, Video } from 'lucide-react'
import MessageBubble from './message-bubble'
import { InboxItem } from './chat-sidebar'

interface ChatMessage {
    id: string
    sender: 'me' | 'other'
    text: string
    timestamp: string
    attachments?: { type: string; name: string; url: string }[]
    senderName?: string
    senderAvatar?: string
    isRead?: boolean
}

interface ChatWindowProps {
    selectedMsg: InboxItem | null
    chatMessages: ChatMessage[]
    newMessage: string
    onNewMessageChange: (val: string) => void
    onSendMessage: () => void
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    isUploading: boolean
    isTyping: boolean
    onInputKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
    onDeleteMessage?: (id: string) => void
    onReplyMessage?: (id: string) => void
    onEditMessage?: (id: string) => void
    onForwardMessage?: (id: string) => void
}

const ChatWindow = ({
    selectedMsg,
    chatMessages,
    newMessage,
    onNewMessageChange,
    onSendMessage,
    onFileUpload,
    isUploading,
    isTyping,
    onInputKeyDown,
    onDeleteMessage,
    onReplyMessage,
    onEditMessage,
    onForwardMessage
}: ChatWindowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [chatMessages, isTyping])

    if (!selectedMsg) {
        return (
            <Card className="lg:col-span-2 flex flex-col overflow-hidden h-full">
                <CardContent className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <span className="text-2xl">💬</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Select a message to view
                        </h3>
                        <p className="text-gray-500">
                            Choose a conversation from the inbox to start chatting
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="lg:col-span-2 flex flex-col overflow-hidden h-full">
            {/* Chat Header */}
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedMsg.avatar || selectedMsg.participantInfo?.avatarUrl || ''} />
                                <AvatarFallback>
                                    {selectedMsg.participantInfo?.name?.charAt(0) || selectedMsg.title.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            {selectedMsg.isOnline && (
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-lg">{selectedMsg.participantInfo?.name || selectedMsg.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {selectedMsg.participantInfo?.email || 'Direct Message'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Video className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">


                <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                    <div className="space-y-4 py-6">
                        {chatMessages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                messageId={msg.id}
                                isSender={msg.sender === 'me'}
                                content={msg.text}
                                timestamp={msg.timestamp}
                                senderName={msg.senderName}
                                senderAvatar={msg.senderAvatar}
                                attachments={msg.attachments}
                                isRead={msg.isRead}
                                onDelete={onDeleteMessage}
                                onReply={onReplyMessage}
                                onEdit={onEditMessage}
                                onForward={onForwardMessage}
                            />
                        ))}
                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-end gap-2">
                        <div className="flex-1">
                            <Textarea
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => onNewMessageChange(e.target.value)}
                                onKeyDown={onInputKeyDown}
                                className="min-h-[80px] resize-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={onFileUpload}
                                    multiple
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => {
                                        const input = document.createElement('input')
                                        input.type = 'file'
                                        input.accept = 'image/*'
                                        input.multiple = true
                                        input.onchange = (e: any) => onFileUpload(e)
                                        input.click()
                                    }}
                                    disabled={isUploading}
                                >
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    onClick={() => {
                                        const emojis = ['😀', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯']
                                        const emoji = emojis[Math.floor(Math.random() * emojis.length)]
                                        onNewMessageChange(newMessage + emoji)
                                    }}
                                >
                                    <Smile className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                onClick={onSendMessage}
                                className="bg-blue-600 hover:bg-blue-700"
                                size="icon"
                                disabled={isUploading || (!newMessage.trim())}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ChatWindow
