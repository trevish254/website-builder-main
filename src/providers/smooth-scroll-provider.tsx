"use client";

import { useEffect } from "react";
import { usePathname } from 'next/navigation';
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Disable lenis on dashboards to allow native drag-and-drop scrolling
        if (pathname.includes('/dashboards')) return;

        gsap.registerPlugin(ScrollTrigger);
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenis.on('scroll', ScrollTrigger.update);

        const tickerFn = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(tickerFn);
        };
    }, []);

    return <>{children}</>;
}
