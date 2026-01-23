'use client'

import { useState, useEffect } from 'react'

export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'offline'

export const useConnectivity = () => {
    const [quality, setQuality] = useState<ConnectionQuality>('excellent')
    const [latency, setLatency] = useState<number | null>(null)

    useEffect(() => {
        if (typeof window === 'undefined') return

        const updateStatus = () => {
            if (!navigator.onLine) {
                setQuality('offline')
                return
            }

            // @ts-ignore - navigator.connection is not standard in all browsers
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection

            if (conn) {
                const { effectiveType, rtt, downlink } = conn

                if (effectiveType === '2g' || rtt > 1000 || downlink < 0.5) {
                    setQuality('poor')
                } else if (effectiveType === '3g' || rtt > 500 || downlink < 1.5) {
                    setQuality('fair')
                } else if (rtt > 200 || downlink < 5) {
                    setQuality('good')
                } else {
                    setQuality('excellent')
                }
                setLatency(rtt)
            }
        }

        // Periodically check latency via a small ping if supported
        const checkLatency = async () => {
            if (!navigator.onLine) return

            const start = performance.now()
            try {
                // Fetch a tiny resource or just hit the heartbeat endpoint
                await fetch('/api/heartbeat', { method: 'HEAD', cache: 'no-store' })
                const end = performance.now()
                const rtt = end - start
                setLatency(Math.round(rtt))

                if (rtt > 1500) setQuality('poor')
                else if (rtt > 800) setQuality('fair')
                else if (rtt > 300) setQuality('good')
                else setQuality('excellent')
            } catch (e) {
                // If fetch fails but navigator says online, it might be a DNS or massive lag issue
                if (navigator.onLine) setQuality('poor')
            }
        }

        window.addEventListener('online', updateStatus)
        window.addEventListener('offline', updateStatus)

        // Initial check
        updateStatus()

        // Periodic ping every 30 seconds to catch "silent" connection drops or severe lag
        const interval = setInterval(checkLatency, 30000)

        // @ts-ignore
        const conn = navigator.connection
        if (conn) {
            conn.addEventListener('change', updateStatus)
        }

        return () => {
            window.removeEventListener('online', updateStatus)
            window.removeEventListener('offline', updateStatus)
            clearInterval(interval)
            if (conn) {
                conn.removeEventListener('change', updateStatus)
            }
        }
    }, [])

    return { quality, latency }
}
