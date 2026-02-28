'use client';

import React from "react";
import { motion } from "framer-motion";

interface SectionWithMockupProps {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    primaryImageSrc: string;
    secondaryImageSrc: string;
    reverseLayout?: boolean;
}

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
    title,
    description,
    primaryImageSrc,
    secondaryImageSrc,
    reverseLayout = false,
}) => {

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    const layoutClasses = reverseLayout
        ? "md:grid-cols-2 md:grid-flow-col-dense"
        : "md:grid-cols-2";

    const textOrderClass = reverseLayout ? "md:col-start-2" : "";
    const imageOrderClass = reverseLayout ? "md:col-start-1" : "";


    return (
        <section className="relative py-24 md:py-48 bg-background overflow-hidden border-y border-border/50">
            <div className="container max-w-[1220px] w-full px-6 md:px-10 relative z-10 mx-auto">
                <motion.div
                    className={`grid grid-cols-1 gap-16 md:gap-8 w-full items-center ${layoutClasses}`}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Text Content */}
                    <motion.div
                        className={`flex flex-col items-start gap-4 mt-10 md:mt-0 max-w-[546px] mx-auto md:mx-0 ${textOrderClass}`}
                        variants={itemVariants}
                    >
                        <div className="space-y-2 md:space-y-1">
                            <h2 className="text-foreground text-3xl md:text-[40px] font-semibold leading-tight md:leading-[53px]">
                                {title}
                            </h2>
                        </div>

                        <p className="text-muted-foreground text-sm md:text-[15px] leading-6">
                            {description}
                        </p>
                    </motion.div>

                    {/* App mockup/Content */}
                    <motion.div
                        className={`relative mt-10 md:mt-0 mx-auto ${imageOrderClass} w-full max-w-[320px] md:max-w-[500px] h-[500px] md:h-[700px] flex items-center justify-center`}
                        variants={itemVariants}
                    >
                        {/* Secondary Background Layer - Simulated with content */}
                        <motion.div
                            className={`absolute w-[280px] h-[400px] md:w-[420px] md:h-[550px] bg-muted/40 rounded-[32px] z-0 border border-border opacity-40`}
                            style={{
                                top: reverseLayout ? 'auto' : '5%',
                                bottom: reverseLayout ? '5%' : 'auto',
                                left: reverseLayout ? 'auto' : '-10%',
                                right: reverseLayout ? '-10%' : 'auto',
                                filter: 'blur(2px)'
                            }}
                            initial={{ y: 0 }}
                            whileInView={{ y: -30 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <div className="p-8 space-y-4">
                                <div className="h-4 w-1/2 bg-foreground/10 rounded"></div>
                                <div className="h-2 w-full bg-foreground/5 rounded"></div>
                                <div className="h-2 w-3/4 bg-foreground/5 rounded"></div>
                                <div className="pt-8 h-32 w-full bg-foreground/5 rounded-2xl"></div>
                            </div>
                        </motion.div>

                        {/* Main Mockup Card - Intelligence Dashboard */}
                        <motion.div
                            className="relative w-full h-full bg-card/50 dark:bg-[#121212]/80 rounded-[40px] backdrop-blur-2xl border border-border z-10 overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex flex-col"
                            initial={{ y: 0 }}
                            whileInView={{ y: 30 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <div className="p-8 md:p-10 flex flex-col h-full overflow-hidden">
                                {/* Header Section */}
                                <div className="space-y-4 mb-8">
                                    <h3 className="text-foreground text-xl md:text-2xl font-bold tracking-tight">Watchlist performance</h3>
                                    <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-3">
                                        Watchlist enthusiasts, tune your antennas. Microsoft usurps Apple's crown in market value, thanks to AI's siren call. Apple battles turbulence, from iPhone price cuts in a weary China, to pending antitrust skirmishes.
                                    </p>
                                </div>

                                {/* Main Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-muted/50 border border-border/50 rounded-2xl p-5 flex flex-col items-center justify-center transition hover:bg-muted">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 font-mono">S&P 500</span>
                                        <span className="text-2xl font-bold text-rose-500 tracking-tighter">-0.07%</span>
                                    </div>
                                    <div className="bg-muted/50 border border-border/50 rounded-2xl p-5 flex flex-col items-center justify-center transition hover:bg-muted">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 font-mono">Your watchlist</span>
                                        <span className="text-2xl font-bold text-emerald-500 tracking-tighter">+2.16%</span>
                                    </div>
                                </div>

                                {/* List Section */}
                                <div className="flex-1 space-y-1 overflow-visible">
                                    <div className="flex justify-between items-center px-1 mb-4">
                                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Top movers</span>
                                        <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Weekly performance</span>
                                    </div>

                                    {[
                                        { symbol: "CART", name: "Maplebear Inc.", price: "38.22", change: "+1.30", pct: "-3.40%", up: false },
                                        { symbol: "NVDA", name: "NVIDIA Corporation", price: "903.50", change: "+70.96", pct: "+8.51%", up: true },
                                        { symbol: "AAPL", name: "Apple Inc.", price: "173.10", change: "+11.33", pct: "+6.22%", up: true },
                                        { symbol: "TSLA", name: "Tesla Inc.", price: "163.57", change: "-5.34", pct: "-3.27%", up: false },
                                    ].map((mover, i) => (
                                        <div key={mover.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition group">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center border border-border group-hover:scale-110 transition duration-300">
                                                    <span className="text-[10px] font-bold text-foreground">{mover.symbol[0]}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-foreground">{mover.symbol}</span>
                                                    <span className="text-[10px] text-muted-foreground">{mover.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs font-mono text-foreground/80">${mover.price}</span>
                                                <div className={`px-2 py-1 rounded-md text-[10px] font-bold min-w-[55px] text-center ${mover.up ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                                                    {mover.pct}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom Feature */}
                                <div className="mt-8 pt-8 border-t border-border space-y-4">
                                    <h4 className="text-foreground text-xs font-bold tracking-tight">Earnings announcements</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-1 h-3 bg-emerald-500 rounded-full" />
                                            <span className="text-[11px] font-bold text-foreground/80">NVDA</span>
                                            <span className="text-[11px] text-muted-foreground">Q3 2025 earnings report</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-1 opacity-50">
                                            <div className="w-1 h-3 bg-indigo-500 rounded-full" />
                                            <span className="text-[11px] font-bold text-foreground/80">MSFT</span>
                                            <span className="text-[11px] text-muted-foreground">Q3 2025 earnings report</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative bottom gradient */}
            <div
                className="absolute w-full h-px bottom-0 left-0 z-0"
                style={{
                    background:
                        "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)",
                }}
            />
        </section>
    );
};


export default SectionWithMockup;
