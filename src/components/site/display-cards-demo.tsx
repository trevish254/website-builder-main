"use client";

import DisplayCards from "@/components/ui/display-cards";
import { Sparkles, Zap, Shield } from "lucide-react";

const defaultCards = [
    {
        icon: <Shield className="size-4 text-purple-300" />,
        title: "Secure Operations",
        description: "Enterprise-grade data protection",
        date: "Real-time",
        iconClassName: "text-purple-500",
        titleClassName: "text-purple-500",
        className:
            "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
        icon: <Zap className="size-4 text-indigo-300" />,
        title: "Fast Pipelines",
        description: "Automate your client deals",
        date: "2 mins ago",
        iconClassName: "text-indigo-500",
        titleClassName: "text-indigo-500",
        className:
            "[grid-area:stack] translate-x-6 md:translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
        icon: <Sparkles className="size-4 text-blue-300" />,
        title: "Agency Premium",
        description: "Top-tier funnel features",
        date: "Active",
        iconClassName: "text-blue-500",
        titleClassName: "text-blue-500",
        className:
            "[grid-area:stack] translate-x-12 md:translate-x-24 translate-y-20 hover:translate-y-10",
    },
];

function DisplayCardsDemo() {
    return (
        <div className="flex min-h-[400px] w-full items-center justify-center py-20">
            <div className="w-full max-w-3xl">
                <DisplayCards cards={defaultCards} />
            </div>
        </div>
    );
}

export { DisplayCardsDemo };
