'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, FileText, Image as ImageIcon, Video, Paperclip, MoreVertical, Trash2, Reply, Edit, Forward, X } from 'lucide-react'
import Image from 'next/image'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Attachment {
    type: string
    name: string
    url: string
}

interface MessageBubbleProps {
    isSender: boolean
    content: string
    timestamp: string
    senderName?: string
    senderAvatar?: string
    attachments?: Attachment[]
    isRead?: boolean
    messageId?: string
    onDelete?: (id: string) => void
    onReply?: (id: string) => void
    onEdit?: (id: string) => void
    onForward?: (id: string) => void
}

const MessageBubble = ({
    isSender,
    content,
    timestamp,
    senderName,
    senderAvatar,
    attachments,
    isRead,
    messageId,
    onDelete,
    onReply,
    onEdit,
    onForward
}: MessageBubbleProps) => {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxContent, setLightboxContent] = useState<{ type: string; url: string } | null>(null)

    const openLightbox = (type: string, url: string) => {
        setLightboxContent({ type, url })
        setLightboxOpen(true)
    }

    return (
        <>
            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 group`}>
                {!isSender && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarImage src={senderAvatar || ''} />
                        <AvatarFallback>{senderName?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                )}
                <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[70%] relative`}>
                    <div
                        className={`
            rounded-2xl ${attachments && attachments.length > 0 && attachments[0].type.startsWith('image') ? 'p-1' : 'px-4 py-3'} relative
            ${isSender
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                            }
          `}
                    >
                        {/* Context Menu */}
                        {messageId && (
                            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-full bg-white dark:bg-gray-700 shadow-md hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            <MoreVertical className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {onReply && (
                                            <DropdownMenuItem onClick={() => onReply(messageId)}>
                                                <Reply className="h-4 w-4 mr-2" />
                                                Reply
                                            </DropdownMenuItem>
                                        )}
                                        {isSender && onEdit && (
                                            <DropdownMenuItem onClick={() => onEdit(messageId)}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </DropdownMenuItem>
                                        )}
                                        {onForward && (
                                            <DropdownMenuItem onClick={() => onForward(messageId)}>
                                                <Forward className="h-4 w-4 mr-2" />
                                                Forward
                                            </DropdownMenuItem>
                                        )}
                                        {onDelete && (
                                            <DropdownMenuItem
                                                onClick={() => onDelete(messageId)}
                                                className="text-red-600 dark:text-red-400"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        {attachments && attachments.length > 0 && (
                            <div className={`${content ? 'mb-2' : ''} space-y-2`}>
                                {attachments.map((att, idx) => (
                                    <div key={idx}>
                                        {att.type.startsWith('image') ? (
                                            <div
                                                className="relative w-full max-w-sm rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => openLightbox('image', att.url)}
                                            >
                                                <Image
                                                    src={att.url}
                                                    alt={att.name}
                                                    width={400}
                                                    height={300}
                                                    className="object-cover w-full h-auto"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : att.type.startsWith('video') ? (
                                            <div
                                                className="relative w-full max-w-sm rounded-lg overflow-hidden cursor-pointer"
                                                onClick={() => openLightbox('video', att.url)}
                                            >
                                                <video
                                                    src={att.url}
                                                    className="w-full h-auto rounded-lg"
                                                    controls={false}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                    <Video className="h-12 w-12 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`flex items-center gap-2 p-2 rounded-lg ${isSender ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-700'
                                                    }`}
                                            >
                                                {att.type.includes('pdf') && <FileText className="h-4 w-4" />}
                                                {!att.type.includes('pdf') && <Paperclip className="h-4 w-4" />}
                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-xs truncate hover:underline">
                                                    {att.name}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {content && (
                            <p className={`text-sm whitespace-pre-wrap break-words ${attachments && attachments.length > 0 && attachments[0].type.startsWith('image') ? 'px-3 pb-2' : ''}`}>
                                {content}
                            </p>
                        )}
                    </div>
                    <div className={`
          flex items-center gap-1 mt-1 text-xs
          ${isSender ? 'text-gray-500' : 'text-gray-500'}
        `}>
                        <span>{timestamp}</span>
                        {isSender && isRead && (
                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                        )}
                        {isSender && !isRead && (
                            <span className="text-gray-400">Sent</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-none">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center justify-center min-h-[400px] max-h-[90vh]">
                        {lightboxContent?.type === 'image' ? (
                            <Image
                                src={lightboxContent.url}
                                alt="Full size"
                                width={1200}
                                height={800}
                                className="object-contain w-full h-full"
                                unoptimized
                            />
                        ) : lightboxContent?.type === 'video' ? (
                            <video
                                src={lightboxContent.url}
                                className="w-full h-full max-h-[90vh]"
                                controls
                                autoPlay
                            />
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MessageBubble
