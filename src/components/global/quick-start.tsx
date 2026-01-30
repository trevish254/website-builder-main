'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Code2,
    Image as ImageIcon,
    Video,
    Brush,
    Maximize2,
    Calendar,
    MoreHorizontal,
    Play,
    CloudUpload,
    Sparkles,
    Zap,
    Brain,
    ChevronRight,
    Building2,
    Users,
    CheckSquare,
    FileText,
    MessageSquare,
    Rocket,
    LayoutGrid,
    Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickStartProps {
    userName?: string
    userImage?: string | null
    agencyIcon?: string | null
}

const AI_MODELS = [
    {
        name: 'NeuroFlux v.1.4',
        desc: 'Fast quality model for Aurora',
        tags: ['Fast', 'Quality', '1024px'],
        gradient: 'from-blue-500 to-purple-600',
        icon: Zap
    },
    {
        name: 'DeepQuanta 2.0A',
        desc: 'New slow frontier model',
        tags: ['2 Images', '25s', '1024px'],
        gradient: 'from-orange-500 to-pink-600',
        icon: Brain
    },
    {
        name: 'NeuraNova 1.1 PRO',
        desc: 'Distilled frontier model',
        tags: ['4 images', '30s', 'Styles'],
        gradient: 'from-pink-500 to-purple-600',
        icon: Sparkles
    }
]

const QUICK_ACTIONS = [
    { label: 'Dashboard', icon: LayoutGrid },
    { label: 'Sub Accounts', icon: Building2 },
    { label: 'Team', icon: Users },
    { label: 'Docs', icon: FileText },
    { label: 'Tasks', icon: CheckSquare },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Calendar', icon: Calendar },
    { label: 'Upgrade', icon: Rocket },
]

const SLIDES = [
    {
        id: 0,
        title: 'Introducing QuickSuite 2024',
        description: 'Experience the next generation of business management tools designed to streamline your workflow and boost productivity.',
        isVideo: false,
        gradient: 'from-blue-600 via-cyan-600 to-teal-600',
        icon: Sparkles
    },
    {
        id: 1,
        title: 'Watch A 3 Minute Overview',
        description: 'Get started with QuickSuite by watching this overview video covering all essential features and capabilities.',
        isVideo: true,
        gradient: 'from-violet-600 via-purple-600 to-pink-600',
        icon: Play
    },
    {
        id: 2,
        title: 'AI-Powered Automation',
        description: 'Leverage cutting-edge artificial intelligence to automate repetitive tasks and make data-driven decisions faster.',
        isVideo: false,
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        icon: Brain
    },
    {
        id: 3,
        title: 'Real-Time Collaboration',
        description: 'Work seamlessly with your team across multiple projects with live updates, shared workspaces, and instant messaging.',
        isVideo: false,
        gradient: 'from-green-500 via-emerald-500 to-teal-600',
        icon: Users
    },
    {
        id: 4,
        title: 'Advanced Analytics Dashboard',
        description: 'Gain actionable insights with comprehensive analytics, custom reports, and beautiful data visualizations.',
        isVideo: false,
        gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
        icon: LayoutGrid
    },
]

