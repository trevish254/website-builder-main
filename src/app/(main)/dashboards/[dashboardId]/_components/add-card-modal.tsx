'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Plus, DollarSign, Contact2, Goal } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import CountCard from '@/components/dashboard/cards/count-card'
import GraphCard from '@/components/dashboard/cards/graph-card'
import ListCard from '@/components/dashboard/cards/list-card'

type Props = {
    isOpen: boolean
    onClose: () => void
    onAdd: (type: string) => void
}

const CARD_TYPES = [
    {
        type: 'graph',
        title: 'Chart / Graph',
        description: 'Visualize data trends with area, bar, or line charts.',
        component: <GraphCard title="Revenue" chartType="area" className="p-2" />,
        color: 'bg-blue-500/10',
    },
    {
        type: 'count',
        title: 'Metric / Count',
        description: 'Display single key metrics like total income or active users.',
        component: <CountCard title="Total Income" metric="income" icon="dollar" value={14500} />,
        color: 'bg-green-500/10',
    },
    {
        type: 'list',
        title: 'List / Table',
        description: 'Show lists of recent activities, logs, or items.',
        component: <ListCard title="Recent Activity" limit={3} />,
        color: 'bg-orange-500/10',
    },
    {
        type: 'notes',
        title: 'Notes / Text',
        description: 'Rich text notes with support for lists, headers, and images.',
        component: <div className="p-4 prose prose-sm dark:prose-invert">
            <h3>Meeting Notes</h3>
            <ul>
                <li>Review Q3 goals</li>
                <li>Discuss budget</li>
                <li><strong>Action items:</strong></li>
            </ul>
        </div>,
        color: 'bg-yellow-500/10',
    },
    {
        type: 'discussion',
        title: 'Discussion / Chat',
        description: 'Collaborate and chat with team members directly on the dashboard.',
        component: <div className="p-4 flex flex-col gap-3 h-full justify-between">
            <div className="space-y-4">
                <div className="flex flex-col items-start">
                    <div className="bg-muted rounded-lg rounded-bl-none px-3 py-2 text-xs max-w-[80%]">
                        Hey team, check out these numbers!
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1">Alice • 9:41 AM</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="bg-primary text-primary-foreground rounded-lg rounded-br-none px-3 py-2 text-xs max-w-[80%]">
                        Looks great! Good job.
                    </div>
                    <span className="text-[9px] text-muted-foreground mt-1">9:42 AM</span>
                </div>
            </div>
        </div>,
        color: 'bg-purple-500/10',
    },
    {
        type: 'income',
        title: 'Income',
        description: 'Total revenue generated through transactions.',
        component: <div className="relative p-4">
            <CardDescription className="text-xs mb-2">Income</CardDescription>
            <CardTitle className="text-3xl mb-1">$14,500.50</CardTitle>
            <small className="text-[10px] text-muted-foreground">For the year 2024</small>
            <DollarSign className="absolute right-2 top-2 text-muted-foreground w-5 h-5" />
        </div>,
        color: 'bg-emerald-500/10',
    },
    {
        type: 'potential-income',
        title: 'Potential Income',
        description: 'This is how much you can close.',
        component: <div className="relative p-4">
            <CardDescription className="text-xs mb-2">Potential Income</CardDescription>
            <CardTitle className="text-3xl mb-1">$8,250.00</CardTitle>
            <small className="text-[10px] text-muted-foreground">For the year 2024</small>
            <DollarSign className="absolute right-2 top-2 text-muted-foreground w-5 h-5" />
        </div>,
        color: 'bg-cyan-500/10',
    },
    {
        type: 'active-clients',
        title: 'Active Clients',
        description: 'Reflects the number of sub accounts you own and manage.',
        component: <div className="relative p-4">
            <CardDescription className="text-xs mb-2">Active Clients</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
            <Contact2 className="absolute right-2 top-2 text-muted-foreground w-5 h-5" />
        </div>,
        color: 'bg-indigo-500/10',
    },
    {
        type: 'agency-goal',
        title: 'Agency Goal',
        description: 'Reflects the number of sub accounts you want to own and manage.',
        component: <div className="relative p-4">
            <CardTitle className="text-sm mb-2">Agency Goal</CardTitle>
            <div className="flex flex-col w-full mt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground text-[10px]">Current: 12</span>
                    <span className="text-muted-foreground text-[10px]">Goal: 20</span>
                </div>
                <Progress value={60} className="h-2" />
            </div>
            <Goal className="absolute right-2 top-2 text-muted-foreground w-5 h-5" />
        </div>,
        color: 'bg-pink-500/10',
    },
    // Future types:
    // { type: 'funnel', ... }
    // { type: 'media', ... }
]

export default function AddCardModal({ isOpen, onClose, onAdd }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1000px] h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Dashboard Card</DialogTitle>
                    <DialogDescription>
                        Choose a card type to add to your dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                    {CARD_TYPES.map((card) => (
                        <Card
                            key={card.type}
                            className={cn(
                                "cursor-pointer hover:border-primary transition-all hover:shadow-lg group relative overflow-hidden flex flex-col",
                            )}
                            onClick={() => {
                                onAdd(card.type)
                                onClose()
                            }}
                        >
                            {/* Preview Area */}
                            <div className="h-[200px] w-full bg-muted/20 border-b p-4 relative overflow-hidden pointer-events-none select-none">
                                <div className="absolute inset-0 bg-transparent z-10" />
                                {/* Scale down specific components if needed, or rely on responsive self-layout */}
                                <div className="h-full w-full transform scale-[0.8] origin-center flex items-center justify-center">
                                    <div className="w-full h-full bg-background rounded-md shadow-sm border p-4">
                                        {card.component}
                                    </div>
                                </div>
                            </div>

                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none", card.color)} />

                            <CardHeader className="p-4 bg-card z-20">
                                <CardTitle className="text-base">{card.title}</CardTitle>
                                <CardDescription className="text-xs">{card.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}

                    {/* Placeholder for 'Coming Soon' */}
                    <Card className="border-dashed flex flex-col items-center justify-center opacity-50 bg-muted/30 min-h-[200px]">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Plus className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground font-medium">More Coming Soon</p>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    )
}
