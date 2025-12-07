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
                            {DOCUMENT_TEMPLATES.map((template) => (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.id
                                        ? 'border-primary ring-2 ring-primary'
                                        : 'hover:border-primary/50'
                                        }`}
                                    onClick={() => setSelectedTemplate(template.id)}
                                >
                                    <CardHeader>
                                        <div className="flex items-start gap-3">
                                            <div className="text-4xl">{template.icon}</div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                <CardDescription className="text-xs mt-1">
                                                    {template.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
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
