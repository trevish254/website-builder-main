'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Key, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export function SignUpCard2() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<"signup" | "otp">("signup");
    const [focusedInput, setFocusedInput] = useState<"name" | "email" | "password" | "confirmPassword" | "otp" | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const router = useRouter();
    const supabase = createClient();

    // For 3D card effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (error: any) {
            toast.error('Error signing up with Google', {
                description: error.message || 'Something went wrong',
            });
            setIsLoading(false);
        }
    };

    const onSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email || !password || !name || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });

            if (error) {
                throw error;
            }

            if (data?.session) {
                // If session is immediately returned (e.g. email confirmation disabled), redirect
                router.push('/agency');
                toast.success('Account created successfully');
            } else {
                // If checking for email confirmation (otp)
                setStep("otp");
                toast.info('Please check your email for the verification code.');
            }

        } catch (error: any) {
            toast.error('Error creating account', {
                description: error.message || 'Something went wrong',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifyOtp = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!otp) {
            toast.error("Please enter the verification code");
            return;
        }
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup'
            });

            if (error) throw error;

            toast.success('Email verified successfully');
            router.push('/agency');
        } catch (error: any) {
            toast.error('Verification failed', {
                description: error.message || 'Invalid code',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onResendOtp = async () => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });
            if (error) throw error;
            toast.success('Verification code resent successfully');
        } catch (error: any) {
            console.error("Resend OTP Error:", error);
            toast.error('Failed to resend code', {
                description: error.message || "Rate limit exceeded or server error"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 via-purple-700/50 to-black" />

            {/* Subtle noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Top radial glow */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-purple-400/20 blur-[80px]" />
            <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-purple-300/20 blur-[60px]"
                animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scale: [0.98, 1.02, 0.98]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "mirror"
                }}
            />
            <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-purple-400/20 blur-[60px]"
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: 1
                }}
            />

            {/* Animated glow spots */}
            <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse opacity-40" />
            <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-sm relative z-10"
                style={{ perspective: 1500 }}
            >
                <motion.div
                    className="relative"
                    style={{ rotateX, rotateY }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{ z: 10 }}
                >
                    <div className="relative group">
                        {/* Card glow effect */}
                        <motion.div
                            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
                            animate={{
                                boxShadow: [
                                    "0 0 10px 2px rgba(255,255,255,0.03)",
                                    "0 0 15px 5px rgba(255,255,255,0.05)",
                                    "0 0 10px 2px rgba(255,255,255,0.03)"
                                ],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatType: "mirror"
                            }}
                        />

                        {/* Traveling light beam effect */}
                        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
                            {/* Top light beam */}
                            <motion.div
                                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    left: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    left: {
                                        duration: 2.5,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatDelay: 1
                                    },
                                    opacity: {
                                        duration: 1.2,
                                        repeat: Infinity,
                                        repeatType: "mirror"
                                    },
                                    filter: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatType: "mirror"
                                    }
                                }}
                            />
                            {/* Other beams omitted for brevity but keeping same structure implies style consistency */}
                            {/* Right light beam */}
                            <motion.div
                                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    top: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 }
                                }}
                            />
                            {/* Bottom light beam */}
                            <motion.div
                                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    right: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 }
                                }}
                            />
                            {/* Left light beam */}
                            <motion.div
                                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                                initial={{ filter: "blur(2px)" }}
                                animate={{
                                    bottom: ["-50%", "100%"],
                                    opacity: [0.3, 0.7, 0.3],
                                    filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
                                }}
                                transition={{
                                    bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                                    opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                                    filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 }
                                }}
                            />
                        </div>

                        {/* Card border glow */}
                        <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

                        {/* Glass card background */}
                        <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.05] shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.03]"
                                style={{ backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }}
                            />

                            {/* Header Text Dynamic */}
                            <div className="text-center space-y-1 mb-5">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", duration: 0.8 }}
                                    className="mx-auto w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden bg-black/50"
                                >
                                    <Image
                                        src="/assets/chapabiz-logo.png"
                                        alt="Chapabiz Logo"
                                        fill
                                        className="object-cover p-1"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
                                </motion.div>

                                <motion.h1
                                    key={step === 'otp' ? 'otp-title' : 'signup-title'}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
                                >
                                    {step === 'otp' ? 'Verification' : 'Create Account'}
                                </motion.h1>

                                <motion.p
                                    key={step === 'otp' ? 'otp-desc' : 'signup-desc'}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-white/60 text-xs"
                                >
                                    {step === 'otp' ? `Enter the code sent to ${email}` : 'Join Chapabiz today'}
                                </motion.p>
                            </div>

                            {/* Form Steps */}
                            <AnimatePresence mode="wait">
                                {step === 'signup' ? (
                                    <motion.form
                                        key="signup-form"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={onSignUp}
                                        className="space-y-4"
                                    >
                                        <motion.div className="space-y-3">
                                            {/* Name input */}
                                            <motion.div
                                                className={`relative ${focusedInput === "name" ? 'z-10' : ''}`}
                                                whileFocus={{ scale: 1.02 }}
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                <div className="relative flex items-center overflow-hidden rounded-lg">
                                                    <User className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "name" ? 'text-white' : 'text-white/40'}`} />
                                                    <Input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        onFocus={() => setFocusedInput("name")}
                                                        onBlur={() => setFocusedInput(null)}
                                                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                                                    />
                                                    {focusedInput === "name" && (
                                                        <motion.div layoutId="input-highlight" className="absolute inset-0 bg-white/5 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Email input */}
                                            <motion.div
                                                className={`relative ${focusedInput === "email" ? 'z-10' : ''}`}
                                                whileFocus={{ scale: 1.02 }}
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                <div className="relative flex items-center overflow-hidden rounded-lg">
                                                    <Mail className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "email" ? 'text-white' : 'text-white/40'}`} />
                                                    <Input
                                                        type="email"
                                                        placeholder="Email address"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        onFocus={() => setFocusedInput("email")}
                                                        onBlur={() => setFocusedInput(null)}
                                                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10"
                                                    />
                                                    {focusedInput === "email" && (
                                                        <motion.div layoutId="input-highlight" className="absolute inset-0 bg-white/5 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Password input */}
                                            <motion.div
                                                className={`relative ${focusedInput === "password" ? 'z-10' : ''}`}
                                                whileFocus={{ scale: 1.02 }}
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />

                                                <div className="relative flex items-center overflow-hidden rounded-lg">
                                                    <Lock className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "password" ? 'text-white' : 'text-white/40'}`} />
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        onFocus={() => setFocusedInput("password")}
                                                        onBlur={() => setFocusedInput(null)}
                                                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                                                    />
                                                    <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer">
                                                        {showPassword ? (
                                                            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                                                        ) : (
                                                            <EyeOff className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                                                        )}
                                                    </div>
                                                    {focusedInput === "password" && (
                                                        <motion.div layoutId="input-highlight" className="absolute inset-0 bg-white/5 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                                                    )}
                                                </div>
                                            </motion.div>

                                            {/* Confirm Password Input */}
                                            <motion.div
                                                className={`relative ${focusedInput === "confirmPassword" ? 'z-10' : ''}`}
                                                whileFocus={{ scale: 1.02 }}
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                <div className="relative flex items-center overflow-hidden rounded-lg">
                                                    <Check className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "confirmPassword" ? 'text-white' : 'text-white/40'}`} />
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        placeholder="Confirm Password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        onFocus={() => setFocusedInput("confirmPassword")}
                                                        onBlur={() => setFocusedInput(null)}
                                                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-10 focus:bg-white/10"
                                                    />
                                                    <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 cursor-pointer">
                                                        {showConfirmPassword ? (
                                                            <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                                                        ) : (
                                                            <EyeOff className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                                                        )}
                                                    </div>
                                                    {focusedInput === "confirmPassword" && (
                                                        <motion.div layoutId="input-highlight" className="absolute inset-0 bg-white/5 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                                                    )}
                                                </div>
                                            </motion.div>
                                        </motion.div>

                                        {/* Sign up button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full relative group/button mt-5"
                                        >
                                            <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                                            <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -z-10"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                                                    style={{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                                />
                                                <AnimatePresence mode="wait">
                                                    {isLoading ? (
                                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.span key="button-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1 text-sm font-medium">
                                                            Sign Up
                                                            <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.button>

                                        <div className="relative mt-2 mb-5 flex items-center">
                                            <div className="flex-grow border-t border-white/5"></div>
                                            <motion.span className="mx-3 text-xs text-white/40" initial={{ opacity: 0.7 }} animate={{ opacity: [0.7, 0.9, 0.7] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>or</motion.span>
                                            <div className="flex-grow border-t border-white/5"></div>
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            disabled={isLoading}
                                            className="w-full relative group/google"
                                        >
                                            <div className="absolute inset-0 bg-white/5 rounded-lg blur opacity-0 group-hover/google:opacity-70 transition-opacity duration-300" />
                                            <div className="relative overflow-hidden bg-white/5 text-white font-medium h-10 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 flex items-center justify-center text-white/80 group-hover/google:text-white transition-colors duration-300">G</div>
                                                <span className="text-white/80 group-hover/google:text-white transition-colors text-xs">Sign up with Google</span>
                                                <motion.div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 1, ease: "easeInOut" }} />
                                            </div>
                                        </motion.button>

                                        <motion.p
                                            className="text-center text-xs text-white/60 mt-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            Already have an account?{' '}
                                            <Link href="/agency/sign-in" className="relative inline-block group/signup">
                                                <span className="relative z-10 text-white group-hover/signup:text-white/70 transition-colors duration-300 font-medium">Sign in</span>
                                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white group-hover/signup:w-full transition-all duration-300" />
                                            </Link>
                                        </motion.p>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="otp-form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onSubmit={onVerifyOtp}
                                        className="space-y-4"
                                    >
                                        <motion.div className="space-y-3">
                                            {/* OTP input */}
                                            <motion.div
                                                className={`relative ${focusedInput === "otp" ? 'z-10' : ''}`}
                                                whileFocus={{ scale: 1.02 }}
                                                whileHover={{ scale: 1.01 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                <div className="absolute -inset-[0.5px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                <div className="relative flex items-center overflow-hidden rounded-lg">
                                                    <Key className={`absolute left-3 w-4 h-4 transition-all duration-300 ${focusedInput === "otp" ? 'text-white' : 'text-white/40'}`} />
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Confirmation Code"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        onFocus={() => setFocusedInput("otp")}
                                                        onBlur={() => setFocusedInput(null)}
                                                        maxLength={6}
                                                        className="w-full bg-white/5 border-transparent focus:border-white/20 text-white placeholder:text-white/30 h-10 transition-all duration-300 pl-10 pr-3 focus:bg-white/10 tracking-widest"
                                                    />
                                                    {focusedInput === "otp" && (
                                                        <motion.div layoutId="input-highlight" className="absolute inset-0 bg-white/5 -z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
                                                    )}
                                                </div>
                                            </motion.div>
                                        </motion.div>

                                        {/* Verify button */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full relative group/button mt-5"
                                        >
                                            <div className="absolute inset-0 bg-white/10 rounded-lg blur-lg opacity-0 group-hover/button:opacity-70 transition-opacity duration-300" />
                                            <div className="relative overflow-hidden bg-white text-black font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center">
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -z-10"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                                                    style={{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.3s ease' }}
                                                />
                                                <AnimatePresence mode="wait">
                                                    {isLoading ? (
                                                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.span key="button-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1 text-sm font-medium">
                                                            Verify & Email
                                                            <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.button>

                                        <button
                                            type="button"
                                            onClick={onResendOtp}
                                            disabled={isLoading}
                                            className="w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors mt-2"
                                        >
                                            Didn't receive a code? Resend
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setStep("signup")}
                                            className="w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors mt-2"
                                        >
                                            Back to Sign Up
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
