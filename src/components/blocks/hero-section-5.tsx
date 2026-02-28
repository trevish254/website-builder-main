'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { AnimatedTabs } from '@/components/ui/animated-tabs'
import { MorphingText } from '@/components/ui/morphing-text'
import { Banner } from '@/components/ui/banner'
import { Rocket, ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { useScroll, motion, AnimatePresence } from 'framer-motion'

export function HeroSection() {
    const [showBanner, setShowBanner] = React.useState(true)
    return (
        <>
            <HeroHeader />
            <div className="overflow-x-hidden w-full">
                {/* ── HERO ── full viewport, video as background */}
                <section className="relative h-screen w-full overflow-visible bg-background">
                    {/* Video — absolute fills the whole section */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover z-0 opacity-70"
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    />
                    {/* Subtle vignette so text is readable - slightly adjusted for light mode */}
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />

                    {/* ── L-SHAPE CONTAINER ── */}
                    <div className="relative z-20 w-full max-w-[1400px] mx-auto px-8 lg:px-16 h-[95vh] flex flex-col justify-center">
                        {/* Morphing Text at Top Center */}
                        <div className="absolute top-20 left-0 right-0 z-30 flex justify-center pointer-events-none">
                            <MorphingText texts={["Welcome to", "CHAPABIZ"]} className="text-foreground font-futuristic !text-4xl md:!text-5xl lg:!text-6xl" />
                        </div>

                        <div className="relative w-full grid grid-cols-1 lg:grid-cols-[1fr,500px] items-start">

                            {/* PRECISE L-SHAPE BACKGROUND LOGIC */}
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                {/* Glass Parent with unified blur to prevent visible seams */}
                                <div className="absolute inset-0 backdrop-blur-2xl">
                                    {/* 1. Left Content Area (Top part of L) - Rounded bottom-right for Convex curve */}
                                    <div className="absolute top-0 left-0 w-[calc(100%-500px)] h-[100%] bg-muted/40 dark:bg-white/10 rounded-tl-[60px] rounded-bl-[60px] rounded-br-[60px] border-t border-l border-b border-border" />

                                    {/* 2. Right Vertical Area (Tall Overhang part of L) */}
                                    <div className="absolute top-0 right-0 w-[501px] h-[140%] bg-muted/40 dark:bg-white/10 rounded-tr-[60px] rounded-br-[60px] rounded-bl-[60px] border-t border-r border-b border-border border-l-0" />

                                    {/* 3. The Concave Join (Smooth bridge filling the corner) */}
                                    <div className="hidden lg:block absolute bottom-0 right-[500px] w-20 h-20 overflow-hidden pointer-events-none translate-y-full">
                                        <div className="absolute top-0 left-0 w-[160px] h-[160px] rounded-tl-[60px]"
                                            style={{ backgroundColor: 'transparent', boxShadow: '0 0 0 100px rgba(255, 255, 255, 0.1)' }} />
                                        <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-white/20 rounded-tl-[60px]" />
                                    </div>
                                </div>
                            </div>

                            {/* LEFT SIDE: Content */}
                            <div className="relative z-10 p-10 lg:p-20 lg:pb-12">
                                <div className="max-w-2xl">
                                    <h1 className="text-foreground text-5xl font-bold leading-[1.1] md:text-6xl xl:text-7xl text-left">
                                        Run Your Agency,<br />
                                        All in One Place
                                    </h1>
                                    <p className="mt-8 text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed text-left">
                                        Scale your operations, manage pipelines, and build high-converting funnels with the platform designed for modern agency owners.
                                    </p>

                                    {/* Buttons */}
                                    <div className="mt-10 flex flex-row items-center gap-5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 pl-8 pr-6 text-base font-bold shadow-xl">
                                            <Link href="/agency">
                                                Start Free Trial
                                                <ChevronRight className="ml-2 h-5 w-5" />
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="ghost"
                                            className="h-14 rounded-full px-8 text-base text-muted-foreground hover:bg-accent hover:text-foreground font-bold uppercase tracking-wide">
                                            <Link href="#pricing">
                                                View Pricing
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Animated Tabs & Image (Sized to fit inside proportions) */}
                            <div className="lg:absolute lg:inset-y-0 lg:right-0 w-full lg:w-[500px] z-10 p-8 lg:p-12 flex flex-col justify-end pb-12">
                                {/* Character Image container - Sized down to prevent overflow */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 rounded-2xl blur-3xl opacity-20" />
                                    <img
                                        src="/assets/character.png"
                                        alt="Futuristic Character"
                                        className="relative w-full h-[320px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)] border-none"
                                    />
                                </div>
                                {/* Card overlapping the character image */}
                                <div className="-mt-24 relative z-20">
                                    <AnimatedTabs className="w-full shadow-2xl" />
                                </div>

                                {/* Active Members Card & Image Card - Micro-optimized fit in the overhang area */}
                                <div className="absolute top-[101.5%] inset-x-0 z-30 flex items-center justify-center gap-4">
                                    <ActiveMembersCard className="w-[190px] h-[130px] transform hover:scale-105 transition-transform duration-300" />
                                    <ImageCard className="w-[190px] h-[130px] transform hover:scale-105 transition-transform duration-300" />
                                </div>
                            </div>

                            {/* BOTTOM LEFT: Stats Area (Moved to lower red area) */}
                            <div className="lg:absolute lg:top-[115%] lg:left-20 flex flex-wrap items-center gap-x-16 gap-y-6 pt-12 lg:pt-0 z-10">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white tracking-tight">500+</span>
                                    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest mt-2">Components</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white tracking-tight">50+</span>
                                    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest mt-2">Pages</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white tracking-tight">150+</span>
                                    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest mt-2">Customers</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-bold text-white tracking-tight">150+</span>
                                    <span className="text-xs font-semibold text-white/50 uppercase tracking-widest mt-2">Projects</span>
                                </div>

                                {/* Banner positioned next to the counts */}
                                <Banner
                                    show={showBanner}
                                    onHide={() => setShowBanner(false)}
                                    variant="premium"
                                    size="sm"
                                    title="AI Dashboard is here!"
                                    description="Experience the future of analytics"
                                    showShade={true}
                                    closable={true}
                                    icon={<Rocket className="h-4 w-4 text-purple-600" />}
                                    className="w-[320px] backdrop-blur-md bg-white/10 border-white/20 text-white shadow-xl"
                                    action={
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/10"
                                            onClick={() => setShowBanner(false)}
                                        >
                                            Try now
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── LOGO TICKER ── */}
                <section className="w-full bg-white dark:bg-background border-b border-zinc-200 dark:border-border/40">
                    <div className="relative mx-auto max-w-[1400px] px-8 lg:px-16">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="shrink-0 py-6 md:w-44 md:border-r md:border-zinc-200 dark:md:border-border">
                                <p className="text-right text-sm text-zinc-500 dark:text-muted-foreground font-medium">
                                    Powering the best teams
                                </p>
                            </div>
                            <div className="relative py-6 flex-1 overflow-hidden">
                                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                                    <div className="flex items-center">
                                        <img className="h-5 w-auto" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-4 w-auto" src="https://html.tailus.io/blocks/customers/column.svg" alt="Column" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-4 w-auto" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-5 w-auto" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-5 w-auto" src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" alt="LemonSqueezy" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-4 w-auto" src="https://html.tailus.io/blocks/customers/laravel.svg" alt="Laravel" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-7 w-auto" src="https://html.tailus.io/blocks/customers/lilly.svg" alt="Lilly" />
                                    </div>
                                    <div className="flex items-center">
                                        <img className="h-6 w-auto" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI" />
                                    </div>
                                </InfiniteSlider>

                                {/* Edge fades */}
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-background to-transparent" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-background to-transparent" />
                                <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
                                <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </>
    )
}

/* ─────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────── */
const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
]

import { ModeToggle } from '@/components/global/mode-toggle'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

/* ─────────────────────────────────────────
   HERO HEADER
───────────────────────────────────────── */
const HeroHeader = () => {
    const [scrolled, setScrolled] = React.useState(false)
    const [user, setUser] = React.useState<User | null>(null)
    const { scrollYProgress } = useScroll()
    const supabase = createClient()

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        return scrollYProgress.on('change', (v) => setScrolled(v > 0.04))
    }, [scrollYProgress, supabase.auth])

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            {/* ── Navbar ── */}
            <div className={cn(
                'mx-auto max-w-[1400px] px-8 lg:px-16 transition-all duration-300',
                scrolled && 'rounded-b-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl border-x border-b border-border/50'
            )}>
                <div className="flex h-20 items-center justify-between gap-8">

                    {/* LEFT: Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link href="/" aria-label="home" className="flex shrink-0 items-center gap-2">
                            <ChapabizLogo />
                        </Link>
                    </div>

                    {/* CENTER: Nav links */}
                    <nav className="flex items-center gap-6 lg:gap-10">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-[13px] md:text-sm font-medium dark:text-white/50 dark:hover:text-white text-black/50 hover:text-black transition-colors duration-200">
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* RIGHT: Auth buttons & Toggle */}
                    <div className="flex-1 flex justify-end items-center gap-6">
                        <ModeToggle />
                        {user ? (
                            <Button
                                asChild
                                size="sm"
                                className="dark:bg-white dark:text-black bg-black text-white font-bold hover:bg-black/90 dark:hover:bg-white/90 rounded-lg px-6 h-10">
                                <Link href="/agency">Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Link
                                    href="/agency/sign-in"
                                    className="text-sm font-semibold dark:text-white text-black hover:opacity-80 transition-opacity">
                                    Login
                                </Link>
                                <Button
                                    asChild
                                    size="sm"
                                    className="dark:bg-white dark:text-black bg-black text-white font-bold hover:bg-black/90 dark:hover:bg-white/90 rounded-lg px-6 h-10">
                                    <Link href="/agency/sign-up">Sign Up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

/* ─────────────────────────────────────────
   LOGO MARK
───────────────────────────────────────── */
const ChapabizLogo = () => (
    <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 shrink-0">
            <defs>
                <linearGradient id="cg1" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop offset="1" stopColor="#2BC8B7" />
                </linearGradient>
            </defs>
            <rect x="2" y="2" width="9" height="9" rx="2" fill="url(#cg1)" />
            <rect x="13" y="2" width="9" height="9" rx="2" fill="url(#cg1)" opacity="0.7" />
            <rect x="2" y="13" width="9" height="9" rx="2" fill="url(#cg1)" opacity="0.7" />
            <rect x="13" y="13" width="9" height="9" rx="2" fill="url(#cg1)" opacity="0.4" />
        </svg>
        <span className="text-lg font-bold tracking-tight dark:text-white text-black">Chapabiz.</span>
    </div>
)

/* ─────────────────────────────────────────
   ACTIVE MEMBERS CARD
───────────────────────────────────────── */
const ActiveMembersCard = ({ className }: { className?: string }) => {
    return (
        <div className={cn(
            "bg-white/10 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl flex flex-col justify-between border border-white/20",
            className
        )}>
            <div className="flex flex-col">
                <span className="text-3xl font-bold text-white tracking-tighter leading-none mb-1">
                    80k
                </span>
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-tight">
                    Active members
                </span>
            </div>

            <div className="flex -space-x-2 flex-nowrap overflow-visible">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative">
                        <img
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 object-cover flex-shrink-0"
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`}
                            alt="Avatar"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────
   IMAGE CARD (DUPLICATE STYLE)
───────────────────────────────────────── */
const ImageCard = ({ className }: { className?: string }) => {
    return (
        <div className={cn(
            "bg-white/10 backdrop-blur-xl p-1.5 rounded-[1.8rem] shadow-2xl flex flex-col border border-white/20 overflow-hidden",
            className
        )}>
            <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
                    alt="Tech Illustration"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest">
                        Stats
                    </span>
                    <p className="text-[11px] font-bold text-white leading-tight">
                        Real-time Analytics
                    </p>
                </div>
            </div>
        </div>
    )
}
