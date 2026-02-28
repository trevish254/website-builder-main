"use client"
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"
import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { FeatureCard } from '@/components/ui/grid-feature-cards';

const FEATURES = [
    { title: 'Faaast', icon: Zap, description: 'It supports an entire helping developers and innovate.' },
    { title: 'Powerful', icon: Cpu, description: 'It supports an entire helping developers and businesses.' },
    { title: 'Security', icon: Fingerprint, description: 'It supports an helping developers businesses.' },
    { title: 'Customization', icon: Pencil, description: 'It supports helping developers and businesses innovate.' },
    { title: 'Control', icon: Settings2, description: 'It supports helping developers and businesses innovate.' },
    { title: 'Built for AI', icon: Sparkles, description: 'It supports helping developers and businesses innovate.' },
];

const BIG_CARDS_CONTENT = [
    {
        id: "card-1",
        title: "Unified Agency Intelligence",
        description: "Bring all your data streams into one central command center. Visualize metrics from every client, campaign, and sub-account in a single, high-fidelity dashboard designed for decision makers.",
        bg: "rgba(15, 23, 42, 0.4)",
        borderColor: "rgba(148, 163, 184, 0.4)",
        features: [0, 1]
    },
    {
        id: "card-2",
        title: "Automated Client Ecosystem",
        description: "Deploy self-sustaining client portals that handle onboarding, reporting, and communication automatically. Reduce churn by providing a premium, branded experience that works while you sleep.",
        bg: "rgba(30, 27, 75, 0.4)",
        borderColor: "rgba(129, 140, 248, 0.4)",
        features: [2, 3]
    },
    {
        id: "card-3",
        title: "Global Infrastructure Scaling",
        description: "Leverage our edge network to deliver lightning-fast funnels and pages globally. Scale from 10 to 10,000 clients without worrying about server load, latency, or downtimes.",
        bg: "rgba(63, 44, 44, 0.4)",
        borderColor: "rgba(248, 113, 113, 0.4)",
        features: [4, 5]
    },
]

export const BigStackDemo = () => {
    return (
        <div className="w-full bg-background relative py-20">
            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="mb-24 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                        Enterprise-Grade <span className="text-primary">Scalability</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Built for high-performance agencies that refuse to compromise on power or aesthetics.
                    </p>
                </div>

                <ContainerScroll className="min-h-[250vh] pb-48 w-full">
                    {BIG_CARDS_CONTENT.map((card, index) => (
                        <CardSticky
                            key={card.id}
                            index={index}
                            incrementY={60}
                            className="w-full max-w-[95%] lg:max-w-[1240px] mx-auto rounded-[48px] border-2 p-8 md:p-16 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-3xl mb-[40vh] overflow-hidden flex flex-col justify-center min-h-[650px]"
                            style={{
                                backgroundColor: card.bg,
                                borderColor: card.borderColor,
                                top: 150 + (index * 60)
                            }}
                        >
                            {/* Decorative Shine Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-6 text-left">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                        {card.title}
                                    </h3>
                                    <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
                                        {card.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {card.features.map((fIdx) => (
                                        <FeatureCard
                                            key={fIdx}
                                            feature={FEATURES[fIdx]}
                                            className="text-white"
                                        />
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
