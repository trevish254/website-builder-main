"use client";
import React from "react";
import { FullScreenScrollFX, FullScreenFXAPI } from "@/components/ui/full-screen-scroll-fx";

const sections = [
    {
        leftLabel: "Creation",
        title: <>Inspiration</>,
        rightLabel: "Creation",
        background: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2553&auto=format&fit=crop",
    },
    {
        leftLabel: "Essence",
        title: <>Strategy</>,
        rightLabel: "Essence",
        background: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2670&auto=format&fit=crop",
    },
    {
        leftLabel: "Rebirth",
        title: <>Growth</>,
        rightLabel: "Rebirth",
        background: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2590&auto=format&fit=crop",
    },
    {
        leftLabel: "Impact",
        title: <>Results</>,
        rightLabel: "Impact",
        background: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
    },
];

export function FullScreenScrollDemo() {
    const apiRef = React.useRef<FullScreenFXAPI>(null);

    return (
        <>
            <FullScreenScrollFX
                sections={sections}
                header={<><div>Agency</div><div>Success</div></>}
                footer={<div className="text-sm opacity-50">Chapabiz Agency Solutions</div>}
                showProgress
                durations={{ change: 0.7, snap: 800 }}
            />
        </>
    );
}
