'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { getConversationWithParticipantsManual } from '@/lib/supabase-queries'
import { useVideoConference } from '@/hooks/use-video-conference'
import VideoRoomOverlay from '@/components/global/chat/video-room-overlay'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const VideoRoomPage = () => {
    const params = useParams()
    const router = useRouter()
    const { user } = useSupabaseUser()
    const [roomDetails, setRoomDetails] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const roomId = params.roomId as string

    const {
        status,
        participants,
        joinRoom,
        leaveRoom,
        toggleMic,
        toggleVideo,
        isMicMuted,
        isVideoOff
    } = useVideoConference(
        user?.id || '',
        user?.name || 'Me',
        user?.avatarUrl
    )

    useEffect(() => {
        const loadRoom = async () => {
            if (!user?.id || !roomId) return

            try {
                const data = await getConversationWithParticipantsManual(roomId)
                if (!data) {
                    toast.error('Room not found')
                    router.back()
                    return
                }

                // Check if user is a participant
                const isParticipant = data.ConversationParticipant?.some(
                    (p: any) => p.userId === user.id
                )

                if (!isParticipant) {
                    toast.error('You do not have access to this room')
                    router.back()
                    return
                }

                setRoomDetails(data)

                // Automatically join the room when data is loaded
                await joinRoom(roomId)
            } catch (err) {
                console.error('Error loading video room:', err)
                toast.error('Failed to join video room')
            } finally {
                setLoading(false)
            }
        }

        loadRoom()
    }, [user?.id, roomId, joinRoom, router])

    if (loading || status === 'joining') {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
                <div className="h-16 w-16 rounded-2xl bg-rose-500/10 flex items-center justify-center animate-pulse">
                    <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold tracking-tight">Joining Video Room...</h1>
                    <p className="text-sm text-zinc-500">Preparing your camera and microphone</p>
                </div>
            </div>
        )
    }

    if (status === 'idle' && !loading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-6">
                <div className="text-center max-w-sm">
                    <h1 className="text-2xl font-bold mb-2">Room Unavailable</h1>
                    <p className="text-zinc-400 text-sm">This video room may have ended or you were disconnected.</p>
                </div>
                <button
                    onClick={() => window.close()}
                    className="px-8 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl font-bold transition-all shadow-lg shadow-rose-600/20"
                >
                    Close Tab
                </button>
            </div>
        )
    }

    return (
        <VideoRoomOverlay
            roomTitle={roomDetails?.title || 'Video Room'}
            participants={participants}
            onHangUp={() => {
                leaveRoom()
                window.close()
            }}
            onToggleMic={toggleMic}
            onToggleVideo={toggleVideo}
            isMicMuted={isMicMuted}
            isVideoOff={isVideoOff}
        />
    )
}

export default VideoRoomPage
