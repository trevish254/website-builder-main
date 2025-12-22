"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export const ThreeDMarquee = ({
    images,
    className,
}: {
    images: string[];
    className?: string;
}) => {
    // Split the images array into 4 equal parts
    const chunkSize = Math.ceil(images.length / 4);
    const chunks = Array.from({ length: 4 }, (_, colIndex) => {
        const start = colIndex * chunkSize;
        return images.slice(start, start + chunkSize);
    });

    return (
        <div className="relative group/marquee p-8">
            {/* Global Atmospheric System - Inside & Outside */}

            {/* --- OUTSIDE GLOWS --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(closest-side,hsl(var(--primary)/0.2),transparent)] blur-[140px] z-0 opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[110%] h-[110%] bg-[radial-gradient(closest-side,rgba(99,102,241,0.3),transparent)] blur-[100px] z-0 opacity-60 group-hover/marquee:opacity-100 transition-opacity duration-1000"></div>
            <div className="absolute -top-40 -left-20 w-[180%] h-[180%] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5)_0%,rgba(139,92,246,0.1)_40%,transparent_70%)] blur-[100px] z-0 pointer-events-none opacity-90 animate-pulse-slow"></div>

            <div
                className={cn(
                    "relative mx-auto block h-[550px] overflow-hidden rounded-3xl max-sm:h-80 border border-white/20 bg-black/60 backdrop-blur-[12px] z-10 shadow-[0_0_100px_-20px_rgba(139,92,246,0.7)]",
                    className,
                )}
            >
                {/* --- INSIDE GLOWS --- */}
                <div className="flex size-full items-center justify-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_80%)] pointer-events-none"></div>
                    <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 via-primary/5 to-transparent pointer-events-none opacity-60"></div>
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-20"></div>
                    <div className="absolute top-[-10%] left-[10%] w-[30%] h-[120%] bg-white/10 blur-[60px] rotate-[35deg] pointer-events-none z-0"></div>
                    <div className="absolute top-[-20%] right-[20%] w-[20%] h-[150%] bg-primary/10 blur-[80px] rotate-[25deg] pointer-events-none z-0"></div>

                    <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
                        <div
                            style={{
                                transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
                            }}
                            className="relative top-72 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
                        >
                            {chunks.map((subarray, colIndex) => (
                                <motion.div
                                    animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                                    transition={{
                                        duration: colIndex % 2 === 0 ? 10 : 15,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                    }}
                                    key={colIndex + "marquee"}
                                    className="flex flex-col items-start gap-8"
                                >
                                    <GridLineVertical className="-left-4" offset="80px" />
                                    {subarray.map((image, imageIndex) => (
                                        <div className="relative group" key={imageIndex + image}>
                                            <GridLineHorizontal className="-top-4" offset="20px" />
                                            <motion.img
                                                whileHover={{
                                                    y: -10,
                                                    scale: 1.02,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: "easeInOut",
                                                }}
                                                key={imageIndex + image}
                                                src={image}
                                                alt={`Image ${imageIndex + 1}`}
                                                className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-shadow duration-300"
                                                width={970}
                                                height={700}
                                            />
                                            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                    ))}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GridLineHorizontal = ({
    className,
    offset,
}: {
    className?: string;
    offset?: string;
}) => {
    return (
        <div
            style={
                {
                    "--background": "#ffffff",
                    "--color": "rgba(0, 0, 0, 0.2)",
                    "--height": "1px",
                    "--width": "5px",
                    "--fade-stop": "90%",
                    "--offset": offset || "200px",
                    "--color-dark": "rgba(255, 255, 255, 0.2)",
                    maskComposite: "exclude",
                } as React.CSSProperties
            }
            className={cn(
                "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
                "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
                "[background-size:var(--width)_var(--height)]",
                "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
                "[mask-composite:exclude]",
                "z-30",
                "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
                className,
            )}
        ></div>
    );
};

const GridLineVertical = ({
    className,
    offset,
}: {
    className?: string;
    offset?: string;
}) => {
    return (
        <div
            style={
                {
                    "--background": "#ffffff",
                    "--color": "rgba(0, 0, 0, 0.2)",
                    "--height": "5px",
                    "--width": "1px",
                    "--fade-stop": "90%",
                    "--offset": offset || "150px",
                    "--color-dark": "rgba(255, 255, 255, 0.2)",
                    maskComposite: "exclude",
                } as React.CSSProperties
            }
            className={cn(
                "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
                "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
                "[background-size:var(--width)_var(--height)]",
                "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
                "[mask-composite:exclude]",
                "z-30",
                "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
                className,
            )}
        ></div>
    );
};
