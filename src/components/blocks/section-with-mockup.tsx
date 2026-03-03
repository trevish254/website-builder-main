'use client';

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TypingIndicator = () => (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-muted/40 rounded-2xl border border-border/50 w-fit backdrop-blur-md">
        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
);

interface SectionWithMockupProps {
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    primaryImageSrc: string;
    secondaryImageSrc: string;
    reverseLayout?: boolean;
    type?: "direct" | "group";
}

const SectionWithMockup: React.FC<SectionWithMockupProps> = ({
    title,
    description,
    primaryImageSrc,
    secondaryImageSrc,
    reverseLayout = false,
    type = "direct",
}) => {

    const [chatStep, setChatStep] = useState(0);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chatStep]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const scheduleNext = (currentStep: number) => {
            const next = (currentStep + 1) % 9;
            let delay = 2000; // default delay

            if (currentStep === 0) delay = 2500;      // Reading msg 1
            else if (currentStep === 1) delay = 2000; // Typing...
            else if (currentStep === 2) delay = 3500; // Reading msg 2
            else if (currentStep === 3) delay = 1500; // Typing...
            else if (currentStep === 4) delay = 3500; // Reading msg 3
            else if (currentStep === 5) delay = 1500; // Typing...
            else if (currentStep === 6) delay = 3000; // Reading msg 4
            else if (currentStep === 7) delay = 1500; // Typing...
            else if (currentStep === 8) delay = 5000; // Reading final msg

            timeoutId = setTimeout(() => {
                setChatStep(next);
                scheduleNext(next);
            }, delay);
        };

        scheduleNext(0);

        return () => clearTimeout(timeoutId);
    }, []);

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
                        {/* Secondary Background Layer - Inbox Inbox List */}
                        <motion.div
                            className={`absolute w-[280px] h-[450px] md:w-[420px] md:h-[600px] bg-muted/40 rounded-[32px] z-0 border border-border opacity-60 backdrop-blur-xl overflow-hidden`}
                            style={{
                                top: reverseLayout ? 'auto' : '0%',
                                bottom: reverseLayout ? '0%' : 'auto',
                                left: reverseLayout ? 'auto' : '-15%',
                                right: reverseLayout ? '-15%' : 'auto',
                            }}
                            initial={{ y: 0, x: 0 }}
                            whileInView={{ y: -40, x: -10 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <div className="p-8 flex flex-col h-full bg-zinc-900/50">
                                <div className="flex items-center justify-between mb-8 opacity-40">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-foreground/10 flex items-center justify-center font-bold text-xs">C</div>
                                        <div className="h-4 w-20 bg-foreground rounded"></div>
                                    </div>
                                    <div className="h-6 w-6 rounded-full bg-foreground"></div>
                                </div>

                                <div className="space-y-4">
                                    {type === "direct" ? (
                                        [
                                            { name: "Sarah Wells", message: "Wow, that was fast. The dashboard looks incredible.", time: "2m", active: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
                                            { name: "Marc Thompson", message: "Can we hop on a quick call to discuss the pricing?", time: "1h", unread: true, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" },
                                            { name: "Global Logistics", message: "Your shipment #AX-882 has cleared customs.", time: "3h", unread: true },
                                            { name: "Enterprise Auth", message: "Your security credentials were updated.", time: "5h", unread: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
                                            { name: "Design Team", message: "New assets are ready for review in the portal.", time: "1d", unread: false },
                                            { name: "Product Sync", message: "The roadmap for Q4 has been finalized.", time: "2d", unread: false },
                                            { name: "Billing Support", message: "Your monthly invoice is now available.", time: "3d", unread: false, avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop" },
                                        ].map((inbox, i) => (
                                            <div key={i} className={`flex items-start gap-4 border-b border-white/5 pb-4 ${inbox.active ? 'opacity-100' : 'opacity-40'}`}>
                                                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border border-white/10 bg-zinc-800/50 overflow-hidden`}>
                                                    {inbox.avatar ? (
                                                        <img src={inbox.avatar} alt={inbox.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-foreground/50">
                                                            {inbox.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                    <div className="flex justify-between items-center text-foreground">
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {inbox.unread && <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-primary" />}
                                                            <span className={`text-[12px] truncate ${inbox.unread ? 'font-bold' : 'font-medium'}`}>{inbox.name}</span>
                                                        </div>
                                                        <span className="text-[9px] text-muted-foreground font-mono shrink-0">{inbox.time}</span>
                                                    </div>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-1 leading-tight">
                                                        {inbox.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        [
                                            { name: "Development", count: "12", active: true },
                                            { name: "Design Feedback", count: "3", unread: true },
                                            { name: "Product Sync", count: "0", unread: false },
                                            { name: "Marketing Hub", count: "8", unread: true },
                                            { name: "Ops & Scaling", count: "1", unread: true },
                                            { name: "Release Notes", count: "0", unread: false },
                                        ].map((channel, i) => (
                                            <div key={i} className={`flex items-center justify-between border-b border-white/5 pb-4 ${channel.active ? 'opacity-100' : 'opacity-40'}`}>
                                                <div className="flex items-center gap-3 overflow-hidden text-foreground">
                                                    <span className="text-muted-foreground opacity-50 font-mono text-lg">#</span>
                                                    <span className={`text-[13px] truncate ${channel.unread ? 'font-bold' : 'font-medium'}`}>{channel.name}</span>
                                                </div>
                                                {channel.unread && (
                                                    <div className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/20 text-primary text-[10px] font-bold">
                                                        {channel.count}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Mockup Card - Chat Interface */}
                        <motion.div
                            className="relative w-full h-full bg-card/60 dark:bg-[#09090b]/90 rounded-[40px] backdrop-blur-3xl border border-white/10 z-10 overflow-hidden shadow-[0_0_100px_-12px_rgba(0,0,0,0.5)] flex flex-col"
                            initial={{ y: 0 }}
                            whileInView={{ y: 40 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                            viewport={{ once: true, amount: 0.5 }}
                        >
                            <div className="p-8 md:p-10 flex flex-col h-full">
                                {/* Chat Header */}
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-lg flex items-center justify-center ${type === "group" ? "bg-primary text-primary-foreground text-lg font-bold" : ""}`}>
                                            {type === "direct" ? (
                                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>#D</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-foreground text-lg font-bold">{type === "direct" ? "Sarah Wells" : "Development"}</h3>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                                    {type === "direct" ? "Active Design Lab" : "12 Online · Build #442"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-muted/30 border border-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-muted/30 border border-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-muted/30 border border-white/5">
                                            <div className="w-5 h-5 flex flex-col gap-0.5 justify-center items-center">
                                                <div className="w-4 h-0.5 bg-foreground" />
                                                <div className="w-4 h-0.5 bg-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Conversation Feed */}
                                <div
                                    ref={chatContainerRef}
                                    className="flex-1 space-y-6 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
                                >
                                    <AnimatePresence mode="popLayout">
                                        {type === "direct" ? (
                                            <>
                                                {/* Client Message 1 */}
                                                {(chatStep >= 0) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2 hidden-scroll">
                                                            <div className="p-4 rounded-3xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md">
                                                                <p className="text-sm text-foreground/90 leading-relaxed">
                                                                    Hi, can we get a quick update on the Q3 design prototypes? Our stakeholders are meeting tomorrow.
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">10:42 AM</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* User Typing Indicator 1 */}
                                                {(chatStep === 1) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* User Response 1 */}
                                                {(chatStep >= 2) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                                                        <div className="p-4 rounded-3xl rounded-tr-none bg-primary border border-primary/20 shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]">
                                                            <p className="text-sm text-primary-foreground leading-relaxed font-medium">
                                                                Absolutely! I've just uploaded the final prototypes to the project portal. They're looking fantastic.
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 mr-1">
                                                            <span className="text-[10px] text-muted-foreground">10:45 AM</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Client Typing Indicator 2 */}
                                                {(chatStep === 3) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* Client Response 2 */}
                                                {(chatStep >= 4) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2">
                                                            <div className="p-4 rounded-3xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md">
                                                                <p className="text-sm text-foreground/90 leading-relaxed">
                                                                    Wow, that was fast. The dashboard looks incredible. Let's move this to development immediately!
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">10:46 AM</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* User Typing Indicator 2 */}
                                                {(chatStep === 5) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* User Response 2 */}
                                                {(chatStep >= 6) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-end gap-2 ml-auto max-w-[85%] mt-2">
                                                        <div className="p-3.5 rounded-3xl rounded-tr-none bg-primary border border-primary/20 shadow-lg">
                                                            <p className="text-sm text-primary-foreground leading-relaxed font-medium">
                                                                You got it! Handing it off to the engineering pipeline right now.
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground mr-1">10:46 AM</span>
                                                    </motion.div>
                                                )}

                                                {/* Client Typing Indicator 3 */}
                                                {(chatStep === 7) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* Client Response 3 */}
                                                {(chatStep >= 8) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2">
                                                            <div className="p-4 rounded-3xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md">
                                                                <p className="text-sm text-foreground/90 leading-relaxed">
                                                                    Perfect. Setting up the final sync for 3PM. See you then! 👋
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">Just now</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {/* Sarah's Message */}
                                                {(chatStep >= 0) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[95%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2">
                                                            <div className="p-3.5 rounded-2xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md">
                                                                <p className="text-xs text-foreground/90 leading-relaxed">
                                                                    Team, the Q4 roadmap is live in the repo. <span className="text-primary font-medium">@everyone</span> check your modules!
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">Sarah Wells · 11:20 AM</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Alex Typing Indicator */}
                                                {(chatStep === 1) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Alex" className="w-full h-full object-cover" />
                                                        </div>
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* Alex's Response */}
                                                {(chatStep >= 2) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[95%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Alex" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2 w-full">
                                                            <div className="p-3.5 rounded-2xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md w-full">
                                                                <p className="text-xs text-foreground/90 leading-relaxed mb-3">
                                                                    Copy that. I'm finishing up the auth-logic refactor now. Here's a preview of the new auth component.
                                                                </p>
                                                                <div className="w-full h-[120px] rounded-lg overflow-hidden border border-white/10 relative group cursor-pointer">
                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                                        <span className="text-white text-xs font-bold drop-shadow-md">View</span>
                                                                    </div>
                                                                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" alt="Attachment" className="w-full h-full object-cover" />
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">Alex Thompson · 11:25 AM</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* User Typing Indicator */}
                                                {(chatStep === 3) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-end gap-2 ml-auto max-w-[85%]">
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* User Response */}
                                                {(chatStep >= 4) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-end gap-2 ml-auto max-w-[85%] mt-2">
                                                        <div className="p-3.5 rounded-2xl rounded-tr-none bg-primary border border-primary/20 shadow-lg">
                                                            <p className="text-xs text-primary-foreground leading-relaxed font-medium">
                                                                Merged Alex's PR. We are officially ready for the staging deploy! 🚀
                                                            </p>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground mr-1">You · 11:28 AM</span>
                                                    </motion.div>
                                                )}

                                                {/* Emily Typing Indicator */}
                                                {(chatStep === 5) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop" alt="Emily" className="w-full h-full object-cover" />
                                                        </div>
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* Emily Response */}
                                                {(chatStep >= 6) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[95%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=150&auto=format&fit=crop" alt="Emily" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2 w-full">
                                                            <div className="p-3.5 rounded-2xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md w-full">
                                                                <p className="text-xs text-foreground/90 leading-relaxed">
                                                                    Awesome work everyone! QA is spinning up the test environments now. 🧪 Updates in #QA-Ops soon.
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">Emily Chen · 11:30 AM</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Sarah Typing Indicator 2 */}
                                                {(chatStep === 7) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[90%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <TypingIndicator />
                                                    </motion.div>
                                                )}

                                                {/* Sarah Response 2 */}
                                                {(chatStep >= 8) && (
                                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-start gap-3 max-w-[95%]">
                                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0 mt-1 flex items-center justify-center bg-zinc-800">
                                                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" alt="Sarah Wells" className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col items-start gap-2 w-full">
                                                            <div className="p-3.5 rounded-2xl rounded-tl-none bg-muted/40 border border-white/5 backdrop-blur-md w-full">
                                                                <p className="text-xs text-foreground/90 leading-relaxed">
                                                                    Love the momentum! Let's celebrate after the release is verified! 🎉
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-muted-foreground ml-1">Sarah Wells · Just now</span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Message Input Simulation */}
                                <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-4">
                                    <div className="flex-1 h-12 bg-muted/20 rounded-2xl border border-white/5 px-6 flex items-center">
                                        <span className="text-muted-foreground/40 text-sm">Message {type === "direct" ? "Sarah..." : "#development..."}</span>
                                    </div>
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                                        <div className="w-5 h-5 flex items-center justify-center text-primary-foreground">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="m22 2-7 20-4-9-9-4Z" />
                                                <path d="M22 2 11 13" />
                                            </svg>
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
