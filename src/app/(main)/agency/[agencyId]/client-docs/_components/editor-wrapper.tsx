'use client'
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react'

type Props = {
    data?: any
    onChange?: (data: any) => void
    readOnly?: boolean
    holderId?: string
}

export type EditorHandle = {
    insertBlock: (type: string, data?: any) => Promise<void>
    getEditor: () => any
}

const EditorWrapper = forwardRef<EditorHandle, Props>(({ data, onChange, readOnly, holderId: customHolderId }, ref) => {
    const editorRef = useRef<any>(null)
    const isInitialized = useRef(false)
    const [isMounted, setIsMounted] = useState(false)
    const holderId = useRef(customHolderId || `editorjs-${Math.random().toString(36).substr(2, 9)}`).current

    const isDestroyed = useRef(false)

    useEffect(() => {
        setIsMounted(true)
        return () => {
            isDestroyed.current = true
        }
    }, [])

    useImperativeHandle(ref, () => ({
        insertBlock: async (type: string, data?: any) => {
            if (editorRef.current && editorRef.current.blocks) {
                try {
                    const currentIndex = editorRef.current.blocks.getCurrentBlockIndex()
                    const newIndex = currentIndex >= 0 ? currentIndex + 1 : 0

                    // Insert the block
                    const block = await editorRef.current.blocks.insert(
                        type,
                        data || {},
                        {},
                        newIndex,
                        true // needToFocus
                    )

                    // Wait a bit for the block to render, then focus it
                    setTimeout(() => {
                        if (editorRef.current && editorRef.current.caret) {
                            editorRef.current.caret.setToBlock(newIndex, 'end')
                        }
                    }, 100)
                } catch (error) {
                    console.error('Error inserting block:', error)
                }
            }
        },
        getEditor: () => editorRef.current
    }))

    useEffect(() => {
        if (!isMounted || isInitialized.current) return

        const initEditor = async () => {
            try {
                // Dynamically import EditorJS and all tools
                const EditorJS = (await import('@editorjs/editorjs')).default

                if (isDestroyed.current) return

                // Block Tools
                const Header = (await import('@editorjs/header')).default
                const List = (await import('@editorjs/list')).default
                const Checklist = (await import('@editorjs/checklist')).default
                const Quote = (await import('@editorjs/quote')).default
                const Table = (await import('@editorjs/table')).default
                const Code = (await import('@editorjs/code')).default
                const Delimiter = (await import('@editorjs/delimiter')).default
                const Warning = (await import('@editorjs/warning')).default
                const Raw = (await import('@editorjs/raw')).default
                const Embed = (await import('@editorjs/embed')).default
                const SimpleImage = (await import('@editorjs/simple-image')).default
                const Attaches = (await import('@editorjs/attaches')).default

                // Inline Tools
                const InlineCode = (await import('@editorjs/inline-code')).default
                const Marker = (await import('@editorjs/marker')).default
                const Underline = (await import('@editorjs/underline')).default
                const LinkTool = (await import('@editorjs/link')).default
                const Paragraph = (await import('@editorjs/paragraph')).default
                // We use require/import for local custom tool since it's not an npm package
                const ResizableImageTool = (await import('./resizable-image-tool')).default

                if (isDestroyed.current) return

                const editor = new EditorJS({
                    holder: holderId,
                    tools: {
                        paragraph: {
                            class: Paragraph,
                            inlineToolbar: true,
                            config: {
                                preserveBlank: true
                            }
                        },
                        // Block Tools with shortcuts
                        header: {
                            class: Header,
                            inlineToolbar: ['link', 'marker', 'bold', 'italic'],
                            config: {
                                placeholder: 'Enter a header',
                                levels: [1, 2, 3, 4, 5, 6],
                                defaultLevel: 2
                            },
                            shortcut: 'CMD+SHIFT+H'
                        },
                        list: {
                            class: List,
                            inlineToolbar: true,
                            shortcut: 'CMD+SHIFT+L'
                        },
                        checklist: {
                            class: Checklist,
                            inlineToolbar: true,
                            shortcut: 'CMD+SHIFT+C'
                        },
                        quote: {
                            class: Quote,
                            inlineToolbar: true,
                            config: {
                                quotePlaceholder: 'Enter a quote',
                                captionPlaceholder: 'Quote\'s author',
                            },
                            shortcut: 'CMD+SHIFT+Q'
                        },
                        table: {
                            class: Table,
                            inlineToolbar: true,
                            config: {
                                rows: 2,
                                cols: 3,
                            },
                        },
                        code: {
                            class: Code,
                            config: {
                                placeholder: 'Enter code'
                            },
                            shortcut: 'CMD+SHIFT+K'
                        },
                        delimiter: Delimiter,
                        warning: {
                            class: Warning,
                            inlineToolbar: true,
                            config: {
                                titlePlaceholder: 'Title',
                                messagePlaceholder: 'Message',
                            },
                        },
                        raw: {
                            class: Raw,
                            config: {
                                placeholder: 'Enter raw HTML'
                            }
                        },
                        embed: {
                            class: Embed,
                            config: {
                                services: {
                                    youtube: true,
                                    vimeo: true,
                                    twitter: true,
                                    instagram: true,
                                    codepen: true,
                                    github: true,
                                }
                            }
                        },
                        image: ResizableImageTool,
                        attaches: {
                            class: Attaches,
                            config: {
                                endpoint: '/api/upload',
                            }
                        },

                        // Inline Tools with shortcuts
                        inlineCode: {
                            class: InlineCode,
                            shortcut: 'CMD+SHIFT+M'
                        },
                        marker: {
                            class: Marker,
                            shortcut: 'CMD+SHIFT+H'
                        },
                        underline: {
                            class: Underline,
                            shortcut: 'CMD+U'
                        },
                        linkTool: {
                            class: LinkTool,
                            config: {
                                endpoint: '/api/fetch-url',
                            }
                        },
                    },
                    data: data || {},
                    readOnly: readOnly || false,
                    placeholder: 'Click here to start writing...',

                    // Advanced Features
                    autofocus: !readOnly,

                    // Callbacks
                    onChange: async () => {
                        try {
                            const savedData = await editor.save()
                            onChange?.(savedData)

                            // Broadcast change to other users
                            if (window.collaborationChannel) {
                                window.collaborationChannel.send({
                                    type: 'broadcast',
                                    event: 'doc-update',
                                    payload: { data: savedData, senderId: window.currentUserId }
                                })
                            }
                        } catch (error) {
                            console.error('Error saving editor data:', error)
                        }
                    },
                    onReady: () => {
                        isInitialized.current = true

                        // Listen for remote updates
                        // Listen for remote updates
                        if (window.collaborationChannel) {
                            window.collaborationChannel.on('broadcast', { event: 'doc-update' }, async ({ payload }) => {
                                if (payload.senderId !== window.currentUserId) {
                                    // Debounce updates slightly to avoid rapid-fire processing
                                    const currentData = await editor.save()
                                    const newBlocks = payload.data.blocks
                                    const currentBlocks = currentData.blocks

                                    // Check if lengths match
                                    if (newBlocks.length === currentBlocks.length) {
                                        for (let i = 0; i < newBlocks.length; i++) {
                                            const newBlock = newBlocks[i]
                                            const currentBlock = currentBlocks[i]

                                            if (JSON.stringify(newBlock.data) !== JSON.stringify(currentBlock.data)) {
                                                // STRICTLY use Block IDs. editor.blocks.update(id, data) requires an ID string.
                                                // Passing an index will cause "Block with id 'X' not found" errors.

                                                if (newBlock.id && currentBlock.id && newBlock.id === currentBlock.id) {
                                                    editor.blocks.update(newBlock.id, newBlock.data)
                                                } else {
                                                    // Structural mismatch despite length match (e.g. replaced block)
                                                    // Fallback to full render to be safe
                                                    editor.render(payload.data)
                                                    return
                                                }
                                            }
                                        }
                                    } else {
                                        editor.render(payload.data)
                                    }
                                }
                            })

                            // Broadcast cursor position when caret changes or clicking
                            const handleCaretChange = () => {
                                const index = editor.blocks.getCurrentBlockIndex()
                                if (index >= 0) {
                                    window.collaborationChannel?.send({
                                        type: 'broadcast',
                                        event: 'cursor-move',
                                        payload: { userId: window.currentUserId, blockIndex: index }
                                    })
                                }
                            }

                            document.addEventListener('keyup', handleCaretChange)
                            document.addEventListener('click', handleCaretChange)
                        }
                    },

                    // Logging
                    logLevel: 'ERROR' as const,
                })

                editorRef.current = editor
            } catch (error) {
                console.error('Failed to initialize editor:', error)
            }
        }

        initEditor()

        return () => {
            isDestroyed.current = true
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                try {
                    editorRef.current.destroy()
                } catch (e) {
                    console.error('Error destroying editor:', e)
                }
                editorRef.current = null
                isInitialized.current = false
            }
        }
    }, [isMounted])

    if (!isMounted) {
        return <div className="p-4 text-gray-500">Loading editor...</div>
    }

    return (
        <div
            id={holderId}
            className="prose prose-lg max-w-full dark:prose-invert min-h-[500px] focus:outline-none"
        />
    )
})

EditorWrapper.displayName = 'EditorWrapper'

export default EditorWrapper
