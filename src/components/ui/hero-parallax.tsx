"use client";
import React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import Link from "next/link";

export const HeroParallax = ({
    products,
}: {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 800]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -800]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.1, 1]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
        springConfig
    );
    return (
        <div
            ref={ref}
            className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
        >
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className=""
            >
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row mb-20 space-x-20 ">
                    {secondRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
                    {thirdRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-50">
            <h1 className="text-3xl md:text-7xl font-bold dark:text-white leading-[1.1]">
                Create websites and funnels that <br className="hidden md:block" />
                <span className="text-primary italic">don’t just look good</span> — they actually support your campaigns and sales process.
            </h1>
            <p className="max-w-4xl text-lg md:text-2xl mt-10 text-muted-foreground leading-relaxed">
                Build landing pages, service pages, and campaign funnels that connect directly to your leads, pipelines, and reports — not isolated websites that live on their own.
            </p>
            <div className="flex gap-4 mt-12">
                <div className="px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Website creation
                </div>
                <div className="px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Funnel builder
                </div>
            </div>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            key={product.title}
            className="group/product h-64 w-[250px] md:h-96 md:w-[35rem] relative shrink-0 rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card"
        >
            <Link
                href={product.link}
                className="block h-full w-full"
            >
                <img
                    src={product.thumbnail}
                    className="object-cover object-top absolute h-full w-full inset-0 transition duration-500 group-hover/product:scale-105"
                    alt={product.title}
                />
            </Link>

            {/* Hover Overlay */}
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 transition duration-500 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-white text-2xl font-bold mb-4 transform translate-y-4 group-hover/product:translate-y-0 transition duration-500">
                    {product.title}
                </h2>
                <Link
                    href={product.link}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg transform translate-y-8 group-hover/product:translate-y-0 transition duration-500 hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                >
                    Use Template
                </Link>
            </div>
        </motion.div>
    );
};
