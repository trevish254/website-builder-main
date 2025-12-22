"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
    Bell,
    BarChart2,
    Users,
    Send,
    Workflow,
    Target,
} from "lucide-react";

const tasks = [
    {
        title: "AI-powered notifications",
        subtitle: "Smart alerts for critical lead events",
        icon: <Bell className="w-4 h-4 text-primary" />,
    },
    {
        title: "Lead Management",
        subtitle: "Automated pipeline tagging & sorting",
        icon: <Target className="w-4 h-4 text-primary" />,
    },
    {
        title: "Pipeline Tracking",
        subtitle: "Real-time conversion metrics",
        icon: <BarChart2 className="w-4 h-4 text-primary" />,
    },
    {
        title: "Funnel Optimization",
        subtitle: "AI-curated A/B testing suggestions",
        icon: <Workflow className="w-4 h-4 text-primary" />,
    },
    {
        title: "Instant Outreach",
        subtitle: "Automated SMS & email nurturing",
        icon: <Send className="w-4 h-4 text-primary" />,
    },
];

export default function FeatureSection() {
    return (
        <section className="relative w-full py-24 px-4 bg-background text-foreground">
            <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                {/* LEFT SIDE - Task Loop with Vertical Bar */}
                <div className="relative w-full max-w-sm mx-auto md:mx-0">
                    <Card className="overflow-hidden bg-muted/30 dark:bg-zinc-900/40 border-primary/20 backdrop-blur-md shadow-2xl rounded-2xl">
                        <CardContent className="relative h-[340px] p-0 overflow-hidden">
                            {/* Scrollable Container */}
                            <div className="relative h-full overflow-hidden">
                                {/* Motion list */}
                                <motion.div
                                    className="flex flex-col gap-2 absolute w-full"
                                    animate={{ y: ["0%", "-50%"] }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        duration: 18,
                                        ease: "linear",
                                    }}
                                >
                                    {[...tasks, ...tasks].map((task, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-zinc-800/50 relative"
                                        >
                                            {/* Icon + Content */}
                                            <div className="flex items-center justify-between flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/10 dark:bg-primary/20 w-10 h-10 rounded-xl flex items-center justify-center">
                                                        {task.icon}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{task.title}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{task.subtitle}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                                {/* Fade effect only inside card */}
                                <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-card via-card/50 to-transparent pointer-events-none z-10" />
                                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-card via-card/50 to-transparent pointer-events-none z-10" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -z-10 -bottom-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-3xl opacity-50" />
                </div>

                {/* RIGHT SIDE - Content */}
                <div className="space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="h-px w-8 bg-primary" />
                        <Badge variant="secondary" className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border-primary/20">
                            Workflow Automation
                        </Badge>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                            Automate Repetitive <br />
                            <span className="text-primary">Agency Tasks</span>
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We help you streamline operations with AI-driven automation—from pipeline management and conversion tracking to instant reporting and smart notifications.
                        </p>
                        <p className="text-base text-muted-foreground/80 leading-relaxed font-medium">
                            Our solutions reduce human error, save incredible amounts of time, and scale effortlessly with your agency's growing needs.
                        </p>
                    </div>

                    <div className="flex gap-4 flex-wrap pt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-semibold">AI Task Bots</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-semibold">100+ Automations</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-xs font-semibold">Enterprise Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
