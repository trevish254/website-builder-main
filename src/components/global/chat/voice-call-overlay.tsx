'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, User, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useConnectivity } from '@/lib/hooks/use-connectivity'
import { WifiOff, AlertTriangle } from 'lucide-react'

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'active' | 'ended'

interface VoiceCallOverlayProps {
    status: CallStatus
    receiverName: string
    receiverAvatar?: string
    duration?: number
    isMuted: boolean
    onMuteToggle: () => void
    onHangUp: () => void
    onAccept?: () => void
    onDecline?: () => void
}

const VoiceCallOverlay = ({
    status,
    receiverName,
    receiverAvatar,
    duration = 0,
    isMuted,
    onMuteToggle,
    onHangUp,
    onAccept,
    onDecline
}: VoiceCallOverlayProps) => {
    const [isMinimized, setIsMinimized] = useState(false)
    const { quality } = useConnectivity()

    const isConnectionPoor = quality === 'poor' || quality === 'offline'

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (status === 'idle') return null

    if (isMinimized) {
        return (
            <Card className="fixed bottom-6 right-6 w-64 p-3 shadow-2xl z-[100] bg-zinc-900 border-zinc-800 text-white animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={receiverAvatar} />
                            <AvatarFallback>{receiverName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{receiverName}</p>
                            <p className="text-[10px] text-zinc-400 capitalize">{status === 'active' ? formatDuration(duration) : status}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-400 hover:text-white"
                            onClick={() => setIsMinimized(false)}
                        >
                            <Maximize2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7 rounded-full"
                            onClick={onHangUp}
                        >
                            <PhoneOff className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md overflow-hidden bg-zinc-950 border-zinc-800 text-white shadow-2xl relative">
                {/* Header Controls */}
                <div className="absolute top-4 right-4 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white"
                        onClick={() => setIsMinimized(true)}
                    >
                        <Minimize2 className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-8 flex flex-col items-center text-center">
                    {/* Pulsing Avatar for calling/ringing */}
                    <div className="relative mb-8">
                        {(status === 'calling' || status === 'ringing') && (
                            <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                        )}
                        <Avatar className="h-32 w-32 border-4 border-zinc-800 shadow-xl relative z-10">
                            <AvatarImage src={receiverAvatar} />
                            <AvatarFallback className="text-4xl bg-zinc-800">{receiverName.charAt(0)}</AvatarFallback>
                        </Avatar>

                        {isConnectionPoor && (
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg border border-rose-400">
                                {quality === 'offline' ? <WifiOff className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3 animate-pulse" />}
                                <span>POOR CONNECTION</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold mb-2">{receiverName}</h2>
                    <p className={cn(
                        "text-sm font-medium uppercase tracking-widest mb-8",
                        status === 'active' ? "text-green-500" : "text-zinc-400"
                    )}>
                        {status === 'active' ? formatDuration(duration) : status === 'calling' ? 'Calling...' : status === 'ringing' ? 'Incoming Call...' : status}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-6">
                        {status === 'ringing' ? (
                            <>
                                <Button
                                    onClick={onDecline}
                                    variant="destructive"
                                    size="icon"
                                    className="h-16 w-16 rounded-full shadow-lg shadow-red-500/20 hover:scale-110 transition-transform"
                                >
                                    <PhoneOff className="h-7 w-7" />
                                </Button>
                                <Button
                                    onClick={onAccept}
                                    className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 hover:scale-110 transition-transform"
                                    size="icon"
                                >
                                    <Phone className="h-7 w-7 text-white" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={onMuteToggle}
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-14 w-14 rounded-full border border-zinc-800 transition-all",
                                        isMuted ? "bg-zinc-800 text-red-500" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    )}
                                >
                                    {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                                </Button>

                                <Button
                                    onClick={onHangUp}
                                    variant="destructive"
                                    size="icon"
                                    className="h-16 w-16 rounded-full shadow-lg shadow-red-500/20 hover:scale-110 transition-transform"
                                >
                                    <PhoneOff className="h-7 w-7" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-14 w-14 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    <Volume2 className="h-6 w-6" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Decor */}
                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />
            </Card>

            {/* Hidden audio element for the actual stream */}
            <audio id="remote-audio" autoPlay className="hidden" />
        </div>
    )
}

export default VoiceCallOverlay
