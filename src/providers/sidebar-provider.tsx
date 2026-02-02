'use client'

import React, { createContext, useContext, useState } from 'react'

type SidebarContextType = {
    hoveredMenuItem: string | null
    setHoveredMenuItem: (id: string | null) => void
    activeCategory: string | null
    setActiveCategory: (category: string | null) => void
    isPanelCollapsed: boolean
    setIsPanelCollapsed: (collapsed: boolean) => void
    panelTop: number | null
    setPanelTop: (top: number | null) => void
    // Dynamic Categories
    pinnedCategoryIds: string[]
    extraCategoryIds: string[]
    categoryUsage: Record<string, number>
    pinCategory: (id: string) => void
    replaceCategory: (newId: string, targetId: string) => void
    recordUsage: (id: string) => void
}

const SidebarContext = createContext<SidebarContextType>({
    hoveredMenuItem: null,
    setHoveredMenuItem: () => { },
    activeCategory: null,
    setActiveCategory: () => { },
    isPanelCollapsed: false,
    setIsPanelCollapsed: () => { },
    panelTop: null,
    setPanelTop: () => { },
    pinnedCategoryIds: [],
    extraCategoryIds: [],
    categoryUsage: {},
    pinCategory: () => { },
    replaceCategory: () => { },
    recordUsage: () => { }
})

export const useSidebar = () => {
    const context = useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}

const DEFAULT_PINNED = [
    'home', 'dashboard', 'inventory', 'clients', 'campaigns',
    'messages', 'pipelines', 'media', 'tasks', 'websites', 'docs', 'automation'
]

const ALL_CATEGORIES = [
    'home', 'dashboard', 'inventory', 'clients', 'team',
    'messages', 'pipelines', 'media', 'campaigns', 'tasks', 'websites', 'docs',
    'automation', 'finance', 'upgrade', 'calendar'
]

export const SidebarProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
    const [panelTop, setPanelTop] = useState<number | null>(null)

    // Dynamic State with basic initialization
    const [pinnedCategoryIds, setPinnedCategoryIds] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sidebar_pinned')
                const initial = saved ? JSON.parse(saved) : DEFAULT_PINNED
                // Hard dedupe, exclude 'upgrade', and ensure all IDs exist in ALL_CATEGORIES
                let filtered = Array.from(new Set(initial))
                    .filter(id => id !== 'upgrade' && ALL_CATEGORIES.includes(id as any))

                // Re-balance: Ensure we always have exactly the expected number items in the dock pool
                if (filtered.length < DEFAULT_PINNED.length) {
                    const missing = ALL_CATEGORIES.filter(id => !filtered.includes(id) && id !== 'upgrade')
                    filtered = [...filtered, ...missing].slice(0, DEFAULT_PINNED.length)
                }
                return filtered
            } catch (e) {
                console.error('Error parsing sidebar_pinned:', e)
                return DEFAULT_PINNED
            }
        }
        return DEFAULT_PINNED.filter(id => id !== 'upgrade')
    })

    const [categoryUsage, setCategoryUsage] = useState<Record<string, number>>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sidebar_usage')
                return saved ? JSON.parse(saved) : {}
            } catch (e) {
                console.error('Error parsing sidebar_usage:', e)
                return {}
            }
        }
        return {}
    })

    // CRITICAL: Mutual exclusion must be based on IDs to prevent "ghosting"
    // even if an icon currently has no matching sidebar options.
    const extraCategoryIds = ALL_CATEGORIES.filter(id =>
        !pinnedCategoryIds.includes(id) &&
        id !== 'upgrade'
    )

    const recordUsage = (id: string) => {
        setCategoryUsage(prev => {
            const next = { ...prev, [id]: (prev[id] || 0) + 1 }
            localStorage.setItem('sidebar_usage', JSON.stringify(next))
            return next
        })
    }

    const pinCategory = (id: string) => {
        if (id === 'upgrade' || id === 'home') return

        setPinnedCategoryIds(prev => {
            // Already there? no-op.
            if (prev.includes(id)) return prev

            // Find the least-used candidate to swap out (exclude Home)
            const candidates = prev.filter(pId => pId !== 'home')
            const leastUsedId = candidates.reduce((minId, currentId) => {
                const minUsage = categoryUsage[minId] || 0
                const currentUsage = categoryUsage[currentId] || 0
                return currentUsage < minUsage ? currentId : minId
            }, candidates[0] || prev[0])

            // Precise replacement to keep the array length exactly constant
            const next = prev.map(pId => pId === leastUsedId ? id : pId)
            localStorage.setItem('sidebar_pinned', JSON.stringify(next))

            setCategoryUsage(prevUsage => ({ ...prevUsage, [id]: 0 }))
            return next
        })
    }

    const replaceCategory = (newId: string, targetId: string) => {
        if (newId === targetId || targetId === 'home' || targetId === 'upgrade') return

        setPinnedCategoryIds(prev => {
            const targetIdx = prev.indexOf(targetId)
            if (targetIdx === -1) return prev

            const next = [...prev]

            // If the icon we're dragging is ALREADY in the dock (edge case),
            // just swap it with the target to keep the total count exactly constant.
            const currentIdx = prev.indexOf(newId)
            if (currentIdx !== -1) {
                next[currentIdx] = targetId
                next[targetIdx] = newId
            } else {
                // Standard replacement
                next[targetIdx] = newId
            }

            localStorage.setItem('sidebar_pinned', JSON.stringify(next))

            setCategoryUsage(prevUsage => ({ ...prevUsage, [newId]: 0 }))
            return next
        })
    }

    return (
        <SidebarContext.Provider value={{
            hoveredMenuItem,
            setHoveredMenuItem,
            activeCategory,
            setActiveCategory,
            isPanelCollapsed,
            setIsPanelCollapsed,
            panelTop,
            setPanelTop,
            pinnedCategoryIds,
            extraCategoryIds,
            categoryUsage,
            pinCategory,
            replaceCategory,
            recordUsage
        }}>
            {children}
        </SidebarContext.Provider>
    )
}
