'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Archive, Trash2, MoreVertical, Paperclip, Image as ImageIcon, Smile, Send, Loader2, Phone, Video, X, Mail, MapPin, Calendar, ShieldCheck, Mic, Check } from 'lucide-react'
import MessageBubble from './message-bubble'
import { InboxItem } from './chat-sidebar'
import { useToast } from '@/components/ui/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

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
    chatParticipants = new Map()
}: ChatWindowProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
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
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

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

    // Scroll to bottom function that works with ScrollArea
    const scrollToBottom = () => {
        if (scrollRef.current) {
            // ScrollArea wraps content in a viewport div, we need to find it
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight
            }
        }
    }

    // Detect if user has scrolled up
    useEffect(() => {
        if (!scrollRef.current) return

        const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
        if (!viewport) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = viewport
            // Show button if user is more than 100px from bottom
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
            setShowScrollButton(!isNearBottom)
        }

        viewport.addEventListener('scroll', handleScroll)
        return () => viewport.removeEventListener('scroll', handleScroll)
    }, [scrollRef.current, selectedMsg])

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        // Use setTimeout to ensure DOM has fully updated
        const timer = setTimeout(() => {
            scrollToBottom()
        }, 50)
        return () => clearTimeout(timer)
    }, [chatMessages, typingUsers.size > 0])

    // Scroll to bottom immediately when conversation is selected
    useEffect(() => {
        if (selectedMsg) {
            // Immediate scroll
            scrollToBottom()
            // Also scroll after a delay to catch late-loading messages
            const timer = setTimeout(() => {
                scrollToBottom()
            }, 200)
            return () => clearTimeout(timer)
        }
    }, [selectedMsg?.id])

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
            <CardHeader className="py-2.5 px-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => handleComingSoon('Voice Call')}
                        >
                            <Phone className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => handleComingSoon('Video Call')}
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
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col relative">


                <ScrollArea className="flex-1 px-6 h-full" ref={scrollRef}>
                    <div className="min-h-full flex flex-col justify-end">
                        <div className="space-y-4 py-6 pb-32">
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
                </ScrollArea>

                {/* Scroll to Bottom Button */}
                {showScrollButton && (
                    <Button
                        onClick={scrollToBottom}
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
                    <ScrollArea className="flex-1">
                        <div className="p-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4 border-4 border-blue-50 dark:border-blue-900/20">
                                <AvatarImage src={selectedMsg.type === 'group' ? (selectedMsg.iconUrl || '') : (selectedMsg.avatar || selectedMsg.participantInfo?.avatarUrl || '')} />
                                <AvatarFallback className="text-2xl">
                                    {selectedMsg.type === 'group'
                                        ? selectedMsg.title?.charAt(0) || 'G'
                                        : selectedMsg.participantInfo?.name?.charAt(0) || selectedMsg.title?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>

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
                                                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-700 p-0">
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
                                            <div className="flex items-center gap-3 text-sm">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span>{selectedMsg.participantInfo?.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <ShieldCheck className="h-4 w-4 text-gray-400" />
                                                <span className="capitalize">{activeTab || 'Team Member'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span>San Francisco, CA</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>Joined January 2024</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="w-full mt-8 pt-6 border-t">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 text-left">Actions</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                                        <Archive className="h-5 w-5" />
                                        <span className="text-xs">Archive</span>
                                    </Button>
                                    <Button variant="outline" className="w-full h-20 flex flex-col gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                                        <Trash2 className="h-5 w-5" />
                                        <span className="text-xs">Block</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </Card >
    )
}

export default ChatWindow
