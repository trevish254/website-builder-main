"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { CheckSquare, Users, FileText } from "lucide-react";

export function HeroScrollDemo() {
    return (
        <div className="flex flex-col overflow-hidden pt-[200px] -mt-[200px]">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-black dark:text-white">
                            Operations & Delivery <br />
                            <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                                From “Client Signed” <br /> to “Work Delivered”
                            </span>
                        </h1>
                        <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Winning clients is one thing. Delivering consistently is another. Chapabiz helps you manage the work after the deal is closed.
                        </p>
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
                            <CheckSquare className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold">Task Management</h3>
                        <p className="text-muted-foreground">Track tasks, manage projects visually with Kanban boards, and keep your team aligned without switching apps.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold">Client Hubs</h3>
                        <p className="text-muted-foreground">Give clients a professional, branded portal to view progress, approve assets, and stay updated in real-time.</p>
                    </div>
                    <div className="flex flex-col gap-4 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center">
                            <FileText className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold">Integrated Docs</h3>
                        <p className="text-muted-foreground">Create proposals, contracts, and SOPs directly in the platform. Collaborate with your team as you build.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
