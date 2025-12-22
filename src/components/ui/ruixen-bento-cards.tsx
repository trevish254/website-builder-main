"use client"

import React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const cardContents = [
    {
        title: "Agency Operations",
        description:
            "Scale without limits. Manage unlimited pipelines, sub-accounts, and granular team permissions in one unified dashboard designed for agency owners.",
    },
    {
        title: "24/7 AI Automation",
        description:
            "Let AI handle the grunt work. Automated lead scoring, appointment setting, and instant reporting keep your agency running while you sleep.",
    },
    {
        title: "Performance Scaling",
        description:
            "Growth is data-driven. Our advanced analytics engine helps you identify bottlenecks, track real-time ROI, and optimize your client acquisition funnels with precision. With deep-dive reporting, integrated ad spend tracking, and automated weekly performance briefs, you'll always have the clear insights needed to push your agency into its next tier of revenue and efficiency.",
    },
    {
        title: "White-Label Portals",
        description:
            "Your brand, front and center. Provide every client with a premium white-label dashboard, custom domain support, and a branded experience that builds trust.",
    },
    {
        title: "Edge Infrastructure",
        description:
            "Enterprise-grade speed and security. Our global edge network ensures sub-second load times for every funnel, landing page, and client portal.",
    },
]


const PlusCard: React.FC<{
    className?: string
    title: string
    description: string
}> = ({
    className = "",
    title,
    description,
}) => {
        return (
            <div
                className={cn(
                    "relative border border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-6 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm min-h-[200px]",
                    "flex flex-col justify-between group hover:border-primary/50 transition-colors duration-300",
                    className
                )}
            >
                <CornerPlusIcons />
                <div className="relative z-10 space-y-2">
                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        )
    }

const CornerPlusIcons = () => (
    <>
        <PlusIcon className="absolute -top-3 -left-3" />
        <PlusIcon className="absolute -top-3 -right-3" />
        <PlusIcon className="absolute -bottom-3 -left-3" />
        <PlusIcon className="absolute -bottom-3 -right-3" />
    </>
)

const PlusIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width={24}
        height={24}
        strokeWidth="1"
        stroke="currentColor"
        className={`text-stone-400 dark:text-stone-600 size-6 ${className}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
)

export default function RuixenBentoCards() {
    return (
        <section className="bg-transparent">
            <div className="mx-auto container py-12 px-4">
                {/* Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4">
                    <PlusCard {...cardContents[0]} className="lg:col-span-3 lg:row-span-2" />
                    <PlusCard {...cardContents[1]} className="lg:col-span-3 lg:row-span-2" />
                    <PlusCard {...cardContents[2]} className="lg:col-span-4 lg:row-span-1" />
                    <PlusCard {...cardContents[3]} className="lg:col-span-2 lg:row-span-2 sm:row-span-1" />
                    <PlusCard {...cardContents[4]} className="lg:col-span-4 lg:row-span-1" />
                </div>

                {/* Section Footer Heading */}
                <div className="max-w-2xl ml-auto text-right px-4 mt-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-stone-900 dark:text-stone-50 mb-4 tracking-tighter">
                        Engineered for Growth. <br />
                        <span className="text-primary">Built for Agencies.</span>
                    </h2>
                    <p className="text-stone-600 dark:text-stone-400 text-lg">
                        Chapabiz gives you the lethal edge to scale your agency without the operational friction. Every module is a building block for your success.
                    </p>
                </div>
            </div>
        </section>
    )
}
