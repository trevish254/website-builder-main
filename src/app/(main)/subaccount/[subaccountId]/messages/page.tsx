'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    MessageSquare,
    Search,
    Plus,
    User,
    Video,
    ChevronLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { getUserConversations, getConversationMessages, sendMessage as sendMessageApi, markConversationRead, getSubaccountUsers, ensureDirectConversation, getConversationWithParticipants, getConversationWithParticipantsManual, createGroupConversation } from '@/lib/supabase-queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ChatSidebar, { InboxItem } from '@/components/global/chat/chat-sidebar'
import ChatWindow from '@/components/global/chat/chat-window'
import { useToast } from '@/components/ui/use-toast'
import VoiceCallOverlay from '@/components/global/chat/voice-call-overlay'
import { useVoiceCall } from '@/hooks/use-voice-call'

type Props = {
    params: { subaccountId: string }
}

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

const SubaccountMessagesPage = ({ params }: Props) => {
    console.log('🎯 SubaccountMessagesPage component loaded')
    const { user } = useSupabaseUser()
    const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Me'
    const { toast } = useToast()
    const browserClient = createClient()

    // Client-side upload function using authenticated browser client
    const uploadChatAttachment = async (file: File) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await browserClient.storage
            .from('chat-attachments')
            .upload(filePath, file)

        if (uploadError) {
            console.error('Error uploading file:', uploadError)
            return null
        }

        const { data } = browserClient.storage.from('chat-attachments').getPublicUrl(filePath)
        return data.publicUrl
    }
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'inbox' | 'archived'>('inbox')
    const [searchQuery, setSearchQuery] = useState('')
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [inboxItems, setInboxItems] = useState<InboxItem[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
    const [subaccountUsers, setSubaccountUsers] = useState<any[]>([])
    const [searchUserQuery, setSearchUserQuery] = useState('')
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const [isUploading, setIsUploading] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Voice Call logic
    const {
        status: callStatus,
        duration: callDuration,
        isMuted: isCallMuted,
        remotePeerName,
        remotePeerAvatar,
        remoteStream,
        initiateCall,
        acceptCall,
        declineCall,
        hangUp,
        toggleMute
    } = useVoiceCall(user?.id || '', userName)

    // Track the current call conversation ID to send "Call ended" message
    const activeCallConvId = useRef<string | null>(null)
    const prevCallStatus = useRef<'idle' | 'calling' | 'ringing' | 'active' | 'ended'>('idle')

    // Global video call invites are handled by the VideoCallInvitationListener components in the layout
    // to ensure Accept/Decline UI is available across the entire dashboard.

    // Log call events to chat history
    useEffect(() => {
        if (!selectedConversationId || !user?.id) return

        const handleCallHistoryLog = async () => {
            if (callStatus === 'calling' && prevCallStatus.current === 'idle') {
                activeCallConvId.current = selectedConversationId
                await sendMessageApi({
                    conversationId: selectedConversationId,
                    senderId: user.id,
                    content: `${userName} started an audio call`,
                    type: 'call'
                })
            }
            if (callStatus === 'ringing' && prevCallStatus.current === 'idle') {
                activeCallConvId.current = selectedConversationId
            }
            if (callStatus === 'idle' && (prevCallStatus.current === 'calling' || prevCallStatus.current === 'ringing' || prevCallStatus.current === 'active')) {
                if (activeCallConvId.current) {
                    await sendMessageApi({
                        conversationId: activeCallConvId.current,
                        senderId: user.id,
                        content: `Audio call ended`,
                        type: 'call'
                    })
                    activeCallConvId.current = null
                }
            }
            prevCallStatus.current = callStatus
        }
        handleCallHistoryLog()
    }, [callStatus, user?.id, selectedConversationId])

    // Fetch subaccount users for new message dialog
    useEffect(() => {
        const loadSubaccountUsers = async () => {
            if (!user?.id) return
            const users = await getSubaccountUsers(params.subaccountId)
            // Filter out current user
            setSubaccountUsers(users.filter(u => u.id !== user.id))
        }
        loadSubaccountUsers()
    }, [user?.id, params.subaccountId])

    // Fetch conversations for current user with participant info
    const loadConversations = React.useCallback(async () => {
        if (!user?.id) return
        setLoading(true)
        const conversations = await getUserConversations(user.id, { subAccountId: params.subaccountId })

        // Map conversations directly to items using the data already fetched by getUserConversations
        const items = conversations.map((c: any) => {
            const participants = c.ConversationParticipant || []
            const otherParticipant = participants.find((p: any) => p.userId !== user.id && p.User)
            const lastMessage = c.Message?.[0]

            return {
                id: c.id,
                title: c.title || otherParticipant?.User?.name || 'Conversation',
                preview: lastMessage?.content || '',
                timestamp: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : '',
                unread: true, // TODO: Calculate based on lastReadAt
                starred: false,
                pinned: false,
                avatar: otherParticipant?.User?.avatarUrl,
                email: otherParticipant?.User?.email,
                participantInfo: otherParticipant?.User ? {
                    id: otherParticipant.User.id,
                    name: otherParticipant.User.name,
                    email: otherParticipant.User.email,
                    avatarUrl: otherParticipant.User.avatarUrl
                } : null
            }
        })

        // Group items by participant ID to merge duplicate conversations
        const groupedItems = items.reduce((acc, item) => {
            if (!item.participantInfo?.id) return acc

            const existing = acc.find(i => i.participantInfo?.id === item.participantInfo?.id)
            if (existing) {
                // Update existing item if this one is newer
                const existingDate = new Date(existing.timestamp || 0)
                const newDate = new Date(item.timestamp || 0)
                if (newDate > existingDate) {
                    existing.timestamp = item.timestamp
                    existing.preview = item.preview
                    existing.id = item.id // Keep the ID of the most recent conversation as the "primary" one
                }
            } else {
                acc.push(item)
            }
            return acc
        }, [] as InboxItem[])

        setInboxItems(groupedItems)
        setLoading(false)
    }, [user?.id, params.subaccountId])

    // Initial load
    useEffect(() => {
        loadConversations()
    }, [loadConversations])

    // Realtime subscription for inbox updates
    useEffect(() => {
        if (!user?.id) return

        console.log('[REALTIME] Setting up inbox subscription')
        const channel = supabase
            .channel('inbox-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'Conversation' },
                (payload) => {
                    console.log('[REALTIME] Conversation updated:', payload)
                    // Refresh inbox when any conversation is updated (e.g. new message)
                    loadConversations()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user?.id, loadConversations])

    // Load messages for selected conversation (merging all conversations with the same user)
    useEffect(() => {
        const loadMessages = async () => {
            if (!selectedConversationId || !user?.id) return

            // Find the selected item to get the participant ID
            const selectedItem = inboxItems.find(i => i.id === selectedConversationId)
            if (!selectedItem?.participantInfo?.id) return

            console.log('[MESSAGES] Loading messages for user:', selectedItem.participantInfo.name)

            // 1. Find ALL conversation IDs with this user
            // We need to re-fetch or keep the raw list. For now, let's fetch all user conversations again to be safe and filter
            // Optimization: We could store the raw list in a ref or state, but fetching is safer for consistency
            const allConversations = await getUserConversations(user.id, { subAccountId: params.subaccountId })

            const relevantConversationIds = []
            for (const conv of allConversations) {
                // We now have the participants directly in the conversation object
                const participants = (conv as any).ConversationParticipant || []
                const hasUser = participants.some((p: any) => p.userId === selectedItem.participantInfo?.id)
                if (hasUser) {
                    relevantConversationIds.push(conv.id)
                }
            }

            console.log('[MESSAGES] Found relevant conversation IDs:', relevantConversationIds)

            const msgs = await getConversationMessages(relevantConversationIds, 200)
            console.log('[MESSAGES] Fetched messages:', msgs.length, 'messages')

            const mapped: ChatMessage[] = msgs.map((m) => {
                const metadata = m.metadata as any
                const isMe = m.senderId === user?.id

                let avatarUrl = ''
                if (isMe) {
                    avatarUrl = user.avatarUrl || ''
                } else {
                    avatarUrl = selectedItem.participantInfo?.avatarUrl || ''
                }

                return {
                    id: m.id,
                    sender: isMe ? 'me' : 'other',
                    text: m.content,
                    timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    attachments: metadata?.attachments || [],
                    isRead: true,
                    senderName: isMe ? user.name : selectedItem.participantInfo?.name,
                    senderAvatar: avatarUrl
                }
            })

            setChatMessages(mapped)
            if (user?.id) await markConversationRead(selectedConversationId, user.id)
        }
        loadMessages()
    }, [selectedConversationId, user?.id, inboxItems])

    // Realtime subscription for new messages in selected conversation
    useEffect(() => {
        if (!selectedConversationId) return

        console.log('[REALTIME] Setting up realtime subscription for conversation:', selectedConversationId)

        const channel = supabase
            .channel(`messages:${selectedConversationId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Message', filter: `conversationId=eq.${selectedConversationId}` },
                (payload) => {
                    console.log('[REALTIME] New message received via realtime:', payload)
                    const m = payload.new as any
                    const metadata = m.metadata as any
                    setChatMessages((prev) => [
                        ...prev,
                        {
                            id: m.id,
                            sender: m.senderId === user?.id ? 'me' : 'other',
                            text: m.content,
                            timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            attachments: metadata?.attachments || []
                        }
                    ])
                    console.log('[REALTIME] Message added to chat')
                }
            )
            .subscribe((status) => {
                console.log('[REALTIME] Subscription status:', status)
            })

        const readChannel = supabase
            .channel(`participants:${selectedConversationId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'ConversationParticipant', filter: `conversationId=eq.${selectedConversationId}` },
                (payload) => {
                    console.log('Read receipt update:', payload)
                }
            )
            .subscribe()

        return () => {
            console.log('🔕 Cleaning up realtime subscriptions')
            supabase.removeChannel(channel)
            supabase.removeChannel(readChannel)
        }
    }, [selectedConversationId, user?.id])

    // Presence and Typing Indicators
    useEffect(() => {
        if (!user?.id) return

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: user.id,
                },
            },
        })

        channel.on('presence', { event: 'sync' }, () => {
            const newState = channel.presenceState()
            const online = new Set(Object.keys(newState))
            setOnlineUsers(online)
        })

        channel.on('broadcast', { event: 'typing' }, ({ payload }) => {
            if (payload.conversationId === selectedConversationId && payload.userId !== user.id) {
                setTypingUsers((prev) => {
                    const newSet = new Set(prev)
                    newSet.add(payload.userId)
                    return newSet
                })

                // Clear typing status after 3 seconds
                setTimeout(() => {
                    setTypingUsers((prev) => {
                        const newSet = new Set(prev)
                        newSet.delete(payload.userId)
                        return newSet
                    })
                }, 3000)
            }
        })

        channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    online_at: new Date().toISOString(),
                    user_id: user.id,
                })
            }
        })

        return () => {
            channel.unsubscribe()
        }
    }, [user?.id, selectedConversationId])

    const unreadCount = inboxItems.filter(m => m.unread).length
    const starredCount = inboxItems.filter(m => m.starred).length

    const handleSendMessage = async () => {
        console.log('[SEND] handleSendMessage called')
        console.log('[SEND] Message content:', newMessage)
        console.log('[SEND] Conversation ID:', selectedConversationId)
        console.log('[SEND] User ID:', user?.id)

        if (!newMessage.trim() || !selectedConversationId || !user?.id) {
            console.warn('[SEND] Cannot send message - missing required data')
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Cannot send message. Please try again.'
            })
            return
        }

        try {
            console.log('[SEND] Sending message...')
            const result = await sendMessageApi({
                conversationId: selectedConversationId,
                senderId: user.id,
                content: newMessage,
                metadata: { attachments: [] }
            })

            console.log('[SEND] Message sent successfully:', result)

            if (result) {
                setNewMessage('')
                toast({
                    title: 'Success',
                    description: 'Message sent'
                })
            } else {
                console.error('[SEND] sendMessageApi returned null')
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to send message'
                })
            }
        } catch (error) {
            console.error('❌ Error sending message:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while sending the message'
            })
        }
    }

    const handleTyping = () => {
        if (!selectedConversationId || !user?.id) return

        // Debounce typing events
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        const channel = supabase.channel('online-users')
        channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: { conversationId: selectedConversationId, userId: user.id }
        })
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !selectedConversationId || !user?.id) return
        setIsUploading(true)

        const files = Array.from(e.target.files)
        const attachments = []

        for (const file of files) {
            const url = await uploadChatAttachment(file)
            if (url) {
                attachments.push({
                    type: file.type,
                    name: file.name,
                    url
                })
            }
        }

        if (attachments.length > 0) {
            await sendMessageApi({
                conversationId: selectedConversationId,
                senderId: user.id,
                content: 'Sent an attachment',
                metadata: { attachments }
            })
            toast({
                title: 'Success',
                description: 'File sent successfully'
            })
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to upload file'
            })
        }
        setIsUploading(false)
        if (e.target) e.target.value = ''
    }

    const selectedMsg = useMemo(() => {
        const item = inboxItems.find(m => m.id === selectedConversationId)
        if (item && item.participantInfo) {
            return {
                ...item,
                isOnline: onlineUsers.has(item.participantInfo.id)
            }
        }
        return item || null
    }, [inboxItems, selectedConversationId, onlineUsers])

    const handleDeleteConversation = async (conversationId: string) => {
        if (!user?.id) return

        // Optimistic update
        setInboxItems(prev => prev.filter(i => i.id !== conversationId))
        if (selectedConversationId === conversationId) {
            setSelectedConversationId(null)
            setChatMessages([])
        }

        const success = await deleteConversation(conversationId, user.id)
        if (success) {
            toast({
                title: 'Conversation deleted',
                description: 'The conversation has been removed from your inbox.'
            })
        } else {
            // Revert if failed (optional, but good UX)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete conversation'
            })
            // Reload conversations to restore state
            // loadConversations() 
        }
    }

    const handleStartConversation = async (selectedUserId: string) => {
        console.log('[CONVERSATION] handleStartConversation called with userId:', selectedUserId)
        console.log('[CONVERSATION] Current user ID:', user?.id)

        if (!user?.id || !selectedUserId) {
            console.error('[CONVERSATION] Missing user ID or selectedUserId')
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Cannot start conversation: User not authenticated'
            })
            return
        }

        try {
            console.log('[CONVERSATION] Calling ensureDirectConversation...')
            // Create or get existing direct conversation
            const conversationId = await ensureDirectConversation({
                userAId: user.id,
                userBId: selectedUserId,
                agencyId: '', // Not needed for subaccount scope if we pass subAccountId
                subAccountId: params.subaccountId
            })

            console.log('[CONVERSATION] ensureDirectConversation returned:', conversationId)

            if (!conversationId) {
                console.error('[CONVERSATION] Failed to create/get conversation')
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to create conversation. Please try again.'
                })
                return
            }

            setShowNewMessageDialog(false)
            setSearchUserQuery('')

            console.log('[CONVERSATION] Fetching conversation details...')

            // Fetch the specific conversation details with retry logic
            // Use manual query to bypass foreign key relationship issues
            let convWithParticipants = null
            let retries = 3

            while (retries > 0 && !convWithParticipants) {
                // Try manual query (bypasses FK relationship issues)
                convWithParticipants = await getConversationWithParticipantsManual(conversationId)

                if (!convWithParticipants && retries > 1) {
                    console.log(`[CONVERSATION] Conversation not found, retrying... (${retries - 1} attempts left)`)
                    await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms before retry
                }
                retries--
            }

            console.log('[CONVERSATION] Conversation details:', convWithParticipants)

            if (convWithParticipants) {
                const participants = (convWithParticipants as any)?.ConversationParticipant || []
                const otherParticipant = participants.find((p: any) => p.userId !== user.id && p.User)

                console.log('[CONVERSATION] Other participant:', otherParticipant?.User)

                // Construct the new inbox item
                const newItem: InboxItem = {
                    id: convWithParticipants.id,
                    title: convWithParticipants.title || otherParticipant?.User?.name || 'Conversation',
                    preview: '', // New conversation or existing one, we can fetch last message if needed but empty is fine for immediate switch
                    timestamp: convWithParticipants.lastMessageAt ? new Date(convWithParticipants.lastMessageAt).toLocaleDateString() : '',
                    unread: false,
                    starred: false,
                    pinned: false,
                    avatar: otherParticipant?.User?.avatarUrl,
                    email: otherParticipant?.User?.email,
                    participantInfo: otherParticipant?.User ? {
                        id: otherParticipant.User.id,
                        name: otherParticipant.User.name,
                        email: otherParticipant.User.email,
                        avatarUrl: otherParticipant.User.avatarUrl
                    } : null
                }

                console.log('[CONVERSATION] New inbox item:', newItem)

                // Update list and select
                setInboxItems(prev => {
                    // Check if already exists
                    const exists = prev.find(i => i.id === newItem.id)
                    if (exists) {
                        console.log('[CONVERSATION] Conversation already exists in list')
                        return prev
                    }
                    console.log('[CONVERSATION] Adding new conversation to list')
                    return [newItem, ...prev]
                })

                console.log('[CONVERSATION] Setting selected conversation ID:', conversationId)
                setSelectedConversationId(conversationId)

                toast({
                    title: 'Success',
                    description: `Conversation with ${otherParticipant?.User?.name || 'user'} started`
                })
            } else {
                console.error('[CONVERSATION] Failed to fetch conversation details')
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to load conversation details'
                })
            }
        } catch (error) {
            console.error('[CONVERSATION] Error in handleStartConversation:', error)
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred. Check console for details.'
            })
        }
    }

    const filteredUsers = useMemo(() => {
        if (!searchUserQuery) return subaccountUsers
        return subaccountUsers.filter(u =>
            u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchUserQuery.toLowerCase())
        )
    }, [subaccountUsers, searchUserQuery])

    return (
        <div className="flex flex-col h-[calc(100dvh-80px)] md:h-[calc(100vh-80px)] p-0 md:p-6 gap-0 md:gap-6 overscroll-none">
            <style jsx global>{`
                @media (max-width: 768px) {
                    body, html {
                        overflow: hidden !important;
                        height: 100% !important;
                        position: fixed !important;
                        width: 100% !important;
                        overscroll-behavior: none !important;
                    }
                }
            `}</style>


            {/* Header - Hidden on mobile if a conversation is selected to save space */}
            <div className={cn(
                "flex items-center justify-between p-4 md:p-0",
                selectedConversationId ? "hidden md:flex" : "flex"
            )}>


                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <MessageSquare className="h-10 w-10 text-blue-600" />
                        Messages
                    </h1>
                    <p className="text-muted-foreground text-lg mt-1">
                        Chat with your team
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4 mr-2" />
                                New Message
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Start New Conversation</DialogTitle>
                                <DialogDescription>
                                    Select a user to start a conversation with
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search users by name or email..."
                                        value={searchUserQuery}
                                        onChange={(e) => setSearchUserQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <ScrollArea className="h-[300px]">
                                    <div className="space-y-2">
                                        {filteredUsers.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                <p>No users found</p>
                                            </div>
                                        ) : (
                                            filteredUsers.map((subUser) => (
                                                <div
                                                    key={subUser.id}
                                                    onClick={() => {
                                                        console.log('🎯 User clicked! Calling handleStartConversation with:', subUser.id)
                                                        handleStartConversation(subUser.id)
                                                    }}
                                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={subUser.avatarUrl || ''} />
                                                        <AvatarFallback>
                                                            {subUser.name?.charAt(0) || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate">
                                                            {subUser.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">
                                                            {subUser.email}
                                                        </p>
                                                        <Badge variant="outline" className="ml-auto text-[10px]">
                                                            {subUser.role}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Badge variant="secondary" className="px-3 py-1.5">
                        {unreadCount} Unread
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1.5">
                        {starredCount} Starred
                    </Badge>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex w-full min-h-0 relative overflow-hidden bg-white dark:bg-background md:rounded-2xl border-none md:border md:shadow-sm">


                {/* Inbox List - Always visible on desktop (md+), hidden on mobile when a chat is open */}
                <div className={cn(
                    "h-full border-r border-gray-200 dark:border-gray-800 shrink-0 md:!flex md:w-[320px] lg:w-[380px]",
                    selectedConversationId ? "hidden" : "flex w-full"
                )}>
                    <ChatSidebar
                        inboxItems={inboxItems.map(item => ({
                            ...item,
                            isOnline: item.participantInfo ? onlineUsers.has(item.participantInfo.id) : false
                        }))}
                        selectedConversationId={selectedConversationId || ''}
                        onSelectConversation={setSelectedConversationId}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onDeleteConversation={handleDeleteConversation}
                    />
                </div>

                {/* Chat Area - Always visible on desktop (md+), hidden on mobile when no chat is open */}
                <div className={cn(
                    "h-full flex-1 min-w-0 md:!flex",
                    selectedConversationId ? "flex w-full" : "hidden"
                )}>
                    <ChatWindow
                        selectedMsg={selectedMsg}
                        chatMessages={chatMessages}
                        newMessage={newMessage}
                        onNewMessageChange={(val) => {
                            setNewMessage(val)
                            handleTyping()
                        }}
                        onSendMessage={handleSendMessage}
                        onFileUpload={handleFileUpload}
                        isUploading={isUploading}
                        isTyping={typingUsers.size > 0}
                        onBack={() => setSelectedConversationId(null)}
                        onInputKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        onVoiceCall={() => {
                            if (selectedMsg?.participantInfo) {
                                initiateCall(
                                    selectedMsg.participantInfo.id,
                                    selectedMsg.participantInfo.name,
                                    selectedMsg.participantInfo.avatarUrl
                                )
                            }
                        }}
                        onVideoCall={() => {
                            if (selectedMsg && user) {
                                const videoRoomId = selectedMsg.id
                                const participants = (selectedMsg as any).participants || []
                                const targetIds = participants
                                    .map((p: any) => p.id)
                                    .filter((id: string) => id && id !== user.id)

                                toast({
                                    title: 'Launching Video Call',
                                    description: 'A new tab is opening for your video session.'
                                })

                                window.open(`/video/${videoRoomId}`, '_blank')

                                // Broadcast invite to each participant's private channel
                                if (targetIds.length > 0) {
                                    targetIds.forEach((targetId: string) => {
                                        const channel = supabase.channel(`user-notifications:${targetId}`)
                                        channel.subscribe((status) => {
                                            if (status === 'SUBSCRIBED') {
                                                channel.send({
                                                    type: 'broadcast',
                                                    event: 'video-call-invite',
                                                    payload: {
                                                        roomId: videoRoomId,
                                                        roomTitle: selectedMsg.title || 'Direct Chat',
                                                        inviterName: userName,
                                                        inviterId: user.id
                                                    }
                                                })
                                                setTimeout(() => supabase.removeChannel(channel), 5000)
                                            }
                                        })
                                    })
                                }
                            }
                        }}
                    />
                </div>
            </div>

            <VoiceCallOverlay
                status={callStatus}
                receiverName={remotePeerName}
                receiverAvatar={remotePeerAvatar}
                duration={callDuration}
                isMuted={isCallMuted}
                remoteStream={remoteStream}
                onMuteToggle={toggleMute}
                onHangUp={hangUp}
                onAccept={acceptCall}
                onDecline={declineCall}
            />
        </div>
    )
}

export default SubaccountMessagesPage
