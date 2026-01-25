'use client'

import React, { useEffect, useState } from 'react'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { supabase } from '@/lib/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, PhoneOff, Video, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const VideoCallInvitationListener = () => {
    const { user } = useSupabaseUser()
    const router = useRouter()
    const [incomingCall, setIncomingCall] = useState<{
        roomId: string
        roomTitle: string
        inviterName: string
    } | null>(null)

    useEffect(() => {
        if (!user?.id) return

        const channel = supabase.channel(`user-notifications:${user.id}`)

        channel.on('broadcast', { event: 'video-call-invite' }, (payload: any) => {
            console.log('Incoming video call invite:', payload)

            // Play a subtle ringtone sound
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                const playBeep = (freq: number, startTime: number) => {
                    const osc = audioContext.createOscillator()
                    const gain = audioContext.createGain()
                    osc.connect(gain)
                    gain.connect(audioContext.destination)
                    osc.frequency.value = freq
                    gain.gain.setValueAtTime(0, startTime)
                    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1)
                    gain.gain.linearRampToValueAtTime(0, startTime + 0.4)
                    osc.start(startTime)
                    osc.stop(startTime + 0.5)
                }

                // Play 3 beeps
                playBeep(660, audioContext.currentTime)
                playBeep(660, audioContext.currentTime + 0.6)
                playBeep(880, audioContext.currentTime + 1.2)
            } catch (err) {
                console.error('Error playing ringtone:', err)
            }

            setIncomingCall(payload.payload)

            // Auto-dismiss after 30 seconds if not answered
            setTimeout(() => {
                setIncomingCall(prev => (prev?.roomId === payload.payload.roomId ? null : prev))
            }, 30000)
        })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user?.id])

    const handleJoin = () => {
        if (incomingCall) {
            window.open(`/video/${incomingCall.roomId}`, '_blank')
            setIncomingCall(null)
        }
    }

    return (
        <AnimatePresence>
            {incomingCall && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4"
                >
                    <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="absolute -inset-2 bg-rose-500 rounded-full blur-lg opacity-40 animate-pulse" />
                                <Avatar className="h-12 w-12 ring-2 ring-rose-500 shadow-xl">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-400">
                                        {incomingCall.inviterName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                                    <Video className="h-2 w-2 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Incoming Call</span>
                                <h4 className="text-white font-bold leading-tight">{incomingCall.inviterName}</h4>
                                <p className="text-xs text-zinc-500 truncate max-w-[140px]">{incomingCall.roomTitle}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => setIncomingCall(null)}
                                className="h-10 w-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-white/5"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                onClick={handleJoin}
                                className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 animate-bounce"
                            >
                                <Phone className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default VideoCallInvitationListener
