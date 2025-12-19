'use client'

import { useState, useRef, useEffect } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Send, Users, MessageSquare } from 'lucide-react'
import { updateDashboardCard } from '@/lib/dashboard-queries'
import MessageBubble from '@/components/global/chat/message-bubble'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Message = {
    id: string
    senderId: string
    senderName: string
    senderAvatar?: string
    content: string
    timestamp: string
    attachments?: any[]
}

type Props = {
    cardId: string
    title?: string
    config?: any
    user?: any // Current user info
}

export default function DiscussionCard({ cardId, title = 'Discussion', config, user }: Props) {
    const [messages, setMessages] = useState<Message[]>(config?.messages || [])
    const [inputText, setInputText] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    // Mock user if not provided (fallback)
    const currentUser = user || {
        id: 'current-user', // In real app, pass from parent
        name: 'You',
        avatar: '',
    }

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            }
        }
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputText.trim()) return

        const newMessage: Message = {
            id: Date.now().toString(),
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatarUrl || currentUser.avatar,
            content: inputText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        const updatedMessages = [...messages, newMessage]
        setMessages(updatedMessages)
        setInputText('')

        try {
            await updateDashboardCard(cardId, {
                config: {
                    ...config,
                    messages: updatedMessages
                }
            })
        } catch (error) {
            toast.error('Failed to send message')
        }
    }

    return (
        <div className="h-full flex flex-col bg-background/50">
            {/* Header / Top Bar */}
            <div className="flex items-center justify-between px-1 pb-2 border-b mb-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    {title}
                </h3>
                <div className="flex -space-x-2">
                    {/* Fake participants for visual flair */}
                    <Avatar className="w-5 h-5 border-2 border-background">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-5 h-5 border-2 border-background">
                        <AvatarImage src="/avatars/02.png" />
                        <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div className="w-5 h-5 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                        +2
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 -mr-4 pr-4" ref={scrollRef}>
                <div className="flex flex-col gap-2 pb-4 pt-2">
                    {messages.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-xs">
                            No messages yet. Start the conversation!
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                            {/* We use a simplified bubble structure here or reuse MessageBubble if fit */}
                            <div className={`
                                max-w-[85%] rounded-lg px-3 py-2 text-sm
                                ${msg.senderId === currentUser.id
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-muted text-foreground rounded-bl-none'}
                             `}>
                                <p>{msg.content}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                {msg.senderId !== currentUser.id && `${msg.senderName} • `}{msg.timestamp}
                            </span>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="mt-2 pt-2 border-t flex gap-2">
                <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="h-8 text-xs bg-background"
                />
                <Button size="icon" className="h-8 w-8" onClick={handleSendMessage}>
                    <Send className="w-3 h-3" />
                </Button>
            </div>
        </div>
    )
}
