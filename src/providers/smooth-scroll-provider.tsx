"use client";

import { useEffect } from "react";
import { usePathname } from 'next/navigation';
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    // Force rebuild
    const pathname = usePathname();

    useEffect(() => {
        // Disable lenis on dashboards to allow native drag-and-drop scrolling
        if (pathname.includes('/dashboards')) return;

        let lenis: Lenis | null = null;
        let tickerFn: ((time: number) => void) | null = null;
        let gsapInstance: any = null;

        const init = async () => {
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");

            gsapInstance = gsap;
            gsap.registerPlugin(ScrollTrigger);

            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
            });

            lenis.on('scroll', ScrollTrigger.update);

            tickerFn = (time: number) => {
                lenis?.raf(time * 1000);
            };

            gsap.ticker.add(tickerFn);
            gsap.ticker.lagSmoothing(0);
        };

        init();

        return () => {
            if (lenis) lenis.destroy();
            if (gsapInstance && tickerFn) gsapInstance.ticker.remove(tickerFn);
        };
    }, [pathname]);

    return <>{children}</>;
}
