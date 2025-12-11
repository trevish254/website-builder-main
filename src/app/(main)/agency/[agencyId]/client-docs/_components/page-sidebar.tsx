'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash2, FileText, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface DocumentPage {
    id: string
    title: string
    content: any
    createdAt: string
}

interface PageSidebarProps {
    pages: DocumentPage[]
    currentPageId: string
    onPageSelect: (pageId: string) => void
    onPageAdd: () => void
    onPageDelete: (pageId: string) => void
    onPageRename?: (pageId: string, newTitle: string) => void
}

export default function PageSidebar({
    pages,
    currentPageId,
    onPageSelect,
    onPageAdd,
    onPageDelete,
    onPageRename
}: PageSidebarProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [pageToDelete, setPageToDelete] = useState<string | null>(null)

    const handleDeleteClick = (pageId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setPageToDelete(pageId)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (pageToDelete) {
            onPageDelete(pageToDelete)
            setPageToDelete(null)
        }
        setDeleteDialogOpen(false)
    }

    return (
        <div className="w-64 border-r bg-muted/20 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b bg-background">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Pages</h3>
                    <span className="text-xs text-muted-foreground">{pages.length}</span>
                </div>
                <Button
                    onClick={onPageAdd}
                    size="sm"
                    className="w-full"
                    variant="outline"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Page
                </Button>
            </div>

            {/* Page List */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {pages.map((page, index) => (
                        <div
                            key={page.id}
                            onClick={() => onPageSelect(page.id)}
                            className={cn(
                                "group relative flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all",
                                "hover:bg-accent/50",
                                currentPageId === page.id
                                    ? "bg-accent border-l-2 border-primary"
                                    : "bg-background border border-transparent"
                            )}
                        >
                            {/* Drag Handle */}
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Page Icon */}
                            <FileText className={cn(
                                "h-4 w-4 flex-shrink-0",
                                currentPageId === page.id ? "text-primary" : "text-muted-foreground"
                            )} />

                            {/* Page Info */}
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium truncate",
                                    currentPageId === page.id ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {page.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Page {index + 1}
                                </p>
                            </div>

                            {/* Delete Button */}
                            {pages.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => handleDeleteClick(page.id, e)}
                                >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Page?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this page and all its content.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
