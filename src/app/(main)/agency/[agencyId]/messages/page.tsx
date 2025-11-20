'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip,
  MoreVertical,
  Archive,
  Trash2,
  Star,
  StarOff,
  Pin,
  User,
  CheckCircle2,
  Circle,
  Smile,
  Image as ImageIcon,
  Video,
  FileText,
  Clock,
  Reply,
  Forward
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import { getUserConversations, getConversationMessages, sendMessage as sendMessageApi, markConversationRead, getAgencyUsers, ensureDirectConversation, getConversationWithParticipants } from '@/lib/supabase-queries'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

type Props = {
  params: { agencyId: string }
}

interface InboxItem {
  id: string
  title: string
  preview: string
  timestamp: string
  unread: boolean
  starred: boolean
  pinned: boolean
  avatar?: string
  email?: string
  attachments?: number
  participantInfo?: {
    id: string
    name: string
    email: string
    avatarUrl: string
  } | null
}

interface ChatMessage {
  id: string
  sender: 'me' | 'other'
  text: string
  timestamp: string
  attachments?: { type: string; name: string; url: string }[]
}

const MessagesPage = ({ params }: Props) => {
  const { user } = useUser()
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
          timestamp: c.lastMessageAt || c.updatedAt || c.createdAt || '',
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
      const mapped: ChatMessage[] = msgs.map((m) => ({
        id: m.id,
        sender: m.senderId === user?.id ? 'me' : 'other',
        text: m.content,
        timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
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
          setChatMessages((prev) => [
            ...prev,
            {
              id: m.id,
              sender: m.senderId === user?.id ? 'me' : 'other',
              text: m.content,
              timestamp: new Date(m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversationId, user?.id])

  const filteredMessages = inboxItems.filter(msg => {
    if (searchQuery) {
      return msg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             msg.preview.toLowerCase().includes(searchQuery.toLowerCase())
    }
    return true
  })

  const unreadCount = inboxItems.filter(m => m.unread).length
  const starredCount = inboxItems.filter(m => m.starred).length

  const handleStarToggle = (id: string) => {
    setInboxItems(inboxItems.map(msg => 
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    ))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !user?.id) return
    await sendMessageApi({ conversationId: selectedConversationId, senderId: user.id, content: newMessage })
    setNewMessage('')
  }

  const selectedMsg = useMemo(() => inboxItems.find(m => m.id === selectedConversationId), [inboxItems, selectedConversationId])

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
        {/* Inbox Panel */
        }
        <Card className="lg:col-span-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl">Inbox</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'inbox' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('inbox')}
                >
                  Inbox
                </Button>
                <Button
                  variant={activeTab === 'archived' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('archived')}
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      onClick={() => setSelectedConversationId(message.id)}
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
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.avatar || message.participantInfo?.avatarUrl || ''} />
                          <AvatarFallback>
                            {message.participantInfo?.name?.charAt(0) || message.title.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
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
                          {message.participantInfo?.email && (
                            <p className="text-xs text-gray-500 truncate">
                              {message.participantInfo.email}
                            </p>
                          )}
                          {message.attachments && message.attachments > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Paperclip className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {message.attachments} attachment{message.attachments > 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                          {message.unread && (
                            <div className="flex items-center gap-2 mt-2">
                              <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                              <span className="text-xs text-blue-600 dark:text-blue-400">New</span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStarToggle(message.id)
                          }}
                        >
                          {message.starred ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat/Message Detail Panel */}
        <Card className="lg:col-span-2 flex flex-col overflow-hidden">
          {selectedConversationId && selectedMsg ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedMsg.avatar || selectedMsg.participantInfo?.avatarUrl || ''} />
                      <AvatarFallback>
                        {selectedMsg.participantInfo?.name?.charAt(0) || selectedMsg.title.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedMsg.participantInfo?.name || selectedMsg.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedMsg.participantInfo?.email || 'Direct Message'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                <div className="px-6 py-4 border-b bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedMsg.title}</h3>
                      <p className="text-sm text-muted-foreground">Last updated {selectedMsg.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Forward className="h-4 w-4 mr-2" />
                        Forward
                      </Button>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 py-6">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`
                          max-w-[70%] rounded-2xl px-4 py-3
                          ${msg.sender === 'me' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                          }
                        `}>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mb-2 space-y-2">
                              {msg.attachments.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg"
                                >
                                  {att.type === 'pdf' && <FileText className="h-4 w-4 text-red-500" />}
                                  {att.type === 'image' && <ImageIcon className="h-4 w-4 text-blue-500" />}
                                  {att.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
                                  <span className="text-xs truncate">{att.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          <div className={`
                            flex items-center justify-end gap-1 mt-2 text-xs
                            ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}
                          `}>
                            <span>{msg.timestamp}</span>
                            {msg.sender === 'me' && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="icon"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Select a message to view
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the inbox to start chatting
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}

export default MessagesPage

