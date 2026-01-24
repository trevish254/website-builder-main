'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
    PhoneOff,
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    Maximize2,
    Minimize2,
    MoreHorizontal,
    Users,
    Monitor,
    Smile,
    MessageSquare,
    Settings,
    LayoutGrid,
    Tally3,
    Hand,
    UserPlus
} from 'lucide-react'
import InviteToCallModal from './invite-to-call-modal'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const useAudioVolume = (stream?: MediaStream | null, isMuted?: boolean) => {
    const [volume, setVolume] = useState(0)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)

    useEffect(() => {
        if (!stream || isMuted) {
            setVolume(0)
            return
        }

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const analyser = audioContext.createAnalyser()
            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)
            analyser.fftSize = 256

            analyserRef.current = analyser
            audioContextRef.current = audioContext

            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            let animationFrame: number

            const updateVolume = () => {
                if (!analyserRef.current) return
                analyserRef.current.getByteFrequencyData(dataArray)
                let sum = 0
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i]
                }
                setVolume(sum / bufferLength)
                animationFrame = requestAnimationFrame(updateVolume)
            }

            updateVolume()

            return () => {
                cancelAnimationFrame(animationFrame)
                if (audioContext.state !== 'closed') {
                    audioContext.close()
                }
            }
        } catch (err) {
            console.error('Audio visualizer error:', err)
            return
        }
    }, [stream, isMuted])

    return volume
}

const AudioVisualizer = ({ volume, isMuted }: { volume: number, isMuted?: boolean }) => {
    return (
        <div className="flex items-center gap-0.5 h-4 px-2">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    animate={{
                        height: isMuted ? 2 : Math.max(2, (volume / 255) * 16 * (1 + Math.random() * 0.5))
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={cn(
                        "w-0.5 rounded-full",
                        volume > 20 ? "bg-rose-500" : "bg-zinc-600"
                    )}
                />
            ))}
        </div>
    )
}

interface Participant {
    id: string
    name: string
    avatarUrl?: string
    isLocal?: boolean
    stream?: MediaStream | null
    isMuted?: boolean
    isVideoOff?: boolean
    isSpeaking?: boolean
    isHandRaised?: boolean
}

interface Message {
    id: string
    senderId: string
    senderName: string
    senderAvatar?: string
    content: string
    timestamp: number
}

interface VideoRoomOverlayProps {
    roomTitle: string
    roomId: string
    agencyId: string
    participants: Participant[]
    onHangUp: () => void
    onToggleMic: () => void
    onToggleVideo: () => void
    onToggleScreenShare: () => void
    onToggleHandRaise: () => void
    isMicMuted: boolean
    isVideoOff: boolean
    isScreenSharing: boolean
    isHandRaised: boolean
    messages: Message[]
    onSendMessage: (content: string) => void
}

