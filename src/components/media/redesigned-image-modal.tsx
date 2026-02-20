'use client'

import React, { useEffect, useState } from 'react'
import { getMedia, createMedia, deleteMedia } from '@/lib/queries'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Search, Link as LinkIcon, Image as ImageIcon, Plus, Check, ExternalLink, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MediaUploadButton from './upload-buttons'

type Props = {
    subaccountId: string
    onSelect: (url: string) => void
    onClose?: () => void
}

const RedesignedImageModal = ({ subaccountId, onSelect, onClose }: Props) => {
    const [mediaFiles, setMediaFiles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isAddingLink, setIsAddingLink] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')
    const [previewError, setPreviewError] = useState(false)
    const [isPreviewLoading, setIsPreviewLoading] = useState(false)

    const handleDeleteMedia = async (e: React.MouseEvent, mediaId: string) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this image?')) return

        try {
            const success = await deleteMedia(mediaId)
            if (success) {
                toast({
                    title: 'Deleted',
                    description: 'Image has been removed from your library.'
                })
                setMediaFiles(prev => prev.filter(f => f.id !== mediaId))
            } else {
                throw new Error('Failed to delete')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Could not delete image. Please try again.',
                variant: 'destructive'
            })
        }
    }

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

    useEffect(() => {
        console.log('🖼️ RedesignedImageModal mounting/updating:', {
            propId: subaccountId,
            actualMediaCount: mediaFiles.length
        })
        if (subaccountId) {
            fetchMedia()
        }
    }, [subaccountId])

    const handleSelectImage = (url: string) => {
        onSelect(url)
        if (onClose) onClose()
    }

    const handleAddFromLink = async () => {
        if (!imageUrl) return

        setIsAddingLink(true)
        try {
            // Improved validation: Check if it's a data URL, ends with image extension (even with query params), or simply starts with http
            const isDataUrl = imageUrl.startsWith('data:image/')
            const extensionCheck = /\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(imageUrl)
            const isHttp = imageUrl.startsWith('http')

            if (!isDataUrl && !extensionCheck && !isHttp) {
                toast({
                    title: 'Invalid URL',
                    description: 'Please provide a valid image URL.',
                    variant: 'destructive'
                })
                setIsAddingLink(false)
                return
            }

            // Check if already in library to avoid duplicates
            const existingFile = mediaFiles.find(f => f.link === imageUrl)
            if (existingFile) {
                handleSelectImage(imageUrl)
                return
            }

            // Create media entry so it appears in the library
            const newMedia = await createMedia(subaccountId, {
                link: imageUrl,
                name: imageUrl.split('/').pop()?.split('?')[0] || 'Image from link',
                type: 'image'
            })

            if (newMedia) {
                console.log('✅ Image saved to library:', newMedia)
                toast({
                    title: 'Image Added',
                    description: 'The image has been added to your library.',
                })

                // Update local state immediately for instant feedback
                setMediaFiles(prev => [newMedia, ...prev])

                // Also trigger a full refresh in background
                fetchMedia()

                // Select it
                handleSelectImage(imageUrl)
            } else {
                console.warn('⚠️ createMedia returned null, selecting image without saving')
                // If creation fails (e.g. Supabase error), we still allow selection if it works
                handleSelectImage(imageUrl)
            }
        } catch (error) {
            console.error('Error adding image from link:', error)
            handleSelectImage(imageUrl)
        } finally {
            setIsAddingLink(false)
        }
    }

    const filteredMedia = (mediaFiles || []).filter((file) => {
        if (!file) return false
        const search = (searchQuery || '').toLowerCase()
        const nameMatch = (file.name || '').toLowerCase().includes(search)
        const linkMatch = (file.link || '').toLowerCase().includes(search)
        return nameMatch || linkMatch
    })

    console.log('📊 Media Modal Stats:', {
        subaccountId,
        totalFiles: mediaFiles?.length,
        filteredCount: filteredMedia.length,
        searchQuery
    })

    return (
        <div className="flex flex-col h-[600px] w-[900px] max-w-full bg-background overflow-hidden rounded-xl border-none shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">Image Gallery</h2>
                        <p className="text-sm text-muted-foreground">Select an image from your library or add a new link</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <MediaUploadButton
                        subaccountId={subaccountId}
                        onUploadComplete={fetchMedia}
                    />
                    {onClose && (
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                            <Plus className="w-5 h-5 rotate-45" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Side: Library */}
                <div className="flex-[1.5] flex flex-col border-r bg-muted/5">
                    <div className="flex items-center justify-between p-4 border-b bg-muted/20">
                        <div className="relative flex-1 mr-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search your library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-11 bg-background/50 border-muted focus:ring-primary/20"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchMedia}
                            title="Refresh gallery"
                            className="flex-shrink-0"
                            disabled={isLoading}
                        >
                            <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 p-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-60 space-y-4">
                                <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
                                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your media...</p>
                            </div>
                        ) : filteredMedia.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4 pb-10">
                                {filteredMedia.map((file) => (
                                    <div
                                        key={file.id}
                                        className="group relative aspect-square rounded-xl border bg-card overflow-hidden cursor-pointer hover:border-primary hover:shadow-lg transition-all duration-300"
                                        onClick={() => handleSelectImage(file.link)}
                                    >
                                        <img
                                            src={file.link}
                                            alt={file.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <Check className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                            onClick={(e) => handleDeleteMedia(e, file.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-[10px] text-white truncate font-medium">{file.name || 'Untitled'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                                <div className="p-4 bg-muted rounded-full">
                                    <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-foreground">No images found</p>
                                    <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
                                        {subaccountId ? 'Upload something or try searching for something else' : 'Account ID missing. Please check your connection.'}
                                    </p>
                                    {!subaccountId && (
                                        <p className="text-[10px] text-destructive mt-2">Debug: subaccountId is empty</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Right Side: Links */}
                <div className="flex-1 flex flex-col bg-muted/20">
                    <div className="p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                <LinkIcon className="w-5 h-5 text-primary" /> Add from URL
                            </h3>
                            <p className="text-sm text-muted-foreground">Paste an external image link to add it to your project</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/80">Image URL</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Paste Lummi or Unsplash link..."
                                        value={imageUrl}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setImageUrl(val)
                                            setPreviewUrl(val)
                                            setPreviewError(false)
                                            if (val) setIsPreviewLoading(true)
                                        }}
                                        className="h-11 bg-background border-muted focus:ring-primary/20"
                                    />
                                    <Button
                                        onClick={handleAddFromLink}
                                        disabled={!imageUrl || isAddingLink || (previewUrl && previewError)}
                                        className="h-11 px-6 shadow-lg shadow-primary/20"
                                    >
                                        {isAddingLink ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Select'}
                                    </Button>
                                </div>
                                {previewError && (
                                    <p className="text-[10px] text-destructive flex items-center gap-1 mt-1">
                                        <ImageIcon className="w-3 h-3" /> Image preview failed. Some links block hotlinking.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground/80">Preview</label>
                                <div className="aspect-video relative rounded-xl border-2 border-dashed bg-background/50 flex items-center justify-center overflow-hidden group">
                                    {previewUrl ? (
                                        <>
                                            {isPreviewLoading && (
                                                <div className="absolute inset-0 z-10 bg-background/80 flex items-center justify-center">
                                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                </div>
                                            )}
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className={`w-full h-full object-contain ${previewError ? 'opacity-20 grayscale' : ''}`}
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                                onLoad={() => {
                                                    setIsPreviewLoading(false)
                                                    setPreviewError(false)
                                                }}
                                                onError={(e) => {
                                                    console.warn('Preview failed to load for:', previewUrl)
                                                    setIsPreviewLoading(false)
                                                    setPreviewError(true)
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <Button size="sm" variant="secondary" className="gap-2" asChild>
                                                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" /> Open Original
                                                    </a>
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
                                            <ImageIcon className="w-12 h-12" />
                                            <p className="text-xs font-medium uppercase tracking-wider">Awaiting URL</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Linked Images (Optional enhancement) */}
                        <div className="pt-8 border-t border-muted">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Tips</h4>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-xs text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                                    <span>Images from links are automatically saved to your library for future use.</span>
                                </li>
                                <li className="flex gap-3 text-xs text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1 flex-shrink-0" />
                                    <span>You can also use high-quality images from Unsplash or Pexels.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RedesignedImageModal
