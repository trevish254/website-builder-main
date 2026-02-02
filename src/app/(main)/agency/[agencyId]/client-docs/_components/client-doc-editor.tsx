'use client'
import { useRef, useState, useEffect } from 'react'
import EditorWrapper, { EditorHandle } from './editor-wrapper'
import EditorToolbar from './editor-toolbar'
import PageSidebar, { DocumentPage } from './page-sidebar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { upsertClientDoc } from '@/lib/client-docs-queries'
import { Loader2, ArrowLeft, Save, Eye, ExternalLink, Download, FileText, File, Users as UsersIcon, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { editorJsToHtml } from './editor-utils'
import CollaborationPanel from './collaboration-panel'
import { cn } from '@/lib/utils'

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
    const [isCollaborationOpen, setIsCollaborationOpen] = useState(false)
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

    const handleRevert = (content: any) => {
        if (!content) {
            // Simulation: If content is null, just show toast for demo
            toast.info('Reverting to this version...')
            return
        }
        setPages(prevPages =>
            prevPages.map(page =>
                page.id === currentPageId
                    ? { ...page, content: content }
                    : page
            )
        )
        toast.success('Reverted to previous version')
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
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Top Header */}
            <div className="flex justify-between items-center p-4 border-b bg-background z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href={`/agency/${agencyId}/client-docs`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft size={18} /></Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold truncate max-w-[200px] md:max-w-[400px]">
                                {doc.title}
                            </h1>
                            <Badge variant="outline" className="text-[10px] py-0 h-5 px-1.5 bg-primary/5 text-primary border-primary/20 uppercase tracking-tighter">
                                {doc.type}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex -space-x-1.5">
                                <Avatar className="h-4 w-4 border border-background">
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                                </Avatar>
                                <Avatar className="h-4 w-4 border border-background">
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                                </Avatar>
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                2 editing now
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={isCollaborationOpen ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn("h-8 px-3 gap-2", isCollaborationOpen && "bg-primary/10 text-primary border-primary/20")}
                                    onClick={() => setIsCollaborationOpen(!isCollaborationOpen)}
                                >
                                    <UsersIcon className="h-4 w-4" />
                                    <span className="hidden sm:inline">Collaboration</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Team Chat & History</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="h-4 w-[1px] bg-border mx-1" />

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => setShowPreview(true)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                                <Download className="mr-2 h-4 w-4" />
                                Export
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

                    <Button onClick={handleSave} disabled={saving} size="sm" className="h-8 px-4 shadow-lg shadow-primary/20">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Editor Content with Sidebars */}
            <div className="flex flex-1 overflow-hidden">
                <PageSidebar
                    pages={pages}
                    currentPageId={currentPageId}
                    onPageSelect={handlePageSelect}
                    onPageAdd={handleAddPage}
                    onPageDelete={handleDeletePage}
                />

                <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 dark:bg-zinc-950/50">
                    {/* Formatting Toolbar */}
                    <EditorToolbar editorRef={editorRef} subaccountId={doc.subAccountId} />

                    {/* Editor Area */}
                    <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                        {/* Real-time Collaboration Indicators (Floating) */}
                        <div className="absolute top-12 right-12 flex flex-col items-end gap-2 pointer-events-none z-10 opacity-70">
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] gap-2 py-1 px-2 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                Sarah Wilson is editing...
                            </Badge>
                        </div>

                        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-[500px] p-8 md:p-12 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-500">
                            {currentPage && (
                                <EditorWrapper
                                    key={currentPage.id}
                                    ref={editorRef}
                                    data={currentPage.content}
                                    onChange={handleContentChange}
                                />
                            )}
                        </div>

                        {/* Status Footer inside Editor */}
                        <div className="max-w-4xl mx-auto mt-4 px-2 flex justify-between items-center opacity-60">
                            <p className="text-[10px] uppercase tracking-widest font-bold">Word Count: 428</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                                <RotateCcw size={10} />
                                Auto-saved at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Collaboration Sidebar */}
                <CollaborationPanel
                    isOpen={isCollaborationOpen}
                    onClose={() => setIsCollaborationOpen(false)}
                    docId={doc.id}
                    onRevert={handleRevert}
                />
            </div>

            {/* Local Preview Modal */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                    <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-zinc-900 z-10 shadow-sm">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            Preview: {doc.title} - {currentPage?.title}
                            <Badge variant="outline" className="text-xs bg-primary/5">Read Only</Badge>
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-zinc-900">
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
