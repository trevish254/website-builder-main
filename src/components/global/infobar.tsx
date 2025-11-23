'use client'
import { NotificationWithUser } from '@/lib/types'
import UserButton from '@/components/global/user-button'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Bell } from 'lucide-react'
import { Role } from '@prisma/client'
import { Card } from '../ui/card'
import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ModeToggle } from './mode-toggle'
import { useSidebar } from '@/providers/sidebar-provider'

type Props = {
  notifications: NotificationWithUser | []
  role?: Role
  className?: string
  subAccountId?: string
}

const InfoBar = ({ notifications, subAccountId, className, role }: Props) => {
  // Ensure notifications is always an array
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  const [allNotifications, setAllNotifications] = useState(safeNotifications)
  const [showAll, setShowAll] = useState(true)
  const { isCollapsed } = useSidebar()

  // Count notifications
  const notificationCount = allNotifications?.length || 0
  const hasNotifications = notificationCount > 0

  const handleClick = () => {
    if (!showAll) {
      setAllNotifications(safeNotifications)
    } else {
      if (safeNotifications?.length !== 0) {
        setAllNotifications(
          safeNotifications?.filter((item) => item.subAccountId === subAccountId) ??
          []
        )
      }
    }
    setShowAll((prev) => !prev)
  }

  return (
    <>
      <div
        className={twMerge(
          'fixed z-[20] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px] ',
          isCollapsed ? 'md:left-[70px]' : 'md:left-[300px]',
          className
        )}
      >
        <div className="flex items-center gap-2 ml-auto">
          <UserButton />
          <Sheet>
            <SheetTrigger>
              <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white relative">
                <Bell size={17} />
                {hasNotifications && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll">
              <SheetHeader className="text-left">
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  You have {notificationCount} notification{notificationCount !== 1 ? 's' : ''}
                </SheetDescription>
                {(role === 'AGENCY_ADMIN' || role === 'AGENCY_OWNER') && subAccountId && (
                  <Card className="flex items-center justify-between p-4 mt-4">
                    <span className="text-sm font-medium">Show only current subaccount</span>
                    <Switch checked={!showAll} onCheckedChange={handleClick} />
                  </Card>
                )}
              </SheetHeader>
              <div className="mt-4 space-y-3">
                {allNotifications?.map((notification) => {
                  // Safely handle notification data
                  const user = notification?.User
                  const userName = user?.name || 'User'
                  const userAvatar = user?.avatarUrl
                  const notificationText = notification?.notification || ''
                  const createdAt = notification?.createdAt ? new Date(notification.createdAt) : new Date()

                  return (
                    <div
                      key={notification?.id || Math.random()}
                      className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={userAvatar}
                          alt="Profile Picture"
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm leading-relaxed break-words">
                          {notificationText.split('|').map((part, index) => {
                            if (index === 0 || index === 2) {
                              return (
                                <span key={index} className="font-semibold">
                                  {part}
                                </span>
                              )
                            }
                            return (
                              <span key={index} className="text-muted-foreground">
                                {part}
                              </span>
                            )
                          })}
                        </p>
                        <small className="text-xs text-muted-foreground mt-1">
                          {createdAt.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </small>
                      </div>
                    </div>
                  )
                })}
              </div>
              {allNotifications?.length === 0 && (
                <div className="flex items-center justify-center text-muted-foreground py-8">
                  You have no notifications
                </div>
              )}
            </SheetContent>
          </Sheet>
          <ModeToggle />
        </div>
      </div>
    </>
  )
}

export default InfoBar
