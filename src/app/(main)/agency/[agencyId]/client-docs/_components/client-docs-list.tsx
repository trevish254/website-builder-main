'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Pencil, Trash2, FileText } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteClientDoc } from '@/lib/client-docs-queries'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import DocumentThumbnail from './document-thumbnail'

type Props = {
    docs: any[]
    agencyId: string
    viewMode: 'grid' | 'list'
}

const getDocumentPreview = (content: any) => {
    if (!content || !content.blocks || content.blocks.length === 0) {
        return 'Empty document'
    }

    // Get first few blocks for preview
    const previewBlocks = content.blocks.slice(0, 3)
    return previewBlocks.map((block: any) => {
        if (block.type === 'header') return block.data.text
        if (block.type === 'paragraph') return block.data.text?.replace(/<[^>]*>/g, '') || ''
        if (block.type === 'list') return block.data.items?.join(', ') || ''
        return ''
    }).filter(Boolean).join(' • ').substring(0, 150) + '...'
}

const getDocumentIcon = (type: string) => {
    const icons: Record<string, string> = {
        'AGREEMENT': '📄',
        'WELCOME': '👋',
        'INVOICE': '💰',
        'CLIENT_PORTAL': '🌐',
        'STRATEGY_CALL': '🎯',
        'FULFILLMENT': '✅',
        'CONTENT_USAGE_GUIDE': '📖',
        'MONTHLY_REPORT': '📊',
        'COMPETITOR_ANALYSIS': '🔍',
        'THANK_YOU': '🙏',
        'FEEDBACK_REQUEST': '💬',
        'CUSTOM': '📝'
    }
    return icons[type] || '📄'
}

export default function ClientDocsList({ docs, agencyId, viewMode }: Props) {
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return

        try {
            await deleteClientDoc(id)
            toast.success('Document deleted')
            router.refresh()
        } catch (error) {
            toast.error('Failed to delete document')
        }
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {docs.map((doc) => (
                    <Card key={doc.id} className="group hover:shadow-lg transition-all overflow-hidden">
                        <Link href={`/agency/${agencyId}/client-docs/${doc.id}`}>
                            {/* Document Thumbnail */}
                            {/* Document Thumbnail */}
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-800 border-b overflow-hidden">
                                <DocumentThumbnail content={doc.content} />
                                <div className="absolute top-3 right-3 z-10">
                                    <Badge variant="secondary" className="text-xs shadow-sm bg-white/90 dark:bg-black/90 backdrop-blur-sm">
                                        {doc.status}
                                    </Badge>
                                </div>
                            </div>
                        </Link>

                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base truncate">{doc.title}</CardTitle>
                                    <CardDescription className="text-xs mt-1">
                                        {doc.type.replace(/_/g, ' ')}
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/agency/${agencyId}/client-docs/${doc.id}`}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(doc.id)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground">
                                Updated {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // List View
    return (
        <div className="space-y-2">
            {docs.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="text-3xl">{getDocumentIcon(doc.type)}</div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <Link href={`/agency/${agencyId}/client-docs/${doc.id}`}>
                                    <h3 className="font-semibold hover:underline truncate">{doc.title}</h3>
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                        {doc.type.replace(/_/g, ' ')}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {doc.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Updated {new Date(doc.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {getDocumentPreview(doc.content)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/agency/${agencyId}/client-docs/${doc.id}`}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(doc.id)}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
