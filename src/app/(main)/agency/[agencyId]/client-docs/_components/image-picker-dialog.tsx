'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

type Props = {
    open: boolean
    onClose: () => void
    onSelect: (url: string) => void
    subaccountId?: string
}

export default function ImagePickerDialog({ open, onClose, onSelect, subaccountId }: Props) {
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [mediaFiles, setMediaFiles] = useState<any[]>([])

    const handleUrlSubmit = () => {
        if (url) {
            onSelect(url)
            setUrl('')
            onClose()
        }
    }

    const handleMediaSelect = (fileUrl: string) => {
        onSelect(fileUrl)
        onClose()
    }

    // Load media files when dialog opens
    const loadMedia = async () => {
        if (!subaccountId) return
        setLoading(true)
        try {
            const response = await fetch(`/api/media?subaccountId=${subaccountId}`)
            const data = await response.json()
            setMediaFiles(data || [])
        } catch (error) {
            console.error('Failed to load media:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="url" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="url">From URL</TabsTrigger>
                        <TabsTrigger value="media" onClick={loadMedia}>From Media</TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                            />
                        </div>
                        <Button onClick={handleUrlSubmit} disabled={!url}>
                            Insert Image
                        </Button>
                    </TabsContent>

                    <TabsContent value="media">
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : mediaFiles.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                No media files found. Upload images in the Media section first.
                            </div>
                        ) : (
                            <ScrollArea className="h-[400px]">
                                <div className="grid grid-cols-3 gap-4 p-4">
                                    {mediaFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border hover:border-primary transition-colors"
                                            onClick={() => handleMediaSelect(file.link)}
                                        >
                                            <Image
                                                src={file.link}
                                                alt={file.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
