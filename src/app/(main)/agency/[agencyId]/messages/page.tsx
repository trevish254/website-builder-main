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
import { createClient } from '@/lib/supabase/client'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { getUserConversations, getConversationMessages, sendMessage as sendMessageApi, markConversationRead, getAgencyUsers, ensureDirectConversation, getConversationWithParticipantsManual, deleteConversation, searchAgenciesByEmail, getAgencyOwner } from '@/lib/supabase-queries'
import { getConversationsWithParticipants, getMessagesForConversation, sendMessage } from '@/lib/queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ChatSidebar, { InboxItem } from '@/components/global/chat/chat-sidebar'
import ChatWindow from '@/components/global/chat/chat-window'
import { useToast } from '@/components/ui/use-toast'

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

const AgencyMessagesPage = ({ params }: Props) => {
  console.log('🎯 AgencyMessagesPage component loaded')
  const { user } = useSupabaseUser()
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
  const [agencyUsers, setAgencyUsers] = useState<any[]>([])
  const [searchUserQuery, setSearchUserQuery] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const [isUploading, setIsUploading] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Inter-agency messaging state
  const [searchAgencyEmail, setSearchAgencyEmail] = useState('')
  const [searchedAgencies, setSearchedAgencies] = useState<any[]>([])
  const [selectedAgency, setSelectedAgency] = useState<any | null>(null)
  const [agencyAdmins, setAgencyAdmins] = useState<any[]>([])
  const [dialogTab, setDialogTab] = useState<'team' | 'agencies'>('team')

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
  const loadConversations = React.useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    // Use server action to bypass RLS for cross-agency participants
    const conversations = await getConversationsWithParticipants(user.id, {})

    console.log('[INBOX] Raw conversations:', conversations.length)

    // Map conversations directly to items using the data already fetched by getUserConversations
    const items = conversations.map((c: any) => {
      const participants = c.ConversationParticipant || []
      console.log('[INBOX] Conversation', c.id, 'participants:', participants.map((p: any) => ({ userId: p.userId, userName: p.User?.name })))

      const otherParticipant = participants.find((p: any) => p.userId !== user.id && p.User)
      const lastMessage = c.Message?.[0]

      console.log('[INBOX] Other participant for conversation', c.id, ':', otherParticipant?.User?.name)

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

    console.log('[INBOX] Mapped items:', items.length, items.map(i => ({ id: i.id, title: i.title, hasParticipant: !!i.participantInfo })))

    // Group items by participant ID to merge duplicate conversations
    // IMPORTANT: Don't filter out items without participantInfo here, as they might be valid conversations
    const groupedItems = items.reduce((acc, item) => {
      // If no participant info, still add it (might be a group conversation or data issue)
      if (!item.participantInfo?.id) {
        console.log('[INBOX] Adding conversation without participant info:', item.id, item.title)
        acc.push(item)
        return acc
      }

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

    console.log('[INBOX] Final grouped items:', groupedItems.length)

    setInboxItems(groupedItems)
    setLoading(false)
  }, [user?.id, params.agencyId])

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
      // Use server action to bypass RLS
      const allConversations = await getConversationsWithParticipants(user.id, {})

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

      // Use server action to bypass RLS for messages
      const msgs = await getMessagesForConversation(relevantConversationIds, 200)
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
  }, [selectedConversationId, user?.id, inboxItems, params.agencyId])

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
    if (!newMessage.trim() || !selectedConversationId || !user?.id) return

    try {
      const response = await sendMessageApi({
        conversationId: selectedConversationId,
        senderId: user.id,
        content: newMessage,
        metadata: {}
      })

      if (response) {
        setNewMessage('')
        toast({
          title: 'Success',
          description: 'Message sent'
        })
      } else {
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
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete conversation'
      })
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
      const conversationId = await ensureDirectConversation({
        userAId: user.id,
        userBId: selectedUserId,
        agencyId: params.agencyId
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

      let convWithParticipants = null
      let retries = 3

      while (retries > 0 && !convWithParticipants) {
        convWithParticipants = await getConversationWithParticipantsManual(conversationId)

        if (!convWithParticipants && retries > 1) {
          console.log(`[CONVERSATION] Conversation not found, retrying... (${retries - 1} attempts left)`)
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        retries--
      }

      console.log('[CONVERSATION] Conversation details:', convWithParticipants)

      if (convWithParticipants) {
        const participants = (convWithParticipants as any)?.ConversationParticipant || []
        const otherParticipant = participants.find((p: any) => p.userId !== user.id && p.User)

        console.log('[CONVERSATION] Other participant:', otherParticipant?.User)

        const newItem: InboxItem = {
          id: convWithParticipants.id,
          title: convWithParticipants.title || otherParticipant?.User?.name || 'Conversation',
          preview: '',
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

        setInboxItems(prev => {
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
    if (!searchUserQuery) return agencyUsers
    return agencyUsers.filter(u =>
      u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUserQuery.toLowerCase())
    )
  }, [agencyUsers, searchUserQuery])

  // Handle agency search
  const handleAgencySearch = async (email: string) => {
    setSearchAgencyEmail(email)
    if (email.length < 3) {
      setSearchedAgencies([])
      return
    }
    const agencies = await searchAgenciesByEmail(email)
    // Filter out current agency
    setSearchedAgencies(agencies.filter(a => a.id !== params.agencyId))
  }

  // Handle agency selection
  const handleSelectAgency = async (agency: any) => {
    setSelectedAgency(agency)
    const admins = await getAgencyOwner(agency.id)
    setAgencyAdmins(admins)
  }

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
            Chat with your team and subaccount users
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
              <Tabs value={dialogTab} onValueChange={(v) => setDialogTab(v as 'team' | 'agencies')} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="agencies">Other Agencies</TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="space-y-4">
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
                              <Badge variant="outline" className="text-[10px] mt-1">
                                {agencyUser.role}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="agencies" className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search agencies by email (e.g., owner@agency.com)..."
                      value={searchAgencyEmail}
                      onChange={(e) => handleAgencySearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {searchAgencyEmail.length < 3 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Type at least 3 characters to search</p>
                        </div>
                      ) : searchedAgencies.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No agencies found</p>
                        </div>
                      ) : selectedAgency ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAgency(null)
                              setAgencyAdmins([])
                            }}
                            className="mb-2"
                          >
                            ← Back to agencies
                          </Button>
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <p className="font-semibold">{selectedAgency.name}</p>
                            <p className="text-xs text-gray-500">{selectedAgency.companyEmail}</p>
                          </div>
                          {agencyAdmins.map((admin) => (
                            <div
                              key={admin.id}
                              onClick={() => handleStartConversation(admin.id)}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                            >
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={admin.avatarUrl || ''} />
                                <AvatarFallback>
                                  {admin.name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">
                                  {admin.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {admin.email}
                                </p>
                                <Badge variant="outline" className="text-[10px] mt-1">
                                  {admin.role}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        searchedAgencies.map((agency) => (
                          <div
                            key={agency.id}
                            onClick={() => handleSelectAgency(agency)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={agency.agencyLogo || ''} />
                              <AvatarFallback>
                                {agency.name?.charAt(0) || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {agency.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {agency.companyEmail}
                              </p>
                              {agency.ownerName && (
                                <p className="text-xs text-blue-600 truncate">
                                  Owner: {agency.ownerName}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
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
          onDeleteConversation={handleDeleteConversation}
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

export default AgencyMessagesPage
