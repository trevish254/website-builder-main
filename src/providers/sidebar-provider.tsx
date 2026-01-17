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
    'home', 'dashboard', 'inventory', 'clients', 'team',
    'messages', 'funnels', 'tasks', 'websites', 'docs'
]

const ALL_CATEGORIES = [
    'home', 'dashboard', 'inventory', 'clients', 'team',
    'messages', 'funnels', 'tasks', 'websites', 'docs',
    'automation', 'finance', 'upgrade', 'kra', 'calendar'
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
            const saved = localStorage.getItem('sidebar_pinned')
            return saved ? JSON.parse(saved) : DEFAULT_PINNED
        }
        return DEFAULT_PINNED
    })

    const [categoryUsage, setCategoryUsage] = useState<Record<string, number>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sidebar_usage')
            return saved ? JSON.parse(saved) : {}
        }
        return {}
    })

    const extraCategoryIds = ALL_CATEGORIES.filter(id => !pinnedCategoryIds.includes(id))

    const recordUsage = (id: string) => {
        setCategoryUsage(prev => {
            const next = { ...prev, [id]: (prev[id] || 0) + 1 }
            localStorage.setItem('sidebar_usage', JSON.stringify(next))
            return next
        })
    }

    const pinCategory = (id: string) => {
        if (pinnedCategoryIds.includes(id)) return

        setPinnedCategoryIds(prev => {
            // Find the least-used category among pinned, excluding 'home' and 'upgrade'
            const candidates = prev.filter(pId => pId !== 'home' && pId !== 'upgrade')

            const leastUsedId = candidates.reduce((minId, currentId) => {
                const minUsage = categoryUsage[minId] || 0
                const currentUsage = categoryUsage[currentId] || 0
                return currentUsage < minUsage ? currentId : minId
            }, candidates[0] || prev[0])

            const next = prev.map(pId => pId === leastUsedId ? id : pId)
            localStorage.setItem('sidebar_pinned', JSON.stringify(next))

            // Reset usage for the newly pinned icon to give it a fresh start
            setCategoryUsage(prevUsage => {
                const nextUsage = { ...prevUsage, [id]: 0 }
                localStorage.setItem('sidebar_usage', JSON.stringify(nextUsage))
                return nextUsage
            })

            return next
        })
    }

    const replaceCategory = (newId: string, targetId: string) => {
        if (pinnedCategoryIds.includes(newId)) return

        setPinnedCategoryIds(prev => {
            const next = prev.map(pId => pId === targetId ? newId : pId)
            localStorage.setItem('sidebar_pinned', JSON.stringify(next))

            // Reset usage for the newly pinned icon
            setCategoryUsage(prevUsage => {
                const nextUsage = { ...prevUsage, [newId]: 0 }
                localStorage.setItem('sidebar_usage', JSON.stringify(nextUsage))
                return nextUsage
            })

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
