'use client'

import React, { useEffect, useState } from 'react'
import { getMedia, deleteMedia } from '@/lib/queries'
import { Search, Loader2, Image as ImageIcon, Plus, Link as LinkIcon, Check, X, Trash2, LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import MediaUploadButton from '@/components/media/upload-buttons'
import { createMedia } from '@/lib/queries'
import { cn } from '@/lib/utils'

type Props = {
    subaccountId: string
    editor: any
}

const MediaTab = ({ subaccountId, editor }: Props) => {
    const [mediaFiles, setMediaFiles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [isAddingLink, setIsAddingLink] = useState(false)

    const fetchMedia = async () => {
        setIsLoading(true)
        try {
            const data = await getMedia(subaccountId)
            if (data?.Media) {
                setMediaFiles(data.Media)
            }
        } catch (error) {
            console.error('Error fetching media:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddFromLink = async () => {
        if (!imageUrl) return
        const isDataUrl = imageUrl.startsWith('data:image/')
        const extensionCheck = /\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(imageUrl)
        const isHttp = imageUrl.startsWith('http')

        if (!isDataUrl && !extensionCheck && !isHttp) {
            toast({ title: 'Invalid URL', description: 'Please provide a valid image URL.', variant: 'destructive' })
            return
        }

        const existingFile = mediaFiles.find(f => f.link === imageUrl)
        if (existingFile) {
            handleSelectImage(imageUrl)
            setImageUrl('')
            setShowLinkInput(false)
            return
        }

        setIsAddingLink(true)
        try {
            const newMedia = await createMedia(subaccountId, {
                link: imageUrl,
                name: imageUrl.split('/').pop()?.split('?')[0] || 'Image from link',
                type: 'image'
            })

            if (newMedia) {
                toast({ title: 'Image Added', description: 'The image has been added to your library.' })
                setMediaFiles(prev => [newMedia, ...prev])
                fetchMedia()
                handleSelectImage(imageUrl)
                setImageUrl('')
                setShowLinkInput(false)
            } else {
                handleSelectImage(imageUrl)
            }
        } catch (error) {
            handleSelectImage(imageUrl)
        } finally {
            setIsAddingLink(false)
        }
    }

    useEffect(() => {
        fetchMedia()
    }, [subaccountId])

    const handleSelectImage = (url: string) => {
        if (!editor) return
        const selected = editor.getSelected()
        if (selected && selected.is('image')) {
            selected.set('src', url)
            toast({ title: 'Image Updated', description: 'The selected image has been updated.' })
        } else {
            toast({ title: 'No Image Selected', description: 'Please select an image element on the canvas to update its source.', variant: 'destructive' })
        }
    }

    const handleDeleteMedia = async (e: React.MouseEvent, mediaId: string) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this image?')) return
        try {
            const success = await deleteMedia(mediaId)
            if (success) {
                toast({ title: 'Deleted', description: 'Image has been removed from your library.' })
                setMediaFiles(prev => prev.filter(f => f.id !== mediaId))
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Could not delete image. Please try again.', variant: 'destructive' })
        }
    }

    const filteredMedia = (mediaFiles || []).filter((file) => {
        if (!file) return false
        const search = (searchQuery || '').toLowerCase()
        const nameMatch = (file.name || '').toLowerCase().includes(search)
        const linkMatch = (file.link || '').toLowerCase().includes(search)
        return nameMatch || linkMatch
    })

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden border-l">
            <div className="p-6 border-b space-y-4 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-xl shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                            <ImageIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight">Media Library</h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold opacity-70">Assets Manager</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-xl border-neutral-200 dark:border-neutral-800"
                            onClick={() => setShowLinkInput(!showLinkInput)}
                        >
                            <LinkIcon className="w-3.5 h-3.5" />
                        </Button>
                        <MediaUploadButton
                            subaccountId={subaccountId}
                            onUploadComplete={fetchMedia}
                        />
                    </div>
                </div>

                {showLinkInput && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="flex gap-2 bg-white dark:bg-neutral-800 p-2 rounded-xl border shadow-lg ring-1 ring-black/5">
                            <Input
                                placeholder="Paste image URL..."
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="h-9 text-xs bg-transparent border-none focus-visible:ring-0"
                                autoFocus
                            />
                            <div className="flex items-center gap-1">
                                <Button
                                    size="icon"
                                    className="h-8 w-8 rounded-lg bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                                    onClick={handleAddFromLink}
                                    disabled={!imageUrl || isAddingLink}
                                >
                                    {isAddingLink ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5 text-white" />}
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-lg"
                                    onClick={() => { setShowLinkInput(false); setImageUrl(''); }}
                                >
                                    <X className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl focus-visible:ring-primary/20 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-24 bg-neutral-50/30 dark:bg-black/20">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-60 space-y-4">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Scanning Storage...</p>
                    </div>
                ) : filteredMedia.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {filteredMedia.map((file) => (
                            <div
                                key={file.id}
                                className="group relative aspect-square rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden cursor-pointer hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 ring-1 ring-black/5"
                                onClick={() => handleSelectImage(file.link)}
                            >
                                <img
                                    src={file.link}
                                    alt={file.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                    <div className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                                        Select
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                    onClick={(e) => handleDeleteMedia(e, file.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                    <p className="text-[10px] text-white/90 font-medium truncate">{file.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                        <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700">
                            <ImageIcon className="w-8 h-8 text-muted-foreground opacity-30" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Library Empty</p>
                            <p className="text-xs text-muted-foreground max-w-[150px] mx-auto opacity-70">Upload assets or add them via URL to start building.</p>
                        </div>
                        <MediaUploadButton
                            subaccountId={subaccountId}
                            onUploadComplete={fetchMedia}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default MediaTab
