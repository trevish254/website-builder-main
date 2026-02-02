'use client'
import React, { useEffect, useState } from 'react'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { createClient } from '@/lib/supabase/client'
import { AnimatePresence, motion } from 'framer-motion'
import { Users, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

const CollabInvitationListener = () => {
    const { user } = useSupabaseUser()
    const supabase = createClient()
    const router = useRouter()
    const [invitation, setInvitation] = useState<{
        docId: string
        docTitle: string
        senderName: string
        senderAvatar?: string
        url: string
    } | null>(null)

    useEffect(() => {
        if (!user?.id) return

        const channel = supabase.channel(`user-notifications:${user.id}`)

        channel.on('broadcast', { event: 'collab-invite' }, (payload: any) => {
            console.log('Incoming collab invite:', payload)
            setInvitation(payload.payload)

            // Play a subtle ringtone sound
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                const playBeep = (freq: number, startTime: number) => {
                    const osc = audioContext.createOscillator()
                    const gain = audioContext.createGain()
                    osc.connect(gain)
                    gain.connect(audioContext.destination)
                    osc.frequency.setValueAtTime(freq, startTime)
                    gain.gain.setValueAtTime(0, startTime)
                    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1)
                    gain.gain.linearRampToValueAtTime(0, startTime + 0.4)
                    osc.start(startTime)
                    osc.stop(startTime + 0.5)
                }

                playBeep(660, audioContext.currentTime)
                playBeep(880, audioContext.currentTime + 0.3)
            } catch (err) {
                console.error('Error playing sound:', err)
            }

            // Auto-dismiss after 30 seconds if not answered
            setTimeout(() => {
                setInvitation(prev => (prev?.docId === payload.payload.docId ? null : prev))
            }, 30000)
        })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user?.id, supabase])

    const handleAccept = () => {
        if (invitation) {
            router.push(invitation.url)
            setInvitation(null)
            toast.success('Joining collaboration session...')
        }
    }

    return (
        <AnimatePresence>
            {invitation && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50, scale: 0.9, y: 50 }}
                    className="fixed bottom-8 right-8 z-[200] w-full max-w-[340px]"
                >
                    <div className="bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-[28px] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex items-center justify-between overflow-hidden relative">
                        {/* Glow effect */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />

                        <div className="flex items-center gap-3 relative z-10 min-w-0">
                            <div className="relative flex-shrink-0">
                                <div className="absolute -inset-1 bg-primary rounded-full blur-md opacity-40 animate-pulse" />
                                <Avatar className="h-11 w-11 ring-2 ring-primary/50 shadow-xl">
                                    <AvatarImage src={invitation.senderAvatar} />
                                    <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                                        {invitation.senderName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-primary h-4 w-4 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                                    <Users className="h-2 w-2 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none mb-1">Collaboration</span>
                                <h4 className="text-white font-bold leading-tight truncate text-sm">{invitation.senderName}</h4>
                                <p className="text-[10px] text-zinc-400 truncate opacity-70 mt-0.5">Invited you to edit</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 relative z-10">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setInvitation(null)}
                                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                onClick={handleAccept}
                                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/40 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <Check className="h-5 w-5 relative z-10" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default CollabInvitationListener
