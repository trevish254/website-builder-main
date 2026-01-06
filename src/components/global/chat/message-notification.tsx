'use client'

import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { X, Reply } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface InAppNotification {
    id: string
    conversationId: string
    senderName: string
    senderAvatar?: string
    messageText: string
    timestamp: string
    onReply?: () => void
    onDismiss?: () => void
}

interface MessageNotificationProps {
    notification: InAppNotification | null
    onClose: () => void
    onReply: () => void
}

export function MessageNotification({ notification, onClose, onReply }: MessageNotificationProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (notification) {
            setIsVisible(true)

            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                handleClose()
            }, 5000)

            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [notification])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => {
            onClose()
        }, 300) // Wait for animation to complete
    }

    const handleReply = () => {
        onReply()
        handleClose()
    }

    if (!notification) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
                >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden backdrop-blur-xl">
                        {/* Header with gradient */}
                        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        <div className="p-4">
                            <div className="flex items-start gap-3">
                                {/* Avatar */}
                                <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                                    <AvatarImage src={notification.senderAvatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                        {notification.senderName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {notification.senderName}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {notification.timestamp}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={handleClose}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                        {notification.messageText}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={handleReply}
                                            className="h-8 text-xs bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                                        >
                                            <Reply className="h-3 w-3 mr-1" />
                                            Reply
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={handleClose}
                                            className="h-8 text-xs"
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Notification Queue Manager Component
interface NotificationQueueProps {
    notifications: InAppNotification[]
    onClose: (id: string) => void
    onReply: (conversationId: string) => void
}

export function NotificationQueue({ notifications, onClose, onReply }: NotificationQueueProps) {
    // Show only the most recent notification
    const currentNotification = notifications[notifications.length - 1] || null

    return (
        <MessageNotification
            notification={currentNotification}
            onClose={() => currentNotification && onClose(currentNotification.id)}
            onReply={() => currentNotification && onReply(currentNotification.conversationId)}
        />
    )
}
