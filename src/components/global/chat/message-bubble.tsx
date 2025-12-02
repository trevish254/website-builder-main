'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle2, FileText, Image as ImageIcon, Video, Paperclip } from 'lucide-react'
import Image from 'next/image'

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
}

const MessageBubble = ({
    isSender,
    content,
    timestamp,
    senderName,
    senderAvatar,
    attachments,
    isRead
}: MessageBubbleProps) => {
    return (
        <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}>
            {!isSender && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={senderAvatar || ''} />
                    <AvatarFallback>{senderName?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
            )}
            <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div
                    className={`
            rounded-2xl px-4 py-3
            ${isSender
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
                        }
          `}
                >
                    {attachments && attachments.length > 0 && (
                        <div className="mb-2 space-y-2">
                            {attachments.map((att, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${isSender ? 'bg-blue-700/50' : 'bg-white dark:bg-gray-700'
                                        }`}
                                >
                                    {att.type.startsWith('image') ? (
                                        <div className="relative w-full h-32 rounded overflow-hidden">
                                            <Image
                                                src={att.url}
                                                alt={att.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            {att.type.includes('pdf') && <FileText className="h-4 w-4" />}
                                            {att.type.includes('video') && <Video className="h-4 w-4" />}
                                            {!att.type.includes('pdf') && !att.type.includes('video') && <Paperclip className="h-4 w-4" />}
                                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-xs truncate hover:underline">
                                                {att.name}
                                            </a>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
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
    )
}

export default MessageBubble
