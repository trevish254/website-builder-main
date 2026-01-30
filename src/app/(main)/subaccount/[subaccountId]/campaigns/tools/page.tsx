import React from 'react'
import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Phone, Radio, ArrowRight, Zap, CreditCard } from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: { subaccountId: string }
}

const MarketingToolsPage = ({ params }: Props) => {
    const tools = [
        {
            title: 'Bulk SMS',
            description: 'Send high-volume SMS campaigns instantly via Africa\'s Talking.',
            icon: MessageSquare,
            link: `/subaccount/${params.subaccountId}/campaigns/tools/bulk-sms`,
            color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
            stats: '98% Open Rate'
        },
        {
            title: 'Bulk Voice',
            description: 'Broadcast voice messages to your audience lists.',
            icon: Phone,
            link: `/subaccount/${params.subaccountId}/campaigns/tools/bulk-voice`,
            color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
            stats: 'High Engagement'
        },
        {
            title: 'Quick Broadcasts',
            description: 'Rapidly blast updates to all your contacts with one click.',
            icon: Radio,
            link: `/subaccount/${params.subaccountId}/campaigns/tools/quick-broadcasts`,
            color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
            stats: 'Instant Delivery'
        }
    ]

    return (
        <BlurPage>
            <div className="flex flex-col gap-8 w-full p-4 md:p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Zap className="fill-yellow-400 text-yellow-500" /> Marketing Tools
                    </h1>
                    <p className="text-muted-foreground">Power up your reach with Africa's Talking integrations.</p>
                </div>

                {/* Balance / Status Card - Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">SMS Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">KES 4,500.00</div>
                            <p className="text-xs opacity-75 mt-1">~2,250 SMS remaining</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Voice Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">KES 1,200.00</div>
                            <p className="text-xs opacity-75 mt-1">~120 mins call time</p>
                        </CardContent>
                    </Card>
                    <Card className="border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-center">
                        <CardContent className="flex flex-col items-center justify-center gap-2 py-6">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-semibold text-primary">Top Up Credits</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link href={tool.link} key={tool.title} className="group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 border-muted group-hover:border-primary/50 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${tool.color.split(' ')[2]}`}>
                                    <tool.icon size={120} />
                                </div>
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}>
                                        <tool.icon size={24} />
                                    </div>
                                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 mt-2">{tool.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                            {tool.stats}
                                        </span>
                                        <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                            Open <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Recent Activity Mockup */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Recent Broadcasts</h2>
                    <Card>
                        <CardContent className="p-0">
                            <div className="divide-y divide-muted">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                                <MessageSquare size={16} />
                                            </div>
                                            <div>
                                                <div className="font-medium">Flash Sale Announcement</div>
                                                <div className="text-xs text-muted-foreground">Sent to 1,234 recipients • SMS</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-emerald-600">Delivered</div>
                                            <div className="text-xs text-muted-foreground">2 hours ago</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </BlurPage>
    )
}

export default MarketingToolsPage
