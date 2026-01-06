# Message Notification System

## Overview
This comprehensive notification system provides real-time message notifications with multiple delivery methods:
- **Browser Push Notifications**: Native OS notifications even when the tab is not active
- **In-App Notifications**: Beautiful animated popups within the application
- **Sound Notifications**: Audio alerts for new messages

## Features

### 1. Browser Push Notifications
- Native browser notifications that appear even when the tab is in the background
- Clickable notifications that bring you directly to the conversation
- Customizable with sender avatar and message preview
- Requires user permission (requested through settings dialog)

### 2. In-App Notifications
- Elegant animated notification cards that appear in the top-right corner
- Shows sender avatar, name, message preview, and timestamp
- Quick reply button to respond directly from the notification
- Auto-dismisses after 5 seconds or can be manually dismissed
- Smooth animations using Framer Motion

### 3. Sound Notifications
- Plays a subtle notification sound when receiving messages
- Can be toggled on/off in settings
- Only plays for messages from other users (not your own)

### 4. Notification Settings
- Centralized settings dialog accessible from the chat sidebar
- Toggle browser notifications, in-app notifications, and sounds independently
- Settings persist across sessions using localStorage
- Visual feedback for permission states (granted, denied, default)

## How It Works

### Permission Flow
1. User opens notification settings dialog
2. Clicks "Enable Browser Notifications" button
3. Browser prompts for notification permission
4. If granted, browser notifications are enabled automatically
5. Settings are saved to localStorage

### Notification Triggers
Notifications are triggered when:
- A new message is received in real-time via Supabase
- The message is from another user (not yourself)
- The notification settings allow for that type of notification

### Smart Notification Logic
- **Browser notifications**: Only shown when the page is not visible (tab in background)
- **In-app notifications**: Only shown when not actively viewing the conversation
- **Sound notifications**: Play regardless of page visibility (if enabled)

## Components

### 1. `message-notification.tsx`
Contains two main components:
- `MessageNotification`: Single notification card with animations
- `NotificationQueue`: Manages multiple notifications (currently shows most recent)

### 2. `notification-settings.tsx`
- `NotificationSettingsDialog`: Settings UI for managing notification preferences
- Handles permission requests
- Persists settings to localStorage

### 3. `notifications.ts` (Utility Library)
Core notification utilities:
- `requestNotificationPermission()`: Request browser notification permission
- `getNotificationPermission()`: Check current permission state
- `showMessageNotification()`: Display a browser notification
- `playNotificationSound()`: Play notification sound
- `isPageVisible()`: Check if page is currently visible
- `isInConversation()`: Check if user is in a specific conversation

## Usage

### In Messages Page
The notification system is integrated into the messages page:

```typescript
// Notification state
const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([])
const [notificationSettings, setNotificationSettings] = useState({
  browserNotifications: false,
  soundEnabled: true,
  inAppNotifications: true
})

// When a new message arrives (in realtime subscription)
if (m.senderId !== user?.id) {
  // Play sound if enabled
  if (notificationSettings.soundEnabled) {
    playNotificationSound(0.5)
  }

  // Show in-app notification if enabled
  if (notificationSettings.inAppNotifications) {
    const notification: InAppNotification = {
      id: m.id,
      conversationId: selectedConversationId,
      senderName: senderUser?.name || 'Unknown',
      senderAvatar: senderUser?.avatarUrl,
      messageText: m.content,
      timestamp: new Date().toLocaleTimeString()
    }
    setInAppNotifications(prev => [...prev, notification])
  }

  // Show browser notification if enabled and page not visible
  if (notificationSettings.browserNotifications && document.visibilityState !== 'visible') {
    showMessageNotification(messageData)
  }
}
```

### Notification Queue Component
```typescript
<NotificationQueue
  notifications={inAppNotifications}
  onClose={(id) => setInAppNotifications(prev => prev.filter(n => n.id !== id))}
  onReply={(conversationId) => {
    setSelectedConversationId(conversationId)
    setInAppNotifications([])
  }}
/>
```

### Settings Dialog
```typescript
<NotificationSettingsDialog
  settings={notificationSettings}
  onSettingsChange={handleNotificationSettingsChange}
/>
```

## Browser Compatibility

### Supported Browsers
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (macOS 10.14+, iOS 16.4+)
- Opera: Full support

### Notification API Support
The system gracefully handles browsers that don't support notifications:
- Checks for `Notification` API availability
- Falls back to in-app notifications only
- Shows appropriate messaging in settings dialog

## Customization

### Notification Sound
To change the notification sound, replace the base64 audio data in `playNotificationSound()`:
```typescript
const audio = new Audio('data:audio/wav;base64,YOUR_BASE64_AUDIO_HERE')
```

### Notification Duration
To change how long in-app notifications stay visible, modify the timeout in `message-notification.tsx`:
```typescript
// Auto-dismiss after 5 seconds (change 5000 to desired milliseconds)
const timer = setTimeout(() => {
  handleClose()
}, 5000)
```

### Notification Styling
The notification card uses Tailwind CSS classes and can be customized in `message-notification.tsx`:
- Background: `bg-white dark:bg-gray-900`
- Border: `border border-gray-200 dark:border-gray-800`
- Shadow: `shadow-2xl`
- Gradient header: `bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500`

## Security & Privacy

### Permission Handling
- Notifications require explicit user permission
- Permission state is checked before showing notifications
- Users can revoke permission at any time through browser settings

### Data Privacy
- Notification content is only shown to the intended recipient
- No notification data is stored externally
- Settings are stored locally in the user's browser

## Troubleshooting

### Notifications Not Showing
1. **Check browser permissions**: Ensure notifications are allowed in browser settings
2. **Check notification settings**: Open the settings dialog and verify settings are enabled
3. **Check browser compatibility**: Ensure your browser supports the Notification API
4. **Check page visibility**: Browser notifications only show when page is not visible

### Sound Not Playing
1. **Check settings**: Ensure sound notifications are enabled
2. **Check browser autoplay policy**: Some browsers block audio without user interaction
3. **Check volume**: Ensure system and browser volume are not muted

### In-App Notifications Not Appearing
1. **Check settings**: Ensure in-app notifications are enabled
2. **Check conversation state**: Notifications don't show for the currently active conversation
3. **Check console**: Look for any JavaScript errors

## Future Enhancements

Potential improvements for the notification system:
- [ ] Notification grouping (combine multiple messages from same sender)
- [ ] Custom notification sounds per conversation
- [ ] Do Not Disturb mode with scheduled quiet hours
- [ ] Notification badges on browser tab
- [ ] Desktop notification actions (reply directly from notification)
- [ ] Push notifications via service worker (for offline support)
- [ ] Notification history/log
- [ ] Per-conversation notification settings

## API Reference

### NotificationQueue Props
```typescript
interface NotificationQueueProps {
  notifications: InAppNotification[]
  onClose: (id: string) => void
  onReply: (conversationId: string) => void
}
```

### NotificationSettingsDialog Props
```typescript
interface NotificationSettingsProps {
  settings: NotificationSettings
  onSettingsChange: (settings: NotificationSettings) => void
}

interface NotificationSettings {
  browserNotifications: boolean
  soundEnabled: boolean
  inAppNotifications: boolean
}
```

### InAppNotification Interface
```typescript
interface InAppNotification {
  id: string
  conversationId: string
  senderName: string
  senderAvatar?: string
  messageText: string
  timestamp: string
  onReply?: () => void
  onDismiss?: () => void
}
```

## Credits
Built with:
- React & Next.js
- Framer Motion for animations
- Radix UI for accessible components
- Tailwind CSS for styling
- Browser Notification API
