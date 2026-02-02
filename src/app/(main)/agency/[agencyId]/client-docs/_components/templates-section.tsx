'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DOCUMENT_TEMPLATES } from './document-templates'
import * as LucideIcons from 'lucide-react'
import { Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { upsertClientDoc } from '@/lib/client-docs-queries'
import { toast } from 'sonner'

type Props = {
    agencyId: string
}

export default function TemplatesSection({ agencyId }: Props) {
    const router = useRouter()
    const [loading, setLoading] = React.useState<string | null>(null)

    const handleUseTemplate = async (templateId: string) => {
        const template = DOCUMENT_TEMPLATES.find(t => t.id === templateId)
        if (!template) return

        setLoading(templateId)
        try {
            const data = await upsertClientDoc({
                title: `New ${template.name}`,
                type: template.type,
                agencyId: agencyId,
                status: 'DRAFT',
                content: template.content
            })
            toast.success('Document created from template')
            router.push(`/agency/${agencyId}/client-docs/${data.id}`)
        } catch (error) {
            console.error(error)
            toast.error('Failed to create document')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Quick Start Templates</h2>
                    <p className="text-sm text-muted-foreground">Launch a new document with professionally designed content</p>
                </div>
                <Link href={`/agency/${agencyId}/client-docs/new`}>
                    <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 transition-colors">
                        View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {DOCUMENT_TEMPLATES.slice(0, 5).map((template) => {
                    const IconComponent = (LucideIcons as any)[template.icon] || LucideIcons.FileText
                    const iconColor = (template as any).color || '#3b82f6'

                    return (
                        <Card
                            key={template.id}
                            className="group relative overflow-hidden border-gray-200 dark:border-zinc-800 hover:border-primary/50 transition-all cursor-pointer bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-none hover:shadow-2xl hover:shadow-primary/5 active:scale-95 duration-500"
                            onClick={() => handleUseTemplate(template.id)}
                        >
                            <CardHeader className="p-4 pb-2 relative z-10">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg border relative overflow-hidden"
                                    style={{
                                        backgroundColor: `${iconColor}10`,
                                        borderColor: `${iconColor}25`,
                                        boxShadow: `0 0 25px ${iconColor}15 inset`
                                    }}
                                >
                                    <IconComponent
                                        size={28}
                                        style={{
                                            color: iconColor,
                                            filter: `drop-shadow(0 0 10px ${iconColor}80)`
                                        }}
                                        className="relative z-10"
                                    />
                                    {/* Animated Glow Background */}
                                    <div
                                        className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                                        style={{
                                            background: `radial-gradient(circle at center, ${iconColor}, transparent 70%)`
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                                </div>
                                <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors duration-300">{template.name}</CardTitle>
                                <CardDescription className="text-[10px] line-clamp-2 mt-1 leading-relaxed h-8 opacity-80">{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 relative z-10">
                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
                                    <span
                                        className="text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wider uppercase transition-colors"
                                        style={{
                                            backgroundColor: `${iconColor}10`,
                                            color: iconColor,
                                            borderColor: `${iconColor}20`
                                        }}
                                    >
                                        {template.type.toLowerCase().replace('_', ' ')}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary text-white hover:bg-primary/90 rounded-xl shadow-xl shadow-primary/30 translate-y-2 group-hover:translate-y-0"
                                        disabled={loading === template.id}
                                    >
                                        {loading === template.id ? <LucideIcons.Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardContent>

                            {/* Decorative Background Elements */}
                            <div
                                className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                                style={{ backgroundColor: iconColor }}
                            />

                            {loading === template.id && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-[4px] flex items-center justify-center z-20 transition-all">
                                    <LucideIcons.Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
