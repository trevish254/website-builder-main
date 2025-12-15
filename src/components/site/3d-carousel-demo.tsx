"use client";
import React from 'react';
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"

export function ThreeDPhotoCarouselDemo() {
    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[500px] mb-20 relative">
            <div className="text-center mb-8 relative z-20">
                <h2 className="text-4xl font-bold mb-4">Agency Showcase</h2>
                <p className="text-muted-foreground">Explore our gallery of projects and team moments</p>
            </div>
            <div className="w-full relative z-10">
                <ThreeDPhotoCarousel />
            </div>
        </div>
    )
}
