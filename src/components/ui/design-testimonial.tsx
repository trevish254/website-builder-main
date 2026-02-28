"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"

const testimonials = [
    {
        quote: "Transformed our entire creative process overnight.",
        author: "Sarah Chen",
        role: "Design Director",
        company: "Linear",
    },
    {
        quote: "The most elegant solution we've ever implemented.",
        author: "Marcus Webb",
        role: "Creative Lead",
        company: "Vercel",
    },
    {
        quote: "Pure craftsmanship in every single detail.",
        author: "Elena Frost",
        role: "Head of Product",
        company: "Stripe",
    },
]

export function Testimonial() {
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Mouse position for magnetic effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 200 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    // Transform for parallax on the large number
    const numberX = useTransform(x, [-200, 200], [-20, 20])
    const numberY = useTransform(y, [-200, 200], [-10, 10])

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            mouseX.set(e.clientX - centerX)
            mouseY.set(e.clientY - centerY)
        }
    }

    const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
    const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    useEffect(() => {
        const timer = setInterval(goNext, 6000)
        return () => clearInterval(timer)
    }, [])

    const current = testimonials[activeIndex]

    return (
        <div className="flex items-center justify-center py-24 bg-background overflow-hidden relative">
            <div ref={containerRef} className="relative w-full max-w-5xl px-4" onMouseMove={handleMouseMove}>
                {/* Oversized index number - positioned to bleed off left edge */}
                <motion.div
                    className="absolute -left-12 top-1/2 -translate-y-1/2 text-[20rem] sm:text-[28rem] font-bold text-foreground/[0.03] select-none pointer-events-none leading-none tracking-tighter"
                    style={{ x: numberX, y: numberY }}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="block"
                        >
                            {String(activeIndex + 1).padStart(2, "0")}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>

                {/* Main content - asymmetric layout */}
                <div className="relative flex flex-col md:flex-row">
                    {/* Left column - vertical text (hidden on small screens) */}
                    <div className="hidden md:flex flex-col items-center justify-center pr-16 border-r border-border">
                        <motion.span
                            className="text-xs font-mono text-muted-foreground tracking-widest uppercase"
                            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Testimonials
                        </motion.span>

                        {/* Vertical progress line */}
                        <div className="relative h-32 w-px bg-border mt-8">
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-foreground origin-top"
                                animate={{
                                    height: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                                }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                    </div>

                    {/* mobile title only */}
                    <div className="md:hidden mb-8">
                        <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                            Testimonials — {String(activeIndex + 1).padStart(2, "0")}
                        </span>
                    </div>

                    {/* Center - main content */}
                    <div className="flex-1 md:pl-16 py-4 md:py-12">
                        {/* Company badge */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                                className="mb-8"
                            >
                                <span className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {current.company}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Quote with character reveal */}
                        <div className="relative mb-12 min-h-[160px] md:min-h-[140px]">
                            <AnimatePresence mode="wait">
                                <motion.blockquote
                                    key={activeIndex}
                                    className="text-3xl md:text-5xl font-light text-foreground leading-[1.15] tracking-tight"
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    {current.quote.split(" ").map((word, i) => (
                                        <motion.span
                                            key={i}
                                            className="inline-block mr-[0.3em]"
                                            variants={{
                                                hidden: { opacity: 0, y: 20, rotateX: 90 },
                                                visible: {
                                                    opacity: 1,
                                                    y: 0,
                                                    rotateX: 0,
                                                    transition: {
                                                        duration: 0.5,
                                                        delay: i * 0.05,
                                                        ease: [0.22, 1, 0.36, 1],
                                                    },
                                                },
                                                exit: {
                                                    opacity: 0,
                                                    y: -10,
                                                    transition: { duration: 0.2, delay: i * 0.02 },
                                                },
                                            }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </motion.blockquote>
                            </AnimatePresence>
                        </div>

                        {/* Author row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="flex items-center gap-4"
                                >
                                    {/* Animated line before name */}
                                    <motion.div
                                        className="w-8 h-px bg-foreground"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        style={{ originX: 0 }}
                                    />
                                    <div>
                                        <p className="text-base font-medium text-foreground">{current.author}</p>
                                        <p className="text-sm text-muted-foreground">{current.role}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="flex items-center gap-4">
                                <motion.button
                                    onClick={goPrev}
                                    className="group relative w-12 h-12 rounded-full border border-border flex items-center justify-center overflow-hidden"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute inset-x-0 bottom-0 top-0 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                                    />
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        className="relative z-10 text-foreground group-hover:text-background transition-colors"
                                    >
                                        <path
                                            d="M10 12L6 8L10 4"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </motion.button>

                                <motion.button
                                    onClick={goNext}
                                    className="group relative w-12 h-12 rounded-full border border-border flex items-center justify-center overflow-hidden"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute inset-x-0 bottom-0 top-0 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-300"
                                    />
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        className="relative z-10 text-foreground group-hover:text-background transition-colors"
                                    >
                                        <path
                                            d="M6 4L10 8L6 12"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom ticker - subtle repeating company names */}
                <div className="absolute -bottom-12 md:-bottom-20 left-0 right-0 overflow-hidden opacity-[0.08] pointer-events-none">
                    <motion.div
                        className="flex whitespace-nowrap text-4xl md:text-6xl font-bold tracking-tight"
                        animate={{ x: [0, -500] }}
                        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                        {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-8">
                                {testimonials.map((t) => t.company).join(" • ")} •
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
