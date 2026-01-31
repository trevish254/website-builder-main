"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Paperclip, MessageSquare, MoreHorizontal, Calendar, Briefcase } from "lucide-react";

interface WorkloadCardProps {
    name: string;
    role: string;
    avatarUrl?: string;
    joinedDate: string;
    department?: string;
    workload: number;
    status: "available" | "busy" | "away" | "offline";
    onChat?: () => void;
    onDetails?: () => void;
}

export default function WorkloadCard({
    name,
    role,
    avatarUrl,
    joinedDate,
    department = "Engineering",
    workload,
    status,
    onChat,
    onDetails,
}: WorkloadCardProps) {

    const statusConfig = {
        available: { color: "bg-emerald-500", text: "Available", badge: "bg-emerald-100 text-emerald-700" },
        busy: { color: "bg-red-500", text: "In meeting", badge: "bg-red-100 text-red-700" },
        away: { color: "bg-amber-500", text: "On leave", badge: "bg-amber-100 text-amber-700" },
        offline: { color: "bg-slate-400", text: "Offline", badge: "bg-slate-100 text-slate-700" },
    };

    const currentStatus = statusConfig[status] || statusConfig.offline;

    return (
        <Card className="w-full max-w-sm border-2 rounded-[24px] shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-950 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between p-6 pb-2">
                <div className="flex gap-4">
                    <div className="relative">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
                            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={cn("absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ring-1 ring-zinc-100", currentStatus.color)} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="font-bold text-lg leading-none">{name}</h3>
                        <span className="text-sm text-muted-foreground font-medium">{role}</span>
                    </div>
                </div>
                <Badge variant="secondary" className={cn("rounded-full px-3 py-1 font-semibold", currentStatus.badge)}>
                    {currentStatus.text}
                </Badge>
            </CardHeader>

            <CardContent className="p-6 pt-4 space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Joined
                        </span>
                        <p className="font-medium">{joinedDate}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> Department
                        </span>
                        <p className="font-medium">{department}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-muted-foreground">Workload</span>
                        <span className="font-bold">{workload}%</span>
                    </div>
                    <Progress value={workload} className="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800" indicatorClassName="bg-black dark:bg-white" />
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border-t flex justify-between">
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-zinc-300 shadow-sm">
                        <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-white hover:border-zinc-300 shadow-sm" onClick={onDetails}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" onClick={onChat}>
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </CardFooter>
        </Card>
    );
}
