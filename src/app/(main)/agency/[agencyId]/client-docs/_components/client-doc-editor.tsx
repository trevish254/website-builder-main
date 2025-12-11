
'use client'
import { useRef, useState, useEffect } from 'react'
import EditorWrapper, { EditorHandle } from './editor-wrapper'
import EditorToolbar from './editor-toolbar'
import PageSidebar, { DocumentPage } from './page-sidebar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { upsertClientDoc } from '@/lib/client-docs-queries'
import { Loader2, ArrowLeft, Save, Eye, ExternalLink, Download, FileText, File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { editorJsToHtml } from './editor-utils'

// Dynamic import for html2pdf to avoid SSR issues
const html2pdf = typeof window !== 'undefined' ? require('html2pdf.js') : null

export default function ClientDocEditor({ doc, agencyId }: { doc: any, agencyId: string }) {
    // Initialize pages from document content
    const initializePages = (): DocumentPage[] => {
        if (doc.content?.pages && Array.isArray(doc.content.pages)) {
            return doc.content.pages
        }
        // If no pages exist, create first page with existing content
        return [{
            id: 'page-1',
            title: 'Page 1',
            content: doc.content || { blocks: [] },
            createdAt: new Date().toISOString()
        }]
    }

    const [pages, setPages] = useState<DocumentPage[]>(initializePages())
    const [currentPageId, setCurrentPageId] = useState<string>(pages[0]?.id || 'page-1')
    const editorRef = useRef<EditorHandle>(null)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const router = useRouter()

    // Get current page
    const currentPage = pages.find(p => p.id === currentPageId)

    // Handle content changes for current page
    const handleContentChange = (data: any) => {
        setPages(prevPages =>
            prevPages.map(page =>
                page.id === currentPageId
                    ? { ...page, content: data }
                    : page
            )
        )
    }

    // Add new page
    const handleAddPage = () => {
        const newPage: DocumentPage = {
            id: `page-${Date.now()}`,
            title: `Page ${pages.length + 1}`,
            content: { blocks: [] },
            createdAt: new Date().toISOString()
        }
        setPages([...pages, newPage])
        setCurrentPageId(newPage.id)
        toast.success('New page added')
    }

    // Delete page
    const handleDeletePage = (pageId: string) => {
        if (pages.length === 1) {
            toast.error('Cannot delete the last page')
            return
        }
        const pageIndex = pages.findIndex(p => p.id === pageId)
        const newPages = pages.filter(p => p.id !== pageId)
        setPages(newPages)

        // If deleting current page, switch to previous or next page
        if (pageId === currentPageId) {
            const newCurrentPage = newPages[Math.max(0, pageIndex - 1)]
            setCurrentPageId(newCurrentPage.id)
        }
        toast.success('Page deleted')
    }

    // Switch to different page
    const handlePageSelect = (pageId: string) => {
        setCurrentPageId(pageId)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await upsertClientDoc({
                ...doc,
                content: { pages }, // Save all pages
                updatedAt: new Date().toISOString()
            })
            toast.success('Saved successfully')
        } catch (error) {
            toast.error('Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const handleDownload = (type: 'pdf' | 'doc') => {
        // Combine all pages into single HTML
        const allPagesHtml = pages.map((page, index) => {
            const pageHtml = editorJsToHtml(page.content)
            return `
                <div style="page-break-after: ${index < pages.length - 1 ? 'always' : 'auto'};">
                    <h2 style="margin-bottom: 20px; color: #666;">${page.title}</h2>
                    ${pageHtml}
                </div>
            `
        }).join('')

        const filename = doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()

        if (type === 'pdf') {
            if (!html2pdf) {
                toast.error('PDF generation not available')
                return
            }
            const element = document.createElement('div')
            element.innerHTML = `
                <div style="padding: 40px; font-family: Arial, sans-serif; color: #333;">
                    <h1 style="margin-bottom: 20px; text-align: center;">${doc.title}</h1>
                    ${allPagesHtml}
                </div>
            `
            const opt = {
                margin: 10,
                filename: `${filename}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }
            // Use html2pdf.js
            html2pdf().set(opt).from(element).save()
            toast.success('Downloading PDF...')
        } else if (type === 'doc') {
            const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>${doc.title}</title></head><body>`
            const postHtml = "</body></html>"
            const fullHtml = preHtml + `<h1 style="text-align: center;">${doc.title}</h1>` + allPagesHtml + postHtml

            const blob = new Blob(['\ufeff', fullHtml], {
                type: 'application/msword'
            })

            const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(fullHtml)

            const downloadLink = document.createElement("a")
            document.body.appendChild(downloadLink)

            if ((navigator as any).msSaveOrOpenBlob) {
                (navigator as any).msSaveOrOpenBlob(blob, `${filename}.doc`)
            } else {
                downloadLink.href = url
                downloadLink.download = `${filename}.doc`
                downloadLink.click()
            }

            document.body.removeChild(downloadLink)
            toast.success('Downloading Word Document...')
        }
    }

    return (
        <div className="flex flex-col h-full relative">
            {/* Top Header */}
            <div className="flex justify-between items-center p-4 border-b bg-background">
                <div className="flex items-center gap-4">
                    <Link href={`/agency/${agencyId}/client-docs`}>
                        <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            {doc.title}
                            <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                        </h1>
                        <p className="text-xs text-muted-foreground">Status: {doc.status}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(true)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                    <Link href={`/preview/${agencyId}/${doc.id}`} target="_blank">
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Page Preview
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleDownload('pdf')}>
                                <FileText className="mr-2 h-4 w-4" />
                                Save as PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload('doc')}>
                                <File className="mr-2 h-4 w-4" />
                                Save as Word
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Editor Content with Sidebar */}
            <div className="flex flex-1 overflow-hidden">
                <PageSidebar
                    pages={pages}
                    currentPageId={currentPageId}
                    onPageSelect={handlePageSelect}
                    onPageAdd={handleAddPage}
                    onPageDelete={handleDeletePage}
                />

                <div className="flex-1 flex flex-col min-w-0">
                    {/* Formatting Toolbar */}
                    <EditorToolbar editorRef={editorRef} subaccountId={doc.subAccountId} />

                    {/* Editor Area */}
                    <div className="flex-1 overflow-auto p-4 md:p-8 bg-muted/20">
                        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-[500px] p-8 rounded-lg shadow-sm border">
                            {currentPage && (
                                <EditorWrapper
                                    key={currentPage.id}
                                    ref={editorRef}
                                    data={currentPage.content}
                                    onChange={handleContentChange}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Local Preview Modal */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                    <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-zinc-900 z-10">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            Preview: {doc.title} - {currentPage?.title}
                            <Badge variant="outline" className="text-xs">Read Only</Badge>
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-zinc-900">
                        {/* Show current page content */}
                        <EditorWrapper
                            data={currentPage?.content || { blocks: [] }}
                            readOnly={true}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
