import React from "react";
import HeroScrollVideo from "@/components/ui/scroll-animated-video";

export const IntroductionVideoDemo = () => {
    return (
        <div className="w-full bg-background relative z-10">
            <HeroScrollVideo
                title="Introduction to Chapabiz"
                subtitle="The Future of Agency Management"
                meta="2025 Vision"
                credits={
                    <>
                        <p>Powered by</p>
                        <p>Chapabiz Intelligence</p>
                    </>
                }
                media="https://videos.pexels.com/video-files/6151238/6151238-hd_1920_1080_30fps.mp4"
                poster="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop"
                overlay={{
                    caption: "CHAPABIZ • 01",
                    heading: "See It In Action",
                    paragraphs: [
                        "Experience the power of a fully integrated agency ecosystem.",
                        "Scroll to unveil how Chapabiz transforms chaos into clarity.",
                    ],
                }}
                smoothScroll={false}
            />
        </div>
    );
};
