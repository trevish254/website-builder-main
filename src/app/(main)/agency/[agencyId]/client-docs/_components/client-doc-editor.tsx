
'use client'
import { useRef, useState } from 'react'
import EditorWrapper, { EditorHandle } from './editor-wrapper'
import EditorToolbar from './editor-toolbar'
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
    // Use ref instead of state to avoid re-renders on every keystroke
    const contentRef = useRef(doc.content)
    const editorRef = useRef<EditorHandle>(null)
    const [saving, setSaving] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const router = useRouter()

    const handleContentChange = (data: any) => {
        contentRef.current = data
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await upsertClientDoc({
                ...doc,
                content: contentRef.current,
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
        const htmlContent = editorJsToHtml(contentRef.current)
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
                    ${htmlContent}
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
            const fullHtml = preHtml + `<h1 style="text-align: center;">${doc.title}</h1>` + htmlContent + postHtml

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

            {/* Formatting Toolbar */}
            <EditorToolbar editorRef={editorRef} subaccountId={doc.subAccountId} />

            {/* Editor Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8 bg-muted/20">
                <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-[500px] p-8 rounded-lg shadow-sm border">
                    <EditorWrapper ref={editorRef} data={doc.content} onChange={handleContentChange} />
                </div>
            </div>

            {/* Local Preview Modal */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                    <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-zinc-900 z-10">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            Preview: {doc.title}
                            <Badge variant="outline" className="text-xs">Read Only</Badge>
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-zinc-900">
                        {/* We pass contentRef.current to show LATEST unsaved content */}
                        <EditorWrapper
                            data={contentRef.current}
                            readOnly={true}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
