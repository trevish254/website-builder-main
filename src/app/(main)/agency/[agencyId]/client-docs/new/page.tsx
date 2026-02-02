'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { upsertClientDoc } from '@/lib/client-docs-queries'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DOCUMENT_TEMPLATES } from '../_components/document-templates'
import * as LucideIcons from 'lucide-react'

export default function NewClientDocPage({ params }: { params: { agencyId: string } }) {
    const [title, setTitle] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async () => {
        if (!title) return toast.error('Title is required')
        if (!selectedTemplate) return toast.error('Please select a template')

        setLoading(true)
        try {
            const template = DOCUMENT_TEMPLATES.find(t => t.id === selectedTemplate)
            if (!template) return

            const data = await upsertClientDoc({
                title,
                type: template.type,
                agencyId: params.agencyId,
                status: 'DRAFT',
                content: template.content
            })
            toast.success('Document created')
            router.refresh()
            router.push(`/agency/${params.agencyId}/client-docs/${data.id}`)
        } catch (error) {
            console.error(error)
            toast.error('Failed to create document')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b bg-background">
                <Link href={`/agency/${params.agencyId}/client-docs`}>
                    <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Create New Document</h1>
                    <p className="text-sm text-muted-foreground">Choose a template to get started</p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Document Title */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Document Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Document Title</Label>
                                <Input
                                    placeholder="e.g. Website Agreement, Welcome Letter"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Template Selection */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Choose a Template</h2>
                            <p className="text-sm text-muted-foreground">Select a pre-designed template or start from scratch</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {DOCUMENT_TEMPLATES.map((template) => {
                                const IconComponent = (LucideIcons as any)[template.icon] || LucideIcons.FileText
                                const iconColor = (template as any).color || '#3b82f6'
                                const isSelected = selectedTemplate === template.id

                                return (
                                    <Card
                                        key={template.id}
                                        className={`cursor-pointer transition-all duration-300 relative overflow-hidden group ${isSelected
                                            ? 'border-primary shadow-lg shadow-primary/10 bg-primary/5'
                                            : 'hover:border-primary/50 bg-background/50 hover:bg-background'
                                            }`}
                                        onClick={() => setSelectedTemplate(template.id)}
                                    >
                                        <CardHeader className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-md border overflow-hidden ${isSelected ? 'scale-110 rotate-3' : 'group-hover:scale-105'}`}
                                                    style={{
                                                        backgroundColor: `${iconColor}${isSelected ? '20' : '10'}`,
                                                        borderColor: `${iconColor}${isSelected ? '40' : '20'}`,
                                                    }}
                                                >
                                                    <IconComponent
                                                        size={28}
                                                        style={{
                                                            color: iconColor,
                                                            filter: `drop-shadow(0 0 8px ${iconColor}${isSelected ? '99' : '60'})`
                                                        }}
                                                        className="relative z-10"
                                                    />
                                                    <div
                                                        className={`absolute inset-0 transition-opacity duration-500 ${isSelected ? 'opacity-40' : 'opacity-10 group-hover:opacity-30'}`}
                                                        style={{
                                                            background: `radial-gradient(circle at center, ${iconColor}, transparent 70%)`
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className={`text-base font-bold truncate transition-colors ${isSelected ? 'text-primary' : 'group-hover:text-primary/80'}`}>
                                                        {template.name}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs mt-1 line-clamp-2 leading-relaxed">
                                                        {template.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        {isSelected && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                                        )}
                                        <div
                                            className={`absolute -right-4 -top-4 w-20 h-20 blur-3xl transition-opacity duration-500 pointer-events-none ${isSelected ? 'opacity-20' : 'opacity-0'}`}
                                            style={{ backgroundColor: iconColor }}
                                        />
                                    </Card>
                                )
                            })}
                        </div>
                    </div>

                    {/* Create Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleCreate}
                            disabled={loading || !title || !selectedTemplate}
                            size="lg"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Document
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
