'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NotificationQueue, InAppNotification } from '@/components/global/chat/message-notification'
import { NotificationSettingsDialog } from '@/components/global/chat/notification-settings'
import { showMessageNotification, playNotificationSound } from '@/lib/notifications'
import { Bell, Volume2, MessageSquare } from 'lucide-react'

// Disable static generation for this page since it uses browser APIs
export const dynamic = 'force-dynamic'

export default function NotificationDemo() {
    const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([])
    const [notificationSettings, setNotificationSettings] = useState({
        browserNotifications: false,
        soundEnabled: true,
        inAppNotifications: true
    })

    const testInAppNotification = () => {
        const notification: InAppNotification = {
            id: Date.now().toString(),
            conversationId: 'test-conversation',
            senderName: 'John Doe',
            senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            messageText: 'Hey! This is a test notification. How are you doing today?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            onReply: () => {
                alert('Reply clicked!')
                setInAppNotifications([])
            },
            onDismiss: () => {
                setInAppNotifications(prev => prev.filter(n => n.id !== notification.id))
            }
        }
        setInAppNotifications(prev => [...prev, notification])
    }

    const testBrowserNotification = () => {
        showMessageNotification({
            conversationId: 'test-conversation',
            messageId: 'test-message',
            senderName: 'Jane Smith',
            senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            messageText: 'This is a browser notification test!',
            timestamp: new Date().toLocaleTimeString()
        })
    }

    const testSound = () => {
        playNotificationSound(0.7)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
            <NotificationQueue
                notifications={inAppNotifications}
                onClose={(id) => setInAppNotifications(prev => prev.filter(n => n.id !== id))}
                onReply={(conversationId) => {
                    alert(`Opening conversation: ${conversationId}`)
                    setInAppNotifications([])
                }}
            />

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Bell className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Notification System Demo
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Test the comprehensive notification system with browser push notifications, in-app popups, and sound alerts.
                    </p>
                </div>

                {/* Settings Card */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-500" />
                            Notification Settings
                        </CardTitle>
                        <CardDescription>
                            Configure your notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                                <p className="font-semibold">Current Settings</p>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                                    <p>• Browser Notifications: {notificationSettings.browserNotifications ? '✅ Enabled' : '❌ Disabled'}</p>
                                    <p>• In-App Notifications: {notificationSettings.inAppNotifications ? '✅ Enabled' : '❌ Disabled'}</p>
                                    <p>• Sound Notifications: {notificationSettings.soundEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
                                </div>
                            </div>
                            <NotificationSettingsDialog
                                settings={notificationSettings}
                                onSettingsChange={(settings) => {
                                    setNotificationSettings(settings)
                                    localStorage.setItem('messageNotificationSettings', JSON.stringify(settings))
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Test Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* In-App Notification Test */}
                    <Card className="border-2 hover:border-blue-500 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-blue-500" />
                                In-App Notification
                            </CardTitle>
                            <CardDescription>
                                Beautiful animated popup in the top-right corner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={testInAppNotification}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                                Test In-App
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Browser Notification Test */}
                    <Card className="border-2 hover:border-purple-500 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="h-5 w-5 text-purple-500" />
                                Browser Notification
                            </CardTitle>
                            <CardDescription>
                                Native OS notification (requires permission)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={testBrowserNotification}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                            >
                                Test Browser
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Sound Notification Test */}
                    <Card className="border-2 hover:border-pink-500 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Volume2 className="h-5 w-5 text-pink-500" />
                                Sound Notification
                            </CardTitle>
                            <CardDescription>
                                Play notification sound alert
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={testSound}
                                className="w-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700"
                            >
                                Test Sound
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Features List */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>✨ Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-blue-600 dark:text-blue-400">Browser Notifications</h3>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• Native OS notifications</li>
                                    <li>• Works when tab is inactive</li>
                                    <li>• Clickable to open conversation</li>
                                    <li>• Shows sender avatar & preview</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-purple-600 dark:text-purple-400">In-App Notifications</h3>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• Smooth animations</li>
                                    <li>• Quick reply button</li>
                                    <li>• Auto-dismiss after 5s</li>
                                    <li>• Beautiful gradient design</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-pink-600 dark:text-pink-400">Sound Alerts</h3>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• Subtle notification sound</li>
                                    <li>• Adjustable volume</li>
                                    <li>• Toggle on/off in settings</li>
                                    <li>• Respects browser policies</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-green-600 dark:text-green-400">Smart Logic</h3>
                                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• Only for messages from others</li>
                                    <li>• Respects page visibility</li>
                                    <li>• Settings persist locally</li>
                                    <li>• Graceful fallbacks</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Instructions */}
                <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                    <CardHeader>
                        <CardTitle className="text-blue-700 dark:text-blue-300">💡 How to Test</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-blue-600 dark:text-blue-400 space-y-2">
                        <p><strong>1. In-App Notifications:</strong> Click "Test In-App" to see a notification popup in the top-right corner.</p>
                        <p><strong>2. Browser Notifications:</strong> First enable them in settings, then click "Test Browser". You may need to allow permissions.</p>
                        <p><strong>3. Sound Notifications:</strong> Click "Test Sound" to hear the notification sound (make sure your volume is on).</p>
                        <p><strong>4. Settings:</strong> Click the bell icon in the settings card to customize your preferences.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
