import React from 'react'
import { Plus, LayoutTemplate, Globe, MoreVertical, ExternalLink, Edit, Trash } from 'lucide-react'
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
import { getWebsites } from '@/lib/website-queries'
import CreateWebsiteBtn from './_components/create-website-btn'
import DeleteWebsiteBtn from './_components/delete-website-btn'

type Props = {
    params: { subaccountId: string }
    searchParams: { template?: string }
}

const WebsitesPage = async ({ params, searchParams }: Props) => {
    // Fetch real data
    const existingProjects = await getWebsites(params.subaccountId)

    const templates = [
        { id: 't1', name: 'Agency Portfolio', description: 'Modern agency landing page', color: 'bg-blue-100 dark:bg-blue-900/20' },
        { id: 't2', name: 'SaaS Startup', description: 'Clean SaaS product showcase', color: 'bg-purple-100 dark:bg-purple-900/20' },
        { id: 't3', name: 'E-commerce Store', description: 'Featured products and cart', color: 'bg-green-100 dark:bg-green-900/20' },
        { id: 't4', name: 'Restaurant Menu', description: 'Appetizing visual menu', color: 'bg-orange-100 dark:bg-orange-900/20' },
    ]

    return (
        <BlurPage>
            <div className="flex flex-col gap-8 w-full p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Websites</h1>
                        <p className="text-muted-foreground mt-1">Manage, create, and publish your websites.</p>
                    </div>
                    <CreateWebsiteBtn subaccountId={params.subaccountId} templateId={searchParams.template} />
                </div>

                {/* Recent Projects */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Globe size={20} /> Recent Projects
                        </h2>
                    </div>

                    {existingProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {existingProjects.map((project) => (
                                <Card key={project.id} className="group overflow-hidden border-muted hover:border-primary/50 hover:shadow-md transition-all">
                                    <div className="relative aspect-[16/9] bg-muted flex items-center justify-center overflow-hidden border-b">
                                        {(() => {
                                            // Find the home page or the first page to use for the thumbnail
                                            const homePage = project.WebsitePage.find((page: any) => page.pathName === '/') || project.WebsitePage[0]
                                            const previewImage = homePage?.previewImage || project.previewImage

                                            return previewImage ? (
                                                <img src={previewImage} alt={project.name} className="w-full h-full object-cover" />
                                            ) : project.favicon ? (
                                                <img src={project.favicon} alt={project.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Globe className="w-12 h-12 text-muted-foreground/20" />
                                            )
                                        })()}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                            <Link href={`/subaccount/${params.subaccountId}/websites/editor/${project.id}`}>
                                                <Button size="sm" variant="secondary" className="gap-2">
                                                    <Edit size={14} /> Edit
                                                </Button>
                                            </Link>

                                            {project.domain && (
                                                <a href={`http://${project.domain}`} target="_blank" rel="noopener noreferrer">
                                                    <Button size="sm" variant="outline" className="gap-2">
                                                        <ExternalLink size={14} /> Visit
                                                    </Button>
                                                </a>
                                            )}
                                            <DeleteWebsiteBtn websiteId={project.id} />
                                        </div>
                                    </div>
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-lg flex justify-between items-center">
                                            <span className="truncate">{project.name}</span>
                                            {project.published ? (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full dark:bg-green-900/30 dark:text-green-400">Live</span>
                                            ) : (
                                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-400">Draft</span>
                                            )}
                                        </CardTitle>
                                        <CardDescription>
                                            Last updated {new Date(project.updatedAt).toLocaleDateString()}
                                        </CardDescription>
                                        {project.domain && (
                                            <div className="text-xs text-muted-foreground truncate mt-1">
                                                {project.domain}
                                            </div>
                                        )}
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-muted-foreground bg-muted/20 hover:bg-muted/30 transition-colors">
                            <Globe size={48} className="mb-4 opacity-30" />
                            <h3 className="text-lg font-medium mb-2">No projects found</h3>
                            <p className="mb-6 max-w-sm text-center">You haven't created any websites yet. Start from scratch or choose a template below.</p>
                        </div>
                    )}
                </div>

                {/* Templates */}
                <div className="flex flex-col gap-4 overflow-visible">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <LayoutTemplate size={20} /> Start with a Template
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {templates.map(temp => (
                            <Card key={temp.id} className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden border-muted">
                                <div className={`aspect-[4/3] ${temp.color} relative overflow-hidden`}>
                                    {/* Placeholder for template visually */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 group-hover:scale-105 transition-transform duration-500">
                                        <LayoutTemplate size={48} opacity={0.5} />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <CreateWebsiteBtn
                                                subaccountId={params.subaccountId}
                                                templateId={temp.id}
                                                size="sm"
                                                className="gap-2 shadow-lg"
                                            >
                                                Use Template
                                            </CreateWebsiteBtn>
                                        </div>
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

export default WebsitesPage
