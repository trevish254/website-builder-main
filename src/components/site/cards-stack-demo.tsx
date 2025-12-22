"use client"
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

                    {/* Integrated Achievements in Cascade View */}
                    <ContainerScroll className="mt-20 relative">
                        {ACHIEVEMENTS.map((achievement, index) => (
                            <CardSticky
                                key={achievement.id}
                                index={index}
                                incrementY={60} // Vertical offset for each card in the stack
                                incrementZ={10}
                                className="w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md p-6 mb-[40vh] last:mb-[10vh]"
                                style={{
                                    background: achievement.bg,
                                    top: 300 + (index * 60) // Starting sticky position below the header
                                }}
                            >
                                <h4 className="text-4xl font-bold text-white mb-2">
                                    {achievement.title}
                                </h4>
                                <p className="text-sm font-medium uppercase tracking-tight text-white/90">
                                    {achievement.description}
                                </p>
                            </CardSticky>
                        ))}
                    </ContainerScroll>
                </div>

                {/* Right Side: Main Process Phases */}
                <ContainerScroll className="min-h-[400vh] space-y-8 py-12">
                    {PROCESS_PHASES.map((phase, index) => (
                        <CardSticky
                            key={phase.id}
                            index={index}
                            incrementY={80}
                            className="rounded-2xl border p-8 shadow-md backdrop-blur-md bg-white/80 dark:bg-stone-800/80 mb-[20vh]"
                            style={{ top: 100 + (index * 20) }}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="my-6 text-2xl font-bold tracking-tighter">
                                    {phase.title}
                                </h2>
                                <h3 className="text-2xl font-bold text-indigo-500">
                                    {String(index + 1).padStart(2, "0")}
                                </h3>
                            </div>

                            <p className="text-foreground">{phase.description}</p>
                        </CardSticky>
                    ))}
                </ContainerScroll>
            </div>
        </div>
    )
}

export { Process }
