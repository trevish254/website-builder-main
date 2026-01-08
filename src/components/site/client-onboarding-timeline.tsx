"use client";
import {
    ContainerScroll,
    ContainerSticky,
    ProcessCard,
    ProcessCardBody,
    ProcessCardTitle
} from "@/components/ui/process-timeline";

const ONBOARDING_DOCS = [
    {
        id: "doc-1",
        title: "Welcome & Strategy",
        description:
            "Start your journey with our comprehensive Welcome Guide. This document outlines your personalized strategy, key milestones, and the dedicated team assigned to your success.",
    },
    {
        id: "doc-2",
        title: "Service Contracts",
        description:
            "Review and sign your service agreements securely. Our transparent contracts detail deliverables, timelines, and terms to ensure a mutual understanding before we begin.",
    },
    {
        id: "doc-3",
        title: "Invoices & Billing",
        description:
            "Access your financial documents with ease. View detailed invoices, payment history, and upcoming billing schedules directly from your secure client portal.",
    },
    {
        id: "doc-4",
        title: "Monthly Reports",
        description:
            "Stay informed with data-driven insights. Our detailed monthly reports track performance metrics, campaign results, and actionable recommendations for continuous growth.",
    },
];

export const ClientOnboardingTimeline = () => {
    return (
        <ContainerScroll
            className="w-full px-6 py-20 h-[300vh]"
            style={{
                background:
                    "radial-gradient(30% 80% at 0% 70%, #4338ca 0%, #3730a3 22.92%, #312e81 42.71%, #0f172a 88.54%)",
            }}
        >
            <div className="container mx-auto mb-16 space-y-4 relative z-10">
                <h2 className="bg-gradient-to-r from-indigo-200/60 via-indigo-50 to-indigo-200/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent md:text-5xl">
                    Seamless Client
                    <br /> Onboarding Hub
                </h2>
                <p className="max-w-[52ch] text-sm text-slate-300">
                    Empower your clients with a centralized hub for all essential documentation.
                    From welcome kits to performance reports, everything they need is just a click away.
                </p>
            </div>

            <ContainerSticky className="top-24 flex flex-nowrap gap-4">
                {ONBOARDING_DOCS.map((doc, index) => (
                    <ProcessCard
                        key={doc.id}
                        itemsLength={ONBOARDING_DOCS.length}
                        index={index}
                        className="min-w-[80vw] md:min-w-[500px] max-w-[80vw] md:max-w-[500px] rounded-3xl overflow-hidden"
                    >
                        <ProcessCardTitle className="border-r border-slate-700 w-24 flex-shrink-0 flex items-center justify-center bg-black/20">
                            <div className="rounded-full size-10 bg-indigo-600 font-bold text-white flex justify-center items-center shadow-lg ring-2 ring-indigo-400/20">
                                {String(index + 1).padStart(2, "0")}
                            </div>
                        </ProcessCardTitle>
                        <ProcessCardBody className="flex flex-col gap-6 justify-center">
                            <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-white">
                                {doc.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                {doc.description}
                            </p>
                        </ProcessCardBody>
                    </ProcessCard>
                ))}
            </ContainerSticky>
        </ContainerScroll>
    );
};
