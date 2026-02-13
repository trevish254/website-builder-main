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
import { getWebsiteTemplates } from '@/lib/export-actions'
import CreateWebsiteBtn from './_components/create-website-btn'
import DeleteWebsiteBtn from './_components/delete-website-btn'

type Props = {
    params: { subaccountId: string }
    searchParams: { template?: string }
}

const WebsitesPage = async ({ params, searchParams }: Props) => {
    console.log('🖥️ Rendering WebsitesPage for:', params.subaccountId)
    // Fetch real data
    const existingProjects = await getWebsites(params.subaccountId)
    console.log('✅ Fetched websites:', existingProjects?.length || 0)


    // Fetch community templates
    const dbTemplates = await getWebsiteTemplates()
    console.log('✅ Fetched dbTemplates:', dbTemplates?.length || 0)


    const staticTemplates = [
        { id: 'manufacturing', name: 'Manufacturing Excellence', description: 'Premium business template for industrial and tech companies', color: 'bg-emerald-100 dark:bg-emerald-900/20', isCommunity: false, thumbnail: 'C:/Users/TREV/.gemini/antigravity/brain/c0f54b9e-9cfe-4c90-8136-1d8852f03504/manufacturing_template_thumbnail_1768111055670.png' },
        { id: 'renewable', name: 'Renewable Future', description: 'Clean energy and sustainability template with high-impact visuals', color: 'bg-green-50 dark:bg-green-900/10', isCommunity: false, thumbnail: 'C:/Users/TREV/.gemini/antigravity/brain/c0f54b9e-9cfe-4c90-8136-1d8852f03504/renewable_energy_template_thumbnail_1768111468207.png' },
        { id: 'legal', name: 'Law & Tax Advisor', description: 'Sophisticated legal and consultancy template for high-trust brands', color: 'bg-slate-100 dark:bg-slate-900/20', isCommunity: false, thumbnail: 'C:/Users/TREV/.gemini/antigravity/brain/c0f54b9e-9cfe-4c90-8136-1d8852f03504/legal_template_thumbnail_1768112248203.png' },
        { id: 't1', name: 'Agency Portfolio', description: 'Modern agency landing page', color: 'bg-blue-100 dark:bg-blue-900/20', isCommunity: false },
        { id: 't2', name: 'SaaS Startup', description: 'Clean SaaS product showcase', color: 'bg-purple-100 dark:bg-purple-900/20', isCommunity: false },
        { id: 't3', name: 'E-commerce Store', description: 'Featured products and cart', color: 'bg-green-100 dark:bg-green-900/20', isCommunity: false },
        { id: 't4', name: 'Restaurant Menu', description: 'Elegant Italian restaurant', color: 'bg-orange-100 dark:bg-orange-900/20', isCommunity: false },
        { id: 't5', name: 'Personal Portfolio', description: 'Designer & developer showcase', color: 'bg-slate-100 dark:bg-slate-900/20', isCommunity: false },
        { id: 't6', name: 'Blog/Magazine', description: 'Article-focused publication', color: 'bg-red-100 dark:bg-red-900/20', isCommunity: false },
        { id: 't7', name: 'Fitness/Gym', description: 'Classes and membership plans', color: 'bg-teal-100 dark:bg-teal-900/20', isCommunity: false },
    ]

    const allTemplates = [
        ...staticTemplates.map(t => ({ ...t, isPremium: true })),
        ...dbTemplates.map(t => ({
            id: t.id,
            name: t.name,
            description: t.description || '',
            thumbnail: t.thumbnail,
            color: t.category === 'Business' ? 'bg-emerald-100 dark:bg-emerald-900/20' : 'bg-muted',
            isCommunity: t.createdBy !== null,
            isPremium: t.createdBy === null
        }))
    ]

    // Sort to put High Priority templates first, then Premium/System, then Community
    allTemplates.sort((a, b) => {
        // Manufacturing Excellence should be at the very top
        if (a.name === 'Manufacturing Excellence') return -1
        if (b.name === 'Manufacturing Excellence') return 1

        // Then other Premium/System templates
        if (a.isPremium && !b.isPremium) return -1
        if (!a.isPremium && b.isPremium) return 1

        return 0
    })

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
                            {existingProjects.map((project) => {
                                const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'
                                const effectiveSubdomain = project.subdomain || `${slugify(project.name)}.${project.id.substring(0, 7)}`
                                const defaultDomain = `${effectiveSubdomain}.${mainDomain}`
                                const displayDomain = project.domain || defaultDomain
                                return (
                                    <Card key={project.id} className="group overflow-hidden border-muted hover:border-primary/50 hover:shadow-md transition-all">
                                        <div className="relative aspect-[16/9] bg-muted flex items-center justify-center overflow-hidden border-b">
                                            {(() => {
                                                // Find the home page or the first page to use for the thumbnail
                                                const homePage = project.WebsitePage.find((page: any) => page.pathName === '/') || project.WebsitePage[0]
                                                const previewImage = homePage?.previewImage || project.previewImage

                                                return previewImage ? (
                                                    <img src={previewImage} alt={project.name} className="w-full h-full object-cover object-top" />
                                                ) : project.favicon ? (
                                                    <img src={project.favicon} alt={project.name} className="w-full h-full object-cover object-top" />
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

                                                {displayDomain && (
                                                    <a href={`http://${displayDomain}`} target="_blank" rel="noopener noreferrer">
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
                                            {defaultDomain && (
                                                <a
                                                    href={`http://${defaultDomain}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary hover:underline break-all mt-1 flex items-center gap-1"
                                                >
                                                    <Globe size={12} />
                                                    {defaultDomain}
                                                </a>
                                            )}
                                            {project.domain && project.domain !== defaultDomain && (
                                                <div className="text-xs text-muted-foreground break-all mt-1 opacity-70">
                                                    Custom: {project.domain}
                                                </div>
                                            )}
                                        </CardHeader>
                                    </Card>
                                )
                            })}
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
                        {allTemplates.map(temp => (
                            <Card key={temp.id} className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden border-muted">
                                <div className={`aspect-[4/3] ${temp.color} relative overflow-hidden`}>
                                    {/* Thumbnail or Placeholder */}
                                    {temp.thumbnail ? (
                                        <img
                                            src={temp.thumbnail}
                                            alt={temp.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 group-hover:scale-105 transition-transform duration-500">
                                            <LayoutTemplate size={48} opacity={0.5} />
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                                        {temp.isPremium && (
                                            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                                                Premium
                                            </span>
                                        )}
                                        {temp.isCommunity && (
                                            <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm backdrop-blur-sm">
                                                Community
                                            </span>
                                        )}
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-30">
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
