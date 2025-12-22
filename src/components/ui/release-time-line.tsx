"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Package, Calendar, Sparkles, Zap, Bot, Users, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TimeLine_01Entry = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    description: string;
    items?: string[];
    image?: string;
    button?: {
        url: string;
        text: string;
    };
};

export interface TimeLine_01Props {
    title?: string;
    description?: string;
    entries?: TimeLine_01Entry[];
    className?: string;
}

export const defaultEntries: TimeLine_01Entry[] = [
    {
        icon: Bot,
        title: "AI Lead Scoring & Automation",
        subtitle: "v3.2.0 • March 2025",
        description:
            "Chapabiz now features advanced AI models that automatically score leads based on intent and behavior, triggering personalized nurturing flows without human intervention.",
        items: [
            "Predictive lead scoring based on cross-channel behavior",
            "Automated appointment setting via AI voice & chat",
            "Dynamic pipeline stages that adjust based on deal probability",
            "Sentiment analysis for client communication",
        ],
        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
        button: {
            url: "/agency",
            text: "Try AI Features",
        },
    },
    {
        icon: Users,
        title: "Multi-Tenant Agency Portal",
        subtitle: "v3.0.0 • Jan 2025",
        description:
            "We've completely overhauled the client experience. The new multi-tenant portal allows white-labeling at scale, giving each of your clients a premium branded dashboard.",
        items: [
            "Custom domain support for individual sub-accounts",
            "Role-based access control for client teams",
            "Whitelabel mobile app support for iOS and Android",
            "Granular permission management for agency staff",
        ],
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics Engine",
        subtitle: "v2.8.0 • Dec 2024",
        description:
            "Get deep insights into your agency's performance with our new real-time analytics engine. Track ROI, client LTV, and team productivity in one place.",
        items: [
            "Cross-subaccount financial reporting",
            "Team performance heatmaps and productivity tracking",
            "Integrated ad spend tracking (FB, Google, TikTok)",
            "Automated weekly client performance reports",
        ],
        image:
            "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=2670&auto=format&fit=crop",
    },
    {
        icon: Globe,
        title: "Global Funnel Infrastructure",
        subtitle: "v2.5.0 • Oct 2024",
        description:
            "Our funnel builder is now powered by a global edge network, ensuring sub-second load times for your landing pages anywhere in the world.",
        items: [
            "Edge-cached landing pages for extreme performance",
            "Visual drag-and-drop editor with 500+ templates",
            "Built-in A/B testing and multivariate optimization",
            "Direct integration with global payment gateways",
        ],
        image:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
        button: {
            url: "/agency",
            text: "Explore Infrastructure",
        },
    },
];

/**
 * Behavior: Only the card that is currently centered in the viewport is "open".
 * As you scroll, the active card expands to reveal its full content. Others stay collapsed.
 */
export default function TimeLine_01({
    title = "Chapabiz Release Journey",
    description = "Stay informed on the latest agency tools, automation features, and platform enhancements designed to help you scale your operations faster.",
    entries = defaultEntries,
}: TimeLine_01Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Create stable setters for refs inside map
    const setItemRef = (el: HTMLDivElement | null, i: number) => {
        itemRefs.current[i] = el;
    };
    const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
        sentinelRefs.current[i] = el;
    };

    useEffect(() => {
        if (!sentinelRefs.current.length) return;

        let frame = 0;
        const updateActiveByProximity = () => {
            frame = requestAnimationFrame(updateActiveByProximity);
            const centerY = window.innerHeight / 3;
            let bestIndex = 0;
            let bestDist = Infinity;
            sentinelRefs.current.forEach((node, i) => {
                if (!node) return;
                const rect = node.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                const dist = Math.abs(mid - centerY);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestIndex = i;
                }
            });
            if (bestIndex !== activeIndex) setActiveIndex(bestIndex);
        };

        frame = requestAnimationFrame(updateActiveByProximity);
        return () => cancelAnimationFrame(frame);
    }, [activeIndex]);

    useEffect(() => {
        setActiveIndex(0);
    }, []);

    return (
        <section className="py-32">
            <div className="container overflow-visible">
                <div className="mx-auto max-w-3xl">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
                        {title}
                    </h1>
                    <p className="mb-6 text-base text-muted-foreground md:text-lg">
                        {description}
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-3xl space-y-16 md:mt-24 md:space-y-24">
                    {entries.map((entry, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={index}
                                className="relative flex flex-col gap-4 md:flex-row md:gap-16"
                                ref={(el) => setItemRef(el, index)}
                                aria-current={isActive ? "true" : "false"}
                            >
                                {/* Sticky meta column */}
                                <div className="top-8 flex h-min w-64 shrink-0 items-center gap-4 md:sticky z-10">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                            }`}>
                                            <entry.icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {entry.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {entry.subtitle}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Invisible sentinel near the card title to measure proximity to viewport center */}
                                <div
                                    ref={(el) => setSentinelRef(el, index)}
                                    aria-hidden
                                    className="absolute -top-24 left-0 h-12 w-12 opacity-0"
                                />

                                {/* Content column */}
                                <article
                                    className={
                                        "flex flex-col rounded-2xl border p-3 transition-all duration-300 w-full " +
                                        (isActive
                                            ? "border-primary/20 bg-gray-50 dark:bg-zinc-900/50 shadow-xl backdrop-blur-sm"
                                            : "border-border bg-transparent")
                                    }
                                >
                                    {entry.image && (
                                        <img
                                            src={entry.image}
                                            alt={`${entry.title} visual`}
                                            className="mb-4 w-full h-72 rounded-lg object-cover"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h2
                                                className={
                                                    "text-md font-medium leading-tight tracking-tight md:text-lg transition-colors duration-200 " +
                                                    (isActive ? "text-foreground" : "text-foreground/70")
                                                }
                                            >
                                                {entry.title}
                                            </h2>

                                            <p
                                                className={
                                                    "text-xs leading-relaxed md:text-sm transition-all duration-300 " +
                                                    (isActive
                                                        ? "text-muted-foreground line-clamp-none"
                                                        : "text-muted-foreground/80 line-clamp-2")
                                                }
                                            >
                                                {entry.description}
                                            </p>
                                        </div>

                                        <div
                                            aria-hidden={!isActive}
                                            className={
                                                "grid transition-all duration-500 ease-out " +
                                                (isActive
                                                    ? "grid-rows-[1fr] opacity-100"
                                                    : "grid-rows-[0fr] opacity-0")
                                            }
                                        >
                                            <div className="overflow-hidden">
                                                <div className="space-y-4 pt-2">
                                                    {entry.items && entry.items.length > 0 && (
                                                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                                                            <ul className="space-y-2">
                                                                {entry.items.map((item, itemIndex) => (
                                                                    <li
                                                                        key={itemIndex}
                                                                        className="flex items-start gap-2 text-sm text-muted-foreground"
                                                                    >
                                                                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                                                        <span className="leading-relaxed">{item}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {entry.button && (
                                                        <div className="flex justify-end pt-2">
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="group font-normal"
                                                                asChild
                                                            >
                                                                <a href={entry.button.url}>
                                                                    {entry.button.text}
                                                                    <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