const NewsSlideshow = () => {
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [isPaused, setIsPaused] = React.useState(false)
    const inactivityTimerRef = React.useRef<NodeJS.Timeout | null>(null)
    const slideIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

    const currentSlideData = SLIDES[currentSlide]

    // Auto-advance slideshow
    React.useEffect(() => {
        if (!isPaused) {
            slideIntervalRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
            }, 4000) // Change slide every 4 seconds
        }

        return () => {
            if (slideIntervalRef.current) clearInterval(slideIntervalRef.current)
        }
    }, [isPaused])

    const handleVideoClick = () => {
        // Jump to video slide
        setCurrentSlide(1)
        setIsPaused(true)

        // Clear existing timer
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)

        // Resume slideshow after 2.5 seconds of inactivity
        inactivityTimerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 2500)
    }

    const handleSlideClick = (index: number) => {
        setCurrentSlide(index)
        setIsPaused(true)

        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)

        inactivityTimerRef.current = setTimeout(() => {
            setIsPaused(false)
        }, 2500)
    }

    return {
        currentSlideData,
        controls: (
            <div className="flex items-center gap-12 mt-8">
                <button onClick={handleVideoClick} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full border border-foreground/20 dark:border-white/20 flex items-center justify-center group-hover:bg-foreground group-hover:border-foreground transition-all">
                        <Play className="w-4 h-4 text-foreground group-hover:text-background transition-colors fill-current" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Watch launch video</span>
                </button>

                <div className="flex gap-1.5 items-center">
                    {SLIDES.map((slide, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSlideClick(idx)}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300 cursor-pointer hover:bg-foreground/50",
                                idx === currentSlide ? "w-4 bg-foreground" : "bg-foreground/20 w-1",
                                slide.isVideo && "ring-1 ring-primary/40 ring-offset-1 dark:ring-white/40 ring-offset-transparent"
                            )}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

const NewsCardContent = () => {
    const { currentSlideData, controls } = NewsSlideshow()
    const IconComponent = currentSlideData.icon

    return (
        <>
            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between relative z-10">
                <div className="flex flex-col gap-8 max-w-lg">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">News</span>

                    <motion.div
                        key={currentSlideData.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-4"
                    >
                        <h2 className="text-4xl font-semibold leading-tight text-foreground/90">
                            {currentSlideData.title}
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {currentSlideData.description}
                        </p>
                    </motion.div>
                </div>

                {controls}
            </div>

            {/* Visual Section - Dynamic based on slide */}
            <div className="flex-1 relative hidden lg:block">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-[320px]">
                    <div className="relative w-full h-full">
                        {/* Main Card */}
                        <motion.div
                            key={`main-${currentSlideData.id}`}
                            initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
                            animate={{ opacity: 1, scale: 1, rotate: 2 }}
                            transition={{ duration: 0.6 }}
                            className={cn(
                                "absolute right-0 top-0 w-[240px] h-[300px] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl z-20 bg-gradient-to-br flex items-center justify-center",
                                currentSlideData.gradient
                            )}
                        >
                            {currentSlideData.isVideo ? (
                                <div className="relative w-full h-full flex items-center justify-center bg-black/20">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md rounded-lg p-2">
                                        <div className="text-xs text-white/80 font-medium">3:00</div>
                                        <div className="w-full h-1 bg-white/20 rounded-full mt-1">
                                            <div className="w-0 h-full bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <IconComponent className="w-24 h-24 text-white/30" />
                            )}
                        </motion.div>

                        {/* Secondary Card */}
                        <motion.div
                            key={`secondary-${currentSlideData.id}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="absolute right-32 bottom-0 w-[120px] h-[120px] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl -rotate-[5deg] z-30 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
                        >
                            <Zap className="w-12 h-12 text-white/40" />
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="absolute right-4 bottom-8 flex items-center gap-3 bg-foreground px-4 py-2.5 rounded-full shadow-2xl z-40 cursor-pointer hover:scale-105 transition-transform"
                        >
                            <CloudUpload className="w-4 h-4 text-background" />
                            <span className="text-xs font-bold text-background uppercase">
                                {currentSlideData.isVideo ? 'Watch Now' : 'Learn More'}
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function QuickStart({ userName = 'Alex', userImage, agencyIcon }: QuickStartProps) {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const bubbleContainerRef = React.useRef<HTMLDivElement>(null)
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
    const [time, setTime] = React.useState(0)

    // Animate time for idle floating
    React.useEffect(() => {
        let animationFrame: number
        const animate = () => {
            setTime(Date.now() / 1000)
            animationFrame = requestAnimationFrame(animate)
        }
        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [])

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const container = scrollContainerRef.current
        if (!container) return

        const { scrollTop, scrollHeight, clientHeight } = container
        const isScrollingDown = e.deltaY > 0
        const isScrollingUp = e.deltaY < 0

        // Prevent page scroll if we're scrolling within the container
        if (
            (isScrollingDown && scrollTop < scrollHeight - clientHeight) ||
            (isScrollingUp && scrollTop > 0)
        ) {
            e.stopPropagation()
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = bubbleContainerRef.current
        if (!container) return

        const rect = container.getBoundingClientRect()
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    // Get idle floating animation offset
    const getIdleOffset = (speed: number, amplitude: number, phaseX: number, phaseY: number) => {
        return {
            x: Math.sin(time * speed + phaseX) * amplitude,
            y: Math.cos(time * speed * 0.8 + phaseY) * amplitude
        }
    }

    // Calculate bubble displacement based on cursor proximity
    const getBubbleOffset = (bubbleX: number, bubbleY: number, speed: number, amplitude: number, phaseX: number, phaseY: number) => {
        const dx = mousePosition.x - bubbleX
        const dy = mousePosition.y - bubbleY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const influenceRadius = 150 // pixels from cursor that affects bubbles

        // Get idle animation
        const idle = getIdleOffset(speed, amplitude, phaseX, phaseY)

        if (distance < influenceRadius && distance > 0) {
            const force = (influenceRadius - distance) / influenceRadius
            const angle = Math.atan2(dy, dx)
            const pushDistance = force * 40 // max push distance

            return {
                x: idle.x - Math.cos(angle) * pushDistance,
                y: idle.y - Math.sin(angle) * pushDistance
            }
        }

        return idle
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
            {/* Header Section */}
            <div className="relative h-[240px] w-full rounded-[32px] overflow-hidden group">
                {/* Agency Icon Background - Full Width */}
                <div className="absolute inset-0">
                    {/* Agency icon or gradient fallback */}
                    {agencyIcon ? (
                        <Image
                            src={agencyIcon}
                            fill
                            className="object-cover"
                            alt="Agency Background"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
                    )}

                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Cosmic accents */}
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.3),transparent_50%)]" />
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_80%,rgba(236,72,153,0.3),transparent_50%)]" />
                </div>

                <div className="absolute inset-0 flex items-center px-12 gap-8">
                    {/* Profile Card - Left Side */}
                    <div className="relative w-[320px] h-[160px] rounded-[24px] overflow-hidden border border-white/10 backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {userImage ? (
                                <Image
                                    src={userImage}
                                    fill
                                    className="object-cover"
                                    alt="User Profile"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
                                    {userName?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-[#00FF85] animate-pulse" />
                                <span className="text-xs text-white/80 font-medium">Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Greeting Text - Right Side */}
                    <div className="flex flex-col z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-semibold tracking-tight text-white drop-shadow-lg"
                        >
                            Hey {userName}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl text-white/80 font-light mt-1 drop-shadow-md"
                        >
                            what would you like to do?
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center justify-between bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 rounded-full px-2 py-2 backdrop-blur-2xl">
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {QUICK_ACTIONS.map((action, idx) => (
                        <button
                            key={idx}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-black/10 dark:hover:bg-white/[0.08] transition-all group whitespace-nowrap"
                        >
                            <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{action.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1 shrink-0 px-2">
                    <button className="p-2.5 rounded-full hover:bg-black/10 dark:hover:bg-white/[0.08] transition-all">
                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Bottom Content Grid */}
            <div className="grid grid-cols-12 gap-6 pb-12">
                {/* Left Column: Recents */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Recents</h3>
                    </div>

                    {/* Empty State */}
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-black/20 dark:text-white/30" />
                        </div>
                        <p className="text-sm text-foreground/60 dark:text-white/40 text-center mb-1 font-medium">No recent activity</p>
                        <p className="text-xs text-muted-foreground text-center">Get started by exploring the dashboard</p>
                    </div>
                </div>

                {/* News Card with Slideshow */}
                <div className="col-span-12 lg:col-span-9 relative bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl flex min-h-[400px]">
                    <NewsCardContent />
                </div>
            </div>

            {/* Balance Dashboard Section */}
            <div className="grid grid-cols-12 gap-6 pb-12">
                {/* Left Side: Balance Visualization */}
                <div className="col-span-12 lg:col-span-8 bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden">
                    {/* Light mode background flourish */}
                    <div className="absolute inset-0 bg-blue-50/50 dark:hidden" />
                    {/* Balance Header */}
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-semibold text-foreground">Overall Completion</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-5xl font-bold text-foreground">73%</div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-green-500 font-bold">↑ 12%</span>
                                    <span className="text-xs text-muted-foreground">from last month</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bubble Visualization */}
                    <div
                        ref={bubbleContainerRef}
                        onMouseMove={handleMouseMove}
                        className="relative h-[400px] flex items-center justify-center mb-8"
                    >
                        {/* Background glow effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]" />

                        {/* Center bubble - 80% - Sub-Accounts */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: getBubbleOffset(200, 200, 0.3, 10, 0, 0).x,
                                y: getBubbleOffset(200, 200, 0.3, 10, 0, 0).y,
                            }}
                            transition={{
                                scale: { duration: 0.5, delay: 0.2 },
                                opacity: { duration: 0.5, delay: 0.2 },
                                x: { type: "spring", stiffness: 200, damping: 20 },
                                y: { type: "spring", stiffness: 200, damping: 20 }
                            }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-500/80 via-blue-600/80 to-blue-800/80 flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(59,130,246,0.5)] backdrop-blur-xl z-20"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="text-center relative z-10">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-white font-bold text-lg drop-shadow-lg">80%</div>
                            </div>
                        </motion.div>

                        {/* Purple bubble - 51% - Teams */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: getBubbleOffset(100, 220, 0.25, 15, 1, 2).x,
                                y: getBubbleOffset(100, 220, 0.25, 15, 1, 2).y,
                            }}
                            transition={{
                                scale: { duration: 0.5, delay: 0.3 },
                                opacity: { duration: 0.5, delay: 0.3 },
                                x: { type: "spring", stiffness: 180, damping: 18 },
                                y: { type: "spring", stiffness: 180, damping: 18 }
                            }}
                            className="absolute left-[25%] top-[55%] -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full bg-gradient-to-br from-purple-400/80 via-purple-500/80 to-purple-700/80 flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.5)] backdrop-blur-xl z-10"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="text-center relative z-10">
                                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-white font-bold drop-shadow-lg">51%</div>
                            </div>
                        </motion.div>

                        {/* Green bubble - Tasks */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: getBubbleOffset(120, 100, 0.28, 12, 2, 1).x,
                                y: getBubbleOffset(120, 100, 0.28, 12, 2, 1).y,
                            }}
                            transition={{
                                scale: { duration: 0.5, delay: 0.4 },
                                opacity: { duration: 0.5, delay: 0.4 },
                                x: { type: "spring", stiffness: 190, damping: 19 },
                                y: { type: "spring", stiffness: 190, damping: 19 }
                            }}
                            className="absolute left-[30%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-gradient-to-br from-green-400/80 via-green-500/80 to-green-700/80 flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(34,197,94,0.5)] backdrop-blur-xl z-15"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="text-center relative z-10">
                                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <CheckSquare className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Orange bubble - Documents */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: getBubbleOffset(300, 200, 0.32, 8, 3, 4).x,
                                y: getBubbleOffset(300, 200, 0.32, 8, 3, 4).y,
                            }}
                            transition={{
                                scale: { duration: 0.5, delay: 0.5 },
                                opacity: { duration: 0.5, delay: 0.5 },
                                x: { type: "spring", stiffness: 185, damping: 18 },
                                y: { type: "spring", stiffness: 185, damping: 18 }
                            }}
                            className="absolute right-[25%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full bg-gradient-to-br from-orange-400/80 via-orange-500/80 to-orange-700/80 flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(251,146,60,0.5)] backdrop-blur-xl z-10"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="text-center relative z-10">
                                <div className="w-9 h-9 mx-auto mb-1 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Cyan bubble - Analytics */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                x: getBubbleOffset(320, 120, 0.27, 14, 4, 3).x,
                                y: getBubbleOffset(320, 120, 0.27, 14, 4, 3).y,
                            }}
                            transition={{
                                scale: { duration: 0.5, delay: 0.6 },
                                opacity: { duration: 0.5, delay: 0.6 },
                                x: { type: "spring", stiffness: 195, damping: 19 },
                                y: { type: "spring", stiffness: 195, damping: 19 }
                            }}
                            className="absolute right-[20%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[130px] h-[130px] rounded-full bg-gradient-to-br from-cyan-400/80 via-cyan-500/80 to-blue-600/80 flex items-center justify-center border border-white/20 shadow-[0_8px_32px_0_rgba(6,182,212,0.5)] backdrop-blur-xl z-15"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <div className="text-center relative z-10">
                                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Small purple bubbles */}
                        <motion.div
                            animate={{
                                x: getBubbleOffset(60, 140, 0.35, 8, 5, 6).x,
                                y: getBubbleOffset(60, 140, 0.35, 8, 5, 6).y,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 170, damping: 17 },
                                y: { type: "spring", stiffness: 170, damping: 17 }
                            }}
                            className="absolute left-[15%] top-[35%] w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-400/70 to-purple-700/70 border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.4)] backdrop-blur-lg"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>

                        <motion.div
                            animate={{
                                x: getBubbleOffset(340, 260, 0.29, 10, 6, 5).x,
                                y: getBubbleOffset(340, 260, 0.29, 10, 6, 5).y,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 165, damping: 16 },
                                y: { type: "spring", stiffness: 165, damping: 16 }
                            }}
                            className="absolute right-[15%] top-[65%] w-[70px] h-[70px] rounded-full bg-gradient-to-br from-purple-500/70 to-purple-800/70 border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.4)] backdrop-blur-lg"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>

                        <motion.div
                            animate={{
                                x: getBubbleOffset(180, 40, 0.33, 6, 7, 8).x,
                                y: getBubbleOffset(180, 40, 0.33, 6, 7, 8).y,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 175, damping: 17 },
                                y: { type: "spring", stiffness: 175, damping: 17 }
                            }}
                            className="absolute left-[45%] top-[10%] w-[50px] h-[50px] rounded-full bg-gradient-to-br from-purple-400/70 to-indigo-700/70 border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.4)] backdrop-blur-lg"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>

                        <motion.div
                            animate={{
                                x: getBubbleOffset(260, 300, 0.31, 9, 8, 7).x,
                                y: getBubbleOffset(260, 300, 0.31, 9, 8, 7).y,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 168, damping: 16 },
                                y: { type: "spring", stiffness: 168, damping: 16 }
                            }}
                            className="absolute right-[35%] top-[75%] w-[55px] h-[55px] rounded-full bg-gradient-to-br from-purple-500/70 to-purple-900/70 border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.4)] backdrop-blur-lg"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>

                        {/* Small accent bubbles */}
                        <motion.div
                            animate={{
                                x: getBubbleOffset(280, 80, 0.34, 7, 9, 10).x,
                                y: getBubbleOffset(280, 80, 0.34, 7, 9, 10).y,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 172, damping: 17 },
                                y: { type: "spring", stiffness: 172, damping: 17 }
                            }}
                            className="absolute left-[70%] top-[20%] w-[45px] h-[45px] rounded-full bg-gradient-to-br from-blue-400/70 to-blue-700/70 border border-white/20 shadow-[0_8px_32px_0_rgba(59,130,246,0.4)] backdrop-blur-lg"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>

                        <motion.div
                            animate={{
                                x: getBubbleOffset(80, 280, 0.26, 11, 10, 9).x,
                                y: getBubbleOffset(80, 280, 0.26, 11, 10, 9).y,
                            }}
                            transition={{
                                x: { type: "spring", stiffness: 178, damping: 18 },
                                y: { type: "spring", stiffness: 178, damping: 18 }
                            }}
                            className="absolute left-[20%] top-[70%] w-[40px] h-[40px] rounded-full bg-gradient-to-br from-red-300/70 to-pink-600/70 border border-white/20 shadow-[0_8px_32px_0_rgba(239,68,68,0.4)] backdrop-blur-lg"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 relative z-10">
                        {/* Sub-Accounts Card */}
                        <div className="bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                <div className="text-sm text-muted-foreground">Sub-Accounts</div>
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-2">3 / 10</div>
                            <div className="text-xs text-muted-foreground/60 mb-2">30% capacity used</div>
                            <div className="h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '30%' }} />
                            </div>
                        </div>

                        {/* Teams Card */}
                        <div className="bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-5 h-5 text-purple-500" />
                                <div className="text-sm text-muted-foreground">Teams</div>
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-2">12 / 50</div>
                            <div className="text-xs text-muted-foreground/60 mb-2">24% members active</div>
                            <div className="h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '24%' }} />
                            </div>
                        </div>

                        {/* Tasks Card */}
                        <div className="bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckSquare className="w-5 h-5 text-green-500" />
                                <div className="text-sm text-muted-foreground">Tasks</div>
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-2">45 / 120</div>
                            <div className="text-xs text-muted-foreground/60 mb-2">37% completed</div>
                            <div className="h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '37%' }} />
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-black/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/5 rounded-2xl p-4 backdrop-blur-md">
                            <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-5 h-5 text-orange-500" />
                                <div className="text-sm text-muted-foreground">Documents</div>
                            </div>
                            <div className="text-2xl font-bold text-foreground mb-2">89 / 500</div>
                            <div className="text-xs text-muted-foreground/60 mb-2">18% storage used</div>
                            <div className="h-1.5 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: '18%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Setup Progress Tracker */}
                <div
                    ref={scrollContainerRef}
                    onWheel={handleWheel}
                    className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full max-h-[900px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent"
                >
                    {/* Sub-Accounts Section */}
                    <div className="bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Building2 className="w-10 h-10 text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Sub-Accounts</h3>
                                <p className="text-xs text-muted-foreground">Create and manage independent business units</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Create your first sub-account</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Define the sub-account's industry</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Assign an owner or admin</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Configure access permissions</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>Progress</span>
                                <span>0 / 4 completed</span>
                            </div>
                            <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        <button className="w-full px-4 py-2.5 text-sm font-medium bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-xl transition-all border border-blue-500/20 dark:border-blue-500/30">
                            Set up sub-account
                        </button>
                    </div>

                    {/* Teams Section */}
                    <div className="bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-10 h-10 text-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Teams</h3>
                                <p className="text-xs text-muted-foreground">Collaborate with the right people</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Invite team members</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Assign roles and permissions</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-purple-500 focus:ring-purple-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Organize members into teams or departments</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>Progress</span>
                                <span>0 / 3 completed</span>
                            </div>
                            <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        <button className="w-full px-4 py-2.5 text-sm font-medium bg-purple-500/10 dark:bg-purple-500/20 hover:bg-purple-500/20 dark:hover:bg-purple-500/30 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all border border-purple-500/20 dark:border-blue-500/30">
                            Manage teams
                        </button>
                    </div>

                    {/* Tasks Section */}
                    <div className="bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckSquare className="w-10 h-10 text-green-500 drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
                                <p className="text-xs text-muted-foreground">Organize and track work</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-green-500 focus:ring-green-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Add your first task</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-green-500 focus:ring-green-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Set task priorities</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-green-500 focus:ring-green-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Assign tasks to teammates</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-green-500 focus:ring-green-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Set task deadlines</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>Progress</span>
                                <span>0 / 4 completed</span>
                            </div>
                            <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        <button className="w-full px-4 py-2.5 text-sm font-medium bg-green-500/10 dark:bg-green-500/20 hover:bg-green-500/20 dark:hover:bg-green-500/30 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 rounded-xl transition-all border border-green-500/20 dark:border-blue-500/30">
                            Create tasks
                        </button>
                    </div>

                    {/* Documents Section */}
                    <div className="bg-card dark:bg-white/[0.03] border border-border dark:border-white/5 rounded-[32px] p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="w-10 h-10 text-orange-500 drop-shadow-[0_0_12px_rgba(251,146,60,0.4)]" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Documents</h3>
                                <p className="text-xs text-muted-foreground">Store and share business files</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 mb-4">
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Upload your first document</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Organize documents into folders</span>
                            </label>
                            <label className="flex items-start gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-orange-500 focus:ring-orange-500 focus:ring-offset-0" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">Control access and visibility</span>
                            </label>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>Progress</span>
                                <span>0 / 3 completed</span>
                            </div>
                            <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        <button className="w-full px-4 py-2.5 text-sm font-medium bg-orange-500/10 dark:bg-orange-500/20 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 rounded-xl transition-all border border-orange-500/20 dark:border-blue-500/30">
                            Open documents
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
