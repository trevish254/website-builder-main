'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Archive, Trash2, MoreVertical, Paperclip, Image as ImageIcon, Smile, Send, Loader2, Phone, Video, X, Mail, MapPin, Calendar, ShieldCheck, Mic, Check, CalendarClock, Zap, Settings, Clock, Link, BellRing, UserCheck, Plus, FileText, Search, Palette, ArrowLeft } from 'lucide-react'
import MessageBubble from './message-bubble'
import { InboxItem } from './chat-sidebar'
import { useToast } from '@/components/ui/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ConnectivityIndicator from '@/components/global/connectivity-indicator'
import { createClient } from '@/lib/supabase/client'

interface ChatMessage {
    id: string
    sender: 'me' | 'other'
    text: string
    timestamp: string
    attachments?: { type: string; name: string; url: string }[]
    senderName?: string
    senderAvatar?: string
    isRead?: boolean
    replyTo?: {
        text: string
        senderName?: string
    }
    createdAt: string
}

interface ChatWindowProps {
    selectedMsg: InboxItem | null
    chatMessages: ChatMessage[]
    newMessage: string
    onNewMessageChange: (val: string) => void
    onSendMessage: () => void
    onFileUpload: (files: File[]) => void
    isUploading: boolean
    onInputKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
    onDeleteMessage?: (id: string) => void
    onReplyMessage?: (id: string) => void
    onEditMessage?: (id: string) => void
    onForwardMessage?: (id: string) => void
    activeTab?: string
    replyingTo?: ChatMessage | null
    onCancelReply?: () => void
    editingMessage?: ChatMessage | null
    onCancelEdit?: () => void
    typingUsers?: Set<string>
    chatParticipants?: Map<string, { id: string, name: string, avatarUrl: string }>
    onVoiceCall?: () => void
    onVideoCall?: () => void
    onLoadMore?: () => void
    hasMoreMessages?: boolean
    isLoadingMore?: boolean
    allAttachments?: any[]
    onBack?: () => void
}

