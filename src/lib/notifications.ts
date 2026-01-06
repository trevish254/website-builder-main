/**
 * Notification System for Messages
 * Handles both in-app and browser push notifications
 */

export interface NotificationPermissionState {
    granted: boolean
    denied: boolean
    default: boolean
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications')
        return { granted: false, denied: true, default: false }
    }

    const permission = await Notification.requestPermission()

    return {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default'
    }
}

/**
 * Check current notification permission status
 */
export function getNotificationPermission(): NotificationPermissionState {
    if (!('Notification' in window)) {
        return { granted: false, denied: true, default: false }
    }

    const permission = Notification.permission

    return {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default'
    }
}

export interface MessageNotificationData {
    conversationId: string
    messageId: string
    senderName: string
    senderAvatar?: string
    messageText: string
    timestamp: string
}

/**
 * Show a browser notification for a new message
 */
export function showMessageNotification(data: MessageNotificationData): Notification | null {
    const permission = getNotificationPermission()

    if (!permission.granted) {
        console.log('Notification permission not granted')
        return null
    }

    const notification = new Notification(`New message from ${data.senderName}`, {
        body: data.messageText,
        icon: data.senderAvatar || '/favicon.ico',
        badge: '/favicon.ico',
        tag: `message-${data.conversationId}`, // Prevents duplicate notifications
        requireInteraction: false,
        silent: false,
        data: {
            conversationId: data.conversationId,
            messageId: data.messageId,
            url: window.location.origin + window.location.pathname
        }
    })

    // Handle notification click
    notification.onclick = (event) => {
        event.preventDefault()
        window.focus()

        // Trigger custom event to open the conversation
        window.dispatchEvent(new CustomEvent('notification-click', {
            detail: {
                conversationId: data.conversationId,
                messageId: data.messageId
            }
        }))

        notification.close()
    }

    return notification
}

/**
 * Play notification sound
 */
export function playNotificationSound(volume: number = 0.5) {
    try {
        // Simple notification sound (base64 encoded WAV)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE')
        audio.volume = volume
        audio.play().catch(e => console.log('Audio play failed:', e))
    } catch (error) {
        console.error('Failed to play notification sound:', error)
    }
}

/**
 * Check if the page is currently visible/focused
 */
export function isPageVisible(): boolean {
    return document.visibilityState === 'visible'
}

/**
 * Check if user is currently in the specific conversation
 */
export function isInConversation(conversationId: string, currentConversationId: string | null): boolean {
    return conversationId === currentConversationId && isPageVisible()
}
