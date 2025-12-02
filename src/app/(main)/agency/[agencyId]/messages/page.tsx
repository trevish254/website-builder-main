'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageSquare,
  Search,
  Plus,
  User
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { getUserConversations, getConversationMessages, sendMessage as sendMessageApi, markConversationRead, getAgencyUsers, ensureDirectConversation, getConversationWithParticipants, uploadChatAttachment } from '@/lib/supabase-queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import ChatSidebar, { InboxItem } from '@/components/global/chat/chat-sidebar'
import ChatWindow from '@/components/global/chat/chat-window'

type Props = {
  params: { agencyId: string }
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

const MessagesPage = ({ params }: Props) => {
  const { user } = useSupabaseUser()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'inbox' | 'archived'>('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [inboxItems, setInboxItems] = useState<InboxItem[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [agencyUsers, setAgencyUsers] = useState<any[]>([])
  const [searchUserQuery, setSearchUserQuery] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isUploading, setIsUploading] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch agency users for new message dialog
  useEffect(() => {
    const loadAgencyUsers = async () => {
      if (!user?.id) return
      const users = await getAgencyUsers(params.agencyId)
      // Filter out current user
      setAgencyUsers(users.filter(u => u.id !== user.id))
    }
    loadAgencyUsers()
  }, [user?.id, params.agencyId])

  // Fetch conversations for current user with participant info
  useEffect(() => {
    const loadConversations = async () => {
      if (!user?.id) return
      setLoading(true)
      const conversations = await getUserConversations(user.id, { agencyId: params.agencyId })

      // Load participant info for each conversation
      const items = await Promise.all(conversations.map(async (c) => {
        const convWithParticipants = await getConversationWithParticipants(c.id)
        const participants = (convWithParticipants as any)?.ConversationParticipant || []
        // Find the other participant (not current user)
        const otherParticipant = participants.find((p: any) => p.userId !== user.id && p.User)

        // Get last message for preview
        const messages = await getConversationMessages(c.id, 1)
        const lastMessage = messages[0]

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
      }))

      setInboxItems(items)
      setLoading(false)
    }
    loadConversations()
  }, [user?.id, params.agencyId])

  // Load messages for selected conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversationId) return
      const msgs = await getConversationMessages(selectedConversationId, 200)
      const mapped: ChatMessage[] = msgs.map((m) => {
        const metadata = m.metadata as any
        return {
          id: m.id,
          sender: m.senderId === user?.id ? 'me' : 'other',
          text: m.content,
          timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attachments: metadata?.attachments || [],
          isRead: true // In a real app, check read receipts
        }
      })
      setChatMessages(mapped)
      if (user?.id) await markConversationRead(selectedConversationId, user.id)
    }
    loadMessages()
  }, [selectedConversationId, user?.id])

  // Realtime subscription for new messages in selected conversation
  useEffect(() => {
    if (!selectedConversationId) return
    const channel = supabase
      .channel(`messages:${selectedConversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Message', filter: `conversationId=eq.${selectedConversationId}` },
        (payload) => {
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
        }
      )
      .subscribe()

    const readChannel = supabase
      .channel(`participants:${selectedConversationId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ConversationParticipant', filter: `conversationId=eq.${selectedConversationId}` },
        (payload) => {
          // Update messages read status if needed, or just trigger a re-fetch/update local state
          // For now, we can assume if we get an update here, someone read something
          // In a real app, we would update specific message 'isRead' status based on 'lastReadAt'
          console.log('Read receipt update:', payload)
        }
      )
      .subscribe()

    return () => {
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
    if (!newMessage.trim() || !selectedConversationId || !user?.id) return
    await sendMessageApi({
      conversationId: selectedConversationId,
      senderId: user.id,
      content: newMessage,
      metadata: { attachments: [] } // Add attachments here if we had a staging area
    })
    setNewMessage('')
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
    }

    setIsUploading(false)
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

  const handleStartConversation = async (selectedUserId: string) => {
    if (!user?.id || !selectedUserId) return

    // Create or get existing direct conversation
    const conversationId = await ensureDirectConversation({
      userAId: user.id,
      userBId: selectedUserId,
      agencyId: params.agencyId
    })

    if (conversationId) {
      setSelectedConversationId(conversationId)
      setShowNewMessageDialog(false)
      setSearchUserQuery('')
      // Reload conversations to show the new one
      window.location.reload() // Simple refresh - could be optimized
    }
  }

  const filteredUsers = useMemo(() => {
    if (!searchUserQuery) return agencyUsers
    return agencyUsers.filter(u =>
      u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUserQuery.toLowerCase())
    )
  }, [agencyUsers, searchUserQuery])

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <MessageSquare className="h-10 w-10 text-blue-600" />
            Messages
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            Manage your conversations and communications
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
                      filteredUsers.map((agencyUser) => (
                        <div
                          key={agencyUser.id}
                          onClick={() => handleStartConversation(agencyUser.id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={agencyUser.avatarUrl || ''} />
                            <AvatarFallback>
                              {agencyUser.name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">
                              {agencyUser.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {agencyUser.email}
                            </p>
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
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
        />

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
          onInputKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
        />
      </div>
    </div>
  )
}

export default MessagesPage
