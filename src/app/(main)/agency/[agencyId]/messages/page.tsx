'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageSquare,
  Search,
  Plus,
  User,
  Camera,
  Check,
  Info
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { getUserConversations, getConversationMessages, sendMessage as sendMessageApi, markConversationRead, getAgencyUsers, ensureDirectConversation, getConversationWithParticipantsManual, deleteConversation, searchAgenciesByEmail, getAgencyOwner, updateMessage, createGroupConversation } from '@/lib/supabase-queries'
import { getConversationsWithParticipants, getMessagesForConversation, sendMessage } from '@/lib/queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import ChatSidebar, { InboxItem } from '@/components/global/chat/chat-sidebar'
import ChatWindow from '@/components/global/chat/chat-window'
import { useToast } from '@/components/ui/use-toast'
import { NotificationQueue, InAppNotification } from '@/components/global/chat/message-notification'
import { NotificationSettingsDialog } from '@/components/global/chat/notification-settings'
import { showMessageNotification, playNotificationSound, isInConversation, getNotificationPermission } from '@/lib/notifications'

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
  isEdited?: boolean
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
  const [activeTab, setActiveTab] = useState<'all' | 'team' | 'groups'>('all')
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
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null)

  // Group creation state
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false)
  const [groupTitle, setGroupTitle] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupIcon, setGroupIcon] = useState('')
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([])

  // Notification state
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    browserNotifications: false,
    soundEnabled: true,
    inAppNotifications: true
  })

  // Load notification settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('messageNotificationSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setNotificationSettings(parsed)
      } catch (e) {
        console.error('Failed to parse notification settings:', e)
      }
    } else {
      // Check if browser notifications are already granted
      const permission = getNotificationPermission()
      if (permission.granted) {
        setNotificationSettings(prev => ({ ...prev, browserNotifications: true }))
      }
    }
  }, [])

  // Save notification settings to localStorage
  const handleNotificationSettingsChange = (settings: typeof notificationSettings) => {
    setNotificationSettings(settings)
    localStorage.setItem('messageNotificationSettings', JSON.stringify(settings))
  }

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
        type: c.type,
        iconUrl: c.iconUrl,
        description: c.description,
        participants: participants.map((p: any) => ({
          id: p.User?.id,
          name: p.User?.name,
          email: p.User?.email,
          avatarUrl: p.User?.avatarUrl
        })).filter((p: any) => p.name), // Ensure we only get valid users
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
      // Group conversations are never merged based on participant
      if (item.type === 'group' || !item.participantInfo?.id) {
        acc.push(item)
        return acc
      }

      // Only merge direct conversations with the same person
      const existing = acc.find(i => i.type === 'direct' && i.participantInfo?.id === item.participantInfo?.id)
      if (existing) {
        // Update existing item if this one is newer
        const existingDate = new Date(existing.timestamp || 0)
        const newDate = new Date(item.timestamp || 0)
        if (newDate > existingDate) {
          existing.timestamp = item.timestamp
          existing.preview = item.preview
          existing.id = item.id
        }
      } else {
        acc.push(item)
      }
      return acc
    }, [] as InboxItem[])

    // Sort items by timestamp descending
    groupedItems.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0)
      const dateB = new Date(b.timestamp || 0)
      return dateB.getTime() - dateA.getTime()
    })

    console.log('[INBOX] Final grouped items:', groupedItems.length)

    setInboxItems(groupedItems)
    setLoading(false)
  }, [user?.id, params.agencyId])

  // Initial load
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Handle notification clicks
  useEffect(() => {
    const handleNotificationClick = (event: any) => {
      const { conversationId } = event.detail
      if (conversationId) {
        setSelectedConversationId(conversationId)
        // Clear notifications for this conversation
        setInAppNotifications(prev => prev.filter(n => n.conversationId !== conversationId))
      }
    }

    window.addEventListener('notification-click', handleNotificationClick)
    return () => {
      window.removeEventListener('notification-click', handleNotificationClick)
    }
  }, [])

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
      if (!selectedItem) return

      let relevantConversationIds = [selectedConversationId]

      // 1. If it's a DIRECT conversation, find ALL conversation IDs with this user to merge bubbles
      if (selectedItem.type === 'direct' && selectedItem.participantInfo?.id) {
        console.log('[MESSAGES] Loading messages for direct user:', selectedItem.participantInfo.name)

        // Find all conversations where BOTH the current user and the target user are participants
        const { data: participations } = await supabase
          .from('ConversationParticipant')
          .select('conversationId')
          .eq('userId', selectedItem.participantInfo.id)

        if (participations && participations.length > 0) {
          const possibleIds = participations.map(p => p.conversationId)
          const { data: myParticipations } = await supabase
            .from('ConversationParticipant')
            .select('conversationId')
            .eq('userId', user.id)
            .in('conversationId', possibleIds)

          if (myParticipations) {
            relevantConversationIds = myParticipations.map(p => p.conversationId)
          }
        }
      } else {
        console.log('[MESSAGES] Loading messages for group/other conversation:', selectedItem.title)
      }

      console.log('[MESSAGES] Relevant IDs:', relevantConversationIds)

      // 2. Load all messages for these IDs
      const messages = await getConversationMessages(relevantConversationIds, 100)

      // Sort messages by creation time before mapping
      const sortedMessages = messages.sort((a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      const mappedMessages: ChatMessage[] = sortedMessages.map(m => {
        const isMe = m.senderId === user?.id
        const senderUser = isMe ? user : agencyUsers.find(u => u.id === m.senderId)
        const metadata = m.metadata as any

        return {
          id: m.id,
          sender: isMe ? 'me' : 'other',
          text: m.content,
          timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          senderName: isMe ? user?.name : senderUser?.name || 'Unknown',
          senderAvatar: isMe ? user?.avatarUrl : senderUser?.avatarUrl,
          isEdited: m.isEdited || false,
          attachments: metadata?.attachments || [],
          replyTo: metadata?.replyingTo
        }
      })

      setChatMessages(mappedMessages)
      if (user?.id) await markConversationRead(selectedConversationId, user.id)
    }
    loadMessages()
  }, [selectedConversationId, user?.id, inboxItems, agencyUsers, params.agencyId])

  // Realtime subscription for messages in ALL relevant conversations for this user
  useEffect(() => {
    if (!selectedConversationId || !user?.id) return

    const setupSubscription = async () => {
      // Find all IDs to listen to
      const selectedItem = inboxItems.find(i => i.id === selectedConversationId)
      if (!selectedItem) return

      let relevantIds = [selectedConversationId]
      if (selectedItem.type === 'direct' && selectedItem.participantInfo?.id) {
        const { data: participations } = await supabase
          .from('ConversationParticipant')
          .select('conversationId')
          .eq('userId', selectedItem.participantInfo.id)

        if (participations && participations.length > 0) {
          const possibleIds = participations.map(p => p.conversationId)
          const { data: myParticipations } = await supabase
            .from('ConversationParticipant')
            .select('conversationId')
            .eq('userId', user.id)
            .in('conversationId', possibleIds)

          if (myParticipations) {
            relevantIds = myParticipations.map(p => p.conversationId)
          }
        }
      }

      console.log('[REALTIME] Subscribing to messages in IDs:', relevantIds)

      // Subscribe to all relevant IDs using IN operator
      const channel = supabase
        .channel(`merged-messages:${selectedConversationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Message',
            // Listen to any message whose conversationId is in our list
            filter: `conversationId=in.(${relevantIds.join(',')})`
          },
          (payload) => {
            console.log('[REALTIME] message change received for merged list:', payload)
            if (payload.eventType === 'INSERT') {
              const m = payload.new as any

              // Only add if not already in list (prevent duplicates)
              setChatMessages((prev) => {
                if (prev.some(existing => existing.id === m.id)) return prev

                const metadata = m.metadata as any
                const isMe = m.senderId === user?.id
                const senderUser = isMe ? user : agencyUsers.find(u => u.id === m.senderId)

                return [
                  ...prev,
                  {
                    id: m.id,
                    sender: isMe ? 'me' : 'other',
                    text: m.content,
                    timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    senderName: isMe ? user?.name : senderUser?.name || 'Unknown',
                    senderAvatar: isMe ? user?.avatarUrl : senderUser?.avatarUrl,
                    attachments: metadata?.attachments || [],
                    replyTo: metadata?.replyingTo,
                    isEdited: m.isEdited
                  }
                ]
              })

              // Handle notifications for messages from others
              if (m.senderId !== user?.id) {
                const senderUser = agencyUsers.find(u => u.id === m.senderId)
                const messageData = {
                  conversationId: selectedConversationId, // Link to the active UI ID
                  messageId: m.id,
                  senderName: senderUser?.name || 'Unknown',
                  senderAvatar: senderUser?.avatarUrl,
                  messageText: m.content,
                  timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }

                if (notificationSettings.soundEnabled) playNotificationSound(0.5)

                if (notificationSettings.inAppNotifications && !isInConversation(selectedConversationId, selectedConversationId)) {
                  setInAppNotifications(prev => [...prev, { id: m.id, ...messageData, onReply: () => setSelectedConversationId(selectedConversationId) }])
                }

                if (notificationSettings.browserNotifications && document.visibilityState !== 'visible') {
                  showMessageNotification(messageData)
                }
              }
            } else if (payload.eventType === 'UPDATE') {
              const m = payload.new as any
              setChatMessages(prev => prev.map(msg =>
                msg.id === m.id ? { ...msg, text: m.content, isEdited: m.isEdited } : msg
              ))
            }
          }
        )
        .subscribe()

      return channel
    }

    const channelPromise = setupSubscription()

    return () => {
      channelPromise.then(channel => {
        if (channel) {
          console.log('🔕 Cleaning up merged realtime subscription')
          supabase.removeChannel(channel)
        }
      })
    }
  }, [selectedConversationId, user?.id, inboxItems, agencyUsers, notificationSettings])

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
      if (editingMessage) {
        // Handle Edit
        const updated = await updateMessage(editingMessage.id, newMessage)
        if (updated) {
          setChatMessages(prev => prev.map(m => m.id === editingMessage.id ? { ...m, text: updated.content } : m))
          setNewMessage('')
          setEditingMessage(null)
          toast({ title: 'Message updated' })
        }
        return
      }

      const response = await sendMessageApi({
        conversationId: selectedConversationId,
        senderId: user.id,
        content: newMessage,
        metadata: replyingTo ? {
          replyingTo: {
            id: replyingTo.id,
            text: replyingTo.text,
            senderName: replyingTo.senderName
          }
        } : {}
      })

      if (response) {
        setNewMessage('')
        setReplyingTo(null)

        // Optimistic update for inbox ONLY (keeps sidebar snappy)
        setInboxItems(prev => {
          const updatedInbox = [...prev]
          const currentConvIndex = updatedInbox.findIndex(i => i.id === selectedConversationId)

          if (currentConvIndex !== -1) {
            const currentConv = { ...updatedInbox[currentConvIndex] }
            currentConv.preview = newMessage
            currentConv.timestamp = new Date().toLocaleDateString()

            // Remove from current position
            updatedInbox.splice(currentConvIndex, 1)
            // Add to top
            updatedInbox.unshift(currentConv)
            return updatedInbox
          }
          return prev
        })

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

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0 || !selectedConversationId || !user?.id) return
    setIsUploading(true)

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
        content: attachments.some(a => a.type.startsWith('audio')) ? 'Sent a voice note' : 'Sent an attachment',
        metadata: { attachments }
      })
      toast({
        title: 'Success',
        description: 'Sent successfully'
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to upload'
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

  // Combine agency users and inbox participants for comprehensive user list
  const allAvailableUsers = useMemo(() => {
    // Start with agency users
    const usersMap = new Map<string, any>()

    agencyUsers.forEach(u => {
      usersMap.set(u.id, u)
    })

    // Add any missing users from inbox items (e.g. external users, past conversations)
    inboxItems.forEach(item => {
      if (item.type === 'direct' && item.participantInfo?.id && item.participantInfo.id !== user?.id) {
        if (!usersMap.has(item.participantInfo.id)) {
          usersMap.set(item.participantInfo.id, item.participantInfo)
        }
      }
    })

    return Array.from(usersMap.values())
  }, [agencyUsers, inboxItems, user?.id])

  const filteredUsers = useMemo(() => {
    if (!searchUserQuery) return allAvailableUsers
    return allAvailableUsers.filter(u =>
      u.name?.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchUserQuery.toLowerCase())
    )
  }, [allAvailableUsers, searchUserQuery])

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

  // Message action handlers
  const handleDeleteMessage = (messageId: string) => {
    console.log('Delete message:', messageId)
    toast({
      title: 'Delete Message',
      description: 'Message deletion coming soon'
    })
  }

  const handleReplyMessage = (messageId: string) => {
    const msg = chatMessages.find(m => m.id === messageId)
    if (msg) {
      setReplyingTo(msg)
    }
  }

  const handleCreateGroup = async () => {
    if (!groupTitle.trim() || selectedGroupUsers.length === 0 || !user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a title and select at least one member.'
      })
      return
    }

    try {
      const allParticipants = [user.id, ...selectedGroupUsers]
      const conversationId = await createGroupConversation({
        agencyId: params.agencyId,
        title: groupTitle,
        description: groupDescription,
        iconUrl: groupIcon,
        userIds: allParticipants
      })

      if (conversationId) {
        setShowNewGroupDialog(false)
        setGroupTitle('')
        setGroupDescription('')
        setGroupIcon('')
        setSelectedGroupUsers([])
        setSelectedConversationId(conversationId)

        // Reload conversations to show the new group
        await loadConversations()

        toast({
          title: 'Group Created',
          description: `"${groupTitle}" has been created successfully.`
        })
      }
    } catch (error) {
      console.error('Error creating group:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create group.'
      })
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedGroupUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleEditMessage = (messageId: string) => {
    const msg = chatMessages.find(m => m.id === messageId)
    if (msg) {
      setEditingMessage(msg)
      setNewMessage(msg.text)
    }
  }

  const handleForwardMessage = (messageId: string) => {
    console.log('Forward message:', messageId)
    toast({
      title: 'Forward',
      description: 'Forward feature coming soon'
    })
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white dark:bg-background">
      {/* Notification Queue */}
      <NotificationQueue
        notifications={inAppNotifications}
        onClose={(id) => setInAppNotifications(prev => prev.filter(n => n.id !== id))}
        onReply={(conversationId) => {
          setSelectedConversationId(conversationId)
          setInAppNotifications([])
        }}
      />

      {/* Sidebar */}
      <div className="w-[300px] border-r border-gray-200 dark:border-gray-800 h-full">
        <ChatSidebar
          inboxItems={inboxItems}
          selectedConversationId={selectedConversationId || ''}
          onSelectConversation={(id) => {
            setSelectedConversationId(id)
            setChatMessages([]) // Clear messages while loading new ones
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onDeleteConversation={handleDeleteConversation}
          agencyUsers={agencyUsers}
          onlineUsers={onlineUsers}
          onNewMessage={() => setShowNewMessageDialog(true)}
          onNewGroup={() => setShowNewGroupDialog(true)}
          notificationSettings={
            <NotificationSettingsDialog
              settings={notificationSettings}
              onSettingsChange={handleNotificationSettingsChange}
            />
          }
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 h-full overflow-hidden">
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
          isTyping={typingUsers.has(selectedMsg?.participantInfo?.id || '')}
          onInputKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          onDeleteMessage={handleDeleteMessage}
          onReplyMessage={handleReplyMessage}
          onEditMessage={handleEditMessage}
          onForwardMessage={handleForwardMessage}
          activeTab={activeTab}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          editingMessage={editingMessage}
          onCancelEdit={() => {
            setEditingMessage(null)
            setNewMessage('')
          }}
        />
      </div>

      {/* Hidden Dialog for New Message */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
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

      {/* Group Creation Dialog */}
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6 text-amber-500" />
              Create Group Channel
            </DialogTitle>
            <DialogDescription>
              Set up a new space for your team or project. Groups support multiple members, descriptions, and custom icons.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Left Column: Group Info */}
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => {
                    const url = prompt('Enter image URL for group icon (Simulation):')
                    if (url) setGroupIcon(url)
                  }}
                >
                  <div className="h-24 w-24 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-amber-500">
                    {groupIcon ? (
                      <img src={groupIcon} alt="Group Icon" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-amber-500">
                        <Camera className="h-8 w-8 mb-1" />
                        <span className="text-[10px] font-medium uppercase">Set Icon</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-lg shadow-lg">
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 text-center">Click to set group avatar</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="groupTitle" className="text-sm font-semibold flex items-center gap-1.5">
                    Group Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="groupTitle"
                    placeholder="e.g., Marketing Team, Project Alpha..."
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupDesc" className="text-sm font-semibold flex items-center gap-1.5">
                    Description
                  </Label>
                  <Textarea
                    id="groupDesc"
                    placeholder="What is this group for? Add goals or key info..."
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Member Selection */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  Select Members ({selectedGroupUsers.length})
                </Label>
                {selectedGroupUsers.length > 0 && (
                  <button
                    onClick={() => setSelectedGroupUsers([])}
                    className="text-[11px] text-red-500 hover:underline font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="pl-10 h-9 bg-gray-50 dark:bg-gray-900 border-none"
                />
              </div>

              <ScrollArea className="flex-1 min-h-[250px] max-h-[300px] border rounded-xl p-2 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="space-y-1">
                  {filteredUsers.map((agencyUser) => (
                    <div
                      key={agencyUser.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer hover:bg-white dark:hover:bg-gray-800 shadow-none hover:shadow-sm ${selectedGroupUsers.includes(agencyUser.id) ? 'bg-white dark:bg-gray-800 ring-1 ring-amber-500/30' : ''
                        }`}
                      onClick={() => toggleUserSelection(agencyUser.id)}
                    >
                      <Checkbox
                        id={`user-${agencyUser.id}`}
                        checked={selectedGroupUsers.includes(agencyUser.id)}
                        onCheckedChange={() => toggleUserSelection(agencyUser.id)}
                        className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                      />
                      <Label
                        htmlFor={`user-${agencyUser.id}`}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-gray-900">
                          <AvatarImage src={agencyUser.avatarUrl || ''} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                            {agencyUser.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate leading-none mb-1">{agencyUser.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{agencyUser.email}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedGroupUsers.length === 0 && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <Info className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">You must select at least one other member besides yourself.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowNewGroupDialog(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupTitle.trim() || selectedGroupUsers.length === 0}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 h-10 shadow-lg shadow-amber-500/20"
            >
              Create Group Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AgencyMessagesPage
