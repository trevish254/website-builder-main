"use client";
import React from 'react';
import { cn } from '@/lib/utils';

import { ZoomParallax } from "@/components/ui/zoom-parallax";

export function ZoomParallaxDemo() {




    const images = [
        {
            src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Modern architecture building',
        },
        {
            src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Urban cityscape at sunset',
        },
        {
            src: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Abstract geometric pattern',
        },
        {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Mountain landscape',
        },
        {
            src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Minimalist design elements',
        },
        {
            src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Ocean waves and beach',
        },
        {
            src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
            alt: 'Forest trees and sunlight',
        },
    ];

    return (
        <div className="min-h-screen w-full">
            <div className="relative flex h-[50vh] items-center justify-center">
                {/* Radial spotlight */}
                <div
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full',
                        'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
                        'blur-[30px]',
                    )}
                />
                <h1 className="text-center text-5xl md:text-7xl font-bold tracking-tighter z-10">
                    Visualizing <br /> <span className="text-primary">The Future</span>
                </h1>
            </div>
            <ZoomParallax images={images} />

            <div className="py-20 flex flex-col items-center justify-center bg-background relative z-10 -mt-[10vh]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-3xl md:text-5xl font-bold mb-6">Built for scale, designed for impact.</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        Every pixel of your agency's presence should tell a story. With Chapabiz, we ensure that story is one of competence, elegance, and unyielding performance. From the first impression to the final conversion, we orchestrate the digital experience to be flawless.
                    </p>
                </div>
            </div>
        </div>
    );
}