const ChatWindow = ({
    selectedMsg,
    chatMessages,
    newMessage,
    onNewMessageChange,
    onSendMessage,
    onFileUpload,
    isUploading,
    onInputKeyDown,
    onDeleteMessage,
    onReplyMessage,
    onEditMessage,
    onForwardMessage,
    activeTab,
    replyingTo,
    onCancelReply,
    editingMessage,
    onCancelEdit,
    typingUsers = new Set(),
    chatParticipants = new Map(),
    onVoiceCall,
    onVideoCall,
    onLoadMore,
    hasMoreMessages,
    isLoadingMore,
    allAttachments = [],
    onBack
}: ChatWindowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [lastScrollHeight, setLastScrollHeight] = useState(0)
    const { toast } = useToast()

    const handleComingSoon = (feature: string) => {
        toast({
            title: 'Coming Soon',
            description: `${feature} functionality is currently under development.`,
        })
    }

    // Voice recording state
    const [isRecording, setIsRecording] = useState(false)
    const [recordingDuration, setRecordingDuration] = useState(0)
    const [showScheduleDialog, setShowScheduleDialog] = useState(false)
    const [showResourcesDialog, setShowResourcesDialog] = useState(false)
    const [scheduledMeetings, setScheduledMeetings] = useState<any[]>([])
    const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null)
    const [meetingForm, setMeetingForm] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        label: '#3b82f6', // Default blue
        attachment: null as File | null,
        notifications: [] as string[]
    })
    const [resourceSearch, setResourceSearch] = useState('')
    const [activeAutomations, setActiveAutomations] = useState<Set<string>>(new Set(['Auto-Follow up']))
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
    const [showEditGroupDialog, setShowEditGroupDialog] = useState(false)
    const [groupForm, setGroupForm] = useState({
        name: '',
        description: '',
        icon: null as File | null
    })
    const [memberSearchQuery, setMemberSearchQuery] = useState('')
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    // Extract shared resources (Filtering out voice notes)
    const sharedResources = useMemo(() => {
        // Use allAttachments if provided (all-time history), or fallback to currently loaded chatMessages
        const source = allAttachments.length > 0 ? allAttachments : []

        if (allAttachments.length > 0) {
            return allAttachments
                .filter(att => !att.type?.startsWith('audio'))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }

        // Fallback for safety (though allAttachments should be preferred)
        const resources: { type: string; name: string; url: string; createdAt: string }[] = []
        chatMessages.forEach(msg => {
            if (msg.attachments && msg.attachments.length > 0) {
                msg.attachments.forEach(att => {
                    if (!att.type.startsWith('audio')) {
                        resources.push({
                            ...att,
                            createdAt: msg.createdAt
                        })
                    }
                })
            }
        })
        return resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [allAttachments, chatMessages])

    const categorizedResources = useMemo(() => {
        const filtered = sharedResources.filter(r => r.name.toLowerCase().includes(resourceSearch.toLowerCase()))
        return {
            images: filtered.filter(r => r.type.startsWith('image')),
            videos: filtered.filter(r => r.type.startsWith('video')),
            documents: filtered.filter(r =>
                r.type.includes('pdf') ||
                r.type.includes('doc') ||
                r.type.includes('excel') ||
                r.type.includes('spreadsheet') ||
                r.type.includes('text') ||
                r.type.includes('presentation') ||
                r.type.includes('csv')
            ),
            others: filtered.filter(r =>
                !r.type.startsWith('image') &&
                !r.type.startsWith('video') &&
                !r.type.includes('pdf') &&
                !r.type.includes('doc') &&
                !r.type.includes('excel') &&
                !r.type.includes('spreadsheet') &&
                !r.type.includes('text') &&
                !r.type.includes('presentation') &&
                !r.type.includes('csv')
            )
        }
    }, [sharedResources, resourceSearch])

    const handleScheduleMeeting = async () => {
        if (!meetingForm.title || !meetingForm.date || !meetingForm.time) return

        const supabase = createClient()

        // Construct Start/End Time
        const startDateTime = new Date(`${meetingForm.date}T${meetingForm.time}`)
        const endDateTime = new Date(startDateTime.getTime() + 45 * 60000) // Default 45 min duration

        try {
            let result;

            if (editingMeetingId) {
                // UPDATE existing meeting
                const recipientId = selectedMsg.participantInfo?.id ||
                    selectedMsg.participants?.find((p: any) => p.id !== user?.id)?.id ||
                    null;

                result = await supabase
                    .from('Meetings')
                    .update({
                        title: meetingForm.title,
                        description: meetingForm.description,
                        location: meetingForm.location,
                        startTime: startDateTime.toISOString(),
                        endTime: endDateTime.toISOString(),
                        color: meetingForm.label,
                        notifications: meetingForm.notifications,
                        conversationId: selectedMsg.id,
                        recipientId: recipientId,
                    })
                    .eq('id', editingMeetingId)
                    .select('*')
                    .single()
            } else {
                // INSERT new meeting
                // Get current user for RLS policy
                const { data: { user } } = await supabase.auth.getUser()

                const recipientId = selectedMsg.participantInfo?.id ||
                    selectedMsg.participants?.find((p: any) => p.id !== user?.id)?.id ||
                    null;

                const dbPayload = {
                    title: meetingForm.title,
                    description: meetingForm.description,
                    location: meetingForm.location,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    color: meetingForm.label,
                    notifications: meetingForm.notifications,
                    status: 'scheduled',
                    senderId: user?.id,
                    conversationId: selectedMsg.id,
                    recipientId: recipientId,
                };

                console.log('[MEETINGS] 🚀 Inserting new meeting with payload:', dbPayload);

                if (!selectedMsg.id) {
                    toast({ variant: 'destructive', title: 'Error', description: 'Conversation ID lost. Please re-select the chat.' });
                    return;
                }

                result = await supabase
                    .from('Meetings')
                    .insert(dbPayload)
                    .select('*')
                    .single()
            }

            const { data, error } = result
            if (error) throw error

            console.log('[MEETINGS] ✅ Result from DB:', data)


            // Update UI
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
            const dateObj = new Date(meetingForm.date)

            const meetingObj = {
                ...data, // Store full DB object to support editing later
                date: `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`,
                time: meetingForm.time,
            }

            if (editingMeetingId) {
                setScheduledMeetings(prev => prev.map(m => m.id === editingMeetingId ? meetingObj : m))
                toast({ title: 'Meeting Updated', description: `"${meetingObj.title}" has been updated.` })
            } else {
                // VERIFICATION: Check if the returned data actually has the IDs we sent
                if (!data.conversationId) {
                    console.error('[MEETINGS] ❌ WARNING: Database did not return conversationId. Check if column exists:', data);
                }
                setScheduledMeetings(prev => [meetingObj, ...prev])
                toast({ title: 'Meeting Scheduled', description: `"${meetingObj.title}" has been saved.` })
            }

            setShowScheduleDialog(false)
            setMeetingForm({ title: '', description: '', location: '', date: '', time: '', label: '#3b82f6', attachment: null, notifications: [] })
            setEditingMeetingId(null)

        } catch (error: any) {
            console.error('Error saving meeting:', error)
            console.error('Error details:', {
                message: error?.message,
                details: error?.details,
                hint: error?.hint,
                code: error?.code
            })
            toast({
                title: 'Error',
                description: error?.message || 'Failed to save meeting. Please try again.',
                variant: 'destructive'
            })
        }
    }

    const handleUpdateGroup = async () => {
        if (!groupForm.name || !selectedMsg.id) return

        const supabase = createClient()

        try {
            let iconUrl = selectedMsg.iconUrl

            // Upload new icon if provided
            if (groupForm.icon) {
                const fileExt = groupForm.icon.name.split('.').pop()
                const fileName = `${selectedMsg.id}-${Date.now()}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('group-icons')
                    .upload(fileName, groupForm.icon)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('group-icons')
                    .getPublicUrl(fileName)

                iconUrl = publicUrl
            }

            // Update conversation
            const { error } = await supabase
                .from('Conversation')
                .update({
                    title: groupForm.name,
                    description: groupForm.description,
                    iconUrl: iconUrl,
                })
                .eq('id', selectedMsg.id)

            if (error) throw error

            toast({
                title: 'Group Updated',
                description: 'Group details have been updated successfully.',
            })

            setShowEditGroupDialog(false)
            setGroupForm({ name: '', description: '', icon: null })

        } catch (error: any) {
            console.error('Error updating group:', error)
            toast({
                title: 'Error',
                description: error?.message || 'Failed to update group.',
                variant: 'destructive'
            })
        }
    }

    const handleAddMember = async (userId: string, userName: string) => {
        if (!selectedMsg.id) return

        const supabase = createClient()

        try {
            const { error } = await supabase
                .from('ConversationParticipant')
                .insert({
                    conversationId: selectedMsg.id,
                    userId: userId,
                    role: 'member'
                })

            if (error) throw error

            toast({
                title: 'Member Added',
                description: `${userName} has been added to the group.`,
            })

        } catch (error: any) {
            console.error('Error adding member:', error)
            toast({
                title: 'Error',
                description: error?.message || 'Failed to add member.',
                variant: 'destructive'
            })
        }
    }

    const handleLeaveGroup = async () => {
        if (!selectedMsg.id) return

        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { error } = await supabase
                .from('ConversationParticipant')
                .delete()
                .eq('conversationId', selectedMsg.id)
                .eq('userId', user.id)

            if (error) throw error

            toast({
                title: 'Left Group',
                description: `You have left ${selectedMsg.title}.`,
            })

            setShowProfile(false)

        } catch (error: any) {
            console.error('Error leaving group:', error)
            toast({
                title: 'Error',
                description: error?.message || 'Failed to leave group.',
                variant: 'destructive'
            })
        }
    }

    const handleDeleteGroup = async () => {
        if (!selectedMsg.id) return

        const supabase = createClient()

        try {
            const { error } = await supabase
                .from('Conversation')
                .delete()
                .eq('id', selectedMsg.id)

            if (error) throw error

            toast({
                title: 'Group Deleted',
                description: `${selectedMsg.title} has been deleted.`,
            })

            setShowProfile(false)

        } catch (error: any) {
            console.error('Error deleting group:', error)
            toast({
                title: 'Error',
                description: error?.message || 'Failed to delete group.',
                variant: 'destructive'
            })
        }
    }

    const toggleAutomation = (name: string) => {
        const newSet = new Set(activeAutomations)
        if (newSet.has(name)) newSet.delete(name)
        else newSet.add(name)
        setActiveAutomations(newSet)
        toast({
            title: newSet.has(name) ? 'Automation Enabled' : 'Automation Disabled',
            description: `${name} has been ${newSet.has(name) ? 'activated' : 'deactivated'} for this user.`,
        })
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' })
                onFileUpload([file])

                // Cleanup stream tracks
                stream.getTracks().forEach(track => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            setRecordingDuration(0)
            timerRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1)
            }, 1000)
        } catch (error) {
            console.error('Error starting recording:', error)
            alert('Could not access microphone. Please check your permissions.')
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }

    // Scroll to bottom function
    const scrollToBottom = (force = false, smooth = false) => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            // Use a tighter threshold (100px) for auto-scrolling
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

            if (force || isNearBottom) {
                scrollRef.current.scrollTo({
                    top: scrollRef.current.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                })
            }
        }
    }

    // Detect scroll events (bottom/top)
    useEffect(() => {
        const viewport = scrollRef.current
        if (!viewport) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = viewport
            // Show button if user is more than 100px from bottom
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
            setShowScrollButton(!isNearBottom)

            // Trigger load more if at top
            if (scrollTop === 0 && hasMoreMessages && !isLoadingMore && onLoadMore) {
                console.log('[SCROLL] Reached top, loading more messages...')
                setLastScrollHeight(scrollHeight)
                onLoadMore()
            }
        }

        viewport.addEventListener('scroll', handleScroll)
        return () => viewport.removeEventListener('scroll', handleScroll)
    }, [scrollRef.current, selectedMsg, hasMoreMessages, isLoadingMore, onLoadMore])

    // Handle scroll preservation when prepending older messages
    useEffect(() => {
        if (scrollRef.current && lastScrollHeight > 0) {
            const newScrollHeight = scrollRef.current.scrollHeight
            const delta = newScrollHeight - lastScrollHeight
            if (delta > 0) {
                // Use 'instant' to prevent visual flicker during preservation
                scrollRef.current.scrollTop = delta
            }
            // Reset preserve flag after successful adjustment
            setLastScrollHeight(0)
        }
    }, [chatMessages.length, lastScrollHeight])

    // Auto-scroll to bottom only when NEW messages arrive (Append)
    const prevLastMsgId = useRef<string | null>(null)

    useEffect(() => {
        const lastMessage = chatMessages[chatMessages.length - 1]

        // CASE: If last message changed, it's a new message (APPEND) 
        // OR it's the first load. We should scroll.
        // CASE: If last message is the SAME, it's likely a PREPEND (Pagination). 
        // We must STAY PUT.
        const isNewMessageArrival = lastMessage?.id !== prevLastMsgId.current
        prevLastMsgId.current = lastMessage?.id || null

        // Don't auto-scroll to bottom if we are preserving scroll from pagination
        if (lastScrollHeight > 0) return

        if (isNewMessageArrival) {
            const isMyMessage = lastMessage?.sender === 'me'
            const timer = setTimeout(() => {
                scrollToBottom(isMyMessage)
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [chatMessages, typingUsers.size])

    // Fetch meetings when conversation is selected
    useEffect(() => {
        if (!selectedMsg?.id) {
            setScheduledMeetings([])
            return
        }

        const fetchMeetings = async () => {
            const supabase = createClient()
            console.log(`[MEETINGS] Fetching for conversation: ${selectedMsg.id}`)
            try {
                const { data, error } = await supabase
                    .from('Meetings')
                    .select('*')
                    .eq('conversationId', selectedMsg.id)
                    .order('startTime', { ascending: false })

                if (error) throw error

                console.log(`[MEETINGS] Found ${data?.length || 0} meetings`)
                if (data) {
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
                    const formatted = data.map(m => {
                        const dateObj = new Date(m.startTime)
                        return {
                            ...m,
                            date: `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}`,
                            time: dateObj.toTimeString().slice(0, 5)
                        }
                    })
                    setScheduledMeetings(formatted)
                }
            } catch (err) {
                console.error('[MEETINGS] Error fetching meetings:', err)
            }
        }

        fetchMeetings()
    }, [selectedMsg?.id])

    // Scroll to bottom immediately when conversation is selected
    useEffect(() => {
        if (selectedMsg) {
            // Immediate force scroll to bottom on new convo selection
            scrollToBottom(true, false)
            // Also scroll after a delay to catch late-loading messages
            const timer = setTimeout(() => {
                scrollToBottom(true, false)
            }, 200)
            return () => clearTimeout(timer)
        }
    }, [selectedMsg?.id])

    if (!selectedMsg) {
        return (
            <Card className="flex-1 w-full flex flex-col overflow-hidden h-full">
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
        <Card className="flex-1 w-full flex flex-col overflow-hidden h-full border-none shadow-none md:border md:shadow-sm">

            {/* Chat Header */}
            <CardHeader className="py-2.5 px-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-gray-500 hover:text-gray-700 -ml-2"
                                onClick={onBack}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <div className="relative">
                            <Avatar
                                className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setShowProfile(true)}
                            >
                                <AvatarImage src={selectedMsg.type === 'group' ? (selectedMsg.iconUrl || '') : (selectedMsg.avatar || selectedMsg.participantInfo?.avatarUrl || '')} />
                                <AvatarFallback>
                                    {selectedMsg.type === 'group'
                                        ? selectedMsg.title?.charAt(0) || 'G'
                                        : selectedMsg.participantInfo?.name?.charAt(0) || selectedMsg.title?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            {selectedMsg.isOnline && selectedMsg.type !== 'group' && (
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-base">{selectedMsg.type === 'group' ? selectedMsg.title : (selectedMsg.participantInfo?.name || selectedMsg.title)}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {selectedMsg.type === 'group'
                                    ? `${selectedMsg.chatMessages?.length || 0} messages`
                                    : selectedMsg.participantInfo?.email || 'Direct Message'}
                                {typingUsers.size > 0 && (
                                    <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium animate-pulse text-xs">
                                        • {Array.from(typingUsers).map(id => {
                                            const name = chatParticipants.get(id)?.name || 'Someone'
                                            return name.split(' ')[0]
                                        }).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
                                    </span>
                                )}
                            </p>
                        </div>
                        <ConnectivityIndicator />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={onVoiceCall}
                            disabled={!selectedMsg || selectedMsg.type === 'group'}
                        >
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={onVideoCall}
                            disabled={!selectedMsg}
                        >
                            <Video className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => setShowProfile(true)}
                        >
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="flex-1 p-0 flex flex-col relative min-h-0 overflow-hidden">
                <div
                    className="flex-1 overflow-y-auto px-6 custom-scrollbar h-0 overscroll-contain"
                    ref={scrollRef}
                    data-lenis-prevent
                >
                    <div className="flex flex-col">
                        <div className="space-y-4 py-6 pb-40">
                            {isLoadingMore && (
                                <div className="flex items-center justify-center py-4 w-full">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-900 rounded-full border border-gray-100 dark:border-gray-800 shadow-sm animate-pulse">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                        <span className="text-xs font-medium text-gray-500">Loading history...</span>
                                    </div>
                                </div>
                            )}
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
                                    replyTo={msg.replyTo}
                                    type={msg.type}
                                />
                            ))}
                            {typingUsers.size > 0 && (
                                <div className="flex justify-start mb-4 h-10 items-center opacity-0.7">
                                    <div className="bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl rounded-bl-none px-4 py-2 border border-gray-200/50 dark:border-gray-800/50">
                                        <div className="flex gap-1.5 items-center">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Scroll to Bottom Button */}
                {showScrollButton && (
                    <Button
                        onClick={() => scrollToBottom(true, true)}
                        className="absolute bottom-32 right-8 rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-20 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                        size="icon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m18 15-6 6-6-6" />
                            <path d="M12 3v18" />
                        </svg>
                    </Button>
                )}

                {/* Message Input */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 pointer-events-none">
                    <div className="max-w-4xl mx-auto pointer-events-auto relative bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 shadow-2xl rounded-2xl overflow-hidden transition-all focus-within:ring-1 focus-within:ring-blue-500/50">
                        {/* Reply Preview */}
                        {replyingTo && (
                            <div className="px-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 border-b border-blue-100/50 dark:border-blue-900/30 flex items-center justify-between group/reply animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-1 h-8 bg-blue-500 rounded-full shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                            Replying to {replyingTo.senderName || 'User'}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {replyingTo.text}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-400 hover:text-blue-600"
                                    onClick={onCancelReply}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {/* Editing Message Preview */}
                        {editingMessage && (
                            <div className="px-4 py-2 bg-amber-50/50 dark:bg-amber-900/20 border-b border-amber-100/50 dark:border-amber-900/30 flex items-center justify-between group/edit animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-1 h-8 bg-amber-500 rounded-full shrink-0" />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                            Editing Message
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {editingMessage.text}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 text-gray-400 hover:text-amber-600"
                                    onClick={onCancelEdit}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        <div className="flex items-end gap-2 p-2">
                            {/* Left Side Actions */}
                            <div className="flex items-center pb-1 pl-1 gap-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            <Smile className="h-5 w-5" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 p-3" side="top" align="start">
                                        <div className="grid grid-cols-8 gap-1 h-64 overflow-y-auto custom-scrollbar">
                                            {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦵', '🦿', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '🔥', '✨', '🌟', '💢', '💯', '💤', '💨', '💦', '💭', '🚀', '🚁', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎', '🏍', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣', '🛤', '🛢', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳', '⛴', '🛥', '🚢', '✈️', '🛩', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰', '🚀', '🛸', '🛎', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱', '⏲', '🕰', '🌡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '💵', '💴', '💶', '💷', '💰', '🪙', '💳', '💎', '⚖️', '🧱', '🪜', '⚒', '🛠', '⛏', '🪚', '🔩', '⚙️', '🪤', '🔫', '💣', '🧨', '🪓', '🔪', '🗡', '⚔️', '🛡', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳', '💊', '💉', '🩸', '🩹', '🩺', '🗝', '🔑', '🚪', '🪑', '🛋', '🛏', '🛌', '🧸', '🪆', '🖼', '🪞', '🪟', '🧺', '🧹', '🪠', '🪣', '🧼', '🫧', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳', '💊', '💉', '🩸', '🩹', '🩺', '🗝', '🔑', '🚪', '🪑', '🛋', '🛏', '🛌', '🧸', '🪆', '🖼', '🪞', '🪟', '🧺', '🧹', '🪠', '🪣', '🧼', '🫧', '🪥', '🧽', '🧯', '🛒'].map(emoji => (
                                                <button
                                                    key={emoji}
                                                    className="h-7 w-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors text-lg"
                                                    onClick={() => onNewMessageChange(newMessage + emoji)}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            onFileUpload(Array.from(e.target.files))
                                            e.target.value = ''
                                        }
                                    }}
                                    multiple
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.accept = 'image/*'
                                            fileInputRef.current.click()
                                        }
                                    }}
                                    disabled={isUploading}
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.accept = '*/*'
                                            fileInputRef.current.click()
                                        }
                                    }}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                                </Button>
                            </div>

                            {/* Textarea or Recording Indicator */}
                            <div className="flex-1">
                                {isRecording ? (
                                    <div className="h-[40px] flex items-center gap-3 px-2">
                                        <div className="flex items-center gap-2 text-red-500 animate-pulse">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span className="text-sm font-medium">Recording</span>
                                        </div>
                                        <span className="text-sm font-mono text-gray-500">{formatDuration(recordingDuration)}</span>
                                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 animate-[recording_1.5s_ease-in-out_infinite]" style={{ width: '40%' }} />
                                        </div>
                                    </div>
                                ) : (
                                    <Textarea
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => {
                                            onNewMessageChange(e.target.value)
                                            e.target.style.height = 'inherit'
                                            e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`
                                        }}
                                        onKeyDown={onInputKeyDown}
                                        className="min-h-[40px] max-h-[80px] py-2 bg-transparent border-none focus-visible:ring-0 resize-none overflow-y-auto placeholder:text-gray-400"
                                        rows={1}
                                    />
                                )}
                            </div>

                            {/* Style for recording animation */}
                            <style jsx>{`
                            @keyframes recording {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(250%); }
                            }
                        `}</style>

                            {/* Right Side Actions */}
                            <div className="flex items-center gap-1 pb-1 pr-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 transition-colors ${isRecording
                                        ? "text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20"
                                        : "text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                    onClick={isRecording ? stopRecording : startRecording}
                                >
                                    {isRecording ? <X className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.accept = 'image/*'
                                            fileInputRef.current.click()
                                        }
                                    }}
                                    disabled={isUploading || isRecording}
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </Button>

                                <Button
                                    onClick={isRecording ? stopRecording : onSendMessage}
                                    className={`h-8 w-8 rounded-full transition-all duration-300 ${(newMessage.trim() || isRecording)
                                        ? editingMessage
                                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white translate-x-0 opacity-100"
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-400 opacity-50 cursor-not-allowed"
                                        }`}
                                    size="icon"
                                    disabled={isUploading || (!newMessage.trim() && !isRecording)}
                                >
                                    {editingMessage ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Profile Sidebar Overlay */}
            <div className={`
                absolute top-0 right-0 h-full w-full max-w-[400px] bg-white dark:bg-background border-l shadow-2xl z-50 transition-transform duration-300 ease-in-out transform
                ${showProfile ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{selectedMsg.type === 'group' ? 'Group Info' : 'User Profile'}</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowProfile(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar h-0" data-lenis-prevent>
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="relative mb-4">
                                <Avatar className="h-24 w-24 border-4 border-blue-50 dark:border-blue-900/20">
                                    <AvatarImage src={selectedMsg.type === 'group' ? (selectedMsg.iconUrl || '') : (selectedMsg.avatar || selectedMsg.participantInfo?.avatarUrl || '')} />
                                    <AvatarFallback className="text-2xl">
                                        {selectedMsg.type === 'group'
                                            ? selectedMsg.title?.charAt(0) || 'G'
                                            : selectedMsg.participantInfo?.name?.charAt(0) || selectedMsg.title?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                {selectedMsg.type === 'group' && (
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-lg"
                                        onClick={() => {
                                            setGroupForm({
                                                name: selectedMsg.title || '',
                                                description: selectedMsg.description || '',
                                                icon: null
                                            })
                                            setShowEditGroupDialog(true)
                                        }}
                                    >
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <h2 className="text-xl font-bold mb-1">{selectedMsg.type === 'group' ? selectedMsg.title : (selectedMsg.participantInfo?.name || selectedMsg.title)}</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                {selectedMsg.type === 'group'
                                    ? selectedMsg.description || 'No description provided'
                                    : selectedMsg.participantInfo?.email || 'No email provided'}
                            </p>

                            <div className="w-full space-y-4 text-left">
                                {selectedMsg.type === 'group' ? (
                                    <>
                                        <div className="w-full pt-2">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-left">Members</h4>
                                            {/* We can fetch real participants later, for now we will show a placeholder or mock */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">Members</h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-xs text-blue-600 hover:text-blue-700 p-0"
                                                        onClick={() => setShowAddMemberDialog(true)}
                                                    >
                                                        Add Member
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {selectedMsg.participants?.map((participant) => (
                                                        <div key={participant.id} className="flex items-center justify-between group/member p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="relative">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={participant.avatarUrl} />
                                                                        <AvatarFallback>{participant.name?.charAt(0) || 'U'}</AvatarFallback>
                                                                    </Avatar>
                                                                    {/* Mock Admin Badge logic: assume first participant or specific ID is admin for now, or pass creatorId */}
                                                                    {/* {participant.id === selectedMsg.creatorId && ( */}
                                                                    {/* For MVP demo without creatorId flowing yet, let's just make the first one admin/creator or leave badge for specific user if known logic exists */}
                                                                    {/* Going to just show a badge if it's the current user for demo purposes or if we can identify the admin */}
                                                                </div>
                                                                <div className="text-left min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <p className="text-sm font-medium truncate">{participant.name}</p>
                                                                        {/* Placeholder for Admin Badge - would need creatorId from DB */}
                                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                                            Member
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-gray-400 opacity-0 group-hover/member:opacity-100 hover:text-red-500 hover:bg-red-50"
                                                                title="Remove member"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    {(!selectedMsg.participants || selectedMsg.participants.length === 0) && (
                                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-sm text-gray-500">
                                                            <p>No members found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
                                            <p className="text-sm">Team member at the agency. Always ready to collaborate and help out with projects.</p>
                                        </div>

                                        <div className="space-y-3 px-1">
                                            <div className="flex items-center gap-3 text-xs">
                                                <Mail className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="text-gray-600 dark:text-gray-300">{selectedMsg.participantInfo?.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs">
                                                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="capitalize text-gray-600 dark:text-gray-300">{activeTab || 'Team Member'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs">
                                                <MapPin className="h-3.5 w-3.5 text-blue-500" />
                                                <span className="text-gray-600 dark:text-gray-300">San Francisco, CA</span>
                                            </div>
                                        </div>

                                        {/* Scheduling & Booking Section */}
                                        <div className="pt-6 border-t w-full">
                                            <div className="flex items-center justify-between mb-3 text-left">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <CalendarClock className="h-3 w-3" />
                                                    Booking & Scheduling
                                                </h4>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 hover:bg-blue-50 text-blue-500"
                                                    onClick={() => setShowScheduleDialog(true)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="space-y-2">
                                                {scheduledMeetings.map((meeting) => (
                                                    <div
                                                        key={meeting.id}
                                                        className="p-2 gap-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-xl flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer group"
                                                        onClick={() => {
                                                            setEditingMeetingId(meeting.id)
                                                            // Convert stored ISO string back to YYYY-MM-DD for input
                                                            const start = new Date(meeting.startTime)
                                                            const dateStr = start.toISOString().split('T')[0]
                                                            const timeStr = start.toTimeString().slice(0, 5) // HH:MM

                                                            setMeetingForm({
                                                                title: meeting.title,
                                                                description: meeting.description || '',
                                                                location: meeting.location || '',
                                                                date: dateStr,
                                                                time: timeStr,
                                                                label: meeting.color || '#3b82f6',
                                                                attachment: null, // Attachments might need separate handling to show existing
                                                                notifications: meeting.notifications || []
                                                            })
                                                            setShowScheduleDialog(true)
                                                        }}
                                                    >
                                                        <div
                                                            className="h-8 w-8 rounded-lg flex flex-col items-center justify-center text-white shrink-0 shadow-sm"
                                                            style={{ backgroundColor: meeting.color || '#3b82f6' }}
                                                        >
                                                            <span className="text-[8px] font-bold leading-none">{meeting.date.split(' ')[0]}</span>
                                                            <span className="text-xs font-bold leading-none">{meeting.date.split(' ')[1]}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 truncate">{meeting.title}</p>
                                                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                <Clock className="h-2.5 w-2.5" /> {meeting.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <Button
                                                    variant="outline"
                                                    className="w-full text-[10px] h-8 font-bold border-dashed border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 rounded-lg"
                                                    onClick={() => setShowScheduleDialog(true)}
                                                >
                                                    Schedule New Meeting
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Automations Section */}
                                        <div className="pt-6 border-t w-full text-left">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                                                <Zap className="h-3 w-3" />
                                                Active Automations
                                            </h4>
                                            <div className="space-y-2">
                                                {[
                                                    { name: 'Auto-Follow up', icon: BellRing, color: 'text-emerald-500' },
                                                    { name: 'Status Monitor', icon: UserCheck, color: 'text-gray-400' }
                                                ].map((auto, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors group">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 ${activeAutomations.has(auto.name) ? auto.color : 'text-gray-300'}`}>
                                                                <auto.icon className="h-3 w-3" />
                                                            </div>
                                                            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{auto.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => toggleAutomation(auto.name)}
                                                                className={`h-4 w-7 rounded-full transition-colors relative ${activeAutomations.has(auto.name) ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                            >
                                                                <div className={`absolute top-0.5 h-3 w-3 bg-white rounded-full transition-all ${activeAutomations.has(auto.name) ? 'left-3.5' : 'left-0.5'}`} />
                                                            </button>
                                                            <Settings className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quick Resources */}
                                        <div className="pt-6 border-t w-full text-left">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Link className="h-3 w-3" />
                                                    Shared Resources ({sharedResources.length})
                                                </h4>
                                                {sharedResources.length > 4 && (
                                                    <Button
                                                        variant="ghost"
                                                        className="h-5 px-1.5 text-[9px] font-bold text-blue-500 hover:bg-blue-50"
                                                        onClick={() => setShowResourcesDialog(true)}
                                                    >
                                                        View All
                                                    </Button>
                                                )}
                                            </div>
                                            {sharedResources.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-2">
                                                    {sharedResources.slice(0, 4).map((res, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer block group"
                                                        >
                                                            <div className={`h-6 w-6 rounded flex items-center justify-center mb-1.5 ${res.type.startsWith('image') ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                                                                res.type.startsWith('video') ? 'bg-rose-100 dark:bg-rose-900/30' :
                                                                    'bg-blue-100 dark:bg-blue-900/30'
                                                                }`}>
                                                                {res.type.startsWith('image') ? <ImageIcon className="h-3 w-3 text-emerald-600" /> :
                                                                    res.type.startsWith('video') ? <Video className="h-3 w-3 text-rose-600" /> :
                                                                        <Paperclip className="h-3 w-3 text-blue-600" />}
                                                            </div>
                                                            <p className="text-[10px] font-bold truncate group-hover:text-blue-600 transition-colors">{res.name}</p>
                                                            <p className="text-[8px] text-gray-400 uppercase truncate">
                                                                {new Date(res.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </a>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800 text-center">
                                                    <p className="text-[9px] text-gray-400 font-medium">No files shared yet in this chat</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="w-full mt-8 pt-6 border-t">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-left">
                                    {selectedMsg.type === 'group' ? 'Group Settings' : 'Management Actions'}
                                </h4>
                                {selectedMsg.type === 'group' ? (
                                    <div className="space-y-2">
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 flex items-center justify-start gap-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10"
                                            onClick={() => {
                                                setGroupForm({
                                                    name: selectedMsg.title || '',
                                                    description: selectedMsg.description || '',
                                                    icon: null
                                                })
                                                setShowEditGroupDialog(true)
                                            }}
                                        >
                                            <FileText className="h-4 w-4 text-blue-500" />
                                            <span className="text-xs font-medium">Edit Group Details</span>
                                        </Button>
                                        <Button variant="outline" className="w-full h-12 flex items-center justify-start gap-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <BellRing className="h-4 w-4 text-gray-500" />
                                            <span className="text-xs font-medium">Manage Notifications</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 flex items-center justify-start gap-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/10 text-orange-600"
                                            onClick={handleLeaveGroup}
                                        >
                                            <Archive className="h-4 w-4" />
                                            <span className="text-xs font-medium">Leave Group</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 flex items-center justify-start gap-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600"
                                            onClick={handleDeleteGroup}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="text-xs font-medium">Delete Group</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="w-full h-14 flex flex-col gap-1 rounded-xl">
                                            <Archive className="h-3.5 w-3.5 text-gray-500" />
                                            <span className="text-[9px] font-bold uppercase tracking-tighter">Archive Chat</span>
                                        </Button>
                                        <Button variant="outline" className="w-full h-14 flex flex-col gap-1 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="text-[9px] font-bold uppercase tracking-tighter">Block Account</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scheduling Dialog */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CalendarClock className="h-5 w-5 text-blue-500" />
                            Schedule Meeting
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Propose a new meeting time for {selectedMsg.type === 'group' ? selectedMsg.title : selectedMsg.participantInfo?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Meeting Title</label>
                                <Input
                                    placeholder="e.g. Weekly Update"
                                    className="h-9 text-sm"
                                    value={meetingForm.title}
                                    onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                                <Textarea
                                    placeholder="Agenda, meeting notes, or topics to discuss..."
                                    className="min-h-[80px] text-sm resize-none"
                                    value={meetingForm.description}
                                    onChange={(e) => setMeetingForm(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Location / Link</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Google Meet Link or Physical Address"
                                        className="pl-9 h-9 text-sm"
                                        value={meetingForm.location}
                                        onChange={(e) => setMeetingForm(prev => ({ ...prev, location: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Date</label>
                                    <Input
                                        type="date"
                                        className="h-9 text-sm"
                                        value={meetingForm.date}
                                        onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Time</label>
                                    <Input
                                        type="time"
                                        className="h-9 text-sm"
                                        value={meetingForm.time}
                                        onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <Palette className="h-3 w-3" /> Label Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { name: 'Tomato', color: '#ef4444' },
                                    { name: 'Tangerine', color: '#f97316' },
                                    { name: 'Banana', color: '#eab308' },
                                    { name: 'Basil', color: '#22c55e' },
                                    { name: 'Sage', color: '#10b981' },
                                    { name: 'Peacock', color: '#06b6d4' },
                                    { name: 'Blueberry', color: '#3b82f6' },
                                    { name: 'Lavender', color: '#8b5cf6' },
                                    { name: 'Grape', color: '#d946ef' },
                                    { name: 'Flamingo', color: '#f43f5e' },
                                    { name: 'Graphite', color: '#4b5563' },
                                    { name: 'Default', color: '#3b82f6' },
                                ].map((c) => (
                                    <button
                                        key={c.name}
                                        onClick={() => setMeetingForm(prev => ({ ...prev, label: c.color }))}
                                        className={`h-6 w-6 rounded-full border-2 transition-all ${meetingForm.label === c.color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-110'}`}
                                        style={{ backgroundColor: c.color }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <Paperclip className="h-3 w-3" /> Attachments
                            </label>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => document.getElementById('meeting-attachment')?.click()}
                                >
                                    <span className="mr-2">📎</span>
                                    {meetingForm.attachment ? 'Change File' : 'Upload File'}
                                </Button>
                                <input
                                    id="meeting-attachment"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setMeetingForm(prev => ({ ...prev, attachment: e.target.files![0] }))
                                        }
                                    }}
                                />
                                {meetingForm.attachment && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-600 dark:text-blue-400">
                                        <span className="truncate max-w-[100px]">{meetingForm.attachment.name}</span>
                                        <button onClick={() => setMeetingForm(prev => ({ ...prev, attachment: null }))}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Notifications */}
                            <div className="grid gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                    <BellRing className="h-3 w-3" /> Notifications
                                </label>
                                <div className="space-y-2">
                                    {meetingForm.notifications.map((note, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="flex-1 h-9 px-3 rounded-md border border-input bg-transparent text-sm flex items-center">
                                                {note}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => {
                                                    const newNotes = [...meetingForm.notifications]
                                                    newNotes.splice(index, 1)
                                                    setMeetingForm(prev => ({ ...prev, notifications: newNotes }))
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2">
                                        <select
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    setMeetingForm(prev => ({
                                                        ...prev,
                                                        notifications: [...prev.notifications, e.target.value]
                                                    }))
                                                    e.target.value = ''
                                                }
                                            }}
                                        >
                                            <option value="">Add a notification...</option>
                                            <option value="10 minutes before">10 minutes before</option>
                                            <option value="30 minutes before">30 minutes before</option>
                                            <option value="1 hour before">1 hour before</option>
                                            <option value="1 day before">1 day before</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowScheduleDialog(false)} className="text-xs h-9">Cancel</Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-6"
                            onClick={handleScheduleMeeting}
                        >
                            Send Invite
                        </Button>
                    </div>
                </DialogContent>
            </Dialog >

            {/* View All Resources Dialog */}
            < Dialog open={showResourcesDialog} onOpenChange={setShowResourcesDialog} >
                <DialogContent className="max-w-7xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b space-y-4">
                        <DialogTitle className="flex items-center gap-2">
                            <Link className="h-5 w-5 text-blue-500" />
                            All Shared Resources
                        </DialogTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search files..."
                                className="pl-9 h-10 bg-gray-50 dark:bg-zinc-900/50"
                                value={resourceSearch}
                                onChange={(e) => setResourceSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
                            {['All', 'Images', 'Videos', 'Documents', 'Others'].map((cat) => {
                                const key = cat.toLowerCase() as keyof typeof categorizedResources
                                const count = cat === 'All' ? sharedResources.length : (categorizedResources[key]?.length || 0)
                                if (count === 0 && cat !== 'All') return null
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => {
                                            if (cat === 'All') {
                                                document.querySelector('.custom-scrollbar')?.scrollTo({ top: 0, behavior: 'smooth' })
                                            } else {
                                                document.getElementById(`res-cat-${cat}`)?.scrollIntoView({ behavior: 'smooth' })
                                            }
                                        }}
                                        className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold whitespace-nowrap transition-colors"
                                    >
                                        {cat} <span className="text-gray-500 ml-1">{count}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar" data-lenis-prevent>
                        <div className="space-y-8">
                            {/* Images Section */}
                            {categorizedResources.images.length > 0 && (
                                <section id="res-cat-Images" className="scroll-mt-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Images ({categorizedResources.images.length})</h4>
                                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                        {categorizedResources.images.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden border bg-gray-100 dark:bg-gray-800">
                                                <img src={res.url} alt={res.name} className="object-cover w-full h-full transition-transform group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                                    <p className="text-[10px] text-white font-medium text-center truncate w-full">{res.name}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}
                            {/* Videos Section */}
                            {categorizedResources.videos.length > 0 && (
                                <section id="res-cat-Videos" className="scroll-mt-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Videos ({categorizedResources.videos.length})</h4>
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {categorizedResources.videos.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="group relative aspect-video rounded-xl overflow-hidden border bg-black/5">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Video className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <video src={res.url} className="object-cover w-full h-full" muted />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                                    <p className="text-[10px] text-white font-medium text-center truncate w-full">{res.name}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Documents Section */}
                            {categorizedResources.documents.length > 0 && (
                                <section id="res-cat-Documents" className="scroll-mt-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Documents ({categorizedResources.documents.length})</h4>
                                    <div className="space-y-2">
                                        {categorizedResources.documents.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{res.name}</p>
                                                    <p className="text-xs text-gray-500 uppercase">{new Date(res.createdAt).toLocaleDateString()} • DOCUMENT</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Others Section */}
                            {categorizedResources.others.length > 0 && (
                                <section id="res-cat-Others" className="scroll-mt-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Other Files ({categorizedResources.others.length})</h4>
                                    <div className="space-y-2">
                                        {categorizedResources.others.map((res, i) => (
                                            <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                                <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                                    <Paperclip className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{res.name}</p>
                                                    <p className="text-xs text-gray-500 uppercase">{new Date(res.createdAt).toLocaleDateString()} • FILE</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t bg-gray-50 dark:bg-zinc-900 flex justify-end">
                        <Button onClick={() => setShowResourcesDialog(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog >

            {/* Edit Group Dialog */}
            <Dialog open={showEditGroupDialog} onOpenChange={setShowEditGroupDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-500" />
                            Edit Group Details
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Update your group's name, description, and icon.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Group Name</label>
                            <Input
                                placeholder="e.g. Project Team"
                                className="h-9 text-sm"
                                value={groupForm.name}
                                onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                            <Textarea
                                placeholder="What is this group about?"
                                className="min-h-[80px] text-sm resize-none"
                                value={groupForm.description}
                                onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Group Icon</label>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={selectedMsg.iconUrl || ''} />
                                    <AvatarFallback className="text-xl">
                                        {groupForm.name?.charAt(0) || selectedMsg.title?.charAt(0) || 'G'}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => document.getElementById('group-icon-upload')?.click()}
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    {groupForm.icon ? 'Change Icon' : 'Upload Icon'}
                                </Button>
                                <input
                                    id="group-icon-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setGroupForm(prev => ({ ...prev, icon: e.target.files![0] }))
                                        }
                                    }}
                                />
                            </div>
                            {groupForm.icon && (
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Selected: {groupForm.icon.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowEditGroupDialog(false)} className="text-xs h-9">
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 px-6"
                            onClick={handleUpdateGroup}
                        >
                            Save Changes
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Member Dialog */}
            <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-blue-500" />
                            Add Members to Group
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Search and add new members to {selectedMsg.title}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 h-10"
                                value={memberSearchQuery}
                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-2">
                                {/* Mock users - replace with actual search results */}
                                {[
                                    { id: '1', name: 'John Doe', email: 'john@example.com', avatar: '' },
                                    { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
                                    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
                                ].filter(user =>
                                    user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
                                    user.email.toLowerCase().includes(memberSearchQuery.toLowerCase())
                                ).map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-xs"
                                            onClick={() => handleAddMember(user.id, user.name)}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="ghost" onClick={() => setShowAddMemberDialog(false)} className="text-xs h-9">
                            Done
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card >
    )
}

export default ChatWindow
