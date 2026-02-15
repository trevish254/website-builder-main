'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, Box } from 'lucide-react'
import { blockCategories } from './blocks-config'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Props = {
    editor: any
}

const BlocksPanel = ({ editor }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [categories, setCategories] = useState<any[]>([])

    // Ref to track rendered categories and avoid re-rendering issues
    // We will render GrapesJS blocks INTO specific DOM slots provided by the AccordionContent

    // We need to store refs for each filtered category container
    const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map())

    useEffect(() => {
        if (!editor) return

        const updateCategories = () => {
            const allBlocks = editor.BlockManager.getAll()
            const uniqueCategories = new Map<string, any>()

            // 1. Start with static categories
            blockCategories.forEach(cat => uniqueCategories.set(cat.id.toLowerCase(), cat))

            // 2. Discover new categories from blocks
            allBlocks.forEach((block: any) => {
                const cat = block.get('category')
                if (!cat) return

                const id = (typeof cat === 'object' ? cat.id : cat).toString()
                const label = typeof cat === 'object' ? cat.label : cat
                const lowerId = id.toLowerCase()

                if (!uniqueCategories.has(lowerId)) {
                    uniqueCategories.set(lowerId, {
                        id,
                        label,
                        icon: Box
                    })
                }
            })

            // Only update if changed significantly
            // For now, always update to be safe with HMR
            setCategories(Array.from(uniqueCategories.values()))
        }

        updateCategories()
        editor.on('block:add block:remove', updateCategories)
        return () => { editor.off('block:add block:remove', updateCategories) }
    }, [editor])

    // Effect to render blocks into the category containers whenever categories or search query changes
    useEffect(() => {
        if (!editor || categories.length === 0) return

        // For each category, find its container and render relevant blocks
        categories.forEach(category => {
            const container = categoryRefs.current.get(category.id)
            if (!container) return

            // 1. Filter blocks for this specific category AND search query
            const allBlocks = editor.BlockManager.getAll()
            const filteredBlocks = allBlocks.filter((block: any) => {
                const blockCategory = block.get('category')
                const categoryId = typeof blockCategory === 'object' ? blockCategory.id : blockCategory
                const label = block.get('label')

                const normCategoryId = String(categoryId || '').toLowerCase()
                const normCurrentId = String(category.id || '').toLowerCase()

                const matchesCategory = normCategoryId === normCurrentId
                const matchesSearch = searchQuery === '' || (label || '').toString().toLowerCase().includes(searchQuery.toLowerCase())

                return matchesCategory && matchesSearch
            })

            // 2. Clear container
            container.innerHTML = ''

            // 3. Render
            if (filteredBlocks.length > 0) {
                const blocksEl = editor.BlockManager.render(filteredBlocks, {
                    external: true,
                    ignoreCategories: true // Important: We are handling categories ourselves
                })
                container.appendChild(blocksEl)
            } else {
                if (searchQuery !== '') {
                    container.innerHTML = '<p class="text-xs text-muted-foreground p-2">No matching blocks</p>'
                }
                // If no search query and no blocks, it's just empty
            }
        })

    }, [editor, categories, searchQuery])


    return (
        <div className="w-[240px] border-r bg-background flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="font-semibold text-lg mb-3">Blocks</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search blocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Accordion List */}
            <div className="flex-1 overflow-y-auto">
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <p>No blocks found</p>
                    </div>
                ) : (
                    <Accordion type="multiple" className="w-full">
                        {categories.map((category) => {
                            const Icon = category.icon || Box
                            return (
                                <AccordionItem key={category.id} value={category.id} className="border-b">
                                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            {/* <Icon className="w-4 h-4 text-muted-foreground" />  User screenshots imply clean text headers, maybe minimal icons or none */}
                                            <span className="font-medium text-sm">{category.label}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div
                                            ref={(el) => {
                                                if (el) categoryRefs.current.set(category.id, el)
                                                else categoryRefs.current.delete(category.id)
                                            }}
                                            className="p-2 bg-muted/20 gjs-blocks-container-custom"
                                        >
                                            {/* GrapesJS blocks injected here */}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                )}
            </div>
            <style jsx global>{`
                /* Improve GrapesJS Block Styling within Custom Accordion */
                .gjs-blocks-container-custom .gjs-blocks-c {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px !important;
                }
                .gjs-blocks-container-custom .gjs-block {
                    width: 100% !important;
                    min-height: 50px !important;
                    margin: 0 !important;
                    padding: 8px !important;
                    border: 1px solidhsl(var(--border)) !important;
                    border-radius: 6px !important;
                    background-color: hsl(var(--card)) !important;
                    color: hsl(var(--card-foreground)) !important;
                    box-shadow: none !important;
                    transition: all 0.2s ease;
                }
                .gjs-blocks-container-custom .gjs-block:hover {
                    border-color: hsl(var(--primary)) !important;
                    background-color: hsl(var(--accent)) !important;
                    color: hsl(var(--accent-foreground)) !important;
                }
                .gjs-blocks-container-custom .gjs-block-label {
                    font-size: 10px !important;
                    margin-top: 4px !important;
                    font-weight: 500 !important;
                }
            `}</style>
        </div>
    )
}

export default BlocksPanel
