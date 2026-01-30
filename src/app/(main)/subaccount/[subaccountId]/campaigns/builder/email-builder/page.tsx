import React from 'react'
import { LayoutTemplate, Mail } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import BlurPage from '@/components/global/blur-page'
import { getEmailCampaigns } from '@/lib/email-queries'
import CreateEmailButton from './_components/create-email-button'
import { format } from 'date-fns'

type Props = {
    params: { subaccountId: string }
}

const EmailBuilderPage = async ({ params }: Props) => {
    const campaigns = await getEmailCampaigns(params.subaccountId)

    // Mock templates for Email
    const staticTemplates = [
        { id: 'newsletter-1', name: 'Weekly Newsletter', description: 'Clean layout for weekly updates', color: 'bg-blue-100 dark:bg-blue-900/20' },
        { id: 'promo-1', name: 'Product Promo', description: 'High conversion promotional email', color: 'bg-orange-100 dark:bg-orange-900/20' },
        { id: 'welcome-1', name: 'Welcome Series', description: 'Warm welcome for new subscribers', color: 'bg-emerald-100 dark:bg-emerald-900/20' },
        { id: 'event-1', name: 'Event Invitation', description: 'RSVP focus for webinars and events', color: 'bg-purple-100 dark:bg-purple-900/20' },
    ]

    return (
        <BlurPage>
            <div className="flex flex-col gap-8 w-full p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Email Builder</h1>
                        <p className="text-muted-foreground mt-1">Design and manage your email marketing campaigns.</p>
                    </div>
                    <CreateEmailButton subaccountId={params.subaccountId} />
                </div>

                {/* Recent Projects */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Mail size={20} /> Recent Emails
                        </h2>
                    </div>

                    {campaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => (
                                <Link
                                    href={`/subaccount/${params.subaccountId}/campaigns/builder/email-builder/${campaign.id}`}
                                    key={campaign.id}
                                >
                                    <Card className="hover:border-primary/50 transition-all group overflow-hidden border-muted">
                                        <div className="aspect-video bg-muted/50 relative overflow-hidden flex items-center justify-center">
                                            {campaign.previewImage ? (
                                                <img
                                                    src={campaign.previewImage}
                                                    alt={campaign.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <Mail size={40} className="text-muted-foreground/20" />
                                            )}
                                        </div>
                                        <CardHeader className="p-4">
                                            <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                            <CardDescription>
                                                Last updated: {format(new Date(campaign.updatedAt), 'MMM d, yyyy')}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-muted-foreground bg-muted/20 hover:bg-muted/30 transition-colors">
                            <Mail size={48} className="mb-4 opacity-30" />
                            <h3 className="text-lg font-medium mb-2">No emails found</h3>
                            <p className="mb-6 max-w-sm text-center">You haven't created any emails yet. Start from scratch or choose a template below.</p>
                        </div>
                    )}
                </div>

                {/* Templates */}
                <div className="flex flex-col gap-4 overflow-visible">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <LayoutTemplate size={20} /> Start with a Template
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {staticTemplates.map(temp => (
                            <Card key={temp.id} className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden border-muted">
                                <div className={`aspect-[4/3] ${temp.color} relative overflow-hidden flex items-center justify-center`}>
                                    <LayoutTemplate size={48} className="text-muted-foreground/30 group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <CreateEmailButton subaccountId={params.subaccountId} />
                                    </div>
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">{temp.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{temp.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </BlurPage>
    )
}

export default EmailBuilderPage
