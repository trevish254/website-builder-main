'use client'
import { NotificationWithUser } from '@/lib/types'
import UserButton from '@/components/global/user-button'
import React, { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Bell, Search, Building2, Users, ChevronRight, Heart, Send, MessageCircle } from 'lucide-react'
import { Role } from '@prisma/client'
import { Card } from '../ui/card'
import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ModeToggle } from './mode-toggle'
import { useSidebar } from '@/providers/sidebar-provider'
import { useRouter } from 'next/navigation'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { getConversationsWithParticipants, sendMessage } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

type Props = {
  notifications: NotificationWithUser | []
  role?: Role
  className?: string
  subAccountId?: string
  agencyLogo?: string
  agencyName?: string
}

const InfoBar = ({ notifications, subAccountId, className, role, agencyLogo, agencyName }: Props) => {
  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  const [allNotifications, setAllNotifications] = useState(safeNotifications)
  const [showAll, setShowAll] = useState(true)
  const { isCollapsed } = useSidebar()
  const router = useRouter()
  const { user } = useSupabaseUser()
  const { toast } = useToast()

  // Messaging state
  const [conversations, setConversations] = useState<any[]>([])
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set())
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = React.useRef<HTMLDivElement>(null)

  // Count notifications
  const notificationCount = allNotifications?.length || 0
  const hasNotifications = notificationCount > 0

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(safeNotifications)
    } else {
      if (safeNotifications?.length !== 0) {
        setAllNotifications(
          safeNotifications?.filter((item) => item.subAccountId === subAccountId) ??
          []
        )
      }
    }
    setShowAll((prev) => !prev)
  }

  // Get searchable data from notifications
  const getSearchableData = () => {
    const items: Array<{ type: string; name: string; link: string; icon: any }> = []

    // Extract unique subaccounts from notifications
    const subaccounts = new Set<string>()
    const users = new Set<string>()

    safeNotifications.forEach((notif: any) => {
      if (notif.subAccountId) {
        subaccounts.add(notif.subAccountId)
      }
      if (notif.User?.name) {
        users.add(JSON.stringify({
          name: notif.User.name,
          email: notif.User.email,
          avatar: notif.User.avatarUrl
        }))
      }
    })

    // Add subaccounts to search
    subaccounts.forEach((id) => {
      items.push({
        type: 'Subaccount',
        name: `Subaccount ${id.slice(0, 8)}`,
        link: `/subaccount/${id}`,
        icon: Building2
      })
    })

    // Add users to search
    users.forEach((userStr) => {
      const user = JSON.parse(userStr)
      items.push({
        type: 'Team Member',
        name: user.name,
        link: '#',
        icon: Users
      })
    })

    return items
  }

  // Levenshtein distance function for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

  // Calculate match score
  const calculateMatchScore = (searchTerm: string, target: string): number => {
    const searchLower = searchTerm.toLowerCase()
    const targetLower = target.toLowerCase()

    // Exact match
    if (targetLower === searchLower) return 100

    // Starts with
    if (targetLower.startsWith(searchLower)) return 80

    // Contains
    if (targetLower.includes(searchLower)) return 60

    // Character matching
    let matchedChars = 0
    let searchIndex = 0
    for (let i = 0; i < targetLower.length && searchIndex < searchLower.length; i++) {
      if (targetLower[i] === searchLower[searchIndex]) {
        matchedChars++
        searchIndex++
      }
    }
    const charMatchScore = (matchedChars / searchLower.length) * 40

    // Levenshtein distance
    const distance = levenshteinDistance(searchLower, targetLower)
    const maxLength = Math.max(searchLower.length, targetLower.length)
    const similarityScore = ((maxLength - distance) / maxLength) * 30

    return charMatchScore + similarityScore
  }

  // Filter and score search results
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return []

    const allData = getSearchableData()
    const scoredResults = allData
      .map(item => ({
        ...item,
        score: calculateMatchScore(searchQuery, item.name)
      }))
      .filter(item => item.score > 20)
      .sort((a, b) => b.score - a.score)

    return scoredResults
  }, [searchQuery, safeNotifications])

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value.trim()) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }

  // Handle result click
  const handleResultClick = (link: string) => {
    router.push(link)
    setShowResults(false)
    setSearchQuery('')
  }

  // Close search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeSearchResults = () => {
    setShowResults(false)
  }

  // Load conversations for messages panel
  const loadConversations = React.useCallback(async () => {
    if (!user?.id) return
    setLoadingMessages(true)
    try {
      const convs = await getConversationsWithParticipants(user.id, {})
      console.log('[INBOX PANEL] Fetched conversations:', convs.length)

      const mapped = convs
        .map((c: any) => {
          const participants = c.ConversationParticipant || []
          const otherParticipant = participants.find((p: any) => p.userId !== user.id && p.User)
          const lastMessage = c.Message?.[0]

          // Skip conversations where we can't find another participant
          if (!otherParticipant || !otherParticipant.User) {
            console.log('[INBOX PANEL] Skipping conversation without valid participant:', c.id)
            return null
          }

          return {
            id: c.id,
            title: c.title || otherParticipant.User.name || 'Conversation',
            preview: lastMessage?.content || 'No messages yet',
            timestamp: c.lastMessageAt ? new Date(c.lastMessageAt) : new Date(),
            avatar: otherParticipant.User.avatarUrl,
            participantId: otherParticipant.userId,
            participantName: otherParticipant.User.name,
            lastMessageId: lastMessage?.id
          }
        })
        .filter(Boolean) // Remove null entries

      // Sort by timestamp descending
      mapped.sort((a: any, b: any) => b.timestamp.getTime() - a.timestamp.getTime())

      // Deduplicate by participant - keep only the most recent conversation per participant
      const seenParticipants = new Set()
      const uniqueConversations = mapped.filter((conv: any) => {
        if (seenParticipants.has(conv.participantId)) {
          console.log('[INBOX PANEL] Removing duplicate conversation for:', conv.participantName)
          return false
        }
        seenParticipants.add(conv.participantId)
        return true
      })

      const topConversations = uniqueConversations.slice(0, 5)
      console.log('[INBOX PANEL] Showing unique conversations:', topConversations.length)
      setConversations(topConversations)
    } catch (error) {
      console.error('[INBOX PANEL] Error loading conversations:', error)
    } finally {
      setLoadingMessages(false)
    }
  }, [user?.id])

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel('inbox-updates-panel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Message' },
        async (payload) => {
          console.log('[INBOX PANEL] New message received:', payload)

          // Only update if the message is not from the current user
          if (payload.new.senderId === user.id) {
            console.log('[INBOX PANEL] Ignoring own message')
            return
          }

          // Check if user is currently on the messages page
          const isOnMessagesPage = window.location.pathname.includes('/messages')

          // Play notification sound and show toast only if NOT on messages page
          if (!isOnMessagesPage) {
            // Play notification sound
            try {
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
              const oscillator = audioContext.createOscillator()
              const gainNode = audioContext.createGain()

              oscillator.connect(gainNode)
              gainNode.connect(audioContext.destination)

              oscillator.frequency.value = 800
              oscillator.type = 'sine'

              gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

              oscillator.start(audioContext.currentTime)
              oscillator.stop(audioContext.currentTime + 0.5)

              console.log('[INBOX PANEL] Played notification sound')
            } catch (error) {
              console.error('[INBOX PANEL] Error playing notification sound:', error)
            }

            // Show toast notification with message preview
            const messagePreview = payload.new.content?.substring(0, 50) || 'You have a new message'
            toast({
              title: '💬 New Message',
              description: `${messagePreview}${payload.new.content?.length > 50 ? '...' : ''}`,
              duration: 5000,
            })

            console.log('[INBOX PANEL] Showed notification toast')
          }

          // Reload conversations to show the new message
          console.log('[INBOX PANEL] Reloading conversations due to new message')
          await loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, loadConversations, toast])

  // Handle quick reply
  const handleQuickReply = async (conversationId: string) => {
    const text = replyText[conversationId]?.trim()
    if (!text || !user?.id) {
      console.error('[QUICK REPLY] Missing required data:', { hasText: !!text, hasUserId: !!user?.id })
      return
    }

    console.log('[QUICK REPLY] Attempting to send message:', {
      conversationId,
      senderId: user.id,
      contentLength: text.length
    })

    try {
      const result = await sendMessage({
        conversationId,
        senderId: user.id,
        content: text,
        metadata: {}
      })

      console.log('[QUICK REPLY] Send message result:', result)

      if (!result) {
        throw new Error('sendMessage returned null')
      }

      setReplyText(prev => ({ ...prev, [conversationId]: '' }))

      // Reload conversations to show the new message
      await loadConversations()

      toast({
        title: 'Message sent',
        description: 'Your reply has been sent successfully'
      })
    } catch (error: any) {
      console.error('[QUICK REPLY] Error sending message:', error)
      console.error('[QUICK REPLY] Error details:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      })

      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: error?.message || 'An error occurred while sending your message. Check console for details.'
      })
    }
  }

  // Handle like/reaction
  const handleLikeMessage = (messageId: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })

    toast({
      title: likedMessages.has(messageId) ? 'Reaction removed' : 'Message liked',
      description: likedMessages.has(messageId) ? '' : '❤️'
    })
  }

  return (
    <>
      <div
        className={twMerge(
          'fixed z-[20] top-0 left-0 right-0 h-[50px] p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]',
          className
        )}
      >
        <div className="flex items-center gap-2 pl-4">
          {agencyLogo && (
            <div className="relative w-8 h-8">
              <img
                src={agencyLogo}
                alt="Agency Logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          )}
          {agencyName && (
            <span className="font-bold text-xl hidden md:block">
              {agencyName}
            </span>
          )}
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md hidden md:block" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-3 py-2 font-medium">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                </p>
                {searchResults.map((result, index) => {
                  const Icon = result.icon
                  return (
                    <button
                      key={index}
                      onClick={() => handleResultClick(result.link)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted rounded-md transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.name}</p>
                        <p className="text-xs text-muted-foreground">{result.type}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {showResults && searchQuery.trim() && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg p-4 z-50">
              <p className="text-sm text-muted-foreground text-center">
                No results found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Icons on the far right */}
        <div className="flex items-center gap-3">
          {/* Messages */}
          <Sheet>
            <SheetTrigger>
              <div className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                {conversations.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversations.length}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll bg-background/40 backdrop-blur-xl border-l border-border/50">
              <SheetHeader className="text-left">
                <SheetTitle>Messages</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  {conversations.length} recent conversation{conversations.length !== 1 ? 's' : ''}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {loadingMessages ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading conversations...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex flex-col gap-2 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm bg-white/5"
                    >
                      <div
                        className="flex gap-3 cursor-pointer"
                        onClick={() => router.push(`/agency/${subAccountId || 'default'}/messages`)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.avatar || ''} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {conv.participantName?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1 min-w-0">
                          <p className="text-sm font-semibold">{conv.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.preview}
                          </p>
                          <small className="text-xs text-muted-foreground mt-1">
                            {conv.timestamp.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => conv.lastMessageId && handleLikeMessage(conv.lastMessageId)}
                        >
                          <Heart
                            className={`h-3 w-3 mr-1 ${likedMessages.has(conv.lastMessageId) ? 'fill-red-500 text-red-500' : ''}`}
                          />
                          {likedMessages.has(conv.lastMessageId) ? 'Liked' : 'Like'}
                        </Button>
                      </div>

                      {/* Quick reply */}
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Quick reply..."
                          value={replyText[conv.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [conv.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleQuickReply(conv.id)
                            }
                          }}
                          className="h-8 text-xs bg-white/5 border-white/10"
                        />
                        <Button
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => handleQuickReply(conv.id)}
                          disabled={!replyText[conv.id]?.trim()}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex items-center justify-center text-muted-foreground py-4 border-t border-white/10 mt-4">
                  <button
                    onClick={() => router.push(`/agency/${subAccountId || 'default'}/messages`)}
                    className="text-sm text-primary hover:underline"
                  >
                    View all messages →
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Tasks */}
          <Sheet>
            <SheetTrigger>
              <div className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M9 11l3 3L22 4"></path>
                </svg>
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll bg-background/40 backdrop-blur-xl border-l border-border/50">
              <SheetHeader className="text-left">
                <SheetTitle>Tasks</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Your upcoming tasks
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {/* Sample tasks - replace with actual data */}
                <div className="flex gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded border-2 border-primary"></div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-medium">Complete project proposal</p>
                    <p className="text-xs text-muted-foreground">
                      Due: Today
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm bg-white/5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded border-2 border-primary"></div>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-medium">Review client feedback</p>
                    <p className="text-xs text-muted-foreground">
                      Due: Tomorrow
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-muted-foreground py-4">
                  <button
                    onClick={() => router.push('/tasks')}
                    className="text-sm text-primary hover:underline"
                  >
                    View all tasks →
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Calendar */}
          <Sheet>
            <SheetTrigger>
              <div className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll bg-background/40 backdrop-blur-xl border-l border-border/50">
              <SheetHeader className="text-left">
                <SheetTitle>Calendar</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Upcoming events and meetings
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {/* Sample events - replace with actual data */}
                <div className="flex gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">DEC</span>
                    <span className="text-lg font-bold text-primary">5</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-medium">Team Meeting</p>
                    <p className="text-xs text-muted-foreground">
                      10:00 AM - 11:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm bg-white/5">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary">DEC</span>
                    <span className="text-lg font-bold text-primary">6</span>
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-medium">Client Presentation</p>
                    <p className="text-xs text-muted-foreground">
                      2:00 PM - 3:30 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center text-muted-foreground py-4">
                  <button
                    onClick={() => router.push('/calendar')}
                    className="text-sm text-primary hover:underline"
                  >
                    View full calendar →
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Account */}
          <UserButton />

          {/* Notifications */}
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white relative">
                <Bell size={17} />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  You have {notificationCount} notification{notificationCount !== 1 ? 's' : ''}
                </SheetDescription>
                {(role === 'AGENCY_ADMIN' || role === 'AGENCY_OWNER') && subAccountId && (
                  <Card className="flex items-center justify-between p-4 mt-4">
                    <span className="text-sm font-medium">Show only current subaccount</span>
                    <Switch checked={!showAll} onCheckedChange={handleClick} />
                  </Card>
                )}
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {allNotifications?.map((notification) => {
                  // Safely handle notification data
                  const user = notification?.User
                  const userName = user?.name || 'User'
                  const userAvatar = user?.avatarUrl
                  const notificationText = notification?.notification || ''
                  const createdAt = notification?.createdAt ? new Date(notification.createdAt) : new Date()

                  return (
                    <div
                      key={notification?.id || Math.random()}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={userAvatar}
                          alt="Profile Picture"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm leading-relaxed break-words">
                          {notificationText.split('|').map((part, index) => {
                            if (index === 0 || index === 2) {
                              return (
                                <span key={index} className="font-semibold">
                                  {part}
                                </span>
                              )
                            }
                            return (
                              <span key={index} className="text-muted-foreground">
                                {part}
                              </span>
                            )
                          })}
                        </p>
                        <small className="text-xs text-muted-foreground mt-1">
                          {createdAt.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  )
                })}
              </div>
              {allNotifications?.length === 0 && (
                <div className="flex items-center justify-center text-muted-foreground py-8">
                  You have no notifications
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Theme Toggle */}
          <ModeToggle />
        </div>
      </div>
    </>
  )
}

export default InfoBar
