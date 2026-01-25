'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useConnectivity } from '@/lib/hooks/use-connectivity'

export type RoomStatus = 'idle' | 'joining' | 'active' | 'ended'

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

interface RoomSignal {
    type: 'room-join' | 'offer' | 'answer' | 'candidate' | 'room-leave' | 'status-update' | 'chat-message'
    senderId: string
    targetId?: string // Optional for broadcast
    roomId: string
    signalData?: any
    senderName?: string
    senderAvatar?: string
}

export const useVideoConference = (currentUserId: string, currentUserName?: string, currentUserAvatar?: string) => {
    const [status, setStatus] = useState<RoomStatus>('idle')
    const [roomId, setRoomId] = useState<string | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isHandRaised, setIsHandRaised] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const { quality } = useConnectivity()

    // Using refs for WebRTC objects to avoid re-render cycles
    const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map())
    const channelRef = useRef<any>(null)
    const localStreamRef = useRef<MediaStream | null>(null)

    const iceConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ]
    }

    const cleanup = useCallback(() => {
        pcsRef.current.forEach(pc => pc.close())
        pcsRef.current.clear()

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
        }
        setLocalStream(null)
        setParticipants([])
        setStatus('idle')
        setRoomId(null)
    }, [])

    const sendSignal = useCallback((type: RoomSignal['type'], id: string, targetId?: string, data?: any) => {
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'signal',
                payload: {
                    type,
                    senderId: currentUserId,
                    targetId,
                    signalData: data,
                    senderName: currentUserName,
                    senderAvatar: currentUserAvatar,
                    roomId: id
                }
            })
        }
    }, [currentUserId, currentUserName, currentUserAvatar])

    const createPeerConnection = useCallback((targetId: string, id: string, shouldOffer: boolean) => {
        if (pcsRef.current.has(targetId)) return pcsRef.current.get(targetId)!

        const pc = new RTCPeerConnection(iceConfig)

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal('candidate', id, targetId, event.candidate)
            }
        }

        pc.ontrack = (event) => {
            console.log(`Video Conference: Received remote track from ${targetId}`)
            setParticipants(prev => prev.map(p =>
                p.id === targetId ? { ...p, stream: event.streams[0] } : p
            ))
        }

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                removeParticipant(targetId)
            }
        }

        // Add local tracks
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current!)
            })
        }

        pcsRef.current.set(targetId, pc)

        if (shouldOffer) {
            pc.createOffer().then(async (offer) => {
                await pc.setLocalDescription(offer)
                sendSignal('offer', id, targetId, offer)
            })
        }

        return pc
    }, [sendSignal])

    const removeParticipant = useCallback((userId: string) => {
        if (pcsRef.current.has(userId)) {
            pcsRef.current.get(userId)?.close()
            pcsRef.current.delete(userId)
        }
        setParticipants(prev => prev.filter(p => p.id !== userId))
    }, [])

    useEffect(() => {
        if (!currentUserId || !roomId) return

        const channel = supabase.channel(`video-room:${roomId}`, {
            config: { broadcast: { self: false } }
        })

        channel
            .on('broadcast', { event: 'signal' }, async ({ payload }: { payload: RoomSignal }) => {
                if (payload.roomId !== roomId) return
                if (payload.targetId && payload.targetId !== currentUserId) return

                console.log('Video Room Signal:', payload.type, 'from:', payload.senderId)

                switch (payload.type) {
                    case 'room-join':
                        // A new person joined, add them to participants list and create an offer
                        setParticipants(prev => {
                            if (prev.some(p => p.id === payload.senderId)) return prev
                            return [...prev, {
                                id: payload.senderId,
                                name: payload.senderName || 'Anonymous',
                                avatarUrl: payload.senderAvatar
                            }]
                        })
                        createPeerConnection(payload.senderId, roomId, true)

                        // Send our status back to them
                        sendSignal('status-update', roomId, payload.senderId, {
                            isMuted,
                            isVideoOff,
                            isHandRaised
                        })
                        break

                    case 'offer':
                        setParticipants(prev => {
                            if (prev.some(p => p.id === payload.senderId)) return prev
                            return [...prev, {
                                id: payload.senderId,
                                name: payload.senderName || 'Anonymous',
                                avatarUrl: payload.senderAvatar
                            }]
                        })
                        const pcOffer = createPeerConnection(payload.senderId, roomId, false)
                        await pcOffer.setRemoteDescription(new RTCSessionDescription(payload.signalData))
                        const answer = await pcOffer.createAnswer()
                        await pcOffer.setLocalDescription(answer)
                        sendSignal('answer', roomId, payload.senderId, answer)
                        break

                    case 'answer':
                        const pcAnswer = pcsRef.current.get(payload.senderId)
                        if (pcAnswer) {
                            await pcAnswer.setRemoteDescription(new RTCSessionDescription(payload.signalData))
                        }
                        break

                    case 'candidate':
                        const pcCand = pcsRef.current.get(payload.senderId)
                        if (pcCand && payload.signalData) {
                            await pcCand.addIceCandidate(new RTCIceCandidate(payload.signalData))
                        }
                        break

                    case 'room-leave':
                        removeParticipant(payload.senderId)
                        break

                    case 'status-update':
                        setParticipants(prev => prev.map(p =>
                            p.id === payload.senderId
                                ? {
                                    ...p,
                                    isMuted: payload.signalData.isMuted,
                                    isVideoOff: payload.signalData.isVideoOff,
                                    isHandRaised: payload.signalData.isHandRaised
                                }
                                : p
                        ))
                        break
                    case 'chat-message':
                        setMessages(prev => [...prev, {
                            id: uuidv4(),
                            senderId: payload.senderId,
                            senderName: payload.senderName,
                            senderAvatar: payload.senderAvatar,
                            content: payload.signalData,
                            timestamp: Date.now()
                        }])
                        break
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    // Once subscribed, broadcast our arrival
                    sendSignal('room-join', roomId)
                }
            })

        channelRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUserId, roomId, createPeerConnection, sendSignal, removeParticipant, isMuted, isVideoOff, isHandRaised])

    const joinRoom = useCallback(async (id: string) => {
        if (status === 'joining' || status === 'active' || (id === roomId && status !== 'idle')) {
            console.log('Already in the process of joining or active in this room')
            return
        }

        cleanup()
        setStatus('joining')
        setRoomId(id)

        try {
            // Adaptive initial constraints
            const videoConstraints = quality === 'excellent' || quality === 'good'
                ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } }
                : quality === 'fair'
                    ? { width: { ideal: 854 }, height: { ideal: 480 }, frameRate: { ideal: 24 } }
                    : { width: { ideal: 426 }, height: { ideal: 240 }, frameRate: { ideal: 15 } }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: videoConstraints
            })

            setLocalStream(stream)
            localStreamRef.current = stream
            setParticipants([{
                id: currentUserId,
                name: currentUserName || 'You',
                avatarUrl: currentUserAvatar,
                isLocal: true,
                stream: stream
            }])
            setStatus('active')
        } catch (err) {
            console.error('Failed to get camera/mic', err)
            toast.error('Could not access camera/microphone')
            cleanup()
        }
    }, [cleanup, currentUserId, currentUserName, currentUserAvatar, roomId, status, quality])

    // Adaptive Resolution Effect - Adjust parameters of existing senders when quality changes
    useEffect(() => {
        if (status !== 'active') return

        const adjustQuality = async () => {
            console.log(`[VIDEO] Adaptive resolution: Quality is now ${quality}`)

            for (const [targetId, pc] of pcsRef.current.entries()) {
                const senders = pc.getSenders()
                const videoSender = senders.find(s => s.track?.kind === 'video')

                if (videoSender) {
                    try {
                        const params = videoSender.getParameters()
                        if (!params.encodings) params.encodings = [{}]

                        switch (quality) {
                            case 'excellent':
                            case 'good':
                                params.encodings[0].maxBitrate = 2500000 // 2.5 Mbps
                                params.encodings[0].scaleResolutionDownBy = 1
                                break
                            case 'fair':
                                params.encodings[0].maxBitrate = 1000000 // 1 Mbps
                                params.encodings[0].scaleResolutionDownBy = 1.5
                                break
                            case 'poor':
                                params.encodings[0].maxBitrate = 300000 // 300 Kbps
                                params.encodings[0].scaleResolutionDownBy = 2
                                break
                            case 'offline':
                                params.encodings[0].maxBitrate = 50000
                                break
                        }

                        await videoSender.setParameters(params)
                        console.log(`[VIDEO] Successfully adjusted sender params for ${targetId}`)
                    } catch (err) {
                        console.warn(`[VIDEO] Could not adjust sender params for ${targetId}:`, err)
                    }
                }
            }
        }

        adjustQuality()
    }, [quality, status])

    const leaveRoom = useCallback(() => {
        if (roomId) {
            sendSignal('room-leave', roomId)
        }
        cleanup()
    }, [cleanup, roomId, sendSignal])

    const toggleMic = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)
                if (roomId) {
                    sendSignal('status-update', roomId, undefined, {
                        isMuted: !audioTrack.enabled,
                        isVideoOff,
                        isHandRaised
                    })
                }
            }
        }
    }, [isVideoOff, roomId, sendSignal])

    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsVideoOff(!videoTrack.enabled)
                if (roomId) {
                    sendSignal('status-update', roomId, undefined, {
                        isMuted,
                        isVideoOff: !videoTrack.enabled,
                        isHandRaised
                    })
                }
            }
        }
    }, [isMuted, roomId, sendSignal])

    const toggleScreenShare = useCallback(async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
                const screenTrack = screenStream.getVideoTracks()[0]

                // Replace tracks for all peer connections
                pcsRef.current.forEach(pc => {
                    const senders = pc.getSenders()
                    const videoSender = senders.find(s => s.track?.kind === 'video')
                    if (videoSender) {
                        videoSender.replaceTrack(screenTrack)
                    }
                })

                // Update local participants list to use screen track
                setParticipants(prev => prev.map(p =>
                    p.isLocal ? { ...p, stream: screenStream } : p
                ))

                screenTrack.onended = () => {
                    stopScreenShare()
                }

                setIsScreenSharing(true)
            } catch (err) {
                console.error('Error starting screen share:', err)
            }
        } else {
            stopScreenShare()
        }
    }, [isScreenSharing, pcsRef.current])

    const stopScreenShare = useCallback(() => {
        if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0]

            pcsRef.current.forEach(pc => {
                const senders = pc.getSenders()
                const videoSender = senders.find(s => s.track?.kind === 'video')
                if (videoSender) {
                    videoSender.replaceTrack(cameraTrack)
                }
            })

            setParticipants(prev => prev.map(p =>
                p.isLocal ? { ...p, stream: localStreamRef.current } : p
            ))

            setIsScreenSharing(false)
        }
    }, [pcsRef.current])

    const toggleHandRaise = useCallback(() => {
        const newState = !isHandRaised
        setIsHandRaised(newState)
        if (roomId) {
            sendSignal('status-update', roomId, undefined, {
                isMuted,
                isVideoOff,
                isHandRaised: newState
            })
        }
    }, [isHandRaised, roomId, sendSignal, isMuted, isVideoOff])

    const sendMessage = useCallback((content: string) => {
        if (!roomId || !content.trim()) return

        const messageData = {
            id: uuidv4(),
            senderId: currentUserId,
            senderName: currentUserName,
            senderAvatar: currentUserAvatar,
            content: content,
            timestamp: Date.now()
        }

        // Add locally
        setMessages(prev => [...prev, messageData])

        // Broadcast to others
        sendSignal('chat-message', roomId, undefined, content)
    }, [roomId, currentUserId, currentUserName, currentUserAvatar, sendSignal])

    return {
        status,
        participants,
        joinRoom,
        leaveRoom,
        toggleMic,
        toggleVideo,
        toggleScreenShare,
        toggleHandRaise,
        isMicMuted: isMuted,
        isVideoOff,
        isScreenSharing,
        isHandRaised,
        messages,
        sendMessage
    }
}
