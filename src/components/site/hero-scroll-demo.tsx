"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
    return (
        <div className="flex flex-col overflow-hidden pt-[200px] -mt-[200px]">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-black dark:text-white">
                            Manage your agency <br />
                            <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                                With Efficiency
                            </span>
                        </h1>
                    </>
                }
            >
                <Image
                    src={`https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop`}
                    alt="hero"
                    height={720}
                    width={1400}
                    className="mx-auto rounded-2xl object-cover h-full object-left-top"
                    draggable={false}
                />
            </ContainerScroll>

            <div className="container mx-auto px-4 py-20 -mt-[100px] relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold">Global Reach</h3>
                        <p className="text-muted-foreground">Expand your agency's footprint with tools designed for international scaling and multi-currency support.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        </div>
                        <h3 className="text-xl font-bold">Smart Monetization</h3>
                        <p className="text-muted-foreground">Automate billing, subscriptions, and invoicing. Recover failed payments and optimize cash flow effortlessly.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold">Ironclad Security</h3>
                        <p className="text-muted-foreground">Keep your client data safe with enterprise-grade encryption, role-based access, and automated backups.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
