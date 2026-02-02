'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface Collaborator {
    id: string
    name: string
    avatar?: string
    color: string
    status: 'online' | 'busy' | 'away'
    blockIndex?: number
    cursor?: { x: number, y: number }
    lastActive: number
}

declare global {
    interface Window {
        collaborationChannel: RealtimeChannel | null
        currentUserId: string | null
    }
}

export const useCollaboration = (docId: string, currentUser: any) => {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([])
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!docId || !currentUser) return

        window.currentUserId = currentUser.id

        const docChannel = supabase.channel(`doc:${docId}`, {
            config: {
                presence: {
                    key: currentUser.id,
                },
            },
        })

        window.collaborationChannel = docChannel

        docChannel
            .on('presence', { event: 'sync' }, () => {
                const state = docChannel.presenceState()
                const formatted: Collaborator[] = []

                Object.keys(state).forEach((key) => {
                    const presence = state[key][0] as any
                    formatted.push({
                        id: key,
                        name: presence.name || 'Anonymous',
                        avatar: presence.avatar,
                        color: presence.color || '#3b82f6',
                        status: presence.status || 'online',
                        cursor: presence.cursor,
                        blockIndex: presence.blockIndex,
                        lastActive: presence.lastActive || Date.now()
                    })
                })
                setCollaborators(formatted)
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', key, newPresences)
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', key, leftPresences)
            })
            .on('broadcast', { event: 'cursor-move' }, (payload) => {
                setCollaborators(prev => prev.map(c =>
                    c.id === payload.payload.userId
                        ? {
                            ...c,
                            blockIndex: payload.payload.blockIndex !== undefined ? payload.payload.blockIndex : c.blockIndex,
                            cursor: payload.payload.cursor !== undefined ? payload.payload.cursor : c.cursor
                        }
                        : c
                ))
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await docChannel.track({
                        name: currentUser.name,
                        avatar: currentUser.avatarUrl,
                        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                        status: 'online',
                        lastActive: Date.now()
                    })
                }
            })

        setChannel(docChannel)

        return () => {
            docChannel.unsubscribe()
        }
    }, [docId, currentUser?.id])

    const updateCursor = (cursor: { x: number, y: number }) => {
        if (channel) {
            channel.send({
                type: 'broadcast',
                event: 'cursor-move',
                payload: { userId: currentUser.id, cursor }
            })
        }
    }

    return { collaborators, updateCursor, channel }
}
