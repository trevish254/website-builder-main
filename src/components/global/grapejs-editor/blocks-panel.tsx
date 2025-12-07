'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowLeft } from 'lucide-react'
import { blockCategories } from './blocks-config'
import { cn } from '@/lib/utils'

type Props = {
    editor: any
}

const BlocksPanel = ({ editor }: Props) => {
    const blocksContainerRef = useRef<HTMLDivElement>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    useEffect(() => {
        if (!editor || !blocksContainerRef.current) return

        const updateBlocks = () => {
            // Get all blocks
            const allBlocks = editor.BlockManager.getAll()

            // Filter blocks
            const filteredBlocks = allBlocks.filter((block: any) => {
                const blockCategory = block.get('category')
                const categoryId = typeof blockCategory === 'object' ? blockCategory.id : blockCategory
                const label = block.get('label')

                // Normalization for robust comparison
                const normCategoryId = String(categoryId).toLowerCase()
                const normSelected = selectedCategory ? String(selectedCategory).toLowerCase() : null

                const matchesCategory = !normSelected || normCategoryId === normSelected
                const matchesSearch = searchQuery === '' ||
                    label.toLowerCase().includes(searchQuery.toLowerCase())

                return matchesCategory && matchesSearch
            })

            // Clear previous content
            blocksContainerRef.current!.innerHTML = ''

            // Render filtered blocks
            if (filteredBlocks.length > 0) {
                // Determine if we need to group by category or just show blocks
                // If a category is selected, we might want to disable the default category headers 
                // to avoid redundancy, but GrapeJS render() usually adds them.
                // We pass the filtered blocks to render()
                const blocksEl = editor.BlockManager.render(filteredBlocks, {
                    external: true, // Optimizes for external container
                    ignoreCategories: !!selectedCategory // If custom category navigation, filter headers? 
                    // Note: ignoreCategories is not a standard option in all versions, but let's try strict rendering
                })

                // If blocksEl contains categories despite filtering (e.g. "Layout" header), 
                // we might want to hide it if we are already IN the "Layout" view. 
                // But usually it's fine.

                blocksContainerRef.current!.appendChild(blocksEl)
            } else {
                blocksContainerRef.current!.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <p>No blocks found</p>
                    </div>
                `
            }
        }

        updateBlocks()

        // Listen for block changes
        editor.on('block:add block:remove', updateBlocks)
        return () => {
            editor.off('block:add block:remove', updateBlocks)
        }

    }, [editor, searchQuery, selectedCategory])

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId)
        setSearchQuery('')
    }

    const handleBackClick = () => {
        setSelectedCategory(null)
        setSearchQuery('')
    }

    // Show category grid if no category is selected
    if (!selectedCategory) {
        return (
            <div className="w-[300px] border-r bg-background flex flex-col h-full">
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

                {/* Category Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {blockCategories.map((category) => {
                            const Icon = category.icon
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={cn(
                                        'flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2',
                                        'bg-card hover:bg-accent hover:border-primary transition-all',
                                        'cursor-pointer group'
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-center">
                                        {category.label}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    // Show blocks for selected category
    const currentCategory = blockCategories.find(c => c.id === selectedCategory)

    return (
        <div className="w-[300px] border-r bg-background flex flex-col h-full">
            {/* Header with Back Button */}
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackClick}
                        className="p-2 h-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        {currentCategory && (
                            <>
                                <currentCategory.icon className="w-5 h-5 text-primary" />
                                {currentCategory.label}
                            </>
                        )}
                    </h2>
                </div>
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

            {/* GrapeJS blocks will be rendered here */}
            <div
                ref={blocksContainerRef}
                className="flex-1 overflow-y-auto p-4 gjs-blocks-container"
            ></div>
        </div>
    )
}

export default BlocksPanel
