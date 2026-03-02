"use client";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function AboutSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.4,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };
    const scaleVariants = {
        visible: (i: number) => ({
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.4,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            opacity: 0,
        },
    };
    return (
        <section className="py-24 px-4 bg-background border-y border-border/50" ref={heroRef}>
            <div className="max-w-7xl mx-auto">
                <div className="relative">
                    {/* Header with social icons */}
                    <div className="flex justify-between items-center mb-8 w-[85%] absolute lg:top-4 md:top-0 sm:-top-2 -top-3 z-10">
                        <div className="flex items-center gap-2 text-xl">
                            <span className="text-primary animate-spin">✱</span>
                            <TimelineContent
                                as="span"
                                animationNum={0}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="text-sm font-medium uppercase tracking-widest text-muted-foreground"
                            >
                                OUR LEGACY
                            </TimelineContent>
                        </div>
                        <div className="flex gap-4">
                            {[
                                { name: "fb", icon: "facebook.svg" },
                                { name: "insta", icon: "instagram.svg" },
                                { name: "linkedin", icon: "linkedin.svg" },
                                { name: "youtube", icon: "youtube.svg" }
                            ].map((social, i) => (
                                <TimelineContent
                                    key={social.name}
                                    as="a"
                                    animationNum={i}
                                    timelineRef={heroRef}
                                    customVariants={revealVariants}
                                    href="#"
                                    className="md:w-10 md:h-10 w-8 h-8 border border-border bg-accent/50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-colors"
                                >
                                    <img src={`https://pro-section.ui-layouts.com/${social.icon}`} alt={social.name} width={20} height={20} className="dark:invert grayscale brightness-150 dark:grayscale-0 dark:brightness-100" />
                                </TimelineContent>
                            ))}
                        </div>
                    </div>

                    <TimelineContent
                        as="figure"
                        animationNum={4}
                        timelineRef={heroRef}
                        customVariants={scaleVariants}
                        className="relative group overflow-hidden rounded-[40px] border border-border/50"
                    >
                        <svg
                            className="w-full"
                            width={"100%"}
                            height={"100%"}
                            viewBox="0 0 100 40"
                        >
                            <defs>
                                <clipPath
                                    id="clip-inverted"
                                    clipPathUnits={"objectBoundingBox"}
                                >
                                    <path
                                        d="M0.0998072 1H0.422076H0.749756C0.767072 1 0.774207 0.961783 0.77561 0.942675V0.807325C0.777053 0.743631 0.791844 0.731953 0.799059 0.734076H0.969813C0.996268 0.730255 1.00088 0.693206 0.999875 0.675159V0.0700637C0.999875 0.0254777 0.985045 0.00477707 0.977629 0H0.902473C0.854975 0 0.890448 0.138535 0.850165 0.138535H0.0204424C0.00408849 0.142357 0 0.180467 0 0.199045V0.410828C0 0.449045 0.0136283 0.46603 0.0204424 0.469745H0.0523086C0.0696245 0.471019 0.0735527 0.497877 0.0733523 0.511146V0.915605C0.0723903 0.983121 0.090588 1 0.0998072 1Z"
                                        fill="#D9D9D9"
                                    />
                                </clipPath>
                            </defs>
                            <image
                                clipPath="url(#clip-inverted)"
                                preserveAspectRatio="xMidYMid slice"
                                width={"100%"}
                                height={"100%"}
                                xlinkHref="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop"
                            ></image>
                        </svg>
                    </TimelineContent>

                    {/* Stats */}
                    <div className="flex flex-wrap lg:justify-start justify-between items-center py-6 text-sm">
                        <TimelineContent
                            as="div"
                            animationNum={5}
                            timelineRef={heroRef}
                            customVariants={revealVariants}
                            className="flex gap-8"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-primary font-medium text-2xl">10+</span>
                                <span className="text-muted-foreground uppercase tracking-wider font-medium">Years of Excellence</span>
                                <span className="text-border">|</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-primary font-medium text-2xl">300+</span>
                                <span className="text-muted-foreground uppercase tracking-wider font-medium">Projects Delivered</span>
                            </div>
                        </TimelineContent>
                        <div className="lg:absolute right-0 bottom-16 flex lg:flex-col flex-row-reverse lg:gap-0 gap-6">
                            <TimelineContent
                                as="div"
                                animationNum={6}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="flex lg:text-5xl sm:text-3xl text-2xl items-center gap-4 mb-2"
                            >
                                <span className="text-primary font-medium">100+</span>
                                <span className="text-foreground uppercase font-medium tracking-tight">Global Brands</span>
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={7}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="flex items-center gap-2 mb-2 sm:text-base text-xs"
                            >
                                <span className="text-primary font-medium">40%</span>
                                <span className="text-muted-foreground uppercase tracking-wider font-medium">Faster Deployment</span>
                            </TimelineContent>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="grid lg:grid-cols-12 gap-16 mt-12">
                    <div className="lg:col-span-8">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl !leading-[1.05] font-semibold text-foreground mb-12 tracking-tight">
                            <VerticalCutReveal
                                splitBy="words"
                                staggerDuration={0.1}
                                staggerFrom="first"
                                reverse={true}
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 30,
                                    delay: 0.5,
                                }}
                            >
                                Building the Future of Digital Agencies.
                            </VerticalCutReveal>
                        </h1>

                        <TimelineContent
                            as="div"
                            animationNum={9}
                            timelineRef={heroRef}
                            customVariants={revealVariants}
                            className="grid md:grid-cols-2 gap-12 text-muted-foreground"
                        >
                            <TimelineContent
                                as="div"
                                animationNum={10}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="text-lg leading-relaxed text-justify"
                            >
                                <p>
                                    Chapabiz was born from a vision to unify the fragmented agency ecosystem.
                                    We've evolved from a simple toolset into a strategic growth platform that
                                    empowers agencies to scale without the chaos.
                                </p>
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={11}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="text-lg leading-relaxed text-justify"
                            >
                                <p>
                                    Every agency has unique challenges, and we provide the clarity to overcome them.
                                    By blending seamless automation with deep performance analytics, we help you
                                    focus on what truly matters: your clients' success.
                                </p>
                            </TimelineContent>
                        </TimelineContent>
                    </div>

                    <div className="lg:col-span-4 flex flex-col justify-end">
                        <div className="text-right glass-container p-10 rounded-[32px] bg-accent/30 border border-border/50">
                            <TimelineContent
                                as="div"
                                animationNum={12}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="text-primary text-3xl font-semibold tracking-tight mb-2"
                            >
                                CHAPABIZ
                            </TimelineContent>
                            <TimelineContent
                                as="div"
                                animationNum={13}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-10"
                            >
                                Agency Operating System
                            </TimelineContent>

                            <TimelineContent
                                as="div"
                                animationNum={14}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="mb-8"
                            >
                                <p className="text-foreground text-lg font-medium leading-snug">
                                    Scale your operations and unify your team under one roof.
                                </p>
                            </TimelineContent>

                            <TimelineContent
                                as="button"
                                animationNum={15}
                                timelineRef={heroRef}
                                customVariants={revealVariants}
                                className="bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 flex w-full justify-center items-center gap-3 hover:gap-5 transition-all duration-500 ease-in-out text-primary-foreground px-8 py-5 rounded-2xl cursor-pointer font-medium text-lg"
                            >
                                LET'S COLLABORATE <ArrowRight className="w-6 h-6" />
                            </TimelineContent>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
