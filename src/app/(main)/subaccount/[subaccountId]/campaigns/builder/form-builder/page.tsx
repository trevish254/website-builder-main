import React from 'react'
import { Plus, LayoutTemplate, FileText, MoreVertical, ExternalLink, Edit, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import BlurPage from '@/components/global/blur-page'

type Props = {
    params: { subaccountId: string }
    searchParams: { template?: string }
}

const FormBuilderPage = ({ params, searchParams }: Props) => {
    // Mock data
    const existingProjects: any[] = []

    // Mock templates for Forms
    const staticTemplates = [
        { id: 'lead-gen-1', name: 'Lead Generation', description: 'Capture leads with a high-converting form', color: 'bg-indigo-100 dark:bg-indigo-900/20', isCommunity: false, thumbnail: '' },
        { id: 'contact-1', name: 'Contact Us', description: 'Standard contact form for general inquiries', color: 'bg-slate-100 dark:bg-slate-900/20', isCommunity: false, thumbnail: '' },
        { id: 'registration-1', name: 'Event Registration', description: 'Register attendees for your next event', color: 'bg-rose-100 dark:bg-rose-900/20', isCommunity: false, thumbnail: '' },
        { id: 'feedback-1', name: 'Feedback Form', description: 'Collect valuable user feedback', color: 'bg-teal-100 dark:bg-teal-900/20', isCommunity: false, thumbnail: '' },
    ]

    return (
        <BlurPage>
            <div className="flex flex-col gap-8 w-full p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Form Builder</h1>
                        <p className="text-muted-foreground mt-1">Create and manage forms to capture user data.</p>
                    </div>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Form
                    </Button>
                </div>

                {/* Recent Projects */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <FileText size={20} /> Recent Forms
                        </h2>
                    </div>

                    {existingProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Rendering logic for existing projects would go here */}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-muted-foreground bg-muted/20 hover:bg-muted/30 transition-colors">
                            <FileText size={48} className="mb-4 opacity-30" />
                            <h3 className="text-lg font-medium mb-2">No forms found</h3>
                            <p className="mb-6 max-w-sm text-center">You haven't created any forms yet. Start from scratch or choose a template below.</p>
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
                                <div className={`aspect-[4/3] ${temp.color} relative overflow-hidden`}>
                                    {/* Thumbnail or Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 group-hover:scale-105 transition-transform duration-500">
                                        <LayoutTemplate size={48} opacity={0.5} />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-30">
                                        <Button size="sm" className="gap-2 shadow-lg">
                                            Use Template
                                        </Button>
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

export default FormBuilderPage
