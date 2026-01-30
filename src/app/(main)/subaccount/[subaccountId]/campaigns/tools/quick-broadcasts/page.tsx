import React from 'react'
import BlurPage from '@/components/global/blur-page'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Radio, Send, Zap, AlertTriangle, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: { subaccountId: string }
}

const QuickBroadcastsPage = ({ params }: Props) => {
    return (
        <BlurPage>
            <div className="flex flex-col gap-6 w-full p-4 md:p-8 max-w-4xl mx-auto">
                <Link href={`/subaccount/${params.subaccountId}/campaigns/tools`} className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm mb-2">
                    <ChevronLeft size={16} /> Back to Tools
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                <Radio size={24} />
                            </span>
                            Quick Broadcast
                        </h1>
                        <p className="text-muted-foreground mt-2">Emergency alerts and rapid updates to all contacts.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-2">
                                <AlertTriangle size={18} />
                                <span className="font-semibold text-sm uppercase tracking-wide">High Priority Mode</span>
                            </div>
                            <CardTitle>Compose Broadcast</CardTitle>
                            <CardDescription>
                                This message will be sent via SMS to <span className="font-bold text-foreground">ALL active contacts</span> immediately.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="URGENT: Store closing early due to weather..."
                                className="min-h-[120px] text-lg p-4 bg-muted/30"
                            />
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-sm">
                                <Zap size={16} /> Estimated Delivery Time: <span className="font-bold">~2 minutes</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 pt-6">
                            <Button variant="outline">Cancel</Button>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                                <Radio size={16} /> Broadcast Now
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Template Shortcuts</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['System Maintenance', 'Holiday Closing', 'Flash Sale', 'Emergency Alert'].map((t) => (
                                <div key={t} className="p-4 rounded-lg border bg-card hover:border-orange-500/50 cursor-pointer transition-colors text-center text-sm font-medium">
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BlurPage>
    )
}

export default QuickBroadcastsPage
