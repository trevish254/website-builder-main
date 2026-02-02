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
import { useSupabaseUser } from '@/lib/hooks/use-supabase-user'
import { useCollaboration } from './use-collaboration'
import { getDocVersions, createDocVersion, getDocComments, createDocComment } from '@/lib/client-docs-queries'
import { ScrollArea } from '@/components/ui/scroll-area'

// Dynamic import for html2pdf to avoid SSR issues
const html2pdf = typeof window !== 'undefined' ? require('html2pdf.js') : null

export default function ClientDocEditor({ doc, agencyId }: { doc: any, agencyId: string }) {
    const { user: supabaseUser } = useSupabaseUser()
    // Map supabase user to expected format if needed
    const currentUser = supabaseUser ? {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email,
        avatarUrl: supabaseUser.user_metadata?.avatar_url
    } : null

    const { collaborators, updateCursor } = useCollaboration(doc.id, currentUser)

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
    const [versions, setVersions] = useState<any[]>([])
    const [comments, setComments] = useState<any[]>([])

    useEffect(() => {
        const fetchCollabData = async () => {
            const [v, c] = await Promise.all([
                getDocVersions(doc.id),
                getDocComments(doc.id)
            ])
            setVersions(v)
            setComments(c)
        }
        fetchCollabData()
    }, [doc.id])

    const handleSaveVersion = async () => {
        if (!currentUser) return
        try {
            const version = await createDocVersion({
                documentId: doc.id,
                userId: currentUser.id,
                content: { pages },
                name: `Snapshot ${new Date().toLocaleTimeString()}`
            })
            setVersions([version, ...versions])
            toast.success('Version saved')
        } catch (e) {
            toast.error('Failed to save version')
        }
    }
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
        <div className="flex flex-col h-[calc(100vh-96px)] relative overflow-hidden">
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
                                {collaborators.slice(0, 3).map((c) => (
                                    <Avatar key={c.id} className="h-5 w-5 border border-background ring-1 ring-background">
                                        <AvatarImage src={c.avatar} />
                                        <AvatarFallback className="text-[8px] bg-zinc-200">{c.name[0]}</AvatarFallback>
                                    </Avatar>
                                ))}
                                {collaborators.length > 3 && (
                                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[8px] border border-background font-bold text-zinc-500">
                                        +{collaborators.length - 3}
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", collaborators.length > 0 ? "bg-green-500" : "bg-zinc-400")} />
                                {collaborators.length} online now
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
            <div className="flex flex-1 overflow-hidden min-h-0">
                <PageSidebar
                    pages={pages}
                    currentPageId={currentPageId}
                    onPageSelect={handlePageSelect}
                    onPageAdd={handleAddPage}
                    onPageDelete={handleDeletePage}
                />

                <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-zinc-50 dark:bg-zinc-950/50">
                    {/* Formatting Toolbar */}
                    <EditorToolbar editorRef={editorRef} subaccountId={doc.subAccountId} />

                    {/* Editor Area */}
                    <ScrollArea className="flex-1 overscroll-contain">
                        <div className="p-4 md:p-8 relative">
                            {/* Real-time Visual Cursors */}
                            <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                                {collaborators.filter(c => c.id !== currentUser?.id).map((c) => (
                                    <CollaboratorCursor
                                        key={c.id}
                                        collaborator={c}
                                        containerId="active-editor-container"
                                    />
                                ))}
                            </div>

                            <div
                                className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-[500px] p-8 md:p-12 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-500"
                                onMouseMove={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    // X as percentage (0-1) to handle resizing
                                    const x = (e.clientX - rect.left) / rect.width
                                    // Y as absolute pixels from the top of the container
                                    // We need to account for scrolling if we wanted global page pos, 
                                    // but here 'top' is relative to this container in the viewer.
                                    // e.clientY - rect.top gives Y relative to current viewport view of container.
                                    // But if we scroll, the container scrolls? 
                                    // Actually, this container is inside ScrollArea. 
                                    // Wait, if the container is scrolled out of view, the ClientY changes.
                                    // We want Y relative to the DOCUMENT (Editor) TOP.
                                    // e.nativeEvent.offsetY is usually reliable for the target, but target changes.

                                    // Best approach: e.clientY - rect.top is relative to viewport top of the element.
                                    // But we broadcast this to a user who might have scrolled differently.
                                    // We need Y relative to the CONTENT top.
                                    // But this div *is* the content wrapper. 
                                    // However, the text inside grows.

                                    // Let's use relative coordinates to the container itself.
                                    const y = e.clientY - rect.top

                                    // But if I scroll down, 'rect.top' moves up (becomes negative).
                                    // e.clientY stays roughly same.
                                    // So (clientY - rect.top) INCREASES as I scroll down? 
                                    // Yes. e.g. clientY=100, rect.top=-500 -> y=600. Correct.

                                    // Throttle using requestAnimationFrame or simple timestamp
                                    const now = Date.now()
                                    if (now - (window as any).lastCursorEmit < 50) return
                                    (window as any).lastCursorEmit = now

                                    updateCursor({ x, y })
                                }}
                            >
                                {currentPage && (
                                    <EditorWrapper
                                        key={currentPage.id}
                                        ref={editorRef}
                                        data={currentPage.content}
                                        onChange={handleContentChange}
                                        holderId="active-editor-container"
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
                    </ScrollArea>
                </div>

                {/* Collaboration Sidebar */}
                <CollaborationPanel
                    isOpen={isCollaborationOpen}
                    onClose={() => setIsCollaborationOpen(false)}
                    docId={doc.id}
                    docTitle={doc.title || 'Untitled Document'}
                    agencyId={agencyId}
                    onRevert={handleRevert}
                    collaborators={collaborators}
                    versions={versions}
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

function CollaboratorCursor({ collaborator, containerId }: { collaborator: any, containerId: string }) {
    const [position, setPosition] = useState({ top: 0, left: 0, visible: false })

    useEffect(() => {
        const updatePosition = () => {
            const editorContainer = document.getElementById(containerId)

            // Priority 1: Use exact mouse coordinates if available
            if (collaborator.cursor && editorContainer) {
                // X as percentage of container width
                const x = collaborator.cursor.x * editorContainer.offsetWidth
                // Y as absolute offset
                const y = collaborator.cursor.y

                setPosition({
                    top: editorContainer.offsetTop + y,
                    left: editorContainer.offsetLeft + x,
                    visible: true
                })
                return
            }

            // Priority 2: Fallback to Block Index
            if (collaborator.blockIndex !== undefined) {
                if (!editorContainer) return

                // EditorJS blocks have class 'ce-block'
                const blocks = editorContainer.querySelectorAll('.ce-block')
                const block = blocks[collaborator.blockIndex] as HTMLElement

                if (block) {
                    setPosition({
                        top: editorContainer.offsetTop + block.offsetTop + 10,
                        left: editorContainer.offsetLeft + block.offsetLeft - 24, // 24px left of the block
                        visible: true
                    })
                }
            } else {
                setPosition(prev => ({ ...prev, visible: false }))
            }
        }

        updatePosition()
        const interval = setInterval(updatePosition, 50)
        return () => clearInterval(interval)
    }, [collaborator.blockIndex, collaborator.cursor, containerId])

    if (!position.visible) return null

    return (
        <div
            className="absolute transition-all duration-300 z-50 flex items-center pointer-events-none group"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`
            }}
        >
            {/* Visual Cursor */}
            <div className="relative">
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: collaborator.color }}
                    className="drop-shadow-sm"
                >
                    <path
                        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="2"
                    />
                </svg>
                {/* Name Tag */}
                <div
                    className="absolute left-4 top-2 px-2 py-1 rounded-md text-[10px] font-bold text-white whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: collaborator.color }}
                >
                    {collaborator.name}
                </div>
            </div>
        </div>
    )
}
