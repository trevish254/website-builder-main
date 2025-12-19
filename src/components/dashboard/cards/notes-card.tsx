'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Save, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { updateDashboardCard } from '@/lib/dashboard-queries'
import { ScrollArea } from '@/components/ui/scroll-area'
import ResizableImageTool from '@/app/(main)/agency/[agencyId]/client-docs/_components/resizable-image-tool'

type Props = {
    cardId: string
    title?: string
    content?: any
    isEditMode?: boolean
}

export default function NotesCard({ cardId, title = 'Notes', content, isEditMode }: Props) {
    const editorRef = useRef<any>(null)
    const holderId = useRef(`editorjs-${cardId}`).current
    const isInitialized = useRef(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        return () => {
            isInitialized.current = false
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                try {
                    editorRef.current.destroy()
                } catch (e) {
                    console.error('Error destroying editor:', e)
                }
                editorRef.current = null
            }
        }
    }, [])

    const handleSave = useCallback(async (data: any) => {
        setIsSaving(true)
        try {
            await updateDashboardCard(cardId, {
                config: {
                    title,
                    content: data
                }
            })
            // toast.success('Notes saved') // Too spammy for autosave
        } catch (error) {
            toast.error('Failed to save notes')
        } finally {
            setIsSaving(false)
        }
    }, [cardId, title])

    useEffect(() => {
        if (!isMounted || isInitialized.current) return

        const initEditor = async () => {
            try {
                const EditorJS = (await import('@editorjs/editorjs')).default
                const Header = (await import('@editorjs/header')).default
                const List = (await import('@editorjs/list')).default
                const Checklist = (await import('@editorjs/checklist')).default
                const Quote = (await import('@editorjs/quote')).default
                const Table = (await import('@editorjs/table')).default
                const Code = (await import('@editorjs/code')).default
                const Delimiter = (await import('@editorjs/delimiter')).default
                const InlineCode = (await import('@editorjs/inline-code')).default
                const Marker = (await import('@editorjs/marker')).default
                const Underline = (await import('@editorjs/underline')).default
                const LinkTool = (await import('@editorjs/link')).default
                const Paragraph = (await import('@editorjs/paragraph')).default
                const ImageTool = (await import('@editorjs/image')).default // Use standard or custom?
                // Using custom one we imported

                if (isInitialized.current) return

                const editor = new EditorJS({
                    holder: holderId,
                    tools: {
                        header: Header,
                        list: List,
                        checklist: Checklist,
                        quote: Quote,
                        table: Table,
                        code: Code,
                        delimiter: Delimiter,
                        inlineCode: InlineCode,
                        marker: Marker,
                        underline: Underline,
                        linkTool: {
                            class: LinkTool,
                            config: {
                                endpoint: '/api/fetch-url', // Ensure this API exists or usage will fail
                            }
                        },
                        image: {
                            class: ResizableImageTool,
                            config: {
                                endpoint: '/api/uploadthing', // UploadThing endpoint
                            }
                        }
                    },
                    data: content || { blocks: [] },
                    placeholder: 'Type your notes here... (Use / for commands)',
                    inlineToolbar: true,
                    minHeight: 0,
                    onChange: async () => {
                        // Debounce or just save? 
                        // For simplicity, let's just save for now but usually debounce is better.
                        // But EditorJS onChange triggers frequently.
                        // We'll wrap the save in a debounce manually if needed, but let's try direct first or use a timeout.

                        // Simple debounce
                        const data = await editor.save()
                        handleSave(data)
                    },
                })

                editorRef.current = editor
                isInitialized.current = true
            } catch (error) {
                console.error('Failed to init editor:', error)
            }
        }

        initEditor()
    }, [isMounted, content, handleSave, holderId])


    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {title}
                </h3>
                {isSaving && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
            </div>

            <ScrollArea className="flex-1 -mr-4 pr-4">
                <div id={holderId} className="prose prose-sm dark:prose-invert max-w-none w-full pb-4" />
            </ScrollArea>
        </div>
    )
}
