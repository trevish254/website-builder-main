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
    Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { blockCategories } from './blocks-config' // Blocks configuration
import Link from 'next/link'
import PagesTab from './pages-tab'
import BrandKitTab from './brand-kit-tab'
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
            const allBlocks = editor.BlockManager.getAll()
            const filteredBlocks = allBlocks.filter((block: any) => {
                const blockCategory = block.get('category')
                const categoryId = typeof blockCategory === 'object' ? blockCategory.id : blockCategory
                const label = block.get('label')
                const normCategoryId = String(categoryId).toLowerCase()
                const normSelected = selectedCategory ? String(selectedCategory).toLowerCase() : null
                const matchesCategory = !normSelected || normCategoryId === normSelected
                const matchesSearch = searchQuery === '' || label.toLowerCase().includes(searchQuery.toLowerCase())
                return matchesCategory && matchesSearch
            })

            blocksContainerRef.current!.innerHTML = ''
            if (filteredBlocks.length > 0) {
                const blocksEl = editor.BlockManager.render(filteredBlocks, {
                    external: true,
                    ignoreCategories: !!selectedCategory
                })
                blocksContainerRef.current!.appendChild(blocksEl)
            } else {
                blocksContainerRef.current!.innerHTML = `<div class="p-4 text-center text-muted-foreground text-sm">No blocks found</div>`
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
            case 'blocks':
                // If category logic is needed, implement back navigation here
                if (!selectedCategory) {
                    return (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b space-y-2">
                                <h3 className="font-semibold">Elements</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search elements..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 h-8 text-xs"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 min-h-0 pb-20 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                    {blockCategories.map((category) => {
                                        const Icon = category.icon
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary transition-all cursor-pointer"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-xs font-medium text-center">{category.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    const currentCategory = blockCategories.find(c => c.id === selectedCategory)
                    return (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedCategory(null)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="font-medium text-sm">{currentCategory?.label || 'Blocks'}</span>
                            </div>
                            <div ref={blocksContainerRef} className="flex-1 overflow-y-auto gjs-blocks-container min-h-0 pb-20 custom-scrollbar"></div>
                        </div>
                    )
                }

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
