import { useEffect, useState, useRef, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'

type MemberStatus = 'available' | 'busy' | 'away' | 'offline'

interface PresenceState {
    user_id: string
    online_at: string
    status: MemberStatus
    user_name: string
}

export const useTeamPresence = (agencyId: string) => {
    const [presenceMap, setPresenceMap] = useState<Record<string, PresenceState>>({})
    const [manualStatus, setManualStatus] = useState<MemberStatus>('available')
    const [user, setUser] = useState<any>(null)

    // Create a browser client that can access cookies
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channelRef = useRef<any>(null)
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
    const IDLE_TIMEOUT = 5 * 60 * 1000 // 5 minutes

    // Get current user (this will work with cookies now)
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Fetch profile to get name
                const { data: profile } = await supabase
                    .from('User')
                    .select('name')
                    .eq('id', user.id)
                    .single()

                setUser({ ...user, name: profile?.name || user.email })
            }
        }
        getUser()
    }, [])

    const updatePresence = useCallback(async (status: MemberStatus) => {
        if (!user || !channelRef.current) return

        // Track user presence
        const presenceState: PresenceState = {
            user_id: user.id,
            online_at: new Date().toISOString(),
            status: status,
            user_name: user.name,
        }

        try {
            await channelRef.current.track(presenceState)
            setManualStatus(status)
        } catch (error) {
            console.error('Error updating presence:', error)
        }
    }, [user])

    // Reset idle timer
    const resetIdleTimer = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current)

        // If manually busy, don't auto-set away
        if (manualStatus === 'busy') return

        // If currently away, set back to available immediately on activity
        if (manualStatus === 'away') {
            updatePresence('available')
        }

        idleTimerRef.current = setTimeout(() => {
            if (manualStatus !== 'busy') {
                updatePresence('away')
            }
        }, IDLE_TIMEOUT)
    }, [manualStatus, updatePresence])

    useEffect(() => {
        if (!agencyId || !user) return

        // 1. Subscribe to channel
        const channelName = `presence:${agencyId}`
        const channel = supabase.channel(channelName, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        })

        channelRef.current = channel

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const newMap: Record<string, PresenceState> = {}

                // Flatten state
                Object.keys(state).forEach((key) => {
                    const presences = state[key] as unknown as PresenceState[]
                    if (presences && presences.length > 0) {
                        // Take most recent
                        const latest = presences.sort((a, b) => new Date(b.online_at).getTime() - new Date(a.online_at).getTime())[0]
                        newMap[latest.user_id] = latest
                    }
                })
                setPresenceMap(newMap)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await updatePresence('available')
                }
            })

        // 2. Setup Idle Detection
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
        const handleActivity = () => resetIdleTimer()

        events.forEach(event => window.addEventListener(event, handleActivity))

        // Initial activity
        resetIdleTimer()

        return () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            events.forEach(event => window.removeEventListener(event, handleActivity))
            supabase.removeChannel(channel)
        }
    }, [agencyId, user, resetIdleTimer, updatePresence])

    return { presenceMap, manualStatus, setManualStatus: updatePresence }
}
