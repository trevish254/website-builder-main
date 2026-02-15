'use client'
import React, { useEffect, useState, useRef } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    LayoutGrid,
    Files,
    Layers,
    Settings,
    Palette,
    Database,
    ChevronLeft,
    ChevronRight,
    Search,
    Plus,
    X,
    Image as ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { blockCategories } from './blocks-config' // Blocks configuration
import Link from 'next/link'
import PagesTab from './pages-tab'
import BrandKitTab from './brand-kit-tab'
import MediaTab from './media-tab'
import { BrandKit } from './index'
import { Website } from '@/lib/website-queries'

type Props = {
    editor: any
    activeTab: string
    setActiveTab: (tab: string) => void
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
    pages: any[]
    subaccountId: string
    funnelId: string
    activePageId: string
    brandKit: BrandKit
    setBrandKit: (kit: BrandKit) => void
    website?: Website
}

const EditorSidebar = ({
    editor,
    activeTab,
    setActiveTab,
    collapsed,
    setCollapsed,
    pages,
    subaccountId,
    funnelId,
    activePageId,
    brandKit,
    setBrandKit,
    website,
}: Props) => {
    const blocksContainerRef = useRef<HTMLDivElement>(null)
    const layerManagerRef = useRef<HTMLDivElement>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [layerManagerRendered, setLayerManagerRendered] = useState(false)

    // Blocks Logic (Adapted from BlocksPanel)
    useEffect(() => {
        if (!editor || !blocksContainerRef.current || activeTab !== 'blocks' || collapsed) return

        const updateBlocks = () => {
            if (!blocksContainerRef.current) return
            const allBlocks = editor.BlockManager.getAll()
            const filteredBlocks = allBlocks.filter((block: any) => {
                const blockCategory = block.get('category')
                const categoryId = typeof blockCategory === 'object' ? blockCategory.id : blockCategory
                const categoryLabel = (typeof blockCategory === 'object' ? (blockCategory.label || blockCategory.id || '') : (blockCategory || '')).toString()
                const label = (block.get('label') || block.get('id') || '').toString()

                const normCategoryId = String(categoryId || '').toLowerCase()
                const normSelected = selectedCategory ? String(selectedCategory).toLowerCase() : null

                // Matches category if one is selected
                const matchesCategory = !normSelected || normCategoryId === normSelected

                // Matches search if query is in label OR category label
                const matchesSearch = searchQuery === '' ||
                    label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

                return matchesCategory && matchesSearch
            })

            blocksContainerRef.current.innerHTML = ''
            if (filteredBlocks.length > 0) {
                const blocksEl = editor.BlockManager.render(filteredBlocks, {
                    external: true,
                    ignoreCategories: !!selectedCategory || !!searchQuery // Flat list for search/category view
                })
                blocksContainerRef.current.appendChild(blocksEl)
            } else {
                blocksContainerRef.current.innerHTML = `<div class="p-8 text-center text-muted-foreground"><p class="text-sm font-medium">No elements found</p><p class="text-xs opacity-70 mt-1">Try a different search term</p></div>`
            }
        }

        updateBlocks()
        editor.on('block:add block:remove', updateBlocks)
        return () => { editor.off('block:add block:remove', updateBlocks) }
    }, [editor, activeTab, collapsed, searchQuery, selectedCategory])

    // Layers Logic
    useEffect(() => {
        if (!editor || !layerManagerRef.current || activeTab !== 'layers' || collapsed || layerManagerRendered) return

        const timer = setTimeout(() => {
            if (layerManagerRef.current && layerManagerRef.current.children.length === 0) {
                try {
                    const layerManager = editor.LayerManager.render()
                    layerManagerRef.current.appendChild(layerManager)
                    setLayerManagerRendered(true)
                } catch (error) {
                    console.error('Error rendering LayerManager:', error)
                }
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [editor, activeTab, collapsed, layerManagerRendered])


    const menuItems = [
        { id: 'pages', label: 'Pages', icon: Files },
        { id: 'blocks', label: 'Blocks', icon: LayoutGrid },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'layers', label: 'Layers', icon: Layers }, // Placeholder
        { id: 'styles', label: 'Styles', icon: Palette }, // Placeholder
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    const handleTabClick = (id: string) => {
        if (collapsed) {
            setCollapsed(false)
        }
        setActiveTab(id)
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'pages':
                return (
                    <PagesTab
                        pages={pages}
                        subaccountId={subaccountId}
                        funnelId={funnelId}
                        activePageId={activePageId}
                    />
                )
            case 'media':
                return (
                    <MediaTab
                        subaccountId={subaccountId}
                        editor={editor}
                    />
                )
            case 'blocks':
                return (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm">
                                    {selectedCategory
                                        ? blockCategories.find(c => c.id === selectedCategory)?.label
                                        : (searchQuery ? 'Search Results' : 'Elements')}
                                </h3>
                                {(selectedCategory || searchQuery) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] gap-1 hover:bg-muted"
                                        onClick={() => {
                                            setSelectedCategory(null)
                                            setSearchQuery('')
                                        }}
                                    >
                                        {selectedCategory ? <ChevronLeft className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        {selectedCategory ? 'Back' : 'Clear'}
                                    </Button>
                                )}
                            </div>

                            {!selectedCategory && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search components..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-8 text-xs focus-visible:ring-primary"
                                    />
                                </div>
                            )}
                        </div>

                        {!selectedCategory && !searchQuery ? (
                            <div className="flex-1 overflow-y-auto p-4 min-h-0 pb-20 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                    {blockCategories.map((category) => {
                                        const Icon = category.icon
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border bg-card hover:bg-accent hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-medium text-center">{category.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div
                                ref={blocksContainerRef}
                                className="flex-1 overflow-y-auto gjs-blocks-container p-4 min-h-0 pb-20 custom-scrollbar"
                            ></div>
                        )}
                    </div>
                )

            case 'layers':
                return (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold">Layers</h3>
                        </div>
                        <div ref={layerManagerRef} className="flex-1 overflow-y-auto p-4 gjs-layer-manager-container min-h-0 pb-20 custom-scrollbar"></div>
                    </div>
                )
            case 'styles':
                return (
                    <BrandKitTab
                        brandKit={brandKit}
                        setBrandKit={setBrandKit}
                        website={website}
                    />
                )

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                        <p className="text-sm">Select an item to view properties</p>
                    </div>
                )
        }
    }

    return (
        <div className={cn(
            "flex h-full border-r bg-background transition-all duration-300 ease-in-out relative flex-shrink-0 z-40",
            collapsed ? "w-[60px]" : "w-[340px]"
        )}>
            {/* Collapse Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -right-3 top-2 h-6 w-6 rounded-full border bg-background shadow-md z-50 hover:bg-muted"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>

            {/* Icon Sidebar */}
            <div className="flex flex-col items-center w-[60px] border-r h-full py-4 gap-4 bg-muted/20">
                {menuItems.map((item) => (
                    <TooltipProvider key={item.id}>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={activeTab === item.id && !collapsed ? "secondary" : "ghost"}
                                    size="icon"
                                    className={cn(
                                        "h-10 w-10 rounded-xl transition-all",
                                        activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                                    )}
                                    onClick={() => handleTabClick(item.id)}
                                >
                                    <item.icon className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{item.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>

            {/* Content Area */}
            {!collapsed && (
                <div className="flex-1 h-full overflow-hidden bg-background min-h-0">
                    {renderContent()}
                </div>
            )}
        </div>
    )
}

export default EditorSidebar
