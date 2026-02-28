'use client';

import { motion, useInView, type Variants, type HTMLMotionProps } from 'framer-motion';
import React from 'react';

type TimelineContentProps<T extends keyof HTMLElementTagNameMap> = {
    children?: React.ReactNode;
    animationNum: number;
    className?: string;
    timelineRef: React.RefObject<HTMLElement | null>;
    as?: T;
    customVariants?: Variants;
    once?: boolean;
} & HTMLMotionProps<T>;

export const TimelineContent = <
    T extends keyof HTMLElementTagNameMap = 'div',
>({
    children,
    animationNum,
    timelineRef,
    className,
    as,
    customVariants,
    once = true,
    ...props
}: TimelineContentProps<T>) => {
    const defaultSequenceVariants = {
        visible: (i: number) => ({
            filter: 'blur(0px)',
            y: 0,
            opacity: 1,
            transition: {
                delay: i * 0.5,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: 'blur(20px)',
            y: 0,
            opacity: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    const sequenceVariants = customVariants || defaultSequenceVariants;
    const isInView = useInView(timelineRef, {
        once: once,
        amount: 0.2, // Adjusted amount for better triggering
    });

    const MotionComponent = (motion as any)[as || 'div'];

    return (
        <MotionComponent
            initial='hidden'
            animate={isInView ? 'visible' : 'hidden'}
            custom={animationNum}
            variants={sequenceVariants}
            className={className}
            {...props}
        >
            {children}
        </MotionComponent>
    );
};
