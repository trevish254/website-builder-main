"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Plus, Copy, Zap } from "lucide-react";

interface ComponentProps {
    name?: string;
    role?: string;
    email?: string;
    avatarSrc?: string;
    statusText?: string;
    status?: "available" | "busy" | "away" | "offline";
    glowText?: string;
    className?: string;
    onAction?: () => void;
    actionText?: string;
}

export default function ProfileCard({
    name = "Berat Berkay",
    role = "Developer",
    email = "beratberkaygokdemir@gmail.com",
    avatarSrc = "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yc2pLdFl5STR0MkZMcUNKaVNMQVJXRmNBSXIifQ",
    statusText = "Available for work",
    status = "available",
    glowText = "Currently High on Creativity",
    className,
    onAction,
    actionText = "Hire Me",
}: ComponentProps) {
    const [copied, setCopied] = useState(false);

    // Derive a local clock text once per minute
    const timeText = useMemo(() => {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, "0");
        const hour12 = ((h + 11) % 12) + 1;
        const ampm = h >= 12 ? "PM" : "AM";
        return `${hour12}:${m}${ampm}`;
    }, []);

    const handleCopy = async () => {
        if (email) {
            try {
                await navigator.clipboard.writeText(email);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch { }
        }
    };

    const statusColors = {
        available: {
            bg: "bg-lime-400/90",
            shadow: "shadow-[0_40px_80px_-16px_rgba(163,230,53,0.8)]",
            dot: "bg-lime-500"
        },
        busy: {
            bg: "bg-red-500/90",
            shadow: "shadow-[0_40px_80px_-16px_rgba(239,68,68,0.8)]",
            dot: "bg-red-500"
        },
        away: {
            bg: "bg-amber-400/90",
            shadow: "shadow-[0_40px_80px_-16px_rgba(251,191,36,0.8)]",
            dot: "bg-amber-500"
        },
        offline: {
            bg: "bg-slate-100 dark:bg-slate-800/50",
            shadow: "shadow-none",
            dot: "bg-slate-400 dark:bg-slate-500"
        }
    };

    const currentStatus = statusColors[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("relative w-xl", className)}
        >

            <div className={cn(
                "pointer-events-none absolute inset-x-0 -bottom-10 top-[72%] rounded-[28px] blur-0 z-0",
                currentStatus.bg,
                currentStatus.shadow
            )} />


            <div className="absolute inset-x-0 -bottom-10 mx-auto w-full z-0">
                <div className="flex items-center justify-start px-8 gap-2 bg-transparent py-3 text-sm font-medium text-black">
                    <Zap className="h-4 w-4" /> {glowText}
                </div>
            </div>

            <Card className="relative z-10 mx-auto w-full max-w-3xl overflow-visible rounded-[28px] border border-zinc-200 dark:border-0 bg-white dark:bg-[radial-gradient(120%_120%_at_30%_10%,#1a1a1a_0%,#0f0f10_60%,#0b0b0c_100%)] text-zinc-900 dark:text-white shadow-xl dark:shadow-2xl">
                <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between text-sm text-zinc-500 dark:text-neutral-300">
                        <div className="flex items-center gap-2">
                            <span className={cn("inline-block h-2.5 w-2.5 rounded-full animate-pulse", currentStatus.dot)} />
                            <span className="select-none">{statusText}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-80">
                            <Clock className="h-4 w-4" />
                            <span className="tabular-nums">{timeText}</span>
                        </div>
                    </div>


                    <div className="flex items-center gap-5">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-zinc-100 dark:ring-white/10">
                            <Image
                                src={avatarSrc}
                                alt={`${name} avatar`}
                                fill
                                sizes="56px"
                                className="object-cover"
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                                {name}
                            </h3>
                            <p className="mt-0.5 text-sm text-zinc-500 dark:text-neutral-400">{role}</p>
                        </div>
                    </div>


                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Button
                            variant="secondary"
                            onClick={onAction}
                            className="h-12 justify-start gap-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        >
                            <Plus className="h-4 w-4" /> {actionText}
                        </Button>

                        <Button
                            variant="secondary"
                            onClick={handleCopy}
                            className="h-12 justify-start gap-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        >
                            <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy Email"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
