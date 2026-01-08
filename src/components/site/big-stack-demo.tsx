"use client"
import { ContainerScroll, CardSticky } from "@/components/ui/cards-stack"

const BIG_CARDS_CONTENT = [
    {
        id: "card-1",
        title: "Unified Agency Intelligence",
        description: "Bring all your data streams into one central command center. Visualize metrics from every client, campaign, and sub-account in a single, high-fidelity dashboard designed for decision makers.",
        bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderColor: "rgba(148, 163, 184, 0.2)"
    },
    {
        id: "card-2",
        title: "Automated Client Ecosystem",
        description: "Deploy self-sustaining client portals that handle onboarding, reporting, and communication automatically. Reduce churn by providing a premium, branded experience that works while you sleep.",
        bg: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
        borderColor: "rgba(129, 140, 248, 0.2)"
    },
    {
        id: "card-3",
        title: "Global Infrastructure Scaling",
        description: "Leverage our edge network to deliver lightning-fast funnels and pages globally. Scale from 10 to 10,000 clients without worrying about server load, latency, or downtimes.",
        bg: "linear-gradient(135deg, #3f2c2c 0%, #7f1d1d 100%)",
        borderColor: "rgba(248, 113, 113, 0.2)"
    },
    {
        id: "card-4",
        title: "360° Conversion Analytics",
        description: "Unlock deep insights into every customer interaction. Track conversion paths from first click to final sale with granular data that reveals exactly where your revenue is coming from.",
        bg: "linear-gradient(135deg, #4a044e 0%, #701a75 100%)",
        borderColor: "rgba(232, 121, 249, 0.2)"
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
                            className="w-full max-w-[95%] lg:max-w-[1400px] mx-auto rounded-[40px] border p-12 shadow-2xl backdrop-blur-3xl mb-[30vh] flex flex-col justify-center min-h-[500px]"
                            style={{
                                background: card.bg,
                                borderColor: card.borderColor,
                                top: 150 + (index * 60)
                            }}
                        >
                            <div className="flex flex-col gap-8 items-center text-center">
                                <h3 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                                    {card.title}
                                </h3>
                                <p className="text-xl md:text-2xl text-slate-300 max-w-4xl leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        </CardSticky>
                    ))}
                </ContainerScroll>
            </div>
        </div>
    )
}
