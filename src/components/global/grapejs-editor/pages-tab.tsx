'use client'
import React, { useState, useEffect } from 'react'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@/components/global/strict-mode-droppable'
import {
    Plus,
    MoreVertical,
    Pencil,
    Trash,
    Check,
    X,
    GripVertical,
    Files,
    Copy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { WebsitePage, upsertWebsitePage, deleteWebsitePage } from '@/lib/website-queries'
import { useRouter } from 'next/navigation'

type Props = {
    pages: WebsitePage[]
    subaccountId: string
    funnelId: string
    activePageId: string
}

const PagesTab = ({ pages, subaccountId, funnelId, activePageId }: Props) => {
    const router = useRouter()
    const [localPages, setLocalPages] = useState<WebsitePage[]>([])
    const [editingPageId, setEditingPageId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [newPageName, setNewPageName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLocalPages(pages)
    }, [pages])

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(localPages)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Update orders locally
        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index,
        }))

        setLocalPages(updatedItems)

        // Save to server
        try {
            const updates = updatedItems.map((page) =>
                upsertWebsitePage({
                    ...page,
                    order: page.order,
                })
            )
            await Promise.all(updates)
            toast({
                title: "Success",
                description: "Pages reordered"
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save page order',
            })
        }
    }

    const handleAddPage = async () => {
        if (!newPageName.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Page name is required' })
            return
        }

        const newPageId = crypto.randomUUID()
        const newPageOrder = localPages.length
        try {
            setLoading(true)
            await upsertWebsitePage({
                id: newPageId,
                name: newPageName,
                order: newPageOrder,
                websiteId: funnelId,
                pathName: newPageName.toLowerCase().replace(/\s+/g, '-'),
                content: null
            })

            toast({ title: 'Success', description: 'Created new page' })
            setNewPageName('')
            setIsCreating(false)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast({ variant: 'destructive', title: 'Error', description: 'Could not create page' })
        } finally {
            setLoading(false)
        }
    }

    const handleRename = async (id: string) => {
        if (!editingName.trim()) return

        const page = localPages.find(p => p.id === id)
        if (!page) return

        try {
            setLoading(true)
            await upsertWebsitePage({
                ...page,
                name: editingName,
                pathName: editingName.toLowerCase().replace(/\s+/g, '-')
            })

            toast({ title: 'Success', description: 'Page renamed' })
            setEditingPageId(null)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast({ variant: 'destructive', title: 'Error', description: 'Could not rename page' })
        } finally {
            setLoading(false)
        }
    }



    const handleDelete = async (id: string) => {
        try {
            await deleteWebsitePage(id)
            toast({ title: 'Success', description: 'Page deleted' })
            router.refresh()
            if (activePageId === id) {
                router.push(`/subaccount/${subaccountId}/websites/editor/${funnelId}`)
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete page' })
        }
    }

    const handleDuplicate = async (id: string) => {
        const page = localPages.find(p => p.id === id)
        if (!page) return

        const newId = crypto.randomUUID()
        const newOrder = localPages.length
        const newName = `${page.name} Copy`

        try {
            await upsertWebsitePage({
                id: newId,
                name: newName,
                order: newOrder,
                websiteId: funnelId,
                pathName: `${page.pathName}-copy-${Date.now()}`,
                content: page.content
            })
            toast({ title: 'Success', description: 'Page duplicated' })
            router.refresh()
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not duplicate page' })
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Pages</h3>
                <Button onClick={() => setIsCreating(true)} variant="ghost" size="icon" className="h-8 w-8" disabled={loading || isCreating}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {isCreating && (
                    <div className="mb-2 p-2 rounded-md border bg-card/50 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <Files className="h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Page Name"
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                className="h-8 text-xs"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => { setIsCreating(false); setNewPageName('') }}>Cancel</Button>
                            <Button size="sm" onClick={handleAddPage} disabled={loading}>Add</Button>
                        </div>
                    </div>
                )}
                <DragDropContext onDragEnd={onDragEnd}>
                    <StrictModeDroppable droppableId="pages-list">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-2"
                            >
                                {localPages.map((page, index) => (
                                    <Draggable key={page.id} draggableId={page.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "group flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent transition-colors",
                                                    activePageId === page.id ? "border-primary bg-accent" : "border-transparent"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                                                        <GripVertical className="h-4 w-4" />
                                                    </div>

                                                    {editingPageId === page.id ? (
                                                        <div className="flex items-center gap-1 flex-1">
                                                            <Input
                                                                value={editingName}
                                                                onChange={(e) => setEditingName(e.target.value)}
                                                                className="h-7 text-xs"
                                                                autoFocus
                                                            />
                                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleRename(page.id)}>
                                                                <Check className="h-3 w-3" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingPageId(null)}>
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="flex-1 truncate text-sm cursor-pointer"
                                                            onClick={() => router.replace(`/subaccount/${subaccountId}/websites/editor/${funnelId}?pageId=${page.id}`)}
                                                        >
                                                            {page.name}
                                                        </div>
                                                    )}
                                                </div>

                                                {!editingPageId && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="h-3 w-3" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-[99999]">
                                                            <DropdownMenuItem onClick={() => {
                                                                setEditingPageId(page.id)
                                                                setEditingName(page.name)
                                                            }}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Rename
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDuplicate(page.id)}>
                                                                <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(page.id)}>
                                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>
            </div>
        </div>
    )
}

export default PagesTab
