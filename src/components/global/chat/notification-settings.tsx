'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react'
import { getNotificationPermission, requestNotificationPermission } from '@/lib/notifications'
import { useToast } from '@/components/ui/use-toast'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface NotificationSettings {
    browserNotifications: boolean
    soundEnabled: boolean
    inAppNotifications: boolean
}

interface NotificationSettingsProps {
    settings: NotificationSettings
    onSettingsChange: (settings: NotificationSettings) => void
}

export function NotificationSettingsDialog({ settings, onSettingsChange }: NotificationSettingsProps) {
    const [open, setOpen] = useState(false)
    const [permissionState, setPermissionState] = useState({ granted: false, denied: false, default: true })
    const { toast } = useToast()

    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            setPermissionState(getNotificationPermission())
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && open) {
            setPermissionState(getNotificationPermission())
        }
    }, [open])

    const handleRequestPermission = async () => {
        const result = await requestNotificationPermission()
        setPermissionState(result)

        if (result.granted) {
            onSettingsChange({ ...settings, browserNotifications: true })
            toast({
                title: 'Notifications Enabled',
                description: 'You will now receive browser notifications for new messages.',
            })
        } else if (result.denied) {
            toast({
                variant: 'destructive',
                title: 'Permission Denied',
                description: 'Please enable notifications in your browser settings.',
            })
        }
    }

    const handleToggleBrowserNotifications = async (enabled: boolean) => {
        if (enabled && !permissionState.granted) {
            await handleRequestPermission()
        } else {
            onSettingsChange({ ...settings, browserNotifications: enabled })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    {settings.browserNotifications || settings.inAppNotifications ? (
                        <Bell className="h-4 w-4" />
                    ) : (
                        <BellOff className="h-4 w-4" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        Notification Settings
                    </DialogTitle>
                    <DialogDescription>
                        Customize how you receive message notifications
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Browser Notifications */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="browser-notifications" className="text-sm font-semibold">
                                    Browser Notifications
                                </Label>
                                <p className="text-xs text-gray-500">
                                    Receive notifications even when the tab is not active
                                </p>
                            </div>
                            <Switch
                                id="browser-notifications"
                                checked={settings.browserNotifications && permissionState.granted}
                                onCheckedChange={handleToggleBrowserNotifications}
                                disabled={permissionState.denied}
                            />
                        </div>

                        {permissionState.denied && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30">
                                <p className="text-xs text-red-700 dark:text-red-400">
                                    Notifications are blocked. Please enable them in your browser settings.
                                </p>
                            </div>
                        )}

                        {permissionState.default && !settings.browserNotifications && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRequestPermission}
                                className="w-full"
                            >
                                <Bell className="h-3 w-3 mr-2" />
                                Enable Browser Notifications
                            </Button>
                        )}
                    </div>

                    {/* In-App Notifications */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="in-app-notifications" className="text-sm font-semibold">
                                In-App Notifications
                            </Label>
                            <p className="text-xs text-gray-500">
                                Show notification popups within the app
                            </p>
                        </div>
                        <Switch
                            id="in-app-notifications"
                            checked={settings.inAppNotifications}
                            onCheckedChange={(enabled) =>
                                onSettingsChange({ ...settings, inAppNotifications: enabled })
                            }
                        />
                    </div>

                    {/* Sound Notifications */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="sound-notifications" className="text-sm font-semibold flex items-center gap-2">
                                {settings.soundEnabled ? (
                                    <Volume2 className="h-4 w-4 text-blue-500" />
                                ) : (
                                    <VolumeX className="h-4 w-4 text-gray-400" />
                                )}
                                Sound Notifications
                            </Label>
                            <p className="text-xs text-gray-500">
                                Play a sound when you receive a new message
                            </p>
                        </div>
                        <Switch
                            id="sound-notifications"
                            checked={settings.soundEnabled}
                            onCheckedChange={(enabled) =>
                                onSettingsChange({ ...settings, soundEnabled: enabled })
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => setOpen(false)}>Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
