'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'active' | 'ended'

interface CallSignal {
    type: 'offer' | 'answer' | 'candidate' | 'call-initiated' | 'call-declined' | 'call-ended'
    senderId: string
    targetId: string
    signalData?: any
    senderName?: string
    senderAvatar?: string
    callId: string
}

export const useVoiceCall = (currentUserId: string, currentUserName?: string, currentUserAvatar?: string) => {
    const [status, setStatus] = useState<CallStatus>('idle')
    const [callId, setCallId] = useState<string | null>(null)
    const [remotePeerId, setRemotePeerId] = useState<string | null>(null)
    const [remotePeerName, setRemotePeerName] = useState<string>('')
    const [remotePeerAvatar, setRemotePeerAvatar] = useState<string | undefined>()
    const [duration, setDuration] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)

    const pcRef = useRef<RTCPeerConnection | null>(null)
    const channelRef = useRef<any>(null)
    const durationIntervalRef = useRef<any>(null)

    // Configuration for PeerConnection (Free STUN servers)
    const iceConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ]
    }

    const cleanup = useCallback(() => {
        if (pcRef.current) {
            pcRef.current.close()
            pcRef.current = null
        }
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop())
            setLocalStream(null)
        }
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current)
        }
        setStatus('idle')
        setCallId(null)
        setRemotePeerId(null)
        setDuration(0)
    }, [localStream])

    // Signaling Listener
    useEffect(() => {
        if (!currentUserId) return

        const channel = supabase.channel('voice-calls', {
            config: { broadcast: { self: false } }
        })

        channel
            .on('broadcast', { event: 'signal' }, async ({ payload }: { payload: CallSignal }) => {
                if (payload.targetId !== currentUserId) return

                console.log('Voice Call Signal Received:', payload.type, payload)

                switch (payload.type) {
                    case 'call-initiated':
                        if (status !== 'idle') {
                            // Busy
                            sendSignal(payload.senderId, 'call-declined', payload.callId)
                            return
                        }
                        setCallId(payload.callId)
                        setRemotePeerId(payload.senderId)
                        setRemotePeerName(payload.senderName || 'Unknown')
                        setRemotePeerAvatar(payload.senderAvatar)
                        setStatus('ringing')
                        break

                    case 'offer':
                        if (payload.callId !== callId) return
                        handleReceiveOffer(payload)
                        break

                    case 'answer':
                        if (payload.callId !== callId) return
                        if (pcRef.current) {
                            await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.signalData))
                        }
                        break

                    case 'candidate':
                        if (payload.callId !== callId) return
                        if (pcRef.current && payload.signalData) {
                            try {
                                await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.signalData))
                            } catch (e) {
                                console.error('Error adding received ice candidate', e)
                            }
                        }
                        break

                    case 'call-declined':
                        if (payload.callId === callId) {
                            toast.error('Call declined')
                            cleanup()
                        }
                        break

                    case 'call-ended':
                        if (payload.callId === callId) {
                            toast.info('Call ended')
                            cleanup()
                        }
                        break
                }
            })
            .subscribe()

        channelRef.current = channel

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUserId, status, callId, cleanup])

    const sendSignal = (targetId: string, type: CallSignal['type'], id: string, data?: any) => {
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
                    callId: id
                }
            })
        }
    }

    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            setLocalStream(stream)
            return stream
        } catch (err) {
            console.error('Failed to get local stream', err)
            toast.error('Could not access microphone')
            return null
        }
    }

    const createPeerConnection = (id: string, targetId: string) => {
        const pc = new RTCPeerConnection(iceConfig)

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal(targetId, 'candidate', id, event.candidate)
            }
        }

        pc.ontrack = (event) => {
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement
            if (remoteAudio && event.streams[0]) {
                remoteAudio.srcObject = event.streams[0]
            }
        }

        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'connected') {
                setStatus('active')
                startDurationCounter()
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                cleanup()
            }
        }

        pcRef.current = pc
        return pc
    }

    const startDurationCounter = () => {
        if (durationIntervalRef.current) clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = setInterval(() => {
            setDuration(prev => prev + 1)
        }, 1000)
    }

    const initiateCall = async (targetUserId: string, targetUserName: string, targetUserAvatar?: string) => {
        const id = uuidv4()
        setCallId(id)
        setRemotePeerId(targetUserId)
        setRemotePeerName(targetUserName)
        setRemotePeerAvatar(targetUserAvatar)
        setStatus('calling')

        sendSignal(targetUserId, 'call-initiated', id)

        const stream = await startLocalStream()
        if (!stream) {
            cleanup()
            return
        }

        const pc = createPeerConnection(id, targetUserId)
        stream.getTracks().forEach(track => pc.addTrack(track, stream))

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        sendSignal(targetUserId, 'offer', id, offer)
    }

    const acceptCall = async () => {
        if (!callId || !remotePeerId) return

        const stream = await startLocalStream()
        if (!stream) {
            declineCall()
            return
        }

        setStatus('active') // optimistically or wait for connection? Let's say active means we are trying to connect

        // Peer Connection is created when we handle the offer or here if not already
        // But for receiving, we actually need to wait for the offer to set up the PC properly.
        // Actually, handleReceiveOffer does it.
    }

    const handleReceiveOffer = async (payload: CallSignal) => {
        const stream = await startLocalStream()
        if (!stream) {
            sendSignal(payload.senderId, 'call-declined', payload.callId)
            cleanup()
            return
        }

        const pc = createPeerConnection(payload.callId, payload.senderId)
        stream.getTracks().forEach(track => pc.addTrack(track, stream))

        await pc.setRemoteDescription(new RTCSessionDescription(payload.signalData))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)

        sendSignal(payload.senderId, 'answer', payload.callId, answer)
    }

    const declineCall = () => {
        if (callId && remotePeerId) {
            sendSignal(remotePeerId, 'call-declined', callId)
        }
        cleanup()
    }

    const hangUp = () => {
        if (callId && remotePeerId) {
            sendSignal(remotePeerId, 'call-ended', callId)
        }
        cleanup()
    }

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled
            })
            setIsMuted(!localStream.getAudioTracks()[0].enabled)
        }
    }

    return {
        status,
        callId,
        remotePeerName,
        remotePeerAvatar,
        duration,
        isMuted,
        initiateCall,
        acceptCall,
        declineCall,
        hangUp,
        toggleMute
    }
}
