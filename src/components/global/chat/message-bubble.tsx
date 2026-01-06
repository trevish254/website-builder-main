'use client'

import React, { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, FileText, Image as ImageIcon, Video, Paperclip, MoreVertical, Trash2, Reply, Edit, Forward, X, Play, Pause, Volume2 } from 'lucide-react'
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
    replyTo?: {
        text: string
        senderName?: string
    }
    isEdited?: boolean
}

const AudioPlayer = ({ url, isSender }: { url: string; isSender: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const audioRef = useRef<HTMLAudioElement>(null)

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const onTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const onEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
    }

    const formatTime = (time: number) => {
        const mins = Math.floor(time / 60)
        const secs = Math.floor(time % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className="flex items-center gap-3 p-1 rounded-xl min-w-[280px]">
            <button
                onClick={togglePlay}
                className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95 ${isSender ? 'bg-white/20 ring-1 ring-white/30 hover:bg-white/30' : 'bg-blue-600 shadow-blue-500/20 hover:bg-blue-700'
                    }`}>
                {isPlaying ? (
                    <Pause className="h-5 w-5 text-white" fill="currentColor" />
                ) : (
                    <Play className="h-5 w-5 ml-1 text-white" fill="currentColor" />
                )}
            </button>
            <div className="flex-1 space-y-1.5 py-1 pr-1">
                <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 items-end h-6">
                        {[1, 0.5, 0.8, 0.4, 1, 0.6, 0.9, 0.5, 0.7, 0.4, 0.8, 1, 0.5, 0.9, 0.4, 1, 0.6, 0.8].map((h, i) => (
                            <div
                                key={i}
                                className={`w-[3px] rounded-full transition-all duration-300 ${isSender
                                    ? (progress > (i / 18 * 100) ? 'bg-white' : 'bg-white/30')
                                    : (progress > (i / 18 * 100) ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600')
                                    }`}
                                style={{ height: `${h * 100}%` }}
                            />
                        ))}
                    </div>
                    <span className={`text-[11px] font-medium tracking-tight font-mono ${isSender ? 'text-white/80' : 'text-gray-500'}`}>
                        {isPlaying ? formatTime(currentTime) : (duration > 0 ? formatTime(duration) : '0:00')}
                    </span>
                </div>
                <audio
                    ref={audioRef}
                    src={url}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                    onEnded={onEnded}
                    className="hidden"
                />
                <div className="h-1.5 w-full bg-black/10 dark:bg-black/20 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-100 ${isSender ? 'bg-white' : 'bg-blue-600'}`} style={{ width: `${progress}%` }} />
                </div>
            </div>
        </div>
    )
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
    onForward,
    replyTo,
    isEdited
}: MessageBubbleProps) => {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxContent, setLightboxContent] = useState<{ type: string; url: string } | null>(null)

    const openLightbox = (type: string, url: string) => {
        setLightboxContent({ type, url })
        setLightboxOpen(true)
    }

    // Check if the message is purely a voice note confirmation
    const isVoiceNoteOnly = attachments?.some(a => a.type.startsWith('audio')) && content === 'Sent a voice note'
    const isAttachmentOnly = attachments?.some(a => !a.type.startsWith('audio')) && content === 'Sent an attachment'

    return (
        <>
            <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4 group`}>
                {!isSender && (
                    <Avatar className="h-8 w-8 mr-2 mt-auto mb-1 flex-shrink-0">
                        <AvatarImage src={senderAvatar || ''} />
                        <AvatarFallback>{senderName?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                )}
                <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[80%] lg:max-w-[70%] relative`}>
                    <div
                        className={`
                            relative transition-all duration-200
                            ${attachments && attachments.length > 0 && attachments[0].type.startsWith('image') ? 'p-1' : 'px-4 py-2.5'}
                            ${isSender
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-gray-700/50 shadow-sm'
                            }
                        `}
                    >
                        {/* Context Menu Trigger */}
                        {messageId && (
                            <div className={`absolute -top-2 ${isSender ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-opacity z-10`}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-full bg-white dark:bg-gray-700 shadow-md border hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <MoreVertical className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align={isSender ? "start" : "end"}>
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

                        {/* Quoted Reply */}
                        {replyTo && (
                            <div className={`
                                mb-2 p-2 rounded-lg border-l-4 flex flex-col gap-0.5 max-w-full overflow-hidden
                                ${isSender
                                    ? 'bg-white/10 border-white/30 text-white/90'
                                    : 'bg-gray-50 dark:bg-gray-900 border-blue-500 text-gray-600 dark:text-gray-400'
                                }
                            `}>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSender ? 'text-white' : 'text-blue-600'}`}>
                                    {replyTo.senderName || 'User'}
                                </span>
                                <p className="text-xs truncate italic">
                                    {replyTo.text}
                                </p>
                            </div>
                        )}

                        {attachments && attachments.length > 0 && (
                            <div className={`${(content && !isVoiceNoteOnly && !isAttachmentOnly) ? 'mb-2' : ''} space-y-2`}>
                                {attachments.map((att, idx) => (
                                    <div key={idx}>
                                        {att.type.startsWith('image') ? (
                                            <div
                                                className="relative w-full max-w-sm rounded-xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity ring-1 ring-black/5"
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
                                                className="relative w-full max-w-sm rounded-xl overflow-hidden cursor-pointer ring-1 ring-black/5"
                                                onClick={() => openLightbox('video', att.url)}
                                            >
                                                <video
                                                    src={att.url}
                                                    className="w-full h-auto rounded-lg"
                                                    controls={false}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                                                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                        <Video className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : att.type.startsWith('audio') ? (
                                            <AudioPlayer url={att.url} isSender={isSender} />
                                        ) : (
                                            <div
                                                className={`flex items-center gap-3 p-2.5 rounded-xl border ${isSender ? 'bg-white/10 border-white/20' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700/50'
                                                    }`}
                                            >
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${isSender ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900/40'
                                                    }`}>
                                                    {att.type.includes('pdf') ? <FileText className={`h-5 w-5 ${isSender ? 'text-white' : 'text-blue-600'}`} /> : <Paperclip className={`h-5 w-5 ${isSender ? 'text-white' : 'text-blue-600'}`} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate">{att.name}</p>
                                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className={`text-[10px] hover:underline opacity-70`}>
                                                        Download File
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {content && !isVoiceNoteOnly && !isAttachmentOnly && (
                            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap break-words px-0.5">
                                {content}
                            </p>
                        )}
                    </div>

                    <div className={`
                        flex items-center gap-1.5 mt-1 px-1
                        ${isSender ? 'text-gray-400' : 'text-gray-500'}
                    `}>
                        <span className="text-[10.5px] font-medium uppercase tracking-wider">
                            {timestamp}
                            {isEdited && <span className="ml-1 opacity-70 italic lowercase">(edited)</span>}
                        </span>
                        {isSender && (
                            isRead
                                ? <CheckCircle2 className="h-3 w-3 text-blue-500 fill-blue-500/10" />
                                : <CheckCircle2 className="h-3 w-3 text-gray-300" />
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