const VideoRoomOverlay = ({
    roomTitle,
    roomId,
    agencyId,
    participants,
    onHangUp,
    onToggleMic,
    onToggleVideo,
    onToggleScreenShare,
    onToggleHandRaise,
    isMicMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised: isHandRaisedLocal,
    messages,
    onSendMessage
}: VideoRoomOverlayProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [layout, setLayout] = useState<'grid' | 'focus'>('grid')
    const [messageInput, setMessageInput] = useState('')
    const [visibleToasts, setVisibleToasts] = useState<Message[]>([])
    const lastMessageRef = useRef<string | null>(null)
    const [focusedParticipantId, setFocusedParticipantId] = useState<string | null>(
        participants.find(p => !p.isLocal)?.id || participants[0]?.id || null
    )

    const activeParticipants = participants.filter(p => p.stream || p.isLocal)

    const handleParticipantClick = (id: string) => {
        if (layout === 'grid') {
            setFocusedParticipantId(id)
            setLayout('focus')
        } else {
            setFocusedParticipantId(id)
        }
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageInput.trim()) return
        onSendMessage(messageInput)
        setMessageInput('')
    }

    // Handle Overlay Notifications for new messages
    useEffect(() => {
        if (messages.length === 0) return
        const latestMessage = messages[messages.length - 1]

        // Prevent showing our own messages as toasts or duplicates
        if (latestMessage.senderId === participants.find(p => p.isLocal)?.id) return
        if (latestMessage.id === lastMessageRef.current) return

        lastMessageRef.current = latestMessage.id

        // Only show if chat window is closed
        if (!isSidebarOpen) {
            setVisibleToasts(prev => [...prev, latestMessage])
            setTimeout(() => {
                setVisibleToasts(prev => prev.filter(m => m.id !== latestMessage.id))
            }, 4000)
        }
    }, [messages, isSidebarOpen, participants])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <VideoIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white font-bold tracking-tight">{roomTitle}</h2>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs text-zinc-400 font-medium">Live • {participants.length} Members</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {agencyId && (
                            <InviteToCallModal
                                agencyId={agencyId}
                                roomId={roomId}
                                roomTitle={roomTitle}
                                currentParticipants={participants.map(p => p.id)}
                            />
                        )}
                        <Badge variant="outline" className="bg-black/40 text-rose-400 border-rose-500/30 font-mono py-1">
                            Live Session
                        </Badge>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Video Area */}
                <div className="flex-1 p-6 pt-24 pb-32">
                    <div className={cn(
                        "h-full w-full gap-4 transition-all duration-500",
                        layout === 'grid'
                            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 content-center items-center justify-center auto-rows-fr"
                            : "flex flex-col lg:flex-row h-full"
                    )}>
                        {activeParticipants.map((participant) => (
                            <ParticipantView
                                key={participant.id}
                                participant={participant}
                                layout={layout}
                                focusedParticipantId={focusedParticipantId}
                                isMicMuted={isMicMuted}
                                isVideoOff={isVideoOff}
                                isScreenSharing={isScreenSharing}
                                onParticipantClick={handleParticipantClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-4 rounded-[32px] shadow-2xl">
                    <div className="flex items-center gap-2 border-r border-white/10 pr-4 mr-2">
                        <Button
                            onClick={() => setLayout(l => l === 'grid' ? 'focus' : 'grid')}
                            variant="ghost"
                            size="icon"
                            className="bg-white/5 hover:bg-white/10 text-white rounded-2xl h-12 w-12"
                        >
                            <LayoutGrid className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={onToggleScreenShare}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-2xl h-12 w-12 transition-all duration-300",
                                isScreenSharing ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "bg-white/5 hover:bg-white/10 text-white"
                            )}
                        >
                            <Monitor className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={onToggleMic}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-2xl h-14 w-14 transition-all duration-300",
                                isMicMuted ? "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/40" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                            )}
                        >
                            {isMicMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
                        </Button>

                        <Button
                            onClick={onToggleVideo}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-2xl h-14 w-14 transition-all duration-300",
                                isVideoOff ? "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/40" : "bg-zinc-800 hover:bg-zinc-700 text-white"
                            )}
                        >
                            {isVideoOff ? <VideoOff className="h-6 w-6 text-white" /> : <VideoIcon className="h-6 w-6 text-white" />}
                        </Button>

                        <Button
                            onClick={onHangUp}
                            variant="destructive"
                            size="icon"
                            className="bg-rose-600 hover:bg-rose-700 rounded-2xl h-14 w-14 shadow-lg shadow-rose-600/40"
                        >
                            <PhoneOff className="h-6 w-6 text-white" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4 ml-2">
                        <Button
                            onClick={onToggleHandRaise}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-2xl h-12 w-12 transition-all duration-300",
                                isHandRaisedLocal ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/40" : "bg-white/5 hover:bg-white/10 text-white"
                            )}
                        >
                            <Hand className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "bg-white/5 hover:bg-white/10 text-white rounded-2xl h-12 w-12",
                                isSidebarOpen && "bg-rose-500 hover:bg-rose-500"
                            )}
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Floating Draggable Chat Window */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            drag
                            dragMomentum={false}
                            dragConstraints={{ left: -1000, right: 0, top: 0, bottom: 500 }}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-32 right-8 w-80 h-[480px] bg-black/40 backdrop-blur-3xl border border-white/10 z-[110] flex flex-col rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            {/* Window Header / Drag Handle */}
                            <div className="flex items-center justify-between p-5 border-b border-white/5 cursor-grab active:cursor-grabbing">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                                    <h3 className="text-white font-bold text-sm tracking-tight uppercase">Chat Room</h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-white/40 hover:text-white hover:bg-white/5 rounded-full h-8 w-8"
                                >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col pt-2">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12 px-6 flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                            <MessageSquare className="h-8 w-8 text-white/20" />
                                        </div>
                                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                                            Messages are end-to-end encrypted and only visible during this session.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className={cn(
                                            "flex flex-col gap-1 max-w-[85%]",
                                            msg.senderId === participants.find(p => p.isLocal)?.id ? "ml-auto items-end" : "items-start"
                                        )}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-zinc-500">{msg.senderName}</span>
                                                <span className="text-[9px] text-zinc-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={cn(
                                                "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed",
                                                msg.senderId === participants.find(p => p.isLocal)?.id
                                                    ? "bg-rose-500 text-white rounded-tr-none shadow-lg shadow-rose-500/20"
                                                    : "bg-white/10 text-white rounded-tl-none border border-white/5"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Message Input Area */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-xl">
                                <div className="bg-white/5 rounded-2xl flex items-center gap-2 p-1 border border-white/5 focus-within:border-rose-500/30 transition-all duration-300">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type message..."
                                        className="bg-transparent border-none outline-none flex-1 px-4 py-2 text-xs text-white placeholder:text-zinc-600"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-8 w-8 rounded-xl bg-rose-500 hover:bg-rose-600 transition-all active:scale-95"
                                    >
                                        <Tally3 className="h-3 w-3 rotate-90" />
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Overlay Toast Notifications for Messages */}
                <div className="fixed bottom-32 right-8 z-[120] flex flex-col gap-3 pointer-events-none items-end">
                    <AnimatePresence>
                        {visibleToasts.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center gap-3 max-w-[280px]"
                            >
                                <Avatar className="h-8 w-8 ring-1 ring-white/10 shadow-lg">
                                    <AvatarImage src={msg.senderAvatar} />
                                    <AvatarFallback className="text-[10px] bg-zinc-800 text-zinc-400">
                                        {msg.senderName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-[10px] font-bold text-rose-400 mb-0.5">{msg.senderName}</p>
                                    <p className="text-[12px] text-white/90 truncate pr-2">{msg.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

const ParticipantView = ({
    participant,
    layout,
    focusedParticipantId,
    isMicMuted: localMicMuted,
    isVideoOff: localVideoOff,
    isScreenSharing,
    onParticipantClick
}: {
    participant: Participant,
    layout: 'grid' | 'focus',
    focusedParticipantId: string | null,
    isMicMuted: boolean,
    isVideoOff: boolean,
    isScreenSharing: boolean,
    onParticipantClick: (id: string) => void
}) => {
    const isMuted = participant.isLocal ? localMicMuted : participant.isMuted
    const isVideoOff = participant.isLocal ? localVideoOff : participant.isVideoOff
    const volume = useAudioVolume(participant.stream, isMuted)
    const isSpeaking = volume > 25

    return (
        <motion.div
            layout
            onClick={() => onParticipantClick(participant.id)}
            className={cn(
                "relative rounded-3xl overflow-hidden bg-zinc-900 group shadow-2xl ring-1 ring-white/10 transition-all duration-500 cursor-pointer",
                layout === 'focus'
                    ? participant.id === focusedParticipantId
                        ? "absolute inset-0 rounded-none z-0 ring-0"
                        : "w-48 h-32 sm:w-64 sm:h-48 absolute bottom-36 right-8 z-20 hover:scale-105"
                    : "flex-1 min-h-[180px] hover:ring-rose-500/50",
                isSpeaking && !isVideoOff && "ring-2 ring-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]",
                participant.isHandRaised && "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            )}
        >
            {/* Always keep VideoView mounted if stream exists for "Instant-On" recovery */}
            {(participant.stream || (participant.isLocal && !isScreenSharing)) && (
                <VideoView
                    stream={participant.stream}
                    isLocal={participant.isLocal}
                    isVideoOff={isVideoOff}
                    isScreenSharing={participant.isLocal ? isScreenSharing : false}
                    participantName={participant.name}
                    participantAvatar={participant.avatarUrl}
                />
            )}

            {/* Avatar Layer (Shown over video when video is off) */}
            {isVideoOff && !isScreenSharing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 overflow-hidden text-center z-10 transition-all duration-500">
                    <div className="absolute inset-0 opacity-20 blur-3xl scale-150">
                        <div className="h-full w-full bg-gradient-to-br from-rose-500/30 to-purple-600/30" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="relative">
                            <motion.div
                                initial={false}
                                animate={isSpeaking ? {
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.5, 0.2]
                                } : { scale: 1, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute -inset-8 bg-rose-500 rounded-full blur-2xl"
                            />
                            <Avatar className={cn(
                                "h-24 w-24 sm:h-32 sm:w-32 ring-4 shadow-2xl bg-zinc-950 transition-all duration-300",
                                isSpeaking ? "ring-rose-500 scale-105" : "ring-zinc-800"
                            )}>
                                <AvatarImage src={participant.avatarUrl} />
                                <AvatarFallback className="text-4xl bg-zinc-950 text-zinc-500 uppercase font-bold">
                                    {participant.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Camera Is Off</p>
                            <h4 className="text-white font-bold text-base">{participant.name}</h4>
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-zinc-800/80 rounded-full border border-white/10 shadow-lg z-20 backdrop-blur-md">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                            {participant.isHandRaised ? "Requesting Turn" : "Voice Active"}
                        </p>
                    </div>
                </div>
            )}

            {/* Participant Info Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 z-20">
                <p className="text-xs font-bold text-white tracking-wide">
                    {participant.isLocal ? "You" : participant.name}
                </p>
                <AudioVisualizer
                    volume={volume}
                    isMuted={isMuted}
                />
                {isMuted && (
                    <MicOff className="h-3 w-3 text-rose-500" />
                )}
            </div>

            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {participant.isHandRaised && (
                    <Badge variant="secondary" className="bg-blue-500 text-white border-none shadow-lg animate-bounce py-1 px-2 rounded-full">
                        <Hand className="h-3 w-3 mr-1" />
                    </Badge>
                )}
            </div>

            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {participant.isLocal && isScreenSharing && (
                    <Badge variant="secondary" className="bg-blue-500 text-white border-none shadow-lg animate-pulse py-1">
                        <Monitor className="h-3 w-3 mr-1" /> Sharing Screen
                    </Badge>
                )}
            </div>
        </motion.div>
    )
}

const VideoView = ({
    stream,
    isLocal,
    isVideoOff,
    isScreenSharing,
    participantName,
    participantAvatar
}: {
    stream?: MediaStream | null,
    isLocal?: boolean,
    isVideoOff?: boolean,
    isScreenSharing?: boolean,
    participantName: string,
    participantAvatar?: string
}) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)

    React.useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                (isLocal && !isScreenSharing) && "transform scale-x-[-1]",
                isVideoOff && !isScreenSharing ? "opacity-0" : "opacity-100"
            )}
        />
    )
}

export default VideoRoomOverlay
