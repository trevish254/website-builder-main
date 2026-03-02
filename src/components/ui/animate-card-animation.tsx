"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Card {
    id: number
    contentType: 1 | 2 | 3
}

const cardData = {
    1: {
        title: "Project Management",
        description: "Streamline your workflow with agile tools",
        image: "https://images.unsplash.com/photo-1553877615-30c73e63b4aa?auto=format&fit=crop&q=80&w=640",
    },
    2: {
        title: "Team Collaboration",
        description: "Real-time updates and communication",
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=640",
    },
    3: {
        title: "Analytics Dashboard",
        description: "Insights that drive growth and decisions",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=640",
    },
}

const initialCards: Card[] = [
    { id: 1, contentType: 1 },
    { id: 2, contentType: 2 },
    { id: 3, contentType: 3 },
]

const positionStyles = [
    { scale: 1, y: 12 },
    { scale: 0.95, y: -16 },
    { scale: 0.9, y: -44 },
]

const exitAnimation = {
    y: 340,
    scale: 1,
    zIndex: 10,
}

const enterAnimation = {
    y: -16,
    scale: 0.9,
}

function CardContent({ contentType }: { contentType: 1 | 2 | 3 }) {
    const data = cardData[contentType]

    return (
        <div className="flex h-full w-full flex-col gap-4">
            <div className="-outline-offset-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-black/10 dark:outline-white/10">
                <img
                    src={data.image || "/placeholder.svg"}
                    alt={data.title}
                    className="h-full w-full select-none object-cover"
                    draggable={false}
                />
            </div>
            <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-foreground">{data.title}</span>
                    <span className="text-muted-foreground text-sm">{data.description}</span>
                </div>
                <button className="flex h-9 shrink-0 cursor-pointer select-none items-center gap-0.5 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition-opacity hover:opacity-90">
                    Read
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

function AnimatedCard({
    card,
    index,
    isAnimating,
}: {
    card: Card
    index: number
    isAnimating: boolean
}) {
    const { scale, y } = positionStyles[index] ?? positionStyles[2]
    const zIndex = index === 0 && isAnimating ? 10 : 3 - index

    const exitAnim = index === 0 ? exitAnimation : undefined
    const initialAnim = index === 2 ? enterAnimation : undefined

    return (
        <motion.div
            key={card.id}
            initial={initialAnim}
            animate={{ y, scale }}
            exit={exitAnim}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
            layout
            style={{
                zIndex,
                left: "50%",
                x: "-50%",
                bottom: 0,
            }}
            className="absolute flex h-[280px] w-[324px] items-center justify-center overflow-hidden rounded-t-2xl border border-border bg-card p-1 shadow-2xl will-change-transform sm:w-[512px]"
        >
            <CardContent contentType={card.contentType} />
        </motion.div>
    )
}

export default function AnimatedCardStack() {
    const [cards, setCards] = useState(initialCards)
    const [isAnimating, setIsAnimating] = useState(false)
    const [nextId, setNextId] = useState(4)

    const handleAnimate = useCallback(() => {
        if (isAnimating) return
        setIsAnimating(true)

        setCards((prevCards) => {
            const nextContentType = ((prevCards[prevCards.length - 1].contentType % 3) + 1) as 1 | 2 | 3
            return [...prevCards.slice(1), { id: nextId, contentType: nextContentType }]
        })
        setNextId((prev) => prev + 1)

        // Reset animation state after transition
        setTimeout(() => setIsAnimating(false), 500)
    }, [isAnimating, nextId])

    useEffect(() => {
        const timer = setInterval(() => {
            handleAnimate()
        }, 3500) // 3.5 seconds interval

        return () => clearInterval(timer)
    }, [handleAnimate])

    return (
        <div className="flex w-full flex-col items-center justify-center pt-10">
            <div className="relative h-[400px] w-full max-w-[600px] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    {cards.slice(0, 3).map((card, index) => (
                        <AnimatedCard
                            key={card.id}
                            card={card}
                            index={index}
                            isAnimating={isAnimating}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${i === (cards[0].contentType - 1) ? "w-4 bg-primary" : "bg-muted"
                                }`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleAnimate}
                    className="flex h-8 items-center justify-center rounded-full border border-border bg-background px-4 text-xs font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.98]"
                >
                    Fast Forward
                </button>
            </div>
        </div>
    )
}

