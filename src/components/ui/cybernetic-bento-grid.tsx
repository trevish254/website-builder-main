"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Globe,
    Lock,
    Database,
    Terminal,
    Cpu,
    Zap
} from 'lucide-react';

// Reusable BentoItem component with premium styling
const BentoItem = ({ className, children, title, description, icon: Icon, glowColor = "rgba(120, 119, 198, 0.3)" }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        };

        item.addEventListener('mousemove', handleMouseMove);

        return () => {
            item.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={itemRef}
            className={`group relative overflow-hidden rounded-3xl border border-border/50 bg-card/50 dark:bg-zinc-900/50 p-8 transition-all hover:bg-card/80 dark:hover:bg-zinc-900/80 ${className}`}
            style={{
                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${glowColor}, transparent 40%)`
            } as any}
        >
            {/* Spotlight Overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-transform group-hover:scale-110">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
                </div>

                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{description}</p>

                <div className="mt-auto flex-grow">
                    {children}
                </div>
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-primary/10 blur-[80px] transition-all group-hover:bg-primary/20" />
        </div>
    );
};

// Main Component
export const CyberneticBentoGrid = () => {
    return (
        <section className="relative w-full overflow-hidden bg-background py-32 px-4 sm:px-6 lg:px-8">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="mx-auto max-w-7xl">
                <div className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4 px-4">Technical Infrastructure</h2>
                        <h1 className="text-4xl sm:text-6xl font-bold text-foreground tracking-tighter leading-none mb-6">
                            Core Features for<br />
                            <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                                Hyper-Scale
                            </span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Our architecture is designed for performance, resilience, and speed.
                            Deliver world-class experiences with our enterprise backbone.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-[220px]">
                    {/* Real-time Analytics - Big Card */}
                    <BentoItem
                        title="Real-time Analytics"
                        description="Monitor your application's performance with up-to-the-second data streams and visualizations. Built for instant decisions."
                        icon={BarChart3}
                        glowColor="rgba(56, 189, 248, 0.2)"
                        className="md:col-span-2 md:row-span-2"
                    >
                        <div className="mt-8 flex h-full items-end">
                            <div className="w-full flex items-end gap-1.5 h-32 opacity-50 group-hover:opacity-100 transition-opacity">
                                {[40, 70, 45, 90, 65, 80, 55, 75, 95, 85, 60, 45, 80].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-gradient-to-t from-sky-500 to-sky-300 rounded-t-sm"
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </BentoItem>

                    {/* Global CDN */}
                    <BentoItem
                        title="Global CDN"
                        description="Edge delivery at lightning speed world-wide."
                        icon={Globe}
                        glowColor="rgba(244, 114, 182, 0.2)"
                    />

                    {/* Secure Auth */}
                    <BentoItem
                        title="Secure Auth"
                        description="Enterprise-grade user management."
                        icon={Lock}
                        glowColor="rgba(168, 85, 247, 0.2)"
                    />

                    {/* Automated Backups */}
                    <BentoItem
                        title="Automated Backups"
                        description="Always safe with redundant backups."
                        icon={Database}
                        glowColor="rgba(34, 197, 94, 0.2)"
                        className="md:row-span-2 md:col-start-4 md:row-start-1"
                    >
                        <div className="mt-12 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
                                <Database className="h-20 w-20 text-green-500/80 relative z-10" />
                            </div>
                        </div>
                    </BentoItem>

                    {/* Serverless Functions - Wide Card */}
                    <BentoItem
                        title="Serverless Functions"
                        description="Run backend code without managing servers. Scale infinitely with ease using our globally distributed runtime."
                        icon={Zap}
                        glowColor="rgba(234, 179, 8, 0.2)"
                        className="md:col-span-2 md:row-start-3 md:col-start-1"
                    >
                        <div className="mt-4 flex gap-4 overflow-hidden mask-fade-right">
                            {["Index.ts", "Auth.ts", "Compute.ts"].map(file => (
                                <div key={file} className="flex-shrink-0 bg-accent border border-border/50 rounded-lg py-2 px-4 font-mono text-xs text-muted-foreground">
                                    {file}
                                </div>
                            ))}
                        </div>
                    </BentoItem>

                    {/* CLI Tool */}
                    <BentoItem
                        title="CLI Tool"
                        description="Manage infra via terminal."
                        icon={Terminal}
                        glowColor="rgba(249, 115, 22, 0.2)"
                        className="md:row-start-2 md:col-start-3"
                    />

                    {/* Compute Optimization */}
                    <BentoItem
                        title="Compute Optimization"
                        description="CPU-bound task acceleration."
                        icon={Cpu}
                        glowColor="rgba(255, 255, 255, 0.1)"
                        className="md:row-start-3 md:col-start-3"
                    />

                    {/* Scaling Infinite */}
                    <BentoItem
                        title="Infinite Scaling"
                        description="Auto-scaling for massive traffic."
                        icon={Zap}
                        glowColor="rgba(255, 255, 255, 0.1)"
                        className="md:row-start-3 md:col-start-4"
                    />
                </div>
            </div>

            <style jsx>{`
                .mask-fade-right {
                    mask-image: linear-gradient(to right, black 80%, transparent);
                }
            `}</style>
        </section>
    );
};
