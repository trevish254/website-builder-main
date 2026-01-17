'use client'

import { useSidebar } from '@/providers/sidebar-provider'
import { icons } from '@/lib/constants'
import {
    Compass,
    Settings,
    User,
    ChevronsLeft,
    ChevronsRight,
    Plus,
    LayoutGrid,
    CheckCircle2
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import UserButton from '@/components/global/user-button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect, useMemo, MouseEvent } from 'react'

type SidebarOption = {
    id: string
    name: string
    icon: string
    link: string
}

type Props = {
    sidebarOptions: SidebarOption[]
    logo: string
    user?: any
    type: 'agency' | 'subaccount'
}

// Full list of categories for reference
const ALL_MENU_CATEGORIES = [
    { id: 'home', icon: 'home', label: 'Home', matchNames: ['Overview', 'Launchpad'] },
    { id: 'dashboard', icon: 'chart', label: 'Dashboard', matchNames: ['Dashboards'] },
    { id: 'inventory', icon: 'package', label: 'Inventory', matchNames: ['product Dashboard', 'Inventory', 'Orders', 'Order', 'Customer Details', 'Revenue Analytics'] },
    { id: 'clients', icon: 'person', label: 'Clients', matchNames: ['Assigned to me', 'Private', 'All Clients', 'Sub Accounts', 'Client Profiles', 'Engagement', 'Client Insights'] },
    { id: 'team', icon: 'shield', label: 'Teams', matchNames: ['All Members', 'Roles & Permissions', 'Availability', 'Workload', 'Performance', 'Activity Logs', 'Invites', 'Team', 'Contacts'] },
    { id: 'messages', icon: 'messages', label: 'Messages', matchNames: ['Inbox', 'Conversations', 'Internal', 'Subaccounts', 'Automated', 'Announcements', 'System', 'Messages'] },
    { id: 'funnels', icon: 'pipelines', label: 'Funnels', matchNames: ['Funnels'] },
    { id: 'tasks', icon: 'pipelines', label: 'Tasks', matchNames: ['All Tasks', 'Assigned to Me', 'Private', 'Status', 'Priority', 'Subaccounts', 'Activity', 'Tasks'] },
    { id: 'websites', icon: 'globe', label: 'Websites', matchNames: ['Websites'] },
    { id: 'docs', icon: 'document', label: 'Docs', matchNames: ['All Docs', 'Shared', 'Assigned', 'Requests', 'Templates', 'Docs'] },
    { id: 'automation', icon: 'settings', label: 'Automation', matchNames: ['Automations'] },
    { id: 'finance', icon: 'payment', label: 'Finance', matchNames: ['Finance'] },
    { id: 'upgrade', icon: 'rocket', label: 'Upgrade', matchNames: ['Current Plan', 'Available Plans', 'Billing History', 'Invoices', 'Payment Methods', 'Add-ons', 'Billing'] },
    { id: 'kra', icon: 'government', label: 'KRA', matchNames: ['Government Services'] },
    { id: 'calendar', icon: 'calendar', label: 'Calendar', matchNames: ['Calendar'] }
]

const IconDock = ({ sidebarOptions, logo, user, type }: Props) => {
    const {
        setHoveredMenuItem,
        activeCategory,
        setActiveCategory,
        isPanelCollapsed,
        setIsPanelCollapsed,
        setPanelTop,
        pinnedCategoryIds,
        extraCategoryIds,
        categoryUsage,
        recordUsage,
        pinCategory,
        replaceCategory
    } = useSidebar()

    const pathname = usePathname()
    const [isMoreOpen, setIsMoreOpen] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [targetedId, setTargetedId] = useState<string | null>(null)
    const dockRef = useRef<HTMLDivElement>(null)
    const pinnedRefs = useRef<Record<string, HTMLButtonElement | null>>({})

    const leastUsedCandidateId = useMemo(() => {
        const candidates = pinnedCategoryIds.filter(id => id !== 'home' && id !== 'upgrade')
        if (candidates.length === 0) return null
        return candidates.reduce((minId, currentId) => {
            const minUsage = categoryUsage[minId] || 0
            const currentUsage = categoryUsage[currentId] || 0
            return currentUsage < minUsage ? currentId : minId
        }, candidates[0])
    }, [pinnedCategoryIds, categoryUsage])

    // Helper to get category details by ID
    const getCategory = (id: string) => ALL_MENU_CATEGORIES.find(c => c.id === id)

    // Filter and group options for the dock
    const getCategorizedOptions = (ids: string[]) => {
        return ids.map(id => {
            const category = getCategory(id)!
            const matchingOptions = sidebarOptions.filter(opt =>
                category.matchNames.some(matchName => matchName.toLowerCase() === opt.name.toLowerCase())
            )
            return {
                ...category,
                options: matchingOptions,
                hasOptions: matchingOptions.length > 0
            }
        }).filter(cat => {
            if (cat.id === 'inventory' && type === 'agency') return false
            if (cat.id === 'inventory' && type === 'subaccount') return true
            return cat.hasOptions
        })
    }

    const categorizedPinned = useMemo(() => getCategorizedOptions(pinnedCategoryIds), [pinnedCategoryIds, sidebarOptions])

    // An icon is "Visible" if it's in the dynamic pinned list AND has options (or is a hardcoded exception)
    const visiblePinnedCategories = categorizedPinned.filter(cat => {
        if (cat.id === 'upgrade' || cat.id === 'home') return false
        return true // Already filtered by hasOptions inside getCategorizedOptions
    })

    const visiblePinnedIds = [
        'home',
        'upgrade',
        ...visiblePinnedCategories.map(c => c.id)
    ]

    // Extra categories are anything in ALL_CATEGORIES that is NOT in the dock pool
    const extraCategories = useMemo(() => {
        return ALL_MENU_CATEGORIES
            .filter(cat => !pinnedCategoryIds.includes(cat.id) && cat.id !== 'upgrade')
            .map(cat => {
                const matchingOptions = sidebarOptions.filter(opt =>
                    cat.matchNames.some(matchName => matchName.toLowerCase() === opt.name.toLowerCase())
                )
                return {
                    ...cat,
                    options: matchingOptions,
                    hasOptions: matchingOptions.length > 0
                }
            })
            .filter(cat => {
                if (cat.id === 'inventory' && type === 'agency') return false
                if (cat.id === 'inventory' && type === 'subaccount') return true
                return cat.hasOptions
            })
    }, [pinnedCategoryIds, sidebarOptions, type])

    const pinnedCategories = visiblePinnedCategories
    const homeCategory = categorizedPinned.find(c => c.id === 'home')

    // Categorize upgrade separately to get its options
    const upgradeCategoryRaw = ALL_MENU_CATEGORIES.find(c => c.id === 'upgrade')!
    const upgradeCategory = {
        ...upgradeCategoryRaw,
        options: sidebarOptions.filter(opt =>
            upgradeCategoryRaw.matchNames.some(matchName => matchName.toLowerCase() === opt.name.toLowerCase())
        )
    }

    const isCategoryActive = (category: any) => {
        if (!category?.options) return false
        return category.options.some((opt: any) => {
            const baseUrl = type === 'agency' ? `/agency/${user?.Agency?.id}` : `/subaccount/${user?.Agency?.SubAccount?.[0]?.id}`
            if (opt.link === baseUrl) return pathname === opt.link
            return pathname.startsWith(opt.link)
        })
    }

    const handleCategoryClick = (categoryId: string, event: MouseEvent) => {
        recordUsage(categoryId)
        setActiveCategory(categoryId)
        setHoveredMenuItem(categoryId)
        const rect = event.currentTarget.getBoundingClientRect()
        setPanelTop(rect.top)
    }

    const handleDragStart = (id: string) => setDraggedId(id)

    const handleDrag = (id: string, info: any) => {
        let foundTarget = null
        for (const [targetId, element] of Object.entries(pinnedRefs.current)) {
            if (element) {
                const rect = element.getBoundingClientRect()
                if (
                    info.point.x >= rect.left &&
                    info.point.x <= rect.right &&
                    info.point.y >= rect.top &&
                    info.point.y <= rect.bottom
                ) {
                    foundTarget = targetId
                    break
                }
            }
        }
        setTargetedId(foundTarget)
    }

    const handleDragEnd = (id: string, info: any) => {
        if (targetedId) {
            replaceCategory(id, targetedId)
        }
        // General drop in dockRef no longer triggers pinCategory 
        // to prevent phantom ejections without direct user targeting.
        setTargetedId(null)
        setDraggedId(null)
    }

    return (
        <div
            ref={dockRef}
            id="sidebar-icon-dock"
            className="fixed left-0 top-16 h-[calc(100vh-64px)] w-[60px] bg-gradient-to-b from-orange-500 to-rose-600 flex flex-col items-center py-4 z-50 shadow-2xl transition-all duration-300"
        >
            {/* Sidebar Toggle */}
            <div className="w-full flex justify-center mb-4 mt-2">
                <button
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors hover:bg-white/20"
                >
                    {isPanelCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
                </button>
            </div>

            {/* Pinned Category Icons */}
            <div className="flex-1 flex flex-col gap-2 w-full px-2 overflow-y-auto no-scrollbar relative">
                {/* Fixed Home Icon */}
                {homeCategory && (
                    <button
                        onClick={(e) => handleCategoryClick(homeCategory.id, e)}
                        onMouseEnter={(e) => {
                            setActiveCategory(homeCategory.id)
                            setHoveredMenuItem(homeCategory.id)
                            setPanelTop(e.currentTarget.getBoundingClientRect().top)
                        }}
                        className={cn(
                            "w-full py-2 flex flex-col items-center justify-center transition-all duration-200 group relative",
                            isCategoryActive(homeCategory) && "z-50"
                        )}
                    >
                        {isCategoryActive(homeCategory) && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute left-[-10px] w-1.5 h-6 bg-white rounded-r-full shadow-lg"
                            />
                        )}
                        <div className={cn(
                            'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 mb-1',
                            isCategoryActive(homeCategory) ? 'bg-white shadow-xl' : 'group-hover:bg-white/20',
                            activeCategory === homeCategory.id && !isCategoryActive(homeCategory) && 'bg-white/10'
                        )}>
                            {(() => {
                                const iconResult = icons.find(i => i.value === homeCategory.icon)
                                const IconComponent = iconResult?.path || Settings
                                return (
                                    <IconComponent
                                        className={cn(
                                            'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                                            isCategoryActive(homeCategory) ? 'text-orange-600' : 'text-white'
                                        )}
                                    />
                                )
                            })()}
                        </div>
                        <span className={cn(
                            'text-[7.5px] font-bold uppercase tracking-wider transition-colors duration-200 truncate max-w-full px-0.5',
                            isCategoryActive(homeCategory) ? 'text-white' : 'text-white/60 group-hover:text-white'
                        )}>
                            {homeCategory.label}
                        </span>
                    </button>
                )}

                {pinnedCategories.map((category) => {
                    const iconResult = icons.find(i => i.value === category.icon)
                    const IconComponent = iconResult?.path || Settings
                    const isActive = isCategoryActive(category)
                    const isTargeted = targetedId === category.id
                    const isLeastUsedCandidate = leastUsedCandidateId === category.id && draggedId && !targetedId
                    const shouldWiggle = isTargeted || isLeastUsedCandidate

                    return (
                        <motion.button
                            key={category.id}
                            ref={el => pinnedRefs.current[category.id] = el}
                            onClick={(e) => handleCategoryClick(category.id, e)}
                            onMouseEnter={(e) => {
                                setActiveCategory(category.id)
                                setHoveredMenuItem(category.id)
                                setPanelTop(e.currentTarget.getBoundingClientRect().top)
                            }}
                            animate={shouldWiggle ? {
                                rotate: [0, -5, 5, -5, 5, 0],
                                scale: 1.1,
                            } : {
                                rotate: 0,
                                scale: 1,
                            }}
                            transition={shouldWiggle ? {
                                duration: 0.5,
                                repeat: Infinity,
                            } : {}}
                            className={cn(
                                "w-full py-2 flex flex-col items-center justify-center transition-all duration-200 group relative",
                                shouldWiggle && "z-50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-[-10px] w-1.5 h-6 bg-white rounded-r-full shadow-lg"
                                />
                            )}
                            <div className={cn(
                                'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 mb-1',
                                isActive ? 'bg-white shadow-xl' : 'group-hover:bg-white/20',
                                activeCategory === category.id && !isActive && 'bg-white/10',
                                shouldWiggle && 'bg-white/30 border-2 border-dashed border-white ring-4 ring-white/20'
                            )}>
                                <IconComponent
                                    className={cn(
                                        'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                                        isActive ? 'text-orange-600' : 'text-white'
                                    )}
                                />
                            </div>
                            <span className={cn(
                                'text-[7.5px] font-bold uppercase tracking-wider transition-colors duration-200 truncate max-w-full px-0.5',
                                isActive ? 'text-white' : 'text-white/60 group-hover:text-white',
                                shouldWiggle && 'text-white scale-110'
                            )}>
                                {isTargeted ? "Drop Here" : isLeastUsedCandidate ? "Replace" : category.label}
                            </span>
                        </motion.button>
                    )
                })}

                {/* More Trigger */}
                <div className="relative mt-2 flex flex-col items-center">
                    <button
                        id="more-trigger"
                        onClick={() => setIsMoreOpen(!isMoreOpen)}
                        className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg z-50 relative mb-1",
                            isMoreOpen ? "bg-white text-orange-600 rotate-45 scale-110" : "bg-white/20 text-white hover:bg-white/30"
                        )}
                    >
                        <Plus size={16} />
                    </button>
                    <span className={cn(
                        'text-[7.5px] font-bold uppercase tracking-wider transition-opacity duration-300',
                        isMoreOpen ? 'opacity-100 text-white' : 'text-white/60'
                    )}>
                        More
                    </span>

                    {/* Radial Menu */}
                    <AnimatePresence>
                        {isMoreOpen && (
                            <div className="fixed inset-0 pointer-events-none z-[60]">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: draggedId ? 0 : 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/20 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300"
                                    onClick={() => setIsMoreOpen(false)}
                                />
                                {extraCategories.map((category, index) => {
                                    const triggerRect = typeof document !== 'undefined' ? document.getElementById('more-trigger')?.getBoundingClientRect() : null
                                    const triggerX = triggerRect?.left || 30
                                    const triggerY = triggerRect?.top || 500

                                    const angle = (index * 35) - 70 // Tighter arc
                                    const radius = 100
                                    const x = Math.cos((angle * Math.PI) / 180) * radius + triggerX + 40
                                    const y = Math.sin((angle * Math.PI) / 180) * radius + triggerY

                                    const iconResult = icons.find(i => i.value === category.icon)
                                    const IconComponent = iconResult?.path || Compass

                                    return (
                                        <motion.div
                                            key={category.id}
                                            initial={{ scale: 0, opacity: 0, x: triggerX, y: triggerY }}
                                            animate={{ scale: 1, opacity: 1, x, y }}
                                            exit={{ scale: 0, opacity: 0, x: triggerX, y: triggerY }}
                                            transition={{
                                                delay: index * 0.03,
                                                type: 'spring',
                                                stiffness: 260,
                                                damping: 20
                                            }}
                                            drag
                                            dragMomentum={false}
                                            onDragStart={() => handleDragStart(category.id)}
                                            onDrag={(e, info) => handleDrag(category.id, info)}
                                            onDragEnd={(e, info) => {
                                                handleDragEnd(category.id, info)
                                                setIsMoreOpen(false)
                                            }}
                                            className="absolute pointer-events-auto group cursor-grab active:cursor-grabbing"
                                        >
                                            <div
                                                onClick={() => {
                                                    pinCategory(category.id)
                                                    setIsMoreOpen(false)
                                                }}
                                                className="w-12 h-12 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center border border-white group-hover:scale-110 transition-transform cursor-pointer"
                                            >
                                                <IconComponent className="text-orange-500 w-6 h-6" />
                                            </div>
                                            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-lg text-orange-600">
                                                {category.label}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Fixed Upgrade Button */}
                {upgradeCategory && (
                    <div className="mt-2 flex flex-col items-center w-full">
                        <button
                            onClick={(e) => handleCategoryClick('upgrade', e)}
                            onMouseEnter={(e) => {
                                setActiveCategory('upgrade')
                                setHoveredMenuItem('upgrade')
                                setPanelTop(e.currentTarget.getBoundingClientRect().top)
                            }}
                            className="w-full py-2 flex flex-col items-center justify-center transition-all duration-200 group relative"
                        >
                            {isCategoryActive(upgradeCategory) && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-[-10px] w-1.5 h-6 bg-white rounded-r-full shadow-lg"
                                />
                            )}
                            <div className={cn(
                                'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 mb-1',
                                isCategoryActive(upgradeCategory) ? 'bg-white shadow-xl' : 'bg-white/10 hover:bg-white/20',
                                activeCategory === 'upgrade' && !isCategoryActive(upgradeCategory) && 'bg-white/20'
                            )}>
                                {(() => {
                                    const iconResult = icons.find(i => i.value === upgradeCategory.icon)
                                    const IconComponent = iconResult?.path || Settings
                                    return (
                                        <IconComponent
                                            className={cn(
                                                'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                                                isCategoryActive(upgradeCategory) ? 'text-orange-600' : 'text-white'
                                            )}
                                        />
                                    )
                                })()}
                            </div>
                            <span className={cn(
                                'text-[7.5px] font-bold uppercase tracking-wider transition-colors duration-200',
                                isCategoryActive(upgradeCategory) ? 'text-white' : 'text-white/60 group-hover:text-white'
                            )}>
                                Upgrade
                            </span>
                        </button>
                    </div>
                )}

            </div>

            {/* User Avatar */}
            <div className="mt-auto pt-3 border-t border-white/20 w-full px-2">
                <div className="w-10 h-10 mx-auto">
                    <UserButton user={user} />
                </div>
            </div>
        </div>
    )
}

export default IconDock
