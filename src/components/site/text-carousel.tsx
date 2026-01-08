"use client";

import React from "react";

const features = [
    "Custom Dashboard",
    "Subaccounts",
    "Teams",
    "Messages",
    "Tasks",
    "Kanban Boards",
    "Client Hub",
    "Pipelines",
    "Funnels",
    "Inventory",
    "Orders",
    "Analytics",
];

export function TextCarouselDemo() {
    // Duplicate the features multiple times to ensure seamless scrolling
    const seamlessFeatures = [...features, ...features, ...features, ...features];

    return (
        <section className="py-24 overflow-hidden relative w-full">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-fit animate-scroll hover:pause">
                {seamlessFeatures.map((feature, index) => (
                    <div
                        key={index}
                        className="flex shrink-0 items-center justify-center mx-8"
                    >
                        <span className="text-xl md:text-3xl font-medium text-muted-foreground/80 whitespace-nowrap">
                            {feature}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
        </section>
    );
}
