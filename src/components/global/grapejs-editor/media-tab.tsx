'use client'
import React, { useEffect, useState } from 'react'
import { getMedia } from '@/lib/queries'
import { Search, Loader2, Image as ImageIcon, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import MediaUploadButton from '@/components/media/upload-buttons'

type Props = {
    subaccountId: string
    editor: any
}

const MediaTab = ({ subaccountId, editor }: Props) => {
    const [mediaFiles, setMediaFiles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

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
        fetchMedia()
    }, [subaccountId])

    const handleSelectImage = (url: string) => {
        if (!editor) return

        const selected = editor.getSelected()
        if (selected && selected.is('image')) {
            selected.set('src', url)
            toast({
                title: 'Image Updated',
                description: 'The selected image has been updated.',
            })
        } else {
            // If no image is selected, or selection is not an image, we can maybe add a new image block or just notify
            // For now, let's just notify that they should select an image component
            toast({
                title: 'No Image Selected',
                description: 'Please select an image element on the canvas to update its source.',
                variant: 'destructive'
            })
        }
    }

    const filteredMedia = mediaFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Media Library
                    </h3>
                    <MediaUploadButton
                        subaccountId={subaccountId}
                        onUploadComplete={fetchMedia}
                    />
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : filteredMedia.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 pb-20">
                        {filteredMedia.map((file) => (
                            <div
                                key={file.id}
                                className="group relative aspect-square rounded-lg border bg-muted overflow-hidden cursor-pointer hover:border-primary transition-all"
                                onClick={() => handleSelectImage(file.link)}
                            >
                                <img
                                    src={file.link}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] text-white font-medium bg-black/60 px-2 py-1 rounded">Select</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-[10px] text-white truncate px-1">{file.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-60 text-center space-y-2">
                        <ImageIcon className="w-12 h-12 text-muted-foreground opacity-20" />
                        <p className="text-sm text-muted-foreground">No media files found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MediaTab
