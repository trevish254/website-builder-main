"use client"
import { motion } from "framer-motion"
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"

const PROCESS_PHASES = [
    {
        id: "process-1",
        title: "Strategic Onboarding",
        description:
            "We start by mapping your agency's current workflow. Our team helps you transition leads, clients, and pipelines into Chapabiz, ensuring a seamless migration with zero downtime for your operations.",
    },
    {
        id: "process-2",
        title: "Workflow Automation",
        description:
            "Next, we trigger the power of automation. From automated lead nurturing to instant client reporting, we build the backend systems that let your agency run on autopilot while you focus on high-level strategy.",
    },
    {
        id: "process-3",
        title: "Funnel & Brand Sync",
        description:
            "We bring your unique brand identity to life with high-converting funnels. Our designers ensure your client portals and sales pages don't just look stunning, but are engineered to convert visitors into loyal partners.",
    },
    {
        id: "process-4",
        title: "Team Calibration",
        description:
            "Scale your team without the chaos. We set up granular permissions, team-specific pipelines, and collaborative tools so your account managers and creatives can work in perfect harmony.",
    },
    {
        id: "process-5",
        title: "Scale & Optimize",
        description:
            "Growth is data-driven. With Chapabiz's deep analytics, we help you identify bottlenecks, optimize your conversion rates, and unlock new revenue streams you didn't even know existed.",
    },
]

const ACHIEVEMENTS = [
    {
        id: "achivement-1",
        title: "98%",
        description: "Client Retention",
        bg: "rgb(58,148,118)",
    },
    {
        id: "achivement-2",
        title: "500+",
        description: "Agencies Scaled",
        bg: "rgb(195,97,158)",
    },
    {
        id: "achivement-3",
        title: "$12M+",
        description: "Revenue Automated",
        bg: "rgb(202,128,53)",
    },
    {
        id: "achivement-4",
        title: "24/7",
        description: "System Uptime",
        bg: "rgb(135,95,195)",
    },
    {
        id: "achivement-5",
        title: "Global",
        description: "Support Teams",
        bg: "rgb(236, 72, 153)",
    },
    {
        id: "achivement-6",
        title: "Secure",
        description: "Enterprise Safety",
        bg: "rgb(34, 211, 238)",
    },
]

const Process = () => {
    return (
        <div className="container min-h-svh bg-stone-50 dark:bg-stone-900 px-6 text-stone-900 dark:text-stone-50 xl:px-12 rounded-3xl my-20">
            <div className="grid md:grid-cols-2 md:gap-8 xl:gap-12 relative">
                {/* Left Side: Sticky Heading & Cascading Achievements */}
                <div className="py-12 relative">
                    <div className="sticky top-24 mb-12 z-20">
                        <h5 className=" text-xs uppercase tracking-wide">our process</h5>
                        <h2 className="mb-6 mt-4 text-4xl font-bold tracking-tight">
                            Planning your{" "}
                            <span className="text-indigo-500">project development</span> journey
                        </h2>
                        <p className="max-w-prose text-sm text-muted-foreground">
                            Our journey begins with a deep dive into your vision. In the
                            Discovery phase, we engage in meaningful conversations to grasp your
                            brand identity, goals, and the essence you want to convey.
                        </p>
                    </div>

                    <div className="sticky top-[450px] w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                        <img
                            src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=1000&auto=format&fit=crop"
                            alt="Project Planning"
                            className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />

                        {/* Connecting Line SVG */}
                        <div className="absolute top-1/2 -right-24 md:-right-32 w-48 h-96 hidden md:block pointer-events-none z-10">
                            <svg width="200" height="400" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                                <motion.path
                                    d="M0 200 C 100 200, 100 0, 200 0"
                                    stroke="url(#line-gradient)"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                                />
                                <defs>
                                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity="0" />
                                        <stop offset="50%" stopColor="rgb(99,102,241)" stopOpacity="1" />
                                        <stop offset="100%" stopColor="rgb(99,102,241)" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side: Main Process Phases */}
                <ContainerScroll className="md:min-h-[400vh] min-h-[200vh] space-y-8 py-12">
                    {PROCESS_PHASES.map((phase, index) => (
                        <CardSticky
                            key={phase.id}
                            index={index}
                            incrementY={80}
                            className="rounded-[2rem] border border-white/5 p-10 shadow-2xl backdrop-blur-xl bg-white/5 dark:bg-stone-900/60 md:mb-[20vh] mb-[10vh] group/card hover:border-primary/20 transition-colors"
                            style={{ top: 100 + (index * 20) }}
                        >
                            <div className="flex items-center justify-between gap-4 mb-6">
                                <h2 className="text-3xl font-bold tracking-tight group-hover/card:text-primary transition-colors">
                                    {phase.title}
                                </h2>
                                <h3 className="text-4xl font-black text-indigo-500/20 group-hover/card:text-indigo-500/100 transition-all">
                                    {String(index + 1).padStart(2, "0")}
                                </h3>
                            </div>

                            <p className="text-muted-foreground text-sm leading-relaxed">{phase.description}</p>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Priority Phase</span>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border border-white/10 bg-zinc-800" />
                                    ))}
                                </div>
                            </div>
                        </CardSticky>
                    ))}
                </ContainerScroll>
            </div>
        </div>
    )
}

export { Process }
